import { useRef, useState } from "react";
import { motion, useMotionValue, useSpring, useTransform, useReducedMotion } from "framer-motion";

interface Role {
  year: string;
  period: string;
  role: string;
  company: string;
  color: string;
  tags: string[];
}

const ROLES: Role[] = [
  {
    year: "2016",
    period: "2016 – 2018",
    role: "Software Engineer",
    company: "Aether Dynamics",
    color: "#60a5fa",
    tags: ["JavaScript", "Python", "React", "PostgreSQL"],
  },
  {
    year: "2018",
    period: "2018 – 2021",
    role: "Senior Full-Stack Engineer",
    company: "Vanguard Tech",
    color: "#34d399",
    tags: ["React", "Node.js", "WebSockets", "AWS"],
  },
  {
    year: "2021",
    period: "2021 – Present",
    role: "Staff Engineer",
    company: "Nexus Systems",
    color: "#f59e0b",
    tags: ["Go", "Kubernetes", "PostgreSQL", "gRPC"],
  },
  {
    year: "Now",
    period: "Open to opportunities",
    role: "Available for hire",
    company: "Worldwide · Remote",
    color: "#dc2626",
    tags: ["Full-time", "Contract", "Consulting"],
  },
];

const CARD_W = 260;
const CARD_GAP = 80;
const STEP = CARD_W + CARD_GAP;

function TimelineCard({ role, index, active, onClick }: {
  role: Role;
  index: number;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <motion.div
      className="flex-shrink-0 flex flex-col items-center cursor-pointer"
      style={{ width: CARD_W }}
      onClick={onClick}
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.1, ease: [0.16, 1, 0.3, 1] }}
    >
      {/* year label above dot */}
      <motion.span
        className="font-mono font-bold text-sm mb-3"
        animate={{ color: active ? role.color : "rgba(254,243,199,0.35)" }}
        transition={{ duration: 0.25 }}
      >
        {role.year}
      </motion.span>

      {/* dot */}
      <div className="relative flex items-center justify-center mb-4">
        <motion.div
          className="rounded-full"
          animate={{
            width:  active ? 18 : 10,
            height: active ? 18 : 10,
            boxShadow: active
              ? `0 0 0 4px rgba(${role.color === "#f59e0b" ? "245,158,11" : role.color === "#dc2626" ? "220,38,38" : role.color === "#34d399" ? "52,211,153" : "96,165,250"},0.2), 0 0 20px ${role.color}55`
              : "none",
            background: active ? role.color : "rgba(245,158,11,0.25)",
          }}
          transition={{ type: "spring", stiffness: 320, damping: 24 }}
        />
      </div>

      {/* card */}
      <motion.div
        className="rounded-xl p-5 w-full"
        animate={{
          background: active
            ? "rgba(20,12,4,0.95)"
            : "rgba(12,7,2,0.6)",
          borderColor: active
            ? role.color + "55"
            : "rgba(245,158,11,0.1)",
          y: active ? -4 : 0,
        }}
        transition={{ duration: 0.25 }}
        style={{
          border: "1px solid",
          backdropFilter: "blur(16px)",
          boxShadow: active ? `0 12px 36px rgba(0,0,0,0.6)` : "none",
        }}
      >
        <div
          className="font-mono text-[10px] uppercase tracking-widest mb-1"
          style={{ color: role.color, opacity: active ? 0.9 : 0.5 }}
        >
          {role.period}
        </div>
        <div
          className="font-display font-bold text-sm leading-tight mb-0.5"
          style={{ color: active ? "rgba(254,243,199,0.95)" : "rgba(254,243,199,0.45)" }}
        >
          {role.role}
        </div>
        <div
          className="font-mono text-xs mb-3"
          style={{ color: active ? role.color : "rgba(245,158,11,0.35)" }}
        >
          @ {role.company}
        </div>

        <motion.div
          className="flex flex-wrap gap-1"
          animate={{ opacity: active ? 1 : 0.35 }}
        >
          {role.tags.map((tag) => (
            <span
              key={tag}
              className="font-mono text-[9px] px-1.5 py-0.5 rounded"
              style={{
                background: "rgba(245,158,11,0.08)",
                border: "1px solid rgba(245,158,11,0.15)",
                color: "rgba(254,243,199,0.6)",
              }}
            >
              {tag}
            </span>
          ))}
        </motion.div>
      </motion.div>
    </motion.div>
  );
}

export function CareerTimeline() {
  const reducedMotion = useReducedMotion();
  const trackRef = useRef<HTMLDivElement>(null);
  const [activeIdx, setActiveIdx] = useState(ROLES.length - 2); // Staff Engineer active by default

  const totalW = ROLES.length * STEP - CARD_GAP;
  const x = useMotionValue(0);
  const springX = useSpring(x, { stiffness: 280, damping: 30, mass: 0.8 });

  const clamp = (val: number) => {
    const trackEl = trackRef.current?.parentElement;
    if (!trackEl) return val;
    const viewW = trackEl.clientWidth - 64;
    const min = -(totalW - viewW);
    return Math.max(min, Math.min(0, val));
  };

  const snapTo = (idx: number) => {
    const trackEl = trackRef.current?.parentElement;
    if (!trackEl) return;
    const viewW = trackEl.clientWidth - 64;
    const target = clamp(-(idx * STEP) + viewW / 2 - CARD_W / 2);
    x.set(target);
    setActiveIdx(idx);
  };

  const handleClick = (idx: number) => {
    snapTo(idx);
  };

  // progress bar width
  const progressPct = useTransform(x, [0, -(totalW - 300)], ["0%", "100%"]);

  return (
    <div className="py-8 select-none overflow-hidden">
      <p className="font-mono text-xs uppercase tracking-widest text-center mb-8"
        style={{ color: "rgba(245,158,11,0.4)" }}>
        Career Timeline — drag or click to explore
      </p>

      {/* connecting line + cards */}
      <div className="relative overflow-hidden px-8">
        {/* horizontal connector */}
        <div
          className="absolute top-[80px] left-0 right-0 h-px"
          style={{ background: "rgba(245,158,11,0.1)" }}
        />
        {/* active progress line */}
        <motion.div
          className="absolute top-[80px] left-0 h-px origin-left"
          style={{
            background: "linear-gradient(to right, #60a5fa, #34d399, #f59e0b)",
            width: progressPct,
          }}
        />

        {/* draggable track */}
        <motion.div
          ref={trackRef}
          className="flex gap-[80px] cursor-grab active:cursor-grabbing"
          style={{ x: reducedMotion ? 0 : springX, width: totalW }}
          drag={reducedMotion ? false : "x"}
          dragConstraints={{ left: -(totalW - 300), right: 0 }}
          dragElastic={0.08}
          onDragEnd={(_, info) => {
            const snappedX = clamp(x.get() + info.velocity.x * 0.08);
            const idx = Math.round(-snappedX / STEP);
            snapTo(Math.max(0, Math.min(ROLES.length - 1, idx)));
          }}
        >
          {ROLES.map((role, i) => (
            <TimelineCard
              key={role.year}
              role={role}
              index={i}
              active={activeIdx === i}
              onClick={() => handleClick(i)}
            />
          ))}
        </motion.div>
      </div>

      {/* dot indicators */}
      <div className="flex justify-center gap-2 mt-8">
        {ROLES.map((role, i) => (
          <motion.button
            key={i}
            onClick={() => snapTo(i)}
            aria-label={`Go to ${role.role}`}
            className="rounded-full transition-all"
            animate={{
              width: activeIdx === i ? 20 : 6,
              height: 6,
              background: activeIdx === i ? role.color : "rgba(245,158,11,0.2)",
            }}
            transition={{ type: "spring", stiffness: 380, damping: 24 }}
          />
        ))}
      </div>
    </div>
  );
}
