import { motion, AnimatePresence } from "framer-motion";
import { MousePointer2, MousePointerClick } from "lucide-react";
import { useCursor } from "@/context/CursorContext";

export function CursorToggle() {
  const { enabled, toggle } = useCursor();

  return (
    <motion.div
      className="fixed bottom-6 right-6 z-[99990] flex items-center gap-2"
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 3.5, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
    >
      <AnimatePresence mode="wait">
        <motion.span
          key={enabled ? "on" : "off"}
          className="font-mono text-[10px] tracking-widest uppercase text-muted-foreground select-none"
          initial={{ opacity: 0, x: 4 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -4 }}
          transition={{ duration: 0.15 }}
        >
          {enabled ? "Custom" : "Default"}
        </motion.span>
      </AnimatePresence>

      <button
        onClick={toggle}
        aria-label={enabled ? "Switch to default cursor" : "Switch to custom cursor"}
        className="relative flex items-center group"
        style={{ cursor: enabled ? "none" : "pointer" }}
      >
        <div
          className={`relative w-12 h-6 rounded-full border transition-colors duration-300 ${
            enabled
              ? "bg-primary/20 border-primary/50"
              : "bg-muted border-border"
          }`}
        >
          <motion.div
            className={`absolute top-0.5 w-5 h-5 rounded-full flex items-center justify-center shadow-md transition-colors duration-300 ${
              enabled ? "bg-primary" : "bg-muted-foreground/40"
            }`}
            animate={{ x: enabled ? 25 : 2 }}
            transition={{ type: "spring", stiffness: 500, damping: 30 }}
          >
            <AnimatePresence mode="wait">
              {enabled ? (
                <motion.div
                  key="on"
                  initial={{ scale: 0, rotate: -30 }}
                  animate={{ scale: 1, rotate: 0 }}
                  exit={{ scale: 0, rotate: 30 }}
                  transition={{ duration: 0.15 }}
                >
                  <MousePointer2 className="w-2.5 h-2.5 text-primary-foreground" />
                </motion.div>
              ) : (
                <motion.div
                  key="off"
                  initial={{ scale: 0, rotate: 30 }}
                  animate={{ scale: 1, rotate: 0 }}
                  exit={{ scale: 0, rotate: -30 }}
                  transition={{ duration: 0.15 }}
                >
                  <MousePointerClick className="w-2.5 h-2.5 text-muted-foreground" />
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </div>

        {enabled && (
          <motion.div
            className="absolute inset-0 rounded-full bg-primary/10 blur-md -z-10"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          />
        )}
      </button>
    </motion.div>
  );
}
