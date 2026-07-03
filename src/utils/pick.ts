// Deterministic "random" pick seeded by date key, so the same day always
// shows the same life-area reminder / encouragement without any storage.
export function pickForDate<T>(items: T[], dateKey: string): T {
  const seed = dateKey.split('-').reduce((acc, part) => acc + Number(part), 0);
  const index = seed % items.length;
  return items[index];
}
