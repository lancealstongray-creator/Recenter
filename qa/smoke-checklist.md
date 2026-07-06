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

## Navigation (QA-NAV-01, QA-NAV-02)

- [ ] Bottom tab bar reads exactly Home, Journal, Profile — no History or
      Journey tab exists anywhere
- [ ] Archived Journey is reachable via a quiet text link at the bottom of
      Journal, and via a secondary link in Profile — never from the tab
      bar

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

## Recommended Sessions / Session Picker (QA-REC-01 → QA-REC-06)

- [ ] The primary card's eyebrow reads "Suggested for you" only after a
      consistent multi-day pattern has formed (5+ of the last 7 days for
      that session type) — on a fresh install or occasional use, it shows
      the plain default label instead (QA-REC-01)
- [ ] "Or choose something else" beneath the Begin button opens a bottom
      sheet listing all 4 session types with no ranking, score, or
      "recommended" marker on any row (QA-REC-05)
- [ ] Tapping any row in that sheet routes directly to that session type,
      regardless of what Home was recommending (QA-REC-06)

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

## Session completion screen v2 (QA-COMPLETE-01, QA-COMPLETE-04, QA-COMPLETE-05, QA-COMPLETE2-01 → QA-COMPLETE2-03)

- [ ] Every session type ends on the identical "Nice work." screen with
      the exact copy "You've taken a moment to reconnect with what
      matters today." (QA-COMPLETE-01)
- [ ] If today has a One Focus, a togglable focus-complete row is shown;
      toggling it and reopening the screen later (or checking Home)
      reflects the new state (QA-COMPLETE-04)
- [ ] Two equal-weight options appear: "Return to Today" (filled) and
      "Sit a Moment" (outline) — no countdown, no auto-dismiss
      (QA-COMPLETE2-01)
- [ ] Tapping "Sit a Moment" hides both buttons and holds the same view
      (no new screen, no timer); a quiet "Return to Today" text link
      fades in after a few seconds (QA-COMPLETE2-02)
- [ ] The arrival card visually sits above everything else on screen
      (elevation.hero) — the only place in the app that lifted this much
      (QA-COMPLETE2-03)
- [ ] Immediately after returning, Home's recommendation and any
      focus/highlight blocks reflect the just-completed session with no
      stale state (QA-COMPLETE-05)

## Journal (QA-JOURNAL-01 → QA-JOURNAL-06)

- [ ] Journal's composer is docked at the top and visible immediately on
      opening the tab — not hidden behind a "+" button (QA-JOURNAL-01)
- [ ] Saving an entry clears the composer, and the new entry settles into
      the feed just below with a subtle horizontal Page Turn reveal, most
      recent first (QA-JOURNAL-02)
- [ ] The feed mixes freeform entries with existing session reflections
      (today's One Focus, Evening Reflection notes, Midday/Wind Down
      notes) in one identically-styled feed, sorted by time — not split
      into separate tabs or sections (QA-JOURNAL-03)
- [ ] With Faith-Based Encouragement OFF in Profile, no "This is a
      prayer" toggle appears in the composer at all (QA-JOURNAL-04)
- [ ] With Faith-Based Encouragement ON, the toggle appears, and marking
      an entry as a prayer shows a "Prayer" eyebrow on that entry in the
      feed (QA-JOURNAL-04)
- [ ] "Private by design." appears only when the feed is completely empty
      (genuinely first-ever use); saving any entry makes it disappear for
      good (QA-JOURNAL-05)
- [ ] Saving two entries the same day keeps both, in save order — no
      overwrite (QA-JOURNAL-06)

## Archived Journey (QA-ABS-01, QA-ABS-03, QA-ABS-04, QA-ARCHIVE-01 → QA-ARCHIVE-03)

- [ ] Title reads "Archived Journey" (not "History" or "Your Journey")
- [ ] Opening line reads "You've been reflecting for N months." (or "a
      few weeks" for a very new install) — stated once, never repeated
      as a counter while scrolling (QA-ARCHIVE-02)
- [ ] Rows are grouped by season ("Early Summer," "Winter," etc.), never
      by calendar month, never showing a bare year in the section header
      (QA-ARCHIVE-01)
- [ ] The summary area shows one representative excerpt per life area
      (e.g. `Health — "Be present with my family"`), never a numeric
      count (QA-ARCHIVE-03, QA-ABS-04)
- [ ] A day with no entries simply doesn't appear — no gap marker, no red
      state (QA-ABS-01)

## Profile

- [ ] Name, Life Areas, Faith-Based Encouragement are all editable
      in place and persist after navigating away and back
- [ ] "About Recenter" ends with the trust line: "Your reflections stay
      on this device. We designed Recenter this way on purpose."
- [ ] A quiet "Archived Journey" text link is reachable from Profile
      (QA-NAV-02)
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
      Journal, Profile), each with a Skip (X) available, "Next" through
      to "Done" on the last stop
- [ ] After completing or skipping the tour, it does not reappear
      automatically on Home; it's only reachable again from Profile

## Cross-cutting

- [ ] No console errors in the browser devtools console throughout the
      above
- [ ] `npm run verify` passes
