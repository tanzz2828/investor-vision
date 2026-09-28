// ============================================================
// IconButton — primary action button with animated arrow icon
// Renders as a React Router <Link> when `to` is provided
// ============================================================

import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

interface IconButtonProps {
  label: string;
  /** Route to navigate to */
  to: string;
}

export default function IconButton({ label, to }: IconButtonProps) {
  return (
    <Link
      to={to}
      className="
        group
        inline-flex items-center justify-center
        py-3.5 px-6 rounded-xl
        text-base font-semibold text-white
        bg-primary
        w-full
        transition-opacity
        hover:opacity-90 active:opacity-80
      "
    >
      {label}
      <ArrowRight
        className="-me-1 ms-2 opacity-60 transition-transform group-hover:translate-x-0.5"
        size={16}
        strokeWidth={2}
        aria-hidden="true"
      />
    </Link>
  );
}