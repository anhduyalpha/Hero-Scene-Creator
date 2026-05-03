import { motion, useScroll, useSpring } from "framer-motion";
import { useRef } from "react";

interface SectionDividerProps {
  label?: string;
  index?: string;
}

export function SectionDivider({ label, index }: SectionDividerProps) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const scaleX = useSpring(scrollYProgress, { stiffness: 80, damping: 20 });

  return (
    <div
      ref={ref}
      className="relative h-16 flex items-center overflow-hidden select-none z-10"
      aria-hidden="true"
    >
      <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 h-[1px] bg-border/50" />

      <motion.div
        className="absolute left-0 top-1/2 -translate-y-1/2 h-[1px] w-full bg-gradient-to-r from-primary/80 via-primary/40 to-transparent origin-left"
        style={{ scaleX }}
      />

      <div className="absolute left-6 flex items-center gap-3">
        <motion.div
          initial={{ scale: 0, rotate: -45 }}
          whileInView={{ scale: 1, rotate: 45 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, ease: "backOut" }}
          className="w-2 h-2 border border-primary/60"
          style={{ boxShadow: "0 0 8px rgba(245,158,11,0.5)" }}
        />
        <motion.div
          initial={{ width: 0 }}
          whileInView={{ width: 48 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4, delay: 0.15 }}
          className="h-[1px] bg-gradient-to-r from-primary/60 to-transparent"
        />
        {index && (
          <motion.span
            initial={{ opacity: 0, x: -8 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: 0.25 }}
            className="font-mono text-[10px] text-primary/50 tracking-[0.3em]"
          >
            {index}
          </motion.span>
        )}
      </div>

      {label && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="absolute left-1/2 -translate-x-1/2 px-5 py-1 bg-background border border-border/60 rounded-sm"
        >
          <span className="font-mono text-[10px] tracking-[0.35em] uppercase text-muted-foreground/60">
            {label}
          </span>
        </motion.div>
      )}

      <motion.div
        className="absolute top-1/2 -translate-y-1/2 w-1 h-1 rounded-full bg-primary z-10"
        initial={{ left: 0 }}
        whileInView={{ left: "100%" }}
        viewport={{ once: true }}
        transition={{ duration: 1.8, ease: "linear", delay: 0.3 }}
        style={{ boxShadow: "0 0 12px 4px rgba(245,158,11,0.6), 0 0 4px 1px rgba(245,158,11,1)" }}
      />

      <div className="absolute right-6 flex items-center gap-3 flex-row-reverse">
        <motion.div
          initial={{ scale: 0, rotate: -45 }}
          whileInView={{ scale: 1, rotate: 45 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, ease: "backOut" }}
          className="w-2 h-2 border border-primary/40"
          style={{ boxShadow: "0 0 6px rgba(245,158,11,0.3)" }}
        />
        <motion.div
          initial={{ width: 0 }}
          whileInView={{ width: 48 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4, delay: 0.15 }}
          className="h-[1px] bg-gradient-to-l from-primary/40 to-transparent"
        />
      </div>
    </div>
  );
}

export function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  const scaleY = useSpring(scrollYProgress, { stiffness: 100, damping: 30 });

  return (
    <motion.div
      className="fixed left-0 top-0 w-[2px] h-full origin-top z-50 pointer-events-none"
      style={{
        scaleY,
        background: "linear-gradient(to bottom, hsl(var(--primary)) 0%, rgba(245,158,11,0.3) 100%)",
        boxShadow: "2px 0 12px rgba(245,158,11,0.4)",
      }}
      aria-hidden="true"
    />
  );
}
