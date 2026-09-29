// ============================================================
// Sign-In screen — Log in / Sign up toggle with email + password
// Route: /signin
// Reuses Button and FormSection from the existing design system.
// ============================================================

import { useState, type FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import PhoneFrame from '../components/PhoneFrame';
import Button from '../components/ui/Button';
import FormSection from '../components/ui/FormSection';
import { useAuth } from '../contexts/AuthContext';
import * as api from '../lib/api';

type Mode = 'login' | 'signup';

export default function SignIn() {
  const navigate = useNavigate();
  const { setAuth } = useAuth();

  // Form state
  const [mode, setMode] = useState<Mode>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  // UI state
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const isLogin = mode === 'login';

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      // Call the right endpoint based on mode
      const data = isLogin
        ? await api.login(email, password)
        : await api.signup(email, password);

      // Save token + user in context (and localStorage)
      setAuth(data.access_token, data.user);

      if (isLogin) {
        // Fetch profile to decide where to go
        const profile = await api.getProfile(data.access_token);
        navigate(profile.status === 'submitted' ? '/home' : '/details', { replace: true });
      } else {
        // New user always starts at details
        navigate('/details', { replace: true });
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <PhoneFrame>
      <div className="flex flex-col pt-[20vh] min-h-screen">
        {/* Heading changes based on mode */}
        <h1 className="text-2xl font-bold text-charcoal mb-1">
          {isLogin ? 'Welcome back' : 'Create your account'}
        </h1>
        <p className="text-sm text-muted mb-5">
          {isLogin
            ? 'Sign in to view your purchase progress'
            : 'Get started with your investment roadmap'}
        </p>

        {/* ── Login / Sign up toggle ─────────────────────── */}
        <div className="flex bg-border/40 rounded-xl p-1 mb-5">
          <button
            type="button"
            onClick={() => { setMode('login'); setError(''); }}
            className={`flex-1 py-2 text-sm font-medium rounded-lg transition-colors ${
              isLogin
                ? 'bg-white text-charcoal shadow-sm'
                : 'text-muted hover:text-charcoal'
            }`}
          >
            Log in
          </button>
          <button
            type="button"
            onClick={() => { setMode('signup'); setError(''); }}
            className={`flex-1 py-2 text-sm font-medium rounded-lg transition-colors ${
              !isLogin
                ? 'bg-white text-charcoal shadow-sm'
                : 'text-muted hover:text-charcoal'
            }`}
          >
            Sign up
          </button>
        </div>

        {/* ── Form ───────────────────────────────────────── */}
        <form onSubmit={handleSubmit}>
          <FormSection>
            {/* Email field */}
            <label className="block mb-4">
              <span className="text-sm font-medium text-charcoal mb-1.5 block">Email</span>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="w-full px-4 py-3 rounded-xl border border-border bg-white text-charcoal text-sm placeholder:text-muted/60 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary"
              />
            </label>

            {/* Password field */}
            <label className="block">
              <span className="text-sm font-medium text-charcoal mb-1.5 block">Password</span>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder={isLogin ? 'Enter your password' : 'At least 6 characters'}
                className="w-full px-4 py-3 rounded-xl border border-border bg-white text-charcoal text-sm placeholder:text-muted/60 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary"
              />
            </label>
          </FormSection>

          {/* Error message */}
          {error && (
            <p className="text-sm text-red-600 mb-4 px-1">{error}</p>
          )}

          {/* Submit button */}
          <Button
            label={loading ? (isLogin ? 'Signing in…' : 'Creating account…') : (isLogin ? 'Log in' : 'Sign up')}
            type="submit"
            disabled={loading}
          />
        </form>

        {/* Switch mode link at the bottom */}
        <p className="text-sm text-muted text-center mt-5">
          {isLogin ? "Don't have an account? " : 'Already have an account? '}
          <button
            type="button"
            onClick={() => { setMode(isLogin ? 'signup' : 'login'); setError(''); }}
            className="text-primary font-medium hover:opacity-80"
          >
            {isLogin ? 'Sign up' : 'Log in'}
          </button>
        </p>
      </div>
    </PhoneFrame>
  );
}