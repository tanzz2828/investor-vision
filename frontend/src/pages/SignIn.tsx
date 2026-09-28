// ============================================================
// Sign-In screen — simple email + access code form
// Route: /signin
// ============================================================

import { useState } from 'react';
import PhoneFrame from '../components/PhoneFrame';
import Button from '../components/ui/Button';
import FormSection from '../components/ui/FormSection';

export default function SignIn() {
  // Local state for the sign-in fields (not persisted — just for the demo)
  const [email, setEmail] = useState('');
  const [accessCode, setAccessCode] = useState('');

  return (
    <PhoneFrame>
      <div className="flex flex-col pt-[20vh] min-h-screen">
        {/* Heading */}
        <h1 className="text-2xl font-bold text-charcoal mb-1">Welcome back</h1>
        <p className="text-sm text-muted mb-6">
          Sign in to view your purchase progress
        </p>

        {/* Sign-in form card */}
        <FormSection>
          {/* Email field */}
          <label className="block mb-4">
            <span className="text-sm font-medium text-charcoal mb-1.5 block">Email</span>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              className="w-full px-4 py-3 rounded-xl border border-border bg-white text-charcoal text-sm placeholder:text-muted/60 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary"
            />
          </label>

          {/* Access code field */}
          <label className="block mb-3">
            <span className="text-sm font-medium text-charcoal mb-1.5 block">Access Code</span>
            <input
              type="text"
              value={accessCode}
              onChange={(e) => setAccessCode(e.target.value)}
              placeholder="Enter your code"
              className="w-full px-4 py-3 rounded-xl border border-border bg-white text-charcoal text-sm placeholder:text-muted/60 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary"
            />
          </label>

          {/* Helper text */}
          <p className="text-xs text-muted mb-5">
            Your agent set up your account
          </p>
        </FormSection>

        {/* Submit button */}
        <Button label="View my purchase" to="/details" />
      </div>
    </PhoneFrame>
  );
}