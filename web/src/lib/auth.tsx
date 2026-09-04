import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import { getJson, postJson } from './api';

export interface PublicUser {
  id: number;
  email: string;
  name: string;
  createdAt: string;
}

export interface AuthState {
  user: PublicUser | null;
  token: string | null;
  status: 'loading' | 'authed' | 'anon';
}

interface AuthContextValue extends AuthState {
  login: (email: string, password: string) => Promise<{ ok: true } | { ok: false; error: string }>;
  register: (
    email: string,
    password: string,
    name: string,
  ) => Promise<{ ok: true } | { ok: false; error: string }>;
  logout: () => Promise<void>;
}

const TOKEN_KEY = 'axle.token';
const USER_KEY = 'axle.user';

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }): JSX.Element {
  const [state, setState] = useState<AuthState>(() => {
    const token = localStorage.getItem(TOKEN_KEY);
    const userRaw = localStorage.getItem(USER_KEY);
    if (token && userRaw) {
      try {
        return { token, user: JSON.parse(userRaw) as PublicUser, status: 'authed' };
      } catch {
        localStorage.removeItem(TOKEN_KEY);
        localStorage.removeItem(USER_KEY);
      }
    }
    return { token: null, user: null, status: 'anon' };
  });

  // If we have a token, verify it against /api/auth/me on mount.
  useEffect(() => {
    if (state.status !== 'authed') return;
    let cancelled = false;
    void (async () => {
      const res = await getJson<{ user: PublicUser }>('/api/auth/me', state.token ?? undefined);
      if (cancelled) return;
      if (!res.ok) {
        localStorage.removeItem(TOKEN_KEY);
        localStorage.removeItem(USER_KEY);
        setState({ token: null, user: null, status: 'anon' });
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [state.status, state.token]);

  const login = useCallback(async (email: string, password: string) => {
    const res = await postJson<{ token: string; user: PublicUser }>('/api/auth/login', {
      email,
      password,
    });
    if (!res.ok) return { ok: false as const, error: res.error };
    localStorage.setItem(TOKEN_KEY, res.data.token);
    localStorage.setItem(USER_KEY, JSON.stringify(res.data.user));
    setState({ token: res.data.token, user: res.data.user, status: 'authed' });
    return { ok: true as const };
  }, []);

  const register = useCallback(async (email: string, password: string, name: string) => {
    const res = await postJson<{ token: string; user: PublicUser }>('/api/auth/register', {
      email,
      password,
      name,
    });
    if (!res.ok) return { ok: false as const, error: res.error };
    localStorage.setItem(TOKEN_KEY, res.data.token);
    localStorage.setItem(USER_KEY, JSON.stringify(res.data.user));
    setState({ token: res.data.token, user: res.data.user, status: 'authed' });
    return { ok: true as const };
  }, []);

  const logout = useCallback(async () => {
    if (state.token) {
      await postJson('/api/auth/logout', undefined, state.token);
    }
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
    setState({ token: null, user: null, status: 'anon' });
  }, [state.token]);

  const value = useMemo<AuthContextValue>(
    () => ({ ...state, login, register, logout }),
    [state, login, register, logout],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider');
  return ctx;
}
