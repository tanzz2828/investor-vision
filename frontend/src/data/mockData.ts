// ============================================================
// Mock data for Investor Vision
// All hardcoded data lives here — easy to swap for a real API later
// ============================================================

import type { PipelineStage, StageStep, UpdateItem, PropertyData } from '../types';

/** The 7 stages of the purchase pipeline shown on the Home screen */
export const pipelineStages: PipelineStage[] = [
  {
    step: 1,
    title: 'Getting started',
    subtitle: 'Brief and strategy agreed',
    status: 'done',
  },
  {
    step: 2,
    title: 'Finding property',
    subtitle: 'Sourcing on and off market',
    status: 'done',
  },
  {
    step: 3,
    title: 'Shortlist & due diligence',
    subtitle: 'Property identified and reviewed',
    status: 'done',
  },
  {
    step: 4,
    title: 'Offer & under contract',
    subtitle: 'Get your contract signed',
    status: 'current',
  },
  {
    step: 5,
    title: 'Finance & inspections',
    subtitle: 'Finance, building and pest',
    status: 'upcoming',
  },
  {
    step: 6,
    title: 'Settlement',
    subtitle: 'Property becomes yours',
    status: 'upcoming',
  },
  {
    step: 7,
    title: 'Tenanted',
    subtitle: 'Place your tenant',
    status: 'upcoming',
  },
];

/** The 4 steps shown inside the Stage Detail screen (stage 4) */
export const stageDetailSteps: StageStep[] = [
  {
    step: 1,
    title: 'Offer accepted',
    subtitle: 'Email exchanged for under contract',
    status: 'done',
  },
  {
    step: 2,
    title: 'Building & pest inspection',
    subtitle: 'B&P inspection done',
    status: 'done',
  },
  {
    step: 3,
    title: 'Finance approved',
    subtitle: '2 days early',
    status: 'done',
  },
  {
    step: 4,
    title: 'Cooling-off period',
    subtitle: 'Cooling-off ends 21 August',
    status: 'current',
  },
];

/** Timestamped updates feed, newest first */
export const updatesFeed: UpdateItem[] = [
  {
    title: 'Finance approved',
    date: 'Today, 10.43 am',
  },
  {
    title: 'B&P inspection done',
    date: '15 August, 2.24 pm',
  },
  {
    title: 'Offer accepted',
    date: '11 August, 3.36 pm',
  },
];

/** Property details for the Property screen */
export const propertyData: PropertyData = {
  address: '9 Eliza Court, Warrnambool VIC 3280',
  purchasePrice: '$670,000',
  status: 'Under contract',
};