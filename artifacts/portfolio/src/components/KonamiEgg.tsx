import { useEffect, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";

const SEQUENCE = [
  "ArrowUp","ArrowUp","ArrowDown","ArrowDown",
  "ArrowLeft","ArrowRight","ArrowLeft","ArrowRight",
  "b","a",
];

interface Ember { id: number; angle: number; dist: number; size: number; color: string; dur: number }
let EID = 0;

function spawnEmbers(): Ember[] {
  return Array.from({ length: 48 }, () => ({
    id: EID++,
    angle: Math.random() * 360,
    dist: 80 + Math.random() * 340,
    size: 3 + Math.random() * 8,
    color: ["#f59e0b","#dc2626","#fbbf24","#ea580c","#fde68a"][Math.floor(Math.random() * 5)],
    dur: 0.6 + Math.random() * 0.9,
  }));
}

export function KonamiEgg() {
  const [progress, setProgress] = useState(0);
  const [active, setActive] = useState(false);
  const [embers, setEmbers] = useState<Ember[]>([]);

  const activate = useCallback(() => {
    setActive(true);
    setEmbers(spawnEmbers());
    setTimeout(() => setActive(false), 5500);
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const expected = SEQUENCE[progress];
      if (e.key === expected) {
        const next = progress + 1;
        if (next === SEQUENCE.length) {
          setProgress(0);
          activate();
        } else {
          setProgress(next);
        }
      } else {
        setProgress(e.key === SEQUENCE[0] ? 1 : 0);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [progress, activate]);

  return (
    <AnimatePresence>
      {active && (
        <motion.div
          className="fixed inset-0 z-[200] flex flex-col items-center justify-center cursor-pointer select-none"
          style={{ background: "rgba(6,4,2,0.97)" }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.35 }}
          onClick={() => setActive(false)}
        >
          {/* ember storm */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none overflow-hidden">
            {embers.map((em) => {
              const rad = (em.angle * Math.PI) / 180;
              const tx = Math.cos(rad) * em.dist;
              const ty = Math.sin(rad) * em.dist;
              return (
                <motion.span
                  key={em.id}
                  className="absolute rounded-full"
                  style={{
                    width: em.size,
                    height: em.size,
                    background: em.color,
                    boxShadow: `0 0 ${em.size * 2}px ${em.color}`,
                  }}
                  initial={{ x: 0, y: 0, opacity: 1, scale: 1 }}
                  animate={{ x: tx, y: ty, opacity: 0, scale: 0.2 }}
                  transition={{ duration: em.dur, ease: "easeOut" }}
                />
              );
            })}
          </div>

          {/* central content */}
          <motion.div
            className="relative z-10 text-center px-8"
            initial={{ scale: 0.4, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: "spring", stiffness: 300, damping: 20, delay: 0.1 }}
          >
            <motion.p
              className="font-mono text-xs uppercase tracking-[0.4em] mb-4"
              style={{ color: "rgba(245,158,11,0.6)" }}
              animate={{ opacity: [0.6, 1, 0.6] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              ↑↑↓↓←→←→BA
            </motion.p>

            <motion.h1
              className="text-5xl md:text-7xl font-display font-black mb-4 leading-none"
              style={{
                background: "linear-gradient(135deg, #fef3c7 0%, #f59e0b 45%, #dc2626 100%)",
                WebkitBackgroundClip: "text",
                backgroundClip: "text",
                color: "transparent",
                filter: "drop-shadow(0 0 40px rgba(245,158,11,0.5))",
              }}
              animate={{ scale: [1, 1.04, 1] }}
              transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
            >
              HIRE MODE<br />ACTIVATED 🔥
            </motion.h1>

            <motion.p
              className="font-mono text-sm text-muted-foreground mt-6"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
            >
              Initiating contact sequence...
            </motion.p>

            <motion.a
              href="mailto:anhduy@example.com?subject=HIRE MODE ACTIVATED 🔥"
              className="inline-block mt-8 px-8 py-3 font-mono text-sm rounded-xl font-bold"
              style={{
                background: "linear-gradient(135deg, #f59e0b, #dc2626)",
                color: "#060402",
                boxShadow: "0 0 30px rgba(245,158,11,0.4)",
              }}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.9 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.97 }}
              onClick={(e) => e.stopPropagation()}
            >
              Contact AlphaD →
            </motion.a>

            <p className="mt-6 text-[11px] font-mono text-muted-foreground opacity-40">
              Click anywhere to dismiss
            </p>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
