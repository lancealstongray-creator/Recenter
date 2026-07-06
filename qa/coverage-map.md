# QA coverage map

Maps every scenario in `TEST_PLAN.md` to where it's actually verified.
Regenerate this by hand whenever tests or checklists change — it's the
single place to check "is X covered, and how?"

| QA ID | Automated test | Manual checklist |
|---|---|---|
| QA-ONB-01 | — | smoke-checklist.md § Onboarding |
| QA-ONB-02 | — | smoke-checklist.md § Onboarding |
| QA-ONB-03 | — | smoke-checklist.md § Onboarding |
| QA-ONB-04 | — | smoke-checklist.md § Onboarding |
| QA-ONB-05 | — | smoke-checklist.md § Onboarding *(OS permission prompt not automatable headless)* |
| QA-ONB-06 | `src/context/AppContext.test.tsx` → "persists onboarding progress after every screen…" | — |
| QA-ONB-07 | `src/context/AppContext.test.tsx` → "persists onboarding progress…" (simulated relaunch); `src/navigation/types.test.ts` → resume fallback | smoke-checklist.md § Interrupted onboarding resume |
| QA-ONB-08 | — | smoke-checklist.md § Onboarding |
| QA-ONB-09 | `src/context/AppContext.test.tsx` → "completeOnboarding flags justOnboarded…" | smoke-checklist.md § Onboarding |
| QA-ONB-10 | — | smoke-checklist.md § Onboarding |
| QA-ONB-11 | — | smoke-checklist.md § Onboarding (structural check) |
| QA-SES-01 | — | smoke-checklist.md § Daily Recenter |
| QA-SES-02 | `src/context/AppContext.test.tsx` → "session completion cannot duplicate"; `src/storage/storage.test.ts` | smoke-checklist.md § Daily Recenter |
| QA-SES-03 | `src/context/AppContext.test.tsx` → onboarding hand-off tests | smoke-checklist.md § Daily Recenter |
| QA-TOD-01 | `src/utils/date.test.ts` → `greetingForNow` "morning" | — |
| QA-TOD-02 | `src/utils/date.test.ts` → `greetingForNow` "afternoon" | — |
| QA-TOD-03 | `src/utils/date.test.ts` → `greetingForNow` "evening" | — |
| QA-TOD-04 | — | regression-checklist.md § Missed days |
| QA-TOD-05 | `src/utils/adaptiveRhythms.test.ts` → `recommendSession` forward-scan tests | — |
| QA-TOD-06 | `src/utils/adaptiveRhythms.test.ts` → "returns null when every session is complete" | smoke-checklist.md § Home |
| QA-ABS-01 | — | smoke-checklist.md § Journey; regression-checklist.md § Missed days |
| QA-ABS-02 | — | regression-checklist.md § Missed days |
| QA-ABS-03 | — | smoke-checklist.md § Journey; regression-checklist.md § Missed days |
| QA-ABS-04 | — | smoke-checklist.md § Journey |
| QA-DATA-01 | `src/storage/storage.test.ts` → "saving twice for the same date overwrites…"; `src/context/AppContext.test.tsx` | regression-checklist.md § No duplicate completions |
| QA-DATA-02 | `src/storage/storage.test.ts` → evening entry tests | regression-checklist.md § No duplicate completions |
| QA-DATA-03 | `src/storage/storage.test.ts` → "entries for different dates do not clobber each other" | regression-checklist.md § No data loss |
| QA-DATA-04 | `src/storage/storage.test.ts` → "returns a typed error instead of throwing when storage is corrupt" | — |
| QA-DATA-05 | `src/storage/storage.test.ts` → "surfaces a typed error if the underlying write rejects" | — |
| QA-DATA-06 | `src/context/AppContext.test.tsx` → "resetAllData returns the app to a clean first-run state" | regression-checklist.md § No data loss |
| QA-DATA-07 | `src/context/AppContext.test.tsx` → "a saved evening entry survives a fresh provider mount" | regression-checklist.md § Returning users |
| QA-TIME-01 | `src/utils/date.test.ts` → "rolls over correctly at the midnight boundary" | — |
| QA-TIME-02 | `src/utils/date.test.ts` → "rolls over correctly across a year boundary" | — |
| QA-TIME-03 | `src/utils/date.test.ts` → "pads month and day to two digits" | — |
| QA-TIME-04 | Not automatable | regression-checklist.md § Time-based correctness |
| QA-TIME-05 | Not automatable | regression-checklist.md § Time-based correctness |
| QA-TIME-06 | `src/utils/pick.test.ts` | — |
| QA-GUARD-01 | `src/flags/featureFlags.test.ts` | regression-checklist.md § Feature-flag hygiene |
| QA-GUARD-02 | — | regression-checklist.md § Missed days (grep check) |
| QA-GUARD-03 | `src/utils/adaptiveRhythms.test.ts` (`recommendSession` return type) | regression-checklist.md § Recommended Sessions |
| QA-GUARD-04 | `src/utils/adaptiveRhythms.test.ts` → "never recommends a missed session" tests | regression-checklist.md § Recommended Sessions |
| QA-HOME-01 | — | smoke-checklist.md § Home |
| QA-HOME-02 | — | smoke-checklist.md § Home |
| QA-HOME-03 | — | smoke-checklist.md § Home |
| QA-HOME-04 | — | smoke-checklist.md § Home |
| QA-HOME-05 | — | smoke-checklist.md § Home |
| QA-COMPLETE-01 | — | smoke-checklist.md § Session completion |
| QA-COMPLETE-02 | Superseded — see QA-COMPLETE2-01/02 | — |
| QA-COMPLETE-03 | Superseded — see QA-COMPLETE2-01/02 | — |
| QA-COMPLETE-04 | `src/context/AppContext.test.tsx` → `setFocusCompleted` persistence | smoke-checklist.md § Session completion |
| QA-COMPLETE-05 | — | smoke-checklist.md § Session completion |
| QA-EMPTY-01 | — | smoke-checklist.md § Home (see QA-HOME-03) |
| QA-EMPTY-02 | — | smoke-checklist.md § Home |
| QA-EMPTY-03 | `src/utils/adaptiveRhythms.test.ts` | smoke-checklist.md § Home |
| QA-EMPTY-04 | — | smoke-checklist.md § Journal / Archived Journey |
| QA-EMPTY-05 | — | smoke-checklist.md § Home (web only) |
| QA-NAV-01 | — | smoke-checklist.md § Navigation |
| QA-NAV-02 | — | smoke-checklist.md § Navigation |
| QA-JOURNAL-01 | — | smoke-checklist.md § Journal |
| QA-JOURNAL-02 | `src/storage/storage.test.ts` → journal append tests; `src/context/AppContext.test.tsx` → Journal entries | smoke-checklist.md § Journal |
| QA-JOURNAL-03 | — | smoke-checklist.md § Journal |
| QA-JOURNAL-04 | `src/context/AppContext.test.tsx` → "marks an entry as a prayer" | smoke-checklist.md § Journal |
| QA-JOURNAL-05 | — | smoke-checklist.md § Journal |
| QA-JOURNAL-06 | `src/storage/storage.test.ts`, `src/context/AppContext.test.tsx` → "multiple entries can be added the same day" | regression-checklist.md § No duplicate completions |
| QA-ARCHIVE-01 | `src/utils/date.test.ts` → `formatSeasonLabel` suite | smoke-checklist.md § Archived Journey |
| QA-ARCHIVE-02 | `src/utils/date.test.ts` → `monthsSince` suite | smoke-checklist.md § Archived Journey |
| QA-ARCHIVE-03 | — | smoke-checklist.md § Archived Journey |
| QA-REC-01 | `src/utils/recommendation.test.ts` | — |
| QA-REC-02 | `src/utils/recommendation.test.ts` → "never lets a completion earlier today count" | — |
| QA-REC-03 | `src/utils/recommendation.test.ts` → "a single unusual day does not create or remove confidence" | — |
| QA-REC-04 | `src/utils/recommendation.test.ts` (every case asserts `sessionType` against `recommendSession` semantics) | — |
| QA-REC-05 | — | smoke-checklist.md § Recommended Sessions |
| QA-REC-06 | — | smoke-checklist.md § Recommended Sessions |
| QA-COMPLETE2-01 | — | smoke-checklist.md § Session completion |
| QA-COMPLETE2-02 | — | smoke-checklist.md § Session completion |
| QA-COMPLETE2-03 | — | smoke-checklist.md § Session completion (structural) |

## Automated test inventory

| File | What it covers |
|---|---|
| `src/utils/pick.test.ts` | Deterministic daily picks (QA-TIME-06) |
| `src/utils/date.test.ts` | Date-key formatting, midnight/year rollover, greeting boundaries, season labels, months-since perspective line (QA-TOD-01→03, QA-TIME-01→03, QA-ARCHIVE-01/02) |
| `src/storage/storage.test.ts` | Profile load/save/merge, daily/evening entry dedup, journal append, error-safety (QA-DATA-01→05, QA-JOURNAL-02/06) |
| `src/context/AppContext.test.tsx` | Session dedup, onboarding persistence/resume, onboarding hand-off, reset, relaunch survival, focus-complete toggle, Journal entries (QA-ONB-06/07/09, QA-SES-02/03, QA-DATA-01/06/07, QA-COMPLETE-04, QA-JOURNAL-02/04/06) |
| `src/navigation/types.test.ts` | Onboarding step-index resume mapping (QA-ONB-07) |
| `src/flags/featureFlags.test.ts` | Phase 2/3 flags stay off (QA-GUARD-01) |
| `src/utils/adaptiveRhythms.test.ts` | Deterministic time-window + forward-scan recommendation logic, never-recommend-missed rule, all-complete → null (QA-TOD-05/06, QA-GUARD-03/04, QA-EMPTY-03) |
| `src/utils/recommendation.test.ts` | Confidence layer on top of Adaptive Rhythms — rolling-window pattern detection, never changes which session is recommended, never lets today count toward its own confidence (QA-REC-01→04) |

Total: 8 suites, 65 tests, all passing as of the Sprint 3 pass.
