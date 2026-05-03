import { motion, useReducedMotion } from "framer-motion";

const PARTICLES = Array.from({ length: 22 }, (_, i) => ({
  id: i,
  left: `${2 + ((i * 97 + 13) % 96)}%`,
  size: 2 + (i % 3),
  color: i % 3 === 0 ? "#dc2626" : i % 3 === 1 ? "#f59e0b" : "#fbbf24",
  glow:
    i % 3 === 0
      ? "rgba(220,38,38,0.65)"
      : i % 3 === 1
        ? "rgba(245,158,11,0.65)"
        : "rgba(251,191,36,0.55)",
  duration: 7 + (i % 7),
  delay: -(i * 0.52),
  maxOpacity: 0.22 + (i % 5) * 0.065,
  xDrift: ((i * 19 + 7) % 56) - 28,
  yDistance: 380 + (i % 5) * 110,
}));

export function EmberParticles() {
  const shouldReduce = useReducedMotion();
  if (shouldReduce) return null;

  return (
    <div
      className="absolute inset-0 overflow-hidden pointer-events-none"
      aria-hidden="true"
    >
      {PARTICLES.map((p) => (
        <motion.span
          key={p.id}
          className="absolute rounded-full"
          style={{
            left: p.left,
            bottom: 0,
            width: p.size,
            height: p.size,
            background: p.color,
            boxShadow: `0 0 ${p.size * 2 + 3}px ${p.glow}`,
            willChange: "transform, opacity",
          }}
          animate={{
            y: [0, -p.yDistance],
            x: [0, p.xDrift],
            opacity: [0, p.maxOpacity, p.maxOpacity * 0.65, 0],
          }}
          transition={{
            duration: p.duration,
            delay: p.delay,
            repeat: Infinity,
            ease: "easeOut",
          }}
        />
      ))}
    </div>
  );
}
