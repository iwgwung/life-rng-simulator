'use client';
import { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { JuiceButton } from '../components/ui/JuiceButton';
import { FloatingText } from '../components/ui/FloatingText';
import { engine } from '../lib/audio-engine';
import { EVENTS, getWeightedRandomEvent, RARITY_CONFIG, FAMOUS_LIVES, GameEvent } from '../lib/events';
import { UPGRADES, Upgrade } from '../lib/upgrades';
import { ACHIEVEMENTS, Achievement } from '../lib/achievements';
import { supabase } from '../lib/supabaseClient';
import { v4 as uuidv4 } from 'uuid';
import Particles from '../components/ui/Particles';

interface PlayerStats {
  health: number;
  money: number;
  happiness: number;
  intelligence: number;
  charisma: number;
}

interface FloatingTextItem {
  id: string;
  value: string;
  type: 'positive' | 'negative' | 'neutral';
  key: string;
}

interface UnlockedEvent {
  title: string;
  rarity: string;
  firstSeen: number; // year
  timesSeen: number;
}

interface GameState {
  year: number;
  stats: PlayerStats;
  upgrades: Record<string, number>;
  unlockedEvents: UnlockedEvent[];
  achievements: string[];
  rebirths: number;
  totalLuckBonus: number;
}

const TABS = ['vida', 'inventario', 'tienda', 'logros'] as const;
type Tab = typeof TABS[number];

export default function Home() {
  const [tab, setTab] = useState<Tab>('vida');
  const [year, setYear] = useState(0);
  const [stats, setStats] = useState<PlayerStats>({ health: 100, money: 50, happiness: 50, intelligence: 10, charisma: 10 });
  const [floatingTexts, setFloatingTexts] = useState<FloatingTextItem[]>([]);
  const [currentEvent, setCurrentEvent] = useState<GameEvent | null>(null);
  const [isDead, setIsDead] = useState(false);
  const [deathCause, setDeathCause] = useState('');
  const [unlockedEvents, setUnlockedEvents] = useState<UnlockedEvent[]>([]);
  const [upgrades, setUpgrades] = useState<Record<string, number>>({});
  const [achievements, setAchievements] = useState<string[]>([]);
  const [rebirths, setRebirths] = useState(0);
  const [totalLuckBonus, setTotalLuckBonus] = useState(0);
  const [showRolling, setShowRolling] = useState(false);
  const [rollingValue, setRollingValue] = useState(0);
  const [particles, setParticles] = useState<{ id: string; x: number; y: number; color: string }[]>([]);
  const [autoPlay, setAutoPlay] = useState(false);
  const autoPlayRef = useRef(autoPlay);
  autoPlayRef.current = autoPlay;

  // Particle burst for rare events
  const spawnParticles = useCallback((rarity: string) => {
    const colors: Record<string, string[]> = {
      common: ['#9ca3af'],
      uncommon: ['#34d399'],
      rare: ['#60a5fa'],
      epic: ['#a78bfa'],
      legendary: ['#fbbf24'],
      mythical: ['#22d3ee', '#e879f9', '#fb923c'],
      godly: ['#fde047', '#f59e0b', '#ffffff', '#a855f7', '#22d3ee'],
    };
    const newParticles = Array.from({ length: rarity === 'godly' ? 80 : rarity === 'mythical' ? 50 : rarity === 'legendary' ? 30 : 10 }, (_, i) => ({
      id: uuidv4(),
      x: Math.random() * 100,
      y: Math.random() * 100,
      color: colors[rarity][Math.floor(Math.random() * colors[rarity].length)],
    }));
    setParticles(newParticles);
    setTimeout(() => setParticles([]), 3000);
  }, []);

  // Sound effects by rarity
  const playRaritySound = useCallback((rarity: string) => {
    if (rarity === 'godly') {
      engine.playTone(0, 'sawtooth', 1.2);
      setTimeout(() => engine.playTone(3, 'square', 0.8), 200);
      setTimeout(() => engine.playTone(4, 'triangle', 1.0), 400);
    } else if (rarity === 'mythical') {
      engine.playTone(0, 'sine', 0.6);
      setTimeout(() => engine.playTone(2, 'sine', 0.6), 150);
      setTimeout(() => engine.playTone(4, 'sine', 0.8), 300);
    } else if (rarity === 'legendary') {
      engine.playTone(0, 'sine', 0.5);
      setTimeout(() => engine.playTone(2, 'sine', 0.5), 120);
      setTimeout(() => engine.playTone(4, 'sine', 0.7), 240);
    } else if (rarity === 'epic') {
      engine.playTone(1, 'sine', 0.4);
      setTimeout(() => engine.playTone(3, 'sine', 0.5), 100);
    } else {
      engine.playTone(Math.floor(Math.random() * 5), 'sine', 0.3);
    }
  }, []);

  // Check achievements
  const checkAchievements = useCallback((newStats: PlayerStats, newYear: number, newUnlocked: UnlockedEvent[], newRebirths: number) => {
    const rareCount = newUnlocked.filter(u => {
      const ev = EVENTS.find(e => e.title === u.title);
      return ev && ['rare', 'epic', 'legendary', 'mythical', 'godly'].includes(ev.rarity);
    }).length;

    ACHIEVEMENTS.forEach(ach => {
      if (!achievements.includes(ach.id) && ach.condition(newStats, newYear, rareCount, newRebirths)) {
        setAchievements(prev => [...prev, ach.id]);
        console.log(`🏆 Logro desbloqueado: ${ach.name}`);
      }
    });
  }, [achievements]);

  // Handle rolling animation
  const triggerRoll = useCallback(async (fn: () => void) => {
    if (showRolling || isDead) return;
    setShowRolling(true);
    
    // Slot machine effect
    let count = 0;
    const interval = setInterval(() => {
      setRollingValue(Math.floor(Math.random() * 99));
      count++;
      if (count > 15) clearInterval(interval);
    }, 60);
    
    await new Promise(r => setTimeout(r, 900));
    clearInterval(interval);
    setRollingValue(year + 1);
    fn();
    setTimeout(() => setShowRolling(false), 200);
  }, [showRolling, isDead, year]);

  const handlePassYear = useCallback(() => {
    triggerRoll(() => {
      const nextYear = year + 1;
      setYear(nextYear);

      // Determine event (consider luck upgrade)
      const randomEvent = getWeightedRandomEvent();
      
      // Apply luck bonus to upgrade probability weighting
      const luck = totalLuckBonus + (upgrades['lucky_charm'] || 0) * 0.1 + (upgrades['education'] || 0) * 0.05;
      setCurrentEvent(randomEvent);
      
      playRaritySound(randomEvent.rarity);
      spawnParticles(randomEvent.rarity);

      const healthChange = randomEvent.healthChange || 0;
      const moneyChange = randomEvent.moneyChange || 0;
      const happyChange = randomEvent.happinessChange || 0;
      const intChange = randomEvent.intelligenceChange || 0;
      const charChange = randomEvent.charismaChange || 0;

      setStats(prevStats => {
        const newHealth = Math.max(0, Math.min(100, prevStats.health + healthChange));
        const newMoney = prevStats.money + moneyChange;
        const newHappy = Math.max(0, Math.min(100, prevStats.happiness + happyChange));
        const newInt = Math.max(0, prevStats.intelligence + intChange);
        const newChar = Math.max(0, prevStats.charisma + charChange);

        // Floating texts
        const newFloatingTexts: FloatingTextItem[] = [];
        if (healthChange !== 0) newFloatingTexts.push({ id: uuidv4(), value: `${healthChange > 0 ? '+' : ''}${healthChange}%`, type: healthChange > 0 ? 'positive' : 'negative', key: 'health' });
        if (moneyChange !== 0) newFloatingTexts.push({ id: uuidv4(), value: `${moneyChange > 0 ? '+' : ''}$${moneyChange}`, type: moneyChange > 0 ? 'positive' : 'negative', key: 'money' });
        if (happyChange !== 0) newFloatingTexts.push({ id: uuidv4(), value: `${happyChange > 0 ? '+' : ''}${happyChange}`, type: happyChange > 0 ? 'positive' : 'negative', key: 'happiness' });
        if (intChange !== 0) newFloatingTexts.push({ id: uuidv4(), value: `${intChange > 0 ? '+' : ''}${intChange}`, type: 'neutral', key: 'intelligence' });
        if (charChange !== 0) newFloatingTexts.push({ id: uuidv4(), value: `${charChange > 0 ? '+' : ''}${charChange}`, type: 'neutral', key: 'charisma' });
        setFloatingTexts(prev => [...prev, ...newFloatingTexts]);

        // Update unlocked events
        setUnlockedEvents(prev => {
          const existing = prev.find(u => u.title === randomEvent.title);
          if (existing) {
            return prev.map(u => u.title === randomEvent.title ? { ...u, timesSeen: u.timesSeen + 1 } : u);
          }
          return [...prev, { title: randomEvent.title, rarity: randomEvent.rarity, firstSeen: nextYear, timesSeen: 1 }];
        });

        // Check death
        if (newHealth <= 0) {
          setIsDead(true);
          setDeathCause(randomEvent.title);
          saveRun(nextYear, newMoney, randomEvent.title, rebirths);
        }

        // Check for godly achievement
        if (randomEvent.rarity === 'godly') {
          const achIdx = ACHIEVEMENTS.findIndex(a => a.id === 'godly_event');
          if (achIdx >= 0) ACHIEVEMENTS[achIdx].condition({ health: newHealth, money: newMoney, happiness: newHappy, intelligence: newInt, charisma: newChar }, nextYear, 0, rebirths);
        }

        checkAchievements({ health: newHealth, money: newMoney, happiness: newHappy, intelligence: newInt, charisma: newChar }, nextYear, [], rebirths);

        return { health: newHealth, money: newMoney, happiness: newHappy, intelligence: newInt, charisma: newChar };
      });
    });
  }, [year, totalLuckBonus, upgrades, isDead, showRolling, rebirths, spawnParticles, playRaritySound, triggerRoll, checkAchievements]);

  // Save run to Supabase
  const saveRun = async (finalYear: number, finalMoney: number, cause: string, rebs: number) => {
    try {
      await supabase.from('graveyard').insert([{ age: finalYear, money: finalMoney, cause }]);
    } catch (e) {
      console.error("Error saving run:", e);
    }
  };

  // Rebirth handler
  const handleRebirth = () => {
    const newRebirths = rebirths + 1;
    const luckBonus = 0.05 * newRebirths;
    setRebirths(newRebirths);
    setTotalLuckBonus(luckBonus);
    setYear(0);
    setStats({ health: 100, money: 50, happiness: 50, intelligence: 10, charisma: 10 });
    setCurrentEvent(null);
    setIsDead(false);
    setDeathCause('');
    playRaritySound('mythical');
    
    // Visual feedback for rebirth
    setParticles(Array.from({ length: 50 }, () => ({
      id: uuidv4(), x: 50 + (Math.random() - 0.5) * 30, y: 50 + (Math.random() - 0.5) * 30,
      color: ['#fde047', '#a855f7', '#22d3ee'][Math.floor(Math.random() * 3)],
    })));
    setTimeout(() => setParticles([]), 2000);
  };

  // Buy upgrade
  const buyUpgrade = (upgrade: Upgrade) => {
    const currentStacks = upgrades[upgrade.id] || 0;
    if (currentStacks >= (upgrade.maxStacks || 99)) return;
    if (stats.money < upgrade.cost) return;
    
    setStats(prev => ({ ...prev, money: prev.money - upgrade.cost }));
    setUpgrades(prev => ({ ...prev, [upgrade.id]: currentStacks + 1 }));
    
    if (upgrade.effect === 'luck') setTotalLuckBonus(prev => prev + upgrade.value);
    playRaritySound('rare');
  };

  // Auto-play loop
  useEffect(() => {
    if (!autoPlay || isDead) return;
    const interval = setInterval(() => {
      if (autoPlayRef.current && !isDead) handlePassYear();
    }, 1500);
    return () => clearInterval(interval);
  }, [autoPlay, isDead, handlePassYear]);

  // Stats panel helper
  const renderStatCard = (label: string, value: number | string, color: string, icon: string, key: string) => (
    <div className="relative bg-slate-900/80 border border-slate-700 p-3 rounded-xl text-center shadow-lg">
      <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">{icon} {label}</h3>
      <p className={`text-2xl font-black ${color}`}>{value}</p>
      <AnimatePresence>
        {floatingTexts.filter(t => t.key === key).map(text => (
          <FloatingText key={text.id} value={text.value} type={text.type} onComplete={() => setFloatingTexts(prev => prev.filter(t => t.id !== text.id))} />
        ))}
      </AnimatePresence>
    </div>
  );

  // Render rarity-colored card
  const renderEventCard = (event: GameEvent) => {
    const cfg = RARITY_CONFIG[event.rarity];
    const isGodly = event.rarity === 'godly';
    const isMythical = event.rarity === 'mythical';
    
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.8, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.8, y: -20 }}
        transition={{ type: 'spring', stiffness: 200, damping: 15 }}
        className={`relative w-full max-w-md mx-auto rounded-2xl overflow-hidden ${cfg.bg} border-2 ${cfg.border} backdrop-blur-md shadow-xl`}
      >
        {/* Glow effect for rare+ */}
        {(isGodly || isMythical || event.rarity === 'legendary') && (
          <div className={`absolute inset-0 opacity-30 ${isGodly ? 'animate-pulse bg-gradient-to-br from-yellow-400 via-purple-500 to-cyan-400' : 'animate-pulse bg-gradient-to-br from-purple-500 to-pink-500'}`} />
        )}
        
        <div className="relative p-6">
          {/* Rarity badge */}
          <div className="flex items-center justify-between mb-3">
            <span className={`text-xs font-bold px-3 py-1 rounded-full ${isGodly ? 'bg-yellow-400 text-yellow-950 animate-pulse' : isMythical ? 'bg-gradient-to-r from-cyan-400 to-pink-400 text-white' : `${cfg.color.replace('text-', 'bg-').replace('400', '500')}/20 ${cfg.color} border ${cfg.border}`}`}>
              {cfg.emoji} {cfg.label}
            </span>
            {event.odds && event.odds > 1 && (
              <span className="text-xs text-slate-400">1/{event.odds.toLocaleString()}</span>
            )}
          </div>
          
          {/* Title */}
          <h3 className={`text-xl font-black mb-2 ${cfg.color} ${isGodly ? 'uppercase tracking-widest text-shadow-gold' : ''}`}>
            {event.title}
          </h3>
          
          {/* Description */}
          <p className="text-slate-300 text-sm leading-relaxed mb-4">{event.description}</p>
          
          {/* Stat changes */}
          <div className="flex flex-wrap gap-2 text-xs">
            {event.healthChange !== 0 && (
              <span className={`px-2 py-1 rounded ${event.healthChange > 0 ? 'bg-emerald-500/20 text-emerald-400' : 'bg-rose-500/20 text-rose-400'}`}>
                {event.healthChange > 0 ? '+' : ''}{event.healthChange} HP
              </span>
            )}
            {event.moneyChange !== 0 && (
              <span className={`px-2 py-1 rounded ${event.moneyChange > 0 ? 'bg-emerald-500/20 text-emerald-400' : 'bg-rose-500/20 text-rose-400'}`}>
                {event.moneyChange > 0 ? '+' : ''}${Math.abs(event.moneyChange)}
              </span>
            )}
            {event.happinessChange && event.happinessChange !== 0 && (
              <span className={`px-2 py-1 rounded ${event.happinessChange > 0 ? 'bg-yellow-500/20 text-yellow-400' : 'bg-rose-500/20 text-rose-400'}`}>
                {event.happinessChange > 0 ? '+' : ''}{event.happinessChange} 😊
              </span>
            )}
            {event.intelligenceChange && event.intelligenceChange !== 0 && (
              <span className={`px-2 py-1 rounded ${event.intelligenceChange > 0 ? 'bg-blue-500/20 text-blue-400' : 'bg-rose-500/20 text-rose-400'}`}>
                {event.intelligenceChange > 0 ? '+' : ''}{event.intelligenceChange} 🧠
              </span>
            )}
            {event.charismaChange && event.charismaChange !== 0 && (
              <span className={`px-2 py-1 rounded ${event.charismaChange > 0 ? 'bg-pink-500/20 text-pink-400' : 'bg-rose-500/20 text-rose-400'}`}>
                {event.charismaChange > 0 ? '+' : ''}{event.charismaChange} ⭐
              </span>
            )}
          </div>
        </div>
      </motion.div>
    );
  };

  return (
    <main className="relative min-h-screen flex flex-col items-center justify-start p-4 bg-slate-950 text-white overflow-x-hidden select-none">
      {/* Background glow */}
      <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-indigo-500/5 rounded-full blur-3xl pointer-events-none" />
      
      {/* Particles */}
      <Particles particles={particles} />

      {/* Header */}
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="text-center mt-4 mb-4">
        <h1 className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-pink-500 tracking-wider">
          LIFE RNG
        </h1>
        {rebirths > 0 && (
          <p className="text-xs text-purple-400 mt-1">✨ Rebirth {rebirths} • Suerte +{(totalLuckBonus * 100).toFixed(0)}%</p>
        )}
      </motion.div>

      {/* Age display with slot machine effect */}
      <div className="text-xl font-medium text-slate-400 mb-4">
        Edad:{' '}
        <span className="text-white font-black text-2xl inline-block w-12">
          {showRolling ? String(rollingValue).padStart(2, '0') : year}
        </span>
        años
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-5 gap-2 w-full max-w-lg mb-4">
        {renderStatCard('Salud', stats.health, 'text-rose-500', '❤️', 'health')}
        {renderStatCard('Dinero', `$${stats.money}`, 'text-emerald-400', '💰', 'money')}
        {renderStatCard('Felicidad', stats.happiness, 'text-yellow-400', '😊', 'happiness')}
        {renderStatCard('Inteligencia', stats.intelligence, 'text-blue-400', '🧠', 'intelligence')}
        {renderStatCard('Carisma', stats.charisma, 'text-pink-400', '⭐', 'charisma')}
      </div>

      {/* Tab navigation */}
      <div className="flex gap-1 mb-4 bg-slate-900/50 p-1 rounded-xl">
        {TABS.map(t => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${tab === t ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'}`}
          >
            {t === 'vida' && '🎮 Vida'}
            {t === 'inventario' && `📚 Inventario (${unlockedEvents.length})`}
            {t === 'tienda' && '🛒 Tienda'}
            {t === 'logros' && `🏆 Logros`}
          </button>
        ))}
      </div>

      {/* Main content area */}
      <div className="w-full max-w-lg flex-1">
        <AnimatePresence mode="wait">
          {tab === 'vida' && (
            <motion.div key="vida" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }}>
              {/* Event card */}
              <div className="mb-4 min-h-[200px]">
                <AnimatePresence mode="wait">
                  {currentEvent && !isDead && renderEventCard(currentEvent)}
                  {!currentEvent && !isDead && (
                    <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-slate-500 italic text-center py-8">
                      Presiona "Vivir un Año Más" para comenzar tu vida...
                    </motion.p>
                  )}
                  {isDead && (
                    <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="flex flex-col items-center bg-rose-950/40 border-2 border-rose-700 p-6 rounded-2xl backdrop-blur-md">
                      <h2 className="text-3xl font-black text-rose-500 mb-2 animate-pulse">¡HAS MUERTO!</h2>
                      <p className="text-slate-300 text-sm mb-1">Causa: <span className="font-semibold text-white">{deathCause}</span></p>
                      <p className="text-slate-400 text-xs mb-4">Viviste hasta los {year} años con ${stats.money}.</p>
                      <JuiceButton onClick={handleRebirth} toneIndex={4}>
                        🔄 Reencarnar (+{((totalLuckBonus + 0.05) * 100).toFixed(0)}% suerte)
                      </JuiceButton>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Action buttons */}
              {!isDead && (
                <div className="flex gap-2 justify-center">
                  <JuiceButton onClick={handlePassYear} toneIndex={2}>
                    Vivir un Año Más
                  </JuiceButton>
                  <button
                    onClick={() => setAutoPlay(!autoPlay)}
                    className={`px-4 py-3 rounded-xl font-bold transition-all ${autoPlay ? 'bg-amber-600 text-white animate-pulse' : 'bg-slate-800 text-slate-400 hover:bg-slate-700'}`}
                  >
                    {autoPlay ? '⏸ Pausar' : '▶ Auto'}
                  </button>
                </div>
              )}
            </motion.div>
          )}

          {tab === 'inventario' && (
            <motion.div key="inventario" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
              <div className="space-y-2">
                {Array.from(new Map(unlockedEvents.map(e => [e.title, e])).values()).sort((a, b) => {
                    const order = ['common', 'uncommon', 'rare', 'epic', 'legendary', 'mythical', 'godly'];
                    return order.indexOf(a.rarity) - order.indexOf(b.rarity);
                  })
                  .map(event => {
                    const cfg = RARITY_CONFIG[event.rarity as keyof typeof RARITY_CONFIG] || RARITY_CONFIG.common;
                    return (
                      <div key={event.title} className={`flex items-center gap-3 p-3 rounded-xl ${cfg.bg} border ${cfg.border}`}>
                        <span className="text-2xl">{cfg.emoji}</span>
                        <div className="flex-1 min-w-0">
                          <p className={`font-bold text-sm ${cfg.color} truncate`}>{event.title}</p>
                          <p className="text-xs text-slate-400">Año {event.firstSeen} • x{event.timesSeen}</p>
                        </div>
                        <span className={`text-xs font-bold px-2 py-1 rounded-full ${cfg.border} ${cfg.color}`}>
                          {cfg.label}
                        </span>
                      </div>
                    );
                  })}
                {unlockedEvents.length === 0 && (
                  <p className="text-slate-500 text-center py-8">Aún no has descubierto ningún evento.</p>
                )}
              </div>
            </motion.div>
          )}

          {tab === 'tienda' && (
            <motion.div key="tienda" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
              <div className="space-y-2">
                {UPGRADES.map(upgrade => {
                  const stacks = upgrades[upgrade.id] || 0;
                  const maxed = upgrade.maxStacks ? stacks >= upgrade.maxStacks : false;
                  const canBuy = !maxed && stats.money >= upgrade.cost;
                  return (
                    <button
                      key={upgrade.id}
                      disabled={!canBuy}
                      onClick={() => buyUpgrade(upgrade)}
                      className={`w-full flex items-center gap-3 p-3 rounded-xl border transition-all ${canBuy ? 'border-slate-700 bg-slate-900/80 hover:border-indigo-500' : 'border-slate-800 bg-slate-900/40 opacity-50 cursor-not-allowed'}`}
                    >
                      <div className="w-10 h-10 rounded-lg bg-indigo-600/20 flex items-center justify-center text-xl">
                        {upgrade.effect === 'luck' && '🍀'}
                        {upgrade.effect === 'healthRegen' && '❤️'}
                        {upgrade.effect === 'moneyMultiplier' && '💰'}
                      </div>
                      <div className="flex-1 text-left">
                        <p className="font-bold text-sm text-white">{upgrade.name}</p>
                        <p className="text-xs text-slate-400">{upgrade.description}</p>
                      </div>
                      <div className="text-right">
                        <p className={`font-bold text-sm ${canBuy ? 'text-emerald-400' : 'text-slate-500'}`}>
                          ${upgrade.cost}
                        </p>
                        {upgrade.maxStacks && <p className="text-xs text-slate-500">[{stacks}/{upgrade.maxStacks}]</p>}
                        {maxed && <p className="text-xs text-amber-400">MAX</p>}
                      </div>
                    </button>
                  );
                })}
              </div>
            </motion.div>
          )}

          {tab === 'logros' && (
            <motion.div key="logros" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
              <div className="space-y-2">
                {ACHIEVEMENTS.map(ach => {
                  const unlocked = achievements.includes(ach.id);
                  return (
                    <div key={ach.id} className={`flex items-center gap-3 p-3 rounded-xl border ${unlocked ? 'border-amber-500/50 bg-amber-950/20' : 'border-slate-800 bg-slate-900/40 opacity-50'}`}>
                      <span className="text-2xl">{unlocked ? ach.emoji : '🔒'}</span>
                      <div className="flex-1">
                        <p className={`font-bold text-sm ${unlocked ? 'text-amber-400' : 'text-slate-500'}`}>{ach.name}</p>
                        <p className="text-xs text-slate-400">{ach.description}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Bottom info */}
      <div className="mt-4 text-center text-xs text-slate-600">
        <p>Rarezas descubiertas: {unlockedEvents.length} / {EVENTS.length + FAMOUS_LIVES.length}</p>
      </div>
    </main>
  );
}