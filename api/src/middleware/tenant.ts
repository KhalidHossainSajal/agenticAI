import type { Response, NextFunction } from 'express';
import { getPool } from '../db/pool';
import { HttpError } from '../middleware/error';
import type { AuthedRequest } from './auth';

export type BusinessRole = 'owner' | 'admin' | 'member';

export interface BusinessContext {
  id: number;
  role: BusinessRole;
}

function parseBusinessId(raw: string | number | undefined): number {
  if (raw === undefined) {
    throw new HttpError(400, 'VALIDATION_ERROR', 'business id is required');
  }
  const n = Number(raw);
  if (!Number.isInteger(n) || n <= 0) {
    throw new HttpError(400, 'VALIDATION_ERROR', 'business id must be a positive integer');
  }
  return n;
}

export async function requireBusinessAccess(
  req: AuthedRequest,
  _res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    if (!req.user) {
      throw new HttpError(401, 'UNAUTHENTICATED', 'Authentication required');
    }
    const businessId = parseBusinessId(req.params.id);
    const userId = Number(req.user.sub);

    const [rows] = await getPool().query<import('mysql2').RowDataPacket[]>(
      'SELECT role FROM business_members WHERE business_id = ? AND user_id = ? LIMIT 1',
      [businessId, userId],
    );

    const row = rows[0];
    if (!row) {
      throw new HttpError(403, 'FORBIDDEN', 'You do not have access to this business');
    }

    (req as AuthedRequest & { business?: BusinessContext }).business = {
      id: businessId,
      role: row.role as BusinessRole,
    };
    next();
  } catch (err) {
    next(err);
  }
}

export function requireBusinessRole(...allowed: BusinessRole[]) {
  return (req: AuthedRequest, _res: Response, next: NextFunction): void => {
    const ctx = (req as AuthedRequest & { business?: BusinessContext }).business;
    if (!ctx) {
      next(new HttpError(500, 'TENANT_CONTEXT_MISSING', 'Tenant context was not established'));
      return;
    }
    if (!allowed.includes(ctx.role)) {
      next(new HttpError(403, 'FORBIDDEN', 'Insufficient role for this action'));
      return;
    }
    next();
  };
}
