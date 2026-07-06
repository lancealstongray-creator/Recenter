# Recenter — Project State

**This is a living document.** Update it at the close of every sprint so it
always reflects the true current state of the repository — not the plan,
the actual baseline.

Last updated: end of Sprint 3.

---

## Current Sprint

Sprint 3 is **closed and merged**. The repository is not currently mid-sprint;
Sprint 4 has not begun.

## Current Branch

`main`. All Sprint 1–3 work is merged. No active feature branch exists as of
this writing.

## Latest Merged PR

- **PR #8** — "Sprint 3: Today/Journal/Profile nav, Journal, Archived Journey,
  confidence-based Recommended Sessions, Session Completion v2" — merged into
  `main` at commit `99d501f`.
- Prior merged PRs, in order: #1–#5 (Phase 1 build-out and Sprint 1 design
  refinement), #6 (QA stabilization foundation), #7 (Today Experience:
  Recommended Sessions v1, Adaptive Rhythms, Session Completion v1).

## Current Architecture

Local-first Expo/React Native app. No backend, no auth, no network
dependency for any feature. Every screen reads/writes through a single
React Context (`AppContext`), which is the only caller of the storage
layer (`src/storage/storage.ts`), which is the only caller of
`AsyncStorage`. No screen ever imports `AsyncStorage` or `storage.ts`
directly — this boundary is verified as part of the Sprint 3 architecture
review.

```
Screen  →  AppContext (React Context)  →  storage.ts (repository)  →  AsyncStorage
```

## Technology Stack

| Layer | Choice | Version |
|---|---|---|
| Framework | Expo (managed workflow) | ~57.0.2 |
| UI | React Native | 0.86.0 |
| Language | TypeScript | ~6.0.3 |
| Runtime | React | 19.2.3 |
| Navigation | React Navigation (native-stack + bottom-tabs) | ^7.3.6 |
| Persistence | `@react-native-async-storage/async-storage` | — |
| Fonts | `@expo-google-fonts/instrument-serif`, `@expo-google-fonts/inter` via `expo-font` | — |
| Testing | Jest (`jest-expo` preset) + `@testing-library/react-native` | ^29.7.0 |
| Linting | ESLint (flat config) + `eslint-config-expo` | ^9.39.4 / ^57.0.0 |
| CI | GitHub Actions (`.github/workflows/ci.yml`) | — |
| Git hooks | Husky pre-commit running `npm run verify` | — |

No Redux/MobX/Zustand, no Supabase, no AI/LLM integration, no cloud sync.
These are explicit architectural constraints, not gaps.

## Navigation Structure

Three-tab primary navigation, wrapped in a root native-stack:

```
RootNavigator (native-stack)
├── Onboarding (shown until profile.onboardingComplete)
├── Main (MainTabNavigator, bottom-tabs)
│   ├── Home        — Today: greeting, recommended session card, One Focus
│   ├── Journal      — freeform writing + unified reflection feed
│   └── Profile      — identity, preferences, settings
├── DailyRecenter    — modal, Morning Session
├── EveningReflection — modal
├── MiddayReset      — modal
├── WindDown         — modal
├── Tour             — modal, optional post-onboarding walkthrough
└── ArchivedJourney  — pushed (slide from right), reached only via a link
                        from Journal or Profile, never a tab
```

`HistoryScreen.tsx` is the unchanged file/component backing the
`ArchivedJourney` route — the file was deliberately not renamed to avoid
unnecessary rename churn; only the route name and the screen's copy
changed.

## State Management Architecture

Single `AppContext` (`src/context/AppContext.tsx`), no additional global
state library. Holds:

- `profile: UserProfile`
- `dailyEntries`, `eveningEntries`, `middayEntries`, `windDownEntries` —
  `Record<dateKey, Entry>`, one entry per day per session type
- `journalEntries: JournalEntry[]` — a flat array (not keyed by date),
  since multiple freeform entries can exist per day
- `errorMessage: string | null` — surfaced from any failed storage call,
  consumed by the shared `InlineNotice` component
- Onboarding hand-off flags: `justOnboarded`, `pendingFirstFocus`

Every mutating action (`saveDailyEntry`, `addJournalEntry`, etc.) calls
into `storage.ts`, updates local state from the repository's return value,
and sets `errorMessage` on failure. No screen mutates state directly.

## Repository Structure

```
src/
  components/     shared, reusable UI + motion primitives
  constants/      static content (moods, life areas, session type metadata, copy)
  context/        AppContext — the single state boundary
  flags/          FEATURE_FLAGS (Phase 2/3 switches, all false)
  navigation/     RootNavigator, MainTabNavigator, OnboardingNavigator, route types
  screens/        one directory per screen, feature-organized
  storage/        the repository — the only AsyncStorage caller
  theme/          design tokens (colors, spacing, radii, typography, elevation, motion)
  types/          shared TypeScript interfaces/types
  utils/          date/time, motion hooks, pick (deterministic daily selection),
                  adaptiveRhythms (recommendation engine), recommendation
                  (confidence layer), connectivity, notifications
qa/               QA test plan, coverage map, smoke/regression checklists
docs/engineering/ this document set
.github/workflows/ci.yml   CI: typecheck, lint, test, build
```

## Major Architectural Decisions

- **Repository pattern, strictly enforced.** No screen ever imports
  `AsyncStorage` or `storage.ts`. Verified by grep as part of the Sprint 3
  architecture review; worth re-verifying at the start of any future
  sprint that touches data flow.
- **Recommended Sessions is deterministic, not AI.** `adaptiveRhythms.ts`
  owns *which* of the 4 session types is recommended (a pure time-window
  forward-scan, "never recommend a missed session"). `recommendation.ts`
  is a confidence *layer* on top — it changes only card copy ("Suggested
  for you" vs. the plain default), never which session type is chosen.
  This split is deliberate and documented in both files' comments.
- **Journal reuses existing session data rather than duplicating it.**
  Journal's feed merges freeform `JournalEntry` records with existing
  `dailyEntries`/`eveningEntries`/`middayEntries`/`windDownEntries` text
  fields at render time — there is no separate "session excerpt" storage.
- **Archived Journey is a reframing, not a rebuild.** `HistoryScreen.tsx`
  is the same file/component from Phase 1, restyled and regrouped
  (season instead of month, perspective line instead of a counter,
  representative excerpts instead of tallies) rather than replaced.
- **"Redo onboarding" was deliberately not built as a separate flow.**
  Profile already provides full in-place editing of life areas and faith
  preference; a second UI path re-entering the onboarding screens for the
  same data was judged to be redundant, potentially confusing scope
  creep rather than a genuine gap. See `docs/engineering/HANDOFFS/Sprint-3.md`
  for the full reasoning.
- **Animation primitives are intentionally named and separate, not
  generic.** `ArrivalMark`, `QuietReveal`, `StepFade`, and `PageTurn` share
  similar code shape but carry distinct semantic meaning per the design
  system (completion vs. state-arrival vs. step-transition vs.
  reflection/memory) and are deliberately not collapsed into one
  parameterized component. See `TECH_DEBT.md`.

## Active Feature Flags

All flags in `src/flags/featureFlags.ts` remain `false`. Nothing below is
rendered, routed to, or referenced by any shipped screen:

```
phase2: streaksAndConsistencyScores, badgesAndGamification, socialSharing,
        customLifeAreas, multipleDailyFocuses, insightsDashboard
phase3: coachOrTherapistSharing, aiReflectionSummaries, communityFeatures,
        exportAndIntegrations
```

`src/flags/featureFlags.test.ts` asserts every flag is `false` — this test
must never be relaxed without an explicit product decision to ship one.

## Known Limitations

- **No ESLint auto-fix pass has been run beyond the Sprint 3 setup pass.**
  Two harmless warnings remain (a necessary `require()` in
  `jest.setup.ts`, a benign `useMemo` dependency note in `HomeScreen.tsx`)
  — see `TECH_DEBT.md`.
- **Season/perspective date labels don't disambiguate across years.**
  `formatSeasonLabel()` never includes a year (matching the design
  spec's examples), so a multi-year installation would show, e.g., two
  "Summer" section headers for two different years with no visual
  distinction. Low risk today since the app is new; flagged in
  `TECH_DEBT.md`.
- **Journal has no delete/edit action.** Entries can only be added, never
  removed or corrected after saving. Not specified by any approved design
  package to date — flagged as an open product question, not an
  engineering gap, in `ROADMAP.md`.
- **Archived Journey does not yet surface Midday Reset / Wind Down
  entries** — it only reads `dailyEntries` and `eveningEntries`. This
  predates Sprint 3 (flagged already in the Sprint 2 handoff) and remains
  open.
- **No native push notification delivery exists.** `notificationsEnabled`
  is captured in onboarding and `expo-notifications` is a dependency, but
  no notification is ever actually scheduled or sent. Notification
  Preferences is explicitly an approved *future* surface per the Sprint 3
  design package, not a current gap.

## Current Development Baseline

`main` at commit `99d501f` (merge of PR #8) is the official baseline.
`npx tsc --noEmit`, `npm run lint`, `npm test` (65/65, 8 suites), and
`npm run build` all pass cleanly against this commit.

## Next Engineering Priorities

See `ROADMAP.md` for the full list. Highest-priority items carried
forward from Sprint 3:

1. Decide whether to extract a shared animation-reveal hook (see
   `TECH_DEBT.md`, medium risk, deferred deliberately).
2. Decide whether Archived Journey should include Midday/Wind Down
   entries (pre-existing gap, not new in Sprint 3).
3. Confirm whether Journal needs edit/delete before any broader rollout.
