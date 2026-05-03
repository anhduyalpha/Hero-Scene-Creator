/**
 * motion.ts — Centralized animation system for AlphaD Portfolio
 *
 * Exports:
 *  • Spring configs          — named physics presets
 *  • Easing curves           — custom cubic-bezier values
 *  • Animation variants      — reusable framer-motion variant objects
 *  • Custom hooks            — useMagneticPull, useInViewSpring, useCanvasRAF, etc.
 *  • Shared mouse system     — single global mousemove listener (subscribeMouseMove)
 *  • Ember theme palette     — brand color constants
 *  • Viewport helpers        — common IntersectionObserver presets
 */

import {
  useEffect,
  useRef,
  useState,
  useCallback,
  type RefObject,
} from "react";
import {
  useMotionValue,
  useSpring,
  useInView,
  type SpringOptions,
  type Variants,
} from "framer-motion";

/* ─────────────────────────────────────────────────────────────
   EMBER THEME PALETTE
───────────────────────────────────────────────────────────── */
export const EMBER = {
  primary:   "#f59e0b",
  secondary: "#ea580c",
  red:       "#dc2626",
  warm:      "#fef3c7",
  gold:      "#fbbf24",
  brown:     "#b45309",
  bg:        "#060402",
  glass:     "rgba(10,6,2,0.88)",

  /* alpha variants */
  primary10:  "rgba(245,158,11,0.10)",
  primary20:  "rgba(245,158,11,0.20)",
  primary35:  "rgba(245,158,11,0.35)",
  primary55:  "rgba(245,158,11,0.55)",
  warm70:     "rgba(254,243,199,0.70)",
  warm45:     "rgba(254,243,199,0.45)",
} as const;

/* ─────────────────────────────────────────────────────────────
   EASING CURVES
───────────────────────────────────────────────────────────── */
/** Expo-out — snappy entrance, smooth settle */
export const EASE_EXPO:   [number, number, number, number] = [0.16, 1, 0.3, 1];
/** Ease-in-out — symmetric, used for loops */
export const EASE_INOUT:  [number, number, number, number] = [0.42, 0, 0.58, 1];
/** Ease-out — decelerate at end */
export const EASE_OUT:    [number, number, number, number] = [0, 0, 0.58, 1];
/** Ease-in — accelerate at start */
export const EASE_IN:     [number, number, number, number] = [0.42, 0, 1, 1];

/* ─────────────────────────────────────────────────────────────
   SPRING CONFIGS
   All values benchmarked for 60 fps on mid-range hardware.
───────────────────────────────────────────────────────────── */

/** Fast, crisp tilt — ProjectImage 3D hover */
export const SPRING_TILT: SpringOptions    = { stiffness: 340, damping: 28, mass: 0.4 };
/** Slow parallax layer — image inside ProjectImage */
export const SPRING_PARA: SpringOptions    = { stiffness: 140, damping: 22, mass: 1.2 };
/** Fade/active state transition */
export const SPRING_FADE: SpringOptions    = { stiffness: 180, damping: 24 };
/** Floaty magnetic pull — project card gravity */
export const SPRING_MAG: SpringOptions     = { stiffness: 110, damping: 18, mass: 0.9 };
/** Draggable timeline snap */
export const SPRING_SNAP: SpringOptions    = { stiffness: 280, damping: 30, mass: 0.8 };
/** Nav dot magnetic micro-movement */
export const SPRING_NAV: SpringOptions     = { stiffness: 300, damping: 26, mass: 0.5 };
/** Ambient spotlight follow — gentle, settles in ~8 frames */
export const SPRING_SPOTLIGHT: SpringOptions = { stiffness: 130, damping: 28, mass: 0.8 };
/** Snappy UI interactions — buttons, FAB */
export const SPRING_SNAPPY: SpringOptions  = { stiffness: 380, damping: 24 };
/** Slow orbital draw — SkillRadar polygon */
export const SPRING_ORBITAL: SpringOptions = { stiffness: 55,  damping: 18, mass: 1.0 };
/** Avatar 3D card tilt */
export const SPRING_AVATAR: SpringOptions  = { stiffness: 180, damping: 28 };
/** Career timeline dot snap */
export const SPRING_TIMELINE: SpringOptions = { stiffness: 320, damping: 24 };

/* ─────────────────────────────────────────────────────────────
   ANIMATION VARIANTS
   Ready-made framer-motion variant objects.
   Usage:
     <motion.div variants={fadeUp} initial="hidden" whileInView="visible"
       viewport={{ once: true }} />
───────────────────────────────────────────────────────── */

/** Fade + slide up from 20 px */
export const fadeUp: Variants = {
  hidden:  { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0,  transition: { duration: 0.5, ease: EASE_EXPO } },
};

/** Fade + slide down from -20 px */
export const fadeDown: Variants = {
  hidden:  { opacity: 0, y: -20 },
  visible: { opacity: 1, y: 0,  transition: { duration: 0.5, ease: EASE_EXPO } },
};

/** Fade + slide in from left */
export const fadeLeft: Variants = {
  hidden:  { opacity: 0, x: -24 },
  visible: { opacity: 1, x: 0,  transition: { duration: 0.5, ease: EASE_EXPO } },
};

/** Fade + slide in from right */
export const fadeRight: Variants = {
  hidden:  { opacity: 0, x: 24 },
  visible: { opacity: 1, x: 0,  transition: { duration: 0.5, ease: EASE_EXPO } },
};

/** Simple opacity fade */
export const fadeIn: Variants = {
  hidden:  { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.4, ease: EASE_INOUT } },
};

/** Scale in from 0.85 */
export const scaleIn: Variants = {
  hidden:  { opacity: 0, scale: 0.85 },
  visible: { opacity: 1, scale: 1,  transition: { duration: 0.5, ease: EASE_EXPO } },
};

/** Spring scale pop */
export const popIn: Variants = {
  hidden:  { opacity: 0, scale: 0 },
  visible: {
    opacity: 1, scale: 1,
    transition: { type: "spring", ...SPRING_SNAPPY },
  },
};

/** Stagger container — wrap children that each have their own variants */
export const staggerContainer: Variants = {
  hidden:  {},
  visible: { transition: { staggerChildren: 0.08, delayChildren: 0.1 } },
};

/** Fast stagger for dense lists */
export const staggerFast: Variants = {
  hidden:  {},
  visible: { transition: { staggerChildren: 0.04, delayChildren: 0.05 } },
};

/** Origin-left horizontal line draw (use with scaleX) */
export const drawLine: Variants = {
  hidden:  { scaleX: 0, originX: 0 },
  visible: { scaleX: 1, transition: { duration: 0.6, delay: 0.3, ease: EASE_EXPO } },
};

/** Vertical timeline line draw (use with scaleY) */
export const drawLineY: Variants = {
  hidden:  { scaleY: 0, originY: 0 },
  visible: { scaleY: 1, transition: { duration: 0.8, ease: EASE_EXPO } },
};

/** Character-by-character stagger helper
 *  Wrap in a parent with staggerContainer variants.
 */
export const charReveal: Variants = {
  hidden:  { opacity: 0, y: 12 },
  visible: {
    opacity: 1, y: 0,
    transition: { duration: 0.35, ease: EASE_EXPO },
  },
};

/* ─────────────────────────────────────────────────────────────
   SHARED GLOBAL MOUSE SYSTEM
   Single mousemove listener for the entire app.
   Components subscribe/unsubscribe without creating extra listeners.
───────────────────────────────────────────────────────── */
type MouseCB = (x: number, y: number) => void;
const _mouseCBs = new Set<MouseCB>();
let _mouseAttached = false;

/**
 * Subscribe to global mousemove events.
 * Returns an unsubscribe function.
 *
 * @example
 * useEffect(() => {
 *   return subscribeMouseMove((x, y) => { ... });
 * }, []);
 */
export function subscribeMouseMove(cb: MouseCB): () => void {
  if (!_mouseAttached) {
    _mouseAttached = true;
    window.addEventListener(
      "mousemove",
      (e) => _mouseCBs.forEach((fn) => fn(e.clientX, e.clientY)),
      { passive: true }
    );
  }
  _mouseCBs.add(cb);
  return () => _mouseCBs.delete(cb);
}

/* ─────────────────────────────────────────────────────────────
   HOOK: useMagneticPull
   Spring-animated x/y that pulls an element toward the cursor
   when the cursor is within `threshold` px of the element.
───────────────────────────────────────────────────────── */
/**
 * @param anchorRef — ref on the STATIC outer container (rect never changes)
 * @param disabled  — set true to skip (e.g. reduced-motion)
 * @param threshold — cursor radius that triggers the pull (px)
 * @param maxPull   — maximum displacement (px)
 */
export function useMagneticPull(
  anchorRef: RefObject<HTMLElement | null>,
  disabled  = false,
  threshold = 220,
  maxPull   = 18,
) {
  const rawX = useMotionValue(0);
  const rawY = useMotionValue(0);
  const x    = useSpring(rawX, SPRING_MAG);
  const y    = useSpring(rawY, SPRING_MAG);

  useEffect(() => {
    if (disabled) return;
    return subscribeMouseMove((mx, my) => {
      const el = anchorRef.current;
      if (!el) return;
      const r    = el.getBoundingClientRect();
      const cx   = r.left + r.width  / 2;
      const cy   = r.top  + r.height / 2;
      const dx   = mx - cx;
      const dy   = my - cy;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < threshold) {
        const force = (1 - dist / threshold) * maxPull;
        rawX.set((dx / dist) * force);
        rawY.set((dy / dist) * force);
      } else {
        rawX.set(0);
        rawY.set(0);
      }
    });
  }, [anchorRef, disabled, threshold, maxPull, rawX, rawY]);

  return { x, y };
}

/* ─────────────────────────────────────────────────────────────
   HOOK: useInViewSpring
   Returns a spring-animated 0→1 value that fires once the
   element enters the viewport. Use to drive polygon draws,
   bar fills, progress lines, etc.
───────────────────────────────────────────────────────── */
/**
 * @param margin — rootMargin for IntersectionObserver (default "-80px")
 * @param spring — spring config (default SPRING_ORBITAL)
 */
export function useInViewSpring(
  margin: string = "-80px",
  spring: SpringOptions = SPRING_ORBITAL,
) {
  const ref       = useRef<HTMLDivElement>(null);
  const inView    = useInView(ref, { once: true, margin: margin as `${number}px` });
  const [fired, setFired] = useState(false);
  const progress  = useSpring(0, spring);
  const [value, setValue] = useState(0);

  useEffect(() => {
    if (inView && !fired) {
      setFired(true);
      progress.set(1);
    }
  }, [inView, fired, progress]);

  useEffect(() => progress.on("change", setValue), [progress]);

  return { ref, value, fired };
}

/* ─────────────────────────────────────────────────────────────
   HOOK: useCachedRect
   Returns a cached DOMRect that only re-measures on resize
   and scroll — not on every mousemove.
───────────────────────────────────────────────────────── */
export function useCachedRect<T extends HTMLElement>(
  ref: RefObject<T | null>,
) {
  const rect = useRef<DOMRect | null>(null);

  useEffect(() => {
    const measure = () => {
      rect.current = ref.current?.getBoundingClientRect() ?? null;
    };
    measure();
    window.addEventListener("resize", measure, { passive: true });
    window.addEventListener("scroll", measure, { passive: true });
    return () => {
      window.removeEventListener("resize", measure);
      window.removeEventListener("scroll", measure);
    };
  }, [ref]);

  return rect;
}

/* ─────────────────────────────────────────────────────────────
   HOOK: useCanvasRAF
   Sets up a canvas with a requestAnimationFrame loop.
   Handles resize, cleanup, and provides a stable draw callback.
───────────────────────────────────────────────────────── */
/**
 * @param draw — called each frame with (ctx, canvas, deltaMs)
 * @param active — pause the loop when false
 */
export function useCanvasRAF(
  draw: (ctx: CanvasRenderingContext2D, canvas: HTMLCanvasElement, delta: number) => void,
  active = true,
) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const drawRef   = useRef(draw);
  drawRef.current = draw;

  useEffect(() => {
    if (!active) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const resize = () => {
      canvas.width  = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    };
    resize();
    window.addEventListener("resize", resize, { passive: true });

    let raf = 0;
    let last = performance.now();

    const loop = (now: number) => {
      drawRef.current(ctx, canvas, now - last);
      last = now;
      raf  = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
    };
  }, [active]);

  return canvasRef;
}

/* ─────────────────────────────────────────────────────────────
   HOOK: useThrottledRAF
   Fires a callback at most once per `interval` ms using
   requestAnimationFrame for synchronisation with the display.
   Useful for grain swap, clock ticks, etc.
───────────────────────────────────────────────────────── */
export function useThrottledRAF(cb: () => void, interval: number) {
  const cbRef = useRef(cb);
  cbRef.current = cb;

  useEffect(() => {
    let raf  = 0;
    let last = 0;
    const tick = (now: number) => {
      if (now - last >= interval) {
        cbRef.current();
        last = now;
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [interval]);
}

/* ─────────────────────────────────────────────────────────────
   HOOK: useScrollSection
   Tracks which section ID is currently in the viewport center.
───────────────────────────────────────────────────────── */
export function useScrollSection(ids: string[]) {
  const [active, setActive] = useState("");

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => { if (e.isIntersecting) setActive(e.target.id); });
      },
      { rootMargin: "-45% 0px -45% 0px" },
    );
    ids.forEach((id) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, [ids]);

  return active;
}

/* ─────────────────────────────────────────────────────────────
   HOOK: useReduceOnScroll
   Returns true when the page has scrolled past `threshold` px.
   Used for navbar shrink effects.
───────────────────────────────────────────────────────── */
export function useReduceOnScroll(threshold = 40) {
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > threshold);
    fn();
    window.addEventListener("scroll", fn, { passive: true });
    return () => window.removeEventListener("scroll", fn);
  }, [threshold]);
  return scrolled;
}

/* ─────────────────────────────────────────────────────────────
   UTIL: clamp
───────────────────────────────────────────────────────── */
export const clamp = (value: number, min: number, max: number) =>
  Math.max(min, Math.min(max, value));

/* ─────────────────────────────────────────────────────────────
   UTIL: lerp
───────────────────────────────────────────────────────── */
export const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

/* ─────────────────────────────────────────────────────────────
   UTIL: polarToXY
   Converts polar coordinates to cartesian (used in SkillRadar,
   TechOrbit, etc.)
───────────────────────────────────────────────────────── */
export function polarToXY(
  angleDeg: number,
  radius: number,
  cx = 0,
  cy = 0,
) {
  const rad = (angleDeg - 90) * (Math.PI / 180);
  return { x: cx + radius * Math.cos(rad), y: cy + radius * Math.sin(rad) };
}

/* ─────────────────────────────────────────────────────────────
   UTIL: buildNoiseDataURL
   Pre-bakes a SIZE×SIZE noise canvas and returns a CSS
   data URL for GPU-tiled grain overlays.
───────────────────────────────────────────────────────── */
export function buildNoiseDataURL(size = 384, maxAlpha = 18): string {
  const c   = document.createElement("canvas");
  c.width   = c.height = size;
  const ctx = c.getContext("2d");
  if (!ctx) return "";
  const img = ctx.createImageData(size, size);
  const d   = img.data;
  for (let i = 0; i < d.length; i += 4) {
    const v = (Math.random() * 255) | 0;
    d[i] = d[i + 1] = d[i + 2] = v;
    d[i + 3] = (Math.random() * maxAlpha) | 0;
  }
  ctx.putImageData(img, 0, 0);
  return `url(${c.toDataURL()})`;
}

/* ─────────────────────────────────────────────────────────────
   UTIL: getLocalTime
   Returns HH:MM:SS string for a given IANA timezone.
───────────────────────────────────────────────────────── */
export function getLocalTime(tz: string): string {
  return new Date().toLocaleTimeString("en-GB", {
    timeZone: tz,
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
  });
}

/* ─────────────────────────────────────────────────────────────
   HOOK: useFirstVisit
   Returns true on the very first visit (uses localStorage).
   Marks visited after `delay` ms.
───────────────────────────────────────────────────────── */
export function useFirstVisit(storageKey: string, delay = 0): boolean {
  const [isFirst] = useState(() => !localStorage.getItem(storageKey));
  const mark = useCallback(() => {
    localStorage.setItem(storageKey, "1");
  }, [storageKey]);

  useEffect(() => {
    if (!isFirst) return;
    if (delay === 0) { mark(); return; }
    const t = setTimeout(mark, delay);
    return () => clearTimeout(t);
  }, [isFirst, delay, mark]);

  return isFirst;
}
