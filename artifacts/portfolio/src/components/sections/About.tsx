import { motion } from "framer-motion";
import { useState } from "react";

const stats = [
  { value: "8+",   label: "Years Experience" },
  { value: "50+",  label: "Projects" },
  { value: "10K+", label: "GitHub Stars" },
  { value: "4",    label: "Companies" },
];

const skills = [
  "React", "TypeScript", "Node.js", "Go", "PostgreSQL",
  "Redis", "Docker", "Kubernetes", "GraphQL", "AWS",
];

export function About() {
  const [showReal, setShowReal] = useState(false);

  return (
    <section id="about" aria-labelledby="about-heading" className="py-32 bg-background relative z-10">
      <div className="container mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="mb-16"
        >
          <h2 id="about-heading" className="text-3xl md:text-4xl font-bold flex items-center gap-4">
            <span className="gradient-text font-mono text-xl font-normal" aria-hidden="true">01.</span>
            About Me
            <div
              className="h-[1px] flex-1 max-w-xs ml-4"
              style={{ background: "linear-gradient(to right, rgba(139,92,246,0.5), transparent)" }}
              aria-hidden="true"
            />
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-start">

          {/* ── Text column ────────────────────────────────────── */}
          <div className="lg:col-span-7 space-y-6 text-lg text-muted-foreground leading-relaxed">

            {/* Stats — glass panel */}
            <motion.dl
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="glass-panel rounded-2xl p-6 grid grid-cols-2 md:grid-cols-4 gap-4 mb-8"
            >
              {stats.map(({ value, label }) => (
                <div key={label} className="text-center md:text-left flex flex-col">
                  <dt className="text-xs font-mono text-muted-foreground tracking-wider uppercase" style={{ order: 2, marginTop: "4px" }}>{label}</dt>
                  <dd className="text-3xl font-black gradient-text-vivid tabular-nums" style={{ order: 1, margin: 0 }}>{value}</dd>
                </div>
              ))}
            </motion.dl>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.1 }}
            >
              Hello! My name is Anh Duy and I enjoy creating things that live on the internet. My interest
              in software engineering started when I first discovered I could make computers do exactly
              what I wanted — and I&apos;ve been obsessed with building ever since.
            </motion.p>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              Fast-forward to today, and I&apos;ve had the privilege of working at an advertising agency,
              a start-up, a huge corporation, and a student-led design studio. My main focus these
              days is building accessible, inclusive products and digital experiences.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="pt-8"
            >
              <p className="mb-4">Here are a few technologies I&apos;ve been working with recently:</p>
              <ul className="flex flex-wrap gap-3" aria-label="Technologies">
                {skills.map((skill, index) => (
                  <motion.li
                    key={skill}
                    initial={{ opacity: 0, scale: 0.9 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.3, delay: 0.5 + index * 0.05 }}
                    className="relative glass text-foreground hover:text-primary transition-colors duration-200 text-sm font-mono px-3 py-1 rounded-sm cursor-default gradient-border"
                    style={{ touchAction: "manipulation" }}
                  >
                    {skill}
                  </motion.li>
                ))}
              </ul>
            </motion.div>
          </div>

          {/* ── Photo column ────────────────────────────────────── */}
          <motion.div
            className="lg:col-span-5 relative"
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.2 }}
          >
            {/* Toggle button */}
            <div className="flex justify-end mb-3">
              <button
                onClick={() => setShowReal((p) => !p)}
                className="glass font-mono text-xs text-muted-foreground hover:text-primary transition-colors duration-200 border border-primary/20 hover:border-primary/50 px-3 py-1.5 rounded-sm flex items-center gap-2 focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background"
                aria-label={showReal ? "Show illustrated avatar" : "Show real photo"}
                style={{ touchAction: "manipulation" }}
              >
                <span
                  className="inline-block w-1.5 h-1.5 rounded-full bg-primary"
                  aria-hidden="true"
                  style={{ boxShadow: "0 0 6px rgba(139,92,246,0.8)" }}
                />
                {showReal ? "illustrated" : "real photo"}
              </button>
            </div>

            <div className="relative w-full max-w-sm mx-auto group">
              {/* Gradient offset decorative border frame */}
              <div
                className="absolute inset-0 translate-x-5 translate-y-5 group-hover:translate-x-3 group-hover:translate-y-3 transition-transform duration-500 rounded-sm z-0"
                style={{
                  background: "linear-gradient(135deg, rgba(139,92,246,0.6) 0%, rgba(6,182,212,0.3) 100%)",
                  padding: "2px",
                }}
                aria-hidden="true"
              >
                <div className="w-full h-full rounded-sm" style={{ background: "transparent" }} />
              </div>

              {/* Ambient glow */}
              <div
                className="absolute -inset-6 rounded-2xl opacity-60 group-hover:opacity-90 transition-opacity duration-500 z-0 blur-2xl"
                style={{ background: "radial-gradient(ellipse, rgba(139,92,246,0.28) 0%, transparent 70%)" }}
                aria-hidden="true"
              />

              {/* Photo card */}
              <div className="relative z-10 overflow-hidden rounded-sm glass-card">
                {/* Gradient corner accent marks */}
                <div className="absolute -top-px -left-px w-5 h-5 z-20" aria-hidden="true">
                  <div className="absolute top-0 left-0 w-full h-[2px]" style={{ background: "linear-gradient(to right, rgba(139,92,246,0.9), transparent)" }} />
                  <div className="absolute top-0 left-0 h-full w-[2px]" style={{ background: "linear-gradient(to bottom, rgba(139,92,246,0.9), transparent)" }} />
                </div>
                <div className="absolute -top-px -right-px w-5 h-5 z-20" aria-hidden="true">
                  <div className="absolute top-0 right-0 w-full h-[2px]" style={{ background: "linear-gradient(to left, rgba(6,182,212,0.8), transparent)" }} />
                  <div className="absolute top-0 right-0 h-full w-[2px]" style={{ background: "linear-gradient(to bottom, rgba(6,182,212,0.8), transparent)" }} />
                </div>
                <div className="absolute -bottom-px -left-px w-5 h-5 z-20" aria-hidden="true">
                  <div className="absolute bottom-0 left-0 w-full h-[2px]" style={{ background: "linear-gradient(to right, rgba(139,92,246,0.6), transparent)" }} />
                  <div className="absolute bottom-0 left-0 h-full w-[2px]" style={{ background: "linear-gradient(to top, rgba(139,92,246,0.6), transparent)" }} />
                </div>
                <div className="absolute -bottom-px -right-px w-5 h-5 z-20" aria-hidden="true">
                  <div className="absolute bottom-0 right-0 w-full h-[2px]" style={{ background: "linear-gradient(to left, rgba(6,182,212,0.5), transparent)" }} />
                  <div className="absolute bottom-0 right-0 h-full w-[2px]" style={{ background: "linear-gradient(to top, rgba(6,182,212,0.5), transparent)" }} />
                </div>

                {/* Illustrated avatar */}
                <motion.img
                  key="illustrated"
                  src="/avatar-illustrated.png"
                  alt="Anh Duy — illustrated developer avatar"
                  width="400"
                  height="500"
                  className="w-full h-auto object-cover block"
                  animate={{ opacity: showReal ? 0 : 1 }}
                  transition={{ duration: 0.45 }}
                  style={{ position: showReal ? "absolute" : "relative", inset: 0 }}
                  draggable={false}
                />

                {/* Real photo */}
                <motion.img
                  key="real"
                  src="/avatar.png"
                  alt="Anh Duy — real photo"
                  width="400"
                  height="500"
                  className="w-full h-auto object-cover object-top block"
                  animate={{ opacity: showReal ? 1 : 0 }}
                  transition={{ duration: 0.45 }}
                  style={{
                    position: showReal ? "relative" : "absolute",
                    inset: 0,
                    background: "linear-gradient(135deg,#0d0014 0%,#180030 50%,#0a001a 100%)",
                    filter: showReal ? "drop-shadow(0 0 24px rgba(139,92,246,0.45))" : "none",
                  }}
                  draggable={false}
                />

                {/* Label badge */}
                <div className="absolute top-3 left-3 z-20">
                  <span className="glass font-mono text-[10px] tracking-widest uppercase px-2 py-1 border border-primary/30 text-primary rounded-sm">
                    {showReal ? "Real" : "Illustrated"}
                  </span>
                </div>

                {/* Bottom gradient */}
                <div
                  className="absolute bottom-0 left-0 right-0 h-12 z-20 pointer-events-none"
                  style={{ background: "linear-gradient(to top, rgba(5,5,5,0.5) 0%, transparent 100%)" }}
                  aria-hidden="true"
                />
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
