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
| QA-TOD-05 | N/A — not implemented | N/A |
| QA-TOD-06 | N/A — not implemented | N/A |
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

## Automated test inventory

| File | What it covers |
|---|---|
| `src/utils/pick.test.ts` | Deterministic daily picks (QA-TIME-06) |
| `src/utils/date.test.ts` | Date-key formatting, midnight/year rollover, greeting boundaries (QA-TOD-01→03, QA-TIME-01→03) |
| `src/storage/storage.test.ts` | Profile load/save/merge, daily/evening entry dedup, error-safety (QA-DATA-01→05) |
| `src/context/AppContext.test.tsx` | Session dedup, onboarding persistence/resume, onboarding hand-off, reset, relaunch survival (QA-ONB-06/07/09, QA-SES-02/03, QA-DATA-01/06/07) |
| `src/navigation/types.test.ts` | Onboarding step-index resume mapping (QA-ONB-07) |
| `src/flags/featureFlags.test.ts` | Phase 2/3 flags stay off (QA-GUARD-01) |

Total: 6 suites, 32 tests, all passing as of this stabilization pass.
