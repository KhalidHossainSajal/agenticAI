import type { Request, Response, NextFunction } from 'express';
import { verifyToken, type JwtPayload } from '../services/jwt';
import { isRevoked } from '../services/tokenBlacklist';
import { HttpError } from './error';

export interface AuthedRequest extends Request {
  user?: JwtPayload;
}

function extractToken(req: Request): string | null {
  const header = req.header('authorization') ?? req.header('Authorization');
  if (!header) return null;
  const [scheme, value] = header.split(' ');
  if (scheme?.toLowerCase() !== 'bearer' || !value) return null;
  return value.trim();
}

export function requireAuth(req: AuthedRequest, _res: Response, next: NextFunction): void {
  const token = extractToken(req);
  if (!token) {
    next(new HttpError(401, 'UNAUTHENTICATED', 'Authentication required'));
    return;
  }

  let payload: JwtPayload;
  try {
    payload = verifyToken(token);
  } catch {
    next(new HttpError(401, 'INVALID_TOKEN', 'Invalid or expired token'));
    return;
  }

  if (payload.jti && isRevoked(payload.jti)) {
    next(new HttpError(401, 'TOKEN_REVOKED', 'Token has been revoked'));
    return;
  }

  req.user = payload;
  next();
}
