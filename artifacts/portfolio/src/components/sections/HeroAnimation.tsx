import { motion } from "framer-motion";
import { ChevronDown } from "lucide-react";

export function HeroAnimation() {
  return (
    <section
      id="hero"
      className="relative w-full overflow-hidden"
      style={{ height: "100svh" }}
      aria-label="Interactive portfolio hero"
    >
      {/* pointer-events: none lets Lenis / native scroll pass through the iframe */}
      <iframe
        src="/"
        title="Hero animation — AlphaD portfolio"
        className="absolute inset-0 w-full h-full border-0 block"
        loading="eager"
        allow="autoplay"
        style={{ colorScheme: "dark", pointerEvents: "none" }}
      />

      <motion.a
        href="#intro"
        aria-label="Scroll to portfolio introduction"
        className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center gap-1.5 cursor-pointer"
        style={{ pointerEvents: "auto" }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 4, duration: 1.2 }}
      >
        <span
          className="font-mono text-[0.6rem] tracking-[0.3em] uppercase"
          style={{ color: "rgba(245,158,11,0.5)" }}
        >
          scroll
        </span>
        <motion.div
          animate={{ y: [0, 6, 0] }}
          transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
        >
          <ChevronDown
            className="w-5 h-5"
            style={{ color: "rgba(245,158,11,0.45)" }}
          />
        </motion.div>
      </motion.a>
    </section>
  );
}
