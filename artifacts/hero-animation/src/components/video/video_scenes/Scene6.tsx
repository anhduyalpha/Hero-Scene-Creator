import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';

const EASE_OUT = [0.16, 1, 0.3, 1] as const;
const SPRING = { type: 'spring', stiffness: 280, damping: 24 } as const;

function useCounter(target: number, active: boolean, duration = 1000) {
  const [count, setCount] = useState(0);
  const raf = useRef<number>(0);
  useEffect(() => {
    if (!active) { setCount(0); return; }
    const start = performance.now();
    const tick = (now: number) => {
      const p = Math.min((now - start) / duration, 1);
      const ease = 1 - Math.pow(1 - p, 3);
      setCount(Math.round(ease * target));
      if (p < 1) raf.current = requestAnimationFrame(tick);
    };
    raf.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf.current);
  }, [active, target, duration]);
  return count;
}

const STEPS = [
  { label: 'Discovery',   sub: 'Research & audit',     color: '#ea580c' },
  { label: 'Design',      sub: 'Prototypes & systems',  color: '#d97706' },
  { label: 'Build',       sub: 'React · Framer · API',  color: '#fbbf24' },
  { label: 'Ship',        sub: 'Deliver & iterate',     color: '#ea580c' },
];

const METRICS = [
  { value: 38, suffix: '%', label: 'Conversion lift',  color: '#fbbf24' },
  { value: 98, suffix: '',  label: 'Lighthouse score', color: '#ea580c' },
  { value: 8,  suffix: 'x', label: 'Faster load',     color: '#d97706' },
];

/* Browser chrome bar heights for the mockup skeleton */
const BARS = [
  { w: '65%', h: 10, color: 'rgba(251,191,36,0.55)', y: 0 },
  { w: '45%', h: 7,  color: 'rgba(217,119,6,0.35)',  y: 18 },
  { w: '80%', h: 7,  color: 'rgba(217,119,6,0.25)',  y: 33 },
  { w: '30%', h: 7,  color: 'rgba(234,88,12,0.40)',  y: 48 },
  { w: '58%', h: 7,  color: 'rgba(217,119,6,0.25)',  y: 63 },
  { w: '70%', h: 7,  color: 'rgba(217,119,6,0.20)',  y: 78 },
];

export function Scene6() {
  const [phase, setPhase] = useState(0);

  useEffect(() => {
    const t1 = setTimeout(() => setPhase(1), 150);
    const t2 = setTimeout(() => setPhase(2), 700);
    const t3 = setTimeout(() => setPhase(3), 1300);
    const t4 = setTimeout(() => setPhase(4), 2200);
    const t5 = setTimeout(() => setPhase(5), 3100);
    return () => [t1, t2, t3, t4, t5].forEach(clearTimeout);
  }, []);

  const m0 = useCounter(METRICS[0].value, phase >= 5, 900);
  const m1 = useCounter(METRICS[1].value, phase >= 5, 900);
  const m2 = useCounter(METRICS[2].value, phase >= 5, 900);
  const metricCounts = [m0, m1, m2];

  return (
    <motion.div
      className="absolute inset-0 flex items-center justify-center"
      initial={{ opacity: 0, scale: 0.97 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 1.02 }}
      transition={{ duration: 0.12 }}
      role="region"
      aria-label="Case study spotlight"
    >
      {/* Ambient breathing glow — keeps frames alive throughout */}
      <motion.div
        className="absolute pointer-events-none rounded-full"
        style={{
          width: '28vw', height: '28vw',
          background: 'radial-gradient(circle, rgba(234,88,12,0.10) 0%, transparent 70%)',
          left: '-4vw', bottom: '-6vw',
        }}
        animate={{ scale: [0.9, 1.2, 0.9], opacity: [0.5, 1, 0.5] }}
        transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
      />

      <div
        className="relative"
        style={{ width: '82vw', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '3.5vw', alignItems: 'center' }}
      >
        {/* ════════════════════════════════════
            LEFT — Browser mockup
        ════════════════════════════════════ */}
        <motion.div
          initial={{ opacity: 0, x: -36 }}
          animate={phase >= 1 ? { opacity: 1, x: 0 } : { opacity: 0, x: -36 }}
          transition={{ duration: 0.7, ease: EASE_OUT }}
        >
          {/* Section label */}
          <motion.p
            className="text-label text-[0.72rem] mb-4"
            style={{ color: '#ea580c' }}
            initial={{ opacity: 0 }}
            animate={phase >= 1 ? { opacity: 1 } : { opacity: 0 }}
            transition={{ duration: 0.4 }}
          >
            ✦ Case Study
          </motion.p>

          <motion.h2
            className="text-display mb-6"
            style={{ fontSize: 'clamp(1.8rem, 3.8vw, 4rem)', color: '#fffbeb', lineHeight: 1.05 }}
            initial={{ opacity: 0, y: 20 }}
            animate={phase >= 1 ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.65, ease: EASE_OUT }}
          >
            Brand Identity{' '}
            <span style={{
              background: 'linear-gradient(135deg, #ea580c, #fbbf24)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}>
              System
            </span>
          </motion.h2>

          {/* Browser mockup frame */}
          <motion.div
            className="rounded-xl overflow-hidden"
            style={{
              border: '1px solid rgba(217,119,6,0.25)',
              background: 'rgba(13,5,1,0.7)',
              backdropFilter: 'blur(12px)',
              boxShadow: '0 0 60px rgba(217,119,6,0.12), 0 24px 48px rgba(0,0,0,0.5)',
            }}
            initial={{ opacity: 0, y: 24, scale: 0.96 }}
            animate={phase >= 2 ? { opacity: 1, y: 0, scale: 1 } : { opacity: 0, y: 24, scale: 0.96 }}
            transition={{ duration: 0.65, ease: EASE_OUT }}
          >
            {/* Chrome bar */}
            <div
              style={{
                background: 'rgba(255,255,255,0.04)',
                borderBottom: '1px solid rgba(217,119,6,0.15)',
                padding: '0.7vw 1.1vw',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5vw',
              }}
            >
              {['#ea580c','#d97706','#22c55e'].map((c, i) => (
                <div key={i} className="rounded-full" style={{ width: '0.6vw', height: '0.6vw', background: c, opacity: 0.8 }} />
              ))}
              {/* URL bar */}
              <div
                className="rounded"
                style={{
                  flex: 1,
                  marginLeft: '0.8vw',
                  height: '1.4vw',
                  background: 'rgba(255,255,255,0.06)',
                  border: '1px solid rgba(217,119,6,0.12)',
                  display: 'flex',
                  alignItems: 'center',
                  paddingLeft: '0.6vw',
                }}
              >
                <span style={{ fontSize: '0.55vw', color: 'rgba(253,230,138,0.45)', fontFamily: 'monospace', letterSpacing: '0.04em' }}>
                  brandco.studio / identity
                </span>
              </div>
            </div>

            {/* Page content skeleton */}
            <div style={{ padding: '1.4vw 1.6vw', minHeight: '14vw', position: 'relative' }}>
              {/* Hero colour block */}
              <motion.div
                style={{
                  transformOrigin: 'left',
                  height: '5vw',
                  borderRadius: '0.4vw',
                  background: 'linear-gradient(135deg, #1a0a03 0%, #3b1408 50%, #1a0a03 100%)',
                  marginBottom: '1.1vw',
                  overflow: 'hidden',
                  position: 'relative',
                }}
                initial={{ scaleX: 0 }}
                animate={phase >= 3 ? { scaleX: 1 } : { scaleX: 0 }}
                transition={{ duration: 0.55, ease: EASE_OUT }}
              >
                {/* Logo mark inside hero */}
                <motion.div
                  className="absolute"
                  style={{
                    left: '1.2vw', top: '50%', transform: 'translateY(-50%)',
                    width: '2vw', height: '2vw',
                    background: 'linear-gradient(135deg, #fbbf24, #ea580c)',
                    clipPath: 'polygon(50% 0%, 100% 38%, 82% 100%, 18% 100%, 0% 38%)',
                  }}
                  initial={{ opacity: 0, scale: 0 }}
                  animate={phase >= 3 ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0 }}
                  transition={{ ...SPRING, delay: 0.3 }}
                />
                {/* Scanning shimmer across hero */}
                <motion.div
                  className="absolute inset-y-0"
                  style={{ width: '25%', background: 'linear-gradient(90deg, transparent, rgba(251,191,36,0.08), transparent)' }}
                  animate={phase >= 3 ? { left: ['-25%', '115%'] } : { left: '-25%' }}
                  transition={{ duration: 2.4, repeat: Infinity, ease: 'linear', delay: 0.5 }}
                />
              </motion.div>

              {/* Content bars */}
              {BARS.map((bar, i) => (
                <motion.div
                  key={i}
                  className="absolute rounded-full"
                  style={{
                    left: '1.6vw',
                    top: `calc(7vw + ${bar.y}px)`,
                    height: bar.h,
                    background: bar.color,
                    transformOrigin: 'left',
                    scaleX: 0,
                    width: bar.w,
                  }}
                  animate={phase >= 4 ? { scaleX: 1 } : { scaleX: 0 }}
                  transition={{ duration: 0.45, ease: EASE_OUT, delay: phase >= 4 ? i * 0.06 : 0 }}
                />
              ))}

              {/* Colour palette row */}
              <motion.div
                className="absolute flex gap-1"
                style={{ right: '1.6vw', bottom: '1.2vw' }}
                initial={{ opacity: 0 }}
                animate={phase >= 4 ? { opacity: 1 } : { opacity: 0 }}
                transition={{ duration: 0.4, delay: 0.4 }}
              >
                {['#1a0a03','#7c2d12','#ea580c','#fbbf24','#fef3c7'].map((c, i) => (
                  <motion.div
                    key={c}
                    className="rounded"
                    style={{ width: '1.4vw', height: '1.4vw', background: c, border: '1px solid rgba(255,255,255,0.12)' }}
                    initial={{ scale: 0, opacity: 0 }}
                    animate={phase >= 4 ? { scale: 1, opacity: 1 } : { scale: 0, opacity: 0 }}
                    transition={{ ...SPRING, delay: phase >= 4 ? 0.4 + i * 0.07 : 0 }}
                  />
                ))}
              </motion.div>
            </div>
          </motion.div>
        </motion.div>

        {/* ════════════════════════════════════
            RIGHT — Process timeline + Metrics
        ════════════════════════════════════ */}
        <div>
          {/* Process timeline */}
          <motion.p
            className="text-label text-[0.72rem] mb-5"
            style={{ color: '#ea580c' }}
            initial={{ opacity: 0 }}
            animate={phase >= 2 ? { opacity: 1 } : { opacity: 0 }}
            transition={{ duration: 0.4 }}
          >
            ✦ Process
          </motion.p>

          <div className="relative" style={{ marginBottom: '2.8vw' }}>
            {STEPS.map((step, i) => (
              <motion.div
                key={step.label}
                className="flex items-start gap-4 relative"
                style={{ marginBottom: i < STEPS.length - 1 ? '1.5vw' : 0 }}
                initial={{ opacity: 0, x: 28 }}
                animate={phase >= 3 ? { opacity: 1, x: 0 } : { opacity: 0, x: 28 }}
                transition={{ duration: 0.5, ease: EASE_OUT, delay: phase >= 3 ? i * 0.15 : 0 }}
              >
                {/* Node + connector line */}
                <div className="flex flex-col items-center shrink-0" style={{ width: '1.6vw' }}>
                  <motion.div
                    className="rounded-full"
                    style={{
                      width: '0.9vw',
                      height: '0.9vw',
                      background: step.color,
                      boxShadow: `0 0 10px 3px ${step.color}55`,
                      flexShrink: 0,
                    }}
                    initial={{ scale: 0 }}
                    animate={phase >= 3 ? { scale: 1 } : { scale: 0 }}
                    transition={{ ...SPRING, delay: phase >= 3 ? i * 0.15 + 0.1 : 0 }}
                  />
                  {/* Connector line */}
                  {i < STEPS.length - 1 && (
                    <motion.div
                      style={{
                        width: 1,
                        background: `linear-gradient(180deg, ${step.color}66, ${STEPS[i+1].color}33)`,
                        transformOrigin: 'top',
                        marginTop: 4,
                        height: '1.5vw',
                      }}
                      initial={{ scaleY: 0 }}
                      animate={phase >= 3 ? { scaleY: 1 } : { scaleY: 0 }}
                      transition={{ duration: 0.4, ease: EASE_OUT, delay: phase >= 3 ? i * 0.15 + 0.25 : 0 }}
                    />
                  )}
                </div>

                <div style={{ paddingTop: '0.05vw' }}>
                  <p
                    className="font-display font-bold"
                    style={{ fontSize: 'clamp(0.85rem, 1.3vw, 1.2rem)', color: '#fffbeb', letterSpacing: '-0.01em' }}
                  >
                    {step.label}
                  </p>
                  <p
                    className="font-body"
                    style={{ fontSize: '0.8vw', color: '#fde68a', opacity: 0.6, marginTop: 2 }}
                  >
                    {step.sub}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Divider */}
          <motion.div
            style={{ height: 1, background: 'linear-gradient(90deg, rgba(217,119,6,0.3), transparent)', marginBottom: '2vw', transformOrigin: 'left' }}
            initial={{ scaleX: 0 }}
            animate={phase >= 4 ? { scaleX: 1 } : { scaleX: 0 }}
            transition={{ duration: 0.6, ease: EASE_OUT }}
          />

          {/* Metrics row */}
          <motion.p
            className="text-label text-[0.72rem] mb-4"
            style={{ color: '#ea580c' }}
            initial={{ opacity: 0 }}
            animate={phase >= 4 ? { opacity: 1 } : { opacity: 0 }}
            transition={{ duration: 0.4 }}
          >
            ✦ Outcomes
          </motion.p>

          <div className="flex" style={{ gap: '1.4vw' }}>
            {METRICS.map((m, i) => (
              <motion.div
                key={m.label}
                className="glass rounded-2xl flex flex-col justify-end"
                style={{ padding: '1.2vw', flex: 1 }}
                initial={{ opacity: 0, y: 18 }}
                animate={phase >= 5 ? { opacity: 1, y: 0 } : { opacity: 0, y: 18 }}
                transition={{ ...SPRING, delay: phase >= 5 ? i * 0.1 : 0 }}
              >
                {/* Soft glow */}
                <div
                  className="absolute -top-2 -right-2 rounded-full pointer-events-none"
                  style={{
                    width: '5vw',
                    height: '5vw',
                    background: `radial-gradient(circle, ${m.color}25 0%, transparent 70%)`,
                  }}
                />
                <p
                  className="font-display font-black tabular-nums leading-none mb-1"
                  style={{ fontSize: 'clamp(1.5rem, 3vw, 3.2rem)', color: m.color }}
                >
                  +{metricCounts[i]}{m.suffix}
                </p>
                <p className="text-label" style={{ fontSize: '0.62rem', color: '#d97706' }}>
                  {m.label}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
}
