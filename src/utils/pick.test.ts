import { pickForDate } from './pick';

describe('pickForDate', () => {
  const items = ['a', 'b', 'c', 'd'];

  it('is deterministic for the same date', () => {
    const first = pickForDate(items, '2026-07-06');
    const second = pickForDate(items, '2026-07-06');
    expect(first).toBe(second);
  });

  it('can pick different items on different dates', () => {
    const picks = new Set(
      ['2026-07-01', '2026-07-02', '2026-07-03', '2026-07-04'].map((date) => pickForDate(items, date))
    );
    // Not a strict requirement that every day differs, but across 4
    // distinct dates with 4 items we expect more than one outcome.
    expect(picks.size).toBeGreaterThan(1);
  });

  it('always returns an item that exists in the list', () => {
    for (const date of ['2026-01-01', '2026-12-31', '2000-02-29']) {
      expect(items).toContain(pickForDate(items, date));
    }
  });
});
