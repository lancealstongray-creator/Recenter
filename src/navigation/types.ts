export type RootStackParamList = {
  Onboarding: undefined;
  // Optional nested screen param so "Return Home" from a session's
  // completion screen can both dismiss the modal and land specifically
  // on the Home tab, even if the user started the session from History
  // or Profile.
  Main: { screen: keyof MainTabParamList } | undefined;
  DailyRecenter: undefined;
  EveningReflection: undefined;
  MiddayReset: undefined;
  WindDown: undefined;
  Tour: undefined;
  // Reframed History — reached via a link from Journal or Profile, never
  // a tab. Route name is new; the underlying screen component/file stays
  // HistoryScreen.tsx to avoid unnecessary rename churn.
  ArchivedJourney: undefined;
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
  // Journal is the primary reflection/writing destination. The old
  // History/Journey tab is retired from the tab bar entirely — its
  // content lives on as ArchivedJourney, reached via a link.
  Journal: undefined;
  Profile: undefined;
};
