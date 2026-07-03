# Recenter — Phase 1 setup

This is an Expo (React Native + TypeScript) app. It has no backend — all
data is stored locally on-device via AsyncStorage.

## Prerequisites

- Node.js 20+ (tested with Node 22)
- npm 10+
- Expo Go app on your phone (iOS/Android) for the easiest way to run it,
  or Xcode/Android Studio if you want a simulator

## Install

```bash
npm install
```

If `npx expo install` ever complains about a network/proxy error while
adding new packages, use plain `npm install <package>` instead — that's
just an optional compatibility-check step Expo does over the network, not
required for the app to run.

## Run

```bash
npm run start      # opens Expo dev tools / QR code, scan with Expo Go
npm run ios        # requires macOS + Xcode
npm run android    # requires Android Studio / emulator
npm run web        # runs in a browser at http://localhost:8081
```

## Project structure

```
App.tsx                        # entry point, wraps app in providers
src/
  components/                  # shared UI (buttons, layouts, chips, etc.)
  constants/                   # life areas, moods, evening prompts, encouragements
  context/                     # AppContext (profile/entries) + onboarding draft state
  flags/                       # Phase 2/3 feature flags (all off, not wired to any UI)
  navigation/                  # RootNavigator, OnboardingNavigator, MainTabNavigator
  screens/
    onboarding/                # 7-screen onboarding flow
    home/                      # Home tab
    history/                   # History tab
    profile/                   # Profile tab
    dailyRecenter/             # Daily Recenter modal flow
    eveningReflection/         # Evening Reflection modal flow
  storage/                     # AsyncStorage read/write helpers
  theme/                       # colors, spacing, typography
  types/                       # shared TypeScript types
  utils/                       # date formatting, deterministic daily picks
```

## Notes

- No accounts, no backend, no network calls — everything persists locally
  via `@react-native-async-storage/async-storage`.
- Product guardrails (no streaks, no gamification, no missed-day/guilt
  messaging, one daily focus) are enforced directly in the screens — see
  `src/screens/history/HistoryScreen.tsx` and
  `src/screens/dailyRecenter/DailyRecenterScreen.tsx`.
- Phase 2/3 features are listed as disabled flags in
  `src/flags/featureFlags.ts` and are not referenced by any screen.
- To reset all local data during testing, use the "Reset my data" button
  on the Profile tab.
