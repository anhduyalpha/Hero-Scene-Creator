import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, X, Github, Mail, Terminal, ArrowUp } from "lucide-react";

const ITEMS = [
  {
    id: "top",
    label: "Back to Top",
    icon: <ArrowUp className="w-4 h-4" />,
    action: () => window.scrollTo({ top: 0, behavior: "smooth" }),
  },
  {
    id: "terminal",
    label: "Terminal",
    icon: <Terminal className="w-4 h-4" />,
    action: () => document.getElementById("terminal")?.scrollIntoView({ behavior: "smooth" }),
  },
  {
    id: "email",
    label: "Send Email",
    icon: <Mail className="w-4 h-4" />,
    action: () => { window.location.href = "mailto:anhduy@example.com?subject=Hello AlphaD"; },
  },
  {
    id: "github",
    label: "GitHub",
    icon: <Github className="w-4 h-4" />,
    action: () => window.open("https://github.com/anhduyalpha", "_blank"),
  },
];

export function SpeedDialFAB() {
  const [open, setOpen] = useState(false);

  const toggle = useCallback(() => setOpen((o) => !o), []);

  const handleItem = useCallback((action: () => void) => {
    action();
    setOpen(false);
  }, []);

  return (
    <div
      className="fixed bottom-8 left-6 z-40 flex flex-col-reverse items-start gap-3"
      aria-label="Quick actions"
    >
      {/* Action items */}
      <AnimatePresence>
        {open &&
          ITEMS.map((item, i) => (
            <motion.div
              key={item.id}
              className="flex items-center gap-2"
              initial={{ opacity: 0, y: 16, scale: 0.8 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 10, scale: 0.85 }}
              transition={{
                type: "spring",
                stiffness: 380,
                damping: 24,
                delay: open ? i * 0.055 : (ITEMS.length - 1 - i) * 0.04,
              }}
            >
              {/* Label */}
              <motion.span
                className="font-mono text-xs px-2 py-1 rounded-lg whitespace-nowrap select-none"
                style={{
                  background: "rgba(10,6,2,0.92)",
                  border: "1px solid rgba(245,158,11,0.2)",
                  color: "rgba(254,243,199,0.85)",
                  backdropFilter: "blur(12px)",
                }}
                initial={{ opacity: 0, x: 8 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 4 }}
                transition={{ delay: open ? i * 0.055 + 0.06 : 0, duration: 0.18 }}
              >
                {item.label}
              </motion.span>

              {/* Button */}
              <motion.button
                onClick={() => handleItem(item.action)}
                aria-label={item.label}
                className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0"
                style={{
                  background: "rgba(10,6,2,0.92)",
                  border: "1px solid rgba(245,158,11,0.25)",
                  backdropFilter: "blur(16px)",
                  color: "rgba(254,243,199,0.75)",
                  boxShadow: "0 4px 20px rgba(0,0,0,0.5)",
                }}
                whileHover={{
                  scale: 1.12,
                  color: "#f59e0b",
                  borderColor: "rgba(245,158,11,0.55)",
                  boxShadow: "0 0 16px rgba(245,158,11,0.3), 0 4px 20px rgba(0,0,0,0.5)",
                }}
                whileTap={{ scale: 0.92 }}
                transition={{ duration: 0.15 }}
              >
                {item.icon}
              </motion.button>
            </motion.div>
          ))}
      </AnimatePresence>

      {/* Main FAB */}
      <motion.button
        onClick={toggle}
        aria-label={open ? "Close quick actions" : "Open quick actions"}
        aria-expanded={open}
        className="w-12 h-12 rounded-full flex items-center justify-center relative overflow-hidden"
        style={{
          background: open
            ? "linear-gradient(135deg, rgba(245,158,11,0.2), rgba(180,83,9,0.15))"
            : "linear-gradient(135deg, #f59e0b, #ea580c)",
          border: open ? "1px solid rgba(245,158,11,0.4)" : "none",
          color: open ? "#f59e0b" : "#060402",
          boxShadow: open
            ? "0 0 24px rgba(245,158,11,0.2), 0 4px 20px rgba(0,0,0,0.5)"
            : "0 0 28px rgba(245,158,11,0.4), 0 4px 20px rgba(0,0,0,0.6)",
        }}
        whileHover={{ scale: 1.08 }}
        whileTap={{ scale: 0.93 }}
        transition={{ type: "spring", stiffness: 380, damping: 22 }}
      >
        {/* shimmer on FAB */}
        {!open && (
          <motion.div
            className="absolute inset-0 rounded-full pointer-events-none"
            style={{
              background:
                "linear-gradient(105deg, transparent 40%, rgba(255,255,255,0.22) 50%, transparent 60%)",
            }}
            initial={{ x: "-100%" }}
            animate={{ x: ["-100%", "200%"] }}
            transition={{ duration: 2.5, repeat: Infinity, repeatDelay: 1.5, ease: "easeInOut" }}
          />
        )}

        <motion.div
          initial={false}
          animate={{ rotate: open ? 45 : 0, scale: open ? 0.96 : 1 }}
          exit={{ rotate: 0, scale: 1 }}
          transition={{ type: "spring", stiffness: 380, damping: 22 }}
        >
          {open ? <X className="w-5 h-5" /> : <Plus className="w-5 h-5" />}
        </motion.div>
      </motion.button>
    </div>
  );
}
