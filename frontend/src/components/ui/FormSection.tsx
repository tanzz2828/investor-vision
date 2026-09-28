// ============================================================
// FormSection — card wrapper for form groups
// White card with soft shadow, rounded corners, and padding
// ============================================================

import type { ReactNode } from 'react';

interface FormSectionProps {
  /** Optional title displayed at the top of the card */
  title?: string;
  children: ReactNode;
}

export default function FormSection({ title, children }: FormSectionProps) {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-border p-5 mb-5">
      {/* Optional section title */}
      {title && (
        <h2 className="text-lg font-semibold text-charcoal mb-4">{title}</h2>
      )}
      {children}
    </div>
  );
}