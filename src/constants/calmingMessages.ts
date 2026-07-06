import { SessionType } from '../types';

// One short, calm line per time-of-day window — shown right under the
// greeting, distinct from the rotating "daily encouragement" line
// further down the Home screen.
export const CALMING_MESSAGES: Record<SessionType, string> = {
  morning: 'Take a breath before your day picks up speed.',
  midday: 'A quiet pause is enough.',
  evening: 'The day is softening — you can too.',
  windDown: 'Almost time to rest.',
};
