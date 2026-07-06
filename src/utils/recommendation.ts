import { SessionType } from '../types';
import { recommendSession, RecommendSessionParams } from './adaptiveRhythms';
import { toDateKey } from './date';

/**
 * The confidence layer on top of Adaptive Rhythms' deterministic engine.
 *
 * This does NOT decide which session types exist, and does not change
 * which session is surfaced — recommendSession() (adaptiveRhythms.ts)
 * still owns that decision entirely, exactly as before. All this adds is
 * a plain-language "reason" and a "confident" flag for Today's copy, so
 * the primary card can read as a personal suggestion ("Suggested for
 * you") once a real pattern has formed, and a plain default otherwise.
 *
 * Per the Board's permanent principle — "Adaptive Rhythms are earned, not
 * assumed" — confidence only appears after a consistent pattern across a
 * rolling multi-week window, never after one or two sessions. No scores
 * or percentages are ever exposed; confidence is a boolean, and the
 * reasoning is a fixed, honest sentence per session type.
 */

const ROLLING_WINDOW_DAYS = 7;
const CONFIDENCE_THRESHOLD = 5;

const REASON_COPY: Record<SessionType, string> = {
  morning: 'You often start your day this way.',
  midday: 'You usually pause here midday.',
  evening: 'Evenings are often when you reflect.',
  windDown: 'This is usually how you wind down.',
};

export interface RecommendationResult {
  sessionType: SessionType;
  confident: boolean;
  /** Only set when confident — the reasoning IS the transparency. */
  reasonCopy?: string;
}

export interface GetRecommendationParams extends RecommendSessionParams {
  /** Date keys (YYYY-MM-DD) on which each session type was completed, ever. */
  completedDatesByType: Record<SessionType, string[]>;
}

export function getRecommendation(params: GetRecommendationParams): RecommendationResult | null {
  const sessionType = recommendSession(params);
  if (!sessionType) return null;

  const completedDates = new Set(params.completedDatesByType[sessionType] ?? []);
  const windowDates = lastNDateKeys(params.now, ROLLING_WINDOW_DAYS);
  const matches = windowDates.filter((date) => completedDates.has(date)).length;
  const confident = matches >= CONFIDENCE_THRESHOLD;

  return {
    sessionType,
    confident,
    reasonCopy: confident ? REASON_COPY[sessionType] : undefined,
  };
}

// The N calendar days strictly before "now" — never includes today, so a
// session completed earlier today can't inflate today's own confidence.
function lastNDateKeys(now: Date, n: number): string[] {
  const keys: string[] = [];
  for (let i = 1; i <= n; i++) {
    const d = new Date(now);
    d.setDate(d.getDate() - i);
    keys.push(toDateKey(d));
  }
  return keys;
}
