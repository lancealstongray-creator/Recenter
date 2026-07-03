import { Mood } from '../types';

export const MOODS: Mood[] = [
  { id: 'calm', label: 'Calm', icon: '🙂' },
  { id: 'energized', label: 'Energized', icon: '⚡️' },
  { id: 'tender', label: 'Tender', icon: '🩶' },
  { id: 'tired', label: 'Tired', icon: '🌫️' },
  { id: 'unsettled', label: 'Unsettled', icon: '🌊' },
  { id: 'grateful', label: 'Grateful', icon: '✨' },
];

export function getMood(id: string): Mood | undefined {
  return MOODS.find((mood) => mood.id === id);
}
