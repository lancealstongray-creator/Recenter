export interface LifeArea {
  id: string;
  label: string;
  icon: string; // emoji glyph, kept simple to avoid icon-font dependencies
}

export interface Mood {
  id: string;
  label: string;
  icon: string;
}

export interface DailyRecenterEntry {
  date: string; // YYYY-MM-DD
  moodId: string;
  lifeAreaId: string;
  focus: string; // may be blank — One Focus is optional, not required
  // Whether the user has marked today's One Focus as complete. Purely
  // informational — leaving it active carries no penalty or indicator.
  focusCompleted?: boolean;
  completedAt: string; // ISO timestamp
}

export interface EveningReflectionEntry {
  date: string; // YYYY-MM-DD
  highlight: string;
  challenge: string;
  gratitude: string;
  note?: string;
  completedAt: string; // ISO timestamp
}

// The four session types the Today Experience recommends between.
// "morning" reuses the existing Daily Recenter entry; the other three
// are new, intentionally lightweight entries.
export type SessionType = 'morning' | 'midday' | 'evening' | 'windDown';

export interface MiddayResetEntry {
  date: string; // YYYY-MM-DD
  note?: string; // optional — a single quick thought, may be skipped
  completedAt: string; // ISO timestamp
}

export interface WindDownEntry {
  date: string; // YYYY-MM-DD
  note?: string; // optional — a single closing thought, may be skipped
  completedAt: string; // ISO timestamp
}

// A freeform Journal entry — reflection or free writing, distinct from
// the structured session data above. Multiple entries can exist per day,
// so these are stored as a flat list, not keyed by date.
export interface JournalEntry {
  id: string;
  text: string;
  // Shown only when the user's onboarding faith preference enables it —
  // content adapts, the interface never changes shape.
  isPrayer?: boolean;
  createdAt: string; // ISO timestamp
}

export type FaithPreference = 'yes' | 'no' | null;

export interface UserProfile {
  name: string;
  lifeAreaIds: string[];
  onboardingComplete: boolean;
  // Onboarding progress + answers, persisted so an interrupted onboarding
  // resumes at the right screen with prior choices intact.
  onboardingStep: number;
  faithPreference: FaithPreference;
  notificationsEnabled: boolean;
  draftFocus: string;
  // Once true, the "Take a quick tour?" prompt never appears
  // automatically again — only from Profile > Help.
  hasSeenTour: boolean;
}
