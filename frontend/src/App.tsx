// ============================================================
// App.tsx — the root component
// Sets up React Router routes, auth context, and form state
// Form data is persisted to localStorage via the useLocalStorage hook
// ============================================================

import { Routes, Route } from 'react-router-dom';
import { useLocalStorage } from './hooks/useLocalStorage';
import { AuthProvider } from './contexts/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import type { FormData, DetailsData, BriefData } from './types';

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

// Default empty form data — used when there's nothing in localStorage yet
const defaultFormData: FormData = {
  details: {
    fullName: '',
    phone: '',
    contactTime: '',
  },
  brief: {
    budget: '',
    propertyType: '',
    preferredAreas: '',
    investmentGoal: '',
  },
};

function AppRoutes() {
  // Central form state — synced with localStorage automatically
  const [formData, setFormData] = useLocalStorage<FormData>(
    'investor-vision-form',
    defaultFormData
  );

  // Convenience setters for each section of the form
  const setDetails = (data: DetailsData) => {
    setFormData((prev) => ({ ...prev, details: data }));
  };

  const setBrief = (data: BriefData) => {
    setFormData((prev) => ({ ...prev, brief: data }));
  };

  return (
    <Routes>
      {/* Public routes */}
      <Route path="/" element={<Welcome />} />
      <Route path="/signin" element={<SignIn />} />

      {/* Protected routes — redirect to /signin if no token */}
      <Route element={<ProtectedRoute />}>
        <Route
          path="/details"
          element={
            <YourDetails details={formData.details} setDetails={setDetails} />
          }
        />
        <Route
          path="/brief"
          element={<YourBrief brief={formData.brief} setBrief={setBrief} />}
        />
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
