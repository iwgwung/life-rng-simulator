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
export function getPhase(a:number): Phase { if(a<5) return 'infancia'; if(a<18) return 'adolescencia'; if(a<40) return 'adultez'; if(a<65) return 'madurez'; return 'vejez'; }
const CW=Array(98).fill(null), UW=Array(15).fill(null), RW=Array(5).fill(null), EW=Array(2).fill(null), LW=Array(1).fill(null), MW=Array(1).fill(null), GW=Array(1).fill(null);

// Career bonuses
const CAREER_LUCK: Record<string, number> = { estudiar: 0.15, delinquir: -0.05, emprender: 0.10, obrero: 0.05 };

export const EVENTS: GameEvent[] = [
  // ── INFANCIA (kinder, menos daño) ───────────────────────────────
  {title:"Primeros Pasos",description:"Diste tus primeros pasos y te golpeaste contra la mesa.",healthChange:-1,moneyChange:0,rarity:'common',odds:1,ageMin:0,ageMax:5},
  {title:"Ratón Pérez",description:"Se te cayó un diente. El ratón dejó una moneda bajo la almohada.",healthChange:-1,moneyChange:15,happinessChange:5,rarity:'common',odds:1,ageMin:5,ageMax:10},
  {title:"Gripe de Colegio",description:"Te pusiste enfermo. Tu mamá te dio sopa y mucho cariño.",healthChange:-5,moneyChange:-10,rarity:'common',odds:1,ageMin:3,ageMax:12},
  {title:"Mejor Amigo",description:"Hiciste tu mejor amigo en el patio. Prometieron ser amigos siempre.",healthChange:0,moneyChange:0,happinessChange:15,rarity:'uncommon',odds:100,ageMin:4,ageMax:12},
  {title:"Bicicleta Nueva",description:"Tu papá te compró una bicicleta con rueditas.",healthChange:5,moneyChange:-80,happinessChange:12,rarity:'uncommon',odds:100,ageMin:4,ageMax:10},
  {title:"Hamster Querido",description:"Tu hamster no duró mucho. Aprendiste que la vida es corta.",healthChange:-1,moneyChange:0,happinessChange:-8,rarity:'common',odds:1,ageMin:5,ageMax:14},
  {title:"Día de Campo",description:"Fuiste de picnic con tu familia. Comiste toooodo.",healthChange:3,moneyChange:-30,happinessChange:10,rarity:'common',odds:1,ageMin:0,ageMax:10},
  {title:"Perdiste un Zapato",description:"En el recreo se te perdió un zapato. Lo encontraste luego.",healthChange:0,moneyChange:0,happinessChange:-3,rarity:'common',odds:1,ageMin:3,ageMax:8},
  {title:"Primer Regalo",description:"Tu abuela te regaló su primo. Era un peluche gigante.",healthChange:0,moneyChange:0,happinessChange:8,rarity:'common',odds:1,ageMin:0,ageMax:10},
  {title:"Noche de Película",description:"Viste una película de noche con luces apagadas. Te gustó.",healthChange:0,moneyChange:-20,happinessChange:7,rarity:'common',odds:1,ageMin:5,ageMax:14},
  {title:"Quedate Orfano de Mascota",description:"Tu peonza murió. Lloraste tres días.",healthChange:-2,moneyChange:0,happinessChange:-12,rarity:'common',odds:1,ageMin:6,ageMax:14},
  {title:"Ganaste el concurso",description:"Ganaste el concurso de dibujo en el colegio. Te sentís orgulloso.",healthChange:0,moneyChange:0,intelligenceChange:3,happinessChange:10,rarity:'uncommon',odds:200,ageMin:6,ageMax:14},
  // ── ADOLESCENCIA ────────────────────────────────────────────────
  {title:"Primer Amor",description:"Te enamorphaste de alguien en el colegio. No correspondido, pero bonito.",healthChange:0,moneyChange:0,happinessChange:10,rarity:'common',odds:1,ageMin:12,ageMax:18},
  {title:"Trauma Escolar",description:"Un profesor te humilló frente a todos.",healthChange:-3,moneyChange:0,happinessChange:-12,rarity:'common',odds:1,ageMin:12,ageMax:18},
  {title:"Día de Gimnasio",description:"Empezaste a levantar pesas en el colegio.",healthChange:12,moneyChange:-15,rarity:'uncommon',odds:100,ageMin:13,ageMax:22},
  {title:"Trabajo Informal",description:"Ayudaste a pintar la casa del vecino. Te pagó bien.",healthChange:5,moneyChange:40,rarity:'uncommon',odds:100,ageMin:14,ageMax:20},
  {title:"Lotería Instantánea",description:"Compraste un raspadito y ganaste $50.",healthChange:3,moneyChange:50,rarity:'uncommon',odds:100,ageMin:15,ageMax:25},
  {title:"Examen Desastroso",description:"Sacaste mala nota porque no abrías el libro.",healthChange:-2,moneyChange:0,happinessChange:-10,rarity:'common',odds:1,ageMin:12,ageMax:18,career:'estudiar'},
  {title:"Problema con la Ley",description:"Te agarraron robando una goma de borrar. Te llamaron los padres.",healthChange:-5,moneyChange:0,charismaChange:-5,rarity:'common',odds:1,ageMin:13,ageMax:18,career:'delinquir'},
  {title:"Negocio Escondido",description:"Vendés remeras personalizadas por Instagram. Tu mamá no sabe.",healthChange:0,moneyChange:150,happinessChange:5,rarity:'uncommon',odds:100,ageMin:15,ageMax:22,career:'emprender'},
  {title:"Puesto de Obreros",description:"Ayudás a tu tío en la obra los fines de semana.",healthChange:8,moneyChange:200,rarity:'common',odds:1,ageMin:16,ageMax:25,career:'obrero'},
  {title:"Primer Pipo",description:"Tomaste tu primera birra con amigos. Ni te gustó.",healthChange:-4,moneyChange:-10,happinessChange:3,rarity:'common',odds:1,ageMin:17,ageMax:21},
  // ── ADULTEZ ─────────────────────────────────────────────────────
  {title:"Primer Trabajo Real",description:"Conseguiste empleo. Ganaste tu primer sueldo.",healthChange:2,moneyChange:800,rarity:'common',odds:1,ageMin:18,ageMax:30,career:'obrero'},
  {title:"Golpe de Suerte",description:"Encontraste una billetera con $200.",healthChange:5,moneyChange:200,rarity:'rare',odds:1000,ageMin:18,ageMax:40},
  {title:"Alma Gemela",description:"Conociste a alguien especial. El amor está en el aire.",healthChange:8,moneyChange:-50,happinessChange:20,charismaChange:5,rarity:'rare',odds:1000,ageMin:18,ageMax:45},
  {title:"Primer Departamento",description:"Alquilaste tu propio lugar.",healthChange:3,moneyChange:-2000,happinessChange:8,rarity:'uncommon',odds:100,ageMin:18,ageMax:35},
  {title:"Viral en Internet",description:"Un video tuyo se volvió viral. 1M de seguidores.",healthChange:-5,moneyChange:500,happinessChange:15,charismaChange:10,rarity:'epic',odds:10000,ageMin:18,ageMax:40},
  {title:"Carrera Exitosa",description:"Tu primer gran trabajo. Tu familia está orgullosa.",healthChange:8,moneyChange:5000,intelligenceChange:5,rarity:'epic',odds:10000,ageMin:22,ageMax:40,career:'estudiar'},
  {title:"Desayuno Romántico",description:"La conexión fue eléctrica. Solo fueron tres meses.",healthChange:0,moneyChange:-60,happinessChange:3,charismaChange:3,rarity:'common',odds:1,ageMin:18,ageMax:35},
  {title:"Estafado Cripto",description:"Invertiste en TokenDelCheto. Perdiste todo.",healthChange:-5,moneyChange:-5000,happinessChange:-15,rarity:'rare',odds:1000,ageMin:18,ageMax:40,career:'delinquir'},
  {title:"Jefe a los 30",description:"Promovieron a gerente. Ahora tenés gente底下 vos.",healthChange:-10,moneyChange:15000,intelligenceChange:10,charismaChange:5,rarity:'legendary',odds:100000,ageMin:28,ageMax:35,career:'estudiar'},
  {title:"Bandido de Barrio",description:"Organizaste un micro-tráfico en tu barrio. Dinero rápido, riesgo alto.",healthChange:-15,moneyChange:30000,happinessChange:-20,rarity:'rare',odds:1000,ageMin:18,ageMax:35,career:'delinquir'},
  {title:"Startup Fallida",description:"Tu app no despegó. Pero aprendiste muchísimo.",healthChange:-5,moneyChange:-10000,happinessChange:-5,intelligenceChange:15,rarity:'epic',odds:10000,ageMin:22,ageMax:40,career:'emprender'},
  {title:"Emprendimiento Exitoso",description:"Tu negocio creció. Contrataste a 5 personas.",healthChange:5,moneyChange:50000,happinessChange:25,charismaChange:10,rarity:'legendary',odds:100000,ageMin:25,ageMax:45,career:'emprender'},
  {title:"Lesión en la Obra",description:"Se cayó un tablón. Te lastimaste la espalda.",healthChange:-20,moneyChange:0,rarity:'rare',odds:1000,ageMin:20,ageMax:50,career:'obrero'},
  {title:"Sindicato Fuerte",description:"Organizaste a los trabajadores. Lograron mejoras.",healthChange:-5,moneyChange:0,charismaChange:20,happinessChange:10,rarity:'epic',odds:10000,ageMin:25,ageMax:50,career:'obrero'},
  {title:"Docente Inspirador",description:"Formaste a miles de estudiantes. Tu legado perdura.",healthChange:5,moneyChange:0,intelligenceChange:15,happinessChange:15,rarity:'epic',odds:10000,ageMin:25,ageMax:55,career:'estudiar'},
  // ── MADUREZ ─────────────────────────────────────────────────────
  {title:"Millonario de la Noche",description:"Ganaste la lotería nacional. $10 millones.",healthChange:-8,moneyChange:10000000,happinessChange:25,rarity:'legendary',odds:100000,ageMin:30,ageMax:65},
  {title:"Midlife Crisis",description:"Compraste un auto deportivo. Tu cónyuge no estuvo de acuerdo.",healthChange:-6,moneyChange:-50000,happinessChange:3,rarity:'rare',odds:1000,ageMin:40,ageMax:55},
  {title:"Hijo Adopción",description:"Decidiste adoptar. Ahora tenés un pequeño que te arruina el sueño.",healthChange:-12,moneyChange:-3000,happinessChange:35,charismaChange:8,rarity:'epic',odds:10000,ageMin:25,ageMax:50},
  {title:"Descubrimiento Científico",description:"Hiciste un avance que cambiaría el mundo. Nobel a los 52.",healthChange:5,moneyChange:500000,intelligenceChange:20,happinessChange:15,rarity:'legendary',odds:100000,ageMin:35,ageMax:65,career:'estudiar'},
  {title:"Diagnóstico Preocupante",description:"Te diagnosticaron algo. Resultó ser menos grave.",healthChange:-15,moneyChange:-500,happinessChange:-3,rarity:'rare',odds:1000,ageMin:45,ageMax:70},
  {title:"Preso por Deudas",description:"No pudiste pagar. Pasaste 6 meses dentro.",healthChange:-25,moneyChange:-20000,happinessChange:-30,rarity:'epic',odds:10000,ageMin:30,ageMax:55,career:'delinquir'},
  {title:"Abuelo Sabio",description:"Tus nietos te consideran un tesoro. Les contás historias.",healthChange:5,moneyChange:0,happinessChange:20,charismaChange:5,rarity:'uncommon',odds:200,ageMin:60,ageMax:90},
  // ── VEJEZ ───────────────────────────────────────────────────────
  {title:"Jubilación Dorada",description:"Te retiraste con merecimiento. Tiempo libre es el verdadero lujo.",healthChange:-8,moneyChange:0,happinessChange:20,rarity:'common',odds:1,ageMin:65,ageMax:100},
  {title:"Nieto/a Primero",description:"Tu hijo te presentó a tu primer nieto.",healthChange:8,moneyChange:-200,happinessChange:30,rarity:'rare',odds:1000,ageMin:60,ageMax:95},
  {title:"Recuerdo Difuso",description:"Olvidaste por qué entraste a la cocina. Tu memoria sigue ahí, escondida.",healthChange:-6,moneyChange:0,happinessChange:-3,rarity:'common',odds:1,ageMin:70,ageMax:100},
  {title:"Legado Familiar",description:"Escribiste tus memorias. Tus hijos las leerán cuando ya no estés.",healthChange:-4,moneyChange:0,happinessChange:12,intelligenceChange:5,rarity:'epic',odds:10000,ageMin:65,ageMax:100},
  // ── MYTHICAL / GODLY ────────────────────────────────────────────
  {title:"Contacto Extraterrestre",description:"Los aliens te visitaron. Son simpáticos.",healthChange:20,moneyChange:0,happinessChange:50,rarity:'mythical',odds:1000000},
  {title:"Viajero del Tiempo",description:"Viajaste al futuro. Volviste con conocimiento prohibido.",healthChange:-15,moneyChange:0,intelligenceChange:50,rarity:'mythical',odds:1000000},
  {title:"NACISTE EN LA DINASTÍA WANG",description:"Más rico que países enteros. Palacio de 500 habitaciones.",healthChange:50,moneyChange:999999999,happinessChange:100,rarity:'godly',odds:10000000},
  {title:"TE CONVIRTIERON EN DIOS",description:"Ascendiste al panteón olímpico. Los mortales te rezan.",healthChange:999,moneyChange:0,happinessChange:999,intelligenceChange:999,charismaChange:999,rarity:'godly',odds:10000000},
];

// ── FAMOUS LIVES ──────────────────────────────────────────────────
export const FAMOUS_LIVES: Omit<GameEvent,'odds'>[] = [
  {title:"Eres Steve Jobs",description:"Fundaste una compañía en un garaje. Cambiaste la tecnología.",healthChange:-25,moneyChange:50000000,happinessChange:35,intelligenceChange:25,charismaChange:25,rarity:'legendary',ageMin:20,career:'emprender'},
  {title:"Eres Albert Einstein",description:"Reescribiste la física. E=mc² para siempre.",healthChange:8,moneyChange:100000,happinessChange:15,intelligenceChange:100,rarity:'epic',ageMin:22,career:'estudiar'},
  {title:"Eres Messi",description:"El pibe caminero. Balones de Oro infinitos.",healthChange:35,moneyChange:100000000,happinessChange:45,charismaChange:45,rarity:'legendary',ageMin:16,career:'delinquir'},
  {title:"Eres Taylor Swift",description:"De country pop a dominar el mundo. Eras Tour rompe récords.",healthChange:8,moneyChange:200000000,happinessChange:55,charismaChange:70,rarity:'mythical',ageMin:18,career:'emprender'},
  {title:"Eres Elon Musk",description:"Cohetes al espacio y Twitter comprado. Queres ir a Marte.",healthChange:-45,moneyChange:500000000,happinessChange:-15,charismaChange:35,rarity:'epic',ageMin:25,career:'emprender'},
  {title:"Eres Pablo Escobar",description:"Narcotraficante más poderoso. Moriste en un roof.",healthChange:-9999,moneyChange:500000000,happinessChange:-100,rarity:'legendary',ageMin:20,career:'delinquir'},
];

// ── DILEMMAS ──────────────────────────────────────────────────────
export interface Dilemma {
  id: string;
  question: string;
  optionA: { label: string; success: boolean; effect: (s: Stats) => Stats };
  optionB: { label: string; success: boolean; effect: (s: Stats) => Stats };
  minAge: number;
  maxAge: number;
  career: string | null;
  weight: number; // chance per year (higher = more likely)
}
interface Stats { health:number; money:number; happiness:number; intelligence:number; charisma:number; }
const up = (s:Stats,partial:Partial<Stats>):Stats=>({...s,...partial});

const makeDilemmas = (): Dilemma[] => [
  {
    id:'crypto', question:'Un amigo te ofrece invertir $200 en criptomoneda nueva. Dice que va a explotar.',
    optionA:{label:'¡Invertir!',success:true,effect:s=>up(s,{money:s.money+19000})},
    optionB:{label:'Ignorar',success:false,effect:s=>s},
    minAge:18,maxAge:55,career:null,weight:2,
  },
  {
    id:'lottery_ticket', question:'Compraste un raspadito y ganaste $10. ¿Guardarlo o gastártelo?',
    optionA:{label:'Ahorrar ($10→$500)',success:true,effect:s=>up(s,{money:s.money+490})},
    optionB:{label:'Gastarlo ($10)',success:false,effect:s=>up(s,{happiness:s.happiness+3})},
    minAge:10,maxAge:60,career:null,weight:3,
  },
  {
    id:'find_wallet', question:'Encontraste una billetera con $500. Nadie te ve.',
    optionA:{label:'Devolverla (+ honor)',success:true,effect:s=>up(s,{charisma:s.charisma+10,happiness:s.happiness+8})},
    optionB:{label:'Quedártela (+ dinero)',success:false,effect:s=>up(s,{money:s.money+500})},
    minAge:14,maxAge:60,career:null,weight:2,
  },
  {
    id:'gambling', question:'Un conocido te invita a jugar póker. Apuestas $100.',
    optionA:{label:'Jugar (50/50)',success:true,effect:s=>up(s,{money:s.money+100})},
    optionB:{label:'Rechazar (+ sabiduría)',success:false,effect:s=>up(s,{intelligence:s.intelligence+5})},
    minAge:18,maxAge:55,career:null,weight:3,
  },
  {
    id:'borrow_money', question:'Tu hermano te pide prestados $200. No estás seguro que devuelva.',
    optionA:{label:'Prestartelo (+ familia)',success:true,effect:s=>({happiness:s.happiness+10,charisma:s.charisma+3,money:s.money,intelligence:s.intelligence,health:s.health})},
    optionB:{label:'Decir que no (- familia)',success:false,effect:s=>up(s,{happiness:s.happiness-8})},
    minAge:18,maxAge:50,career:null,weight:2,
  },
  {
    id:'side_hustle', question:'Tenes una idea de negocio. ¿Arriesgás tus ahorros?',
    optionA:{label:'Emprender (+/$$$)',success:true,effect:s=>up(s,{money:s.money+8000,intelligence:s.intelligence+5})},
    optionB:{label:'Quedarse tranquilo',success:false,effect:s=>up(s,{happiness:s.happiness+3})},
    minAge:20,maxAge:45,career:'emprender',weight:3,
  },
  {
    id:'street_deal', question:'Un tipo te ofrece "dinero fácil" vendiendo algo en la esquina.',
    optionA:{label:'Aceptar (+$$ pero riesgo)',success:true,effect:s=>({money:s.money+3000,charisma:s.charisma-5,happiness:s.happiness,intelligence:s.intelligence,health:s.health})},
    optionB:{label:'Rechazar (+ seguridad)',success:false,effect:s=>up(s,{happiness:s.happiness+5})},
    minAge:16,maxAge:40,career:'delinquir',weight:4,
  },
  {
    id:'study_hard', question:'Tenés un examen importante mañana. ¿Estudiás toda la noche o salís?',
    optionA:{label:'Estudiar (+IQ)',success:true,effect:s=>up(s,{intelligence:s.intelligence+15,happiness:s.happiness-5})},
    optionB:{label:'Salir (+ diversión)',success:false,effect:s=>up(s,{happiness:s.happiness+12,intelligence:s.intelligence-3})},
    minAge:12,maxAge:25,career:'estudiar',weight:3,
  },
  {
    id:'work_overtime', question:'Te ofrecen horas extras. ¿Las hacés o descansás?',
    optionA:{label:'Horas extra (+$$)',success:true,effect:s=>({money:s.money+600,health:s.health-5,happiness:s.happiness,intelligence:s.intelligence,charisma:s.charisma})},
    optionB:{label:'Descansar (+salud)',success:false,effect:s=>up(s,{health:s.health+8})},
    minAge:18,maxAge:55,career:'obrero',weight:3,
  },
  {
    id:'big_purchase', question:'Viste un auto increíble. ¿Lo comprás crédito?',
    optionA:{label:'Comprar (-$$$ pero feliz)',success:true,effect:s=>up(s,{money:s.money-30000,happiness:s.happiness+20})},
    optionB:{label:'No comprar (+ ahorro)',success:false,effect:s=>up(s,{})},
    minAge:21,maxAge:50,career:null,weight:2,
  },
];

export const DILEMMAS: Dilemma[] = makeDilemmas();

export function getWeightedRandomEvent(currentYear:number, career:Career=null): GameEvent {
  const phase = getPhase(currentYear);
  // Filter eligible
  let eligible = EVENTS.filter(e => {
    if(e.ageMin!==undefined && currentYear < e.ageMin) return false;
    if(e.ageMax!==undefined && currentYear > e.ageMax) return false;
    return true;
  });
  // Career filter — boost matching events
  if(career) {
    eligible = eligible.map(e => ({...e, odds: e.career===career ? Math.max(1, Math.floor(e.odds*0.5)) : e.odds}));
  }
  // Pick rarity via weighted pool
  const pool = [...CW,...UW,...RW,...EW,...LW,...MW,...GW];
  const rarityRoll = pool[Math.floor(Math.random()*pool.length)];
  let candidates = eligible.filter(e => e.rarity === rarityRoll);
  if(!candidates.length) candidates = eligible.filter(e => e.rarity==='common');
  if(!candidates.length) {
    const fb = EVENTS.filter(e => !e.ageMin && !e.ageMax);
    return fb[Math.floor(Math.random()*fb.length)];
  }
  return candidates[Math.floor(Math.random()*candidates.length)];
}

export function shouldShowDilemma(year:number, career:Career): boolean {
  // ~8% base chance, boosted by career relevance
  const relevant = DILEMMAS.filter(d => year>=d.minAge && year<=d.maxAge && (!d.career || d.career===career));
  if(!relevant.length) return false;
  const avgWeight = relevant.reduce((a,d)=>a+d.weight,0)/relevant.length;
  return Math.random() < (0.06 * avgWeight);
}

export const RARITY_CONFIG = {
  common:   { color:'text-stone-300',    bg:'from-stone-800/70 to-stone-900/70',   border:'border-stone-600', label:'Común',     emoji:'⚪' },
  uncommon: { color:'text-emerald-400',  bg:'from-emerald-900/40 to-emerald-950/40', border:'border-emerald-500', label:'Inusual',   emoji:'🟢' },
  rare:     { color:'text-sky-400',      bg:'from-sky-900/40 to-sky-950/40',       border:'border-sky-500',   label:'Raro',      emoji:'🔵' },
  epic:     { color:'text-violet-400',   bg:'from-violet-900/40 to-violet-950/40', border:'border-violet-500',label:'Épico',     emoji:'🟣' },
  legendary:{ color:'text-amber-400',    bg:'from-amber-900/40 to-amber-950/40',   border:'border-amber-500', label:'Legendario',emoji:'🟠' },
  mythical: { color:'text-fuchsia-300',  bg:'from-fuchsia-900/30 to-pink-950/30',  border:'border-fuchsia-400',label:'Mítico',   emoji:'🌈' },
  godly:    { color:'text-yellow-300',   bg:'from-yellow-700/50 to-amber-900/60',  border:'border-yellow-400',label:'DIVINO',    emoji:'✨' },
};

export const PHASE_CONFIG: Record<Phase,{label:string;color:string;bg:string}> = {
  infancia:  {label:'INFANCIA',  color:'text-sky-400',  bg:'bg-sky-500/10'},
  adolescencia:{label:'ADOLESCENCIA',color:'text-violet-400',bg:'bg-violet-500/10'},
  adultez:   {label:'ADULTEZ',   color:'text-amber-400',bg:'bg-amber-500/10'},
  madurez:   {label:'MADUREZ',   color:'text-rose-400', bg:'bg-rose-500/10'},
  vejez:     {label:'VEJEZ',     color:'text-stone-400',bg:'bg-stone-500/10'},
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
