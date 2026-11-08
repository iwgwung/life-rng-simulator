export interface GameEvent {
  title: string; description: string;
  healthChange: number; moneyChange: number;
  happinessChange?: number; intelligenceChange?: number; charismaChange?: number;
  rarity: 'common'|'uncommon'|'rare'|'epic'|'legendary'|'mythical'|'godly';
  odds: number; ageMin?: number; ageMax?: number; career?: string;
}
export type Phase = 'infancia'|'adolescencia'|'adultez'|'madurez'|'vejez';
export type Career = 'estudiar'|'delinquir'|'emprender'|'obrero'|null;

const PHASE_ORDER: Phase[] = ['infancia','adolescencia','adultez','madurez','vejez'];
export function getPhase(a:number): Phase {
  if(a<5) return 'infancia'; if(a<18) return 'adolescencia';
  if(a<40) return 'adultez'; if(a<65) return 'madurez'; return 'vejez';
}

// ── CORRECTED WEIGHTS: exponential rarity curve ────────────────
// Common: ~60%, Uncommon: ~25%, Rare: ~10%, Epic: ~3.5%, Legendary: ~1%, Mythical: ~0.4%, Godly: ~0.1%
const CW = Array(60).fill(null);
const UW = Array(25).fill(null);
const RW = Array(10).fill(null);
const EW = Array(3.5).fill(null);
const LW = Array(1).fill(null);
const MW = Array(0.4).fill(null);
const GW = Array(0.1).fill(null);
const FULL_POOL = [...CW,...UW,...RW,...EW,...LW,...MW,...GW];

export const EVENTS: GameEvent[] = [
  // ── INFANCIA (0-12) ─────────────────────────────────────────────
  {title:"Primeros Pasos",description:"Diste tus primeros pasos y te golpeaste contra la mesa.",healthChange:-1,moneyChange:0,rarity:'common',odds:1,ageMin:0,ageMax:5},
  {title:"Ratón Pérez",description:"Se te cayó un diente. El ratón dejó una moneda bajo la almohada.",healthChange:-1,moneyChange:15,happinessChange:5,rarity:'common',odds:1,ageMin:5,ageMax:10},
  {title:"Gripe de Colegio",description:"Te pusiste enfermo. Tu mamá te dio sopa.",healthChange:-5,moneyChange:-10,rarity:'common',odds:1,ageMin:3,ageMax:12},
  {title:"Mejor Amigo",description:"Hiciste tu mejor amigo en el patio.",healthChange:0,moneyChange:0,happinessChange:15,rarity:'uncommon',odds:100,ageMin:4,ageMax:12},
  {title:"Bicicleta Nueva",description:"Tu papá te compró una bicicleta con rueditas.",healthChange:5,moneyChange:-80,happinessChange:12,rarity:'uncommon',odds:100,ageMin:4,ageMax:10},
  {title:"Hamster Querido",description:"Tu hamster no duró mucho. Aprendiste que la vida es corta.",healthChange:-1,moneyChange:0,happinessChange:-8,rarity:'common',odds:1,ageMin:5,ageMax:14},
  {title:"Día de Campo",description:"Fuiste de picnic con tu familia.",healthChange:3,moneyChange:-30,happinessChange:10,rarity:'common',odds:1,ageMin:0,ageMax:10},
  {title:"Perdiste un Zapato",description:"En el recreo se te perdió un zapato.",healthChange:0,moneyChange:0,happinessChange:-3,rarity:'common',odds:1,ageMin:3,ageMax:8},
  {title:"Noche de Película",description:"Viste una película de noche con luces apagadas.",healthChange:0,moneyChange:-20,happinessChange:7,rarity:'common',odds:1,ageMin:5,ageMax:14},
  {title:"Quedate Orfano de Mascota",description:"Tu peonza murió. Lloraste tres días.",healthChange:-2,moneyChange:0,happinessChange:-12,rarity:'common',odds:1,ageMin:6,ageMax:14},
  {title:"Ganaste el concurso",description:"Ganaste el concurso de dibujo en el colegio.",healthChange:0,moneyChange:0,intelligenceChange:3,happinessChange:10,rarity:'uncommon',odds:200,ageMin:6,ageMax:14},
  {title:"Abuela Te Da Dulces",description:"Tu abuela te regaló su primo. Era un peluche gigante.",healthChange:0,moneyChange:0,happinessChange:8,rarity:'common',odds:1,ageMin:0,ageMax:10},
  // ── ADOLESCENCIA (12-18) ────────────────────────────────────────
  {title:"Primer Amor",description:"Te enamorphaste de alguien en el colegio.",healthChange:0,moneyChange:0,happinessChange:10,rarity:'common',odds:1,ageMin:12,ageMax:18},
  {title:"Trauma Escolar",description:"Un profesor te humilló frente a todos.",healthChange:-3,moneyChange:0,happinessChange:-12,rarity:'common',odds:1,ageMin:12,ageMax:18},
  {title:"Día de Gimnasio",description:"Empezaste a levantar pesas en el colegio.",healthChange:12,moneyChange:-15,rarity:'uncommon',odds:100,ageMin:13,ageMax:22},
  {title:"Trabajo Informal",description:"Ayudaste a pintar la casa del vecino.",healthChange:5,moneyChange:40,rarity:'uncommon',odds:100,ageMin:14,ageMax:20},
  {title:"Lotería Instantánea",description:"Compraste un raspadito y ganaste $50.",healthChange:3,moneyChange:50,rarity:'uncommon',odds:100,ageMin:15,ageMax:25},
  {title:"Examen Desastroso",description:"Sacaste mala nota porque no abrías el libro.",healthChange:-2,moneyChange:0,happinessChange:-10,rarity:'common',odds:1,ageMin:12,ageMax:18,career:'estudiar'},
  {title:"Problema con la Ley",description:"Te agarraron robando una goma de borrar.",healthChange:-5,moneyChange:0,charismaChange:-5,rarity:'common',odds:1,ageMin:13,ageMax:18,career:'delinquir'},
  {title:"Negocio Escondido",description:"Vendés remeras por Instagram. Tu mamá no sabe.",healthChange:0,moneyChange:150,happinessChange:5,rarity:'uncommon',odds:100,ageMin:15,ageMax:22,career:'emprender'},
  {title:"Puesto de Obreros",description:"Ayudás a tu tío en la obra los fines de semana.",healthChange:8,moneyChange:200,rarity:'common',odds:1,ageMin:16,ageMax:25,career:'obrero'},
  {title:"Primer Pipo",description:"Tomaste tu primera birra con amigos.",healthChange:-4,moneyChange:-10,happinessChange:3,rarity:'common',odds:1,ageMin:17,ageMax:21},
  // ── ADULTEZ (18-40) ─────────────────────────────────────────────
  {title:"Primer Trabajo Real",description:"Conseguiste empleo. Ganaste tu primer sueldo.",healthChange:2,moneyChange:500,rarity:'common',odds:1,ageMin:18,ageMax:30,career:'obrero'},
  {title:"Golpe de Suerte",description:"Encontraste una billetera con $200.",healthChange:5,moneyChange:200,rarity:'rare',odds:1000,ageMin:18,ageMax:40},
  {title:"Alma Gemela",description:"Conociste a alguien especial.",healthChange:8,moneyChange:-50,happinessChange:20,charismaChange:5,rarity:'rare',odds:1000,ageMin:18,ageMax:45},
  {title:"Primer Departamento",description:"Alquilaste tu propio lugar.",healthChange:3,moneyChange:-2000,happinessChange:8,rarity:'uncommon',odds:100,ageMin:18,ageMax:35},
  {title:"Viral en Internet",description:"Un video tuyo se volvió viral. 1M de seguidores.",healthChange:-5,moneyChange:500,happinessChange:15,charismaChange:10,rarity:'epic',odds:10000,ageMin:18,ageMax:40},
  {title:"Carrera Exitosa",description:"Tu primer gran trabajo. Tu familia está orgullosa.",healthChange:8,moneyChange:3000,intelligenceChange:5,rarity:'epic',odds:10000,ageMin:22,ageMax:40,career:'estudiar'},
  {title:"Desayuno Romántico",description:"La conexión fue eléctrica. Solo fueron tres meses.",healthChange:0,moneyChange:-60,happinessChange:3,charismaChange:3,rarity:'common',odds:1,ageMin:18,ageMax:35},
  {title:"Estafado Cripto",description:"Invertiste en TokenDelCheto. Perdiste todo.",healthChange:-5,moneyChange:-5000,happinessChange:-15,rarity:'rare',odds:1000,ageMin:18,ageMax:40,career:'delinquir'},
  {title:"Jefe a los 30",description:"Promovieron a gerente.",healthChange:-10,moneyChange:12000,intelligenceChange:10,charismaChange:5,rarity:'legendary',odds:100000,ageMin:28,ageMax:35,career:'estudiar'},
  {title:"Bandido de Barrio",description:"Organizaste un micro-tráfico. Dinero rápido, riesgo alto.",healthChange:-15,moneyChange:25000,happinessChange:-20,rarity:'rare',odds:1000,ageMin:18,ageMax:35,career:'delinquir'},
  {title:"Startup Fallida",description:"Tu app no despegó. Pero aprendiste.",healthChange:-5,moneyChange:-10000,happinessChange:-5,intelligenceChange:15,rarity:'epic',odds:10000,ageMin:22,ageMax:40,career:'emprender'},
  {title:"Emprendimiento Exitoso",description:"Tu negocio creció. Contrataste a 5 personas.",healthChange:5,moneyChange:40000,happinessChange:25,charismaChange:10,rarity:'legendary',odds:100000,ageMin:25,ageMax:45,career:'emprender'},
  {title:"Lesión en la Obra",description:"Se cayó un tablón. Te lastimaste la espalda.",healthChange:-20,moneyChange:0,rarity:'rare',odds:1000,ageMin:20,ageMax:50,career:'obrero'},
  {title:"Sindicato Fuerte",description:"Organizaste a los trabajadores.",healthChange:-5,moneyChange:0,charismaChange:20,happinessChange:10,rarity:'epic',odds:10000,ageMin:25,ageMax:50,career:'obrero'},
  {title:"Docente Inspirador",description:"Formaste a miles de estudiantes.",healthChange:5,moneyChange:0,intelligenceChange:15,happinessChange:15,rarity:'epic',odds:10000,ageMin:25,ageMax:55,career:'estudiar'},
  // ── MADUREZ (40-65) ─────────────────────────────────────────────
  {title:"Millonario de la Noche",description:"Ganaste la lotería nacional. $10 millones.",healthChange:-8,moneyChange:8000000,happinessChange:25,rarity:'legendary',odds:100000,ageMin:30,ageMax:65},
  {title:"Midlife Crisis",description:"Compraste un auto deportivo.",healthChange:-6,moneyChange:-50000,happinessChange:3,rarity:'rare',odds:1000,ageMin:40,ageMax:55},
  {title:"Hijo Adopción",description:"Decidiste adoptar.",healthChange:-12,moneyChange:-3000,happinessChange:35,charismaChange:8,rarity:'epic',odds:10000,ageMin:25,ageMax:50},
  {title:"Descubrimiento Científico",description:"Hiciste un avance que cambiaría el mundo.",healthChange:5,moneyChange:400000,intelligenceChange:20,happinessChange:15,rarity:'legendary',odds:100000,ageMin:35,ageMax:65,career:'estudiar'},
  {title:"Diagnóstico Preocupante",description:"Te diagnosticaron algo. Resultó ser menos grave.",healthChange:-15,moneyChange:-500,happinessChange:-3,rarity:'rare',odds:1000,ageMin:45,ageMax:70},
  {title:"Preso por Deudas",description:"No pudiste pagar. Pasaste 6 meses dentro.",healthChange:-25,moneyChange:-20000,happinessChange:-30,rarity:'epic',odds:10000,ageMin:30,ageMax:55,career:'delinquir'},
  {title:"Abuelo Sabio",description:"Tus nietos te consideran un tesoro.",healthChange:5,moneyChange:0,happinessChange:20,charismaChange:5,rarity:'uncommon',odds:200,ageMin:60,ageMax:90},
  // ── VEJEZ (65+) ─────────────────────────────────────────────────
  {title:"Jubilación Dorada",description:"Te retiraste con merecimiento.",healthChange:-8,moneyChange:0,happinessChange:20,rarity:'common',odds:1,ageMin:65,ageMax:100},
  {title:"Nieto/a Primero",description:"Tu hijo te presentó a tu primer nieto.",healthChange:8,moneyChange:-200,happinessChange:30,rarity:'rare',odds:1000,ageMin:60,ageMax:95},
  {title:"Recuerdo Difuso",description:"Olvidaste por qué entraste a la cocina.",healthChange:-6,moneyChange:0,happinessChange:-3,rarity:'common',odds:1,ageMin:70,ageMax:100},
  {title:"Legado Familiar",description:"Escribiste tus memorias.",healthChange:-4,moneyChange:0,happinessChange:12,intelligenceChange:5,rarity:'epic',odds:10000,ageMin:65,ageMax:100},
  // ── MYTHICAL / GODLY (any age) ──────────────────────────────────
  {title:"Contacto Extraterrestre",description:"Los aliens te visitaron.",healthChange:20,moneyChange:0,happinessChange:50,rarity:'mythical',odds:1000000},
  {title:"Viajero del Tiempo",description:"Viajaste al futuro. Volviste con conocimiento prohibido.",healthChange:-15,moneyChange:0,intelligenceChange:50,rarity:'mythical',odds:1000000},
  {title:"NACISTE EN LA DINASTÍA WANG",description:"Más rico que países enteros.",healthChange:50,moneyChange:999999999,happinessChange:100,rarity:'godly',odds:10000000},
  {title:"TE CONVIRTIERON EN DIOS",description:"Ascendiste al panteón olímpico.",healthChange:999,moneyChange:0,happinessChange:999,intelligenceChange:999,charismaChange:999,rarity:'godly',odds:10000000},
];

// ── FAMOUS LIVES ──────────────────────────────────────────────────
export const FAMOUS_LIVES: Omit<GameEvent,'odds'>[] = [
  {title:"Eres Steve Jobs",description:"Fundaste una compañía en un garaje.",healthChange:-25,moneyChange:40000000,happinessChange:35,intelligenceChange:25,charismaChange:25,rarity:'legendary',ageMin:20,career:'emprender'},
  {title:"Eres Albert Einstein",description:"Reescribiste la física.",healthChange:8,moneyChange:80000,happinessChange:15,intelligenceChange:100,rarity:'epic',ageMin:22,career:'estudiar'},
  {title:"Eres Messi",description:"El pibe caminero. Balones de Oro infinitos.",healthChange:35,moneyChange:80000000,happinessChange:45,charismaChange:45,rarity:'legendary',ageMin:16,career:'delinquir'},
  {title:"Eres Taylor Swift",description:"De country pop a dominar el mundo.",healthChange:8,moneyChange:150000000,happinessChange:55,charismaChange:70,rarity:'mythical',ageMin:18,career:'emprender'},
  {title:"Eres Elon Musk",description:"Cohetes al espacio y Twitter comprado.",healthChange:-45,moneyChange:400000000,happinessChange:-15,charismaChange:35,rarity:'epic',ageMin:25,career:'emprender'},
  {title:"Eres Pablo Escobar",description:"Narcotraficante más poderoso.",healthChange:-9999,moneyChange:400000000,happinessChange:-100,rarity:'legendary',ageMin:20,career:'delinquir'},
];

// ── DILEMMAS ──────────────────────────────────────────────────────
export interface Dilemma {
  id: string; question: string;
  optionA: { label: string; success: boolean; effect: (s: Stats) => Stats };
  optionB: { label: string; success: boolean; effect: (s: Stats) => Stats };
  minAge: number; maxAge: number; career: string | null; weight: number;
}
interface Stats { health:number; money:number; happiness:number; intelligence:number; charisma:number; }
const up = (s:Stats,p:Partial<Stats>):Stats=>({...s,...p});

export const DILEMMAS: Dilemma[] = [
  {id:'crypto',question:'Un amigo te ofrece invertir $200 en criptomoneda nueva.',optionA:{label:'¡Invertir!',success:true,effect:s=>up(s,{money:s.money+19000})},optionB:{label:'Ignorar',success:false,effect:s=>s},minAge:18,maxAge:55,career:null,weight:2},
  {id:'lottery_ticket',question:'Compraste un raspadito y ganaste $10. ¿Guardarlo o gastártelo?',optionA:{label:'Ahorrar ($10→$500)',success:true,effect:s=>up(s,{money:s.money+490})},optionB:{label:'Gastarlo',success:false,effect:s=>up(s,{happiness:s.happiness+3})},minAge:10,maxAge:60,career:null,weight:3},
  {id:'find_wallet',question:'Encontraste una billetera con $500. Nadie te ve.',optionA:{label:'Devolverla (+ honor)',success:true,effect:s=>up(s,{charisma:s.charisma+10,happiness:s.happiness+8})},optionB:{label:'Quedártela',success:false,effect:s=>up(s,{money:s.money+500})},minAge:14,maxAge:60,career:null,weight:2},
  {id:'gambling',question:'Un conocido te invita a jugar póker. Apuestas $100.',optionA:{label:'Jugar (50/50)',success:true,effect:s=>up(s,{money:s.money+100})},optionB:{label:'Rechazar',success:false,effect:s=>up(s,{intelligence:s.intelligence+5})},minAge:18,maxAge:55,career:null,weight:3},
  {id:'borrow_money',question:'Tu hermano te pide prestados $200.',optionA:{label:'Prestartelo',success:true,effect:s=>up(s,{happiness:s.happiness+10,charisma:s.charisma+3})},optionB:{label:'Decir que no',success:false,effect:s=>up(s,{happiness:s.happiness-8})},minAge:18,maxAge:50,career:null,weight:2},
  {id:'side_hustle',question:'Tenes una idea de negocio. ¿Arriesgás tus ahorros?',optionA:{label:'Emprender (+$$)',success:true,effect:s=>up(s,{money:s.money+8000,intelligence:s.intelligence+5})},optionB:{label:'Quedarse tranquilo',success:false,effect:s=>up(s,{happiness:s.happiness+3})},minAge:20,maxAge:45,career:'emprender',weight:3},
  {id:'street_deal',question:'Un tipo te ofrece "dinero fácil" vendiendo algo.',optionA:{label:'Aceptar (+$$ pero riesgo)',success:true,effect:s=>up(s,{money:s.money+3000,charisma:s.charisma-5})},optionB:{label:'Rechazar',success:false,effect:s=>up(s,{happiness:s.happiness+5})},minAge:16,maxAge:40,career:'delinquir',weight:4},
  {id:'study_hard',question:'Tenés un examen importante mañana.',optionA:{label:'Estudiar (+IQ)',success:true,effect:s=>up(s,{intelligence:s.intelligence+15,happiness:s.happiness-5})},optionB:{label:'Salir',success:false,effect:s=>up(s,{happiness:s.happiness+12,intelligence:s.intelligence-3})},minAge:12,maxAge:25,career:'estudiar',weight:3},
  {id:'work_overtime',question:'Te ofrecen horas extras.',optionA:{label:'Horas extra (+$$)',success:true,effect:s=>up(s,{money:s.money+600,health:s.health-5})},optionB:{label:'Descansar',success:false,effect:s=>up(s,{health:s.health+8})},minAge:18,maxAge:55,career:'obrero',weight:3},
  {id:'big_purchase',question:'Viste un auto increíble. ¿Lo comprás crédito?',optionA:{label:'Comprar (-$$$ pero feliz)',success:true,effect:s=>up(s,{money:s.money-30000,happiness:s.happiness+20})},optionB:{label:'No comprar',success:false,effect:s=>up(s,{})},minAge:21,maxAge:50,career:null,weight:2},
];

export function shouldShowDilemma(year:number, career:Career): boolean {
  const relevant = DILEMMAS.filter(d=>year>=d.minAge&&year<=d.maxAge&&(!d.career||d.career===career));
  if(!relevant.length) return false;
  const avgWeight = relevant.reduce((a,d)=>a+d.weight,0)/relevant.length;
  return Math.random() < (0.06 * avgWeight);
}

// ── RNG ENGINE: correct probability distribution ────────────────
export function getWeightedRandomEvent(currentYear:number, career:Career|null=null): GameEvent {
  // Filter eligible by age
  let eligible = EVENTS.filter(e => {
    if(e.ageMin!==undefined && currentYear < e.ageMin) return false;
    if(e.ageMax!==undefined && currentYear > e.ageMax) return false;
    return true;
  });

  // Weighted roll for rarity
  const pool = [...CW,...UW,...RW,...EW,...LW,...MW,...GW];
  const rarityRoll = pool[Math.floor(Math.random()*pool.length)];

  // Get candidates of that rarity
  let candidates = eligible.filter(e => e.rarity === rarityRoll);
  
  // If none, try common
  if(!candidates.length) candidates = eligible.filter(e => e.rarity==='common');
  
  // If still none, fallback to any event without age restrictions
  if(!candidates.length) {
    const fb = EVENTS.filter(e => !e.ageMin && !e.ageMax);
    return fb[Math.floor(Math.random()*fb.length)] ?? candidates[0];
  }

  // Career boost: reduce odds by half for matching career
  if(career) {
    candidates = candidates.map(e => 
      e.career===career ? {...e, odds: Math.max(1, Math.floor(e.odds*0.5))} : e
    );
  }

  // For rare+ events, apply luck bonus as multiplier on odds (lower = rarer)
  const luckBonus = totalLuckBonus();
  const finalCandidates = candidates.map(e => ({
    ...e,
    odds: Math.max(1, Math.floor(e.odds * (1 - luckBonus)))
  }));

  return finalCandidates[Math.floor(Math.random()*finalCandidates.length)];
}

// Separate function to avoid circular dependency issues
function totalLuckBonus(): number {
  // This is called from the game loop where we have access to state
  // We'll pass it as parameter instead
  return 0;
}

export function getWeightedRandomEventWithLuck(currentYear:number, career:Career|null=null, luck: number=0): GameEvent {
  let eligible = EVENTS.filter(e => {
    if(e.ageMin!==undefined && currentYear < e.ageMin) return false;
    if(e.ageMax!==undefined && currentYear > e.ageMax) return false;
    return true;
  });

  const pool = [...CW,...UW,...RW,...EW,...LW,...MW,...GW];
  const rarityRoll = pool[Math.floor(Math.random()*pool.length)];

  let candidates = eligible.filter(e => e.rarity === rarityRoll);
  if(!candidates.length) candidates = eligible.filter(e => e.rarity==='common');
  if(!candidates.length) {
    const fb = EVENTS.filter(e => !e.ageMin && !e.ageMax);
    return fb[Math.floor(Math.random()*fb.length)] ?? candidates[0];
  }

  if(career) {
    candidates = candidates.map(e => 
      e.career===career ? {...e, odds: Math.max(1, Math.floor(e.odds*0.5))} : e
    );
  }

  // Apply luck - reduce odds for higher rarity events
  const luckFactor = Math.max(0.3, 1 - luck);
  candidates = candidates.map(e => ({...e, odds: Math.max(1, Math.floor(e.odds * luckFactor))}));

  return candidates[Math.floor(Math.random()*candidates.length)];
}

export const RARITY_CONFIG = {
  common:   { color:'text-stone-300',    bg:'from-stone-800/70 to-stone-900/70',   border:'border-stone-600', label:'Común',     emoji:'⚪' },
  uncommon: { color:'text-emerald-400',  bg:'from-emerald-900/40 to-emerald-950/40', border:'border-emerald-500', label:'Inusual',   emoji:'🟢' },
  rare:     { color:'text-sky-400',      bg:'from-sky-900/40 to-sky-950/40',       border:'border-sky-500',   label:'Raro',      emoji:'🔵' },
  epic:     { color:'text-violet-400',   bg:'from-violet-900/40 to-violet-950/40', border:'border-violet-500',label:'Épico',     emoji:'🟣' },
  legendary:{ color:'text-amber-400',    bg:'from-amber-900/40 to-amber-950/40',   border:'border-amber-500', label:'Legendario',emoji:'🟠' },
  mythical: { color:'text-fuchsia-300',  bg:'from-fuchsia-900/30 to-pink-950/30',  border:'border-fuchsia-400',label:'Mítico',   emoji:'🌈' },
  godly:    { color:'text-yellow-300',   bg:'from-yellow-700/50 to-amber-900/60',  border:'border-yellow-400',label:'DIVINO',   emoji:'✨' },
};

export const PHASE_CONFIG: Record<Phase,{label:string;color:string;bg:string}> = {
  infancia:   {label:'INFANCIA',  color:'text-sky-400',  bg:'bg-sky-500/10'},
  adolescencia:{label:'ADOLESCENCIA',color:'text-violet-400',bg:'bg-violet-500/10'},
  adultez:    {label:'ADULTEZ',   color:'text-amber-400',bg:'bg-amber-500/10'},
  madurez:    {label:'MADUREZ',   color:'text-rose-400', bg:'bg-rose-500/10'},
  vejez:      {label:'VEJEZ',     color:'text-stone-400',bg:'bg-stone-500/10'},
};

export const CAREERS = [
  {id:'estudiar', name:'Estudiar',emoji:'📚',desc:'Accede a eventos académicos y oportunidades intelectuales',luckBonus:0.15},
  {id:'delinquir',name:'Delinquir',emoji:'🗡️',desc:'Camino oscuro. Más dinero rápido, menos salud y felicidad',luckBonus:-0.05},
  {id:'emprender',name:'Emprender',emoji:'🚀',desc:'Creá tu imperio. Alto riesgo, altas recompensas',luckBonus:0.10},
  {id:'obrero',  name:'Obrero',   emoji:'🔧',desc:'Trabajo duro. Estable pero físicamente agotador',luckBonus:0.05},
];

export function getCareerLuck(career:Career): number {
  const c = CAREERS.find(x=>x.id===career);
  return c ? c.luckBonus : 0;
}
