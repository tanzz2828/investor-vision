// ============================================================
// Your Brief screen — collects investment preferences
// Route: /brief
// Data is saved to localStorage via props from App.tsx
// ============================================================

import type { BriefData } from '../types';
import PhoneFrame from '../components/PhoneFrame';
import IconButton from '../components/ui/IconButton';
import FormSection from '../components/ui/FormSection';

interface YourBriefProps {
  brief: BriefData;
  setBrief: (data: BriefData) => void;
}

export default function YourBrief({ brief, setBrief }: YourBriefProps) {
  // Helper to update a single field
  const update = (field: keyof BriefData, value: string) => {
    setBrief({ ...brief, [field]: value });
  };

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
              value={brief.budget}
              onChange={(e) => update('budget', e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-border bg-white text-charcoal text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary appearance-none"
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
              value={brief.propertyType}
              onChange={(e) => update('propertyType', e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-border bg-white text-charcoal text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary appearance-none"
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
              value={brief.preferredAreas}
              onChange={(e) => update('preferredAreas', e.target.value)}
              placeholder="e.g. Warrnambool, Geelong"
              className="w-full px-4 py-3 rounded-xl border border-border bg-white text-charcoal text-sm placeholder:text-muted/60 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary"
            />
          </label>

          {/* Investment goal dropdown */}
          <label className="block">
            <span className="text-sm font-medium text-charcoal mb-1.5 block">Investment goal</span>
            <select
              value={brief.investmentGoal}
              onChange={(e) => update('investmentGoal', e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-border bg-white text-charcoal text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary appearance-none"
            >
              <option value="">Select your goal</option>
              <option value="Capital growth">Capital growth</option>
              <option value="Rental yield">Rental yield</option>
              <option value="Balanced">Balanced</option>
            </select>
          </label>
        </FormSection>

        {/* Continue button */}
        <IconButton label="Continue" to="/confirmation" />
      </div>
    </PhoneFrame>
  );
}