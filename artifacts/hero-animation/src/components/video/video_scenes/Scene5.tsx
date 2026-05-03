import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

export function Scene5() {
  const [phase, setPhase] = useState(0);

  useEffect(() => {
    const timers = [
      setTimeout(() => setPhase(1), 300),
      setTimeout(() => setPhase(2), 900),
      setTimeout(() => setPhase(3), 1600),
    ];
    return () => timers.forEach(t => clearTimeout(t));
  }, []);

  return (
    <motion.div
      className="absolute inset-0 flex items-center justify-center"
      initial={{ opacity: 1, scale: 1 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.15 }}
    >
      <div className="text-center px-12 relative z-10">
        <motion.div
          className="mb-8 flex justify-center"
          initial={{ scaleX: 0 }}
          animate={phase >= 1 ? { scaleX: 1 } : { scaleX: 0 }}
          transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
          style={{ originX: 0.5 }}
        >
          <div className="h-[2px] w-40" style={{ background: 'linear-gradient(90deg, #ea580c, #fbbf24, #ea580c)' }} />
        </motion.div>

        <motion.h2
          className="font-display font-black tracking-tighter leading-none mb-6"
          style={{ fontSize: '7vw', color: '#fffbeb' }}
          initial={{ opacity: 0, y: 0 }}
          animate={phase >= 1 ? { opacity: 1, y: 0 } : { opacity: 0, y: 0 }}
          transition={{ duration: 0.9 }}
        >
          {'YOUR BRAND'.split('').map((char, i) => (
            <motion.span
              key={i}
              style={{ display: 'inline-block', whiteSpace: char === ' ' ? 'pre' : 'normal' }}
              initial={{ opacity: 0, y: 50, rotateX: -45 }}
              animate={phase >= 1 ? { opacity: 1, y: 0, rotateX: 0 } : { opacity: 0, y: 50, rotateX: -45 }}
              transition={{ type: 'spring', stiffness: 300, damping: 22, delay: phase >= 1 ? i * 0.04 : 0 }}
            >
              {char}
            </motion.span>
          ))}
        </motion.h2>

        <motion.p
          className="text-[2.2vw] font-light tracking-widest uppercase"
          style={{ color: '#d97706', fontFamily: 'var(--font-mono)' }}
          initial={{ opacity: 0, y: 12 }}
          animate={phase >= 2 ? { opacity: 1, y: 0 } : { opacity: 0, y: 12 }}
          transition={{ duration: 0.7 }}
        >
          Elevated. Cinematic. Unforgettable.
        </motion.p>

        <motion.div
          className="mt-10 flex justify-center gap-4"
          initial={{ opacity: 0, y: 0 }}
          animate={phase >= 3 ? { opacity: 1, y: 0 } : { opacity: 0, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          {['CRAFT', 'VISION', 'IMPACT'].map((word, i) => (
            <motion.span
              key={word}
              className="px-6 py-3 rounded-full text-sm font-mono tracking-widest"
              style={{
                border: '1px solid rgba(234,88,12,0.4)',
                color: '#fbbf24',
                background: 'rgba(234,88,12,0.08)',
              }}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={phase >= 3 ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.8 }}
              transition={{ type: 'spring', stiffness: 300, damping: 20, delay: phase >= 3 ? i * 0.12 : 0 }}
            >
              {word}
            </motion.span>
          ))}
        </motion.div>
      </div>
    </motion.div>
  );
}
