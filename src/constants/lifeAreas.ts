import { LifeArea } from '../types';

export const LIFE_AREAS: LifeArea[] = [
  { id: 'health', label: 'Health', icon: '🌿' },
  { id: 'relationships', label: 'Relationships', icon: '💛' },
  { id: 'work', label: 'Work', icon: '🧭' },
  { id: 'growth', label: 'Growth', icon: '🌱' },
  { id: 'rest', label: 'Rest', icon: '🌙' },
  { id: 'family', label: 'Family', icon: '🏡' },
  { id: 'finances', label: 'Finances', icon: '🪙' },
  { id: 'creativity', label: 'Creativity', icon: '🎨' },
];

export function getLifeArea(id: string): LifeArea | undefined {
  return LIFE_AREAS.find((area) => area.id === id);
}
