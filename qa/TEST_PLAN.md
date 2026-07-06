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
3. Recommended Sessions must behave predictably. *(not yet implemented — see note below)*
4. Adaptive Rhythms must never create confusion, shame, or broken daily state. *(not yet implemented — see note below)*
5. Missed days must not punish or shame the user.
6. Returning users must resume without friction.
7. Time-based recommendations must survive midnight, time zones, and missed days.

> **Note on rules 3 and 4:** as of this writing, neither a "Recommended
> Sessions" ranking/prioritization system nor an "Adaptive Rhythms"
> fallback/default system exists anywhere in the codebase (confirmed via
> `grep -ri "recommend\|adaptive"` across `src/` — zero matches). The only
> time-based logic today is `greetingForNow()` (morning/afternoon/evening
> greeting text) and the single Daily Recenter → Evening Reflection
> sequence gated by whether today's entries exist. Scenarios below that
> reference Recommended Sessions / Adaptive Rhythms are written against
> **today's actual behavior** and marked `N/A — not implemented`
> where the plan's language doesn't map to anything real yet. Do not treat
> these as bugs; treat them as the honest current baseline. When either
> system is actually built, promote these from placeholders to real
> scenarios.

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

*(Recenter's actual implementation: a single greeting-text function, not a
recommendation engine — see note above.)*

| ID | Scenario | Severity | Automated? |
|----|----------|----------|------------|
| QA-TOD-01 | Greeting reads "Good morning" for hour < 12 | Medium | **Automated** — `src/utils/date.test.ts` |
| QA-TOD-02 | Greeting reads "Good afternoon" for 12 ≤ hour < 17 | Medium | **Automated** — `src/utils/date.test.ts` |
| QA-TOD-03 | Greeting reads "Good evening" for hour ≥ 17 | Medium | **Automated** — `src/utils/date.test.ts` |
| QA-TOD-04 | Home shows the Daily Recenter card regardless of time of day if today's entry doesn't exist yet — a user can do their "Morning" session in the evening without friction or judgment | High | Manual |
| QA-TOD-05 | *Recommended Sessions priority ranking* | — | **N/A — not implemented.** No ranking/prioritization system exists. |
| QA-TOD-06 | *Adaptive Rhythms fallback/default behavior* | — | **N/A — not implemented.** No adaptive system exists; the only "default" is the fixed 5-step Daily Recenter engine, which has no fallback branches to test. |

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

---

## Coverage summary

- **Automated today:** 32 Jest tests across 6 suites — the data/logic layer
  where the QA rules actually live (dedup, no data loss, resume, time
  math, flag hygiene).
- **Manual today:** full-flow UI journeys (onboarding screens, session
  screens, Journey, Profile, Tour) — see `smoke-checklist.md` and
  `regression-checklist.md`. These are documented, not automated, because
  component/navigation-level RN testing (mocking React Navigation,
  AsyncStorage, and Expo font loading together) is a larger lift than this
  stabilization pass calls for; see `qa/README.md` for the reasoning and
  the recommended next step.
