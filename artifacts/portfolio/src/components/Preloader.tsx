import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";

interface PreloaderProps {
  onComplete: () => void;
}

export function Preloader({ onComplete }: PreloaderProps) {
  const [count, setCount] = useState(0);
  const [exiting, setExiting] = useState(false);

  useEffect(() => {
    const totalDuration = 2200;
    const intervalMs = 18;
    const steps = totalDuration / intervalMs;
    let current = 0;

    const timer = setInterval(() => {
      current++;
      const progress = current / steps;
      const eased = 1 - Math.pow(1 - progress, 3);
      const value = Math.min(Math.round(eased * 100), 100);
      setCount(value);

      if (current >= steps) {
        clearInterval(timer);
        setTimeout(() => {
          setExiting(true);
          setTimeout(onComplete, 900);
        }, 200);
      }
    }, intervalMs);

    return () => clearInterval(timer);
  }, [onComplete]);

  return (
    <AnimatePresence>
      {!exiting && (
        <motion.div
          className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-black"
          exit={{ y: "-100%" }}
          transition={{ duration: 0.85, ease: [0.76, 0, 0.24, 1] }}
          aria-modal="true"
          aria-label="Loading portfolio"
        >
          <div
            role="status"
            aria-live="polite"
            aria-atomic="true"
            className="sr-only"
          >
            {count < 100 ? `Loading, ${count}%` : "Loading complete"}
          </div>

          <div className="relative flex flex-col items-center">
            <motion.span
              className="text-[clamp(5rem,20vw,12rem)] font-black text-white leading-none tabular-nums tracking-tighter"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              aria-hidden="true"
            >
              {String(count).padStart(2, "0")}
            </motion.span>

            <motion.div
              className="mt-4 flex items-center gap-3"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3, duration: 0.4 }}
              aria-hidden="true"
            >
              <div className="h-[1px] w-12 bg-white/20" />
              <span className="font-mono text-xs tracking-[0.4em] uppercase text-white/60">
                Loading
              </span>
              <div className="h-[1px] w-12 bg-white/20" />
            </motion.div>
          </div>

          <motion.div
            className="absolute bottom-0 left-0 h-[2px] bg-primary origin-left"
            style={{ width: `${count}%` }}
            aria-hidden="true"
          />

          <motion.div
            className="absolute bottom-8 right-8 font-mono text-xs text-white/20 tracking-widest"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            aria-hidden="true"
          >
            AlphaD / PORTFOLIO
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
