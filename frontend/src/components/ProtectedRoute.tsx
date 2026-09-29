// ============================================================
// ProtectedRoute — redirects to /signin if there's no token
// Wraps a group of routes via <Route element={<ProtectedRoute />}>
// and renders child routes with <Outlet />
// ============================================================

import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

export default function ProtectedRoute() {
  const { token } = useAuth();

  if (!token) {
    return <Navigate to="/signin" replace />;
  }

  return <Outlet />;
}