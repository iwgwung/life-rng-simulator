'use client';
import { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { JuiceButton } from '../components/ui/JuiceButton';
import { FloatingText } from '../components/ui/FloatingText';
import { engine } from '../lib/audio-engine';
import { EVENTS, getWeightedRandomEventWithLuck, RARITY_CONFIG, FAMOUS_LIVES, GameEvent, Dilemma, shouldShowDilemma, getPhase, PHASE_CONFIG, CAREERS, getCareerLuck, DILEMMAS, type Phase, type Career } from '../lib/events';
import { UPGRADES, Upgrade } from '../lib/upgrades';
import { ACHIEVEMENTS } from '../lib/achievements';
import { supabase } from '../lib/supabaseClient';
import { v4 as uuidv4 } from 'uuid';
import Particles from '../components/ui/Particles';

interface Stats { health:number; money:number; happiness:number; intelligence:number; charisma:number; }
interface FT { id:string; value:string; type:'positive'|'negative'|'neutral'; key:string; }
interface Unlocked { title:string; rarity:string; firstSeen:number; timesSeen:number; }

const TABS = ['vida','inventario','tienda','logros'] as const;
type Tab = typeof TABS[number];

export default function Home() {
  const [tab, setTab] = useState<Tab>('vida');
  const [year, setYear] = useState(0);
  const [stats, setStats] = useState<Stats>({health:100,money:50,happiness:50,intelligence:10,charisma:10});
  const [fts, setFts] = useState<FT[]>([]);
  const [event, setEvent] = useState<GameEvent|null>(null);
  const [dilemma, setDilemma] = useState<Dilemma|null>(null);
  const [dead, setDead] = useState(false);
  const [cause, setCause] = useState('');
  const [unlocked, setUnlocked] = useState<Unlocked[]>([]);
  const [upgrades, setUpgrades] = useState<Record<string,number>>({});
  const [achIds, setAchIds] = useState<string[]>([]);
  const [rebirths, setRebirths] = useState(0);
  const [luckBonus, setLuckBonus] = useState(0);
  const [rolling, setRolling] = useState(false);
  const [rollNum, setRollNum] = useState(0);
  const [particles, setParticles] = useState<{id:string;x:number;y:number;color:string}[]>([]);
  const [autoPlay, setAutoPlay] = useState(false);
  const autoRef = useRef(autoPlay);
  autoRef.current = autoPlay;
  const [career, setCareer] = useState<Career|null>(null);
  const [showCareerSelect, setShowCareerSelect] = useState(false);
  const phase = getPhase(year);
  const phaseCfg = PHASE_CONFIG[phase];
  const totalLuck = luckBonus + getCareerLuck(career) + (upgrades.lucky_charm||0)*0.1 + (upgrades.education||0)*0.05;

  const burst = useCallback((rarity:string) => {
    const colors: Record<string,string[]> = {
      common:['#a8a29e'], uncommon:['#34d399'], rare:['#7dd3fc'], epic:['#a78bfa'], legendary:['#fbbf24'],
      mythical:['#22d3ee','#e879f9','#fb923c'], godly:['#fde047','#f59e0b','#fff','#a855f7','#22d3ee'],
    };
    const n = rarity==='godly'?80:rarity==='mythical'?50:rarity==='legendary'?30:10;
    setParticles(Array.from({length:n},()=>({id:uuidv4(),x:Math.random()*100,y:Math.random()*100,color:colors[rarity][Math.floor(Math.random()*colors[rarity].length)]})) );
    setTimeout(()=>setParticles([]),3000);
  },[]);
  const playSound = useCallback((rarity:string)=>{
    const p=(n:number,w:OscillatorType,dur:number,dl=0)=>setTimeout(()=>engine.playTone(n,w,dur),dl);
    if(rarity==='godly'){p(0,'sawtooth',1.2);p(3,'square',0.8,200);p(4,'triangle',1.0,400);}
    else if(rarity==='mythical'){p(0,'sine',0.6);p(2,'sine',0.6,150);p(4,'sine',0.8,300);}
    else if(rarity==='legendary'){p(0,'sine',0.5);p(2,'sine',0.5,120);p(4,'sine',0.7,240);}
    else if(rarity==='epic'){p(1,'sine',0.4);p(3,'sine',0.5,100);}
    else{p(Math.floor(Math.random()*5),'sine',0.3);}
  },[]);
  const checkAchievements = useCallback((ns:Stats,ny:number,nb:number)=>{
    const rareCount = unlocked.filter(u=>{const ev=EVENTS.find(e=>e.title===u.title);return ev&&['rare','epic','legendary','mythical','godly'].includes(ev.rarity);}).length;
    ACHIEVEMENTS.forEach(ach=>{if(!achIds.includes(ach.id)&&ach.condition(ns,ny,rareCount,nb)){setAchIds(p=>[...p,ach.id]);}});
  },[achIds,unlocked]);

  const triggerRoll = useCallback((fn:()=>void)=>{
    if(rolling||dead)return;
    setRolling(true);
    let c=0;
    const iv=setInterval(()=>{setRollNum(Math.floor(Math.random()*99));c++;if(c>15)clearInterval(iv);},60);
    setTimeout(()=>{clearInterval(iv);setRollNum(year+1);fn();setTimeout(()=>setRolling(false),200);},900);
  },[rolling,dead,year]);

  const passYear = useCallback(()=>{
    triggerRoll(()=>{
      const ny=year+1;
      setYear(ny);
      // Check for dilemma first (higher priority than normal event)
      if(shouldShowDilemma(ny,career)){
        const dilemmas=DILEMMAS.filter(d=>ny>=d.minAge&&ny<=d.maxAge&&(!d.career||d.career===career));
        if(dilemmas.length){setDilemma(dilemmas[Math.floor(Math.random()*dilemmas.length)]);return;}
      }
      const ev=getWeightedRandomEventWithLuck(ny,career,totalLuck);
      setEvent(ev);playSound(ev.rarity);burst(ev.rarity);
      const hc=ev.healthChange||0,mc=ev.moneyChange||0,hpc=ev.happinessChange||0,ic=ev.intelligenceChange||0,cc=ev.charismaChange||0;
      // Apply health regen upgrade
      const gymBonus=(upgrades.gym_membership||0)*5;
      const healthyBonus=(upgrades.healthy_food||0)*3;
      const finalHc=Math.round(hc*(1-healthyBonus*0.5)+gymBonus);
      setFts(prev=>[...prev,
        finalHc!==0&&{id:uuidv4(),value:`${finalHc>0?'+':''}${finalHc}%`,type:finalHc>0?'positive':'negative',key:'health'},
        mc!==0&&{id:uuidv4(),value:`${mc>0?'+':''}$${mc}`,type:mc>0?'positive':'negative',key:'money'},
        hpc!==0&&{id:uuidv4(),value:`${hpc>0?'+':''}${hpc}`,type:hpc>0?'positive':'negative',key:'happy'},
        ic!==0&&{id:uuidv4(),value:`${ic>0?'+':''}${ic}`,type:'neutral',key:'int'},
        cc!==0&&{id:uuidv4(),value:`${cc>0?'+':''}${cc}`,type:'neutral',key:'char'},
      ].filter(Boolean)as FT[]);
      setUnlocked(prev=>{const ex=prev.find(u=>u.title===ev.title);return ex?prev.map(u=>u.title===ev.title?{...u,timesSeen:u.timesSeen+1}:u):[...prev,{title:ev.title,rarity:ev.rarity,firstSeen:ny,timesSeen:1}];});
      setStats(prev=>{
        const nh=Math.max(0,Math.min(100,prev.health+finalHc));
        const nm=prev.money+mc;
        const nip=prev.intelligence+ic;
        const nch=prev.charisma+cc;
        const nhp=Math.max(0,Math.min(100,prev.happiness+hpc));
        if(nh<=0){setDead(true);setCause(ev.title);saveRun(ny,nm,ev.title,rebirths);}
        if(ev.rarity==='godly'){const idx=ACHIEVEMENTS.findIndex(a=>a.id==='godly_event');if(idx>=0)ACHIEVEMENTS[idx].condition({health:nh,money:nm,happiness:nhp,intelligence:nip,charisma:nch},ny,0,rebirths);}
        checkAchievements({health:nh,money:nm,happiness:nhp,intelligence:nip,charisma:nch},ny,rebirths);
        return{health:nh,money:nm,happiness:nhp,intelligence:nip,charisma:nch};
      });
    });
  },[year,rolling,dead,rebirths,career,burst,playSound,triggerRoll,checkAchievements,upgrades]);

  const resolveDilemma = useCallback((option:'A'|'B')=>{
    if(!dilemma)return;
    const opt=dilemma[option==='A'?'optionA':'optionB'];
    const newStats={...stats,...opt.effect(stats)};
    setStats(newStats);
    setDilemma(null);
    playSound(opt.success?'legendary':'common');
    burst(opt.success?'legendary':'common');
    if(newStats.health<=0){setDead(true);setCause(dilemma.question);saveRun(year,newStats.money,dilemma.question,rebirths);}
  },[dilemma,stats,playSound,burst,year,rebirths]);

  const saveRun=async(fy:number,fm:number,cause:string,rb:number)=>{try{await supabase.from('graveyard').insert([{age:fy,money:fm,cause}]);}catch(e){console.error(e);}};
  const doRebirth=()=>{const nr=rebirths+1;setRebirths(nr);setLuckBonus(0.05*nr);setYear(0);setStats({health:100,money:50,happiness:50,intelligence:10,charisma:10});setEvent(null);setDead(false);setCause('');setCareer(null);setShowCareerSelect(false);playSound('mythical');setParticles(Array.from({length:50},()=>({id:uuidv4(),x:50+(Math.random()-0.5)*30,y:50+(Math.random()-0.5)*30,color:['#fde047','#a855f7','#22d3ee'][Math.floor(Math.random()*3)]})));setTimeout(()=>setParticles([]),2000);};
  const buyUpgrade=(u:Upgrade)=>{const stacks=upgrades[u.id]||0;if(stacks>=(u.maxStacks||99)||stats.money<u.cost)return;setStats(p=>({...p,money:p.money-u.cost}));setUpgrades(p=>({...p,[u.id]:stacks+1}));if(u.effect==='luck')setLuckBonus(p=>p+u.value);playSound('rare');};
  useEffect(()=>{if(!autoPlay||dead)return;const iv=setInterval(()=>{if(autoRef.current&&!dead)passYear();},1500);return()=>clearInterval(iv);},[autoPlay,dead,passYear]);

  const StatPill=({label,value,color,icon,key}:{label:string;value:number|string;color:string;icon:string;key:string})=>(
    <div className="relative bg-stone-900/90 border border-stone-700/60 rounded-xl p-2.5 text-center">
      <p className="text-[10px] font-semibold text-stone-500 uppercase tracking-widest mb-0.5">{icon} {label}</p>
      <p className={`text-lg font-black tabular-nums ${color}`}>{value}</p>
      <AnimatePresence>{fts.filter(t=>t.key===key).map(t=><FloatingText key={t.id} value={t.value} type={t.type} onComplete={()=>setFts(p=>p.filter(x=>x.id!==t.id))}/>)}</AnimatePresence>
    </div>
  );
  const EventCard=(ev:GameEvent)=>{const cfg=RARITY_CONFIG[ev.rarity];const isHigh=ev.rarity==='godly'||ev.rarity==='mythical'||ev.rarity==='legendary';return(
    <motion.div initial={{opacity:0,scale:0.85,y:16}} animate={{opacity:1,scale:1,y:0}} exit={{opacity:0,scale:0.85,y:-16}} transition={{type:'spring',stiffness:220,damping:18}} className={`relative w-full rounded-2xl overflow-hidden border-2 ${cfg.border} ${cfg.bg} backdrop-blur-md shadow-2xl`}>
      {isHigh&&<div className={`absolute inset-0 opacity-25 ${ev.rarity==='godly'?'animate-pulse bg-gradient-to-br from-yellow-400 via-fuchsia-500 to-cyan-400':ev.rarity==='mythical'?'animate-pulse bg-gradient-to-br from-fuchsia-500 to-pink-500':'animate-pulse bg-gradient-to-br from-amber-500 to-orange-500'}`}/>}
      <div className="relative p-5">
        <div className="flex items-center justify-between mb-3">
          <span className={`text-xs font-bold px-3 py-1 rounded-full ${ev.rarity==='godly'?'bg-yellow-400 text-yellow-950 animate-pulse':ev.rarity==='mythical'?'bg-gradient-to-r from-fuchsia-400 to-pink-400 text-white':`${cfg.color.replace('text-','bg-').replace(/400|300/,'500')}/20 ${cfg.color} border ${cfg.border}`}`}>{cfg.emoji} {cfg.label}</span>
          {ev.odds>1&&<span className="text-xs font-mono text-stone-500">1/{ev.odds.toLocaleString()}</span>}
        </div>
        <h3 className={`text-xl font-black mb-2 ${cfg.color} ${ev.rarity==='godly'?'tracking-widest':''}`}>{ev.title}</h3>
        <p className="text-stone-300 text-sm leading-relaxed mb-4">{ev.description}</p>
        <div className="flex flex-wrap gap-1.5 text-xs font-mono">
          {ev.healthChange!==0&&<span className={`px-2 py-0.5 rounded ${ev.healthChange>0?'bg-emerald-500/20 text-emerald-400':'bg-rose-500/20 text-rose-400'}`}>{ev.healthChange>0?'+':''}{ev.healthChange} HP</span>}
          {ev.moneyChange!==0&&<span className={`px-2 py-0.5 rounded ${ev.moneyChange>0?'bg-emerald-500/20 text-emerald-400':'bg-rose-500/20 text-rose-400'}`}>{ev.moneyChange>0?'+':''}${Math.abs(ev.moneyChange)}</span>}
          {ev.happinessChange&&ev.happinessChange!==0&&<span className={`px-2 py-0.5 rounded ${ev.happinessChange>0?'bg-yellow-500/20 text-yellow-400':'bg-rose-500/20 text-rose-400'}`}>{ev.happinessChange>0?'+':''}{ev.happinessChange} 😊</span>}
          {ev.intelligenceChange&&ev.intelligenceChange!==0&&<span className={`px-2 py-0.5 rounded ${ev.intelligenceChange>0?'bg-blue-500/20 text-blue-400':'bg-rose-500/20 text-rose-400'}`}>{ev.intelligenceChange>0?'+':''}{ev.intelligenceChange} 🧠</span>}
          {ev.charismaChange&&ev.charismaChange!==0&&<span className={`px-2 py-0.5 rounded ${ev.charismaChange>0?'bg-pink-500/20 text-pink-400':'bg-rose-500/20 text-rose-400'}`}>{ev.charismaChange>0?'+':''}{ev.charismaChange} ⭐</span>}
        </div>
      </div>
    </motion.div>
  );};

  const DilemmaCard=(d:Dilemma)=>(
    <motion.div initial={{opacity:0,scale:0.9}} animate={{opacity:1,scale:1}} exit={{opacity:0,scale:0.9}} className="w-full rounded-2xl overflow-hidden border-2 border-amber-500/60 bg-amber-950/40 backdrop-blur-md shadow-2xl">
      <div className="p-5">
        <div className="flex items-center gap-2 mb-3">
          <span className="text-xs font-bold px-2 py-1 rounded-full bg-amber-500/20 text-amber-400 border border-amber-500/40">⚡ DILEMA</span>
          {d.career&&<span className="text-[10px] font-mono text-stone-500">[{d.career}]</span>}
        </div>
        <h3 className="text-lg font-black text-amber-300 mb-3">{d.question}</h3>
        <div className="grid grid-cols-2 gap-3">
          <button onClick={()=>resolveDilemma('A')} className="px-4 py-3 rounded-xl bg-emerald-600/30 border border-emerald-500/50 text-emerald-300 font-bold text-sm hover:bg-emerald-600/50 transition-all">✅ {d.optionA.label}</button>
          <button onClick={()=>resolveDilemma('B')} className="px-4 py-3 rounded-xl bg-rose-600/30 border border-rose-500/50 text-rose-300 font-bold text-sm hover:bg-rose-600/50 transition-all">❌ {d.optionB.label}</button>
        </div>
      </div>
    </motion.div>
  );

  const CareerSelect=()=>(
    <motion.div initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
      <div className="w-full max-w-md">
        <h2 className="text-2xl font-black text-center text-stone-50 mb-2">🎯 Elegí tu Camino de Vida</h2>
        <p className="text-stone-500 text-center text-sm mb-6">Tu carrera definirá qué eventos podés encontrar.</p>
        <div className="space-y-3">
          {CAREERS.map(c=>(
            <button key={c.id} onClick={()=>{setCareer(c.id as Career);setShowCareerSelect(false);playSound('rare');}} className="w-full flex items-center gap-4 p-4 rounded-xl border border-stone-700 bg-stone-900/90 hover:border-violet-500/60 transition-all text-left">
              <span className="text-3xl">{c.emoji}</span>
              <div className="flex-1">
                <p className="font-black text-stone-100">{c.name}</p>
                <p className="text-xs text-stone-500">{c.desc}</p>
                <p className={`text-[10px] font-mono mt-1 ${c.luckBonus>0?'text-emerald-400':'text-rose-400'}`}>{c.luckBonus>0?'+':''}{(c.luckBonus*100).toFixed(0)}% suerte</p>
              </div>
            </button>
          ))}
        </div>
      </div>
    </motion.div>
  );

  return (
    <main className="min-h-screen bg-stone-950 text-stone-100 selection:bg-violet-500/30">
      {/* Background effects */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-gradient-to-b from-violet-900/10 via-transparent to-transparent"/>
        <div className={`absolute bottom-0 left-0 right-0 h-64 ${phaseCfg.bg} blur-3xl`}/>
        {/* Rare event glow */}
        {event && (event.rarity==='epic'||event.rarity==='legendary'||event.rarity==='mythical'||event.rarity==='godly') && (
          <div className={`absolute inset-0 opacity-20 animate-pulse ${
            event.rarity==='godly'?'bg-gradient-to-br from-yellow-500 via-fuchsia-500 to-cyan-500'
            :event.rarity==='mythical'?'bg-gradient-to-br from-fuchsia-500 to-pink-500'
            :event.rarity==='legendary'?'bg-gradient-to-br from-amber-500 to-orange-500'
            :'bg-gradient-to-br from-violet-500 to-purple-500'
          }`} style={{mixBlendMode:'overlay'}}/>
        )}
      </div>
      <Particles particles={particles}/>
      <div className="relative max-w-lg mx-auto px-4 pb-12">
        <header className="pt-8 pb-6 text-center">
          <p className="text-[10px] font-mono text-stone-600 tracking-[0.3em] uppercase mb-2">Life Simulator</p>
          <h1 className="text-5xl font-black tracking-tight text-stone-50">LIFE<span className="text-violet-500">.</span>RNG</h1>
          {rebirths>0&&<p className="mt-2 text-xs font-mono text-violet-400">⟳ Rebirth {rebirths} · Suerte {(totalLuck*100).toFixed(0)}%</p>}
          {career&&<div className="mt-2 inline-flex items-center gap-2 px-3 py-1 rounded-full bg-stone-800/60 border border-stone-700"><span className="text-sm">{CAREERS.find(c=>c.id===career)?.emoji}</span><span className="text-xs text-stone-400">{CAREERS.find(c=>c.id===career)?.name}</span></div>}
        </header>
        <div className="mb-5">
          <div className="flex items-center justify-center gap-3 mb-2">
            <span className={`text-[10px] font-bold px-3 py-1 rounded-full border ${phaseCfg.color.replace('text-','border-')} ${phaseCfg.bg} ${phaseCfg.color}`}>{phaseCfg.label}</span>
            <span className="text-stone-600 text-xs font-mono">·</span>
            <span className="text-stone-500 text-xs font-mono">{year<5?'Bebé':year<18?'Joven':year<40?'Adulto':year<65?'Maduro':'Mayor'}</span>
          </div>
          <div className="text-center">
            <span className="font-black text-7xl tabular-nums text-stone-50 leading-none">{rolling?String(rollNum).padStart(2,'0'):year}</span>
            <p className="text-stone-500 text-sm font-medium mt-1">años</p>
          </div>
        </div>
        <div className="grid grid-cols-5 gap-1.5 mb-5">
          <StatPill label="Salud" value={stats.health} color="text-rose-400" icon="♥" key="health"/>
          <StatPill label="Dinero" value={`$${stats.money}`} color="text-amber-400" icon="$" key="money"/>
          <StatPill label="Felicidad" value={stats.happiness} color="text-yellow-400" icon="★" key="happy"/>
          <StatPill label="IQ" value={stats.intelligence} color="text-sky-400" icon="⌘" key="int"/>
          <StatPill label="Carisma" value={stats.charisma} color="text-fuchsia-400" icon="◉" key="char"/>
        </div>
        <nav className="flex gap-1 mb-5 bg-stone-900/60 p-1 rounded-2xl border border-stone-800/60">
          {TABS.map(t => (
            <button key={t} onClick={() => setTab(t)}
              className={`flex-1 px-2 py-2 rounded-xl text-xs font-bold transition-all ${tab === t ? 'bg-stone-700 text-stone-50 shadow-lg' : 'text-stone-500 hover:text-stone-300'}`}>
              {t === 'vida' && '🎮 Vida'}
              {t === 'inventario' && <span className="flex items-center justify-center gap-1">📚 <span className="tabular-nums">{unlocked.length}</span></span>}
              {t === 'tienda' && '🛒 Tienda'}
              {t === 'logros' && '🏆 Logros'}
            </button>
          ))}
        </nav>
        <AnimatePresence mode="wait">
          {tab==='vida'&&(
            <motion.div key="v" initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}}>
              <div className="mb-5 min-h-[180px]">
                <AnimatePresence mode="wait">
                  {dilemma?<DilemmaCard {...dilemma}/>:event&&!dead?<EventCard {...event}/>:!event&&!dead&&<motion.p initial={{opacity:0}} animate={{opacity:1}} className="text-stone-600 italic text-center py-10 text-sm">Tocá <strong className="text-stone-400">Vivir un Año Más</strong> para empezar tu vida…</motion.p>}
                  {dead&&<motion.div initial={{opacity:0,scale:0.9}} animate={{opacity:1,scale:1}} className="flex flex-col items-center bg-rose-950/30 border-2 border-rose-700/50 p-6 rounded-2xl"><p className="text-[10px] font-mono text-rose-500/60 uppercase tracking-widest mb-2">Game Over</p><h2 className="text-3xl font-black text-rose-400 mb-3 animate-pulse">¡MURIÓ!</h2><p className="text-stone-400 text-sm mb-1">Causa: <span className="text-stone-200 font-semibold">{cause}</span></p><p className="text-stone-500 text-xs mb-5">Viviste {year} años con ${stats.money}</p><JuiceButton onClick={doRebirth} toneIndex={4}>⟳ Reencarnar (+{((totalLuck+0.05)*100).toFixed(0)}% suerte)</JuiceButton></motion.div>}
                </AnimatePresence>
              </div>
              {!dead&&<div className="flex gap-3 justify-center">
                <JuiceButton onClick={passYear} toneIndex={2}>vivir un año más</JuiceButton>
                <button onClick={()=>setAutoPlay(!autoPlay)} className={`px-4 py-3 rounded-xl font-bold text-sm transition-all ${autoPlay?'bg-amber-600 text-white animate-pulse':'bg-stone-800 text-stone-500 hover:bg-stone-700'}`}>{autoPlay?'⏸ Pausar':'▶ Auto'}</button>
              </div>}
            </motion.div>
          )}
          {tab==='inventario'&&(
            <motion.div key="i" initial={{opacity:0,x:12}} animate={{opacity:1,x:0}} exit={{opacity:0,x:-12}}>
              <div className="space-y-1.5">
                {Array.from(new Map(unlocked.map(e=>[e.title,e])).values()).sort((a,b)=>{const o=['common','uncommon','rare','epic','legendary','mythical','godly'];return o.indexOf(a.rarity)-o.indexOf(b.rarity);}).map(e=>{const c=RARITY_CONFIG[e.rarity as keyof typeof RARITY_CONFIG]||RARITY_CONFIG.common;return(<div key={e.title} className={`flex items-center gap-3 p-3 rounded-xl border ${c.bg} ${c.border}`}><span className="text-xl w-8 text-center">{c.emoji}</span><div className="flex-1 min-w-0"><p className={`font-bold text-sm truncate ${c.color}`}>{e.title}</p><p className="text-[11px] text-stone-500 font-mono">Año {e.firstSeen} · visto {e.timesSeen}x</p></div><span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${c.border} ${c.color}`}>{c.label}</span></div>);})}
                {unlocked.length===0&&<p className="text-stone-700 text-center py-10 text-sm">Aún no descubriste nada.</p>}
              </div>
            </motion.div>
          )}
          {tab==='tienda'&&(
            <motion.div key="t" initial={{opacity:0,x:12}} animate={{opacity:1,x:0}} exit={{opacity:0,x:-12}}>
              <div className="space-y-2">
                {UPGRADES.map(u=>{const stacks=upgrades[u.id]||0;const maxed=u.maxStacks?stacks>=u.maxStacks:false;const ok=!maxed&&stats.money>=u.cost;return(<button key={u.id} disabled={!ok} onClick={()=>buyUpgrade(u)} className={`w-full flex items-center gap-3 p-3 rounded-xl border transition-all ${ok?'border-stone-700 bg-stone-900/80 hover:border-violet-500/60':'border-stone-800 bg-stone-900/30 opacity-40 cursor-not-allowed'}`}><div className="w-9 h-9 rounded-lg bg-stone-800 flex items-center justify-center text-lg">{u.effect==='luck'?'🍀':u.effect==='healthRegen'?'❤️':'💰'}</div><div className="flex-1 text-left"><p className="font-bold text-sm text-stone-200">{u.name}</p><p className="text-[11px] text-stone-500">{u.description}</p></div><div className="text-right"><p className={`font-bold text-sm tabular-nums ${ok?'text-amber-400':'text-stone-600'}`}>${u.cost}</p>{u.maxStacks&&<p className="text-[10px] text-stone-600">[{stacks}/{u.maxStacks}]</p>}{maxed&&<p className="text-[10px] text-amber-500">MAX</p>}</div></button>);})}
              </div>
            </motion.div>
          )}
          {tab==='logros'&&(
            <motion.div key="l" initial={{opacity:0,x:12}} animate={{opacity:1,x:0}} exit={{opacity:0,x:-12}}>
              <div className="space-y-1.5">
                {ACHIEVEMENTS.map(a=>{const done=achIds.includes(a.id);return(<div key={a.id} className={`flex items-center gap-3 p-3 rounded-xl border ${done?'border-amber-500/40 bg-amber-950/20':'border-stone-800 bg-stone-900/30'}`}><span className="text-xl">{done?a.emoji:'🔒'}</span><div className="flex-1"><p className={`font-bold text-sm ${done?'text-amber-400':'text-stone-600'}`}>{a.name}</p><p className="text-[11px] text-stone-500">{a.description}</p></div></div>);})}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
        <p className="mt-6 text-center text-[10px] font-mono text-stone-700">Rarezas descubiertas {unlocked.length}/{EVENTS.length+FAMOUS_LIVES.length}</p>
        
        {/* Reset button */}
        <div className="mt-4 flex justify-center">
          <button onClick={()=>{if(confirm('¿Borrar todos tus datos? Esta acción no se puede deshacer.')){setYear(0);setStats({health:100,money:50,happiness:50,intelligence:10,charisma:10});setUnlocked([]);setUpgrades({});setAchIds([]);setRebirths(0);setLuckBonus(0);setEvent(null);setDead(false);setCause('');setCareer(null);setShowCareerSelect(false);}}} className="px-4 py-2 text-xs font-mono text-stone-600 hover:text-rose-400 border border-stone-800 hover:border-rose-800/50 rounded-lg transition-all">
            🗑️ Borrar todo
          </button>
        </div>
      </div>
      <AnimatePresence>{showCareerSelect&&<CareerSelect/>}</AnimatePresence>
      {/* Show career select at age 17 */}
      {!showCareerSelect && year===17 && !dead && (
        <motion.div initial={{opacity:0,y:20}} animate={{opacity:1,y:0}} className="fixed bottom-6 left-0 right-0 flex justify-center z-40 pointer-events-none">
          <button onClick={()=>setShowCareerSelect(true)} className="pointer-events-auto px-6 py-3 bg-violet-600 hover:bg-violet-500 text-white rounded-2xl font-bold text-sm shadow-2xl shadow-violet-500/30 transition-all animate-bounce">
            🎯 ¡Tenés 17 años! Elegí tu camino de vida
          </button>
        </motion.div>
      )}
    </main>
  );
}
