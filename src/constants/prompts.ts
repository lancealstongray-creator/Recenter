// Three fixed, short evening prompts. Kept constant (not user-configurable)
// so the reflection stays quick and consistent — no setup, no decisions.
export const EVENING_PROMPTS = [
  {
    key: 'highlight' as const,
    question: 'What moment stood out today?',
  },
  {
    key: 'challenge' as const,
    question: 'What felt hard today?',
  },
  {
    key: 'gratitude' as const,
    question: "What's one thing you're grateful for?",
  },
];
