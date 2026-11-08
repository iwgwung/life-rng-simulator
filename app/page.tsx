'use client';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { JuiceButton } from '../components/ui/JuiceButton';

export default function Home() {
  const [year, setYear] = useState(0);

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <motion.h1 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-6xl font-black mb-8"
      >
        Life RNG
      </motion.h1>
      
      <div className="text-2xl mb-8">Año: {year}</div>
      
      <JuiceButton onClick={() => setYear(year + 1)} toneIndex={0}>
        Pasar Año
      </JuiceButton>
    </main>
  );
}
