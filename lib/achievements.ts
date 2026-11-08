export interface Achievement {
  id: string;
  name: string;
  description: string;
  emoji: string;
  condition: (stats: PlayerStats, year: number, rareCount: number, rebirths: number) => boolean;
}

export interface PlayerStats {
  health: number;
  money: number;
  happiness: number;
  intelligence: number;
  charisma: number;
}

export const ACHIEVEMENTS: Achievement[] = [
  { id: 'centenario', name: 'Centenario', description: 'Llegar a los 100 años', emoji: '🎂', condition: (_, y) => y >= 100 },
  { id: 'broke', name: 'En la Ruana', description: 'Morir con $0', emoji: '💸', condition: (s) => s.money <= 0 },
  { id: 'millonario', name: 'Millonario', description: 'Acumular $1M en una vida', emoji: '💎', condition: (s) => s.money >= 1000000 },
  { id: 'coleccionista', name: 'Coleccionista', description: 'Desbloquear 10 rarezas distintas', emoji: '📚', condition: (_, _, r) => r >= 10 },
  { id: 'super_rico', name: 'Super Rico', description: 'Tener $100M', emoji: '🤑', condition: (s) => s.money >= 100000000 },
  { id: 'filantropo', name: 'Filántropo', description: 'Donar todo tu dinero (tener $0 y seguir vivo)', emoji: '❤️', condition: (s) => s.money === 0 && s.health > 0 },
  { id: 'genio', name: 'Genio Absoluto', description: 'Llegar a 999 de inteligencia', emoji: '🧠', condition: (s) => s.intelligence >= 999 },
  { id: 'carismatico', name: 'Carismático', description: 'Llegar a 999 de carisma', emoji: '⭐', condition: (s) => s.charisma >= 999 },
  { id: 'feliz', name: 'Eteramente Feliz', description: 'Llegar a 999 de felicidad', emoji: '😄', condition: (s) => s.happiness >= 999 },
  { id: 'rebirth_1', name: 'Reencarnado', description: 'Hacer tu primer Rebirth', emoji: '🔄', condition: (_, __, __, rb) => rb >= 1 },
  { id: 'rebirth_5', name: 'Cíclico', description: 'Reencarnar 5 veces', emoji: '♻️', condition: (_, __, __, rb) => rb >= 5 },
  { id: 'godly_event', name: 'Electo por los Dioses', description: 'Recibir un evento divino', emoji: '⚡', condition: (_, __, __, ___) => false }, // tracked via game
];
