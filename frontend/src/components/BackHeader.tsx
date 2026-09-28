// ============================================================
// BackHeader — back arrow + heading + optional subtitle
// Used on detail screens (Stage Detail, Updates, Property)
// ============================================================

import { Link } from 'react-router-dom';

interface BackHeaderProps {
  title: string;
  subtitle?: string;
  /** Route to navigate to when the back arrow is tapped */
  to: string;
}

export default function BackHeader({ title, subtitle, to }: BackHeaderProps) {
  return (
    <div className="mb-6">
      {/* Back arrow link */}
      <Link
        to={to}
        className="inline-flex items-center text-primary text-sm font-medium mb-3 hover:opacity-80"
      >
        {/* Simple left arrow using a unicode character */}
        <span className="text-lg mr-1">←</span>
        <span>Back</span>
      </Link>

      {/* Heading */}
      <h1 className="text-2xl font-bold text-charcoal">{title}</h1>

      {/* Optional subtitle */}
      {subtitle && (
        <p className="text-sm text-muted mt-1">{subtitle}</p>
      )}
    </div>
  );
}