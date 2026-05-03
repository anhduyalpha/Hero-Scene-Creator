import React, { useState, useRef, useCallback } from "react";
import { motion, useSpring, useMotionValue, AnimatePresence } from "framer-motion";
import { Send, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

/* ── ember particle burst ──────────────────────────────── */
interface Particle { id: number; angle: number; dist: number; size: number }
let PID = 0;
function spawnParticles(): Particle[] {
  return Array.from({ length: 14 }, (_, i) => ({
    id: PID++,
    angle: (i / 14) * 360 + Math.random() * 20,
    dist: 48 + Math.random() * 40,
    size: 3 + Math.random() * 4,
  }));
}

function EmberBurst({ particles }: { particles: Particle[] }) {
  return (
    <div className="absolute inset-0 pointer-events-none overflow-visible" aria-hidden="true">
      <AnimatePresence>
        {particles.map((p) => {
          const rad = (p.angle * Math.PI) / 180;
          const tx = Math.cos(rad) * p.dist;
          const ty = Math.sin(rad) * p.dist;
          return (
            <motion.span
              key={p.id}
              className="absolute rounded-full"
              style={{
                width: p.size,
                height: p.size,
                left: "50%",
                top: "50%",
                background: p.angle % 3 === 0 ? "#f59e0b" : p.angle % 3 === 1 ? "#dc2626" : "#fbbf24",
                boxShadow: `0 0 ${p.size + 2}px rgba(245,158,11,0.7)`,
                translateX: "-50%",
                translateY: "-50%",
              }}
              initial={{ x: 0, y: 0, opacity: 1, scale: 1 }}
              animate={{ x: tx, y: ty, opacity: 0, scale: 0 }}
              exit={{}}
              transition={{ duration: 0.55 + Math.random() * 0.25, ease: "easeOut" }}
            />
          );
        })}
      </AnimatePresence>
    </div>
  );
}

/* ── physics button ────────────────────────────────────── */
function HireMeButton({ isSubmitting }: { isSubmitting: boolean }) {
  const [particles, setParticles] = useState<Particle[]>([]);
  const rotZ = useMotionValue(0);
  const springRot = useSpring(rotZ, { stiffness: 500, damping: 14, mass: 0.6 });

  const wobble = useCallback(() => {
    const seq = [0, -4, 4, -3, 3, -1.5, 0];
    let i = 0;
    const tick = () => {
      if (i >= seq.length) return;
      rotZ.set(seq[i++]);
      setTimeout(tick, 55);
    };
    tick();
  }, [rotZ]);

  const handleClick = useCallback(() => {
    setParticles(spawnParticles());
    setTimeout(() => setParticles([]), 900);
  }, []);

  return (
    <motion.button
      type="submit"
      disabled={isSubmitting}
      className="mt-2 relative overflow-visible font-bold py-4 rounded-md flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed group"
      style={{
        background: "linear-gradient(135deg, #f59e0b 0%, #ea580c 100%)",
        color: "#060402",
        rotate: springRot,
        boxShadow: "0 4px 24px rgba(245,158,11,0.25)",
      }}
      whileHover={{
        scale: 1.035,
        boxShadow: "0 0 30px rgba(245,158,11,0.45), 0 6px 32px rgba(220,38,38,0.2)",
      }}
      whileTap={{ scale: 0.96 }}
      onHoverStart={wobble}
      onClick={handleClick}
      transition={{ type: "spring", stiffness: 380, damping: 22 }}
    >
      <EmberBurst particles={particles} />

      <motion.div
        className="absolute inset-0 rounded-md pointer-events-none"
        style={{
          background: "linear-gradient(105deg, transparent 40%, rgba(255,255,255,0.18) 50%, transparent 60%)",
        }}
        initial={{ x: "-100%" }}
        whileHover={{ x: "200%" }}
        transition={{ duration: 0.5, ease: "easeInOut" }}
      />

      <span className="relative z-10 flex items-center gap-2">
        {isSubmitting ? (
          <Loader2 className="w-5 h-5 animate-spin" />
        ) : (
          <>
            Send Message
            <motion.span
              animate={{ x: [0, 3, 0], y: [0, -3, 0] }}
              transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
            >
              <Send className="w-4 h-4" />
            </motion.span>
          </>
        )}
      </span>
    </motion.button>
  );
}

/* ── section ────────────────────────────────────────────── */
export function Contact() {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);

    const form = e.target as HTMLFormElement;
    const data = new FormData(form);
    const name = data.get("name") as string;
    const email = data.get("email") as string;
    const message = data.get("message") as string;

    const subject = encodeURIComponent(`Portfolio contact from ${name}`);
    const body = encodeURIComponent(`From: ${name} <${email}>\n\n${message}`);
    window.location.href = `mailto:anhduy@example.com?subject=${subject}&body=${body}`;

    setTimeout(() => {
      setIsSubmitting(false);
      form.reset();
      toast({
        title: "Transmission Complete",
        description: "Your email client has opened. Send the message to reach me directly.",
        duration: 5000,
      });
    }, 600);
  };

  return (
    <section id="contact" className="py-32 container mx-auto px-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="max-w-2xl mx-auto text-center mb-16"
      >
        <div className="inline-flex items-center justify-center gap-2 text-primary font-mono text-sm mb-4">
          <span className="text-secondary">08.</span> What's Next?
        </div>
        <h2 className="text-4xl md:text-5xl font-display font-bold mb-6 text-foreground">
          Get In Touch
        </h2>
        <p className="text-muted-foreground font-sans text-lg leading-relaxed mb-8">
          Whether you have a complex system architecture problem, a challenging frontend requirement,
          or just want to discuss the finer points of Rust vs Go — my inbox is open.
        </p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ delay: 0.2 }}
        className="max-w-xl mx-auto ember-glass p-8 rounded-xl relative overflow-hidden"
      >
        <div className="absolute top-0 left-0 w-8 h-8 border-t border-l border-primary/50 pointer-events-none" />
        <div className="absolute bottom-0 right-0 w-8 h-8 border-b border-r border-secondary/50 pointer-events-none" />

        <form ref={formRef} onSubmit={handleSubmit} className="flex flex-col gap-6">
          <div className="flex flex-col md:flex-row gap-6">
            <div className="flex flex-col gap-2 flex-1">
              <label htmlFor="name" className="text-sm font-mono text-muted-foreground">Name</label>
              <input
                type="text" id="name" name="name" required
                className="bg-background/50 border border-border rounded-md px-4 py-3 text-foreground focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/50 transition-all font-sans"
                placeholder="John Doe"
              />
            </div>
            <div className="flex flex-col gap-2 flex-1">
              <label htmlFor="email" className="text-sm font-mono text-muted-foreground">Email</label>
              <input
                type="email" id="email" name="email" required
                className="bg-background/50 border border-border rounded-md px-4 py-3 text-foreground focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/50 transition-all font-sans"
                placeholder="john@example.com"
              />
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <label htmlFor="message" className="text-sm font-mono text-muted-foreground">Message</label>
            <textarea
              id="message" name="message" required rows={5}
              className="bg-background/50 border border-border rounded-md px-4 py-3 text-foreground focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/50 transition-all font-sans resize-none"
              placeholder="Let's build something..."
            />
          </div>

          <HireMeButton isSubmitting={isSubmitting} />
        </form>
      </motion.div>
    </section>
  );
}
