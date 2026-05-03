import { motion, useMotionValue, useSpring, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";
import { useCursor } from "@/context/CursorContext";

export function CustomCursor() {
  const { enabled } = useCursor();
  const mouseX = useMotionValue(-100);
  const mouseY = useMotionValue(-100);
  const [isHovering, setIsHovering] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  const springConfig = { damping: 28, stiffness: 400, mass: 0.5 };
  const cursorX = useSpring(mouseX, springConfig);
  const cursorY = useSpring(mouseY, springConfig);

  const trailSpring = { damping: 40, stiffness: 200, mass: 0.8 };
  const trailX = useSpring(mouseX, trailSpring);
  const trailY = useSpring(mouseY, trailSpring);

  useEffect(() => {
    if (!enabled) return;

    const handleMouseMove = (e: MouseEvent) => {
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);
      if (!isVisible) setIsVisible(true);
    };

    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as Element;
      const interactive = target.closest(
        'a, button, [role="button"], input, textarea, label, select, [data-magnetic], h1, h2, h3, h4, h5, h6, p, li, span'
      );
      setIsHovering(!!interactive);
    };

    const handleMouseLeave = () => setIsVisible(false);
    const handleMouseEnter = () => setIsVisible(true);

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseover", handleMouseOver);
    document.documentElement.addEventListener("mouseleave", handleMouseLeave);
    document.documentElement.addEventListener("mouseenter", handleMouseEnter);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseover", handleMouseOver);
      document.documentElement.removeEventListener("mouseleave", handleMouseLeave);
      document.documentElement.removeEventListener("mouseenter", handleMouseEnter);
    };
  }, [enabled, mouseX, mouseY, isVisible]);

  return (
    <AnimatePresence>
      {enabled && (
        <>
          <motion.div
            key="cursor-dot"
            className="fixed top-0 left-0 pointer-events-none z-[99999] rounded-full mix-blend-difference"
            style={{ x: cursorX, y: cursorY, translateX: "-50%", translateY: "-50%" }}
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: isVisible ? 1 : 0, scale: 1 }}
            exit={{ opacity: 0, scale: 0 }}
            transition={{ duration: 0.2 }}
          >
            <motion.div
              className="rounded-full bg-white"
              animate={{ width: isHovering ? 52 : 10, height: isHovering ? 52 : 10 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
            />
          </motion.div>

          <motion.div
            key="cursor-ring"
            className="fixed top-0 left-0 pointer-events-none z-[99998] rounded-full border border-white/30"
            style={{ x: trailX, y: trailY, translateX: "-50%", translateY: "-50%", width: 28, height: 28 }}
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: isVisible && !isHovering ? 0.6 : 0, scale: 1 }}
            exit={{ opacity: 0, scale: 0 }}
            transition={{ duration: 0.2 }}
          />
        </>
      )}
    </AnimatePresence>
  );
}
