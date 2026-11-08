'use client';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { JuiceButton } from '../components/ui/JuiceButton';
import { FloatingText } from '../components/ui/FloatingText';
import { engine } from '../lib/audio-engine';
import { EVENTS, GameEvent } from '../lib/events';
import { supabase } from '../lib/supabaseClient';
import { v4 as uuidv4 } from 'uuid';

interface PlayerStats {
  health: number;
  money: number;
}

interface FloatingTextItem {
  id: string;
  value: string;
  type: 'positive' | 'negative' | 'neutral';
  key: string;
}

export default function Home() {
  const [year, setYear] = useState(0);
  const [stats, setStats] = useState<PlayerStats>({ health: 100, money: 50 });
  const [floatingTexts, setFloatingTexts] = useState<FloatingTextItem[]>([]);
  const [currentEvent, setCurrentEvent] = useState<GameEvent | null>(null);
  const [isDead, setIsDead] = useState(false);
  const [deathCause, setDeathCause] = useState('');

  const saveRun = async (finalYear: number, finalMoney: number, cause: string) => {
    try {
      await supabase.from('graveyard').insert([
        { age: finalYear, money: finalMoney, cause }
      ]);
    } catch (e) {
      console.error("No se pudo guardar la partida (¿falta crear la tabla graveyard?)", e);
    }
  };

  const handlePassYear = () => {
    if (isDead) return;

    const nextYear = year + 1;
    setYear(nextYear);

    // Pick random event
    const randomEvent = EVENTS[Math.floor(Math.random() * EVENTS.length)];
    setCurrentEvent(randomEvent);

    const healthChange = randomEvent.healthChange;
    const moneyChange = randomEvent.moneyChange;

    // Audio Feedback
    if (healthChange > 0) engine.playTone(3);
    else if (healthChange < 0) engine.playTone(1);
    if (moneyChange > 0) engine.playTone(4);
    else if (moneyChange < 0) engine.playTone(0);

    setStats(prevStats => {
      const newHealth = Math.max(0, prevStats.health + healthChange);
      const newMoney = prevStats.money + moneyChange;

      // Floating text animations
      const newFloatingTexts: FloatingTextItem[] = [];
      if (healthChange !== 0) {
        newFloatingTexts.push({
          id: uuidv4(),
          value: (healthChange > 0 ? '+' : '') + healthChange,
          type: healthChange > 0 ? 'positive' : 'negative',
          key: 'health',
        });
      }
      if (moneyChange !== 0) {
        newFloatingTexts.push({
          id: uuidv4(),
          value: (moneyChange > 0 ? '+' : '') + moneyChange,
          type: moneyChange > 0 ? 'positive' : 'negative',
          key: 'money',
        });
      }
      setFloatingTexts(prev => [...prev, ...newFloatingTexts]);

      // Check death
      if (newHealth <= 0) {
        setIsDead(true);
        setDeathCause(randomEvent.title);
        engine.playTone(0, 'sawtooth', 0.8); // Death sound
        saveRun(nextYear, newMoney, randomEvent.title);
      }

      return { health: newHealth, money: newMoney };
    });
  };

  const handleRestart = () => {
    setYear(0);
    setStats({ health: 100, money: 50 });
    setCurrentEvent(null);
    setIsDead(false);
    setDeathCause('');
  };

  return (
    <main className="relative flex min-h-screen flex-col items-center justify-center p-8 bg-slate-950 text-white overflow-hidden select-none">
      
      {/* Background Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

      <motion.h1 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-5xl font-black mb-6 tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-pink-500"
      >
        LIFE RNG
      </motion.h1>

      {/* Age */}
      <div className="text-xl font-medium text-slate-400 mb-6">
        Edad: <span className="text-white font-bold text-2xl">{year}</span> años
      </div>

      {/* Stats Dashboard */}
      <div className="grid grid-cols-2 gap-6 w-full max-w-sm mb-8">
        <div className="relative bg-slate-900 border border-slate-800 p-4 rounded-2xl text-center shadow-lg">
          <h2 className="text-sm font-semibold text-rose-400 uppercase tracking-wider mb-1">Salud</h2>
          <p className="text-3xl font-black text-rose-500">{stats.health}%</p>
          <AnimatePresence>
            {floatingTexts.filter(text => text.key === 'health').map(text => (
              <FloatingText key={text.id} value={text.value} type={text.type} onComplete={() => setFloatingTexts(prev => prev.filter(t => t.id !== text.id))} />
            ))}
          </AnimatePresence>
        </div>

        <div className="relative bg-slate-900 border border-slate-800 p-4 rounded-2xl text-center shadow-lg">
          <h2 className="text-sm font-semibold text-emerald-400 uppercase tracking-wider mb-1">Dinero</h2>
          <p className="text-3xl font-black text-emerald-400">${stats.money}</p>
          <AnimatePresence>
            {floatingTexts.filter(text => text.key === 'money').map(text => (
              <FloatingText key={text.id} value={text.value} type={text.type} onComplete={() => setFloatingTexts(prev => prev.filter(t => t.id !== text.id))} />
            ))}
          </AnimatePresence>
        </div>
      </div>

      {/* Event Narrative Card */}
      <div className="w-full max-w-md min-h-[140px] flex items-center justify-center mb-8">
        <AnimatePresence mode="wait">
          {currentEvent && !isDead && (
            <motion.div
              key={currentEvent.title + year}
              initial={{ opacity: 0, scale: 0.9, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: -10 }}
              className="bg-slate-900/80 border border-slate-800 p-6 rounded-2xl text-center backdrop-blur-sm shadow-xl"
            >
              <h3 className="text-lg font-bold text-indigo-300 mb-2">{currentEvent.title}</h3>
              <p className="text-slate-300 text-sm leading-relaxed">{currentEvent.description}</p>
            </motion.div>
          )}
          {!currentEvent && !isDead && (
            <p className="text-slate-500 italic text-sm">Presiona el botón para comenzar a vivir...</p>
          )}
        </AnimatePresence>
      </div>

      {/* Actions / Game Over Modal */}
      {!isDead ? (
        <JuiceButton onClick={handlePassYear} toneIndex={2}>
          Vivir un Año Más
        </JuiceButton>
      ) : (
        <motion.div 
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="flex flex-col items-center bg-rose-950/40 border border-rose-900/50 p-6 rounded-3xl backdrop-blur-md"
        >
          <h2 className="text-3xl font-black text-rose-500 mb-2">¡HAS MUERTO!</h2>
          <p className="text-slate-300 text-sm mb-4">Causa: <span className="font-semibold text-white">{deathCause}</span></p>
          <p className="text-slate-400 text-xs mb-6">Viviste hasta los {year} años con ${stats.money}.</p>
          <JuiceButton onClick={handleRestart} toneIndex={4}>
            Reencarnar
          </JuiceButton>
        </motion.div>
      )}

    </main>
  );
}
