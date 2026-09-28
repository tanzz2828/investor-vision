// ============================================================
// StatusBadge — small coloured pill/badge
// Used to show property status (e.g. "Under contract")
// ============================================================

interface StatusBadgeProps {
  label: string;
  variant: 'success' | 'current' | 'muted';
}

// Map each variant to its Tailwind classes
const variantClasses: Record<StatusBadgeProps['variant'], string> = {
  success: 'bg-success/10 text-success',
  current: 'bg-accent/10 text-accent',
  muted: 'bg-muted/10 text-muted',
};

export default function StatusBadge({ label, variant }: StatusBadgeProps) {
  return (
    <span
      className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${variantClasses[variant]}`}
    >
      {label}
    </span>
  );
}