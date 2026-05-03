import { useState, useEffect, useRef } from 'react';
import { motion, useReducedMotion } from 'framer-motion';

const EASE_OUT = [0.16, 1, 0.3, 1] as const;
const SPRING = { type: 'spring', stiffness: 260, damping: 22 } as const;

function useCounter(target: number, active: boolean, duration = 1200) {
  const [count, setCount] = useState(0);
  const raf = useRef<number>(0);

  useEffect(() => {
    if (!active) { setCount(0); return; }
    const start = performance.now();
    const tick = (now: number) => {
      const p = Math.min((now - start) / duration, 1);
      const ease = 1 - Math.pow(1 - p, 4);
      setCount(Math.round(ease * target));
      if (p < 1) raf.current = requestAnimationFrame(tick);
    };
    raf.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf.current);
  }, [active, target, duration]);

  return count;
}

/* Bento stat cell */
function StatCell({ value, suffix, label, color, active, delay }: {
  value: number; suffix: string; label: string; color: string; active: boolean; delay: number;
}) {
  const count = useCounter(value, active, 1100);
  const shouldReduce = useReducedMotion();
  const display = shouldReduce ? value : count;

  return (
    <motion.div
      className="glass rounded-2xl relative overflow-hidden flex flex-col justify-end"
      style={{ padding: '1.6vw', minHeight: '12vw' }}
      initial={{ opacity: 0, y: 24 }}
      animate={active ? { opacity: 1, y: 0 } : { opacity: 0, y: 24 }}
      transition={{ ...SPRING, delay }}
    >
      {/* Soft glow */}
      <div className="absolute -top-4 -right-4 rounded-full pointer-events-none" style={{
        width: '8vw', height: '8vw',
        background: `radial-gradient(circle, ${color}28 0%, transparent 70%)`,
      }} />

      <p
        className="font-display font-black tabular-nums leading-none mb-1"
        style={{ fontSize: 'clamp(2rem, 4.5vw, 5rem)', color }}
        aria-label={`${display}${suffix} ${label}`}
      >
        {display}{suffix}
      </p>
      <p className="text-label text-[0.65rem]" style={{ color: '#d97706' }}>
        {label}
      </p>
    </motion.div>
  );
}

const stats = [
  { value: 50, suffix: '+', label: 'Projects delivered', color: '#ea580c' },
  { value: 8,  suffix: '+', label: 'Years of experience', color: '#d97706' },
  { value: 30, suffix: '+', label: 'Happy clients',       color: '#fbbf24' },
  { value: 98, suffix: '%', label: 'Client satisfaction', color: '#ea580c' },
];

const services = ['Product Design', 'Web Development', 'Motion Design', 'Brand Identity'];

export function Scene4() {
  const [phase, setPhase] = useState(0);

  useEffect(() => {
    const t1 = setTimeout(() => setPhase(1), 180);
    const t2 = setTimeout(() => setPhase(2), 850);
    const t3 = setTimeout(() => setPhase(3), 1650);
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
      aria-label="About me"
    >
      <div style={{ maxWidth: '72vw', width: '100%' }}>

        {/* ── Top: label + headline + body ── */}
        <div className="mb-8">
          <motion.p
            className="text-label text-[0.72rem] mb-3"
            style={{ color: '#ea580c' }}
            initial={{ opacity: 0 }}
            animate={phase >= 1 ? { opacity: 1 } : { opacity: 0 }}
            transition={{ duration: 0.5 }}
          >
            ✦ About me
          </motion.p>

          <motion.h2
            className="text-display mb-4"
            style={{ fontSize: 'clamp(2rem, 4.8vw, 5rem)', color: '#fffbeb' }}
            initial={{ opacity: 0, y: 22 }}
            animate={phase >= 1 ? { opacity: 1, y: 0 } : { opacity: 0, y: 22 }}
            transition={{ duration: 0.65, ease: EASE_OUT }}
          >
            I turn ideas into{' '}
            <span style={{
              background: 'linear-gradient(135deg, #ea580c, #fbbf24)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}>
              living products.
            </span>
          </motion.h2>

          <motion.p
            className="font-body font-light leading-relaxed"
            style={{ fontSize: 'clamp(0.9rem, 1.4vw, 1.25rem)', color: '#fde68a', maxWidth: '48vw', opacity: 0.85 }}
            initial={{ opacity: 0, y: 14 }}
            animate={phase >= 2 ? { opacity: 0.85, y: 0 } : { opacity: 0, y: 14 }}
            transition={{ duration: 0.6, ease: EASE_OUT }}
          >
            From concept to launch I obsess over every pixel, interaction, and performance metric — building products people genuinely love to use.
          </motion.p>
        </div>

        {/* ── Ambient drift — keeps per-frame pixels changing after counters settle ── */}
        <motion.div
          className="absolute pointer-events-none rounded-full"
          style={{
            width: '22vw',
            height: '22vw',
            background: 'radial-gradient(circle, rgba(234,88,12,0.09) 0%, transparent 70%)',
            right: '-6vw',
            bottom: '-4vw',
          }}
          initial={{ scale: 0.85, opacity: 0 }}
          animate={phase >= 2 ? { scale: [0.85, 1.2, 0.85], opacity: [0.5, 1, 0.5] } : { scale: 0.85, opacity: 0 }}
          transition={{ duration: 3.8, repeat: Infinity, ease: 'easeInOut' }}
        />

        {/* ── Bento grid: 2×2 stats + services column ── */}
        <div className="grid" style={{ gridTemplateColumns: '1fr 1fr 1fr 1fr 1.4fr', gap: '0.8vw' }}>
          {stats.map((s, i) => (
            <StatCell
              key={s.label}
              value={s.value}
              suffix={s.suffix}
              label={s.label}
              color={s.color}
              active={phase >= 3}
              delay={phase >= 3 ? i * 0.10 : 0}
            />
          ))}

          {/* Services cell */}
          <motion.div
            className="glass rounded-2xl flex flex-col justify-between"
            style={{ padding: '1.6vw', gridRow: '1', gridColumn: '5' }}
            initial={{ opacity: 0, x: 30 }}
            animate={phase >= 3 ? { opacity: 1, x: 0 } : { opacity: 0, x: 30 }}
            transition={{ ...SPRING, delay: phase >= 3 ? 0.35 : 0 }}
          >
            <p className="text-label text-[0.65rem] mb-4" style={{ color: '#78350f' }}>Services</p>
            <ul className="flex flex-col gap-2.5" role="list">
              {services.map((svc, i) => (
                <motion.li
                  key={svc}
                  className="flex items-center gap-2"
                  initial={{ opacity: 0, x: 12 }}
                  animate={phase >= 3 ? { opacity: 1, x: 0 } : { opacity: 0, x: 12 }}
                  transition={{ duration: 0.4, ease: EASE_OUT, delay: phase >= 3 ? 0.4 + i * 0.07 : 0 }}
                >
                  <span className="rounded-full shrink-0" style={{ width: 5, height: 5, background: '#ea580c' }} />
                  <span className="font-body font-medium" style={{ fontSize: '0.9vw', color: '#fef3c7' }}>
                    {svc}
                  </span>
                </motion.li>
              ))}
            </ul>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
}
