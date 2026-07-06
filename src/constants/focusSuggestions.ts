// Two gentle starting points per life area — offered as tappable
// suggestions during onboarding and the first Morning Session, never
// as a mandatory checklist.
export const FOCUS_SUGGESTIONS: Record<string, string[]> = {
  health: ['Take a short walk today', 'Drink enough water today'],
  relationships: ['Reach out to someone you care about', 'Really listen in one conversation today'],
  work: ['Focus on one task at a time', 'Take a real break today'],
  growth: ['Read a few pages of something meaningful', 'Try one small new thing today'],
  rest: ['Rest when you need to, without guilt', 'Protect a quiet moment for yourself'],
  family: ['Be fully present with your family today', 'Share a meal without distractions'],
  finances: ['Check in on your spending, gently', 'Set aside a little for the future'],
  creativity: ['Make time for something creative today', 'Notice one beautiful thing today'],
};

export function suggestionsForAreas(areaIds: string[]): string[] {
  const seen = new Set<string>();
  const suggestions: string[] = [];
  for (const id of areaIds) {
    for (const suggestion of FOCUS_SUGGESTIONS[id] ?? []) {
      if (!seen.has(suggestion)) {
        seen.add(suggestion);
        suggestions.push(suggestion);
      }
    }
  }
  return suggestions;
}
