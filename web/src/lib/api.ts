const API_URL: string =
  (import.meta.env.VITE_API_URL as string | undefined) ?? 'http://localhost:3000';

export type ApiResult<T> = { ok: true; data: T } | { ok: false; error: string };

export async function getJson<T>(path: string): Promise<ApiResult<T>> {
  try {
    const res = await fetch(`${API_URL}${path}`, { headers: { Accept: 'application/json' } });
    const body = (await res.json().catch(() => ({}))) as unknown;
    if (!res.ok) {
      const message =
        typeof body === 'object' && body !== null && 'error' in body
          ? String((body as { error: { message?: string } }).error?.message ?? res.statusText)
          : res.statusText;
      return { ok: false, error: message };
    }
    return { ok: true, data: body as T };
  } catch (err) {
    return { ok: false, error: err instanceof Error ? err.message : 'network error' };
  }
}

export const apiUrl = API_URL;
