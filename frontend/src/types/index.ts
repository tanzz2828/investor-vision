// ============================================================
// Shared TypeScript interfaces for Investor Vision
// ============================================================

/** Data collected on the "Your Details" screen */
export interface DetailsData {
  fullName: string;
  phone: string;
  contactTime: '' | 'Morning' | 'Afternoon' | 'Evening';
}

/** Data collected on the "Your Brief" screen */
export interface BriefData {
  budget: '' | 'Up to $500k' | '$500k–$750k' | '$750k–$1M' | '$1M+';
  propertyType: '' | 'House' | 'Apartment' | 'Townhouse' | 'Any';
  preferredAreas: string;
  investmentGoal: '' | 'Capital growth' | 'Rental yield' | 'Balanced';
}

/** Combined form data stored in localStorage */
export interface FormData {
  details: DetailsData;
  brief: BriefData;
}

/** A single stage in the purchase pipeline */
export interface PipelineStage {
  step: number;
  title: string;
  subtitle: string;
  status: 'done' | 'current' | 'upcoming';
}

/** A single step within the Stage Detail view */
export interface StageStep {
  step: number;
  title: string;
  subtitle: string;
  status: 'done' | 'current';
}

/** A single update in the Updates feed */
export interface UpdateItem {
  title: string;
  date: string;
}

/** Property details shown on the Property screen */
export interface PropertyData {
  address: string;
  purchasePrice: string;
  status: string;
}