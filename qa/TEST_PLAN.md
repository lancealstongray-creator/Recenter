# Recenter — Core User Journey QA Test Plan

This is the source of truth for QA coverage on Recenter. Every scenario has a
stable **QA ID** referenced from `coverage-map.md`, `smoke-checklist.md`,
`regression-checklist.md`, and automated test files (in comments) so a
scenario, its manual checklist entry, and its automated test — if one
exists — can always be traced back to each other.

Severity: **Critical** (breaks a QA rule below, ships broken), **High**
(bad experience but not data-unsafe), **Medium** (polish).

## QA rules (must never be violated)

1. No duplicate session completions.
2. No reflection/session data loss.
3. Recommended Sessions must behave predictably.
4. Adaptive Rhythms must never create confusion, shame, or broken daily state.
5. Missed days must not punish or shame the user.
6. Returning users must resume without friction.
7. Time-based recommendations must survive midnight, time zones, and missed days.

> **Update:** Recommended Sessions and Adaptive Rhythms are now
> implemented (`src/utils/adaptiveRhythms.ts`), as a deterministic,
> non-AI time-window + completion-state engine covering all 4 session
> types (Morning, Midday, Evening, Wind Down). QA-TOD-05/06 below have
> been promoted from placeholders to real scenarios; see section 3 and
> the new section 8 for full coverage.

---

## 1. Onboarding flow

| ID | Scenario | Severity | Automated? |
|----|----------|----------|------------|
| QA-ONB-01 | Welcome → What is Recenter → Choose Life Areas → Faith Preference → One Focus Setup → Notifications, in order | High | Manual (see smoke checklist) |
| QA-ONB-02 | Choose Life Areas requires exactly 3; 4th+ chip dims and is inert | High | Manual |
| QA-ONB-03 | Faith Preference: exactly 2 choices, no forced stance, helper text present | Medium | Manual |
| QA-ONB-04 | One Focus Setup: suggestions generated from the 3 chosen life areas; custom entry and skip both work | High | Manual |
| QA-ONB-05 | Notifications: OS permission is requested only after the user picks "Yes, remind me" — never on load | Critical | Manual (permission prompt not simulatable headless) |
| QA-ONB-06 | Onboarding progress (step + every answer so far) persists to storage after each screen | Critical | **Automated** — `src/context/AppContext.test.tsx` |
| QA-ONB-07 | Interrupted onboarding (app killed/reloaded mid-flow) resumes at the exact same screen with prior answers intact, not a restart | Critical | **Automated** — `src/context/AppContext.test.tsx`, `src/navigation/types.test.ts` |
| QA-ONB-08 | Completing onboarding transitions directly into the real first Morning Session — no simulated tutorial | Critical | Manual |
| QA-ONB-09 | The real first Morning Session's One Focus step is pre-filled with the onboarding choice, editable, not asked twice | High | **Automated** (hand-off flags) — `src/context/AppContext.test.tsx`; UI prefill Manual |
| QA-ONB-10 | "You're Ready" screen appears once, after the first session, before Home — never again on subsequent sessions | High | Manual |
| QA-ONB-11 | No mandatory account creation anywhere in onboarding | Critical | Manual (structural — confirm no such screen exists) |

## 2. First session after onboarding

| ID | Scenario | Severity | Automated? |
|----|----------|----------|------------|
| QA-SES-01 | First real session runs through the identical 5-step engine as every later day (Greeting → Mood → Life Area Reminder → One Focus → Encouragement) | Critical | Manual |
| QA-SES-02 | First session's completion is recorded in `dailyEntries` keyed by today's date | Critical | **Automated** — `src/context/AppContext.test.tsx`, `src/storage/storage.test.ts` |
| QA-SES-03 | `justOnboarded` / `pendingFirstFocus` are consumed exactly once and cleared — a second session the same day does not re-trigger the "first session" UI | Critical | **Automated** — `src/context/AppContext.test.tsx` |

## 3. Morning / afternoon / evening session recommendation

| ID | Scenario | Severity | Automated? |
|----|----------|----------|------------|
| QA-TOD-01 | Greeting reads "Good morning" for hour < 12 | Medium | **Automated** — `src/utils/date.test.ts` |
| QA-TOD-02 | Greeting reads "Good afternoon" for 12 ≤ hour < 17 | Medium | **Automated** — `src/utils/date.test.ts` |
| QA-TOD-03 | Greeting reads "Good evening" for hour ≥ 17 | Medium | **Automated** — `src/utils/date.test.ts` |
| QA-TOD-04 | Home shows the recommended session card regardless of time of day if today's entry for that type doesn't exist yet — a user can do their "Morning" session in the evening without friction or judgment | High | Manual |
| QA-TOD-05 | Recommended Sessions priority ranking: exactly one session type is recommended at a time, chosen by scanning forward from the current time window through the day's remaining session types | Critical | **Automated** — `src/utils/adaptiveRhythms.test.ts` |
| QA-TOD-06 | Adaptive Rhythms fallback/default behavior: when all 4 session types are complete for today, no session is recommended and Home shows the resting empty state instead | High | **Automated** — `src/utils/adaptiveRhythms.test.ts`; UI Manual |

## 4. Missed day / absence / return behavior

| ID | Scenario | Severity | Automated? |
|----|----------|----------|------------|
| QA-ABS-01 | A day with no entries is simply absent from Journey — no red flag, no "missed" label, no gap indicator | Critical | Manual (structural — `HistoryScreen` only ever renders dates that exist in storage) |
| QA-ABS-02 | Returning after N days away shows today's Home state normally; nothing on Home references the gap | Critical | Manual |
| QA-ABS-03 | Journey's summary count ("You've recentered N days") reflects total days with an entry, not a consecutive streak, and never resets or penalizes for a gap | Critical | Manual (structural — `HistoryScreen` counts `Object.keys`, no streak logic exists in the codebase at all) |
| QA-ABS-04 | Life-area chips in Journey show icon + label only, no numeric counts (post Sprint-1 fix) | Medium | Manual |

## 5. Data integrity

| ID | Scenario | Severity | Automated? |
|----|----------|----------|------------|
| QA-DATA-01 | Saving a Daily Recenter entry twice for the same date overwrites, never duplicates (keyed by date) | Critical | **Automated** — `src/storage/storage.test.ts`, `src/context/AppContext.test.tsx` |
| QA-DATA-02 | Saving an Evening Reflection entry twice for the same date overwrites, never duplicates | Critical | **Automated** — `src/storage/storage.test.ts` |
| QA-DATA-03 | An entry for one date is never lost or altered when a different date is saved | Critical | **Automated** — `src/storage/storage.test.ts` |
| QA-DATA-04 | A corrupt/unparseable stored profile fails safely (typed error), the app does not crash, and falls back to defaults | Critical | **Automated** — `src/storage/storage.test.ts` |
| QA-DATA-05 | A rejected AsyncStorage write surfaces a typed `{ok:false,error}` instead of throwing or silently no-oping | High | **Automated** — `src/storage/storage.test.ts` |
| QA-DATA-06 | `resetAllData` clears profile, daily entries, and evening entries together, atomically from the user's perspective | High | **Automated** — `src/context/AppContext.test.tsx` |
| QA-DATA-07 | Reflection data survives a full app relaunch (fresh provider mount reading the same underlying storage) | Critical | **Automated** — `src/context/AppContext.test.tsx` |

## 6. Time / midnight / time zone / clock edge cases

| ID | Scenario | Severity | Automated? |
|----|----------|----------|------------|
| QA-TIME-01 | `todayKey()` rolls over correctly at the midnight boundary (23:59:59 → 00:00:00) | Critical | **Automated** — `src/utils/date.test.ts` |
| QA-TIME-02 | `todayKey()` rolls over correctly across a year boundary (Dec 31 → Jan 1) | Critical | **Automated** — `src/utils/date.test.ts` |
| QA-TIME-03 | Date keys pad single-digit month/day correctly (no `2026-7-6` vs `2026-07-06` mismatches, which would silently fragment history) | Critical | **Automated** — `src/utils/date.test.ts` |
| QA-TIME-04 | Manual: changing the device's time zone mid-session doesn't corrupt an in-progress entry | High | Manual — not automatable without a real device/emulator clock |
| QA-TIME-05 | Manual: setting the device clock backward or forward doesn't crash the app or corrupt existing entries | High | Manual — not automatable without a real device/emulator clock |
| QA-TIME-06 | Deterministic daily picks (`pickForDate` — life-area reminder, encouragement line) are stable within a day and don't flicker between re-renders | Medium | **Automated** — `src/utils/pick.test.ts` |

## 7. Regression guardrails (product guardrails as testable rules)

| ID | Scenario | Severity | Automated? |
|----|----------|----------|------------|
| QA-GUARD-01 | Every Phase 2/3 feature flag remains `false` — nothing deferred ships silently | Critical | **Automated** — `src/flags/featureFlags.test.ts` |
| QA-GUARD-02 | No streak, badge, or "missed day" copy anywhere in the shipped screens | High | Manual (grep-assisted: `grep -ri "streak\|badge\|missed"` across `src/screens` should return nothing product-facing) |
| QA-GUARD-03 | Home never shows more than one recommended session at a time | Critical | **Automated** — `src/utils/adaptiveRhythms.test.ts` (`recommendSession` return type is a single `SessionType \| null`) |
| QA-GUARD-04 | Adaptive Rhythms never recommends a session type whose time window has already passed today (no "missed session" resurfacing, no catch-up pressure) | Critical | **Automated** — `src/utils/adaptiveRhythms.test.ts` |

## 8. Today Experience: Home structure, session completion, empty states

| ID | Scenario | Severity | Automated? |
|----|----------|----------|------------|
| QA-HOME-01 | Home renders in spec order: greeting → calming message → recommended session card → begin button → One Focus (if present) → daily encouragement → bottom nav | High | Manual |
| QA-HOME-02 | Calming message text matches the current time window and is distinct from the rotating daily encouragement line | Medium | Manual |
| QA-HOME-03 | First-time-ever user sees "Let's begin your first moment together." on the recommended session card instead of the type's normal blurb | Medium | Manual |
| QA-HOME-04 | A user who has used other session types but never this one sees a "first [type] for you" variant, not the normal recurring blurb | Medium | Manual |
| QA-HOME-05 | Begin button on the recommended card routes to the correct screen for each of the 4 session types (Morning → DailyRecenter, Midday → MiddayReset, Evening → EveningReflection, Wind Down → WindDown) | Critical | Manual |
| QA-COMPLETE-01 | Every session type (Morning, Midday, Evening, Wind Down) ends on the shared "Nice work." completion screen with the exact spec copy | High | Manual |
| QA-COMPLETE-02 | Completion screen's "Return Home" always lands on the Home tab regardless of which tab was active before the session started | High | Manual |
| QA-COMPLETE-03 | Completion screen's "Done" returns to the previous screen/tab (not forced to Home) | Medium | Manual |
| QA-COMPLETE-04 | When a One Focus exists for today, the completion screen shows a togglable focus-complete control; toggling persists to `dailyEntries[date].focusCompleted` | High | **Automated** (persistence) — `src/context/AppContext.test.tsx`; UI toggle Manual |
| QA-COMPLETE-05 | Completing a session immediately refreshes Home's recommendation (no stale/duplicate card, no manual refresh needed) | Critical | Manual |
| QA-EMPTY-01 | First-time use: Home's recommended card reads "Let's begin your first moment together." | Medium | Manual (see QA-HOME-03) |
| QA-EMPTY-02 | No One Focus selected: quiet block reads "No focus set for today" / "That's completely fine — not every day needs one." — never an error or missing-state look | High | Manual |
| QA-EMPTY-03 | Session already completed today: that session type is skipped by the recommendation scan; if it was the only remaining type, Home shows "You've shown up for yourself today. That's enough." | Critical | **Automated** (logic) — `src/utils/adaptiveRhythms.test.ts`; UI Manual |
| QA-EMPTY-04 | No history: Journey shows a hopeful empty state, never a blank/broken screen | Medium | Manual |
| QA-EMPTY-05 | Offline mode: reassuring banner ("You're offline — Recenter still works. Everything is saved on this device.") shown on Home, all features remain fully usable | Medium | Manual (web only — `useIsOffline` has no native signal without an extra native module) |

---

## Coverage summary

- **Automated today:** 43 Jest tests across 7 suites — the data/logic layer
  where the QA rules actually live (dedup, no data loss, resume, time
  math, flag hygiene, deterministic session recommendation).
- **Manual today:** full-flow UI journeys (onboarding screens, session
  screens, Journey, Profile, Tour) — see `smoke-checklist.md` and
  `regression-checklist.md`. These are documented, not automated, because
  component/navigation-level RN testing (mocking React Navigation,
  AsyncStorage, and Expo font loading together) is a larger lift than this
  stabilization pass calls for; see `qa/README.md` for the reasoning and
  the recommended next step.
