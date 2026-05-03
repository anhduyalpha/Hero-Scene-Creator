import { motion } from "framer-motion";

const paragraphs = [
  "I view software engineering the same way a blacksmith views forging metal. It requires immense heat, heavy strikes, and meticulous attention to detail. Since writing my first lines of code in a dimly lit dorm room, I've been fascinated by the process of turning raw logic into systems that withstand the test of time and scale.",
  "Currently, I'm a Software Engineer building high-throughput infrastructure. I thrive in the midnight hours, where the noise of the day fades and deep focus takes over. Whether it's optimizing a complex PostgreSQL query, architecting a distributed Redis queue, or refining the micro-interactions of a React component, I approach every layer of the stack with the same level of craftsmanship.",
  "When I'm not striking the anvil of my mechanical keyboard, I'm contributing to open-source tooling, mentoring junior developers, and studying system design patterns.",
];

const HEADING = "About Me";
const CHAR_STAGGER = 0.038;

function CharStagger({ text, className }: { text: string; className?: string }) {
  return (
    <span className={className} aria-label={text}>
      {text.split("").map((char, i) => (
        <motion.span
          key={i}
          style={{ display: char === " " ? "inline" : "inline-block" }}
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.35, delay: 0.1 + i * CHAR_STAGGER, ease: [0.16, 1, 0.3, 1] }}
        >
          {char === " " ? "\u00A0" : char}
        </motion.span>
      ))}
    </span>
  );
}

export function About() {
  return (
    <section id="about" className="py-24 container mx-auto px-6 relative">
      <div className="flex flex-col md:flex-row gap-16 items-start">

        <div className="md:w-1/3">
          <div className="sticky top-32">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              <h2 className="text-3xl md:text-4xl font-display font-bold mb-4 flex items-center gap-3">
                <motion.span
                  className="text-secondary font-mono text-xl font-normal"
                  initial={{ opacity: 0, x: -10 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4 }}
                >
                  01.
                </motion.span>
                <CharStagger text={HEADING} />
              </h2>

              <motion.div
                className="h-1 bg-primary shadow-[0_0_10px_var(--color-primary)] mb-8 origin-left"
                initial={{ scaleX: 0, width: "5rem" }}
                whileInView={{ scaleX: 1, width: "5rem" }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
              />

              <motion.div
                className="space-y-4 mt-6"
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.7 }}
              >
                {[
                  { label: "Based in", value: "Ho Chi Minh City" },
                  { label: "Open to", value: "Remote · Worldwide" },
                  { label: "Focus", value: "Full-Stack · Systems" },
                ].map((item) => (
                  <div key={item.label} className="flex flex-col gap-0.5">
                    <span className="font-mono text-xs tracking-widest uppercase" style={{ color: "rgba(245,158,11,0.5)" }}>
                      {item.label}
                    </span>
                    <span className="text-sm font-medium text-foreground/80">{item.value}</span>
                  </div>
                ))}
              </motion.div>
            </motion.div>
          </div>
        </div>

        <div className="md:w-2/3 flex flex-col gap-7">
          {paragraphs.map((text, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 22 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.6, delay: i * 0.12, ease: [0.16, 1, 0.3, 1] }}
              className="relative pl-5 group"
            >
              <motion.div
                className="absolute left-0 top-1 bottom-1 w-[2px] rounded-full origin-top"
                style={{ background: "linear-gradient(to bottom, #f59e0b, #dc2626)" }}
                initial={{ scaleY: 0 }}
                whileInView={{ scaleY: 1 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.5, delay: 0.1 + i * 0.12, ease: [0.16, 1, 0.3, 1] }}
              />
              <p className="text-lg text-muted-foreground font-sans leading-relaxed">
                {text}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
