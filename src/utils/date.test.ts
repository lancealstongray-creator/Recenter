import { __setClockForTests, todayKey, toDateKey, greetingForNow, formatMonthLabel } from './date';

afterEach(() => {
  __setClockForTests(null);
});

describe('toDateKey / todayKey', () => {
  it('pads month and day to two digits', () => {
    expect(toDateKey(new Date(2026, 0, 5))).toBe('2026-01-05');
  });

  it('reflects the injected clock, not real time', () => {
    __setClockForTests(() => new Date(2030, 11, 25));
    expect(todayKey()).toBe('2030-12-25');
  });

  it('rolls over correctly at the midnight boundary', () => {
    __setClockForTests(() => new Date(2026, 6, 6, 23, 59, 59));
    expect(todayKey()).toBe('2026-07-06');

    __setClockForTests(() => new Date(2026, 6, 7, 0, 0, 0));
    expect(todayKey()).toBe('2026-07-07');
  });

  it('rolls over correctly across a year boundary', () => {
    __setClockForTests(() => new Date(2026, 11, 31, 23, 59, 59));
    expect(todayKey()).toBe('2026-12-31');

    __setClockForTests(() => new Date(2027, 0, 1, 0, 0, 0));
    expect(todayKey()).toBe('2027-01-01');
  });
});

describe('greetingForNow', () => {
  it('says good morning before noon', () => {
    __setClockForTests(() => new Date(2026, 6, 6, 6, 0, 0));
    expect(greetingForNow()).toBe('Good morning');
    __setClockForTests(() => new Date(2026, 6, 6, 11, 59, 0));
    expect(greetingForNow()).toBe('Good morning');
  });

  it('says good afternoon from noon up to 5pm', () => {
    __setClockForTests(() => new Date(2026, 6, 6, 12, 0, 0));
    expect(greetingForNow()).toBe('Good afternoon');
    __setClockForTests(() => new Date(2026, 6, 6, 16, 59, 0));
    expect(greetingForNow()).toBe('Good afternoon');
  });

  it('says good evening from 5pm onward', () => {
    __setClockForTests(() => new Date(2026, 6, 6, 17, 0, 0));
    expect(greetingForNow()).toBe('Good evening');
    __setClockForTests(() => new Date(2026, 6, 6, 23, 59, 0));
    expect(greetingForNow()).toBe('Good evening');
  });
});

describe('formatMonthLabel', () => {
  it('formats a date key into a month/year label', () => {
    expect(formatMonthLabel('2026-07-06')).toMatch(/July.*2026/);
  });
});
