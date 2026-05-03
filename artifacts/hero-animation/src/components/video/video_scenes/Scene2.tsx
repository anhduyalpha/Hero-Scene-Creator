import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

const skills = [
  { label: 'UI / UX Design', pct: 95, color: '#ea580c' },
  { label: 'React & TypeScript', pct: 92, color: '#d97706' },
  { label: 'Motion Design', pct: 88, color: '#fbbf24' },
  { label: 'Three.js / WebGL', pct: 80, color: '#ea580c' },
  { label: 'Node.js / APIs', pct: 85, color: '#d97706' },
];

export function Scene2() {
  const [phase, setPhase] = useState(0);

  useEffect(() => {
    const timers = [
      setTimeout(() => setPhase(1), 200),
      setTimeout(() => setPhase(2), 700),
      setTimeout(() => setPhase(3), 1100),
    ];
    return () => timers.forEach(t => clearTimeout(t));
  }, []);

  return (
    <motion.div
      className="absolute inset-0 flex items-center justify-start"
      style={{ paddingLeft: '10vw' }}
      initial={{ opacity: 0, x: 60 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -60 }}
      transition={{ duration: 0.15 }}
    >
      <div style={{ maxWidth: '50vw' }}>
        <motion.p
          className="font-mono tracking-[0.35em] uppercase mb-4 text-[1.2vw]"
          style={{ color: '#ea580c' }}
          initial={{ opacity: 0 }}
          animate={phase >= 1 ? { opacity: 1 } : { opacity: 0 }}
          transition={{ duration: 0.6 }}
        >
          What I do
        </motion.p>

        <motion.h2
          className="font-display font-black tracking-tight leading-none mb-10"
          style={{ fontSize: '6.5vw', color: '#fffbeb' }}
          initial={{ opacity: 0, y: 30 }}
          animate={phase >= 1 ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.8 }}
        >
          Skills &<br />
          <span style={{ color: '#ea580c' }}>Expertise</span>
        </motion.h2>

        <div className="flex flex-col gap-5">
          {skills.map((skill, i) => (
            <motion.div
              key={skill.label}
              initial={{ opacity: 0, x: -40 }}
              animate={phase >= 2 ? { opacity: 1, x: 0 } : { opacity: 0, x: -40 }}
              transition={{ duration: 0.6, delay: phase >= 2 ? i * 0.1 : 0 }}
            >
              <div className="flex justify-between mb-2">
                <span className="font-mono text-[1.15vw] tracking-wide" style={{ color: '#fde68a' }}>
                  {skill.label}
                </span>
                <motion.span
                  className="font-mono text-[1.15vw] font-bold"
                  style={{ color: skill.color }}
                  initial={{ opacity: 0 }}
                  animate={phase >= 3 ? { opacity: 1 } : { opacity: 0 }}
                  transition={{ duration: 0.4, delay: i * 0.08 }}
                >
                  {skill.pct}%
                </motion.span>
              </div>
              <div
                className="w-full rounded-full overflow-hidden"
                style={{ height: '6px', background: 'rgba(255,255,255,0.1)' }}
              >
                <motion.div
                  className="h-full rounded-full"
                  style={{ background: `linear-gradient(90deg, ${skill.color}, #fbbf24)` }}
                  initial={{ width: 0 }}
                  animate={phase >= 3 ? { width: `${skill.pct}%` } : { width: 0 }}
                  transition={{ duration: 1, ease: [0.16, 1, 0.3, 1], delay: i * 0.1 }}
                />
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}
