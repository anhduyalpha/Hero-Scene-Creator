import { useState, useEffect, useRef } from "react";
import { ArrowRight, Terminal, Github, Twitter, Linkedin, Code2, Zap, Star } from "lucide-react";
import { motion, useMotionValue, useTransform, useSpring } from "framer-motion";

const TITLES = [
  "Full-Stack Engineer",
  "System Architect",
  "Open Source Creator",
  "UI/UX Designer",
];

function Avatar3D() {
  const cardRef = useRef<HTMLDivElement>(null);
  const rotateX = useMotionValue(0);
  const rotateY = useMotionValue(0);
  const springX = useSpring(rotateX, { stiffness: 180, damping: 28 });
  const springY = useSpring(rotateY, { stiffness: 180, damping: 28 });

  const glowX = useTransform(springY, [-15, 15], ["20%", "80%"]);
  const glowY = useTransform(springX, [-15, 15], ["20%", "80%"]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    const dx = (e.clientX - cx) / (rect.width / 2);
    const dy = (e.clientY - cy) / (rect.height / 2);
    rotateY.set(dx * 14);
    rotateX.set(-dy * 14);
  };

  const handleMouseLeave = () => {
    rotateX.set(0);
    rotateY.set(0);
  };

  return (
    <motion.div
      ref={cardRef}
      className="relative w-72 h-72 sm:w-96 sm:h-96 cursor-none"
      style={{ perspective: 900, transformStyle: "preserve-3d" }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      initial={{ opacity: 0, scale: 0.88 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.9, delay: 0.2 }}
    >
      <motion.div
        className="w-full h-full rounded-2xl overflow-hidden ember-glass relative"
        style={{
          rotateX: springX,
          rotateY: springY,
          transformStyle: "preserve-3d",
          boxShadow: "0 0 40px rgba(245,158,11,0.15), 0 32px 64px rgba(0,0,0,0.7)",
        }}
        whileHover={{ boxShadow: "0 0 60px rgba(245,158,11,0.28), 0 40px 80px rgba(0,0,0,0.8)" }}
        transition={{ duration: 0.4 }}
      >
        {/* Glow spot that tracks mouse */}
        <motion.div
          className="absolute inset-0 z-10 pointer-events-none rounded-2xl"
          style={{
            background: `radial-gradient(circle at ${glowX} ${glowY}, rgba(245,158,11,0.22) 0%, rgba(220,38,38,0.10) 40%, transparent 70%)`,
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-tr from-secondary/20 to-transparent z-10 mix-blend-overlay pointer-events-none" />
        <img
          src={`${import.meta.env.BASE_URL}avatar-ember.png`}
          alt="Anh Duy"
          className="w-full h-full object-cover grayscale-[20%] transition-all duration-700"
          draggable={false}
        />
        {/* Corner accents */}
        <div className="absolute top-0 left-0 w-12 h-12 border-t-2 border-l-2 border-primary shadow-[0_0_15px_var(--color-primary)] opacity-80 z-20 pointer-events-none" />
        <div className="absolute bottom-0 right-0 w-12 h-12 border-b-2 border-r-2 border-secondary shadow-[0_0_15px_var(--color-secondary)] opacity-80 z-20 pointer-events-none" />
        {/* Scanline sheen */}
        <motion.div
          className="absolute left-0 right-0 h-[2px] z-20 pointer-events-none"
          style={{ background: "linear-gradient(to right, transparent, rgba(245,158,11,0.5), transparent)" }}
          animate={{ top: ["-2%", "105%"] }}
          transition={{ duration: 3.5, repeat: Infinity, ease: "linear", repeatDelay: 2 }}
        />
      </motion.div>

      {/* Floating handle badge */}
      <motion.div
        className="absolute -bottom-5 -right-4 z-30 px-3 py-1.5 rounded-full font-mono text-xs font-bold tracking-wider"
        style={{
          background: "linear-gradient(135deg, rgba(245,158,11,0.2) 0%, rgba(180,83,9,0.15) 100%)",
          border: "1px solid rgba(245,158,11,0.45)",
          boxShadow: "0 0 16px rgba(245,158,11,0.3)",
          backdropFilter: "blur(12px)",
          color: "#f59e0b",
        }}
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.2, duration: 0.5 }}
      >
        @AlphaD
      </motion.div>
    </motion.div>
  );
}

export function Hero() {
  const [titleIndex, setTitleIndex] = useState(0);
  const [displayText, setDisplayText] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const currentTitle = TITLES[titleIndex];
    const typeSpeed = isDeleting ? 45 : 90;

    const timeout = setTimeout(() => {
      if (!isDeleting && displayText === currentTitle) {
        setTimeout(() => setIsDeleting(true), 2200);
        return;
      }
      if (isDeleting && displayText === "") {
        setIsDeleting(false);
        setTitleIndex((prev) => (prev + 1) % TITLES.length);
        return;
      }
      setDisplayText((prev) =>
        isDeleting ? prev.slice(0, -1) : currentTitle.slice(0, prev.length + 1)
      );
    }, typeSpeed);

    return () => clearTimeout(timeout);
  }, [displayText, isDeleting, titleIndex]);

  return (
    <section id="hero" className="min-h-[90vh] flex flex-col justify-center container mx-auto px-6 py-20 pt-32">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-8 items-center">

        {/* Left: Text */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="flex flex-col gap-6 order-2 lg:order-1"
        >
          <div className="flex items-center gap-2 font-mono text-sm" style={{ color: "#f59e0b" }}>
            <Terminal className="w-4 h-4" aria-hidden="true" />
            <span>Hello, World. I am</span>
          </div>

          <h1
            className="text-5xl sm:text-7xl lg:text-8xl font-bold leading-tight tracking-tight"
            style={{ fontFamily: "'Space Grotesk', sans-serif" }}
          >
            <span
              style={{
                background: "linear-gradient(135deg, #fef3c7 0%, #fde68a 20%, #f59e0b 55%, #dc2626 100%)",
                WebkitBackgroundClip: "text",
                backgroundClip: "text",
                color: "transparent",
              }}
            >
              Anh Duy
            </span>
          </h1>

          {/* Nickname tag */}
          <div className="flex items-center gap-3 -mt-2">
            <div
              className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full font-mono text-sm font-semibold"
              style={{
                background: "linear-gradient(135deg, rgba(245,158,11,0.18) 0%, rgba(180,83,9,0.10) 100%)",
                border: "1px solid rgba(245,158,11,0.4)",
                boxShadow: "0 0 12px rgba(245,158,11,0.2)",
                color: "#f59e0b",
              }}
            >
              <span style={{ fontSize: "14px" }}>α</span>
              AlphaD
            </div>
            <div className="h-[1px] w-12" style={{ background: "linear-gradient(to right, rgba(245,158,11,0.4), transparent)" }} />
          </div>

          <div className="text-2xl sm:text-3xl text-foreground/80 h-10 flex items-center" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
            <span>{displayText}</span>
            <span className="w-[3px] h-[1em] bg-primary ml-1 animate-blink shadow-[0_0_8px_var(--color-primary)]" />
          </div>

          <p className="text-muted-foreground text-lg max-w-xl leading-relaxed mt-1">
            Forging scalable systems and beautiful interfaces in the midnight hours.
            I build resilient architectures that handle millions of requests without breaking a sweat.
          </p>

          <div className="flex flex-wrap items-center gap-4 mt-6">
            <motion.a
              href="#projects"
              className="group relative px-6 py-3 rounded-md font-semibold flex items-center gap-2 overflow-hidden"
              style={{
                background: "linear-gradient(135deg, #f59e0b 0%, #b45309 100%)",
                color: "#060402",
                boxShadow: "0 0 20px rgba(245,158,11,0.35)",
              }}
              whileHover={{ scale: 1.04, boxShadow: "0 0 32px rgba(245,158,11,0.55)" }}
              whileTap={{ scale: 0.97 }}
              transition={{ duration: 0.18 }}
            >
              <span className="relative z-10">View Projects</span>
              <ArrowRight className="w-4 h-4 relative z-10 transition-transform duration-200 group-hover:translate-x-1" />
            </motion.a>

            <motion.a
              href="#contact"
              className="group px-6 py-3 rounded-md ember-glass font-medium flex items-center gap-2"
              style={{ color: "#fef3c7", borderColor: "rgba(245,158,11,0.35)" }}
              whileHover={{
                scale: 1.04,
                boxShadow: "0 0 20px rgba(245,158,11,0.2)",
                borderColor: "rgba(245,158,11,0.6)",
              }}
              whileTap={{ scale: 0.97 }}
              transition={{ duration: 0.18 }}
            >
              Contact Me
            </motion.a>
          </div>

          <div className="flex items-center gap-2 mt-6">
            {[
              { icon: Github, label: "GitHub" },
              { icon: Twitter, label: "Twitter" },
              { icon: Linkedin, label: "LinkedIn" },
            ].map(({ icon: Icon, label }) => (
              <motion.a
                key={label}
                href="#"
                aria-label={label}
                className="w-10 h-10 flex items-center justify-center rounded-full text-muted-foreground"
                style={{ background: "rgba(245,158,11,0.04)", border: "1px solid rgba(245,158,11,0.12)" }}
                whileHover={{
                  color: "#f59e0b",
                  backgroundColor: "rgba(245,158,11,0.12)",
                  borderColor: "rgba(245,158,11,0.4)",
                  scale: 1.12,
                  boxShadow: "0 0 14px rgba(245,158,11,0.3)",
                }}
                whileTap={{ scale: 0.92 }}
                transition={{ duration: 0.18 }}
              >
                <Icon className="w-4 h-4" />
              </motion.a>
            ))}
          </div>
        </motion.div>

        {/* Right: 3D Avatar */}
        <div className="order-1 lg:order-2 flex justify-center lg:justify-end">
          <Avatar3D />
        </div>
      </div>

      {/* Stat cards */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, delay: 0.5 }}
        className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-20"
      >
        {[
          { label: "Experience", value: "5+ Yrs", icon: Zap },
          { label: "Projects",   value: "42",     icon: Code2 },
          { label: "Commits",    value: "1.8k",   icon: Github },
          { label: "Rating",     value: "5.0 ★",  icon: Star },
        ].map((stat, i) => (
          <motion.div
            key={i}
            className="ember-glass p-5 md:p-6 rounded-xl flex flex-col gap-3 group"
            whileHover={{
              borderColor: "rgba(245,158,11,0.5)",
              boxShadow: "0 0 24px rgba(245,158,11,0.15), 0 8px 32px rgba(0,0,0,0.4)",
              y: -3,
            }}
            transition={{ duration: 0.2 }}
          >
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground font-mono text-xs uppercase tracking-wider">{stat.label}</span>
              <stat.icon className="w-4 h-4 text-primary/50 group-hover:text-primary transition-colors duration-200" aria-hidden="true" />
            </div>
            <div
              className="text-3xl font-bold"
              style={{
                fontFamily: "'Space Grotesk', sans-serif",
                background: "linear-gradient(135deg, #fef3c7 0%, #f59e0b 100%)",
                WebkitBackgroundClip: "text",
                backgroundClip: "text",
                color: "transparent",
              }}
            >
              {stat.value}
            </div>
          </motion.div>
        ))}
      </motion.div>
    </section>
  );
}
