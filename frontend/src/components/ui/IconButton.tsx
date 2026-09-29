// ============================================================
// IconButton — primary action button with animated arrow icon
// Renders as a <Link> when `to` is provided, or as a <button>
// when `onClick` is provided. Supports loading and disabled states.
// ============================================================

import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

interface IconButtonProps {
  label: string;
  /** Route to navigate to (renders as <Link>) */
  to?: string;
  /** Click handler — renders as <button> when provided (no `to`) */
  onClick?: () => void;
  /** Disable the button */
  disabled?: boolean;
  /** Show loading state (appends "…" and disables) */
  loading?: boolean;
}

export default function IconButton({ label, to, onClick, disabled = false, loading = false }: IconButtonProps) {
  const isDisabled = disabled || loading;
  const displayLabel = loading ? `${label}…` : label;

  const className = `
    group
    inline-flex items-center justify-center
    py-3.5 px-6 rounded-xl
    text-base font-semibold text-white
    bg-primary
    w-full
    transition-opacity
    ${isDisabled ? 'opacity-50 cursor-not-allowed' : 'hover:opacity-90 active:opacity-80'}
  `;

  // If `to` is provided, render as a React Router Link
  if (to) {
    return (
      <Link to={to} className={className}>
        {displayLabel}
        <ArrowRight
          className="-me-1 ms-2 opacity-60 transition-transform group-hover:translate-x-0.5"
          size={16}
          strokeWidth={2}
          aria-hidden="true"
        />
      </Link>
    );
  }

  // Otherwise render as a <button>
  return (
    <button
      type="button"
      onClick={onClick}
      className={className}
      disabled={isDisabled}
    >
      {displayLabel}
      <ArrowRight
        className="-me-1 ms-2 opacity-60 transition-transform group-hover:translate-x-0.5"
        size={16}
        strokeWidth={2}
        aria-hidden="true"
      />
    </button>
  );
}