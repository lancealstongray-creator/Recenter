# Sprint 3 Engineering Handoff

**This document is permanent.** It represents the complete engineering
state at the close of Sprint 3 and must never be modified after Sprint 3
is complete. Corrections or updates to current state belong in
`docs/engineering/PROJECT_STATE.md`; this file is the historical record.

Merged: PR #8, commit `99d501f`, into `main`.

---

## Executive Summary

Sprint 3 implemented the Board-approved design package on top of the
already-merged Today Experience work (Sprint 2 / PR #7): a navigation
rebuild to Today (Home) / Journal / Profile, a genuinely new Journal
freeform-writing feature, a reframing of the former History/Journey
screen into Archived Journey, a confidence-based layer on top of the
existing deterministic Recommended Sessions engine, and a full redesign
of the Session Completion screen (v2). ESLint was introduced to the
repository for the first time and wired into CI and the pre-commit hook.
A dedicated pre-merge architecture consistency review was performed
before merging, catching and fixing two small issues (an unused asset,
a duplicated color value) with zero user-visible behavior change.

The repository is fully validated (typecheck, lint, test, build all
green) and merged to `main` as the current baseline.

## Repository Status

- **Base branch:** `main`
- **Merged PR:** #8
- **Feature branch:** `claude/sprint3-today-journal-profile` — deleted
  locally; remote deletion was attempted but denied by this session's git
  push permissions (403); no GitHub API tool for branch deletion was
  available either. The remote branch may still exist and can be deleted
  manually or by a future session with appropriate permissions — it is
  fully merged and safe to delete at any time.
- **CI:** green on the final merged commit.

## Major Architectural Changes

- **Confidence layer added on top of, not instead of, the existing
  recommendation engine.** `src/utils/recommendation.ts` is new. It
  calls `adaptiveRhythms.ts`'s `recommendSession()` unchanged to decide
  *which* session type to recommend, then separately computes a
  `confident` boolean by checking whether that same session type was
  completed on at least 5 of the last 7 calendar days (excluding today).
  This was a direct product decision, reconciling a real conflict: the
  design package's approved Sprint 3 language described a system with
  only "Morning/Evening Recenter" as defaults and no Midday/Wind Down
  session types at all, which would have required removing already-
  shipped, tested functionality. The Board's explicit ruling (recorded
  in this sprint's conversation) was to preserve all 4 session types as
  first-class, and to have Adaptive Rhythms determine *which existing*
  session is surfaced, never which sessions exist. The engine reflects
  that ruling precisely.
- **Journal is genuinely new storage, not a repurposing.** A
  `JournalEntry` type and a new `@recenter/journalEntries` AsyncStorage
  key were added, storing a flat array (append-only) rather than a
  date-keyed map, because — unlike every other entry type in this app —
  multiple Journal entries can exist for the same day.
- **Archived Journey is the same component, restyled.**
  `HistoryScreen.tsx` was not renamed or replaced; its route changed
  (`ArchivedJourney`, pushed from `RootStackParamList`, not a tab) and
  its rendering logic changed (season grouping via a new
  `formatSeasonLabel()`, a perspective line via a new `monthsSince()`,
  representative excerpts replacing the already-count-free area chips).
- **Session Completion v2 removed the "Done" exit path entirely.** The
  previous `onDone` prop (return to whatever screen/tab was active
  before the session) was removed from `SessionCompleteScreen`'s
  interface and every one of its 4 call sites. The only ways to leave
  Session Completion now are "Return to Today" (always Home) or, via
  "Sit a Moment," a delayed quiet link that also always returns to
  Today. This was an explicit product simplification per the Sprint 3
  design package, not an oversight.

## Navigation Changes

| Before (post-Sprint 2) | After (post-Sprint 3) |
|---|---|
| Tab bar: Home, Journey (labeled), Profile | Tab bar: Home, Journal, Profile |
| `History` route in `MainTabParamList` | Removed from `MainTabParamList` entirely |
| — | `ArchivedJourney` added to `RootStackParamList`, pushed (`slide_from_right`), reached only via a link from Journal or Profile |
| — | `Journal` route added to `MainTabParamList`, backed by new `JournalScreen.tsx` |

No changes to the onboarding stack, the 4 session-flow modal routes
(`DailyRecenter`, `EveningReflection`, `MiddayReset`, `WindDown`), or
`Tour`.

## New Components

- `src/components/InlineNotice.tsx` — shared error-state pattern
  (`errorSoft` background, `error` text, single "Try again" text action),
  consuming `AppContext.errorMessage`. Wired into `HomeScreen` and
  `JournalScreen`.
- `src/components/PageTurn.tsx` — horizontal settle reveal (translateX +
  opacity), reserved for Journal entries and Archived Journey rows
  appearing.
- `src/components/SessionPickerSheet.tsx` — modal bottom sheet (radius
  32) listing all 4 session types as a plain, unranked user choice.
- `src/screens/journal/JournalScreen.tsx` — new screen: docked composer,
  unified most-recent-first feed, optional prayer toggle, "Private by
  design" first-use line, link to Archived Journey.
- `src/utils/recommendation.ts` — the confidence layer described above.

## Modified Components

- `src/components/SessionCompleteScreen.tsx` — rebuilt for v2 (see
  above); now uses the new `elevation.hero` token.
- `src/screens/home/HomeScreen.tsx` — primary card now reads
  `getRecommendation()` instead of `recommendSession()` directly; added
  the "Or choose something else" link and `SessionPickerSheet`; added
  `InlineNotice`.
- `src/screens/history/HistoryScreen.tsx` — reframed as Archived Journey
  (see above). Same file, not renamed.
- `src/navigation/MainTabNavigator.tsx`, `src/navigation/RootNavigator.tsx`,
  `src/navigation/types.ts` — route changes described above.
- `src/screens/profile/ProfileScreen.tsx` — added the on-device trust
  line to "About Recenter" and a link to Archived Journey.
- `src/screens/tour/TourScreen.tsx` — stop 3 copy updated from Journey to
  Journal.
- `src/screens/onboarding/NotificationsScreen.tsx` — removed one genuinely
  unused variable (`updateProfile`), caught by the new ESLint setup.
- `src/theme/theme.ts` — added `elevation.hero` (e3 tier) and
  `motion.pageTurn` (translateX distance + duration).
- `src/types/index.ts`, `src/storage/storage.ts`, `src/context/AppContext.tsx`
  — `JournalEntry` type, journal storage functions, and context wiring
  (state, `addJournalEntry` action, inclusion in `resetAllData`).
- `src/utils/date.ts` — added `formatSeasonLabel()` and `monthsSince()`.
- All 4 session-flow screens (`DailyRecenterScreen`,
  `EveningReflectionScreen`, `MiddayResetScreen`, `WindDownScreen`) — the
  `onDone={close}` prop was removed from their `SessionCompleteScreen`
  call sites; `close()` itself remains in use for each screen's own
  close (×) button on earlier steps.

## Testing Results

65 tests across 8 suites, all passing:

- `src/utils/pick.test.ts`
- `src/utils/date.test.ts` — including new `formatSeasonLabel` and
  `monthsSince` coverage
- `src/storage/storage.test.ts` — including new Journal append/load
  coverage
- `src/context/AppContext.test.tsx` — including new Journal entry
  persistence, prayer flag, and relaunch-survival coverage
- `src/navigation/types.test.ts`
- `src/flags/featureFlags.test.ts`
- `src/utils/adaptiveRhythms.test.ts`
- `src/utils/recommendation.test.ts` — new: confidence-threshold
  behavior, "today never counts toward its own confidence," "a single
  unusual day doesn't flip confidence," and "confidence never changes
  which session type is recommended"

## Validation Results

At merge time, against the final commit on `main`:

- `npx tsc --noEmit` — clean
- `npm run lint` — 0 errors, 2 pre-existing/intentional warnings (see
  `TECH_DEBT.md` L1)
- `npm test` — 65/65 passing, 8 suites
- `npm run build` (`tsc --noEmit && expo export --platform web`) —
  succeeds
- CI ("Typecheck, lint, test, build") — green on the merge commit
- Full Playwright walkthrough on Expo web: onboarding → recommended
  session card → "Or choose something else" → Session Picker → Wind
  Down → Session Completion v2 (including "Sit a Moment" and its delayed
  "Return to Today" fade-in) → Journal entry with prayer toggle →
  Archived Journey — zero console errors throughout, screenshots
  visually verified against the design spec

## Technical Decisions Made

1. **Preserved all 4 session types** rather than following the design
   package's literal Sprint 3 wording, per direct Board guidance
   reconciling a real conflict between already-shipped work and the
   uploaded design document. See "Major Architectural Changes" above.
2. **Did not build a separate "redo onboarding" flow.** Profile's
   existing in-place editing of life areas and faith preference already
   satisfies the underlying need from the original Sprint 1 QA finding
   ("no lightweight way to redo onboarding preferences"). Building a
   second, parallel UI path into the onboarding screens for the same
   data was judged to be redundant and against "favor maintainability
   over unnecessary abstraction."
3. **Introduced ESLint with two calibration decisions**, not a default
   config: downgraded two React Compiler rules that flagged long-standing
   correct animation idioms, and disabled `react/no-unescaped-entities`
   (miscalibrated for RN prose copy). Documented in `eslint.config.js`
   inline and in `TECH_DEBT.md` L2.
4. **Journal's feed is computed at render time from existing state**,
   not a new denormalized copy of session data — avoids a second source
   of truth for the same reflection text.
5. **Season labels never include a year**, matching the design system's
   literal examples, with the resulting multi-year ambiguity
   consciously accepted and documented rather than solved speculatively
   (see `TECH_DEBT.md` M2).

## Remaining Technical Debt

See `docs/engineering/TECH_DEBT.md` for the full register. Summary as of
this handoff:

- **Medium:** animation primitive duplication (M1), season label year
  ambiguity (M2), Archived Journey missing Midday/Wind Down entries (M3,
  pre-existing).
- **Low:** two intentional ESLint warnings (L1), three deliberately
  disabled ESLint rules with documented rationale (L2), pre-existing
  peer dependencies with no direct import (L4).
- Nothing assessed as High risk.

## Risks

- **Remote feature branch not deleted.** `claude/sprint3-today-journal-profile`
  may still exist on `origin` — fully merged, safe to delete whenever a
  session with sufficient git permissions does so. No functional risk.
- **No native build validation in CI.** If native (iOS/Android)
  distribution becomes an active goal, the current CI (web export only)
  would not catch a native-only regression. Not a risk today since the
  app has no native distribution in progress.
- **Journal has no edit/delete.** If a future sprint's design package
  assumes editability, that would be new scope, not a bug fix — flagged
  here so it isn't mistaken for an oversight.

## Recommendations for the Next Sprint

1. Before any new product work begins, read `PROJECT_STATE.md` for the
   current baseline and `TECH_DEBT.md` for what's already known and
   deliberately deferred — don't rediscover these from scratch.
2. If the next design package touches animation, motion, or introduces a
   new "signature moment," coordinate with `TECH_DEBT.md` M1 — it may be
   the right time to extract the shared reveal hook rather than adding a
   fifth near-duplicate component.
3. If the next design package touches Archived Journey or Journal, note
   the existing data-reuse pattern (Journal reads session entries live,
   doesn't duplicate them) and the known gap (Archived Journey doesn't
   yet read Midday/Wind Down) before assuming either is a blank slate.
4. Confirm early whether any upcoming spec assumes Journal
   editing/deletion, native notification delivery, or multi-year
   Archived Journey history — all three are currently out of scope by
   design, not by oversight, and would be new engineering work if
   requested.
