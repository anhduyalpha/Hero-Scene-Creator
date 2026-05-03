import { useEffect, useRef } from "react";
import { useReducedMotion } from "framer-motion";

export function FilmGrain() {
  const divRef = useRef<HTMLDivElement>(null);
  const shouldReduce = useReducedMotion();

  useEffect(() => {
    if (shouldReduce) return;
    const el = divRef.current;
    if (!el) return;

    // Pre-bake 3 different noise tiles once at startup (cheap: 384×384 = 147k px each)
    // Browser GPU-caches these as textures; only a CSS string swap happens at 8fps
    const SIZE = 384;
    const urls = Array.from({ length: 3 }, () => {
      const c = document.createElement("canvas");
      c.width = c.height = SIZE;
      const ctx = c.getContext("2d");
      if (!ctx) return "";
      const img = ctx.createImageData(SIZE, SIZE);
      const d = img.data;
      for (let i = 0; i < d.length; i += 4) {
        const v = (Math.random() * 255) | 0;
        d[i] = d[i + 1] = d[i + 2] = v;
        d[i + 3] = (Math.random() * 18) | 0; // very low alpha
      }
      ctx.putImageData(img, 0, 0);
      return `url(${c.toDataURL()})`;
    });

    el.style.backgroundImage = urls[0];
    let idx = 0;

    // 8 fps — imperceptible grain without the per-frame CPU cost
    const timer = setInterval(() => {
      idx = (idx + 1) % 3;
      el.style.backgroundImage = urls[idx];
    }, 125);

    return () => clearInterval(timer);
  }, [shouldReduce]);

  if (shouldReduce) return null;

  return (
    <>
      {/* Grain layer — GPU-tiled, swapped at 8fps via setInterval */}
      <div
        ref={divRef}
        aria-hidden="true"
        className="pointer-events-none fixed inset-0"
        style={{
          zIndex: 3,
          backgroundRepeat: "repeat",
          backgroundSize: "384px 384px",
          opacity: 0.045,
          contain: "strict",
        }}
      />

      {/* Vignette — pure CSS, zero JS cost */}
      <div
        aria-hidden="true"
        className="pointer-events-none fixed inset-0"
        style={{
          zIndex: 3,
          background:
            "radial-gradient(ellipse 88% 88% at 50% 50%, transparent 42%, rgba(0,0,0,0.42) 100%)",
          contain: "strict",
        }}
      />

      {/* Edge gradients */}
      <div
        aria-hidden="true"
        className="pointer-events-none fixed inset-x-0 top-0 h-28"
        style={{
          zIndex: 3,
          background: "linear-gradient(180deg, rgba(0,0,0,0.25) 0%, transparent 100%)",
          contain: "strict",
        }}
      />
      <div
        aria-hidden="true"
        className="pointer-events-none fixed inset-x-0 bottom-0 h-28"
        style={{
          zIndex: 3,
          background: "linear-gradient(0deg, rgba(0,0,0,0.25) 0%, transparent 100%)",
          contain: "strict",
        }}
      />
    </>
  );
}
