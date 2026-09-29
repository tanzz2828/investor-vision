// ============================================================
// Button — reusable primary action button
// Can render as a <button> or a React Router <Link>
// ============================================================

import { Link } from 'react-router-dom';

interface ButtonProps {
  label: string;
  /** If provided, the button renders as a <Link> to this route */
  to?: string;
  /** Click handler (ignored if `to` is provided) */
  onClick?: () => void;
  /** HTML button type — use "submit" for forms */
  type?: 'button' | 'submit' | 'reset';
  /** Visual variant — primary (orange) or secondary (outline) */
  variant?: 'primary' | 'secondary';
  /** Make the button full-width (default: true) */
  fullWidth?: boolean;
  /** Disable the button */
  disabled?: boolean;
}

export default function Button({
  label,
  to,
  onClick,
  type = 'button',
  variant = 'primary',
  fullWidth = true,
  disabled = false,
}: ButtonProps) {
  // Base classes shared by both variants
  const baseClasses = `
    inline-flex items-center justify-center
    py-3.5 px-6 rounded-xl
    text-base font-semibold
    transition-opacity
    ${fullWidth ? 'w-full' : ''}
    ${disabled ? 'opacity-50 cursor-not-allowed' : 'hover:opacity-90 active:opacity-80'}
  `;

  // Variant-specific classes
  const variantClasses =
    variant === 'primary'
      ? 'bg-primary text-white'
      : 'bg-transparent text-primary border-2 border-primary';

  const className = `${baseClasses} ${variantClasses}`;

  // If a `to` route is provided, render as a React Router Link
  if (to) {
    return (
      <Link to={to} className={className}>
        {label}
      </Link>
    );
  }

  // Otherwise, render as a regular button
  return (
    <button type={type} onClick={onClick} className={className} disabled={disabled}>
      {label}
    </button>
  );
}