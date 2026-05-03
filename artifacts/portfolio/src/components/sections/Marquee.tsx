import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";

const items = [
  "Full Stack Engineer",
  "Open Source Contributor",
  "Distributed Systems",
  "TypeScript",
  "Go",
  "React",
  "Kubernetes",
  "Builder",
];

const Row = ({ direction = 1, speed = 40 }: { direction?: 1 | -1; speed?: number }) => {
  const repeated = [...items, ...items, ...items, ...items];
  const animationName = direction === 1 ? "marquee-left" : "marquee-right";

  return (
    <div className="flex overflow-hidden whitespace-nowrap" style={{ maskImage: "linear-gradient(to right, transparent, black 10%, black 90%, transparent)" }}>
      <div
        className="flex shrink-0"
        style={{ animation: `${animationName} ${speed}s linear infinite` }}
      >
        {repeated.map((item, i) => (
          <div key={i} className="flex items-center gap-0">
            <span className="text-[clamp(2.5rem,7vw,5.5rem)] font-black uppercase tracking-tighter leading-none px-6 py-2 text-foreground/10 hover:text-foreground/25 transition-colors duration-300 cursor-default select-none">
              {item}
            </span>
            <span className="text-primary/30 text-2xl font-thin">·</span>
          </div>
        ))}
      </div>
      <div
        className="flex shrink-0"
        style={{ animation: `${animationName} ${speed}s linear infinite` }}
        aria-hidden
      >
        {repeated.map((item, i) => (
          <div key={i} className="flex items-center gap-0">
            <span className="text-[clamp(2.5rem,7vw,5.5rem)] font-black uppercase tracking-tighter leading-none px-6 py-2 text-foreground/10 hover:text-foreground/25 transition-colors duration-300 cursor-default select-none">
              {item}
            </span>
            <span className="text-primary/30 text-2xl font-thin">·</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export function Marquee() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const opacity = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0, 1, 1, 0]);

  return (
    <motion.section
      ref={ref}
      style={{ opacity }}
      className="py-12 overflow-hidden relative"
      aria-hidden="true"
    >
      <div className="absolute inset-0 bg-gradient-to-b from-background via-transparent to-background pointer-events-none z-10" />
      <Row direction={1} speed={50} />
      <Row direction={-1} speed={38} />
    </motion.section>
  );
}
