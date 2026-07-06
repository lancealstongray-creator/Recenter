# Bug report template

Copy this into a new issue. Fill in every section — delete the italic
hints as you go.

## Summary

*One sentence: what's wrong.*

## QA ID (if applicable)

*e.g. QA-DATA-01 — see `qa/TEST_PLAN.md`. Leave blank if this is a new,
uncatalogued scenario, and consider adding it to TEST_PLAN.md.*

## Severity

- [ ] Critical — violates a QA rule (duplicate completion, data loss,
      shame/guilt-based state, broken resume, broken time handling)
- [ ] High — bad experience, no data integrity risk
- [ ] Medium — polish / cosmetic

## Environment

- Platform: *web / iOS / Android*
- Method: *`npm run web` / Expo Go / simulator*
- Node version: *`node -v`*
- Branch / commit: *`git rev-parse --short HEAD`*

## Steps to reproduce

1. …
2. …
3. …

## Expected behavior

*What should have happened.*

## Actual behavior

*What happened instead. Include exact copy/error text if any.*

## Data state (if relevant to the bug)

*If this involves storage/data integrity, include the relevant
localStorage/AsyncStorage keys (`@recenter/profile`,
`@recenter/dailyEntries`, `@recenter/eveningEntries`) — see
`qa/README.md` for how to inspect them.*

## Screenshots / console output

*Paste browser console errors or a screenshot if available.*

## Suspected cause (optional)

*If you have a hypothesis about which file/function is responsible.*

## Regression?

- [ ] Yes — worked before, broke recently. Last known-good commit: *…*
- [ ] No — new scenario, never worked
- [ ] Unknown
