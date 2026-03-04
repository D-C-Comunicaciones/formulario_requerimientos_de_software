export interface Functionality {
  id: string;
  name: string;
  description: string;
  purpose: string;
  priority: 'Alta' | 'Media' | 'Baja';
  isEssential: boolean;
}

export interface Reference {
  id: string;
  url: string;
  description: string;
}

export interface FormData {
  // Step 1 - General Info
  fullName: string;
  company: string;
  email: string;
  phone: string;
  country: string; // Código ISO del país (ej: 'CO', 'US', 'AR')
  city: string;
  address: string;
  preferredContact: string;

  // Step 2 - Problem
  currentSituation: string;
  desiredImprovement: string;
  currentProcess: string;
  difficulties: string;

  // Step 3 - Objective
  desiredResult: string;
  successCriteria: string;

  // Step 4 - Functionalities
  functionalities: Functionality[];

  // Step 5 - Users
  userTypes: string;
  userCount: string;
  userDescription: string;

  // Step 6 - References
  references: Reference[];

  // Step 7 - Budget & Timeline
  launchDate: string;
  budgetRange: string;
}

export const initialFormData: FormData = {
  fullName: '',
  company: '',
  email: '',
  phone: '',
  country: '',
  city: '',
  address: '',
  preferredContact: '',
  currentSituation: '',
  desiredImprovement: '',
  currentProcess: '',
  difficulties: '',
  desiredResult: '',
  successCriteria: '',
  functionalities: [],
  userTypes: '',
  userCount: '',
  userDescription: '',
  references: [{ id: '1', url: '', description: '' }],
  launchDate: '',
  budgetRange: '',
};
