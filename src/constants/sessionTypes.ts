import { SessionType } from '../types';

export const SESSION_ORDER: SessionType[] = ['morning', 'midday', 'evening', 'windDown'];

export const SESSION_META: Record<SessionType, { label: string; blurb: string; icon: string }> = {
  morning: {
    label: 'Morning Session',
    blurb: 'A quiet moment before your day picks up speed.',
    icon: 'sunny-outline',
  },
  midday: {
    label: 'Midday Reset',
    blurb: 'A brief pause to reset in the middle of your day.',
    icon: 'partly-sunny-outline',
  },
  evening: {
    label: 'Evening Reflection',
    blurb: 'Take a few quiet minutes to reflect on your day.',
    icon: 'moon-outline',
  },
  windDown: {
    label: 'Wind Down',
    blurb: 'A short pause before rest.',
    icon: 'bed-outline',
  },
};
