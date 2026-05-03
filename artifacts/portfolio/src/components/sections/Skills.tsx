import { motion } from "framer-motion";
import { Database, Server, Cpu, Globe, Boxes, Layers } from "lucide-react";

const skillCategories = [
  {
    title: "Frontend Architecture",
    icon: Globe,
    color: "#f59e0b",
    skills: ["React", "Next.js", "TypeScript", "Tailwind CSS", "Framer Motion", "Zustand"],
  },
  {
    title: "Backend Systems",
    icon: Server,
    color: "#dc2626",
    skills: ["Node.js", "Go", "Rust", "GraphQL", "REST APIs", "gRPC"],
  },
  {
    title: "Data & Storage",
    icon: Database,
    color: "#f59e0b",
    skills: ["PostgreSQL", "Redis", "MongoDB", "Elasticsearch", "Kafka"],
  },
  {
    title: "Infrastructure",
    icon: Cpu,
    color: "#b45309",
    skills: ["Kubernetes", "Docker", "AWS", "Terraform", "CI/CD"],
  },
  {
    title: "Architecture Patterns",
    icon: Layers,
    color: "#dc2626",
    skills: ["Microservices", "Event-Driven", "Serverless", "System Design"],
  },
  {
    title: "Tools & Practices",
    icon: Boxes,
    color: "#f59e0b",
    skills: ["Git", "Jest", "Cypress", "Agile", "TDD"],
  },
];

const HEADING = "The Arsenal";

function CharStagger({ text, className }: { text: string; className?: string }) {
  return (
    <span className={className} aria-label={text}>
      {text.split("").map((char, i) => (
        <motion.span
          key={i}
          style={{ display: char === " " ? "inline" : "inline-block" }}
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.3, delay: 0.1 + i * 0.04, ease: [0.16, 1, 0.3, 1] }}
        >
          {char === " " ? "\u00A0" : char}
        </motion.span>
      ))}
    </span>
  );
}

function SkillCard({
  category,
  index,
}: {
  category: (typeof skillCategories)[0];
  index: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.55, delay: index * 0.08, ease: [0.16, 1, 0.3, 1] }}
      className="ember-glass p-6 rounded-xl group relative overflow-hidden hover:border-primary/50 transition-colors duration-300"
    >
      <motion.div
        className="absolute inset-0 pointer-events-none z-0"
        initial={{ opacity: 0, x: "-100%" }}
        whileHover={{ opacity: 1, x: "100%" }}
        transition={{ duration: 0.65, ease: "easeInOut" }}
        style={{
          background:
            "linear-gradient(105deg, transparent 40%, rgba(245,158,11,0.08) 50%, rgba(245,158,11,0.04) 55%, transparent 65%)",
        }}
      />

      <div className="relative z-10">
        <div className="flex items-center gap-4 mb-6">
          <motion.div
            className="p-3 rounded-lg transition-colors duration-300"
            style={{ background: `${category.color}18`, color: category.color }}
            whileHover={{ background: category.color, color: "#060402", scale: 1.08 }}
            transition={{ duration: 0.22 }}
          >
            <category.icon className="w-6 h-6" />
          </motion.div>
          <h3 className="text-xl font-display font-semibold text-foreground">
            {category.title}
          </h3>
        </div>

        <ul className="flex flex-wrap gap-2">
          {category.skills.map((skill, si) => (
            <motion.li
              key={skill}
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{
                type: "spring",
                stiffness: 320,
                damping: 24,
                delay: index * 0.06 + si * 0.045,
              }}
              className="px-3 py-1 bg-background/50 border border-border rounded-md text-sm font-mono text-muted-foreground cursor-default"
              whileHover={{
                borderColor: category.color,
                color: category.color,
                backgroundColor: `${category.color}12`,
                scale: 1.06,
                boxShadow: `0 0 10px ${category.color}30`,
              }}
            >
              {skill}
            </motion.li>
          ))}
        </ul>
      </div>

      <motion.div
        className="absolute bottom-0 left-0 right-0 h-[2px] origin-left"
        style={{
          background: `linear-gradient(to right, ${category.color}, transparent)`,
        }}
        initial={{ scaleX: 0 }}
        whileInView={{ scaleX: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, delay: 0.2 + index * 0.08 }}
      />
    </motion.div>
  );
}

export function Skills() {
  return (
    <section id="skills" className="py-24 container mx-auto px-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="mb-16"
      >
        <h2 className="text-3xl md:text-4xl font-display font-bold mb-4 flex items-center gap-3">
          <motion.span
            className="text-secondary font-mono text-xl font-normal"
            initial={{ opacity: 0, x: -10 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4 }}
          >
            02.
          </motion.span>
          <CharStagger text={HEADING} />
        </h2>
        <motion.div
          className="h-1 bg-primary shadow-[0_0_10px_var(--color-primary)] origin-left"
          initial={{ scaleX: 0, width: "5rem" }}
          whileInView={{ scaleX: 1, width: "5rem" }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.35, ease: [0.16, 1, 0.3, 1] }}
        />
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {skillCategories.map((category, index) => (
          <SkillCard key={category.title} category={category} index={index} />
        ))}
      </div>
    </section>
  );
}
