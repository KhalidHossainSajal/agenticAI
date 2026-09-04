import { FormEvent, useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '../lib/auth';
import { getJson, patchJson } from '../lib/api';
import type { Member, PublicBusiness } from '../lib/business';

export default function BusinessPage(): JSX.Element {
  const { id } = useParams<{ id: string }>();
  const businessId = Number(id);
  const { token, logout } = useAuth();
  const navigate = useNavigate();

  const [business, setBusiness] = useState<PublicBusiness | null>(null);
  const [members, setMembers] = useState<Member[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [editing, setEditing] = useState(false);
  const [name, setName] = useState('');
  const [busy, setBusy] = useState(false);

  async function refresh() {
    if (!token || !Number.isInteger(businessId) || businessId <= 0) return;
    setError(null);
    const [bRes, mRes] = await Promise.all([
      getJson<{ business: PublicBusiness }>(`/api/businesses/${businessId}`, token),
      getJson<{ members: Member[] }>(`/api/businesses/${businessId}/members`, token),
    ]);
    if (!bRes.ok) {
      setError(bRes.error);
      return;
    }
    setBusiness(bRes.data.business);
    setName(bRes.data.business.name);
    if (mRes.ok) setMembers(mRes.data.members);
  }

  useEffect(() => {
    void refresh();
  }, [token, businessId]);

  async function onSave(e: FormEvent) {
    e.preventDefault();
    if (!token) return;
    setBusy(true);
    const res = await patchJson<{ business: PublicBusiness }>(
      `/api/businesses/${businessId}`,
      { name: name.trim() },
      token,
    );
    setBusy(false);
    if (!res.ok) {
      setError(res.error);
      return;
    }
    setBusiness(res.data.business);
    setEditing(false);
  }

  if (error) {
    return (
      <Center>
        <div className="rounded-2xl bg-white border border-rose-200 p-6 max-w-md">
          <h1 className="text-lg font-semibold text-rose-700">Cannot open business</h1>
          <p className="mt-2 text-sm text-slate-600">{error}</p>
          <div className="mt-4 flex gap-2">
            <Link to="/dashboard" className="axle-btn-secondary">
              Back to dashboard
            </Link>
            <button
              className="axle-btn-secondary"
              onClick={async () => {
                await logout();
                navigate('/login', { replace: true });
              }}
            >
              Sign out
            </button>
          </div>
        </div>
      </Center>
    );
  }

  if (!business) {
    return (
      <Center>
        <p className="text-sm text-slate-500">Loading business…</p>
      </Center>
    );
  }

  const canEdit = business.role === 'owner';

  return (
    <div className="min-h-full p-6">
      <div className="max-w-3xl mx-auto">
        <div className="mb-4">
          <Link to="/dashboard" className="text-sm text-indigo-600 hover:underline">
            ← Dashboard
          </Link>
        </div>

        <section className="rounded-2xl bg-white border border-slate-200 p-6 mb-6">
          <div className="flex items-start justify-between">
            <div>
              <h1 className="text-2xl font-semibold">{business.name}</h1>
              <p className="text-sm text-slate-500">
                {business.slug} · role: {business.role}
              </p>
            </div>
            {canEdit && !editing && (
              <button onClick={() => setEditing(true)} className="axle-btn-secondary">
                Edit
              </button>
            )}
          </div>

          {editing ? (
            <form onSubmit={onSave} className="mt-4 flex gap-2">
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="axle-input flex-1"
              />
              <button type="submit" disabled={busy} className="axle-btn-primary">
                {busy ? 'Saving…' : 'Save'}
              </button>
              <button
                type="button"
                onClick={() => {
                  setEditing(false);
                  setName(business.name);
                }}
                className="axle-btn-secondary"
              >
                Cancel
              </button>
            </form>
          ) : (
            <p className="mt-2 text-sm text-slate-600">
              Future phases will add AI providers, agents, knowledge, and conversations here.
            </p>
          )}
        </section>

        <section className="rounded-2xl bg-white border border-slate-200 p-6">
          <h2 className="text-lg font-semibold mb-2">Members</h2>
          {members.length === 0 ? (
            <p className="text-sm text-slate-500">No members.</p>
          ) : (
            <ul className="divide-y divide-slate-200">
              {members.map((m) => (
                <li key={m.id} className="py-3 flex items-center justify-between">
                  <div>
                    <div className="font-medium text-slate-800">{m.name}</div>
                    <div className="text-xs text-slate-500">{m.email}</div>
                  </div>
                  <span className="text-xs uppercase tracking-wide text-slate-500">
                    {m.role}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>
    </div>
  );
}

function Center({ children }: { children: React.ReactNode }): JSX.Element {
  return <div className="min-h-full flex items-center justify-center p-6">{children}</div>;
}
