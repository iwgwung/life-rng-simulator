export interface GameEvent {
  title: string;
  description: string;
  healthChange: number;
  moneyChange: number;
  happinessChange?: number;
  intelligenceChange?: number;
  charismaChange?: number;
  rarity: 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary' | 'mythical' | 'godly';
  odds: number;
  ageMin?: number;
  ageMax?: number;
}

export type Phase = 'infancia' | 'adolescencia' | 'adultez' | 'madurez' | 'vejez';

const PHASE_ORDER: Phase[] = ['infancia', 'adolescencia', 'adultez', 'madurez', 'vejez'];
export function getPhase(age: number): Phase {
  if (age < 5) return 'infancia';
  if (age < 18) return 'adolescencia';
  if (age < 40) return 'adultez';
  if (age < 65) return 'madurez';
  return 'vejez';
}

const COMMON_WEIGHTS = Array(98).fill(null);
const UNCOMMON_WEIGHTS = Array(15).fill(null);
const RARE_WEIGHTS = Array(5).fill(null);
const EPIC_WEIGHTS = Array(2).fill(null);
const LEGENDARY_WEIGHTS = Array(1).fill(null);
const MYTHICAL_WEIGHTS = Array(1).fill(null);
const GODLY_WEIGHTS = Array(1).fill(null);

export const EVENTS: GameEvent[] = [
  // ── INFANCIA (0–5) ──────────────────────────────────────────────
  {
    title: "Primeros Pasos",
    description: "Diste tus primeros pasos y te golpeaste contra la mesa. Tus padres corrieron a abrazarte.",
    healthChange: -3, moneyChange: 0, rarity: 'common', odds: 1, ageMin: 0, ageMax: 5,
  },
  {
    title: "Pérdida de Dientes",
    description: "Se te cayó un diente de leche. Tu mamá lo guardó bajo la almohada para el Ratón Pérez.",
    healthChange: -1, moneyChange: 10, rarity: 'common', odds: 1, ageMin: 5, ageMax: 10,
  },
  {
    title: "Gripe Escolar",
    description: "Te pusiste enfermo en el jardín de infantes. Todo el colegio también.",
    healthChange: -12, moneyChange: -15, rarity: 'common', odds: 1, ageMin: 3, ageMax: 12,
  },
  {
    title: "Primer Amigo",
    description: "Hiciste tu mejor amigo en el patio. Prometieron ser amigos para siempre.",
    healthChange: 0, moneyChange: 0, happinessChange: 20, rarity: 'uncommon', odds: 100, ageMin: 4, ageMax: 12,
  },
  {
    title: "Bicicleta Nueva",
    description: "Tu papá te compró una bicicleta con rueditas. Nadie te podía alcanzar.",
    healthChange: 5, moneyChange: -80, happinessChange: 15, rarity: 'uncommon', odds: 100, ageMin: 4, ageMax: 10,
  },
  {
    title: "Quedate Orfano de un Animal",
    description: "Tu hamster no duró mucho. Aprendiste que la vida es corta.",
    healthChange: -2, moneyChange: 0, happinessChange: -10, rarity: 'common', odds: 1, ageMin: 5, ageMax: 14,
  },
  // ── ADOLESCENCIA (12–18) ────────────────────────────────────────
  {
    title: "Primer Amor",
    description: "Te enamorphaste de alguien en el colegio. No correspondido, pero bonito.",
    healthChange: 0, moneyChange: 0, happinessChange: 10, rarity: 'common', odds: 1, ageMin: 12, ageMax: 18,
  },
  {
    title: "Primer Trauma Escolár",
    description: "Un profesor te humilló frente a todos. Años después olvidaste quién era, pero sentís el reflejo.",
    healthChange: -5, moneyChange: 0, happinessChange: -15, rarity: 'common', odds: 1, ageMin: 12, ageMax: 18,
  },
  {
    title: "Día de Gimnasio",
    description: "Empezaste a levantar pesas en el colegio. Te duele todo pero te sentís más fuerte.",
    healthChange: 15, moneyChange: -15, rarity: 'uncommon', odds: 100, ageMin: 13, ageMax: 22,
  },
  {
    title: "Trabajo Informal",
    description: "Ayudaste a tu vecino a pintar su casa. Te pagó bien y te regaló una pizza.",
    healthChange: 5, moneyChange: 40, rarity: 'uncommon', odds: 100, ageMin: 14, ageMax: 20,
  },
  {
    title: "Lotería Instantánea",
    description: "Compraste un raspadito de 1 dólar y ganaste $50. Tu mamá te regañó por gastar.",
    healthChange: 3, moneyChange: 50, rarity: 'uncommon', odds: 100, ageMin: 15, ageMax: 25,
  },
  {
    title: "Examen que No Estudiaste",
    description: "Sacaste mala nota porque no abrías el libro. Tu familia puso la cara.",
    healthChange: -3, moneyChange: 0, happinessChange: -12, rarity: 'common', odds: 1, ageMin: 12, ageMax: 18,
  },
  // ── ADULTEZ (18–40) ─────────────────────────────────────────────
  {
    title: "Primer Trabajo",
    description: "Conseguiste tu primer empleo real. Ganaste tu primer sueldo y sentiste poder.",
    healthChange: 3, moneyChange: 800, rarity: 'common', odds: 1, ageMin: 18, ageMax: 30,
  },
  {
    title: "Golpe de Suerte",
    description: "Encontraste una billetera con $200 dentro. Eras honrado y la devolviste… o casi.",
    healthChange: 5, moneyChange: 200, rarity: 'rare', odds: 1000, ageMin: 18, ageMax: 40,
  },
  {
    title: "Encontraste tu Alma Gemela",
    description: "Conociste a alguien especial en una cafetería. El amor está en el aire.",
    healthChange: 10, moneyChange: -50, happinessChange: 25, rarity: 'rare', odds: 1000, ageMin: 18, ageMax: 45,
  },
  {
    title: "Primer Departamente",
    description: "Alquilaste tu propio lugar. Nadie te iba a regañar más por dejar los platos sucios.",
    healthChange: 5, moneyChange: -2000, happinessChange: 10, rarity: 'uncommon', odds: 100, ageMin: 18, ageMax: 35,
  },
  {
    title: "Viral en Internet",
    description: "Un video tuyo se volvió viral. Tienes 1M de seguidores overnight. Ya nadie te reconoce en la calle.",
    healthChange: -5, moneyChange: 500, happinessChange: 20, charismaChange: 10, rarity: 'epic', odds: 10000, ageMin: 18, ageMax: 40,
  },
  {
    title: "Carrera Exitosa",
    description: "Consiguieste tu primer gran trabajo. Tu familia está orgullosa y tu cuenta bancaria empieza a respirar.",
    healthChange: 10, moneyChange: 5000, intelligenceChange: 5, rarity: 'epic', odds: 10000, ageMin: 22, ageMax: 40,
  },
  {
    title: "Desayuno Romántico",
    description: "Fuiste a desayunar con alguien especial. La conexión fue eléctrica, pero solo fueron tres meses.",
    healthChange: 0, moneyChange: -60, happinessChange: 5, charismaChange: 3, rarity: 'common', odds: 1, ageMin: 18, ageMax: 35,
  },
  // ── MADUREZ (40–65) ─────────────────────────────────────────────
  {
    title: "Millonario de la Noche",
    description: "Ganaste la lotería nacional. ¡$10 millones! Pero ahora todos te piden prestado.",
    healthChange: -10, moneyChange: 10000000, happinessChange: 30, rarity: 'legendary', odds: 100000, ageMin: 30, ageMax: 65,
  },
  {
    title: "Midlife Crisis",
    description: "Compraste un auto deportivo que no podías permitirte. Tu cónyuge no estuvo de acuerdo.",
    healthChange: -8, moneyChange: -50000, happinessChange: 5, rarity: 'rare', odds: 1000, ageMin: 40, ageMax: 55,
  },
  {
    title: "Hijo Adopción",
    description: "Decidiste adoptar. Ahora tienes un pequeño que te llama mami/papá y te arruina el sueño.",
    healthChange: -15, moneyChange: -3000, happinessChange: 40, charismaChange: 10, rarity: 'epic', odds: 10000, ageMin: 25, ageMax: 50,
  },
  {
    title: "Descubrimiento Científico",
    description: "Hiciste un avance que cambiaría el mundo. Ganan el Nobel a los 52, cuando ya pensabas retirarte.",
    healthChange: 5, moneyChange: 500000, intelligenceChange: 20, happinessChange: 15, rarity: 'legendary', odds: 100000, ageMin: 35, ageMax: 65,
  },
  {
    title: "Abuela/Muñeca Diagnóstico",
    description: "Te diagnosticaron algo preocupante. Después resultó ser menos grave, pero te dio una lesson de vida.",
    healthChange: -20, moneyChange: -500, happinessChange: -5, rarity: 'rare', odds: 1000, ageMin: 45, ageMax: 70,
  },
  // ── VEJEZ (65+) ─────────────────────────────────────────────────
  {
    title: "Jubilación Dorada",
    description: "Te retiraste con merecimiento. El tiempo libre es el verdadero lujo.",
    healthChange: -10, moneyChange: 0, happinessChange: 25, rarity: 'common', odds: 1, ageMin: 65, ageMax: 100,
  },
  {
    title: "Nieto/a Primero",
    description: "Tu hijo te presentó a tu primer nieto. Sentís que la vida se renueva.",
    healthChange: 10, moneyChange: -200, happinessChange: 35, rarity: 'rare', odds: 1000, ageMin: 60, ageMax: 95,
  },
  {
    title: "Recuerdo Difuso",
    description: "Olvidaste por qué entraste a la cocina. Pero tu memoria sigue ahí, escondida.",
    healthChange: -8, moneyChange: 0, happinessChange: -5, rarity: 'common', odds: 1, ageMin: 70, ageMax: 100,
  },
  {
    title: "Legado Familiar",
    description: "Escribiste tus memorias. Tus hijos las leerán cuando ya no estés.",
    healthChange: -5, moneyChange: 0, happinessChange: 15, intelligenceChange: 5, rarity: 'epic', odds: 10000, ageMin: 65, ageMax: 100,
  },
  // ── ANY AGE MYTHICAL/GODLY ─────────────────────────────────────
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

// Famous life stories — only appear after a minimum age
export const FAMOUS_LIVES: Omit<GameEvent, 'odds'>[] = [
  {
    title: "Eres Steve Jobs",
    description: "Fundaste una compañía en un garaje. Cambiaste la tecnología para siempre.",
    healthChange: -30, moneyChange: 50000000, happinessChange: 40, intelligenceChange: 30, charismaChange: 30, rarity: 'legendary', ageMin: 20,
  },
  {
    title: "Eres Albert Einstein",
    description: "Tus ecuaciones reescribieron la física. E=mc² te hará famoso por siempre.",
    healthChange: 10, moneyChange: 100000, happinessChange: 20, intelligenceChange: 100, rarity: 'epic', ageMin: 22,
  },
  {
    title: "Eres Messi",
    description: "El pibe caminero se convirtió en el mejor futbolista de la historia. Balones de Oro infinitos.",
    healthChange: 40, moneyChange: 100000000, happinessChange: 50, charismaChange: 50, rarity: 'legendary', ageMin: 16,
  },
  {
    title: "Eres Taylor Swift",
    description: "De country pop a dominar el mundo. Eras Eras Tour rompe récords globales.",
    healthChange: 10, moneyChange: 200000000, happinessChange: 60, charismaChange: 80, rarity: 'mythical', ageMin: 18,
  },
  {
    title: "Eres Elon Musk",
    description: "Lanzaste cohetes al espacio y compraste Twitter. Ahora quieres ir a Marte.",
    healthChange: -50, moneyChange: 500000000, happinessChange: -20, charismaChange: 40, rarity: 'epic', ageMin: 25,
  },
  {
    title: "Eres Pablo Escobar",
    description: "El narcotraficante más poderoso del mundo. Terminaste muriendo en un roof.",
    healthChange: -9999, moneyChange: 500000000, happinessChange: -100, rarity: 'legendary', ageMin: 20,
  },
];

export function getWeightedRandomEvent(currentYear: number): GameEvent {
  const phase = getPhase(currentYear);
  const eligible = EVENTS.filter(e => {
    if (e.ageMin !== undefined && currentYear < e.ageMin) return false;
    if (e.ageMax !== undefined && currentYear > e.ageMax) return false;
    return true;
  });

  const pool = [...COMMON_WEIGHTS, ...UNCOMMON_WEIGHTS, ...RARE_WEIGHTS, ...EPIC_WEIGHTS, ...LEGENDARY_WEIGHTS, ...MYTHICAL_WEIGHTS, ...GODLY_WEIGHTS];
  const rarityRoll = pool[Math.floor(Math.random() * pool.length)];

  // Filter candidates to eligible ones with matching rarity
  let candidates = eligible.filter(e => e.rarity === rarityRoll);
  if (candidates.length === 0) {
    candidates = eligible.filter(e => e.rarity === 'common');
  }

  // Chance for a famous life (only from eligible ones)
  const famousCandidate = FAMOUS_LIVES.find(f => {
    const minAge = f.ageMin ?? 0;
    return currentYear >= minAge;
  });
  if (famousCandidate && Math.random() < 0.04) {
    return { ...famousCandidate, odds: 500000 } as GameEvent;
  }

  if (candidates.length === 0) {
    // Fallback: any event without age restrictions
    const fallback = EVENTS.filter(e => !e.ageMin && !e.ageMax);
    return fallback[Math.floor(Math.random() * fallback.length)];
  }

  return candidates[Math.floor(Math.random() * candidates.length)];
}

export const RARITY_CONFIG = {
  common:   { color: 'text-stone-300',      bg: 'from-stone-800/70 to-stone-900/70',  border: 'border-stone-600', label: 'Común',      emoji: '⚪' },
  uncommon: { color: 'text-emerald-400',     bg: 'from-emerald-900/40 to-emerald-950/40', border: 'border-emerald-500', label: 'Inusual',    emoji: '🟢' },
  rare:     { color: 'text-sky-400',         bg: 'from-sky-900/40 to-sky-950/40',    border: 'border-sky-500',   label: 'Raro',       emoji: '🔵' },
  epic:     { color: 'text-violet-400',      bg: 'from-violet-900/40 to-violet-950/40', border: 'border-violet-500', label: 'Épico',     emoji: '🟣' },
  legendary:{ color: 'text-amber-400',       bg: 'from-amber-900/40 to-amber-950/40', border: 'border-amber-500', label: 'Legendario', emoji: '🟠' },
  mythical: { color: 'text-fuchsia-300',     bg: 'from-fuchsia-900/30 to-pink-950/30',border: 'border-fuchsia-400',label: 'Mítico',    emoji: '🌈' },
  godly:    { color: 'text-yellow-300',      bg: 'from-yellow-700/50 to-amber-900/60',border: 'border-yellow-400',label: 'DIVINO',     emoji: '✨' },
};

export const PHASE_CONFIG: Record<Phase, { label: string; color: string; bg: string }> = {
  infancia:   { label: 'INFANCIA',    color: 'text-sky-400',  bg: 'bg-sky-500/10' },
  adolescencia:{ label: 'ADOLESCENCIA',color: 'text-violet-400', bg: 'bg-violet-500/10' },
  adultez:    { label: 'ADULTEZ',     color: 'text-amber-400', bg: 'bg-amber-500/10' },
  madurez:    { label: 'MADUREZ',     color: 'text-rose-400',  bg: 'bg-rose-500/10' },
  vejez:      { label: 'VEJEZ',       color: 'text-stone-400', bg: 'bg-stone-500/10' },
};
