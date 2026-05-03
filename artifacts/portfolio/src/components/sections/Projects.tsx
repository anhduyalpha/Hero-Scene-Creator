import { useEffect, useRef } from "react";
import {
  motion,
  useMotionValue,
  useSpring,
  useTransform,
  useMotionTemplate,
  useReducedMotion,
} from "framer-motion";
import { Github, ExternalLink, Code } from "lucide-react";

/* ─── project data ─────────────────────────────────────── */
const projects = [
  {
    title: "Forge Queue",
    description:
      "A highly resilient, distributed task queue built with Go and Redis Streams. Designed for high-throughput environments, capable of processing millions of background jobs with guaranteed at-least-once delivery, automatic retries, and comprehensive telemetry.",
    image: `${import.meta.env.BASE_URL}project-forge.png`,
    tech: ["Go", "Redis", "Docker", "Prometheus"],
    github: "#",
    demo: "#",
  },
  {
    title: "Ember CLI",
    description:
      "A lightning-fast, extensible command-line tool for scaffolding and managing complex microservice architectures. Written in Rust for minimal footprint and maximum execution speed, featuring a plugin system and interactive terminal UI.",
    image: `${import.meta.env.BASE_URL}project-cli.png`,
    tech: ["Rust", "Clap", "Tokio", "WebAssembly"],
    github: "#",
    demo: "#",
  },
  {
    title: "HoverKit 3D",
    description:
      "A GPU-accelerated 3D hover-effects library delivering buttery-smooth perspective tilts, magnetic interactions, and depth-of-field glows. Zero runtime dependencies, tree-shakeable, used by 500+ projects on npm.",
    image: `${import.meta.env.BASE_URL}project-3dhover.svg`,
    tech: ["TypeScript", "WebGL", "GSAP", "CSS Houdini"],
    github: "#",
    demo: "#",
  },
  {
    title: "RedLine DB",
    description:
      "An experimental, embeddable time-series database optimized for IoT workloads. Implements a custom storage engine leveraging memory-mapped files and a bespoke query language for rapid aggregations over massive datasets.",
    image: `${import.meta.env.BASE_URL}project-db.png`,
    tech: ["C++", "gRPC", "RocksDB", "React"],
    github: "#",
    demo: "#",
  },
];

/* ─── spring configs ───────────────────────────────────── */
const TILT_SPRING = { stiffness: 340, damping: 28, mass: 0.4 };
const PARA_SPRING = { stiffness: 140, damping: 22, mass: 1.2 };
const FADE_SPRING = { stiffness: 180, damping: 24 };
/** Floaty, lazy spring for the magnetic pull layer */
const MAG_SPRING  = { stiffness: 110, damping: 18, mass: 0.9 };

/* ─────────────────────────────────────────────────────────
   useMagneticPull
   Attaches a single window mousemove listener. When the
   cursor is within `threshold` px of the element's centre
   it returns spring-animated x/y values that pull the
   element toward the cursor by up to `maxPull` pixels.
   The stable `anchorRef` never moves, so the rect is always
   accurate and there is no feedback oscillation.
───────────────────────────────────────────────────────── */
function useMagneticPull(
  anchorRef: React.RefObject<HTMLElement | null>,
  disabled = false,
  threshold = 220,
  maxPull = 18,
) {
  const rawX = useMotionValue(0);
  const rawY = useMotionValue(0);
  const x = useSpring(rawX, MAG_SPRING);
  const y = useSpring(rawY, MAG_SPRING);

  useEffect(() => {
    if (disabled) return;

    const onMove = (e: MouseEvent) => {
      const el = anchorRef.current;
      if (!el) return;
      const r  = el.getBoundingClientRect();
      const cx = r.left + r.width  / 2;
      const cy = r.top  + r.height / 2;
      const dx = e.clientX - cx;
      const dy = e.clientY - cy;
      const dist = Math.sqrt(dx * dx + dy * dy);

      if (dist < threshold) {
        /* pull strength falls off linearly with distance */
        const force = (1 - dist / threshold) * maxPull;
        rawX.set((dx / dist) * force);
        rawY.set((dy / dist) * force);
      } else {
        rawX.set(0);
        rawY.set(0);
      }
    };

    window.addEventListener("mousemove", onMove, { passive: true });
    return () => window.removeEventListener("mousemove", onMove);
  }, [anchorRef, disabled, threshold, maxPull, rawX, rawY]);

  return { x, y };
}

/* ─── 3D hover image ───────────────────────────────────── */
function ProjectImage({ src, alt }: { src: string; alt: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const reducedMotion = useReducedMotion();

  /* raw normalised mouse positions: –1 → +1 */
  const nx = useMotionValue(0);
  const ny = useMotionValue(0);

  /* spring-smoothed active state (0 = rest, 1 = hovered) */
  const rawActive = useMotionValue(0);
  const active = useSpring(rawActive, FADE_SPRING);

  /* tilt */
  const rotateY = useSpring(useTransform(nx, [-1, 1], [-14, 14]), TILT_SPRING);
  const rotateX = useSpring(useTransform(ny, [-1, 1], [10, -10]), TILT_SPRING);
  const scale   = useSpring(1, { stiffness: 300, damping: 28 });

  /* image parallax — moves opposite to tilt, slower spring */
  const imgX = useSpring(useTransform(nx, [-1, 1], [16, -16]), PARA_SPRING);
  const imgY = useSpring(useTransform(ny, [-1, 1], [11, -11]), PARA_SPRING);

  /* specular highlight: bright ellipse at exact cursor position */
  const specX = useTransform(nx, [-1, 1], ["8%",  "92%"]);
  const specY = useTransform(ny, [-1, 1], ["8%",  "92%"]);

  /* foil iridescence: opposite direction, 40% cursor speed */
  const foilX = useTransform(nx, [-1, 1], ["70%", "30%"]);
  const foilY = useTransform(ny, [-1, 1], ["70%", "30%"]);

  /* directional shadow shifts with tilt angle */
  const shadowDx = useTransform(rotateY, [-14, 14], [26, -26]);
  const shadowDy = useTransform(rotateX, [10, -10], [-18, 18]);
  const boxShadow = useMotionTemplate`${shadowDx}px ${shadowDy}px 80px rgba(0,0,0,0.8), 0 6px 24px rgba(0,0,0,0.55), 0 0 60px rgba(245,158,11,0.10)`;

  /* gradient strings */
  const specBg = useMotionTemplate`radial-gradient(ellipse 52% 44% at ${specX} ${specY}, rgba(255,255,255,0.15) 0%, rgba(245,158,11,0.07) 42%, transparent 68%)`;
  const foilBg = useMotionTemplate`radial-gradient(ellipse 58% 50% at ${foilX} ${foilY}, rgba(245,158,11,0.30) 0%, rgba(220,38,38,0.18) 42%, rgba(99,102,241,0.06) 72%, transparent 88%)`;

  /* image grayscale fades to 0 on hover */
  const grayPct   = useTransform(active, [0, 1], [38, 0]);
  const imgFilter = useMotionTemplate`grayscale(${grayPct}%)`;

  /* dim overlay and rim driven by active spring */
  const dimOpacity = useTransform(active, [0, 1], [0.42, 0]);
  const rimAlpha   = useTransform(active, [0, 1], [0.2, 0.6]);
  const rimShadow  = useMotionTemplate`inset 0 0 0 1.5px rgba(245,158,11,${rimAlpha})`;
  const cornerOpacity = useTransform(active, [0, 1], [0.35, 1.0]);
  const scanOpacity   = useTransform(active, [0, 1], [0, 1]);

  const onMove = (e: React.MouseEvent) => {
    if (!ref.current || reducedMotion) return;
    const r = ref.current.getBoundingClientRect();
    nx.set((e.clientX - r.left) / r.width  * 2 - 1);
    ny.set((e.clientY - r.top)  / r.height * 2 - 1);
  };
  const onEnter = () => { scale.set(1.03); rawActive.set(1); };
  const onLeave = () => { nx.set(0); ny.set(0); scale.set(1); rawActive.set(0); };

  return (
    <div style={{ perspective: "1000px" }} className="w-full">
      <motion.div
        ref={ref}
        className="relative rounded-xl overflow-hidden aspect-[16/9] cursor-none select-none"
        style={{
          rotateX: reducedMotion ? 0 : rotateX,
          rotateY: reducedMotion ? 0 : rotateY,
          scale,
          boxShadow,
          willChange: "transform",
        }}
        onMouseMove={onMove}
        onMouseEnter={onEnter}
        onMouseLeave={onLeave}
        aria-label={alt}
      >
        {/* ── LAYER 1: Parallax image ── */}
        <motion.div
          className="absolute pointer-events-none"
          style={{
            top: "-8%", left: "-8%",
            width: "116%", height: "116%",
            x: reducedMotion ? 0 : imgX,
            y: reducedMotion ? 0 : imgY,
          }}
        >
          <motion.img
            src={src}
            alt={alt}
            className="w-full h-full object-cover"
            style={{ filter: imgFilter }}
            draggable={false}
            loading="lazy"
          />
        </motion.div>

        {/* ── LAYER 2: Dim overlay ── */}
        <motion.div
          className="absolute inset-0 pointer-events-none z-10"
          style={{ backgroundColor: "#060402", opacity: dimOpacity }}
        />

        {/* ── LAYER 3: Specular highlight ── */}
        <motion.div
          className="absolute inset-0 pointer-events-none z-20"
          style={{ background: specBg }}
        />

        {/* ── LAYER 4: Foil iridescence ── */}
        <motion.div
          className="absolute inset-0 pointer-events-none z-30 mix-blend-soft-light"
          style={{ background: foilBg }}
        />

        {/* ── LAYER 5: Amber scanline sweep ── */}
        <motion.div
          className="absolute left-0 right-0 h-[3px] pointer-events-none z-40"
          style={{
            background: "linear-gradient(to right, transparent 0%, rgba(245,158,11,0.85) 50%, transparent 100%)",
            opacity: scanOpacity,
            filter: "blur(0.5px)",
          }}
          animate={{ top: ["-3%", "106%"] }}
          transition={{ duration: 2.6, repeat: Infinity, ease: "linear" }}
        />

        {/* ── LAYER 6: Rim border ── */}
        <motion.div
          className="absolute inset-0 rounded-xl pointer-events-none z-50"
          style={{ boxShadow: rimShadow }}
        />

        {/* ── LAYER 7: Corner accents ── */}
        {(
          [
            "top-0 left-0 border-t-2 border-l-2",
            "top-0 right-0 border-t-2 border-r-2",
            "bottom-0 left-0 border-b-2 border-l-2",
            "bottom-0 right-0 border-b-2 border-r-2",
          ] as const
        ).map((cls, i) => (
          <motion.div
            key={i}
            className={`absolute w-6 h-6 pointer-events-none z-50 ${cls}`}
            style={{
              borderColor: "#f59e0b",
              opacity: cornerOpacity,
              filter: "drop-shadow(0 0 5px rgba(245,158,11,0.8))",
            }}
          />
        ))}
      </motion.div>
    </div>
  );
}

/* ─── single project row ───────────────────────────────── */
function ProjectCard({
  project,
  index,
}: {
  project: (typeof projects)[0];
  index: number;
}) {
  const isReversed      = index % 2 === 1;
  const reducedMotion   = useReducedMotion();

  /*
   * anchorRef sits on the OUTER static div — its rect never moves
   * so the distance calc is always accurate.
   * The magnetic translation is applied to the INNER motion.div,
   * which carries both the image and the ghost border together.
   */
  const anchorRef = useRef<HTMLDivElement>(null);
  const { x: magX, y: magY } = useMagneticPull(
    anchorRef,
    !!reducedMotion,
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 44 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.6, delay: index * 0.07 }}
      className={`flex flex-col ${
        isReversed ? "lg:flex-row-reverse" : "lg:flex-row"
      } gap-8 lg:gap-14 items-center`}
    >
      {/* ── image column ── */}
      <div ref={anchorRef} className="w-full lg:w-3/5 relative">
        {/* magnetic layer — wraps both image and ghost border */}
        <motion.div
          className="relative"
          style={{
            x: magX,
            y: magY,
            willChange: "transform",
          }}
        >
          <ProjectImage src={project.image} alt={project.title} />

          {/* decorative offset ghost border (travels with magnetic pull) */}
          <motion.div
            className={`absolute top-4 ${
              isReversed ? "-left-4" : "-right-4"
            } w-full h-full border rounded-xl -z-10`}
            style={{
              borderColor: "rgba(245,158,11,0.16)",
              aspectRatio: "16/9",
            }}
            whileHover={{
              x: isReversed ? -7 : 7,
              y: 7,
              borderColor: "rgba(245,158,11,0.36)",
            }}
            transition={{ duration: 0.35 }}
          />
        </motion.div>
      </div>

      {/* ── info column ── */}
      <div
        className={`w-full lg:w-2/5 flex flex-col z-20 ${
          isReversed
            ? "lg:items-start lg:text-left"
            : "lg:items-end lg:text-right"
        }`}
      >
        <div
          className="flex items-center gap-2 font-mono text-sm mb-2"
          style={{ color: "#f59e0b" }}
        >
          <Code className="w-4 h-4" aria-hidden="true" />
          <span>Featured Project</span>
        </div>

        <h3
          className="text-3xl font-bold text-foreground mb-6"
          style={{ fontFamily: "'Space Grotesk', sans-serif" }}
        >
          <motion.a
            href={project.demo}
            style={{ color: "inherit" }}
            whileHover={{ color: "#f59e0b" }}
            transition={{ duration: 0.18 }}
          >
            {project.title}
          </motion.a>
        </h3>

        <motion.div
          className="ember-glass p-6 rounded-xl mb-6 shadow-xl"
          whileHover={{
            borderColor: "rgba(245,158,11,0.35)",
            boxShadow: "0 0 24px rgba(245,158,11,0.08), 0 12px 40px rgba(0,0,0,0.5)",
          }}
          transition={{ duration: 0.25 }}
        >
          <p className="text-muted-foreground leading-relaxed text-left">
            {project.description}
          </p>
        </motion.div>

        <ul
          className={`flex flex-wrap gap-2.5 font-mono mb-8 ${
            isReversed ? "justify-start" : "lg:justify-end"
          }`}
        >
          {project.tech.map((tech) => (
            <motion.li
              key={tech}
              className="px-2.5 py-1 rounded-sm font-mono text-xs"
              style={{
                background: "rgba(245,158,11,0.08)",
                border: "1px solid rgba(245,158,11,0.18)",
                color: "rgba(254,243,199,0.7)",
              }}
              whileHover={{
                background: "rgba(245,158,11,0.18)",
                borderColor: "rgba(245,158,11,0.48)",
                color: "#f59e0b",
                scale: 1.07,
                boxShadow: "0 0 12px rgba(245,158,11,0.22)",
              }}
              transition={{ duration: 0.14 }}
            >
              {tech}
            </motion.li>
          ))}
        </ul>

        <div className="flex items-center gap-4">
          {[
            { href: project.github, Icon: Github,      label: `${project.title} GitHub` },
            { href: project.demo,   Icon: ExternalLink, label: `${project.title} live demo` },
          ].map(({ href, Icon, label }) => (
            <motion.a
              key={label}
              href={href}
              aria-label={label}
              className="w-10 h-10 flex items-center justify-center rounded-full text-muted-foreground"
              style={{
                background: "rgba(245,158,11,0.05)",
                border: "1px solid rgba(245,158,11,0.16)",
              }}
              whileHover={{
                color: "#f59e0b",
                backgroundColor: "rgba(245,158,11,0.14)",
                borderColor: "rgba(245,158,11,0.52)",
                scale: 1.15,
                boxShadow: "0 0 18px rgba(245,158,11,0.32)",
              }}
              whileTap={{ scale: 0.9 }}
              transition={{ duration: 0.16 }}
            >
              <Icon className="w-5 h-5" />
            </motion.a>
          ))}
        </div>
      </div>
    </motion.div>
  );
}

/* ─── section ──────────────────────────────────────────── */
export function Projects() {
  return (
    <section id="projects" className="py-24 container mx-auto px-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="mb-16"
      >
        <h2
          className="text-3xl md:text-4xl font-bold mb-4 flex items-center gap-3"
          style={{ fontFamily: "'Space Grotesk', sans-serif" }}
        >
          <span className="text-secondary font-mono text-xl font-normal">
            04.
          </span>
          Featured Work
        </h2>
        <div className="w-20 h-1 bg-primary shadow-[0_0_10px_var(--color-primary)]" />
      </motion.div>

      <div className="flex flex-col gap-28">
        {projects.map((project, index) => (
          <ProjectCard key={project.title} project={project} index={index} />
        ))}
      </div>
    </section>
  );
}
