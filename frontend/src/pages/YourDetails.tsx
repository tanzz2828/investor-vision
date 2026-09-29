// ============================================================
// Your Details screen — collects name, phone, contact time
// Route: /details
// Fetches profile on mount, saves via PUT /api/profile/details
// ============================================================

import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import PhoneFrame from '../components/PhoneFrame';
import IconButton from '../components/ui/IconButton';
import FormSection from '../components/ui/FormSection';
import { useAuth } from '../contexts/AuthContext';
import * as api from '../lib/api';

export default function YourDetails() {
  const navigate = useNavigate();
  const { token } = useAuth();

  // Form state
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [contactTime, setContactTime] = useState('');

  // UI state
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  // Fetch saved profile on mount
  useEffect(() => {
    if (!token) return;
    api.getProfile(token).then((profile) => {
      setFullName(profile.fullName);
      setPhone(profile.phone);
      setContactTime(profile.contactTime as '' | 'Morning' | 'Afternoon' | 'Evening');
      setLoading(false);
    }).catch(() => {
      setLoading(false);
    });
  }, [token]);

  async function handleContinue() {
    setError('');
    setSaving(true);
    try {
      await api.saveDetails(token!, {
        full_name: fullName,
        phone,
        contact_time: contactTime,
      });
      navigate('/brief');
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
        <h1 className="text-2xl font-bold text-charcoal mb-1">Your Details</h1>
        <p className="text-sm text-muted mb-6">
          Let's get to know you a little better
        </p>

        {/* Details form card */}
        <FormSection>
          {/* Full name */}
          <label className="block mb-4">
            <span className="text-sm font-medium text-charcoal mb-1.5 block">Full name</span>
            <input
              type="text"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder="e.g. Chloe Anderson"
              disabled={loading}
              className="w-full px-4 py-3 rounded-xl border border-border bg-white text-charcoal text-sm placeholder:text-muted/60 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary disabled:opacity-50"
            />
          </label>

          {/* Phone number */}
          <label className="block mb-4">
            <span className="text-sm font-medium text-charcoal mb-1.5 block">Phone number</span>
            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="e.g. 0400 123 456"
              disabled={loading}
              className="w-full px-4 py-3 rounded-xl border border-border bg-white text-charcoal text-sm placeholder:text-muted/60 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary disabled:opacity-50"
            />
          </label>

          {/* Best contact time dropdown */}
          <label className="block">
            <span className="text-sm font-medium text-charcoal mb-1.5 block">Best contact time</span>
            <select
              value={contactTime}
              onChange={(e) => setContactTime(e.target.value as '' | 'Morning' | 'Afternoon' | 'Evening')}
              disabled={loading}
              className="w-full px-4 py-3 rounded-xl border border-border bg-white text-charcoal text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary appearance-none disabled:opacity-50"
            >
              <option value="">Select a time</option>
              <option value="Morning">Morning</option>
              <option value="Afternoon">Afternoon</option>
              <option value="Evening">Evening</option>
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