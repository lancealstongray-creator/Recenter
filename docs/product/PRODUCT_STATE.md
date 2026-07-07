# Recenter — Product State

Current shipped product surface, as of the close of Sprint 3 (`main`,
commit `b9c188a` and later doc-only commits). This reflects what is
actually built, not what is planned — see "What is deferred" for the
distinction.

---

## What is current

### Onboarding (first run only)
Welcome → What is Recenter → Choose Life Areas (exactly 3, required) →
Faith Preference (2 choices) → One Focus Setup (optional, suggestions
from chosen life areas) → Notifications (2 choices, OS permission only
requested if "Yes"). Completing onboarding drops directly into the
user's real first Morning Session — never a simulated tutorial — ending
on a one-time "You're Ready" screen before Home. An optional 4-stop app
Tour (Home, Today's Focus, Journal, Profile) can be taken once after
first Home load, or any time later from Profile.

### Navigation (3 tabs)
**Home** (Today), **Journal**, **Profile**. Archived Journey is reachable
via a link from Journal or Profile — not a tab.

### Home / Today
Order: time-aware greeting → short calming message → one recommended
session card (label + reasoning + Begin button) → "Or choose something
else" link → today's One Focus (only if present) → rotating daily
encouragement line → tab bar. Never more than one recommended session
card. Offline banner and inline error notice appear when applicable.

### Recommended Sessions (4 types, exactly one shown at a time)
Morning Session, Midday Reset, Evening Reflection, Wind Down. Selection
is deterministic: scans forward from the current time-of-day window and
recommends the next incomplete type for today, never resurfacing a type
whose window has already passed ("never recommend a missed session").
When every type is complete for today, Home shows a resting state
("You've shown up for yourself today. That's enough.") instead of a
card. A confidence layer can additionally label the card "Suggested for
you" with a plain-language reason, once a consistent multi-day pattern
exists — this never changes *which* type is recommended, only the copy.
"Or choose something else" opens a plain, unranked picker of all 4
types.

### The 4 session flows
- **Morning Session** (Daily Recenter) — Greeting → Mood → Life Area
  Reminder → One Focus (optional) → Encouragement → Session Completion.
- **Midday Reset** — 2-step: opener → one optional prompt → Session
  Completion.
- **Evening Reflection** — 3 fixed prompts (highlight, challenge,
  gratitude) + 1 optional note → Session Completion.
- **Wind Down** — 2-step: opener → one optional closing prompt →
  Session Completion.

### Session Completion (shared, all 4 flows)
"Nice work." + fixed body copy. If today has a One Focus, a togglable
focus-complete row is shown. Two equal-weight exit options: "Return to
Today" (always lands on Home) and "Sit a Moment" (holds the same view,
no timer; a quiet "Return to Today" link fades in after a pause). No
auto-dismiss.

### Journal
A genuinely new freeform-writing surface — a docked composer always
visible at the top, and a unified, most-recent-first feed mixing
freeform entries with existing session reflections (today's focus,
Evening Reflection notes, Midday/Wind Down notes) in one identically-
styled feed. An optional "This is a prayer" toggle appears only when
Faith-Based Encouragement is enabled. "Private by design." is shown only
on genuinely first-ever use. A quiet link to Archived Journey sits at
the bottom. Entries can be added but not edited or deleted.

### Archived Journey
A reframing of the original History/Journey screen: rows grouped by
season (not calendar month), an opening perspective line ("You've been
reflecting for N months"), and a representative reflection excerpt per
life area instead of a numeric tally. No counts, no charts, no trend
lines anywhere.

### Profile
Editable in place: name, life areas, faith preference. "About Recenter"
states the no-streaks/no-badges/no-missed-day-shame philosophy and the
on-device trust line. Links to the app Tour and Archived Journey.
"Reset my data" is visually isolated at the bottom, behind a
confirmation.

## What has been decided

See `docs/company/DECISION_LOG.md` for the full record. Product-specific
highlights: exactly 3 life areas at onboarding (not fewer, not more);
faith preference is exactly 2 choices; all 4 session types are
permanent, first-class product surfaces (not candidates for reduction);
Session Completion has exactly 2 exit paths, not 3.

## What is deferred

Per approved design packages, explicitly out of scope for Sprints 1–3
and not begun:

- Splash screen (native), Authentication, Premium/Subscription
- Standalone Settings screen
- Standalone Notification Preferences screen (on/off, preferred time
  window, quiet hours — specified, not built; no notification is
  actually ever scheduled or sent today, despite `notificationsEnabled`
  being captured at onboarding)
- Journal entry editing/deletion — not specified by any approved
  document to date; not an oversight, an open question
- Archived Journey does not yet include Midday Reset / Wind Down entries
  (pre-existing gap, tracked in `docs/engineering/TECH_DEBT.md` M3)

All Phase 2/3 feature flags remain `false`: streaks/consistency scores,
badges/gamification, social sharing, custom life areas, multiple daily
focuses, insights dashboard, coach/therapist sharing, AI reflection
summaries, community features, export/integrations. None are referenced
by any shipped screen.

## What a future AI session should know

- "Recommended Sessions" and "Adaptive Rhythms" are two different
  mechanisms layered together: `adaptiveRhythms.ts` decides *which*
  session type, `recommendation.ts` decides whether to show it as a
  confident, personalized suggestion. Do not conflate them, and do not
  assume either one uses AI — both are explicitly deterministic by
  product mandate (see `docs/company/CONSTITUTION.md`).
- Journal and Archived Journey read from the *same* underlying session
  data (`dailyEntries`, `eveningEntries`, `middayEntries`,
  `windDownEntries`) as Home — there is no separate "journal-only" or
  "archive-only" copy of this data.
- Before proposing any new screen or feature, check whether it can state
  one clear emotional purpose per `docs/company/CONSTITUTION.md`'s
  "Emotional Hierarchy" principle — if it can't, it likely belongs
  inside an existing surface.
