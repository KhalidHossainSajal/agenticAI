import { FormEvent, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../lib/auth';
import { AuthShell, Field } from './LoginPage';

export default function RegisterPage(): JSX.Element {
  const { register } = useAuth();
  const navigate = useNavigate();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    if (password.length < 8) {
      setError('Password must be at least 8 characters.');
      return;
    }
    setBusy(true);
    const res = await register(email.trim(), password, name.trim());
    setBusy(false);
    if (!res.ok) {
      setError(res.error);
      return;
    }
    navigate('/dashboard', { replace: true });
  }

  return (
    <AuthShell title="Create your account" subtitle="One account, many businesses.">
      <form onSubmit={onSubmit} className="space-y-4">
        <Field label="Name">
          <input
            type="text"
            required
            maxLength={255}
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="axle-input"
          />
        </Field>
        <Field label="Email">
          <input
            type="email"
            required
            autoComplete="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="axle-input"
          />
        </Field>
        <Field label="Password">
          <input
            type="password"
            required
            minLength={8}
            autoComplete="new-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="axle-input"
          />
        </Field>
        {error && <p className="text-sm text-rose-600">{error}</p>}
        <button type="submit" disabled={busy} className="axle-btn-primary w-full">
          {busy ? 'Creating…' : 'Create account'}
        </button>
      </form>
      <p className="mt-4 text-sm text-slate-600">
        Already have an account?{' '}
        <Link to="/login" className="text-indigo-600 hover:underline">
          Sign in
        </Link>
      </p>
    </AuthShell>
  );
}
