import { FormEvent, useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../lib/auth';
import { getJson, postJson } from '../lib/api';
import type { PublicBusiness } from '../lib/business';

export default function DashboardPage(): JSX.Element {
  const { user, token, logout } = useAuth();
  const navigate = useNavigate();
  const [businesses, setBusinesses] = useState<PublicBusiness[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [name, setName] = useState('');
  const [busy, setBusy] = useState(false);

  async function refresh() {
    if (!token) return;
    setLoading(true);
    setError(null);
    const res = await getJson<{ businesses: PublicBusiness[] }>('/api/businesses', token);
    setLoading(false);
    if (!res.ok) {
      setError(res.error);
      return;
    }
    setBusinesses(res.data.businesses);
  }

  useEffect(() => {
    void refresh();
  }, [token]);

  async function onCreate(e: FormEvent) {
    e.preventDefault();
    if (!name.trim() || !token) return;
    setBusy(true);
    const res = await postJson<{ business: PublicBusiness }>(
      '/api/businesses',
      { name: name.trim() },
      token,
    );
    setBusy(false);
    if (!res.ok) {
      setError(res.error);
      return;
    }
    setName('');
    await refresh();
  }

  return (
    <div className="min-h-full p-6">
      <div className="max-w-3xl mx-auto">
        <header className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-semibold">Dashboard</h1>
            {user && <p className="text-sm text-slate-600">Signed in as {user.email}</p>}
          </div>
          <button
            onClick={async () => {
              await logout();
              navigate('/login', { replace: true });
            }}
            className="axle-btn-secondary"
          >
            Sign out
          </button>
        </header>

        <section className="rounded-2xl bg-white border border-slate-200 p-6 mb-6">
          <h2 className="text-lg font-semibold mb-2">Create a business</h2>
          <form onSubmit={onCreate} className="flex gap-2">
            <input
              type="text"
              required
              maxLength={255}
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Acme Coffee Roasters"
              className="axle-input flex-1"
            />
            <button type="submit" disabled={busy} className="axle-btn-primary">
              {busy ? 'Creating…' : 'Create'}
            </button>
          </form>
          {error && <p className="mt-2 text-sm text-rose-600">{error}</p>}
        </section>

        <section className="rounded-2xl bg-white border border-slate-200 p-6">
          <h2 className="text-lg font-semibold mb-2">Your businesses</h2>
          {loading ? (
            <p className="text-sm text-slate-500">Loading…</p>
          ) : businesses.length === 0 ? (
            <p className="text-sm text-slate-500">No businesses yet. Create one above.</p>
          ) : (
            <ul className="divide-y divide-slate-200">
              {businesses.map((b) => (
                <li key={b.id} className="py-3 flex items-center justify-between">
                  <div>
                    <Link
                      to={`/businesses/${b.id}`}
                      className="font-medium text-slate-800 hover:underline"
                    >
                      {b.name}
                    </Link>
                    <div className="text-xs text-slate-500">
                      {b.slug} · {b.role}
                    </div>
                  </div>
                  <Link
                    to={`/businesses/${b.id}`}
                    className="text-sm text-indigo-600 hover:underline"
                  >
                    Open
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>
    </div>
  );
}
