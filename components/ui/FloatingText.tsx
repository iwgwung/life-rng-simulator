'use client';
import { motion } from 'framer-motion';

export const FloatingText = ({ 
  value, 
  type, 
  onComplete 
}: { 
  value: string, 
  type: 'positive' | 'negative' | 'neutral', 
  onComplete: () => void 
}) => {
  const color = type === 'positive' ? 'text-emerald-400' : type === 'negative' ? 'text-rose-400' : 'text-slate-400';

  return (
    <motion.div
      initial={{ opacity: 1, y: 0, scale: 0.5 }}
      animate={{ opacity: 0, y: -60, scale: 1.3 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 1, ease: "easeOut" }}
      onAnimationComplete={onComplete}
      className="absolute left-0 right-0 text-center font-black text-lg pointer-events-none z-50 drop-shadow-lg"
      style={{ top: '-20px' }}
    >
      {value}
    </motion.div>
  );
};
