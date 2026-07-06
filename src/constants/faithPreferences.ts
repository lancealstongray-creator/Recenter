import { FaithPreference } from '../types';

export const FAITH_PREFERENCES: { id: Exclude<FaithPreference, null>; label: string }[] = [
  { id: 'yes', label: 'Yes, include faith-based encouragement' },
  { id: 'no', label: 'No thanks' },
];
