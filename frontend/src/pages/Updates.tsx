// ============================================================
// Updates screen — timestamped feed of agent actions
// Route: /updates
// Back arrow returns to /home
// "Next" link in top-right cycles to /property
// ============================================================

import { Link } from 'react-router-dom';
import PhoneFrame from '../components/PhoneFrame';
import BackHeader from '../components/BackHeader';
import { updatesFeed } from '../data/mockData';

export default function Updates() {
  return (
    <PhoneFrame>
      {/* Top bar: back header + "Next" link */}
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <BackHeader
            title="Updates"
            subtitle="Get the latest updates — take a look at what your agent has done so far"
            to="/home"
          />
        </div>
        <Link to="/property" className="text-sm font-medium text-primary hover:opacity-80 mt-1 ml-3 shrink-0">
          Next →
        </Link>
      </div>

      {/* Timestamped updates feed, newest first */}
      <div className="flex flex-col gap-4 mt-2">
        {updatesFeed.map((update, index) => (
          <div key={index} className="flex items-start gap-3">
            {/* Green dot indicator */}
            <div className="w-2.5 h-2.5 rounded-full bg-success mt-1.5 shrink-0" />

            {/* Update text */}
            <div>
              <p className="text-base font-medium text-charcoal">{update.title}</p>
              <p className="text-sm text-muted mt-0.5">{update.date}</p>
            </div>
          </div>
        ))}
      </div>
    </PhoneFrame>
  );
}