import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";

const experiences = [
  {
    role: "Staff Engineer",
    company: "Nexus Systems",
    period: "2021 – Present",
    description:
      "Architected and implemented a high-throughput distributed task queue handling 5M+ events per day. Led the migration from monolithic architecture to Go-based microservices, reducing latency by 40% and infrastructure costs by 25%. Mentored a team of 8 engineers.",
    tech: ["Go", "Kubernetes", "PostgreSQL", "Redis", "gRPC"],
  },
  {
    role: "Senior Full-Stack Engineer",
    company: "Vanguard Tech",
    period: "2018 – 2021",
    description:
      "Spearheaded the development of a real-time collaborative workspace used by 100k+ MAU. Implemented operational transforms for conflict-free concurrent editing. Built the frontend rendering engine using React and WebGL for complex data visualizations.",
    tech: ["React", "Node.js", "WebSockets", "MongoDB", "AWS"],
  },
  {
    role: "Software Engineer",
    company: "Aether Dynamics",
    period: "2016 – 2018",
    description:
      "Developed core features for a cloud-based logistics platform. Optimized database queries and caching strategies to improve dashboard load times by 3×. Implemented comprehensive test suites increasing coverage to 85%.",
    tech: ["JavaScript", "Python", "React", "PostgreSQL", "Docker"],
  },
];

const HEADING = "Experience";
const CHAR_STAGGER = 0.04;

function CharStagger({ text, className }: { text: string; className?: string }) {
  return (
    <span className={className} aria-label={text}>
      {text.split("").map((char, i) => (
        <motion.span
          key={i}
          style={{ display: char === " " ? "inline" : "inline-block" }}
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.3, delay: 0.1 + i * CHAR_STAGGER, ease: [0.16, 1, 0.3, 1] }}
        >
          {char === " " ? "\u00A0" : char}
        </motion.span>
      ))}
    </span>
  );
}

function TimelineDot({ delay }: { delay: number }) {
  return (
    <div className="relative flex-shrink-0 w-5 h-5 flex items-center justify-center mt-7">
      <motion.div
        className="absolute rounded-full"
        style={{
          width: 28,
          height: 28,
          background: "rgba(245,158,11,0.12)",
          border: "1px solid rgba(245,158,11,0.25)",
        }}
        initial={{ scale: 0, opacity: 0 }}
        whileInView={{ scale: [0, 1.3, 1], opacity: [0, 0.7, 0.4] }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, delay, ease: [0.16, 1, 0.3, 1] }}
        animate={{ scale: [1, 1.18, 1], opacity: [0.4, 0.15, 0.4] }}
      />
      <motion.div
        className="rounded-full shadow-[0_0_10px_var(--color-primary)]"
        style={{
          width: 10,
          height: 10,
          background: "linear-gradient(135deg, #f59e0b, #dc2626)",
          zIndex: 1,
        }}
        initial={{ scale: 0 }}
        whileInView={{ scale: 1 }}
        viewport={{ once: true }}
        transition={{ type: "spring", stiffness: 380, damping: 22, delay }}
      />
    </div>
  );
}

export function Experience() {
  const lineRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: lineRef,
    offset: ["start 85%", "end 20%"],
  });
  const lineScaleY = useTransform(scrollYProgress, [0, 1], [0, 1]);

  return (
    <section id="experience" className="py-24 container mx-auto px-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="mb-16"
      >
        <h2 className="text-3xl md:text-4xl font-display font-bold mb-4 flex items-center gap-3">
          <motion.span
            className="text-secondary font-mono text-xl font-normal"
            initial={{ opacity: 0, x: -10 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4 }}
          >
            05.
          </motion.span>
          <CharStagger text={HEADING} />
        </h2>
        <motion.div
          className="h-1 bg-primary shadow-[0_0_10px_var(--color-primary)] origin-left"
          initial={{ scaleX: 0, width: "5rem" }}
          whileInView={{ scaleX: 1, width: "5rem" }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.35, ease: [0.16, 1, 0.3, 1] }}
        />
      </motion.div>

      <div className="max-w-4xl mx-auto">
        <div className="relative flex gap-8 md:gap-12" ref={lineRef}>
          <div className="hidden md:flex flex-col items-center flex-shrink-0 w-5">
            <div
              className="relative flex-1 w-[2px] overflow-hidden rounded-full"
              style={{ background: "rgba(245,158,11,0.08)" }}
            >
              <motion.div
                className="absolute inset-x-0 top-0 rounded-full"
                style={{
                  background: "linear-gradient(to bottom, #f59e0b, #dc2626 60%, rgba(220,38,38,0.3))",
                  scaleY: lineScaleY,
                  originY: 0,
                  height: "100%",
                  boxShadow: "0 0 8px rgba(245,158,11,0.4)",
                }}
              />
            </div>
          </div>

          <div className="flex-1 flex flex-col gap-12">
            {experiences.map((exp, index) => (
              <div key={index} className="flex gap-6 md:gap-8 items-start">
                <div className="hidden md:block">
                  <TimelineDot delay={index * 0.18 + 0.2} />
                </div>

                <div className="flex-1">
                  <motion.div
                    className="md:hidden flex items-center gap-3 mb-3"
                    initial={{ opacity: 0, x: -12 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4, delay: index * 0.1 }}
                  >
                    <div
                      className="w-2 h-2 rounded-full shadow-[0_0_8px_var(--color-primary)]"
                      style={{ background: "#f59e0b" }}
                    />
                    <div className="flex-1 h-px" style={{ background: "rgba(245,158,11,0.2)" }} />
                  </motion.div>

                  <motion.span
                    className="block font-mono text-sm uppercase tracking-wider mb-3"
                    style={{ color: "#f59e0b" }}
                    initial={{ opacity: 0, y: -8 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4, delay: index * 0.15 }}
                  >
                    {exp.period}
                  </motion.span>

                  <motion.div
                    initial={{ opacity: 0, x: 32 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true, margin: "-60px" }}
                    transition={{
                      type: "spring",
                      stiffness: 220,
                      damping: 26,
                      delay: index * 0.15 + 0.05,
                    }}
                    className="ember-glass p-6 md:p-8 rounded-xl group relative overflow-hidden"
                    whileHover={{
                      borderColor: "rgba(245,158,11,0.4)",
                      boxShadow: "0 0 28px rgba(245,158,11,0.08), 0 12px 40px rgba(0,0,0,0.45)",
                    }}
                  >
                    <motion.div
                      className="absolute inset-0 pointer-events-none"
                      initial={{ opacity: 0 }}
                      whileHover={{ opacity: 1 }}
                      transition={{ duration: 0.4 }}
                      style={{
                        background:
                          "linear-gradient(135deg, rgba(245,158,11,0.04) 0%, transparent 60%)",
                      }}
                    />

                    <h3 className="text-2xl font-display font-bold text-foreground mb-1 relative z-10">
                      {exp.role}{" "}
                      <span style={{ color: "#f59e0b" }}>@</span>{" "}
                      <span className="text-foreground/90">{exp.company}</span>
                    </h3>

                    <p className="text-muted-foreground font-sans mt-4 leading-relaxed relative z-10">
                      {exp.description}
                    </p>

                    <div className="flex flex-wrap gap-2 mt-6 relative z-10">
                      {exp.tech.map((tech, ti) => (
                        <motion.span
                          key={tech}
                          initial={{ opacity: 0, scale: 0.85 }}
                          whileInView={{ opacity: 1, scale: 1 }}
                          viewport={{ once: true }}
                          transition={{
                            type: "spring",
                            stiffness: 300,
                            damping: 22,
                            delay: index * 0.1 + ti * 0.05 + 0.15,
                          }}
                          className="px-2 py-1 font-mono text-xs rounded border"
                          style={{
                            background: "rgba(245,158,11,0.08)",
                            borderColor: "rgba(245,158,11,0.2)",
                            color: "#f59e0b",
                          }}
                          whileHover={{
                            background: "rgba(245,158,11,0.18)",
                            borderColor: "rgba(245,158,11,0.5)",
                            boxShadow: "0 0 10px rgba(245,158,11,0.25)",
                            scale: 1.08,
                          }}
                        >
                          {tech}
                        </motion.span>
                      ))}
                    </div>

                    <motion.div
                      className="absolute bottom-0 left-0 h-[2px] rounded-b-xl origin-left"
                      style={{
                        background: "linear-gradient(to right, #f59e0b, #dc2626, transparent)",
                      }}
                      initial={{ scaleX: 0 }}
                      whileInView={{ scaleX: 1 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.7, delay: index * 0.15 + 0.3, ease: [0.16, 1, 0.3, 1] }}
                    />
                  </motion.div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
