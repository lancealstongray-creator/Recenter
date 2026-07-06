import { getRecommendation } from './recommendation';
import { toDateKey } from './date';

function at(hour: number, minute = 0): Date {
  return new Date(2026, 6, 6, hour, minute, 0);
}

function daysBefore(now: Date, n: number): string {
  const d = new Date(now);
  d.setDate(d.getDate() - n);
  return toDateKey(d);
}

describe('getRecommendation', () => {
  it('returns null when recommendSession returns null (all sessions done today)', () => {
    const now = at(9);
    const result = getRecommendation({
      now,
      completedToday: { morning: true, midday: true, evening: true, windDown: true },
      completedDatesByType: { morning: [], midday: [], evening: [], windDown: [] },
    });
    expect(result).toBeNull();
  });

  it('is not confident with no history, but still returns the plain default session', () => {
    const now = at(7);
    const result = getRecommendation({
      now,
      completedToday: {},
      completedDatesByType: { morning: [], midday: [], evening: [], windDown: [] },
    });
    expect(result).toEqual({ sessionType: 'morning', confident: false, reasonCopy: undefined });
  });

  it('is not confident with only 4 of the last 7 days completed', () => {
    const now = at(7);
    const morningDates = [1, 2, 3, 4].map((n) => daysBefore(now, n));
    const result = getRecommendation({
      now,
      completedToday: {},
      completedDatesByType: { morning: morningDates, midday: [], evening: [], windDown: [] },
    });
    expect(result?.confident).toBe(false);
    expect(result?.reasonCopy).toBeUndefined();
  });

  it('becomes confident once 5 of the last 7 days show a consistent pattern', () => {
    const now = at(7);
    const morningDates = [1, 2, 3, 4, 5].map((n) => daysBefore(now, n));
    const result = getRecommendation({
      now,
      completedToday: {},
      completedDatesByType: { morning: morningDates, midday: [], evening: [], windDown: [] },
    });
    expect(result).toEqual({
      sessionType: 'morning',
      confident: true,
      reasonCopy: 'You often start your day this way.',
    });
  });

  it('never lets a completion earlier today count toward its own confidence', () => {
    const now = at(7);
    const result = getRecommendation({
      now,
      completedToday: {},
      completedDatesByType: { morning: [toDateKey(now)], midday: [], evening: [], windDown: [] },
    });
    expect(result?.confident).toBe(false);
  });

  it('a single unusual day does not create or remove confidence (rolling window smooths it)', () => {
    const now = at(7);
    // 5 consistent days plus one gap day within the window — still >= 5 matches.
    const morningDates = [1, 2, 4, 5, 6].map((n) => daysBefore(now, n));
    const result = getRecommendation({
      now,
      completedToday: {},
      completedDatesByType: { morning: morningDates, midday: [], evening: [], windDown: [] },
    });
    expect(result?.confident).toBe(true);
  });
});
