import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";

interface ScrollFrameProps {
  children: React.ReactNode;
  label?: string;
  className?: string;
}

/** Corner bracket + scan-line frame that draws in as the section enters viewport */
export function ScrollFrame({ children, label, className = "" }: ScrollFrameProps) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 0.85", "start 0.3"] });
  const scanY = useTransform(scrollYProgress, [0, 1], ["-100%", "100%"]);

  const corner =
    "absolute w-6 h-6 pointer-events-none";
  const line = (dir: "t" | "r" | "b" | "l") =>
    dir === "t" || dir === "b"
      ? "absolute h-[2px] bg-primary/40 origin-left"
      : "absolute w-[2px] bg-primary/40 origin-top";

  return (
    <div ref={ref} className={`relative ${className}`}>
      {/* ── Animated corner brackets ───────────────────── */}

      {/* Top-left */}
      <motion.div className={`${corner} top-0 left-0`}
        initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} transition={{ duration: 0.3 }}
      >
        <motion.div className={`${line("t")} top-0 left-0 w-6`}
          initial={{ scaleX: 0 }} whileInView={{ scaleX: 1 }} viewport={{ once: true }} transition={{ duration: 0.35, delay: 0.05 }}
        />
        <motion.div className={`${line("l")} top-0 left-0 h-6`}
          initial={{ scaleY: 0 }} whileInView={{ scaleY: 1 }} viewport={{ once: true }} transition={{ duration: 0.35, delay: 0.05 }}
        />
      </motion.div>

      {/* Top-right */}
      <motion.div className={`${corner} top-0 right-0`}
        initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} transition={{ duration: 0.3, delay: 0.05 }}
      >
        <motion.div className={`${line("t")} top-0 right-0 w-6 origin-right`}
          initial={{ scaleX: 0 }} whileInView={{ scaleX: 1 }} viewport={{ once: true }} transition={{ duration: 0.35, delay: 0.1 }}
        />
        <motion.div className={`${line("l")} top-0 right-0 h-6`}
          initial={{ scaleY: 0 }} whileInView={{ scaleY: 1 }} viewport={{ once: true }} transition={{ duration: 0.35, delay: 0.1 }}
        />
      </motion.div>

      {/* Bottom-left */}
      <motion.div className={`${corner} bottom-0 left-0`}
        initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} transition={{ duration: 0.3, delay: 0.1 }}
      >
        <motion.div className={`${line("b")} bottom-0 left-0 w-6`}
          initial={{ scaleX: 0 }} whileInView={{ scaleX: 1 }} viewport={{ once: true }} transition={{ duration: 0.35, delay: 0.15 }}
        />
        <motion.div className={`${line("l")} bottom-0 left-0 h-6 origin-bottom`}
          initial={{ scaleY: 0 }} whileInView={{ scaleY: 1 }} viewport={{ once: true }} transition={{ duration: 0.35, delay: 0.15 }}
        />
      </motion.div>

      {/* Bottom-right */}
      <motion.div className={`${corner} bottom-0 right-0`}
        initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} transition={{ duration: 0.3, delay: 0.15 }}
      >
        <motion.div className={`${line("b")} bottom-0 right-0 w-6 origin-right`}
          initial={{ scaleX: 0 }} whileInView={{ scaleX: 1 }} viewport={{ once: true }} transition={{ duration: 0.35, delay: 0.2 }}
        />
        <motion.div className={`${line("l")} bottom-0 right-0 h-6 origin-bottom`}
          initial={{ scaleY: 0 }} whileInView={{ scaleY: 1 }} viewport={{ once: true }} transition={{ duration: 0.35, delay: 0.2 }}
        />
      </motion.div>

      {/* ── Section label ─────────────────────────────── */}
      {label && (
        <motion.div
          initial={{ opacity: 0, x: -10 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4, delay: 0.25 }}
          className="absolute -top-3 left-8 z-20 pointer-events-none"
        >
          <span className="font-mono text-[9px] tracking-[0.4em] uppercase text-primary/40 bg-background px-2">
            {label}
          </span>
        </motion.div>
      )}

      {/* ── Vertical scan line ────────────────────────── */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden z-0 rounded-[inherit]" aria-hidden="true">
        <motion.div
          className="absolute left-0 right-0 h-[80px]"
          style={{
            y: scanY,
            background: "linear-gradient(to bottom, transparent 0%, rgba(139,92,246,0.04) 40%, rgba(139,92,246,0.08) 50%, rgba(139,92,246,0.04) 60%, transparent 100%)",
          }}
        />
      </div>

      {children}
    </div>
  );
}

/** Data-stream side element — decorative vertical ticker */
export function DataStream({ side = "left" }: { side?: "left" | "right" }) {
  const ticks = Array.from({ length: 12 });
  return (
    <div
      className={`fixed top-0 bottom-0 ${side === "left" ? "left-4" : "right-4"} w-[1px] z-[3] pointer-events-none hidden xl:flex flex-col items-center justify-center gap-0`}
      aria-hidden="true"
    >
      <div className="w-[1px] flex-1 bg-gradient-to-b from-transparent via-primary/15 to-transparent" />
      <div className="flex flex-col gap-3 py-4">
        {ticks.map((_, i) => (
          <motion.div
            key={i}
            className="w-1 h-1 rounded-full bg-primary/30"
            animate={{ opacity: [0.1, 0.6, 0.1], scale: [0.8, 1.2, 0.8] }}
            transition={{
              duration: 2.5,
              delay: i * 0.2,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            style={{
              boxShadow: i % 3 === 0 ? "0 0 6px rgba(139,92,246,0.5)" : "none",
            }}
          />
        ))}
      </div>
      <div className="w-[1px] flex-1 bg-gradient-to-b from-transparent via-primary/15 to-transparent" />
    </div>
  );
}
