// ============================================================
// Welcome screen — the first thing the client sees
// Route: /
// ============================================================

import PhoneFrame from '../components/PhoneFrame';
import Button from '../components/ui/Button';

export default function Welcome() {
  return (
    <PhoneFrame>
      <div className="flex flex-col items-center pt-[20vh] min-h-screen text-center">
        {/* Logo image — already contains "Investor Vision" text */}
        <img
          src="/logo.png"
          alt="Investor Vision"
          className="w-[180px] h-auto mb-6"
        />

        {/* Tagline */}
        <p className="text-lg font-medium text-charcoal mb-2">
          Your roadmap from search to settled
        </p>

        {/* Subtitle */}
        <p className="text-sm text-muted mb-10">
          For clients of investment buyer's agencies
        </p>

        {/* Get Started button */}
        <div className="w-full max-w-xs">
          <Button label="Get Started" to="/signin" />
        </div>
      </div>
    </PhoneFrame>
  );
}