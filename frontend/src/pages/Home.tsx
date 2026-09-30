// ============================================================
// Home screen — the main dashboard showing the purchase pipeline
// Route: /home
// Shows greeting (first name from profile), brief summary, and pipeline
// "Next" link in top-right cycles to /updates
// "Log out" link in top-left clears auth and returns to Welcome
// ============================================================

import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import PhoneFrame from '../components/PhoneFrame';
import PipelineRow from '../components/ui/PipelineRow';
import { pipelineStages } from '../data/mockData';
import { useAuth } from '../contexts/AuthContext';
import * as api from '../lib/api';

export default function Home() {
  const navigate = useNavigate();
  const { token, logout } = useAuth();
  const [greeting, setGreeting] = useState('Welcome back');
  const [briefSummary, setBriefSummary] = useState('');

  // Fetch profile to get the client's first name and brief summary
  useEffect(() => {
    if (!token) return;
    api.getProfile(token).then((profile) => {
      const rawName = profile.fullName.trim();
      const firstName = rawName ? rawName.split(' ')[0] : '';
      const displayName = firstName
        ? firstName.charAt(0).toUpperCase() + firstName.slice(1)
        : '';
      setGreeting(displayName ? `Hi ${displayName}!` : 'Welcome back');

      const areas = profile.preferredAreas.trim();
      const budget = profile.budget.trim();
      if (areas && budget) {
        setBriefSummary(`Searching in ${areas} · ${budget}`);
      } else if (areas) {
        setBriefSummary(`Searching in ${areas}`);
      } else if (budget) {
        setBriefSummary(budget);
      } else {
        setBriefSummary('');
      }
    }).catch(() => {});
  }, [token]);

  return (
    <PhoneFrame>
      {/* Top bar with "Log out" on the left, "Next" on the right */}
      <div className="flex items-center justify-between mb-6">
        <button
          type="button"
          onClick={logout}
          className="text-sm font-medium text-muted hover:text-charcoal transition-colors"
        >
          Log out
        </button>
        <Link to="/updates" className="text-sm font-medium text-primary hover:opacity-80">
          Next →
        </Link>
      </div>

      {/* Greeting */}
      <h1 className="text-2xl font-bold text-charcoal mb-1">{greeting}</h1>

      {/* Client brief summary */}
      {briefSummary && (
        <p className="text-sm text-muted mb-8">
          {briefSummary}
        </p>
      )}

      {/* Pipeline heading */}
      <h2 className="text-lg font-semibold text-charcoal mb-4">Your progress</h2>

      {/* 7-stage vertical pipeline */}
      <div className="flex flex-col divide-y divide-border">
        {pipelineStages.map((stage) => (
          <PipelineRow
            key={stage.step}
            step={stage.step}
            title={stage.title}
            subtitle={stage.subtitle}
            status={stage.status}
            // Only the current stage is tappable — navigates to Stage Detail
            onClick={
              stage.status === 'current'
                ? () => navigate('/stage')
                : undefined
            }
          />
        ))}
      </div>
    </PhoneFrame>
  );
}