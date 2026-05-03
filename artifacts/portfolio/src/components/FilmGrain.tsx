import { useEffect, useRef } from "react";

export function FilmGrain() {
  const filterRef = useRef<SVGFETurbulenceElement>(null);

  useEffect(() => {
    let raf: number;
    let seed = 0;
    const tick = () => {
      seed = (seed + 1) % 999;
      filterRef.current?.setAttribute("seed", String(seed));
      raf = requestAnimationFrame(tick);
    };
    // Run at ~18 fps for grain animation (skip 3 frames out of 4)
    let frame = 0;
    const throttle = () => {
      frame = (frame + 1) % 3;
      if (frame === 0) {
        seed = (seed + 1) % 999;
        filterRef.current?.setAttribute("seed", String(seed));
      }
      raf = requestAnimationFrame(throttle);
    };
    raf = requestAnimationFrame(throttle);
    return () => cancelAnimationFrame(raf);
  }, []);

  return (
    <div
      className="pointer-events-none fixed inset-0 overflow-hidden"
      style={{ zIndex: 3 }}
      aria-hidden="true"
    >
      {/* Film grain */}
      <svg className="absolute inset-0 w-full h-full" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <filter id="film-grain" x="0%" y="0%" width="100%" height="100%">
            <feTurbulence
              ref={filterRef}
              type="fractalNoise"
              baseFrequency="0.72"
              numOctaves="4"
              seed="0"
              result="noiseOut"
            />
            <feColorMatrix type="saturate" values="0" in="noiseOut" result="grayNoise" />
            <feBlend in="SourceGraphic" in2="grayNoise" mode="screen" result="blended" />
            <feComposite in="blended" in2="SourceGraphic" operator="in" />
          </filter>
        </defs>
        <rect
          width="100%"
          height="100%"
          filter="url(#film-grain)"
          opacity="0.038"
          fill="white"
        />
      </svg>

      {/* Vignette */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 90% 90% at 50% 50%, transparent 45%, rgba(0,0,0,0.45) 100%)",
        }}
      />

      {/* Top edge darkening */}
      <div
        className="absolute inset-x-0 top-0 h-32"
        style={{
          background:
            "linear-gradient(180deg, rgba(0,0,0,0.28) 0%, transparent 100%)",
        }}
      />

      {/* Bottom edge darkening */}
      <div
        className="absolute inset-x-0 bottom-0 h-32"
        style={{
          background:
            "linear-gradient(0deg, rgba(0,0,0,0.28) 0%, transparent 100%)",
        }}
      />
    </div>
  );
}
