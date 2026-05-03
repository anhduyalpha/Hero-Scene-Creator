import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";

const experiences = [
  {
    id: "stripe",
    role: "Senior Software Engineer",
    company: "Stripe",
    initial: "S",
    color: "#635BFF",
    date: "2022 - Present",
    description: "Leading the core payments team. Architected a distributed ledger system reducing latency by 40%. Mentored 5 mid-level engineers.",
  },
  {
    id: "cloudflare",
    role: "Software Engineer",
    company: "Cloudflare",
    initial: "C",
    color: "#F38020",
    date: "2019 - 2022",
    description: "Developed features for the Edge Computing platform. Built Rust services handling millions of requests per second.",
  },
  {
    id: "twilio",
    role: "Junior Engineer",
    company: "Twilio",
    initial: "T",
    color: "#F22F46",
    date: "2017 - 2019",
    description: "Contributed to the Voice API. Improved test coverage by 30% and participated in the on-call rotation.",
  },
  {
    id: "github",
    role: "Intern",
    company: "GitHub",
    initial: "G",
    color: "#a78bfa",
    date: "Summer 2016",
    description: "Worked on GitHub Actions prototype. Implemented internal tooling for CI/CD pipelines.",
  },
];

export function Experience() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start center", "end center"],
  });

  const scaleY = useTransform(scrollYProgress, [0, 1], [0, 1]);

  return (
    <section id="experience" className="py-32 bg-background relative z-10">
      <div className="container mx-auto px-6 max-w-4xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-bold flex items-center gap-4">
            <span className="gradient-text font-mono text-xl font-normal">03.</span>
            Where I&apos;ve Worked
            <div
              className="h-[1px] flex-1 max-w-xs ml-4"
              style={{ background: "linear-gradient(to right, rgba(139,92,246,0.5), transparent)" }}
              aria-hidden="true"
            />
          </h2>
        </motion.div>

        <div className="relative pl-8 md:pl-0" ref={containerRef}>
          {/* Timeline track */}
          <div className="absolute left-[39px] md:left-1/2 top-0 bottom-0 w-[2px] md:-translate-x-1/2"
            style={{ background: "rgba(255,255,255,0.06)" }}
          />
          {/* Scroll-driven gradient fill */}
          <motion.div
            className="absolute left-[39px] md:left-1/2 top-0 bottom-0 w-[2px] md:-translate-x-1/2 origin-top"
            style={{
              scaleY,
              background: "linear-gradient(to bottom, rgba(139,92,246,0.9) 0%, rgba(6,182,212,0.6) 60%, rgba(139,92,246,0.4) 100%)",
              boxShadow: "0 0 8px rgba(139,92,246,0.4)",
            }}
          />

          <div className="space-y-16">
            {experiences.map((exp, index) => {
              const isEven = index % 2 === 0;
              return (
                <motion.div
                  key={exp.id}
                  initial={{ opacity: 0, x: isEven ? -50 : 50 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, margin: "-100px" }}
                  transition={{ duration: 0.5 }}
                  className="relative md:flex items-center justify-between group"
                >
                  {/* Company avatar — glass with gradient border */}
                  <div
                    className="absolute left-[-45px] md:left-1/2 w-10 h-10 -ml-[4px] md:-ml-0 rounded-full md:-translate-x-1/2 z-10 flex items-center justify-center font-bold transition-transform duration-300 group-hover:scale-110"
                    role="img"
                    aria-label={`${exp.company} logo`}
                    style={{
                      background: `linear-gradient(135deg, rgba(14,14,24,0.9) 0%, rgba(8,8,18,0.95) 100%)`,
                      border: `2px solid ${exp.color}`,
                      boxShadow: `0 0 16px ${exp.color}44, 0 4px 12px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.06)`,
                      backdropFilter: "blur(12px)",
                      WebkitBackdropFilter: "blur(12px)",
                    }}
                  >
                    <span
                      aria-hidden="true"
                      className="text-sm font-bold"
                      style={{ color: exp.color }}
                    >
                      {exp.initial}
                    </span>
                  </div>

                  <div className={`md:w-5/12 ${isEven ? "md:text-right md:pr-12" : "md:order-2 md:pl-12"}`}>
                    {/* Glass card */}
                    <div className="glass-card rounded-xl p-6 relative overflow-hidden group/card transition-colors duration-300 hover:border-primary/30">
                      {/* Gradient top accent bar */}
                      <div
                        className="absolute top-0 left-0 right-0 h-[2px] rounded-t-xl"
                        style={{
                          background: `linear-gradient(to right, ${exp.color}cc, ${exp.color}44, transparent)`,
                        }}
                        aria-hidden="true"
                      />

                      {/* Corner glow */}
                      <div
                        className="absolute top-0 left-0 w-24 h-24 pointer-events-none"
                        style={{
                          background: `radial-gradient(ellipse at top left, ${exp.color}18 0%, transparent 70%)`,
                        }}
                        aria-hidden="true"
                      />

                      <h3 className="text-xl font-bold text-foreground relative z-10">
                        {exp.role}{" "}
                        <span style={{ color: exp.color }}>@ {exp.company}</span>
                      </h3>
                      <div className="font-mono text-sm text-muted-foreground mt-1 mb-4 relative z-10">
                        {exp.date}
                      </div>
                      <p className="text-muted-foreground leading-relaxed text-left md:text-inherit relative z-10">
                        {exp.description}
                      </p>
                    </div>
                  </div>

                  <div className={`hidden md:block md:w-5/12 ${isEven ? "md:order-2" : ""}`} />
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
