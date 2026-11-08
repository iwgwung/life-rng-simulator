export interface GameEvent {
  title: string;
  description: string;
  healthChange: number;
  moneyChange: number;
  happinessChange?: number;
  intelligenceChange?: number;
  charismaChange?: number;
  rarity: 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary' | 'mythical' | 'godly';
  odds: number; // e.g., 100 = 1 in 100 chance
}

const COMMON_WEIGHTS = Array(98).fill(null);
const UNCOMMON_WEIGHTS = Array(15).fill(null);
const RARE_WEIGHTS = Array(5).fill(null);
const EPIC_WEIGHTS = Array(2).fill(null);
const LEGENDARY_WEIGHTS = Array(1).fill(null);
const MYTHICAL_WEIGHTS = Array(1).fill(null);
const GODLY_WEIGHTS = Array(1).fill(null);

export const EVENTS: GameEvent[] = [
  // COMMON (white)
  {
    title: "Primeros Pasos",
    description: "Intentaste comerte una moneda del suelo. Sobreviviste pero tus padres gastaron en el médico.",
    healthChange: -5, moneyChange: -20, rarity: 'common', odds: 1,
  },
  {
    title: "Gripe Fuerte",
    description: "El invierno fue brutal. Pasaste dos semanas en cama a base de té y paracetamol.",
    healthChange: -15, moneyChange: -10, rarity: 'common', odds: 1,
  },
  {
    title: "Primer Amor",
    description: "Te enamorphaste de alguien en el colegio. No correspondido, pero bonito.",
    healthChange: 0, moneyChange: 0, happinessChange: 10, rarity: 'common', odds: 1,
  },
  {
    title: "Pérdida de Dientes",
    description: "Perdiste un diente jugando. Tu mamá te lo guardó bajo la almohada.",
    healthChange: -2, moneyChange: 0, rarity: 'common', odds: 1,
  },
  {
    title: "Primer Trabajo",
    description: "Lavaste autos por $20 los domingos. Aprendiste el valor del dinero.",
    healthChange: 3, moneyChange: 20, rarity: 'common', odds: 1,
  },
  // UNCOMMON (green)
  {
    title: "Trabajo Informal",
    description: "Ayudaste a tu vecino a pintar su casa. Te pagó bien y te regaló una pizza.",
    healthChange: 5, moneyChange: 40, rarity: 'uncommon', odds: 100,
  },
  {
    title: "Lotería Instantánea",
    description: "Compraste un raspadito de 1 dólar y ganaste $50.",
    healthChange: 5, moneyChange: 50, rarity: 'uncommon', odds: 100,
  },
  {
    title: "Día de Gimnasio",
    description: "Empezaste a levantar pesas. Te duele todo pero te sientes más fuerte.",
    healthChange: 15, moneyChange: -15, rarity: 'uncommon', odds: 100,
  },
  // RARE (blue)
  {
    title: "Golpe de Suerte",
    description: "Encontraste una billetera con $200 dentro. ¡Eras honrado y la devolviste!",
    healthChange: 5, moneyChange: 200, rarity: 'rare', odds: 1000,
  },
  {
    title: "Encontraste tu Alma Gemela",
    description: "Conociste a alguien especial. El amor está en el aire.",
    healthChange: 10, moneyChange: -50, happinessChange: 25, rarity: 'rare', odds: 1000,
  },
  // EPIC (purple)
  {
    title: "Viral en Internet",
    description: "Un video tuyo se volvió viral. Tienes 1M de seguidores overnight.",
    healthChange: -5, moneyChange: 500, happinessChange: 20, charismaChange: 10, rarity: 'epic', odds: 10000,
  },
  {
    title: "Carrera Exitosa",
    description: "Consiguieste tu primer gran trabajo. Tu familia está orgullosa.",
    healthChange: 10, moneyChange: 1000, intelligenceChange: 5, rarity: 'epic', odds: 10000,
  },
  // LEGENDARY (orange/gold)
  {
    title: "Millonario de la Noche",
    description: "Ganaste la lotería nacional. ¡$10 millones! Pero ahora todos te piden prestado.",
    healthChange: -10, moneyChange: 10000000, happinessChange: 30, rarity: 'legendary', odds: 100000,
  },
  {
    title: "Descubrimiento Científico",
    description: "Hiciste un avance que cambiaría el mundo. Ganan el Nobel.",
    healthChange: 5, moneyChange: 500000, intelligenceChange: 20, happinessChange: 15, rarity: 'legendary', odds: 100000,
  },
  // MYTHICAL (rainbow/cosmic)
  {
    title: "Contacto Extraterrestre",
    description: "Los aliens te visitaron. Son simpáticos. Te invitaron a su planeta.",
    healthChange: 20, moneyChange: 0, happinessChange: 50, rarity: 'mythical', odds: 1000000,
  },
  {
    title: "Viajero del Tiempo",
    description: "Accidentalmente viajaste al futuro. Volviste con conocimiento prohibido.",
    healthChange: -20, moneyChange: 0, intelligenceChange: 50, rarity: 'mythical', odds: 1000000,
  },
  // GODLY (bright gold with aura)
  {
    title: "NACISTE EN LA DINASTÍA WANG",
    description: "Tu familia es más rica que países enteros. Vives en un palacio de 500 habitaciones.",
    healthChange: 50, moneyChange: 999999999, happinessChange: 100, rarity: 'godly', odds: 10000000,
  },
  {
    title: "TE CONVIRTIERON EN DIOS",
    description: "Literalmente ascenderiste al panteón olímpico. Los mortales te rezan.",
    healthChange: 999, moneyChange: 0, happinessChange: 999, intelligenceChange: 999, charismaChange: 999, rarity: 'godly', odds: 10000000,
  },
];

// Famous life stories as special events
export const FAMOUS_LIVES: Omit<GameEvent, 'odds'>[] = [
  {
    title: "Eres Steve Jobs",
    description: "Fundaste una compañía en un garaje. Cambiaste la tecnología para siempre.",
    healthChange: -30, moneyChange: 50000000, happinessChange: 40, intelligenceChange: 30, charismaChange: 30, rarity: 'legendary',
  },
  {
    title: "Eres Albert Einstein",
    description: "Tus ecuaciones reescribieron la física. E=mc² te hará famoso por siempre.",
    healthChange: 10, moneyChange: 100000, happinessChange: 20, intelligenceChange: 100, rarity: 'epic',
  },
  {
    title: "Eres Messi",
    description: "El pibe caminero se convirtió en el mejor futbolista de la historia. Balones de Oro infinitos.",
    healthChange: 40, moneyChange: 100000000, happinessChange: 50, charismaChange: 50, rarity: 'legendary',
  },
  {
    title: "Eres Taylor Swift",
    description: "De country pop a dominar el mundo. Eras Eras Tour rompe récords globales.",
    healthChange: 10, moneyChange: 200000000, happinessChange: 60, charismaChange: 80, rarity: 'mythical',
  },
  {
    title: "Eres Elon Musk",
    description: "Lanzaste cohetes al espacio y compraste Twitter. Ahora quieres ir a Marte.",
    healthChange: -50, moneyChange: 500000000, happinessChange: -20, charismaChange: 40, rarity: 'epic',
  },
  {
    title: "Eres Pablo Escobar",
    description: "El narcotraficante más poderoso del mundo. Terminaste muriendo en un roof.",
    healthChange: -9999, moneyChange: 500000000, happinessChange: -100, rarity: 'legendary',
  },
];

export function getWeightedRandomEvent(): GameEvent {
  const pool = [...COMMON_WEIGHTS, ...UNCOMMON_WEIGHTS, ...RARE_WEIGHTS, ...EPIC_WEIGHTS, ...LEGENDARY_WEIGHTS, ...MYTHICAL_WEIGHTS, ...GODLY_WEIGHTS];
  const rarityRoll = pool[Math.floor(Math.random() * pool.length)];

  let candidates: GameEvent[];
  if (rarityRoll === null) {
    // Check if should be a famous life
    if (Math.random() < 0.05) {
      return FAMOUS_LIVES[Math.floor(Math.random() * FAMOUS_LIVES.length)] as GameEvent;
    }
    const commonEvents = EVENTS.filter(e => e.rarity === 'common');
    candidates = commonEvents;
  } else {
    candidates = EVENTS.filter(e => e.rarity === rarityRoll);
    if (candidates.length === 0) {
      candidates = EVENTS.filter(e => e.rarity === 'common');
    }
  }

  return candidates[Math.floor(Math.random() * candidates.length)];
}

export const RARITY_CONFIG = {
  common:   { color: 'text-gray-300', bg: 'from-gray-800/80 to-gray-900/80', border: 'border-gray-600', glow: 'shadow-gray-500/20', label: 'Común',     emoji: '⚪' },
  uncommon: { color: 'text-emerald-400', bg: 'from-emerald-900/40 to-emerald-950/40', border: 'border-emerald-500', glow: 'shadow-emerald-500/30', label: 'Inusual',    emoji: '🟢' },
  rare:     { color: 'text-blue-400', bg: 'from-blue-900/40 to-blue-950/40', border: 'border-blue-500', glow: 'shadow-blue-500/30', label: 'Raro',       emoji: '🔵' },
  epic:     { color: 'text-purple-400', bg: 'from-purple-900/40 to-purple-950/40', border: 'border-purple-500', glow: 'shadow-purple-500/30', label: 'Épico',      emoji: '🟣' },
  legendary:{ color: 'text-amber-400', bg: 'from-amber-900/40 to-amber-950/40', border: 'border-amber-500', glow: 'shadow-amber-500/40', label: 'Legendario',  emoji: '🟠' },
  mythical: { color: 'text-cyan-300', bg: 'from-cyan-900/40 to-pink-950/40', border: 'border-cyan-400', glow: 'shadow-cyan-500/40', label: 'Mítico',      emoji: '🌈' },
  godly:    { color: 'text-yellow-300', bg: 'from-yellow-600/40 to-amber-900/60', border: 'border-yellow-400', glow: 'shadow-yellow-400/60', label: 'DIVINO',      emoji: '✨' },
};
