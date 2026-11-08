export interface Upgrade {
  id: string;
  name: string;
  description: string;
  cost: number;
  effect: 'luck' | 'healthRegen' | 'moneyMultiplier' | 'autoSave';
  value: number;
  maxStacks?: number;
}

export const UPGRADES: Upgrade[] = [
  { id: 'lucky_charm', name: 'Amuleto de la Suerte', description: '+10% probabilidad de eventos raros', cost: 500, effect: 'luck', value: 0.1, maxStacks: 5 },
  { id: 'gym_membership', name: 'Gimnasio Premium', description: '+5 salud por año', cost: 300, effect: 'healthRegen', value: 5, maxStacks: 3 },
  { id: 'investments', name: 'Inversiones Inteligentes', description: 'Dinero x1.5', cost: 1000, effect: 'moneyMultiplier', value: 0.5, maxStacks: 5 },
  { id: 'education', name: 'Educación Superior', description: '+10 inteligencia permanente', cost: 800, effect: 'luck', value: 0.05, maxStacks: 2 },
  { id: 'charisma_camp', name: 'Campo de Carisma', description: '+20 carisma base', cost: 600, effect: 'luck', value: 0.08, maxStacks: 3 },
  { id: 'healthy_food', name: 'Comida Orgánica', description: '-50% daño de enfermedades', cost: 400, effect: 'healthRegen', value: 3, maxStacks: 3 },
];
