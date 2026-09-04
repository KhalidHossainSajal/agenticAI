import jwt from 'jsonwebtoken';
import { env } from '../config/env';

export interface JwtPayload {
  sub: string;
  email: string;
  iat?: number;
  exp?: number;
  jti?: string;
}

const EXPIRES_IN = '7d';
const ALG = 'HS256' as const;

export function signToken(payload: { sub: string; email: string; jti: string }): string {
  return jwt.sign(payload, env.JWT_SECRET, {
    algorithm: ALG,
    expiresIn: EXPIRES_IN,
  });
}

export function verifyToken(token: string): JwtPayload {
  const decoded = jwt.verify(token, env.JWT_SECRET, { algorithms: [ALG] });
  if (typeof decoded === 'string' || !decoded.sub) {
    throw new Error('invalid token payload');
  }
  return decoded as JwtPayload;
}
