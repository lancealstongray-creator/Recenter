import { getTimeWindow, recommendSession } from './adaptiveRhythms';

function at(hour: number, minute = 0): Date {
  return new Date(2026, 6, 6, hour, minute, 0);
}

describe('getTimeWindow', () => {
  it('is windDown just before morning starts', () => {
    expect(getTimeWindow(at(4, 59))).toBe('windDown');
  });

  it('is morning starting at 5:00', () => {
    expect(getTimeWindow(at(5, 0))).toBe('morning');
    expect(getTimeWindow(at(10, 59))).toBe('morning');
  });

  it('is midday starting at 11:00', () => {
    expect(getTimeWindow(at(11, 0))).toBe('midday');
    expect(getTimeWindow(at(14, 59))).toBe('midday');
  });

  it('is evening starting at 15:00', () => {
    expect(getTimeWindow(at(15, 0))).toBe('evening');
    expect(getTimeWindow(at(20, 59))).toBe('evening');
  });

  it('is windDown starting at 21:00, wrapping past midnight', () => {
    expect(getTimeWindow(at(21, 0))).toBe('windDown');
    expect(getTimeWindow(at(23, 59))).toBe('windDown');
    expect(getTimeWindow(at(0, 0))).toBe('windDown');
  });
});

describe('recommendSession', () => {
  it('recommends the current window session when nothing is done', () => {
    expect(recommendSession({ now: at(7), completedToday: {} })).toBe('morning');
    expect(recommendSession({ now: at(12), completedToday: {} })).toBe('midday');
    expect(recommendSession({ now: at(18), completedToday: {} })).toBe('evening');
    expect(recommendSession({ now: at(22), completedToday: {} })).toBe('windDown');
  });

  it('recommends the next upcoming session if the current one is already done', () => {
    expect(recommendSession({ now: at(7), completedToday: { morning: true } })).toBe('midday');
    expect(
      recommendSession({ now: at(12), completedToday: { morning: true, midday: true } })
    ).toBe('evening');
  });

  it('never recommends a missed session from earlier in the day', () => {
    // It's midday, morning was never done — must NOT recommend morning.
    const result = recommendSession({ now: at(12), completedToday: {} });
    expect(result).toBe('midday');
    expect(result).not.toBe('morning');
  });

  it('never looks backward even when only an earlier session is incomplete', () => {
    // Evening window; only "morning" (from hours ago) is incomplete —
    // must not resurface it.
    const result = recommendSession({
      now: at(18),
      completedToday: { midday: true, evening: true, windDown: true },
    });
    expect(result).toBeNull();
  });

  it('returns null when every session for today is complete — a calm rest, not an overdue list', () => {
    const result = recommendSession({
      now: at(9),
      completedToday: { morning: true, midday: true, evening: true, windDown: true },
    });
    expect(result).toBeNull();
  });

  it('returns null in the windDown window once windDown itself is done, without resurfacing earlier gaps', () => {
    const result = recommendSession({ now: at(22), completedToday: { windDown: true } });
    expect(result).toBeNull();
  });
});
