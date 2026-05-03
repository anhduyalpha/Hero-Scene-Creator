import { useState, useEffect } from 'react';
import { motion, useReducedMotion } from 'framer-motion';

const EASE_OUT = [0.16, 1, 0.3, 1] as const;
const SPRING = { type: 'spring', stiffness: 280, damping: 22 } as const;

const projects = [
  {
    num:      '01',
    title:    'Brand Identity System',
    category: 'Design · Motion · Strategy',
    desc:     'Full visual identity for a SaaS startup — logo, color, type, motion system.',
    year:     '2024',
    color:    '#ea580c',
    tags:     ['Figma', 'After Effects'],
  },
  {
    num:      '02',
    title:    'Interactive Web Platform',
    category: 'React · TypeScript · API',
    desc:     'High-performance dashboard with real-time data, animations, and dark mode.',
    year:     '2024',
    color:    '#d97706',
    tags:     ['React', 'Framer', 'Supabase'],
  },
  {
    num:      '03',
    title:    'Mobile Experience App',
    category: 'Expo · UX · Native',
    desc:     'Award-nominated travel companion app with 100 K+ downloads.',
    year:     '2025',
    color:    '#fbbf24',
    tags:     ['Expo', 'React Native'],
  },
];

export function Scene3() {
  const [phase, setPhase] = useState(0);
  const shouldReduce = useReducedMotion();

  useEffect(() => {
    const t1 = setTimeout(() => setPhase(1), 180);
    const t2 = setTimeout(() => setPhase(2), 640);
    const t3 = setTimeout(() => setPhase(3), 1150);
    return () => [t1, t2, t3].forEach(clearTimeout);
  }, []);

  return (
    <motion.div
      className="absolute inset-0 flex items-center justify-end"
      style={{ paddingRight: '7vw' }}
      initial={{ opacity: 0, scale: 0.97 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 1.02 }}
      transition={{ duration: 0.12 }}
      role="region"
      aria-label="Selected work"
    >
      <div style={{ maxWidth: '58vw', width: '100%' }}>

        {/* ── Header row ── */}
        <div className="flex items-end justify-between mb-8">
          <div>
            <motion.p
              className="text-label text-[0.72rem] mb-2"
              style={{ color: '#ea580c' }}
              initial={{ opacity: 0 }}
              animate={phase >= 1 ? { opacity: 1 } : { opacity: 0 }}
              transition={{ duration: 0.5 }}
            >
              ✦ Portfolio
            </motion.p>
            <motion.h2
              className="text-display"
              style={{ fontSize: 'clamp(2.2rem, 5.5vw, 5.5rem)', color: '#fffbeb' }}
              initial={{ opacity: 0, x: 30 }}
              animate={phase >= 1 ? { opacity: 1, x: 0 } : { opacity: 0, x: 30 }}
              transition={{ duration: 0.6, ease: EASE_OUT }}
            >
              Featured{' '}
              <span style={{
                background: 'linear-gradient(135deg, #d97706, #fbbf24)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}>
                Projects
              </span>
            </motion.h2>
          </div>
          <motion.span
            className="text-label text-[0.68rem] tabular-nums"
            style={{ color: '#78350f' }}
            initial={{ opacity: 0 }}
            animate={phase >= 1 ? { opacity: 1 } : { opacity: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            3 case studies
          </motion.span>
        </div>

        {/* ── Project cards ── */}
        <div className="flex flex-col" style={{ gap: '1.1vw' }} role="list">
          {projects.map((p, i) => (
            <motion.article
              key={p.title}
              role="listitem"
              className="glass rounded-2xl overflow-hidden relative"
              style={{ padding: '1.4vw 1.8vw' }}
              initial={{ opacity: 0, x: 50, y: 0 }}
              animate={phase >= 2 ? { opacity: 1, x: 0 } : { opacity: 0, x: 50 }}
              transition={{ duration: 0.55, ease: EASE_OUT, delay: phase >= 2 ? i * 0.11 : 0 }}
            >
              {/* Gradient accent border left */}
              <div
                className="absolute left-0 inset-y-0 rounded-l-2xl"
                style={{ width: 3, background: `linear-gradient(180deg, ${p.color}, transparent)` }}
              />

              <div className="flex items-start justify-between gap-4">
                <div className="flex items-start gap-4 flex-1 min-w-0">
                  {/* Project number */}
                  <span className="font-mono font-semibold tabular-nums shrink-0" style={{ fontSize: '0.75vw', color: p.color, opacity: 0.7, marginTop: 2 }}>
                    {p.num}
                  </span>

                  <div className="min-w-0">
                    <p
                      className="font-display font-bold truncate"
                      style={{ fontSize: '1.4vw', color: '#fffbeb', letterSpacing: '-0.02em' }}
                    >
                      {p.title}
                    </p>
                    <motion.p
                      className="font-body text-[0.95vw] mt-0.5 leading-snug"
                      style={{ color: '#fde68a', opacity: 0.75, maxWidth: '28vw' }}
                      initial={{ opacity: 0 }}
                      animate={phase >= 3 ? { opacity: 0.75 } : { opacity: 0 }}
                      transition={{ duration: 0.45, delay: i * 0.07 }}
                    >
                      {p.desc}
                    </motion.p>

                    {/* Tech tags */}
                    <motion.div
                      className="flex gap-1.5 mt-2 flex-wrap"
                      initial={{ opacity: 0 }}
                      animate={phase >= 3 ? { opacity: 1 } : { opacity: 0 }}
                      transition={{ duration: 0.4, delay: 0.1 + i * 0.06 }}
                    >
                      {p.tags.map(tag => (
                        <span
                          key={tag}
                          className="font-mono text-[0.6rem] tracking-widest uppercase rounded px-1.5 py-0.5"
                          style={{ background: `${p.color}1a`, color: p.color }}
                        >
                          {tag}
                        </span>
                      ))}
                    </motion.div>
                  </div>
                </div>

                <div className="flex flex-col items-end gap-2 shrink-0">
                  <span className="font-mono text-[0.75vw] tabular-nums" style={{ color: '#78350f' }}>
                    {p.year}
                  </span>
                  {/* Animated dot */}
                  <motion.div
                    className="rounded-full"
                    style={{ width: '0.7vw', height: '0.7vw', background: p.color }}
                    animate={shouldReduce ? {} : { scale: [1, 1.5, 1], opacity: [0.8, 1, 0.8] }}
                    transition={{ duration: 2.2, repeat: Infinity, delay: i * 0.5 }}
                  />
                </div>
              </div>
            </motion.article>
          ))}
        </div>
      </div>
    </motion.div>
  );
}
