'use client';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { JuiceButton } from '../components/ui/JuiceButton';
import { FloatingText } from '../components/ui/FloatingText';
import { engine } from '../lib/audio-engine';
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
  const [stats, setStats] = useState<PlayerStats>({ health: 100, money: 0 });
  const [floatingTexts, setFloatingTexts] = useState<FloatingTextItem[]>([]);

  const handlePassYear = () => {
    setYear(prevYear => prevYear + 1);

    const healthChange = Math.floor(Math.random() * 20) - 10;
    const moneyChange = Math.floor(Math.random() * 50) - 20;

    if (healthChange > 0) engine.playTone(3);
    else if (healthChange < 0) engine.playTone(1);
    if (moneyChange > 0) engine.playTone(4);
    else if (moneyChange < 0) engine.playTone(0);

    setStats(prevStats => {
      const newHealth = Math.max(0, prevStats.health + healthChange);
      const newMoney = prevStats.money + moneyChange;

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

      return { health: newHealth, money: newMoney };
    });
  };

  return (
    <main className="relative flex min-h-screen flex-col items-center justify-center p-24 overflow-hidden">
      <motion.h1 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-6xl font-black mb-8"
      >
        Life RNG
      </motion.h1>
      
      <div className="text-2xl mb-8">Año: {year}</div>

      <div className="grid grid-cols-2 gap-8 mb-12">
        <div className="relative text-center">
          <h2 className="text-xl font-bold text-red-400">Salud</h2>
          <p className="text-4xl font-extrabold text-red-500">{stats.health}</p>
          <AnimatePresence>
            {floatingTexts.filter(text => text.key === 'health').map(text => (
              <FloatingText key={text.id} value={text.value} type={text.type} onComplete={() => setFloatingTexts(prev => prev.filter(t => t.id !== text.id))} />
            ))}
          </AnimatePresence>
        </div>
        <div className="relative text-center">
          <h2 className="text-xl font-bold text-green-400">Dinero</h2>
          <p className="text-4xl font-extrabold text-green-500">${stats.money}</p>
          <AnimatePresence>
            {floatingTexts.filter(text => text.key === 'money').map(text => (
              <FloatingText key={text.id} value={text.value} type={text.type} onComplete={() => setFloatingTexts(prev => prev.filter(t => t.id !== text.id))} />
            ))}
          </AnimatePresence>
        </div>
      </div>
      
      <JuiceButton onClick={handlePassYear} toneIndex={0}>
        Pasar Año
      </JuiceButton>
    </main>
  );
}
