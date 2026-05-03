import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

export function Scene1() {
  const [phase, setPhase] = useState(0);

  useEffect(() => {
    const timers = [
      setTimeout(() => setPhase(1), 200),
      setTimeout(() => setPhase(2), 900),
      setTimeout(() => setPhase(3), 1800),
      setTimeout(() => setPhase(4), 2800),
    ];
    return () => timers.forEach(t => clearTimeout(t));
  }, []);

  return (
    <motion.div
      className="absolute inset-0 flex items-center justify-center"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.15 }}
    >
      <div className="text-center px-12">
        <motion.p
          className="font-mono tracking-[0.4em] uppercase mb-5 text-[1.4vw]"
          style={{ color: '#d97706' }}
          initial={{ opacity: 0, y: 16 }}
          animate={phase >= 1 ? { opacity: 1, y: 0 } : { opacity: 0, y: 16 }}
          transition={{ duration: 0.7 }}
        >
          Available for work · 2025
        </motion.p>

        <div
          className="font-display font-black tracking-tight leading-none mb-6"
          style={{ fontSize: '9vw', perspective: '600px' }}
        >
          {'CREATIVE'.split('').map((char, i) => (
            <motion.span
              key={`c-${i}`}
              style={{ display: 'inline-block' }}
              initial={{ opacity: 0, y: '1.2em', rotateX: -80 }}
              animate={phase >= 2 ? { opacity: 1, y: 0, rotateX: 0 } : { opacity: 0, y: '1.2em', rotateX: -80 }}
              transition={{ type: 'spring', stiffness: 260, damping: 22, delay: phase >= 2 ? i * 0.045 : 0 }}
            >
              <span style={{ color: '#fffbeb' }}>{char}</span>
            </motion.span>
          ))}
        </div>

        <div
          className="font-display font-black tracking-tight leading-none mb-10"
          style={{ fontSize: '9vw', perspective: '600px' }}
        >
          {'DEVELOPER'.split('').map((char, i) => (
            <motion.span
              key={`d-${i}`}
              style={{ display: 'inline-block' }}
              initial={{ opacity: 0, y: '1.2em', rotateX: -80 }}
              animate={phase >= 2 ? { opacity: 1, y: 0, rotateX: 0 } : { opacity: 0, y: '1.2em', rotateX: -80 }}
              transition={{ type: 'spring', stiffness: 260, damping: 22, delay: phase >= 2 ? (i + 8) * 0.045 : 0 }}
            >
              <span style={{
                color: i < 4 ? '#ea580c' : '#d97706',
              }}>{char}</span>
            </motion.span>
          ))}
        </div>

        <motion.p
          className="font-light text-[1.8vw] max-w-[38vw] mx-auto leading-relaxed"
          style={{ color: '#fde68a' }}
          initial={{ opacity: 0, y: 20 }}
          animate={phase >= 3 ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.9 }}
        >
          I craft immersive digital experiences that blend design, motion, and code.
        </motion.p>

        <motion.div
          className="mt-10 flex items-center justify-center gap-6"
          initial={{ opacity: 0 }}
          animate={phase >= 4 ? { opacity: 1 } : { opacity: 0 }}
          transition={{ duration: 0.8 }}
        >
          {['↓ Scroll to explore', '·', 'Based worldwide'].map((t, i) => (
            <span key={i} className="font-mono text-[1.1vw] tracking-widest" style={{ color: '#d97706', opacity: i === 1 ? 0.4 : 1 }}>
              {t}
            </span>
          ))}
        </motion.div>
      </div>
    </motion.div>
  );
}
