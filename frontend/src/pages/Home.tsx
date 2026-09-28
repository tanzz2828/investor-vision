// ============================================================
// Home screen — the main dashboard showing the purchase pipeline
// Route: /home
// Shows greeting, address, and the 7-stage pipeline
// "Next" link in top-right cycles to /updates
// ============================================================

import { useNavigate, Link } from 'react-router-dom';
import PhoneFrame from '../components/PhoneFrame';
import PipelineRow from '../components/ui/PipelineRow';
import { pipelineStages } from '../data/mockData';

export default function Home() {
  const navigate = useNavigate();

  return (
    <PhoneFrame>
      {/* Top bar with "Next" link on the right */}
      <div className="flex items-center justify-between mb-6">
        <div />
        <Link to="/updates" className="text-sm font-medium text-primary hover:opacity-80">
          Next →
        </Link>
      </div>

      {/* Greeting */}
      <h1 className="text-2xl font-bold text-charcoal mb-1">Hi Chloe!</h1>

      {/* Property address */}
      <p className="text-sm text-muted mb-8">
        9 Eliza Court, Warrnambool VIC 3280
      </p>

      {/* Pipeline heading */}
      <h2 className="text-lg font-semibold text-charcoal mb-4">Your progress</h2>

      {/* 7-stage vertical pipeline */}
      <div className="flex flex-col divide-y divide-border">
        {pipelineStages.map((stage) => (
          <PipelineRow
            key={stage.step}
            step={stage.step}
            title={stage.title}
            subtitle={stage.subtitle}
            status={stage.status}
            // Only the current stage is tappable — navigates to Stage Detail
            onClick={
              stage.status === 'current'
                ? () => navigate('/stage')
                : undefined
            }
          />
        ))}
      </div>
    </PhoneFrame>
  );
}