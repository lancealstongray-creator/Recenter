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

export function greetingForNow(): string {
  const hour = now().getHours();
  if (hour < 12) return 'Good morning';
  if (hour < 17) return 'Good afternoon';
  return 'Good evening';
}
