import { motion, useMotionValue, useSpring } from "framer-motion";
import { useEffect, useRef, useState } from "react";

const SECTIONS = [
  { id: "about",       label: "About" },
  { id: "skills",      label: "Skills" },
  { id: "code-craft",  label: "The Craft" },
  { id: "projects",    label: "Projects" },
  { id: "open-source", label: "Open Source" },
  { id: "experience",  label: "Experience" },
  { id: "blog",        label: "Blog" },
  { id: "terminal",    label: "Terminal" },
  { id: "contact",     label: "Contact" },
];

const MAG_RANGE = 72;
const MAG_STRENGTH = 10;

// Single shared mouse position — avoids N event listeners
type MouseCB = (x: number, y: number) => void;
const _cbs = new Set<MouseCB>();
let _attached = false;
function subscribeMouseMove(cb: MouseCB) {
  if (!_attached) {
    _attached = true;
    window.addEventListener(
      "mousemove",
      (e) => _cbs.forEach((fn) => fn(e.clientX, e.clientY)),
      { passive: true }
    );
  }
  _cbs.add(cb);
  return () => _cbs.delete(cb);
}

function NavDot({
  id,
  label,
  isActive,
}: {
  id: string;
  label: string;
  isActive: boolean;
}) {
  const dotRef = useRef<HTMLAnchorElement>(null);
  const cachedRect = useRef<DOMRect | null>(null);
  const rawX = useMotionValue(0);
  const rawY = useMotionValue(0);
  const x = useSpring(rawX, { stiffness: 300, damping: 26, mass: 0.5 });
  const y = useSpring(rawY, { stiffness: 300, damping: 26, mass: 0.5 });
  const [hovered, setHovered] = useState(false);

  useEffect(() => {
    // Cache rect; only re-measure on resize (not on every mousemove)
    const measure = () => {
      cachedRect.current = dotRef.current?.getBoundingClientRect() ?? null;
    };
    measure();
    window.addEventListener("resize", measure, { passive: true });
    window.addEventListener("scroll", measure, { passive: true });

    const unsub = subscribeMouseMove((mx, my) => {
      const r = cachedRect.current;
      if (!r) return;
      const cx = r.left + r.width / 2;
      const cy = r.top + r.height / 2;
      const dx = mx - cx;
      const dy = my - cy;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < MAG_RANGE) {
        const force = (1 - dist / MAG_RANGE) * MAG_STRENGTH;
        rawX.set((dx / dist) * force);
        rawY.set((dy / dist) * force);
      } else {
        rawX.set(0);
        rawY.set(0);
      }
    });

    return () => {
      unsub();
      window.removeEventListener("resize", measure);
      window.removeEventListener("scroll", measure);
    };
  }, [rawX, rawY]);

  return (
    <motion.a
      ref={dotRef}
      href={`#${id}`}
      aria-label={label}
      className="relative flex items-center justify-end group"
      style={{ x, y }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <motion.span
        className="absolute right-6 font-mono text-xs whitespace-nowrap pointer-events-none select-none"
        style={{ color: "#f59e0b" }}
        initial={{ opacity: 0, x: 8 }}
        animate={{ opacity: hovered || isActive ? 1 : 0, x: hovered || isActive ? 0 : 8 }}
        transition={{ duration: 0.18 }}
      >
        {label}
      </motion.span>

      <motion.span
        className="w-2 h-2 rounded-full block relative"
        style={{
          background: isActive ? "#f59e0b" : "rgba(245,158,11,0.25)",
          boxShadow: isActive
            ? "0 0 10px rgba(245,158,11,0.7), 0 0 20px rgba(245,158,11,0.3)"
            : "none",
        }}
        animate={isActive ? { scale: [1, 1.3, 1] } : { scale: 1 }}
        transition={isActive ? { duration: 2, repeat: Infinity, ease: "easeInOut" } : {}}
        whileHover={{
          scale: 1.6,
          background: "#f59e0b",
          boxShadow: "0 0 14px rgba(245,158,11,0.8)",
        }}
      />
    </motion.a>
  );
}

export function MagneticNavDots() {
  const [activeSection, setActiveSection] = useState("");

  useEffect(() => {
    const ids = SECTIONS.map((s) => s.id);
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) setActiveSection(e.target.id);
        });
      },
      { rootMargin: "-45% 0px -45% 0px" }
    );
    ids.forEach((id) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, []);

  return (
    <div
      className="fixed right-4 top-1/2 -translate-y-1/2 z-40 hidden xl:flex flex-col gap-4 pointer-events-auto"
      aria-label="Section navigation"
    >
      {SECTIONS.map((s) => (
        <NavDot key={s.id} {...s} isActive={activeSection === s.id} />
      ))}
    </div>
  );
}
