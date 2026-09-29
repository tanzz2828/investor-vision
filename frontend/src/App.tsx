// ============================================================
// App.tsx — the root component
// Sets up React Router routes and auth context
// Form data is now saved to Supabase via the API (not localStorage)
// ============================================================

import { useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';

// Pages
import Welcome from './pages/Welcome';
import SignIn from './pages/SignIn';
import YourDetails from './pages/YourDetails';
import YourBrief from './pages/YourBrief';
import Confirmation from './pages/Confirmation';
import Home from './pages/Home';
import StageDetail from './pages/StageDetail';
import Updates from './pages/Updates';
import Property from './pages/Property';

function AppRoutes() {
  // Clear the old localStorage form key on first load (M3 → M4 migration)
  useEffect(() => {
    localStorage.removeItem('investor-vision-form');
  }, []);

  return (
    <Routes>
      {/* Public routes */}
      <Route path="/" element={<Welcome />} />
      <Route path="/signin" element={<SignIn />} />

      {/* Protected routes — redirect to /signin if no token */}
      <Route element={<ProtectedRoute />}>
        <Route path="/details" element={<YourDetails />} />
        <Route path="/brief" element={<YourBrief />} />
        <Route path="/confirmation" element={<Confirmation />} />
        <Route path="/home" element={<Home />} />
        <Route path="/stage" element={<StageDetail />} />
        <Route path="/updates" element={<Updates />} />
        <Route path="/property" element={<Property />} />
      </Route>
    </Routes>
  );
}

function App() {
  return (
    <AuthProvider>
      <AppRoutes />
    </AuthProvider>
  );
}

export default App;
