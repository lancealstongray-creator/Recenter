# Regression checklist

Run this for any change that touches `src/context/AppContext.tsx`,
`src/storage/storage.ts`, `src/utils/date.ts`, `src/navigation/**`, or
either onboarding/session flow. This is the "did I break a Critical QA
rule" pass — slower than the smoke checklist, focused on data integrity
and edge cases rather than visual review.

## Automated (run first — fastest signal)

- [ ] `npm run typecheck` — zero errors
- [ ] `npm test` — all suites pass (currently 7 suites / 43 tests)
- [ ] If you touched `src/utils/date.ts`, `src/storage/storage.ts`, or
      `src/context/AppContext.tsx`: read the diff against the tests in
      the matching `*.test.ts(x)` file — did you change behavior the
      tests don't yet cover? Add a case before merging.

## No duplicate session completions (QA-DATA-01, QA-DATA-02)

- [ ] Manually: complete a Daily Recenter session, then find a way back
      into the flow the same day (e.g. deep-link, double-tap the
      recommended card's begin button before the UI updates) and
      complete it again — Journey still shows exactly one entry for that
      date, with the newest data
- [ ] Same for Evening Reflection, Midday Reset, and Wind Down

## Recommended Sessions / Adaptive Rhythms (QA-TOD-05, QA-TOD-06, QA-GUARD-03, QA-GUARD-04)

- [ ] `npm test -- src/utils/adaptiveRhythms.test.ts` passes — window
      boundaries, forward-scan recommendation, never-recommend-missed
      rule, all-complete → null
- [ ] Manually: complete only the Morning session, then advance the
      device clock (or system time) past the Midday and Evening windows
      without completing them — Home recommends Wind Down (the next
      upcoming type), never resurfaces Midday or Evening as "missed"
- [ ] Manually: complete all 4 session types for today — Home shows the
      resting empty state, no recommended card, no button
- [ ] At no point does Home show more than one recommended session card

## No reflection/session data loss (QA-DATA-03, QA-DATA-06, QA-DATA-07)

- [ ] Save a Daily Recenter entry for one day, then an Evening Reflection
      for a *different* day (change device date or wait) — reload the
      app — both entries are intact
- [ ] Reset all data — confirm Profile, Journey, and Home all return to
      a fresh-install state simultaneously (no partial reset)
- [ ] Force-quit the app mid-Evening-Reflection (before tapping the final
      Close) — reopen — confirm the partial entry was *not* saved (only
      a completed flow persists) and the user can start over cleanly,
      without any error or stuck state

## Missed days must not punish or shame (QA-ABS-01 → QA-ABS-03)

- [ ] Advance the device clock forward several days (or change system
      date) without opening the app in between, then open it — Home
      shows a normal greeting for today, nothing referencing the gap
- [ ] Journey shows only the days that actually have entries; no "missed"
      rows, no red/warning styling anywhere
- [ ] `grep -ri "streak\|missed\|overdue" src/screens` returns nothing
      user-facing (comments referencing the *absence* of these features
      are fine and expected)

## Returning users resume without friction (QA-DATA-07, QA-ONB-07)

- [ ] Fully onboard, close the app, reopen — lands on Home, not
      onboarding
- [ ] Interrupt onboarding partway, close the app, reopen — resumes at
      the same screen with prior answers, not a restart

## Time-based correctness (QA-TIME-01 → QA-TIME-06)

- [ ] `npm test -- src/utils/date.test.ts` passes (midnight rollover,
      year-boundary rollover, zero-padding)
- [ ] Manually, if a device/emulator is available: change the system
      time zone while the app is open, background and foreground it —
      no crash, today's entry (if any) is still associated with the
      correct date
- [ ] Manually: set the device clock backward by a day, open the app —
      no crash; Home reflects the (now earlier) "today" consistently
      with what Journey shows for that date

## Feature-flag hygiene (QA-GUARD-01)

- [ ] `npm test -- src/flags/featureFlags.test.ts` passes — every Phase
      2/3 flag is still `false`
- [ ] If your change legitimately turns a flag on, that's a product
      decision — confirm it was intended, not accidental
