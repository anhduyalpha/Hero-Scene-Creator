import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

export function Scene5() {
  const [phase, setPhase] = useState(0);

  useEffect(() => {
    const timers = [
      setTimeout(() => setPhase(1), 300),
      setTimeout(() => setPhase(2), 1000),
      setTimeout(() => setPhase(3), 1800),
    ];
    return () => timers.forEach(t => clearTimeout(t));
  }, []);

  return (
    <motion.div
      className="absolute inset-0 flex items-center justify-center"
      initial={{ opacity: 1 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.15 }}
    >
      <div className="text-center px-12">
        <motion.p
          className="font-mono tracking-[0.4em] uppercase mb-6 text-[1.2vw]"
          style={{ color: '#d97706' }}
          initial={{ opacity: 0 }}
          animate={phase >= 1 ? { opacity: 1 } : { opacity: 0 }}
          transition={{ duration: 0.7 }}
        >
          Let's build something great
        </motion.p>

        <motion.div
          className="font-display font-black tracking-tight leading-none mb-4"
          style={{ fontSize: '8.5vw' }}
        >
          {"LET'S".split('').map((char, i) => (
            <motion.span
              key={`l-${i}`}
              style={{ display: 'inline-block', color: '#fffbeb' }}
              initial={{ opacity: 0, y: '1em', rotateX: -60 }}
              animate={phase >= 1 ? { opacity: 1, y: 0, rotateX: 0 } : { opacity: 0, y: '1em', rotateX: -60 }}
              transition={{ type: 'spring', stiffness: 300, damping: 24, delay: phase >= 1 ? i * 0.06 : 0 }}
            >
              {char === ' ' ? '\u00a0' : char}
            </motion.span>
          ))}
        </motion.div>

        <motion.div
          className="font-display font-black tracking-tight leading-none mb-12"
          style={{ fontSize: '8.5vw' }}
        >
          {'CONNECT'.split('').map((char, i) => (
            <motion.span
              key={`c-${i}`}
              style={{
                display: 'inline-block',
                color: i % 2 === 0 ? '#ea580c' : '#fbbf24',
              }}
              initial={{ opacity: 0, y: '1em', rotateX: -60 }}
              animate={phase >= 1 ? { opacity: 1, y: 0, rotateX: 0 } : { opacity: 0, y: '1em', rotateX: -60 }}
              transition={{ type: 'spring', stiffness: 300, damping: 24, delay: phase >= 1 ? (i + 6) * 0.06 : 0 }}
            >
              {char}
            </motion.span>
          ))}
        </motion.div>

        <motion.div
          className="flex justify-center items-center gap-8 mb-10"
          initial={{ opacity: 0, y: 16 }}
          animate={phase >= 2 ? { opacity: 1, y: 0 } : { opacity: 0, y: 16 }}
          transition={{ duration: 0.8 }}
        >
          <div
            className="h-px flex-1"
            style={{ maxWidth: '8vw', background: 'linear-gradient(90deg, transparent, #ea580c)' }}
          />
          <span className="font-mono text-[1.3vw] tracking-widest" style={{ color: '#fde68a' }}>
            hello@yourportfolio.com
          </span>
          <div
            className="h-px flex-1"
            style={{ maxWidth: '8vw', background: 'linear-gradient(90deg, #ea580c, transparent)' }}
          />
        </motion.div>

        <motion.div
          className="flex justify-center gap-5"
          initial={{ opacity: 0 }}
          animate={phase >= 3 ? { opacity: 1 } : { opacity: 0 }}
          transition={{ duration: 0.7 }}
        >
          {['GitHub', 'Dribbble', 'LinkedIn', 'Twitter'].map((net, i) => (
            <motion.span
              key={net}
              className="px-5 py-2.5 rounded-full font-mono text-[1vw] tracking-widest"
              style={{
                border: '1px solid rgba(234,88,12,0.35)',
                color: '#fbbf24',
                background: 'rgba(234,88,12,0.07)',
              }}
              initial={{ opacity: 0, scale: 0.85 }}
              animate={phase >= 3 ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.85 }}
              transition={{ type: 'spring', stiffness: 320, damping: 20, delay: phase >= 3 ? i * 0.1 : 0 }}
            >
              {net}
            </motion.span>
          ))}
        </motion.div>
      </div>
    </motion.div>
  );
}
