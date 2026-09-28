// ============================================================
// Property screen — shows the property being purchased
// Route: /property
// Back arrow returns to /home
// "Next" link in top-right cycles back to /home
// ============================================================

import { Link } from 'react-router-dom';
import PhoneFrame from '../components/PhoneFrame';
import BackHeader from '../components/BackHeader';
import StatusBadge from '../components/StatusBadge';
import { propertyData } from '../data/mockData';

export default function Property() {
  return (
    <PhoneFrame>
      {/* Top bar: back header + "Next" link */}
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <BackHeader
            title="Your Property"
            to="/home"
          />
        </div>
        <Link to="/home" className="text-sm font-medium text-primary hover:opacity-80 mt-1 ml-3 shrink-0">
          Next →
        </Link>
      </div>

      {/* Image placeholder — grey box with a house icon */}
      <div className="w-full h-48 bg-border/50 rounded-2xl flex items-center justify-center mb-6">
        <svg className="w-16 h-16 text-muted/40" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12l8.954-8.955a1.126 1.126 0 011.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" />
        </svg>
      </div>

      {/* Property details card */}
      <div className="bg-white rounded-2xl shadow-sm border border-border p-5">
        {/* Address */}
        <div className="mb-4">
          <p className="text-xs font-medium text-muted uppercase tracking-wide mb-1">Address</p>
          <p className="text-base font-medium text-charcoal">{propertyData.address}</p>
        </div>

        {/* Purchase price */}
        <div className="mb-4">
          <p className="text-xs font-medium text-muted uppercase tracking-wide mb-1">Purchase price</p>
          <p className="text-base font-medium text-charcoal">{propertyData.purchasePrice}</p>
        </div>

        {/* Status */}
        <div>
          <p className="text-xs font-medium text-muted uppercase tracking-wide mb-1">Status</p>
          <StatusBadge label={propertyData.status} variant="success" />
        </div>
      </div>
    </PhoneFrame>
  );
}