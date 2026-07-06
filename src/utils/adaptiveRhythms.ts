import { SessionType } from '../types';
import { SESSION_ORDER } from '../constants/sessionTypes';

/**
 * Adaptive Rhythms — the deterministic engine behind "Today's Recommended
 * Session." No AI, no machine learning, no hidden ranking: every decision
 * here is a plain, readable rule, on purpose, so it can be reasoned about
 * and tested exhaustively.
 *
 * The whole system is one rule, really: **recommend the current or next
 * upcoming session, and never look backward.** A session that was
 * available earlier today and wasn't done is simply not mentioned again —
 * there is no "missed" state to catch up on, no overdue indicator, no
 * pressure. If every session for today is already done, there is nothing
 * left to recommend, and the Home screen shows a resting state instead.
 */

// Boundaries are the hour (0-23) at which each window begins. windDown
// wraps past midnight (21:00 through 04:59).
const WINDOW_START_HOUR: Record<SessionType, number> = {
  morning: 5,
  midday: 11,
  evening: 15,
  windDown: 21,
};

export function getTimeWindow(now: Date): SessionType {
  const hour = now.getHours();
  if (hour >= WINDOW_START_HOUR.windDown || hour < WINDOW_START_HOUR.morning) return 'windDown';
  if (hour >= WINDOW_START_HOUR.evening) return 'evening';
  if (hour >= WINDOW_START_HOUR.midday) return 'midday';
  return 'morning';
}

export interface RecommendSessionParams {
  now: Date;
  /** Which of the four session types already have an entry for today. */
  completedToday: Partial<Record<SessionType, boolean>>;
}

/**
 * Returns the single session type to recommend right now, or `null` when
 * every session type for today is already complete (a full, calm rest —
 * never an overdue list).
 *
 * Deliberately does NOT take notification preference or historical usage
 * counts as inputs: the hard product rule ("never recommend a missed
 * session; always the most relevant for this moment") is fully
 * determined by time + what's done today. Those other two signals are
 * real inputs Recenter has locally, but they're used one layer up, for
 * *copy* (a personalized subtitle), not for *which* session is chosen —
 * letting them influence selection would make the recommendation less
 * predictable, which the product guardrails explicitly rule out.
 */
export function recommendSession({ now, completedToday }: RecommendSessionParams): SessionType | null {
  const currentIndex = SESSION_ORDER.indexOf(getTimeWindow(now));
  for (let i = currentIndex; i < SESSION_ORDER.length; i++) {
    const type = SESSION_ORDER[i];
    if (!completedToday[type]) return type;
  }
  return null;
}
