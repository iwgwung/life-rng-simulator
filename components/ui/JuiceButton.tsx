'use client';
import { motion } from 'framer-motion';
import { AudioEngine } from '../../lib/audio-engine';

const engine = new AudioEngine();

export const JuiceButton = ({ children, onClick, toneIndex = 0 }: { children: React.ReactNode, onClick: () => void, toneIndex?: number }) => {
  return (
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95, rotate: -2 }}
      onClick={() => {
        engine.playTone(toneIndex);
        onClick();
      }}
      className="px-6 py-3 bg-indigo-600 text-white rounded-xl shadow-lg font-bold transition-all"
    >
      {children}
    </motion.button>
  );
};
