import { useState, useEffect } from 'react';
import { motion, useReducedMotion } from 'framer-motion';

const EASE_OUT = [0.16, 1, 0.3, 1] as const;
const SPRING = { type: 'spring', stiffness: 300, damping: 26 } as const;

const skills = [
  { label: 'UI / UX Design',      pct: 95, color: '#ea580c', tag: 'Design'    },
  { label: 'React & TypeScript',  pct: 92, color: '#d97706', tag: 'Frontend'  },
  { label: 'Motion Design',       pct: 88, color: '#fbbf24', tag: 'Animation' },
  { label: 'Three.js / WebGL',    pct: 80, color: '#ea580c', tag: '3D'        },
  { label: 'Node.js / APIs',      pct: 85, color: '#d97706', tag: 'Backend'   },
];

const toolTags = ['Figma', 'Framer', 'React', 'GSAP', 'Tailwind', 'Vite', 'Supabase'];

export function Scene2() {
  const [phase, setPhase] = useState(0);
  const shouldReduce = useReducedMotion();

  useEffect(() => {
    const t1 = setTimeout(() => setPhase(1), 180);
    const t2 = setTimeout(() => setPhase(2), 650);
    const t3 = setTimeout(() => setPhase(3), 1050);
    const t4 = setTimeout(() => setPhase(4), 1700);
    return () => [t1, t2, t3, t4].forEach(clearTimeout);
  }, []);

  return (
    <motion.div
      className="absolute inset-0 flex items-center justify-start"
      style={{ paddingLeft: '9vw' }}
      initial={{ opacity: 0, x: 48 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -32 }}
      transition={{ duration: 0.12 }}
      role="region"
      aria-label="Skills and expertise"
    >
      <div style={{ maxWidth: '52vw', width: '100%' }}>

        {/* ── Section label ── */}
        <motion.p
          className="text-label text-[0.72rem] mb-3"
          style={{ color: '#ea580c' }}
          initial={{ opacity: 0, x: -16 }}
          animate={phase >= 1 ? { opacity: 1, x: 0 } : { opacity: 0, x: -16 }}
          transition={{ duration: 0.5, ease: EASE_OUT }}
        >
          ✦ Capabilities
        </motion.p>

        {/* ── Heading ── */}
        <motion.h2
          className="text-display mb-9"
          style={{ fontSize: 'clamp(2.5rem, 6vw, 6rem)', color: '#fffbeb' }}
          initial={{ opacity: 0, y: 24 }}
          animate={phase >= 1 ? { opacity: 1, y: 0 } : { opacity: 0, y: 24 }}
          transition={{ duration: 0.65, ease: EASE_OUT }}
        >
          Skills &{' '}
          <span style={{
            background: 'linear-gradient(135deg, #ea580c, #fbbf24)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
          }}>
            Craft
          </span>
        </motion.h2>

        {/* ── Skill bars — scaleX transform (no width animation) ── */}
        <div className="flex flex-col" style={{ gap: '1.4vw' }} role="list">
          {skills.map((skill, i) => (
            <motion.div
              key={skill.label}
              role="listitem"
              initial={{ opacity: 0, x: -32 }}
              animate={phase >= 2 ? { opacity: 1, x: 0 } : { opacity: 0, x: -32 }}
              transition={{ duration: 0.5, ease: EASE_OUT, delay: phase >= 2 ? i * 0.07 : 0 }}
            >
              <div className="flex justify-between items-center mb-1.5">
                <div className="flex items-center gap-2.5">
                  <span
                    className="rounded-full inline-block"
                    style={{ width: 6, height: 6, background: skill.color, flexShrink: 0 }}
                  />
                  <span className="font-body font-medium" style={{ fontSize: '1.05vw', color: '#fef3c7', letterSpacing: '0.01em' }}>
                    {skill.label}
                  </span>
                  <span
                    className="rounded text-[0.62rem] font-mono px-1.5 py-0.5 tracking-widest uppercase"
                    style={{ background: `${skill.color}22`, color: skill.color }}
                  >
                    {skill.tag}
                  </span>
                </div>
                <motion.span
                  className="font-mono font-semibold tabular-nums"
                  style={{ fontSize: '0.9vw', color: skill.color }}
                  initial={{ opacity: 0 }}
                  animate={phase >= 3 ? { opacity: 1 } : { opacity: 0 }}
                  transition={{ duration: 0.3, delay: phase >= 3 ? i * 0.06 : 0 }}
                  aria-label={`${skill.pct} percent`}
                >
                  {skill.pct}%
                </motion.span>
              </div>

              {/* Bar — uses scaleX on transform, not width */}
              <div
                className="w-full rounded-full overflow-hidden relative"
                style={{ height: 5, background: 'rgba(255,255,255,0.08)' }}
                role="meter"
                aria-valuenow={skill.pct}
                aria-valuemin={0}
                aria-valuemax={100}
                aria-label={skill.label}
              >
                <motion.div
                  className="absolute inset-y-0 left-0 w-full rounded-full origin-left"
                  style={{
                    background: `linear-gradient(90deg, ${skill.color}, #fbbf24)`,
                    scaleX: 0,
                  }}
                  animate={phase >= 3 ? { scaleX: skill.pct / 100 } : { scaleX: 0 }}
                  transition={{
                    duration: shouldReduce ? 0 : 0.9,
                    ease: EASE_OUT,
                    delay: phase >= 3 ? i * 0.08 : 0,
                  }}
                />
                {/* Shimmer on bar */}
                {phase >= 3 && !shouldReduce && (
                  <motion.div
                    className="absolute inset-y-0 rounded-full pointer-events-none"
                    style={{
                      width: '30%',
                      background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.25), transparent)',
                      left: '-30%',
                    }}
                    animate={{ left: ['−30%', `${skill.pct + 10}%`] }}
                    transition={{ duration: 1.2, ease: 'easeOut', delay: 0.9 + i * 0.08 }}
                  />
                )}
              </div>
            </motion.div>
          ))}
        </div>

        {/* ── Tool tags ── */}
        <motion.div
          className="flex flex-wrap gap-2 mt-7"
          initial={{ opacity: 0 }}
          animate={phase >= 4 ? { opacity: 1 } : { opacity: 0 }}
          transition={{ duration: 0.5 }}
          aria-label="Tools I use"
        >
          {toolTags.map((tag, i) => (
            <motion.span
              key={tag}
              className="glass rounded-full font-mono text-[0.68rem] tracking-widest uppercase px-3 py-1"
              style={{ color: '#d97706' }}
              initial={{ opacity: 0, scale: 0.85 }}
              animate={phase >= 4 ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.85 }}
              transition={{ ...SPRING, delay: phase >= 4 ? i * 0.05 : 0 }}
            >
              {tag}
            </motion.span>
          ))}
        </motion.div>

        {/* ── Ambient pulse — keeps per-frame pixels changing through the scene tail ── */}
        <motion.div
          className="absolute pointer-events-none rounded-full"
          style={{
            right: '-4vw',
            top: '10%',
            width: '18vw',
            height: '18vw',
            background: 'radial-gradient(circle, rgba(217,119,6,0.12) 0%, transparent 70%)',
          }}
          initial={{ scale: 0.9, opacity: 0 }}
          animate={phase >= 2 ? { scale: [0.9, 1.15, 0.9], opacity: [0.6, 1, 0.6] } : { scale: 0.9, opacity: 0 }}
          transition={{ duration: 3.2, repeat: Infinity, ease: 'easeInOut', delay: 0.3 }}
        />
        {/* Scanning line — sweeps vertically to add continuous motion */}
        <motion.div
          className="absolute pointer-events-none"
          style={{
            left: 0,
            width: '100%',
            height: 1,
            background: 'linear-gradient(90deg, transparent, rgba(251,191,36,0.18), transparent)',
          }}
          initial={{ top: '0%', opacity: 0 }}
          animate={phase >= 3 ? { top: ['10%', '90%', '10%'], opacity: [0, 0.8, 0] } : { top: '0%', opacity: 0 }}
          transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut', delay: 0.5 }}
        />
      </div>
    </motion.div>
  );
}
