import { useEffect } from "react";
import { useMotionValue, useSpring, motion } from "framer-motion";

export function AmbientSpotlight() {
  const rawX = useMotionValue(-9999);
  const rawY = useMotionValue(-9999);

  const x = useSpring(rawX, { stiffness: 60, damping: 20, mass: 1.2 });
  const y = useSpring(rawY, { stiffness: 60, damping: 20, mass: 1.2 });

  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      rawX.set(e.clientX);
      rawY.set(e.clientY);
    };
    window.addEventListener("mousemove", onMove, { passive: true });
    return () => window.removeEventListener("mousemove", onMove);
  }, [rawX, rawY]);

  return (
    <motion.div
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-[1] overflow-hidden"
      style={{ mixBlendMode: "normal" }}
    >
      <motion.div
        className="absolute rounded-full"
        style={{
          width: 700,
          height: 700,
          x,
          y,
          translateX: "-50%",
          translateY: "-50%",
          background:
            "radial-gradient(circle at center, rgba(245,158,11,0.055) 0%, rgba(180,83,9,0.03) 35%, transparent 70%)",
        }}
      />
    </motion.div>
  );
}
