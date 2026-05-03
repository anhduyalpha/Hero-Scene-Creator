import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

const projects = [
  {
    title: 'Brand Identity',
    category: 'Design · Motion',
    year: '2024',
    color: '#ea580c',
  },
  {
    title: 'Web Platform',
    category: 'React · TypeScript',
    year: '2024',
    color: '#d97706',
  },
  {
    title: 'Mobile App',
    category: 'UX · Native',
    year: '2025',
    color: '#fbbf24',
  },
];

export function Scene3() {
  const [phase, setPhase] = useState(0);

  useEffect(() => {
    const timers = [
      setTimeout(() => setPhase(1), 200),
      setTimeout(() => setPhase(2), 700),
      setTimeout(() => setPhase(3), 1200),
    ];
    return () => timers.forEach(t => clearTimeout(t));
  }, []);

  return (
    <motion.div
      className="absolute inset-0 flex items-center justify-end"
      style={{ paddingRight: '8vw' }}
      initial={{ opacity: 0, scale: 0.96 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 1.04 }}
      transition={{ duration: 0.15 }}
    >
      <div style={{ maxWidth: '55vw', width: '100%' }}>
        <motion.p
          className="font-mono tracking-[0.35em] uppercase mb-4 text-right text-[1.2vw]"
          style={{ color: '#ea580c' }}
          initial={{ opacity: 0 }}
          animate={phase >= 1 ? { opacity: 1 } : { opacity: 0 }}
          transition={{ duration: 0.6 }}
        >
          Selected work
        </motion.p>

        <motion.h2
          className="font-display font-black tracking-tight leading-none mb-10 text-right"
          style={{ fontSize: '6.5vw', color: '#fffbeb' }}
          initial={{ opacity: 0, x: 40 }}
          animate={phase >= 1 ? { opacity: 1, x: 0 } : { opacity: 0, x: 40 }}
          transition={{ duration: 0.8 }}
        >
          Featured<br />
          <span style={{ color: '#d97706' }}>Projects</span>
        </motion.h2>

        <div className="flex flex-col gap-4">
          {projects.map((p, i) => (
            <motion.div
              key={p.title}
              className="flex items-center justify-between rounded-2xl px-7 py-5"
              style={{
                background: 'rgba(255,255,255,0.04)',
                border: `1px solid ${p.color}33`,
                backdropFilter: 'blur(4px)',
              }}
              initial={{ opacity: 0, x: 60 }}
              animate={phase >= 2 ? { opacity: 1, x: 0 } : { opacity: 0, x: 60 }}
              transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1], delay: phase >= 2 ? i * 0.12 : 0 }}
            >
              <div className="flex items-center gap-5">
                <motion.div
                  className="rounded-full"
                  style={{ width: '1vw', height: '1vw', background: p.color, flexShrink: 0 }}
                  animate={{ scale: [1, 1.3, 1] }}
                  transition={{ duration: 2, repeat: Infinity, delay: i * 0.4 }}
                />
                <div>
                  <p className="font-display font-bold text-[1.6vw]" style={{ color: '#fffbeb' }}>
                    {p.title}
                  </p>
                  <p className="font-mono text-[1vw] tracking-wider mt-0.5" style={{ color: '#d97706' }}>
                    {p.category}
                  </p>
                </div>
              </div>
              <motion.span
                className="font-mono text-[1.1vw]"
                style={{ color: '#78350f' }}
                initial={{ opacity: 0 }}
                animate={phase >= 3 ? { opacity: 1 } : { opacity: 0 }}
                transition={{ delay: i * 0.1 }}
              >
                {p.year}
              </motion.span>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}
