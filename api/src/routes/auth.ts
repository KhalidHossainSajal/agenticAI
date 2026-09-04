import { Router } from 'express';
import { z } from 'zod';
import argon2 from 'argon2';
import { validate, getValid } from '../middleware/validate';
import { requireAuth, type AuthedRequest } from '../middleware/auth';
import { HttpError } from '../middleware/error';
import { createUser, findUserByEmail, findUserById, newJti, toPublicUser } from '../repositories/users';
import { signToken } from '../services/jwt';
import { revoke } from '../services/tokenBlacklist';

const router = Router();

const RegisterSchema = z.object({
  email: z.string().email().max(255).transform((s) => s.toLowerCase().trim()),
  password: z.string().min(8, 'password must be at least 8 characters').max(200),
  name: z.string().min(1).max(255).transform((s) => s.trim()),
});
type RegisterBody = z.infer<typeof RegisterSchema>;

const LoginSchema = z.object({
  email: z.string().email().max(255).transform((s) => s.toLowerCase().trim()),
  password: z.string().min(1).max(200),
});
type LoginBody = z.infer<typeof LoginSchema>;

router.post(
  '/register',
  validate('body', RegisterSchema),
  async (req, res, next) => {
    try {
      const body = getValid<RegisterBody>(req, 'body');
      const existing = await findUserByEmail(body.email);
      if (existing) {
        throw new HttpError(409, 'EMAIL_TAKEN', 'An account with that email already exists');
      }
      const passwordHash = await argon2.hash(body.password, {
        type: argon2.argon2id,
        memoryCost: 19_456,
        timeCost: 2,
        parallelism: 1,
      });
      const user = await createUser({
        email: body.email,
        passwordHash,
        name: body.name,
      });
      const jti = newJti();
      const token = signToken({ sub: String(user.id), email: user.email, jti });
      res.status(201).json({
        success: true,
        data: { token, user: toPublicUser(user) },
      });
    } catch (err) {
      next(err);
    }
  },
);

router.post(
  '/login',
  validate('body', LoginSchema),
  async (req, res, next) => {
    try {
      const body = getValid<LoginBody>(req, 'body');
      const user = await findUserByEmail(body.email);
      if (!user) {
        throw new HttpError(401, 'INVALID_CREDENTIALS', 'Invalid email or password');
      }
      const ok = await argon2.verify(user.password_hash, body.password);
      if (!ok) {
        throw new HttpError(401, 'INVALID_CREDENTIALS', 'Invalid email or password');
      }
      const jti = newJti();
      const token = signToken({ sub: String(user.id), email: user.email, jti });
      res.status(200).json({
        success: true,
        data: { token, user: toPublicUser(user) },
      });
    } catch (err) {
      next(err);
    }
  },
);

router.post('/logout', requireAuth, (req: AuthedRequest, res) => {
  if (req.user?.jti) revoke(req.user);
  res.status(200).json({ success: true, data: { loggedOut: true } });
});

router.get('/me', requireAuth, async (req: AuthedRequest, res, next) => {
  try {
    const userId = Number(req.user!.sub);
    const user = await findUserById(userId);
    if (!user) {
      throw new HttpError(404, 'USER_NOT_FOUND', 'User not found');
    }
    res.status(200).json({ success: true, data: { user: toPublicUser(user) } });
  } catch (err) {
    next(err);
  }
});

export default router;
