import { useState, useEffect } from 'react';
import { motion, useReducedMotion } from 'framer-motion';

const EASE_OUT = [0.16, 1, 0.3, 1] as const;
const SPRING = { type: 'spring', stiffness: 300, damping: 26 } as const;

const socials = [
  { name: 'GitHub',   color: '#fffbeb' },
  { name: 'Dribbble', color: '#ea4c89' },
  { name: 'LinkedIn', color: '#0a66c2' },
  { name: 'Twitter',  color: '#1d9bf0' },
];

export function Scene5() {
  const [phase, setPhase] = useState(0);
  const shouldReduce = useReducedMotion();

  useEffect(() => {
    const t1 = setTimeout(() => setPhase(1), 200);
    const t2 = setTimeout(() => setPhase(2), 950);
    const t3 = setTimeout(() => setPhase(3), 1750);
    return () => [t1, t2, t3].forEach(clearTimeout);
  }, []);

  return (
    <motion.div
      className="absolute inset-0 flex items-center justify-center"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.12 }}
      role="region"
      aria-label="Contact"
    >
      <div className="text-center" style={{ maxWidth: '68vw' }}>

        {/* ── Pre-heading label ── */}
        <motion.p
          className="text-label text-[0.72rem] mb-6"
          style={{ color: '#d97706' }}
          initial={{ opacity: 0, y: 10 }}
          animate={phase >= 1 ? { opacity: 1, y: 0 } : { opacity: 0, y: 10 }}
          transition={{ duration: 0.5, ease: EASE_OUT }}
        >
          ✦ Let's build something great together
        </motion.p>

        {/* ── Main headline — character spring entrance ── */}
        <h2 className="text-display mb-10" style={{ fontSize: 'clamp(3rem, 8.5vw, 9rem)' }} aria-label="Let's Connect">
          {["LET'S", 'CONNECT'].map((word, wi) => (
            <div key={word} className="overflow-hidden leading-[0.9]" aria-hidden>
              {word.split('').map((char, ci) => (
                <motion.span
                  key={`${wi}-${ci}`}
                  style={{
                    display: 'inline-block',
                    color: wi === 1
                      ? `hsl(${30 + ci * 8}, 90%, ${55 + ci * 3}%)`
                      : '#fffbeb',
                  }}
                  initial={{ y: '110%', opacity: 0 }}
                  animate={phase >= 1 ? { y: 0, opacity: 1 } : { y: '110%', opacity: 0 }}
                  transition={{ ...SPRING, delay: phase >= 1 ? (wi * word.length + ci) * 0.036 : 0 }}
                >
                  {char === ' ' ? '\u00a0' : char}
                </motion.span>
              ))}
            </div>
          ))}
        </h2>

        {/* ── Glass email card ── */}
        <motion.div
          className="glass-warm rounded-2xl inline-flex items-center gap-5 mb-9 relative overflow-hidden shimmer"
          style={{ padding: '1.2vw 2.4vw' }}
          initial={{ opacity: 0, scale: 0.94, y: 16 }}
          animate={phase >= 2 ? { opacity: 1, scale: 1, y: 0 } : { opacity: 0, scale: 0.94, y: 16 }}
          transition={{ duration: 0.6, ease: EASE_OUT }}
        >
          {/* Pulse icon */}
          <div className="relative shrink-0">
            <motion.div
              className="rounded-full"
              style={{ width: '0.8vw', height: '0.8vw', background: '#ea580c' }}
              animate={shouldReduce ? {} : { scale: [1, 2, 1], opacity: [1, 0, 1] }}
              transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
            />
            <motion.div
              className="rounded-full absolute inset-0"
              style={{ border: '1px solid #ea580c', opacity: 0 }}
              animate={shouldReduce ? {} : { scale: [1, 2.5], opacity: [0.6, 0] }}
              transition={{ duration: 2, repeat: Infinity, ease: 'easeOut' }}
            />
          </div>

          <span
            className="font-mono tracking-wider"
            style={{ fontSize: 'clamp(0.85rem, 1.25vw, 1.2rem)', color: '#fde68a', letterSpacing: '0.05em' }}
          >
            hello@yourportfolio.com
          </span>

          {/* Divider */}
          <div className="self-stretch w-px" style={{ background: 'rgba(234,88,12,0.3)' }} />

          <span className="text-label text-[0.62rem]" style={{ color: '#d97706' }}>
            Open to opportunities
          </span>
        </motion.div>

        {/* ── Decorative divider ── */}
        <motion.div
          className="flex items-center justify-center gap-4 mb-7"
          initial={{ opacity: 0 }}
          animate={phase >= 2 ? { opacity: 1 } : { opacity: 0 }}
          transition={{ duration: 0.5, delay: 0.15 }}
        >
          <div className="h-px flex-1" style={{ maxWidth: '9vw', background: 'linear-gradient(90deg, transparent, rgba(217,119,6,0.5))' }} />
          <span className="font-mono text-[0.65rem] tracking-widest" style={{ color: '#78350f' }}>FIND ME ON</span>
          <div className="h-px flex-1" style={{ maxWidth: '9vw', background: 'linear-gradient(90deg, rgba(217,119,6,0.5), transparent)' }} />
        </motion.div>

        {/* ── Social pills ── */}
        <motion.div
          className="flex justify-center flex-wrap gap-3"
          initial={{ opacity: 0 }}
          animate={phase >= 3 ? { opacity: 1 } : { opacity: 0 }}
          transition={{ duration: 0.4 }}
          role="list"
          aria-label="Social profiles"
        >
          {socials.map((s, i) => (
            <motion.span
              key={s.name}
              role="listitem"
              className="glass rounded-full font-mono tracking-widest uppercase"
              style={{
                fontSize: '0.7rem',
                padding: '0.6vw 1.4vw',
                color: '#fbbf24',
                borderColor: `${s.color}30`,
              }}
              initial={{ opacity: 0, scale: 0.82, y: 10 }}
              animate={phase >= 3 ? { opacity: 1, scale: 1, y: 0 } : { opacity: 0, scale: 0.82, y: 10 }}
              transition={{ ...SPRING, delay: phase >= 3 ? i * 0.09 : 0 }}
            >
              {s.name}
            </motion.span>
          ))}
        </motion.div>
      </div>
    </motion.div>
  );
}
