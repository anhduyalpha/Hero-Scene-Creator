import { useEffect, useRef } from "react";
import { useReducedMotion } from "framer-motion";

interface Spark {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;   // 0→1 (0 = just born, 1 = dead)
  size: number;
  hue: number;    // 20–45 for amber/ember palette
}

const COLORS = ["#f59e0b", "#ea580c", "#fbbf24", "#dc2626", "#fb923c"];

export function ClickSparkBurst() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const sparksRef = useRef<Spark[]>([]);
  const rafRef    = useRef<number>(0);
  const activeRef = useRef(false);
  const shouldReduce = useReducedMotion();

  useEffect(() => {
    if (shouldReduce) return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Resize
    const resize = () => {
      canvas.width  = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener("resize", resize, { passive: true });

    // RAF loop — only runs when there are live sparks
    const loop = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      sparksRef.current = sparksRef.current.filter((s) => s.life < 1);

      for (const s of sparksRef.current) {
        s.vy += 0.22;           // gravity
        s.vx *= 0.97;           // drag
        s.vy *= 0.97;
        s.x  += s.vx;
        s.y  += s.vy;
        s.life += 0.028;

        const alpha = 1 - s.life;
        const r     = s.size * (1 - s.life * 0.4);
        ctx.beginPath();
        ctx.arc(s.x, s.y, Math.max(r, 0.1), 0, Math.PI * 2);
        ctx.fillStyle = COLORS[Math.round(s.hue) % COLORS.length];
        ctx.globalAlpha = alpha * 0.9;
        ctx.fill();
        // glow
        ctx.shadowBlur  = r * 4;
        ctx.shadowColor = COLORS[Math.round(s.hue) % COLORS.length];
        ctx.fill();
        ctx.shadowBlur  = 0;
      }
      ctx.globalAlpha = 1;

      if (sparksRef.current.length > 0) {
        rafRef.current = requestAnimationFrame(loop);
      } else {
        activeRef.current = false;
      }
    };

    // Click handler
    const onClick = (e: MouseEvent) => {
      const count = 10 + Math.floor(Math.random() * 6);
      for (let i = 0; i < count; i++) {
        const angle = (Math.PI * 2 * i) / count + (Math.random() - 0.5) * 0.6;
        const speed = 2.5 + Math.random() * 4.5;
        sparksRef.current.push({
          x:    e.clientX,
          y:    e.clientY,
          vx:   Math.cos(angle) * speed,
          vy:   Math.sin(angle) * speed - 1.5, // slight upward bias
          life: 0,
          size: 2 + Math.random() * 2.5,
          hue:  Math.floor(Math.random() * COLORS.length),
        });
      }
      if (!activeRef.current) {
        activeRef.current = true;
        rafRef.current = requestAnimationFrame(loop);
      }
    };

    window.addEventListener("click", onClick, { passive: true });

    return () => {
      cancelAnimationFrame(rafRef.current);
      window.removeEventListener("click", onClick);
      window.removeEventListener("resize", resize);
    };
  }, [shouldReduce]);

  if (shouldReduce) return null;

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="pointer-events-none fixed inset-0"
      style={{ zIndex: 50 }}
    />
  );
}
