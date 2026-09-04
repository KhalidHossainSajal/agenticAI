import type { JwtPayload } from './jwt';

interface Entry {
  expiresAt: number;
}

const store = new Map<string, Entry>();

function gc(now: number): void {
  for (const [jti, entry] of store) {
    if (entry.expiresAt <= now) {
      store.delete(jti);
    }
  }
}

export function isRevoked(jti: string): boolean {
  gc(Math.floor(Date.now() / 1000));
  return store.has(jti);
}

export function revoke(payload: JwtPayload): void {
  if (!payload.jti || !payload.exp) return;
  store.set(payload.jti, { expiresAt: payload.exp });
}
