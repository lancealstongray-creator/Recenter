// A single injectable "now" so tests can exercise midnight, timezone, and
// missed-day scenarios deterministically. Production code never passes an
// argument, so behavior is unchanged — this is purely for testability.
let clockOverride: (() => Date) | null = null;

export function __setClockForTests(fn: (() => Date) | null): void {
  clockOverride = fn;
}

function now(): Date {
  return clockOverride ? clockOverride() : new Date();
}

export function todayKey(): string {
  return toDateKey(now());
}

export function toDateKey(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

export function formatFriendlyDate(dateKey: string): string {
  const [y, m, d] = dateKey.split('-').map(Number);
  const date = new Date(y, m - 1, d);
  return date.toLocaleDateString(undefined, { weekday: 'long', month: 'long', day: 'numeric' });
}

export function formatMonthLabel(dateKey: string): string {
  const [y, m] = dateKey.split('-').map(Number);
  const date = new Date(y, m - 1, 1);
  return date.toLocaleDateString(undefined, { month: 'long', year: 'numeric' });
}

// Meteorological (Northern Hemisphere) seasons, split into Early/plain/
// Late thirds so a season groups roughly a month at a time, matching
// Archived Journey's "reframe chronology as memory rather than a log" —
// deliberately no year in the label, since a season name alone already
// reads as a memory, not a calendar entry.
const SEASON_BY_MONTH: Record<number, string> = {
  12: 'Winter',
  1: 'Winter',
  2: 'Winter',
  3: 'Spring',
  4: 'Spring',
  5: 'Spring',
  6: 'Summer',
  7: 'Summer',
  8: 'Summer',
  9: 'Fall',
  10: 'Fall',
  11: 'Fall',
};
const SEASON_QUALIFIER_BY_POSITION = ['Early', '', 'Late'];

export function formatSeasonLabel(dateKey: string): string {
  const [, m] = dateKey.split('-').map(Number);
  const season = SEASON_BY_MONTH[m];
  const seasonStartMonth: Record<string, number> = { Winter: 12, Spring: 3, Summer: 6, Fall: 9 };
  const position = ((m - seasonStartMonth[season] + 12) % 12) % 3;
  const qualifier = SEASON_QUALIFIER_BY_POSITION[position];
  return qualifier ? `${qualifier} ${season}` : season;
}

// "You've been reflecting for N months." — a perspective line stated
// once, never a running counter. Rounds down to whole months; a first
// month reads as "a few weeks" rather than "0 months."
export function monthsSince(dateKey: string, nowDate: Date = now()): string {
  const [y, m, d] = dateKey.split('-').map(Number);
  const start = new Date(y, m - 1, d);
  let months = (nowDate.getFullYear() - start.getFullYear()) * 12 + (nowDate.getMonth() - start.getMonth());
  if (nowDate.getDate() < start.getDate()) months -= 1;
  if (months <= 0) return 'a few weeks';
  return `${months} ${months === 1 ? 'month' : 'months'}`;
}

export function greetingForNow(): string {
  const hour = now().getHours();
  if (hour < 12) return 'Good morning';
  if (hour < 17) return 'Good afternoon';
  return 'Good evening';
}
