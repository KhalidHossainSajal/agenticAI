const API_URL: string =
  (import.meta.env.VITE_API_URL as string | undefined) ?? 'http://localhost:3000';

export type ApiResult<T> = { ok: true; data: T } | { ok: false; error: string };

export class ApiError extends Error {
  public readonly status: number;
  public readonly code: string;
  constructor(status: number, code: string, message: string) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.code = code;
  }
}

export async function getJson<T>(path: string, token?: string): Promise<ApiResult<T>> {
  return request<T>('GET', path, undefined, token);
}

export async function postJson<T>(path: string, body: unknown, token?: string): Promise<ApiResult<T>> {
  return request<T>('POST', path, body, token);
}

export async function patchJson<T>(path: string, body: unknown, token?: string): Promise<ApiResult<T>> {
  return request<T>('PATCH', path, body, token);
}

async function request<T>(
  method: string,
  path: string,
  body: unknown,
  token: string | undefined,
): Promise<ApiResult<T>> {
  try {
    const headers: Record<string, string> = { Accept: 'application/json' };
    if (body !== undefined) headers['Content-Type'] = 'application/json';
    if (token) headers['Authorization'] = `Bearer ${token}`;
    const res = await fetch(`${API_URL}${path}`, {
      method,
      headers,
      body: body === undefined ? undefined : JSON.stringify(body),
    });
    const raw = (await res.json().catch(() => ({}))) as unknown;
    if (!res.ok) {
      const errorBody = (raw as { error?: { code?: string; message?: string } })?.error;
      return {
        ok: false,
        error: errorBody?.message ?? res.statusText ?? 'request failed',
      };
    }
    return { ok: true, data: raw as T };
  } catch (err) {
    return { ok: false, error: err instanceof Error ? err.message : 'network error' };
  }
}

export const apiUrl = API_URL;
