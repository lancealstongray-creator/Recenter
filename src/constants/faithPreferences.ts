import { FaithPreference } from '../types';

export const FAITH_PREFERENCES: { id: Exclude<FaithPreference, null>; label: string; description: string }[] = [
  {
    id: 'faith',
    label: 'Faith-Based',
    description: 'Include a faith perspective in your daily moments.',
  },
  {
    id: 'general',
    label: 'General',
    description: 'Keep it reflective, without a faith lens.',
  },
  {
    id: 'decide_later',
    label: 'Decide Later',
    description: "No need to choose now — you can change this anytime.",
  },
];
