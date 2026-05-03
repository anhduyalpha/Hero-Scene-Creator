import { motion, useMotionValue, useSpring, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";
import { useCursor } from "@/context/CursorContext";

export function CustomCursor() {
  const { enabled } = useCursor();
  const mouseX = useMotionValue(-100);
  const mouseY = useMotionValue(-100);
  const [isHovering, setIsHovering] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [isClicking, setIsClicking] = useState(false);

  const springConfig = { damping: 28, stiffness: 420, mass: 0.4 };
  const cursorX = useSpring(mouseX, springConfig);
  const cursorY = useSpring(mouseY, springConfig);

  const trailSpring = { damping: 42, stiffness: 180, mass: 0.9 };
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
        'a, button, [role="button"], input, textarea, label, select, [data-magnetic], h1, h2, h3'
      );
      setIsHovering(!!interactive);
    };

    const handleMouseDown = () => setIsClicking(true);
    const handleMouseUp = () => setIsClicking(false);
    const handleMouseLeave = () => setIsVisible(false);
    const handleMouseEnter = () => setIsVisible(true);

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseover", handleMouseOver);
    window.addEventListener("mousedown", handleMouseDown);
    window.addEventListener("mouseup", handleMouseUp);
    document.documentElement.addEventListener("mouseleave", handleMouseLeave);
    document.documentElement.addEventListener("mouseenter", handleMouseEnter);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseover", handleMouseOver);
      window.removeEventListener("mousedown", handleMouseDown);
      window.removeEventListener("mouseup", handleMouseUp);
      document.documentElement.removeEventListener("mouseleave", handleMouseLeave);
      document.documentElement.removeEventListener("mouseenter", handleMouseEnter);
    };
  }, [enabled, mouseX, mouseY, isVisible]);

  return (
    <AnimatePresence>
      {enabled && (
        <>
          {/* Main ember dot */}
          <motion.div
            key="cursor-dot"
            className="fixed top-0 left-0 pointer-events-none z-[99999] rounded-full"
            style={{ x: cursorX, y: cursorY, translateX: "-50%", translateY: "-50%" }}
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: isVisible ? 1 : 0, scale: isClicking ? 0.7 : 1 }}
            exit={{ opacity: 0, scale: 0 }}
            transition={{ duration: 0.15 }}
          >
            <motion.div
              className="rounded-full"
              animate={{
                width: isHovering ? 48 : 10,
                height: isHovering ? 48 : 10,
                backgroundColor: isHovering ? "rgba(220,38,38,0.15)" : "rgba(245,158,11,1)",
                boxShadow: isHovering
                  ? "0 0 20px rgba(220,38,38,0.6), 0 0 40px rgba(245,158,11,0.3), inset 0 0 12px rgba(245,158,11,0.2)"
                  : "0 0 8px rgba(245,158,11,0.9), 0 0 20px rgba(245,158,11,0.5), 0 0 40px rgba(245,158,11,0.2)",
                border: isHovering ? "1.5px solid rgba(245,158,11,0.6)" : "0px solid transparent",
              }}
              transition={{ duration: 0.22, ease: "easeOut" }}
            />
          </motion.div>

          {/* Ember ring trail */}
          <motion.div
            key="cursor-ring"
            className="fixed top-0 left-0 pointer-events-none z-[99998] rounded-full"
            style={{
              x: trailX,
              y: trailY,
              translateX: "-50%",
              translateY: "-50%",
              width: 28,
              height: 28,
              border: "1.5px solid rgba(245,158,11,0.45)",
              boxShadow: "0 0 8px rgba(245,158,11,0.25), inset 0 0 4px rgba(245,158,11,0.1)",
            }}
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: isVisible && !isHovering ? 0.85 : 0, scale: isClicking ? 1.3 : 1 }}
            exit={{ opacity: 0, scale: 0 }}
            transition={{ duration: 0.2 }}
          />

          {/* Outer ember halo — only on hover */}
          <motion.div
            key="cursor-halo"
            className="fixed top-0 left-0 pointer-events-none z-[99997] rounded-full"
            style={{ x: trailX, y: trailY, translateX: "-50%", translateY: "-50%" }}
            initial={{ opacity: 0, scale: 0 }}
            animate={{
              opacity: isHovering && isVisible ? 0.35 : 0,
              scale: isHovering ? 1 : 0.5,
              width: 80,
              height: 80,
            }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
          >
            <div
              className="w-full h-full rounded-full"
              style={{
                background: "radial-gradient(circle, rgba(245,158,11,0.25) 0%, rgba(220,38,38,0.15) 50%, transparent 75%)",
                filter: "blur(4px)",
              }}
            />
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
