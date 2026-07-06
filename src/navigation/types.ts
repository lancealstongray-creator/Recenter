export type RootStackParamList = {
  Onboarding: undefined;
  Main: undefined;
  DailyRecenter: undefined;
  EveningReflection: undefined;
};

export type OnboardingStackParamList = {
  Welcome: undefined;
  WhatIsRecenter: undefined;
  ChooseLifeAreas: undefined;
  FaithPreference: undefined;
  OneFocusSetup: undefined;
  Notifications: undefined;
};

// Index of each screen within the linear onboarding flow — used both for
// the progress dots and to persist/resume the user's exact position.
export const ONBOARDING_STEPS: (keyof OnboardingStackParamList)[] = [
  'Welcome',
  'WhatIsRecenter',
  'ChooseLifeAreas',
  'FaithPreference',
  'OneFocusSetup',
  'Notifications',
];

export type MainTabParamList = {
  Home: undefined;
  History: undefined;
  Profile: undefined;
};
