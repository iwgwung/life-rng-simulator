'use client';
import { motion } from 'framer-motion';

interface Particle {
  id: string;
  x: number;
  y: number;
  color: string;
}

export default function Particles({ particles }: { particles: Particle[] }) {
  return (
    <>
      {particles.map(p => (
        <motion.div
          key={p.id}
          initial={{ opacity: 1, scale: 1, x: p.x, y: p.y }}
          animate={{ opacity: 0, scale: 0, x: p.x + (Math.random() - 0.5) * 200, y: p.y - Math.random() * 300 }}
          transition={{ duration: 1.5, ease: 'easeOut' }}
          style={{ position: 'fixed', left: `${p.x}%`, top: `${p.y}%`, zIndex: 9999 }}
          className="w-3 h-3 rounded-full pointer-events-none"
          onAnimationComplete={() => {}}
        >
          <div style={{ backgroundColor: p.color }} className="w-full h-full rounded-full shadow-lg" />
        </motion.div>
      ))}
    </>
  );
}
