import { Router } from 'express';
import { z } from 'zod';
import { validate, getValid } from '../middleware/validate';
import { requireAuth, type AuthedRequest } from '../middleware/auth';
import { requireBusinessAccess, requireBusinessRole, type BusinessRole } from '../middleware/tenant';
import { HttpError } from '../middleware/error';
import {
  addMember,
  createBusiness,
  findBusinessById,
  listBusinessesForUser,
  listMembers,
  toPublicBusiness,
  updateBusiness,
} from '../repositories/businesses';

const router = Router();

const CreateSchema = z.object({
  name: z.string().min(1).max(255).transform((s) => s.trim()),
});
type CreateBody = z.infer<typeof CreateSchema>;

const UpdateSchema = z.object({
  name: z.string().min(1).max(255).transform((s) => s.trim()),
});
type UpdateBody = z.infer<typeof UpdateSchema>;

const IdParam = z.object({ id: z.string().regex(/^\d+$/) });

router.use(requireAuth);

router.get('/', async (req: AuthedRequest, res, next) => {
  try {
    const userId = Number(req.user!.sub);
    const rows = await listBusinessesForUser(userId);
    res.status(200).json({
      success: true,
      data: { businesses: rows.map((r) => toPublicBusiness(r, r.role)) },
    });
  } catch (err) {
    next(err);
  }
});

router.post(
  '/',
  validate('body', CreateSchema),
  async (req: AuthedRequest, res, next) => {
    try {
      const body = getValid<CreateBody>(req, 'body');
      const userId = Number(req.user!.sub);
      const business = await createBusiness({ name: body.name, createdBy: userId });
      await addMember({ businessId: business.id, userId, role: 'owner' });
      res.status(201).json({
        success: true,
        data: { business: toPublicBusiness(business, 'owner') },
      });
    } catch (err) {
      next(err);
    }
  },
);

router.get(
  '/:id',
  validate('params', IdParam),
  requireBusinessAccess,
  async (req: AuthedRequest, res, next) => {
    try {
      const id = Number(req.params.id);
      const row = await findBusinessById(id);
      if (!row) throw new HttpError(404, 'BUSINESS_NOT_FOUND', 'Business not found');
      const role = (req as AuthedRequest & { business?: { role: BusinessRole } }).business!.role;
      res.status(200).json({ success: true, data: { business: toPublicBusiness(row, role) } });
    } catch (err) {
      next(err);
    }
  },
);

router.patch(
  '/:id',
  validate('params', IdParam),
  validate('body', UpdateSchema),
  requireBusinessAccess,
  requireBusinessRole('owner'),
  async (req: AuthedRequest, res, next) => {
    try {
      const id = Number(req.params.id);
      const body = getValid<UpdateBody>(req, 'body');
      const row = await updateBusiness(id, body.name);
      const role = (req as AuthedRequest & { business?: { role: BusinessRole } }).business!.role;
      res.status(200).json({ success: true, data: { business: toPublicBusiness(row, role) } });
    } catch (err) {
      next(err);
    }
  },
);

router.get(
  '/:id/members',
  validate('params', IdParam),
  requireBusinessAccess,
  async (req: AuthedRequest, res, next) => {
    try {
      const id = Number(req.params.id);
      const members = await listMembers(id);
      res.status(200).json({ success: true, data: { members } });
    } catch (err) {
      next(err);
    }
  },
);

export default router;
