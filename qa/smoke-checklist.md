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

## Home (QA-HOME-01 → QA-HOME-05, QA-EMPTY-01 → QA-EMPTY-03, QA-EMPTY-05)

- [ ] Home content renders top-to-bottom in exact spec order: greeting →
      short calming message → recommended session card → begin button →
      today's One Focus (only if present) → daily encouragement → bottom
      nav (QA-HOME-01)
- [ ] The calming message under the greeting is a short line distinct from
      the rotating encouragement line at the bottom (QA-HOME-02)
- [ ] Exactly one recommended session card ever shows at a time — never
      zero-with-a-button and never more than one (QA-HOME-05, QA-GUARD-03)
- [ ] On a brand-new install, the recommended card reads "Let's begin your
      first moment together." (QA-HOME-03, QA-EMPTY-01)
- [ ] After completing at least one session type but never a given other
      type, that other type's first recommendation reads "A first
      [type] for you." instead of its normal recurring blurb (QA-HOME-04)
- [ ] The Begin button on the card routes to the correct flow for each of
      the 4 types: Morning → Daily Recenter, Midday → Midday Reset,
      Evening → Evening Reflection, Wind Down → Wind Down (QA-HOME-05)
- [ ] With no One Focus set for today, the quiet block reads "No focus set
      for today" / "That's completely fine — not every day needs one." —
      never blank, never an error look (QA-EMPTY-02)
- [ ] After all 4 session types are completed for today, no recommended
      card appears; instead "You've shown up for yourself today. That's
      enough." is shown (QA-TOD-06, QA-EMPTY-03)
- [ ] Simulating the browser going offline (devtools → Network → Offline)
      shows the reassuring offline banner on Home; toggling back online
      removes it; no feature stops working either way (QA-EMPTY-05, web
      only)

## Daily Recenter (subsequent days) (QA-SES-01 → QA-SES-03)

- [ ] From Home, tap the recommended card's begin button for Morning
      Session — Greeting → Mood → Life Area Reminder → One Focus →
      Encouragement, 5 steps, progress dots on every step except
      Encouragement (no dots there)
- [ ] Close (X) at any step returns to Home without saving a partial entry
- [ ] One Focus step can be left blank and still continue (it is fully
      optional, not just optional-looking)
- [ ] Completing the session shows the shared "Nice work." completion
      screen, then updates Home's One Focus block and recommendation
- [ ] No "You're ready." screen appears this time — only on the very
      first session ever

## Midday Reset / Wind Down

- [ ] Both are reachable only via Home's recommended card (no separate tab
      or menu entry) and follow the same 2-step opener + optional-note
      pattern as Daily Recenter/Evening Reflection
- [ ] Wind Down uses the evening background tint; both end on the shared
      "Nice work." completion screen

## Evening Reflection

- [ ] From Home (once Evening Reflection is the recommendation), tap
      "Take a Moment" — 3 fixed prompts + 1 optional note screen
- [ ] Each prompt's Continue is disabled until text is entered; the final
      optional note's Close is always enabled
- [ ] Completing it shows the shared "Nice work." completion screen, then
      updates Home to show tonight's highlight

## Session completion screen (QA-COMPLETE-01 → QA-COMPLETE-05)

- [ ] Every session type ends on the identical "Nice work." screen with
      the exact copy "You've taken a moment to reconnect with what
      matters today." (QA-COMPLETE-01)
- [ ] If today has a One Focus, a togglable focus-complete row is shown;
      toggling it and reopening the screen later (or checking Home)
      reflects the new state (QA-COMPLETE-04)
- [ ] "Return Home" always lands on the Home tab, even if a different tab
      was active before starting the session (QA-COMPLETE-02)
- [ ] "Done" returns to wherever the user was before the session started,
      not necessarily Home (QA-COMPLETE-03)
- [ ] Immediately after either button, Home's recommendation and any
      focus/highlight blocks reflect the just-completed session with no
      stale state (QA-COMPLETE-05)

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
