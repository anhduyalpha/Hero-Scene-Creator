import { useEffect, useRef } from "react";
import { motion } from "framer-motion";

interface TechItem {
  label: string;
  abbr: string;
  color: string;
  bg: string;
  radius: number;
  speed: number;
  tiltDeg: number;
  offsetAngle: number;
}

const ITEMS: TechItem[] = [
  // ring A — equatorial, slow CW
  { label: "TypeScript", abbr: "TS",   color: "#fff",     bg: "#3178c6", radius: 150, speed: 0.38,  tiltDeg: 0,   offsetAngle: 0 },
  { label: "React",      abbr: "⚛",    color: "#61dafb",  bg: "#1e293b", radius: 150, speed: 0.38,  tiltDeg: 0,   offsetAngle: Math.PI * 0.5 },
  { label: "Go",         abbr: "Go",   color: "#fff",     bg: "#00ADD8", radius: 150, speed: 0.38,  tiltDeg: 0,   offsetAngle: Math.PI },
  { label: "PostgreSQL", abbr: "PG",   color: "#fff",     bg: "#336791", radius: 150, speed: 0.38,  tiltDeg: 0,   offsetAngle: Math.PI * 1.5 },
  // ring B — tilted 52°, faster CCW
  { label: "Rust",       abbr: "Rs",   color: "#fff",     bg: "#b7410e", radius: 115, speed: -0.55, tiltDeg: 52,  offsetAngle: 0 },
  { label: "Redis",      abbr: "⚡",   color: "#fff",     bg: "#dc382d", radius: 115, speed: -0.55, tiltDeg: 52,  offsetAngle: Math.PI * 2/3 },
  { label: "Kubernetes", abbr: "K8s",  color: "#fff",     bg: "#326ce5", radius: 115, speed: -0.55, tiltDeg: 52,  offsetAngle: Math.PI * 4/3 },
  // ring C — tilted -38°, medium CW
  { label: "Node.js",    abbr: "Nd",   color: "#fff",     bg: "#339933", radius: 130, speed: 0.48,  tiltDeg: -38, offsetAngle: Math.PI * 0.25 },
  { label: "Docker",     abbr: "🐳",   color: "#fff",     bg: "#2496ed", radius: 130, speed: 0.48,  tiltDeg: -38, offsetAngle: Math.PI * 1.25 },
  { label: "AWS",        abbr: "AWS",  color: "#232f3e",  bg: "#ff9900", radius: 130, speed: 0.48,  tiltDeg: -38, offsetAngle: Math.PI * 2.25 },
];

export function TechOrbit() {
  const refs = useRef<(HTMLDivElement | null)[]>([]);
  const startRef = useRef<number | null>(null);
  const rafRef = useRef<number>(0);

  useEffect(() => {
    const precomputed = ITEMS.map((item) => ({
      ...item,
      tiltRad: (item.tiltDeg * Math.PI) / 180,
    }));

    const frame = (now: number) => {
      if (!startRef.current) startRef.current = now;
      const t = (now - startRef.current) / 1000;

      precomputed.forEach((item, i) => {
        const el = refs.current[i];
        if (!el) return;
        const angle = t * item.speed + item.offsetAngle;
        const rawX = Math.cos(angle) * item.radius;
        const rawZ = Math.sin(angle) * item.radius;
        const x = rawX;
        const y = rawZ * Math.sin(item.tiltRad);
        const z = rawZ * Math.cos(item.tiltRad);
        // depth: 0 (far) → 1 (near)
        const depth = (z + item.radius) / (item.radius * 2);
        const opacity = 0.28 + depth * 0.72;
        const scale = 0.6 + depth * 0.5;
        el.style.transform = `translate3d(calc(-50% + ${x.toFixed(1)}px), calc(-50% + ${y.toFixed(1)}px), ${z.toFixed(1)}px) scale(${scale.toFixed(3)})`;
        el.style.opacity = opacity.toFixed(3);
        el.style.zIndex = String(Math.round(depth * 10));
      });

      rafRef.current = requestAnimationFrame(frame);
    };

    rafRef.current = requestAnimationFrame(frame);
    return () => cancelAnimationFrame(rafRef.current);
  }, []);

  return (
    <motion.div
      className="flex justify-center py-10 select-none"
      initial={{ opacity: 0, scale: 0.85 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
    >
      {/* perspective wrapper */}
      <div
        style={{
          width: 340,
          height: 340,
          perspective: "520px",
          perspectiveOrigin: "50% 50%",
        }}
      >
        {/* scene */}
        <div
          style={{
            position: "relative",
            width: "100%",
            height: "100%",
            transformStyle: "preserve-3d",
          }}
        >
          {/* central glow */}
          <div
            style={{
              position: "absolute",
              top: "50%",
              left: "50%",
              width: 80,
              height: 80,
              transform: "translate(-50%, -50%)",
              borderRadius: "50%",
              background: "radial-gradient(circle, rgba(245,158,11,0.35) 0%, rgba(180,83,9,0.12) 60%, transparent 100%)",
              filter: "blur(12px)",
            }}
            aria-hidden="true"
          />

          {/* orbit path rings (decorative) */}
          {[{ r: 150, tilt: 0 }, { r: 115, tilt: 52 }, { r: 130, tilt: -38 }].map((ring, i) => (
            <div
              key={i}
              aria-hidden="true"
              style={{
                position: "absolute",
                top: "50%",
                left: "50%",
                width: ring.r * 2,
                height: ring.r * 2,
                marginLeft: -ring.r,
                marginTop: -ring.r,
                borderRadius: "50%",
                border: "1px solid rgba(245,158,11,0.06)",
                transform: `rotateX(${ring.tilt + 90}deg)`,
                transformStyle: "preserve-3d",
              }}
            />
          ))}

          {/* tech chips */}
          {ITEMS.map((item, i) => (
            <div
              key={item.label}
              ref={(el) => { refs.current[i] = el; }}
              title={item.label}
              style={{
                position: "absolute",
                top: "50%",
                left: "50%",
                willChange: "transform, opacity",
                transition: "none",
              }}
            >
              <div
                className="flex items-center justify-center rounded-xl font-mono font-bold text-xs whitespace-nowrap px-2.5 py-1.5"
                style={{
                  background: item.bg,
                  color: item.color,
                  boxShadow: `0 2px 12px rgba(0,0,0,0.5), 0 0 0 1px rgba(255,255,255,0.08)`,
                  minWidth: 40,
                }}
              >
                {item.abbr}
              </div>
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}
