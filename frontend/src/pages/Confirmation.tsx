// ============================================================
// Confirmation screen — success message after onboarding
// Route: /confirmation
// Fetches profile from API to personalise the greeting
// ============================================================

import { useState, useEffect } from 'react';
import PhoneFrame from '../components/PhoneFrame';
import Button from '../components/ui/Button';
import { useAuth } from '../contexts/AuthContext';
import * as api from '../lib/api';
import type { ProfileData } from '../lib/api';

export default function Confirmation() {
  const { token } = useAuth();
  const [profile, setProfile] = useState<ProfileData | null>(null);

  useEffect(() => {
    if (!token) return;
    api.getProfile(token).then(setProfile).catch(() => {});
  }, [token]);

  // Show nothing while loading (brief flash)
  if (!profile) {
    return (
      <PhoneFrame>
        <div className="flex items-center justify-center min-h-screen">
          <p className="text-sm text-muted">Loading…</p>
        </div>
      </PhoneFrame>
    );
  }

  const name = profile.fullName.trim();
  const areas = profile.preferredAreas.trim();
  const budget = profile.budget.trim();

  // Build personalised heading
  const heading = name
    ? `You're all set, ${name} — your roadmap from search to settled starts now.`
    : "You're all set — your roadmap from search to settled starts now.";

  // Build personalised details line
  const hasDetails = areas || budget;
  let detailsLine = '';
  if (areas && budget) {
    detailsLine = `We've noted you're looking in ${areas} with a budget of ${budget}.`;
  } else if (areas) {
    detailsLine = `We've noted you're looking in ${areas}.`;
  } else if (budget) {
    detailsLine = `We've noted your budget of ${budget}.`;
  } else {
    detailsLine = "We've noted your preferences.";
  }

  return (
    <PhoneFrame>
      <div className="flex flex-col items-center pt-[20vh] min-h-screen text-center">
        {/* Green success tick (SVG checkmark in a circle) */}
        <div className="w-20 h-20 rounded-full bg-success/10 flex items-center justify-center mb-6">
          <svg
            className="w-10 h-10 text-success"
            fill="none"
            stroke="currentColor"
            strokeWidth={3}
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
        </div>

        {/* Personalised heading */}
        <h1 className="text-xl font-bold text-charcoal mb-3 max-w-xs leading-snug">
          {heading}
        </h1>

        {/* Personalised details echo */}
        {hasDetails && (
          <p className="text-sm text-muted leading-relaxed mb-3 max-w-xs">
            {detailsLine}
          </p>
        )}

        {/* Agent follow-up message */}
        <p className="text-sm text-muted leading-relaxed mb-10 max-w-xs">
          Your agent will be in touch within 2 business days.
        </p>

        {/* View roadmap button */}
        <div className="w-full max-w-xs">
          <Button label="View my roadmap" to="/home" />
        </div>
      </div>
    </PhoneFrame>
  );
}