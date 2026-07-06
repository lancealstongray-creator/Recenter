# Smoke checklist

Run before any release, and after any change touching onboarding, session
flows, or storage. Each item references its QA ID in `TEST_PLAN.md`.
Target: under 10 minutes with `npm run web`.

Fastest setup between runs: Profile → "Reset my data" to get back to a
fresh install without restarting the dev server.

## Onboarding (QA-ONB-01 → QA-ONB-11)

- [ ] Fresh install opens on Welcome, not Home
- [ ] Welcome → What is Recenter → Choose Life Areas → Faith Preference →
      One Focus Setup → Notifications, in that exact order
- [ ] Choose Life Areas: selecting a 4th chip after 3 does nothing visible
      except the remaining chips look dimmed/inert (QA-ONB-02)
- [ ] Faith Preference: only 2 options, "Continue" disabled until one is
      picked (QA-ONB-03)
- [ ] One Focus Setup: tapping a suggestion fills the text field; typing a
      custom focus works; leaving it blank and tapping Continue also
      works (skip) (QA-ONB-04)
- [ ] Notifications: choosing "Not now" does **not** trigger any OS
      permission prompt; choosing "Yes" does (QA-ONB-05)
- [ ] Finishing Notifications drops straight into a real Daily Recenter
      session — no "tutorial" framing, no separate congratulations screen
      first (QA-ONB-08)
- [ ] That first session's One Focus step is pre-filled with whatever was
      chosen in One Focus Setup, and is editable (QA-ONB-09)
- [ ] After the Encouragement step, a "You're ready." screen appears
      (QA-ONB-10)
- [ ] Tapping through from "You're ready." lands on Home

## Interrupted onboarding resume (QA-ONB-06, QA-ONB-07)

- [ ] Start onboarding, get to Faith Preference, reload the page (web) or
      force-quit and reopen (device)
- [ ] App resumes exactly at Faith Preference — not Welcome, not a step
      further ahead — with life areas already selected

## Daily Recenter (subsequent days) (QA-SES-01 → QA-SES-03)

- [ ] From Home, tap "Begin Today" — Greeting → Mood → Life Area Reminder
      → One Focus → Encouragement, 5 steps, progress dots on every step
      except Encouragement (no dots there)
- [ ] Close (X) at any step returns to Home without saving a partial entry
- [ ] Completing the session updates Home to show today's focus in the
      quiet card, not the "Begin Today" card
- [ ] No "You're ready." screen appears this time — only on the very
      first session ever

## Evening Reflection

- [ ] From Home (after Daily Recenter is done), tap "Take a Moment" —
      3 fixed prompts + 1 optional note screen
- [ ] Each prompt's Continue is disabled until text is entered; the final
      optional note's Close is always enabled
- [ ] Completing it updates Home to show tonight's highlight

## Journey / History (QA-ABS-01, QA-ABS-03, QA-ABS-04)

- [ ] Title reads "Your Journey." (not "History")
- [ ] Summary card shows "You've recentered N days" — a plain count, no
      streak language
- [ ] Life-area chips in the summary show icon + label only, no numbers
- [ ] A day with no entries simply doesn't appear — no gap marker, no red
      state

## Profile

- [ ] Name, Life Areas, Faith-Based Encouragement are all editable
      in place and persist after navigating away and back
- [ ] "Take the app tour" opens the Tour from Profile at any time,
      regardless of whether it's been seen before
- [ ] "Reset my data" is visually separated from "Take the app tour"
      above it, and asks for confirmation before clearing anything

## Tour

- [ ] First Home load after onboarding shows "Take a quick tour?" with
      "Not now" and "Take the tour" as plain text links (not two buttons)
- [ ] Tapping "Not now" makes the prompt disappear permanently (reload to
      confirm it doesn't come back)
- [ ] Tapping "Take the tour" shows exactly 4 stops (Home, Today's Focus,
      Journey, Profile), each with a Skip (X) available, "Next" through
      to "Done" on the last stop
- [ ] After completing or skipping the tour, it does not reappear
      automatically on Home; it's only reachable again from Profile

## Cross-cutting

- [ ] No console errors in the browser devtools console throughout the
      above
- [ ] `npm run verify` passes
