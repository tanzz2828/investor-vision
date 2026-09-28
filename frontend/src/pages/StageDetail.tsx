// ============================================================
// Stage Detail screen — shows the steps within the current stage
// Route: /stage
// Back arrow returns to /home
// ============================================================

import PhoneFrame from '../components/PhoneFrame';
import BackHeader from '../components/BackHeader';
import { stageDetailSteps } from '../data/mockData';

export default function StageDetail() {
  return (
    <PhoneFrame>
      {/* Back header with stage title */}
      <BackHeader
        title="Offer & under contract"
        subtitle="Welcome to your cooling-off period — here's what's happening"
        to="/home"
      />

      {/* Numbered steps within this stage */}
      <div className="flex flex-col gap-4 mt-2">
        {stageDetailSteps.map((step) => (
          <div key={step.step} className="flex items-start gap-4">
            {/* Step number circle */}
            <div
              className={`
                flex-shrink-0 w-9 h-9 rounded-full flex items-center justify-center
                text-sm font-bold
                ${step.status === 'done' ? 'bg-success/10 text-success' : 'bg-accent/10 text-accent'}
              `}
            >
              {step.status === 'done' ? (
                /* Green checkmark for done steps */
                <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
              ) : (
                step.step
              )}
            </div>

            {/* Step text */}
            <div className="flex-1">
              <p className={`text-base ${step.status === 'current' ? 'font-semibold text-charcoal' : 'text-charcoal'}`}>
                {step.title}
              </p>
              <p className="text-sm text-muted mt-0.5">{step.subtitle}</p>
            </div>
          </div>
        ))}
      </div>
    </PhoneFrame>
  );
}