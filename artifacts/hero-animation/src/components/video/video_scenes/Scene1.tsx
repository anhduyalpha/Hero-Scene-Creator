import { useState, useEffect } from 'react';
import { motion, useReducedMotion } from 'framer-motion';

const SPRING = { type: 'spring', stiffness: 280, damping: 24 } as const;
const EASE_OUT = { duration: 0.65, ease: [0.16, 1, 0.3, 1] } as const;

const roles = ['Creative Developer', 'UI/UX Designer', 'Motion Artist'];

export function Scene1() {
  const [phase, setPhase] = useState(0);
  const [roleIdx, setRoleIdx] = useState(0);
  const shouldReduce = useReducedMotion();

  useEffect(() => {
    const t1 = setTimeout(() => setPhase(1), 180);
    const t2 = setTimeout(() => setPhase(2), 780);
    const t3 = setTimeout(() => setPhase(3), 1700);
    const t4 = setTimeout(() => setPhase(4), 2700);
    return () => [t1,t2,t3,t4].forEach(clearTimeout);
  }, []);

  /* Role rotator */
  useEffect(() => {
    if (!shouldReduce) {
      const iv = setInterval(() => setRoleIdx(i => (i + 1) % roles.length), 2200);
      return () => clearInterval(iv);
    }
  }, [shouldReduce]);

  return (
    <motion.div
      className="absolute inset-0 flex items-center justify-center"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.12 }}
      role="region"
      aria-label="Hero introduction"
    >
      <div className="text-center" style={{ maxWidth: '72vw' }}>

        {/* ── Status badge ── */}
        <motion.div
          className="inline-flex items-center gap-2 rounded-full px-4 py-2 mb-8 glass-warm"
          initial={{ opacity: 0, y: 12, scale: 0.95 }}
          animate={phase >= 1 ? { opacity: 1, y: 0, scale: 1 } : { opacity: 0, y: 12, scale: 0.95 }}
          transition={EASE_OUT}
        >
          <motion.span
            className="rounded-full"
            style={{ width: 8, height: 8, background: '#22c55e', flexShrink: 0 }}
            animate={shouldReduce ? {} : { scale: [1, 1.4, 1], opacity: [1, 0.5, 1] }}
            transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
          />
          <span className="text-label text-[0.7rem]" style={{ color: '#fde68a' }}>
            Available for work · 2025
          </span>
        </motion.div>

        {/* ── Display headline ── */}
        <h1 className="text-display mb-2" style={{ fontSize: 'clamp(3.5rem, 9vw, 10rem)' }}>
          <span className="sr-only">Creative Developer</span>

          {/* Line 1 */}
          <div aria-hidden className="overflow-hidden leading-[0.95] mb-1">
            {'CREATIVE'.split('').map((char, i) => (
              <motion.span
                key={`a${i}`}
                style={{ display: 'inline-block', color: '#fffbeb' }}
                initial={{ y: '110%', opacity: 0 }}
                animate={phase >= 2 ? { y: 0, opacity: 1 } : { y: '110%', opacity: 0 }}
                transition={{ ...SPRING, delay: phase >= 2 ? i * 0.038 : 0 }}
              >
                {char}
              </motion.span>
            ))}
          </div>

          {/* Line 2 — gradient word */}
          <div aria-hidden className="overflow-hidden leading-[0.95]">
            {'DEVELOPER'.split('').map((char, i) => (
              <motion.span
                key={`b${i}`}
                style={{
                  display: 'inline-block',
                  background: `linear-gradient(135deg, #ea580c ${i * 10}%, #fbbf24 100%)`,
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                }}
                initial={{ y: '110%', opacity: 0 }}
                animate={phase >= 2 ? { y: 0, opacity: 1 } : { y: '110%', opacity: 0 }}
                transition={{ ...SPRING, delay: phase >= 2 ? (i + 9) * 0.038 : 0 }}
              >
                {char}
              </motion.span>
            ))}
          </div>
        </h1>

        {/* ── Animated role sub-label ── */}
        <motion.div
          className="overflow-hidden mb-8 mt-5"
          initial={{ opacity: 0 }}
          animate={phase >= 3 ? { opacity: 1 } : { opacity: 0 }}
          transition={EASE_OUT}
        >
          <div className="inline-flex items-center gap-3">
            <div className="h-px w-8" style={{ background: '#ea580c', flexShrink: 0 }} />
            <motion.span
              key={roleIdx}
              className="font-display font-semibold text-[1.5vw] tracking-wide"
              style={{ color: '#fbbf24' }}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
            >
              {roles[roleIdx]}
            </motion.span>
            <div className="h-px w-8" style={{ background: '#ea580c', flexShrink: 0 }} />
          </div>
        </motion.div>

        {/* ── Tagline ── */}
        <motion.p
          className="font-body font-light leading-relaxed mx-auto"
          style={{ fontSize: 'clamp(0.95rem, 1.6vw, 1.4rem)', color: '#fde68a', maxWidth: '42vw' }}
          initial={{ opacity: 0, y: 16 }}
          animate={phase >= 3 ? { opacity: 1, y: 0 } : { opacity: 0, y: 16 }}
          transition={{ ...EASE_OUT, delay: 0.1 }}
        >
          I craft immersive digital experiences that blend design, motion, and code — pixel-perfect, performant, and alive.
        </motion.p>

        {/* ── Scroll hint ── */}
        <motion.div
          className="mt-12 flex items-center justify-center gap-4"
          initial={{ opacity: 0 }}
          animate={phase >= 4 ? { opacity: 1 } : { opacity: 0 }}
          transition={{ ...EASE_OUT, delay: 0.15 }}
        >
          <motion.div
            className="rounded-full"
            style={{
              width: 20, height: 32,
              border: '1.5px solid rgba(217,119,6,0.5)',
              display: 'flex', alignItems: 'flex-start', justifyContent: 'center',
              padding: 5,
            }}
          >
            <motion.div
              className="rounded-full"
              style={{ width: 3, height: 7, background: '#d97706' }}
              animate={shouldReduce ? {} : { y: [0, 10, 0], opacity: [1, 0, 1] }}
              transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
            />
          </motion.div>
          <span className="text-label text-[0.68rem]" style={{ color: '#d97706' }}>
            Scroll to explore
          </span>
        </motion.div>
      </div>
    </motion.div>
  );
}
