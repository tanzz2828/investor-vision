// ============================================================
// PhoneFrame — wraps every screen in a 420px max-width container
// This gives the app a mobile-phone feel when viewed on desktop
// ============================================================

import type { ReactNode } from 'react';

interface PhoneFrameProps {
  children: ReactNode;
}

export default function PhoneFrame({ children }: PhoneFrameProps) {
  return (
    <div className="min-h-screen w-full bg-warm flex justify-center">
      {/* The "phone" container — max 420px wide, full height on mobile */}
      <div className="w-full max-w-[420px] min-h-[85vh] bg-white rounded-3xl shadow-xl my-6 px-5 py-6">
        {children}
      </div>
    </div>
  );
}