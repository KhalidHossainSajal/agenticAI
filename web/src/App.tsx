import { Navigate, Route, Routes, useLocation } from 'react-router-dom';
import { AuthProvider, useAuth } from './lib/auth';
import HealthPage from './pages/HealthPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import DashboardPage from './pages/DashboardPage';
import BusinessPage from './pages/BusinessPage';

function Protected({ children }: { children: JSX.Element }): JSX.Element {
  const { status } = useAuth();
  const location = useLocation();
  if (status === 'loading') {
    return <div className="p-6 text-sm text-slate-500">Loading…</div>;
  }
  if (status === 'anon') {
    return <Navigate to="/login" replace state={{ from: location.pathname }} />;
  }
  return children;
}

function Routed(): JSX.Element {
  return (
    <Routes>
      <Route path="/" element={<HomeRoute />} />
      <Route path="/health" element={<HealthPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route
        path="/dashboard"
        element={
          <Protected>
            <DashboardPage />
          </Protected>
        }
      />
      <Route
        path="/businesses/:id"
        element={
          <Protected>
            <BusinessPage />
          </Protected>
        }
      />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

function HomeRoute(): JSX.Element {
  const { status } = useAuth();
  if (status === 'authed') return <Navigate to="/dashboard" replace />;
  return <HealthPage />;
}

function NotFound(): JSX.Element {
  return (
    <div className="min-h-full flex items-center justify-center p-6">
      <div className="text-center">
        <h1 className="text-2xl font-semibold">404</h1>
        <p className="mt-2 text-sm text-slate-600">Page not found.</p>
        <a href="/dashboard" className="mt-4 inline-block text-indigo-600 hover:underline">
          Go to dashboard
        </a>
      </div>
    </div>
  );
}

export default function App(): JSX.Element {
  return (
    <AuthProvider>
      <Routed />
    </AuthProvider>
  );
}
