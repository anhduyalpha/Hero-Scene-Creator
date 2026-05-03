import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

const stats = [
  { value: '50+', label: 'Projects delivered' },
  { value: '8+', label: 'Years experience' },
  { value: '30+', label: 'Happy clients' },
];

export function Scene4() {
  const [phase, setPhase] = useState(0);

  useEffect(() => {
    const timers = [
      setTimeout(() => setPhase(1), 200),
      setTimeout(() => setPhase(2), 900),
      setTimeout(() => setPhase(3), 1700),
    ];
    return () => timers.forEach(t => clearTimeout(t));
  }, []);

  return (
    <motion.div
      className="absolute inset-0 flex items-center justify-center"
      initial={{ opacity: 0, clipPath: 'circle(0% at 50% 50%)' }}
      animate={{ opacity: 1, clipPath: 'circle(150% at 50% 50%)' }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.15 }}
    >
      <div className="text-center px-12" style={{ maxWidth: '70vw' }}>
        <motion.p
          className="font-mono tracking-[0.35em] uppercase mb-5 text-[1.2vw]"
          style={{ color: '#ea580c' }}
          initial={{ opacity: 0 }}
          animate={phase >= 1 ? { opacity: 1 } : { opacity: 0 }}
          transition={{ duration: 0.6 }}
        >
          About me
        </motion.p>

        <motion.h2
          className="font-display font-black tracking-tight leading-tight mb-8"
          style={{ fontSize: '5.5vw', color: '#fffbeb' }}
          initial={{ opacity: 0, y: 30 }}
          animate={phase >= 1 ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.9 }}
        >
          I turn ideas into<br />
          <span style={{ color: '#ea580c' }}>living, breathing</span> products.
        </motion.h2>

        <motion.p
          className="font-light leading-relaxed mx-auto mb-14 text-[1.6vw]"
          style={{ color: '#fde68a', maxWidth: '50vw' }}
          initial={{ opacity: 0, y: 20 }}
          animate={phase >= 2 ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.8 }}
        >
          From concept to launch, I build products people love — obsessing over every interaction,
          pixel, and performance metric along the way.
        </motion.p>

        <motion.div
          className="flex justify-center gap-14"
          initial={{ opacity: 0, y: 20 }}
          animate={phase >= 3 ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.8 }}
        >
          {stats.map((s, i) => (
            <motion.div
              key={s.label}
              className="text-center"
              initial={{ opacity: 0, y: 20 }}
              animate={phase >= 3 ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
              transition={{ duration: 0.6, delay: phase >= 3 ? i * 0.15 : 0 }}
            >
              <p
                className="font-display font-black leading-none mb-2"
                style={{ fontSize: '5vw', color: '#fbbf24' }}
              >
                {s.value}
              </p>
              <p className="font-mono text-[1vw] tracking-widest uppercase" style={{ color: '#d97706' }}>
                {s.label}
              </p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </motion.div>
  );
}
