import { useEffect, useState } from 'react';
import { apiUrl, getJson } from '../lib/api';

type Status = 'loading' | 'ok' | 'error';

interface HealthState {
  api: Status;
  db: Status;
  apiMessage: string;
  dbMessage: string;
}

const initial: HealthState = {
  api: 'loading',
  db: 'loading',
  apiMessage: 'checking…',
  dbMessage: 'checking…',
};

export default function HealthPage() {
  const [state, setState] = useState<HealthState>(initial);

  useEffect(() => {
    let cancelled = false;

    async function check() {
      const [apiRes, dbRes] = await Promise.all([
        getJson<{ status: string }>('/api/health'),
        getJson<{ db: string }>('/api/health/db'),
      ]);

      if (cancelled) return;

      setState({
        api: apiRes.ok ? 'ok' : 'error',
        db: dbRes.ok ? 'ok' : 'error',
        apiMessage: apiRes.ok ? 'ok' : apiRes.error,
        dbMessage: dbRes.ok ? 'ok' : dbRes.error,
      });
    }

    void check();
    return () => {
      cancelled = true;
    };
  }, []);

  const everythingOk = state.api === 'ok' && state.db === 'ok';

  return (
    <div className="min-h-full flex items-center justify-center p-6">
      <div className="w-full max-w-xl rounded-2xl bg-white shadow-sm border border-slate-200 p-8">
        <div className="flex items-center gap-3">
          <div
            className={`h-3 w-3 rounded-full ${
              everythingOk ? 'bg-emerald-500' : state.api === 'error' || state.db === 'error' ? 'bg-rose-500' : 'bg-amber-400'
            }`}
          />
          <h1 className="text-2xl font-semibold">AXLE 2.0 — Foundation</h1>
        </div>
        <p className="mt-2 text-sm text-slate-600">
          Phase 0 health check. Browser → React → Express → MySQL.
        </p>

        <dl className="mt-6 divide-y divide-slate-200 text-sm">
          <Row label="API" status={state.api} message={state.apiMessage} />
          <Row label="Database" status={state.db} message={state.dbMessage} />
        </dl>

        <div className="mt-6 text-xs text-slate-500">
          API URL: <code className="font-mono">{apiUrl}</code>
        </div>
      </div>
    </div>
  );
}

function Row({ label, status, message }: { label: string; status: Status; message: string }) {
  const tone =
    status === 'ok'
      ? 'text-emerald-700 bg-emerald-50 border-emerald-200'
      : status === 'error'
        ? 'text-rose-700 bg-rose-50 border-rose-200'
        : 'text-amber-700 bg-amber-50 border-amber-200';
  const dot =
    status === 'ok' ? 'bg-emerald-500' : status === 'error' ? 'bg-rose-500' : 'bg-amber-400';
  return (
    <div className="flex items-center justify-between py-3">
      <div>
        <div className="font-medium text-slate-800">{label}</div>
        <div className="text-xs text-slate-500">{message}</div>
      </div>
      <span className={`inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs font-medium ${tone}`}>
        <span className={`h-2 w-2 rounded-full ${dot}`} />
        {status}
      </span>
    </div>
  );
}
