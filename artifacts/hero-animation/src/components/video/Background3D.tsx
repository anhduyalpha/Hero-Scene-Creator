import { motion, useReducedMotion } from 'framer-motion';

/* Per-scene configs — uses translate (transform) not left/top for perf */
const scenes = [
  {
    orb1:  { x: '30vw',  y: '-5vh',  scale: 1.15, opacity: 0.72 },
    orb2:  { x: '-8vw',  y: '30vh',  scale: 0.90, opacity: 0.55 },
    ring:  { x: '68vw',  y: '58vh',  rotateZ: 0 },
    gem:   { x: '14vw',  y: '12vh' },
    aurora: 'radial-gradient(ellipse 70% 50% at 75% 55%, rgba(234,88,12,0.22) 0%, transparent 70%), radial-gradient(ellipse 50% 40% at 15% 30%, rgba(217,119,6,0.14) 0%, transparent 60%)',
  },
  {
    orb1:  { x: '-10vw', y: '10vh',  scale: 1.40, opacity: 0.60 },
    orb2:  { x: '62vw',  y: '20vh',  scale: 1.10, opacity: 0.50 },
    ring:  { x: '12vw',  y: '62vh',  rotateZ: 55 },
    gem:   { x: '72vw',  y: '8vh'  },
    aurora: 'radial-gradient(ellipse 60% 60% at 20% 65%, rgba(234,88,12,0.18) 0%, transparent 65%), radial-gradient(ellipse 40% 50% at 80% 20%, rgba(120,53,15,0.22) 0%, transparent 60%)',
  },
  {
    orb1:  { x: '42vw',  y: '55vh',  scale: 0.85, opacity: 0.80 },
    orb2:  { x: '78vw',  y: '8vh',   scale: 0.72, opacity: 0.60 },
    ring:  { x: '52vw',  y: '12vh',  rotateZ: 110 },
    gem:   { x: '4vw',   y: '44vh' },
    aurora: 'radial-gradient(ellipse 80% 50% at 60% 70%, rgba(217,119,6,0.16) 0%, transparent 65%), radial-gradient(ellipse 45% 35% at 90% 10%, rgba(234,88,12,0.12) 0%, transparent 55%)',
  },
  {
    orb1:  { x: '20vw',  y: '28vh',  scale: 1.25, opacity: 0.50 },
    orb2:  { x: '55vw',  y: '62vh',  scale: 1.00, opacity: 0.65 },
    ring:  { x: '8vw',   y: '18vh',  rotateZ: 165 },
    gem:   { x: '76vw',  y: '52vh' },
    aurora: 'radial-gradient(ellipse 55% 55% at 35% 45%, rgba(234,88,12,0.20) 0%, transparent 60%), radial-gradient(ellipse 50% 40% at 80% 75%, rgba(251,191,36,0.10) 0%, transparent 55%)',
  },
  {
    orb1:  { x: '50vw',  y: '-8vh',  scale: 1.30, opacity: 0.68 },
    orb2:  { x: '-5vw',  y: '55vh',  scale: 0.85, opacity: 0.52 },
    ring:  { x: '74vw',  y: '36vh',  rotateZ: 220 },
    gem:   { x: '30vw',  y: '68vh' },
    aurora: 'radial-gradient(ellipse 70% 55% at 55% 25%, rgba(217,119,6,0.18) 0%, transparent 65%), radial-gradient(ellipse 40% 45% at 10% 70%, rgba(234,88,12,0.14) 0%, transparent 60%)',
  },
  /* ── Scene 6: Case study spotlight ── */
  {
    orb1:  { x: '58vw',  y: '12vh',  scale: 0.78, opacity: 0.55 },
    orb2:  { x: '-12vw', y: '42vh',  scale: 1.18, opacity: 0.48 },
    ring:  { x: '38vw',  y: '64vh',  rotateZ: 290 },
    gem:   { x: '86vw',  y: '24vh' },
    aurora: 'radial-gradient(ellipse 55% 60% at 72% 38%, rgba(251,191,36,0.14) 0%, transparent 62%), radial-gradient(ellipse 45% 40% at 18% 72%, rgba(234,88,12,0.18) 0%, transparent 58%)',
  },
];

/* Floating particles */
const particles = [
  { tx: '42vw', ty: '22vh', size: '3.5vw', delay: 0.0, dur: 3.8 },
  { tx: '78vw', ty: '48vh', size: '2.2vw', delay: 0.9, dur: 4.2 },
  { tx: '22vw', ty: '74vh', size: '2.8vw', delay: 1.7, dur: 3.6 },
  { tx: '62vw', ty: '78vh', size: '1.8vw', delay: 2.5, dur: 4.5 },
  { tx: '88vw', ty: '18vh', size: '1.5vw', delay: 3.2, dur: 3.2 },
];

const TRANS = { duration: 2.2, ease: [0.16, 1, 0.3, 1] as [number,number,number,number] };

export function Background3D({ currentScene }: { currentScene: number }) {
  const cfg = scenes[Math.abs(currentScene) % scenes.length];
  const shouldReduce = useReducedMotion();

  return (
    <div className="absolute inset-0 overflow-hidden" style={{ perspective: '1200px' }}>

      {/* ── Deep base gradient ── */}
      <div className="absolute inset-0" style={{
        background: 'radial-gradient(ellipse 80% 70% at 40% 50%, #2a1105 0%, #110602 45%, #0d0501 100%)',
      }} />

      {/* ── Perspective grid ── */}
      <div className="absolute inset-0 opacity-[0.07]" style={{
        backgroundImage: `
          linear-gradient(rgba(217,119,6,0.6) 1px, transparent 1px),
          linear-gradient(90deg, rgba(217,119,6,0.6) 1px, transparent 1px)
        `,
        backgroundSize: '6vw 6vw',
        maskImage: 'radial-gradient(ellipse at 50% 100%, black 0%, transparent 65%)',
        WebkitMaskImage: 'radial-gradient(ellipse at 50% 100%, black 0%, transparent 65%)',
        transform: 'perspective(600px) rotateX(58deg) translateY(10%)',
        transformOrigin: 'bottom',
      }} />

      {/* ── Aurora / scene-specific glow ── */}
      <motion.div
        className="absolute inset-0"
        initial={{ background: scenes[0].aurora }}
        animate={{ background: cfg.aurora }}
        transition={{ duration: 2.4, ease: 'easeInOut' }}
      />

      {/* ── Light rays ── */}
      <div className="absolute inset-0 pointer-events-none" style={{ mixBlendMode: 'screen', opacity: 0.08 }}>
        {[15, 30, 50, 68, 83].map((left, i) => (
          <div key={i} className="absolute top-0 bottom-0" style={{
            left: `${left}%`,
            width: '1px',
            background: `linear-gradient(180deg, rgba(251,191,36,${0.6 - i * 0.08}) 0%, transparent 70%)`,
            transform: `skewX(${(i - 2) * 6}deg)`,
          }} />
        ))}
      </div>

      {/* ── Orb 1 — large amber ── */}
      <motion.div
        className="absolute rounded-full pointer-events-none"
        style={{
          width: '40vw', height: '40vw',
          background: 'radial-gradient(circle at 33% 33%, #fcd34d 0%, #d97706 35%, #92400e 65%, transparent 100%)',
          filter: 'blur(3px)',
          boxShadow: '0 0 100px 30px rgba(217,119,6,0.25)',
          left: 0, top: 0,
        }}
        animate={{
          x: cfg.orb1.x,
          y: cfg.orb1.y,
          scale: cfg.orb1.scale,
          opacity: cfg.orb1.opacity,
        }}
        transition={TRANS}
      />

      {/* ── Orb 2 — rust orange ── */}
      <motion.div
        className="absolute rounded-full pointer-events-none"
        style={{
          width: '24vw', height: '24vw',
          background: 'radial-gradient(circle at 30% 30%, #fb923c 0%, #ea580c 40%, #7c2d12 72%, transparent)',
          filter: 'blur(2px)',
          boxShadow: '0 0 70px 20px rgba(234,88,12,0.22)',
          left: 0, top: 0,
        }}
        animate={{
          x: cfg.orb2.x,
          y: cfg.orb2.y,
          scale: cfg.orb2.scale,
          opacity: cfg.orb2.opacity,
        }}
        transition={TRANS}
      />

      {/* ── Torus ring ── */}
      <motion.div
        className="absolute pointer-events-none"
        style={{ width: '15vw', height: '15vw', left: 0, top: 0 }}
        animate={{ x: cfg.ring.x, y: cfg.ring.y, rotateZ: cfg.ring.rotateZ }}
        transition={TRANS}
      >
        <motion.div
          className="w-full h-full rounded-full"
          style={{
            border: '2vw solid #d97706',
            boxShadow: '0 0 28px 8px rgba(217,119,6,0.5), 0 0 60px 16px rgba(217,119,6,0.2), inset 0 0 18px rgba(234,88,12,0.3)',
            filter: 'blur(0.3px)',
          }}
          animate={shouldReduce ? {} : { rotateX: [0, 360] }}
          transition={{ duration: 5, repeat: Infinity, ease: 'linear' }}
        />
        {/* Inner highlight arc */}
        <div className="absolute inset-[15%] rounded-full" style={{
          border: '1px solid rgba(251,191,36,0.3)',
        }} />
      </motion.div>

      {/* ── Gem / faceted shape ── */}
      <motion.div
        className="absolute pointer-events-none"
        style={{ width: '9vw', height: '9vw', left: 0, top: 0 }}
        animate={{ x: cfg.gem.x, y: cfg.gem.y }}
        transition={TRANS}
      >
        <motion.div
          className="w-full h-full relative overflow-hidden shimmer"
          style={{
            background: 'linear-gradient(135deg, #fcd34d 0%, #ea580c 38%, #7c2d12 72%, #1a0a03 100%)',
            clipPath: 'polygon(50% 0%, 95% 30%, 80% 100%, 20% 100%, 5% 30%)',
            boxShadow: '0 0 40px 12px rgba(251,191,36,0.28)',
          }}
          animate={shouldReduce ? {} : { rotateY: [0, 360] }}
          transition={{ duration: 4, repeat: Infinity, ease: 'linear' }}
        />
      </motion.div>

      {/* ── Floating particles ── */}
      {particles.map((p, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full pointer-events-none"
          style={{
            width: p.size, height: p.size,
            background: 'radial-gradient(circle, #fbbf24 0%, #ea580c 70%)',
            left: 0, top: 0,
            opacity: 0.35,
          }}
          animate={shouldReduce ? { x: p.tx, y: p.ty } : {
            x: p.tx,
            y: p.ty,
            translateY: [0, -20, 0],
            opacity: [0.35, 0.60, 0.35],
          }}
          transition={{
            x: TRANS, y: TRANS,
            translateY: { duration: p.dur, repeat: Infinity, ease: 'easeInOut', delay: p.delay },
            opacity: { duration: p.dur, repeat: Infinity, ease: 'easeInOut', delay: p.delay },
          }}
        />
      ))}

      {/* ── Noise grain ── */}
      <div className="absolute inset-0 opacity-[0.04] pointer-events-none" style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 300 300' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
        backgroundSize: '180px 180px',
      }} />

      {/* ── Radial vignette ── */}
      <div className="absolute inset-0 pointer-events-none" style={{
        background: 'radial-gradient(ellipse 90% 90% at 50% 50%, transparent 35%, rgba(13,5,1,0.75) 100%)',
      }} />
    </div>
  );
}
