// ============================================================
// PipelineRow — numbered circle + title + subtitle
// Three visual states: done (green), current (burnt-orange), upcoming (grey)
// The "current" row is tappable
// ============================================================

interface PipelineRowProps {
  step: number;
  title: string;
  subtitle: string;
  status: 'done' | 'current' | 'upcoming';
  /** Called when the row is tapped (only meaningful for the current stage) */
  onClick?: () => void;
}

// Map each status to its circle background colour
const circleClasses: Record<PipelineRowProps['status'], string> = {
  done: 'bg-success text-white',
  current: 'bg-accent text-white',
  upcoming: 'bg-border text-muted',
};

// Map each status to its title text colour
const titleClasses: Record<PipelineRowProps['status'], string> = {
  done: 'text-charcoal',
  current: 'text-charcoal font-semibold',
  upcoming: 'text-muted',
};

export default function PipelineRow({ step, title, subtitle, status, onClick }: PipelineRowProps) {
  return (
    <button
      onClick={onClick}
      className={`
        flex items-start gap-4 w-full text-left py-3
        ${status === 'current' ? 'cursor-pointer hover:opacity-80' : 'cursor-default'}
      `}
      // Only make the current stage interactive
      disabled={status !== 'current'}
    >
      {/* Numbered circle */}
      <div
        className={`
          flex-shrink-0 w-9 h-9 rounded-full flex items-center justify-center
          text-sm font-bold ${circleClasses[status]}
        `}
      >
        {step}
      </div>

      {/* Text content */}
      <div className="flex-1 min-w-0">
        <p className={`text-base ${titleClasses[status]}`}>{title}</p>
        <p className="text-sm text-muted mt-0.5">{subtitle}</p>
      </div>

      {/* Show a small arrow for the current stage to hint it's tappable */}
      {status === 'current' && (
        <span className="text-accent text-lg self-center">›</span>
      )}
    </button>
  );
}