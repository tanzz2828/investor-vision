// ============================================================
// Your Brief screen — collects investment preferences
// Route: /brief
// Fetches profile on mount, saves via PUT /api/profile/brief
// ============================================================

import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import PhoneFrame from '../components/PhoneFrame';
import IconButton from '../components/ui/IconButton';
import FormSection from '../components/ui/FormSection';
import { useAuth } from '../contexts/AuthContext';
import * as api from '../lib/api';

export default function YourBrief() {
  const navigate = useNavigate();
  const { token } = useAuth();

  // Form state
  const [budget, setBudget] = useState('');
  const [propertyType, setPropertyType] = useState('');
  const [preferredAreas, setPreferredAreas] = useState('');
  const [investmentGoal, setInvestmentGoal] = useState('');

  // UI state
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  // Fetch saved profile on mount
  useEffect(() => {
    if (!token) return;
    api.getProfile(token).then((profile) => {
      setBudget(profile.budget);
      setPropertyType(profile.propertyType);
      setPreferredAreas(profile.preferredAreas);
      setInvestmentGoal(profile.investmentGoal);
      setLoading(false);
    }).catch(() => {
      setLoading(false);
    });
  }, [token]);

  async function handleContinue() {
    setError('');
    setSaving(true);
    try {
      await api.saveBrief(token!, {
        budget,
        property_type: propertyType,
        preferred_areas: preferredAreas,
        investment_goal: investmentGoal,
      });
      navigate('/confirmation');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not save. Please try again.');
    } finally {
      setSaving(false);
    }
  }

  return (
    <PhoneFrame>
      <div className="flex flex-col justify-center min-h-screen">
        {/* Heading */}
        <h1 className="text-2xl font-bold text-charcoal mb-1">Your Brief</h1>
        <p className="text-sm text-muted mb-6">
          Tell us what you're looking for
        </p>

        {/* Brief form card */}
        <FormSection>
          {/* Budget range dropdown */}
          <label className="block mb-4">
            <span className="text-sm font-medium text-charcoal mb-1.5 block">Budget range</span>
            <select
              value={budget}
              onChange={(e) => setBudget(e.target.value)}
              disabled={loading}
              className="w-full px-4 py-3 rounded-xl border border-border bg-white text-charcoal text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary appearance-none disabled:opacity-50"
            >
              <option value="">Select your budget</option>
              <option value="Up to $500k">Up to $500k</option>
              <option value="$500k–$750k">$500k–$750k</option>
              <option value="$750k–$1M">$750k–$1M</option>
              <option value="$1M+">$1M+</option>
            </select>
          </label>

          {/* Property type dropdown */}
          <label className="block mb-4">
            <span className="text-sm font-medium text-charcoal mb-1.5 block">Property type</span>
            <select
              value={propertyType}
              onChange={(e) => setPropertyType(e.target.value)}
              disabled={loading}
              className="w-full px-4 py-3 rounded-xl border border-border bg-white text-charcoal text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary appearance-none disabled:opacity-50"
            >
              <option value="">Select property type</option>
              <option value="House">House</option>
              <option value="Apartment">Apartment</option>
              <option value="Townhouse">Townhouse</option>
              <option value="Any">Any</option>
            </select>
          </label>

          {/* Preferred areas text input */}
          <label className="block mb-4">
            <span className="text-sm font-medium text-charcoal mb-1.5 block">Preferred areas</span>
            <input
              type="text"
              value={preferredAreas}
              onChange={(e) => setPreferredAreas(e.target.value)}
              placeholder="e.g. Warrnambool, Geelong"
              disabled={loading}
              className="w-full px-4 py-3 rounded-xl border border-border bg-white text-charcoal text-sm placeholder:text-muted/60 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary disabled:opacity-50"
            />
          </label>

          {/* Investment goal dropdown */}
          <label className="block">
            <span className="text-sm font-medium text-charcoal mb-1.5 block">Investment goal</span>
            <select
              value={investmentGoal}
              onChange={(e) => setInvestmentGoal(e.target.value)}
              disabled={loading}
              className="w-full px-4 py-3 rounded-xl border border-border bg-white text-charcoal text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary appearance-none disabled:opacity-50"
            >
              <option value="">Select your goal</option>
              <option value="Capital growth">Capital growth</option>
              <option value="Rental yield">Rental yield</option>
              <option value="Balanced">Balanced</option>
            </select>
          </label>
        </FormSection>

        {/* Error message */}
        {error && (
          <p className="text-sm text-red-600 mb-4 px-1">{error}</p>
        )}

        {/* Continue button */}
        <IconButton label="Continue" onClick={handleContinue} loading={saving} disabled={saving || loading} />
      </div>
    </PhoneFrame>
  );
}