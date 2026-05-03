import { useEffect, useRef, useState } from "react";
import { motion, useSpring, useInView } from "framer-motion";

const AXES = [
  { label: "Frontend",     value: 90 },
  { label: "Backend",      value: 88 },
  { label: "Data",         value: 76 },
  { label: "Infra",        value: 72 },
  { label: "Architecture", value: 85 },
  { label: "DevOps",       value: 68 },
];

const CX = 150;
const CY = 150;
const R  = 105;
const N  = AXES.length;
const LEVELS = 4;

function polarToXY(angle: number, radius: number) {
  const rad = (angle - 90) * (Math.PI / 180);
  return {
    x: CX + radius * Math.cos(rad),
    y: CY + radius * Math.sin(rad),
  };
}

function buildPolygon(values: number[], scale: number) {
  return values
    .map((v, i) => {
      const angle = (i * 360) / N;
      const r = (v / 100) * R * scale;
      const { x, y } = polarToXY(angle, r);
      return `${x},${y}`;
    })
    .join(" ");
}

export function SkillRadar() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  const [triggered, setTriggered] = useState(false);

  useEffect(() => {
    if (inView) setTriggered(true);
  }, [inView]);

  const progress = useSpring(0, { stiffness: 55, damping: 18, mass: 1.0 });

  useEffect(() => {
    if (triggered) progress.set(1);
  }, [triggered, progress]);

  const [scale, setScale] = useState(0);
  useEffect(() => {
    return progress.on("change", (v) => setScale(v));
  }, [progress]);

  const gridAngles = Array.from({ length: N }, (_, i) => (i * 360) / N);

  return (
    <div ref={ref} className="flex flex-col items-center py-8 select-none">
      <motion.p
        className="font-mono text-xs uppercase tracking-widest text-muted-foreground mb-6"
        initial={{ opacity: 0 }}
        animate={triggered ? { opacity: 1 } : {}}
        transition={{ duration: 0.5 }}
      >
        Proficiency Radar
      </motion.p>

      <div className="relative" style={{ width: 300, height: 300 }}>
        <svg viewBox="0 0 300 300" width="300" height="300" aria-label="Skill proficiency radar chart">
          {/* grid levels */}
          {Array.from({ length: LEVELS }, (_, lvl) => {
            const r = (R * (lvl + 1)) / LEVELS;
            const pts = gridAngles
              .map((a) => {
                const { x, y } = polarToXY(a, r);
                return `${x},${y}`;
              })
              .join(" ");
            return (
              <polygon
                key={lvl}
                points={pts}
                fill="none"
                stroke="rgba(245,158,11,0.1)"
                strokeWidth={lvl === LEVELS - 1 ? 1.2 : 0.8}
              />
            );
          })}

          {/* axis lines */}
          {gridAngles.map((angle, i) => {
            const outer = polarToXY(angle, R);
            return (
              <line
                key={i}
                x1={CX}
                y1={CY}
                x2={outer.x}
                y2={outer.y}
                stroke="rgba(245,158,11,0.12)"
                strokeWidth={0.8}
              />
            );
          })}

          {/* data polygon */}
          <motion.polygon
            points={buildPolygon(AXES.map((a) => a.value), scale)}
            fill="rgba(245,158,11,0.12)"
            stroke="rgba(245,158,11,0.7)"
            strokeWidth={1.8}
            strokeLinejoin="round"
            style={{
              filter: "drop-shadow(0 0 8px rgba(245,158,11,0.35))",
            }}
          />

          {/* data point dots */}
          {AXES.map((axis, i) => {
            const angle = (i * 360) / N;
            const r = (axis.value / 100) * R * scale;
            const { x, y } = polarToXY(angle, r);
            return (
              <motion.circle
                key={axis.label}
                cx={x}
                cy={y}
                r={3.5}
                fill="#f59e0b"
                stroke="rgba(10,6,2,0.8)"
                strokeWidth={1.5}
                style={{ filter: "drop-shadow(0 0 4px rgba(245,158,11,0.8))" }}
              />
            );
          })}

          {/* axis labels */}
          {AXES.map((axis, i) => {
            const angle = (i * 360) / N;
            const labelR = R + 22;
            const { x, y } = polarToXY(angle, labelR);
            const anchor =
              x < CX - 4 ? "end" : x > CX + 4 ? "start" : "middle";

            return (
              <motion.text
                key={axis.label}
                x={x}
                y={y + 4}
                textAnchor={anchor}
                fontSize={9.5}
                fill="rgba(254,243,199,0.65)"
                fontFamily="'Space Mono', monospace"
                initial={{ opacity: 0 }}
                animate={triggered ? { opacity: 1 } : {}}
                transition={{ delay: 0.3 + i * 0.08, duration: 0.4 }}
              >
                {axis.label}
              </motion.text>
            );
          })}

          {/* level labels (25 50 75 100) */}
          {Array.from({ length: LEVELS }, (_, lvl) => {
            const r = (R * (lvl + 1)) / LEVELS;
            const { y } = polarToXY(0, r);
            return (
              <text
                key={lvl}
                x={CX + 3}
                y={y - 2}
                fontSize={7}
                fill="rgba(245,158,11,0.25)"
                fontFamily="monospace"
              >
                {((lvl + 1) * 25)}
              </text>
            );
          })}
        </svg>
      </div>

      {/* legend */}
      <div className="flex flex-wrap justify-center gap-x-5 gap-y-1.5 mt-4 max-w-xs">
        {AXES.map((axis, i) => (
          <motion.div
            key={axis.label}
            className="flex items-center gap-1.5"
            initial={{ opacity: 0, y: 6 }}
            animate={triggered ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.6 + i * 0.06, duration: 0.3 }}
          >
            <span
              className="w-1.5 h-1.5 rounded-full flex-shrink-0"
              style={{ background: "#f59e0b", boxShadow: "0 0 4px rgba(245,158,11,0.6)" }}
            />
            <span className="font-mono text-[10px] text-muted-foreground">
              {axis.label}
            </span>
            <span className="font-mono text-[10px]" style={{ color: "#f59e0b" }}>
              {axis.value}
            </span>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
