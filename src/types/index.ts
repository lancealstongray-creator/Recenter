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
  focus: string;
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

export type FaithPreference = 'faith' | 'general' | 'decide_later' | null;

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
}
