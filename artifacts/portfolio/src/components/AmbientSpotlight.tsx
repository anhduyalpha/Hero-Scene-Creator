import { useEffect } from "react";
import { useMotionValue, useSpring, motion } from "framer-motion";
import { SPRING_SPOTLIGHT, subscribeMouseMove } from "@/lib/motion";

export function AmbientSpotlight() {
  const rawX = useMotionValue(-9999);
  const rawY = useMotionValue(-9999);

  const x = useSpring(rawX, SPRING_SPOTLIGHT);
  const y = useSpring(rawY, SPRING_SPOTLIGHT);

  useEffect(() => {
    return subscribeMouseMove((mx, my) => {
      rawX.set(mx);
      rawY.set(my);
    });
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
