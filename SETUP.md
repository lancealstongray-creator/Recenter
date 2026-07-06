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

## Test, debug, verify

See **`qa/README.md`** for the full workflow. Quick reference:

```bash
npm run typecheck    # tsc --noEmit
npm test             # run the Jest suite once
npm run test:watch   # Jest in watch mode
npm run build        # typecheck + expo export --platform web
npm run verify       # typecheck + test — same as the pre-commit hook runs
```

A Husky pre-commit hook (`.husky/pre-commit`) runs `npm run verify`
automatically; a failing verify blocks the commit. `.github/workflows/ci.yml`
runs the same checks on every push/PR.

Environment variables: none required today — see `.env.example`.

## Project structure

```
App.tsx                        # entry point, loads fonts, wraps app in providers
babel.config.js                # required for both Expo and Jest transforms
jest.setup.ts                  # global test setup (mocks AsyncStorage)
src/
  components/                  # shared UI (buttons, layouts, chips, motion helpers, etc.)
  constants/                   # life areas, moods, evening prompts, encouragements, focus suggestions
  context/                     # AppContext — the single source of truth for profile/entries/transient state
  flags/                       # Phase 2/3 feature flags (all off, not wired to any UI)
  navigation/                  # RootNavigator, OnboardingNavigator, MainTabNavigator
  screens/
    onboarding/                # 6-screen onboarding flow (Welcome → Notifications)
    home/                      # Home tab
    history/                   # Journey tab (route/component/file still named History; label is "Journey")
    profile/                   # Profile tab
    dailyRecenter/             # Daily Recenter modal flow (also runs the real first Morning Session)
    eveningReflection/         # Evening Reflection modal flow
    tour/                      # Optional 4-stop app tour
  storage/                     # AsyncStorage read/write helpers, error-safe (typed ok/error results)
  theme/                       # colors, spacing, typography, elevation, motion tokens
  types/                       # shared TypeScript types
  utils/                       # date (mockable clock), deterministic daily picks, motion hooks, notifications
qa/                            # test plan, checklists, bug template, coverage map, fixtures — see qa/README.md
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
