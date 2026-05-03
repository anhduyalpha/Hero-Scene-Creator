import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { Github, ExternalLink } from "lucide-react";
import { useRef, useState } from "react";

const projects = [
  {
    title: "Nexus",
    tag: "Featured",
    description:
      "A distributed task queue built in Go with Redis. Handles millions of background jobs with high availability and exactly-once processing guarantees. Features a web dashboard for monitoring.",
    tech: ["Go", "Redis", "Docker"],
    github: "#",
    external: "#",
    image: "/project-nexus.png",
    accent: "rgba(139,92,246,0.6)",
  },
  {
    title: "Vaultify",
    description:
      "An open-source secrets manager with zero-knowledge encryption. Securely store, manage, and distribute API keys, passwords, and certificates across your infrastructure.",
    tech: ["TypeScript", "Node.js", "PostgreSQL"],
    github: "#",
    external: "#",
    image: "/project-vaultify.png",
    accent: "rgba(6,182,212,0.5)",
  },
  {
    title: "FlowGraph",
    description:
      "A visual workflow builder with real-time collaboration. Allows teams to design complex logic flows using a drag-and-drop canvas with multiplayer cursors and history.",
    tech: ["React", "WebSockets", "Go"],
    github: "#",
    external: "#",
    image: "/project-flowgraph.png",
    accent: "rgba(168,85,247,0.5)",
  },
  {
    title: "Spectra",
    description:
      "A Kubernetes observability platform with custom metrics. Collects, aggregates, and visualizes cluster performance data with minimal overhead and intelligent alerting.",
    tech: ["Go", "Kubernetes", "Prometheus"],
    github: "#",
    external: "#",
    image: "/project-spectra.png",
    accent: "rgba(34,211,238,0.45)",
  },
];

function ProjectCard({
  project,
  index,
}: {
  project: (typeof projects)[0];
  index: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [hovered, setHovered] = useState(false);
  const [sheenPos, setSheenPos] = useState({ x: 50, y: 50 });

  /* ── 3-D tilt ─────────────────────────────────────────── */
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const rotateX = useSpring(useTransform(my, [-0.5, 0.5], ["14deg", "-14deg"]), {
    stiffness: 180,
    damping: 18,
  });
  const rotateY = useSpring(useTransform(mx, [-0.5, 0.5], ["-14deg", "14deg"]), {
    stiffness: 180,
    damping: 18,
  });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const xPct = (e.clientX - rect.left) / rect.width - 0.5;
    const yPct = (e.clientY - rect.top) / rect.height - 0.5;
    mx.set(xPct);
    my.set(yPct);
    setSheenPos({
      x: ((e.clientX - rect.left) / rect.width) * 100,
      y: ((e.clientY - rect.top) / rect.height) * 100,
    });
  };

  const handleMouseLeave = () => {
    mx.set(0);
    my.set(0);
    setHovered(false);
  };

  return (
    <motion.div
      ref={ref}
      style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={handleMouseLeave}
      className="relative h-full group"
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.6, delay: index * 0.1 }}
    >
      {/* ── Outer glow ring ─────────────────────────────── */}
      <div
        className="absolute -inset-px rounded-xl transition-opacity duration-500 pointer-events-none z-0"
        style={{
          opacity: hovered ? 1 : 0,
          background: `radial-gradient(ellipse at ${sheenPos.x}% ${sheenPos.y}%, ${project.accent} 0%, transparent 70%)`,
          filter: "blur(1px)",
        }}
      />

      {/* ── Card body ───────────────────────────────────── */}
      <div className="relative h-full bg-card border border-card-border rounded-xl overflow-hidden flex flex-col z-10 transition-colors duration-300 group-hover:border-primary/40">

        {/* ── Image header ───────────────────────────────── */}
        <div
          className="relative overflow-hidden"
          style={{ height: "200px", transform: "translateZ(10px)" }}
        >
          <motion.img
            src={project.image}
            alt={`${project.title} screenshot`}
            className="w-full h-full object-cover object-top"
            loading="lazy"
            decoding="async"
            animate={{ scale: hovered ? 1.07 : 1 }}
            transition={{ duration: 0.5, ease: [0.25, 1, 0.5, 1] }}
            draggable={false}
          />

          {/* gradient fade to card */}
          <div className="absolute inset-0 bg-gradient-to-t from-card via-card/30 to-transparent" />

          {/* sheen layer on image */}
          <div
            className="absolute inset-0 pointer-events-none transition-opacity duration-200"
            style={{
              opacity: hovered ? 1 : 0,
              background: `radial-gradient(circle at ${sheenPos.x}% ${sheenPos.y}%, rgba(255,255,255,0.12) 0%, transparent 55%)`,
            }}
          />

          {/* Top badges */}
          <div className="absolute top-3 left-3 flex items-center gap-2" style={{ transform: "translateZ(20px)" }}>
            {project.tag && (
              <span className="font-mono text-[10px] px-2 py-1 bg-primary text-primary-foreground rounded-sm tracking-wider">
                {project.tag}
              </span>
            )}
            <span
              className="w-2 h-2 rounded-full"
              style={{ background: project.accent, boxShadow: `0 0 8px ${project.accent}` }}
            />
          </div>

          {/* Project links — visible on hover/focus for keyboard accessibility */}
          <div
            className="absolute top-3 right-3 flex gap-2 transition-all duration-300 opacity-0 group-hover:opacity-100 focus-within:opacity-100 focus-within:translate-y-0"
            style={{
              transform: hovered ? "translateY(0) translateZ(30px)" : "translateY(-6px) translateZ(30px)",
            }}
          >
            <a
              href={project.github}
              className="w-11 h-11 flex items-center justify-center bg-black/60 backdrop-blur-sm border border-white/10 text-white/70 hover:text-white hover:border-primary/60 focus-visible:text-white focus-visible:border-primary/60 focus-visible:ring-2 focus-visible:ring-primary transition-colors rounded-md"
              aria-label={`${project.title} on GitHub`}
              style={{ touchAction: "manipulation" }}
            >
              <Github className="w-4 h-4" aria-hidden="true" />
            </a>
            <a
              href={project.external}
              className="w-11 h-11 flex items-center justify-center bg-black/60 backdrop-blur-sm border border-white/10 text-white/70 hover:text-white hover:border-primary/60 focus-visible:text-white focus-visible:border-primary/60 focus-visible:ring-2 focus-visible:ring-primary transition-colors rounded-md"
              aria-label={`${project.title} live demo`}
              style={{ touchAction: "manipulation" }}
            >
              <ExternalLink className="w-4 h-4" aria-hidden="true" />
            </a>
          </div>
        </div>

        {/* ── Content ──────────────────────────────────── */}
        <div className="flex flex-col flex-1 p-6" style={{ transform: "translateZ(30px)" }}>
          {/* Index watermark */}
          <div className="absolute bottom-4 right-6 text-7xl font-black text-muted-foreground/[0.04] pointer-events-none select-none tabular-nums">
            0{index + 1}
          </div>

          <motion.h3
            className="text-xl font-bold mb-3 text-foreground transition-colors duration-300 group-hover:text-primary"
            style={{ transform: "translateZ(10px)" }}
          >
            {project.title}
          </motion.h3>

          <p className="text-muted-foreground text-sm leading-relaxed mb-6 flex-1" style={{ transform: "translateZ(8px)" }}>
            {project.description}
          </p>

          <ul className="flex flex-wrap gap-2" style={{ transform: "translateZ(12px)" }}>
            {project.tech.map((tech) => (
              <li
                key={tech}
                className="border border-primary/25 bg-primary/5 text-foreground hover:bg-primary/15 hover:border-primary hover:text-primary transition-colors text-xs font-mono px-2.5 py-1 rounded-sm cursor-default"
              >
                {tech}
              </li>
            ))}
          </ul>
        </div>

        {/* ── Sheen overlay on whole card ──────────────── */}
        <div
          className="absolute inset-0 pointer-events-none rounded-xl transition-opacity duration-150"
          style={{
            opacity: hovered ? 1 : 0,
            background: `radial-gradient(ellipse at ${sheenPos.x}% ${sheenPos.y}%, rgba(139,92,246,0.07) 0%, transparent 60%)`,
          }}
        />

        {/* Scan line on hover */}
        <motion.div
          className="absolute left-0 right-0 h-[1px] pointer-events-none"
          style={{ background: `linear-gradient(to right, transparent, ${project.accent}, transparent)` }}
          animate={hovered ? { y: [0, 200, 400], opacity: [0, 0.6, 0] } : { y: 0, opacity: 0 }}
          transition={hovered ? { duration: 1.2, ease: "linear", repeat: Infinity } : {}}
        />
      </div>
    </motion.div>
  );
}

export function Projects() {
  return (
    <section id="projects" className="py-32 bg-background relative z-10">
      <div className="container mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-bold flex items-center gap-4">
            <span className="text-primary font-mono text-xl font-normal" aria-hidden="true">02.</span>
            Some Things I&apos;ve Built
            <div className="h-[1px] bg-border flex-1 max-w-xs ml-4" aria-hidden="true" />
          </h2>
        </motion.div>

        <div
          className="grid grid-cols-1 md:grid-cols-2 gap-6"
          style={{ perspective: "1200px" }}
        >
          {projects.map((project, i) => (
            <ProjectCard key={project.title} project={project} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
