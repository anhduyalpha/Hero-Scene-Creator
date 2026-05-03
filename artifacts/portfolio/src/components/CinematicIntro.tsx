import { useEffect, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";

const STORAGE_KEY = "alphaD_intro_seen_v1";

type Phase = "flare" | "name" | "subtitle" | "hold" | "exit" | "done";

export function CinematicIntro() {
  const [phase, setPhase]     = useState<Phase | null>(null);
  const [skipped, setSkipped] = useState(false);

  useEffect(() => {
    if (localStorage.getItem(STORAGE_KEY)) {
      setPhase("done");
      return;
    }
    // Start sequence
    setPhase("flare");
    const timers: ReturnType<typeof setTimeout>[] = [];
    timers.push(setTimeout(() => setPhase("name"),     620));
    timers.push(setTimeout(() => setPhase("subtitle"), 1350));
    timers.push(setTimeout(() => setPhase("hold"),     2000));
    timers.push(setTimeout(() => setPhase("exit"),     3200));
    timers.push(setTimeout(() => {
      setPhase("done");
      localStorage.setItem(STORAGE_KEY, "1");
    }, 3900));
    return () => timers.forEach(clearTimeout);
  }, []);

  const skip = useCallback(() => {
    if (skipped) return;
    setSkipped(true);
    setPhase("exit");
    setTimeout(() => {
      setPhase("done");
      localStorage.setItem(STORAGE_KEY, "1");
    }, 500);
  }, [skipped]);

  if (phase === "done" || phase === null) return null;

  const visible = phase !== "exit";

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          key="intro"
          className="fixed inset-0 flex items-center justify-center overflow-hidden select-none"
          style={{ zIndex: 200, background: "#06040200" }}
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.65, ease: "easeInOut" }}
        >
          {/* deep background */}
          <div className="absolute inset-0" style={{ background: "#040201" }} />

          {/* Ember flare — inner core */}
          <motion.div
            className="absolute rounded-full pointer-events-none"
            style={{
              width: 520,
              height: 520,
              background:
                "radial-gradient(circle at center, rgba(245,158,11,0.28) 0%, rgba(180,83,9,0.14) 38%, rgba(220,38,38,0.06) 62%, transparent 80%)",
              filter: "blur(32px)",
            }}
            initial={{ scale: 0, opacity: 0 }}
            animate={
              phase === "flare"
                ? { scale: [0, 1.2, 1], opacity: [0, 1, 0.7] }
                : { scale: 1, opacity: phase === "hold" ? [0.7, 0.5, 0.7] : 0.7 }
            }
            transition={
              phase === "flare"
                ? { duration: 0.6, ease: [0.16, 1, 0.3, 1] }
                : phase === "hold"
                  ? { duration: 2, repeat: Infinity, ease: "easeInOut" }
                  : { duration: 0.3 }
            }
          />

          {/* Ember flare — outer halo */}
          <motion.div
            className="absolute rounded-full pointer-events-none"
            style={{
              width: 900,
              height: 900,
              background:
                "radial-gradient(circle at center, rgba(245,158,11,0.07) 0%, rgba(180,83,9,0.04) 45%, transparent 70%)",
              filter: "blur(60px)",
            }}
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: phase === "flare" ? 0.6 : 0.4 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          />

          {/* Horizontal scanline */}
          {(phase === "name" || phase === "subtitle" || phase === "hold") && (
            <motion.div
              className="absolute left-0 right-0 h-px pointer-events-none"
              style={{
                background:
                  "linear-gradient(to right, transparent 0%, rgba(245,158,11,0.6) 50%, transparent 100%)",
              }}
              initial={{ top: "30%", opacity: 0 }}
              animate={{ top: ["30%", "70%"], opacity: [0, 0.8, 0] }}
              transition={{ duration: 1.0, ease: "easeInOut" }}
            />
          )}

          {/* Main name — "AlphaD" */}
          <div className="relative z-10 flex flex-col items-center gap-4">
            <AnimatePresence>
              {(phase === "name" || phase === "subtitle" || phase === "hold") && (
                <motion.div
                  key="name"
                  className="text-center"
                  initial={{ opacity: 0, y: 12, filter: "blur(14px)" }}
                  animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                  exit={{ opacity: 0, y: -8, filter: "blur(8px)" }}
                  transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
                >
                  <span
                    className="font-display font-bold tracking-tighter"
                    style={{
                      fontSize: "clamp(3.5rem, 12vw, 7rem)",
                      background: "linear-gradient(135deg, #fef3c7 20%, #f59e0b 55%, #ea580c 100%)",
                      WebkitBackgroundClip: "text",
                      WebkitTextFillColor: "transparent",
                      textShadow: "none",
                      filter: "drop-shadow(0 0 40px rgba(245,158,11,0.45))",
                    }}
                  >
                    AlphaD
                  </span>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Subtitle */}
            <AnimatePresence>
              {(phase === "subtitle" || phase === "hold") && (
                <motion.div
                  key="subtitle"
                  className="flex flex-col items-center gap-3"
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.45, ease: "easeOut" }}
                >
                  {/* amber rule */}
                  <motion.div
                    className="h-px"
                    style={{ background: "linear-gradient(to right, transparent, #f59e0b, transparent)" }}
                    initial={{ width: 0 }}
                    animate={{ width: 200 }}
                    transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                  />
                  <p
                    className="font-mono uppercase tracking-[0.32em] text-sm"
                    style={{ color: "rgba(245,158,11,0.75)" }}
                  >
                    Software Engineer
                  </p>
                  <p
                    className="font-mono text-xs tracking-widest"
                    style={{ color: "rgba(254,243,199,0.28)" }}
                  >
                    Ho Chi Minh City · Vietnam
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Corner bracket accents */}
          {(["top-6 left-6", "top-6 right-6", "bottom-6 left-6", "bottom-6 right-6"] as const).map(
            (pos, i) => (
              <motion.div
                key={i}
                className={`absolute ${pos} w-8 h-8 pointer-events-none`}
                style={{
                  borderTop: i < 2 ? "1px solid rgba(245,158,11,0.3)" : "none",
                  borderBottom: i >= 2 ? "1px solid rgba(245,158,11,0.3)" : "none",
                  borderLeft: i % 2 === 0 ? "1px solid rgba(245,158,11,0.3)" : "none",
                  borderRight: i % 2 === 1 ? "1px solid rgba(245,158,11,0.3)" : "none",
                }}
                initial={{ opacity: 0, scale: 0.7 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4, delay: 0.2 + i * 0.08 }}
              />
            )
          )}

          {/* Skip button */}
          <motion.button
            className="absolute bottom-8 right-8 font-mono text-xs px-3 py-1.5 rounded-lg z-20"
            style={{
              color: "rgba(254,243,199,0.4)",
              border: "1px solid rgba(245,158,11,0.15)",
              background: "rgba(10,6,2,0.5)",
            }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8, duration: 0.4 }}
            whileHover={{
              color: "rgba(254,243,199,0.85)",
              borderColor: "rgba(245,158,11,0.4)",
            }}
            onClick={skip}
          >
            skip →
          </motion.button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
