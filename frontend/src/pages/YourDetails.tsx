// ============================================================
// Your Details screen — collects name, phone, contact time
// Route: /details
// Data is saved to localStorage via props from App.tsx
// ============================================================

import type { DetailsData } from '../types';
import PhoneFrame from '../components/PhoneFrame';
import IconButton from '../components/ui/IconButton';
import FormSection from '../components/ui/FormSection';

interface YourDetailsProps {
  details: DetailsData;
  setDetails: (data: DetailsData) => void;
}

export default function YourDetails({ details, setDetails }: YourDetailsProps) {
  // Helper to update a single field
  const update = (field: keyof DetailsData, value: string) => {
    setDetails({ ...details, [field]: value });
  };

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
              value={details.fullName}
              onChange={(e) => update('fullName', e.target.value)}
              placeholder="e.g. Chloe Anderson"
              className="w-full px-4 py-3 rounded-xl border border-border bg-white text-charcoal text-sm placeholder:text-muted/60 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary"
            />
          </label>

          {/* Phone number */}
          <label className="block mb-4">
            <span className="text-sm font-medium text-charcoal mb-1.5 block">Phone number</span>
            <input
              type="tel"
              value={details.phone}
              onChange={(e) => update('phone', e.target.value)}
              placeholder="e.g. 0400 123 456"
              className="w-full px-4 py-3 rounded-xl border border-border bg-white text-charcoal text-sm placeholder:text-muted/60 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary"
            />
          </label>

          {/* Best contact time dropdown */}
          <label className="block">
            <span className="text-sm font-medium text-charcoal mb-1.5 block">Best contact time</span>
            <select
              value={details.contactTime}
              onChange={(e) => update('contactTime', e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-border bg-white text-charcoal text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary appearance-none"
            >
              <option value="">Select a time</option>
              <option value="Morning">Morning</option>
              <option value="Afternoon">Afternoon</option>
              <option value="Evening">Evening</option>
            </select>
          </label>
        </FormSection>

        {/* Continue button */}
        <IconButton label="Continue" to="/brief" />
      </div>
    </PhoneFrame>
  );
}