import React from "react";
import { motion } from "framer-motion";
import { Database, Server, Cpu, Globe, Boxes, Layers } from "lucide-react";

export function Skills() {
  const skillCategories = [
    {
      title: "Frontend Architecture",
      icon: Globe,
      skills: ["React", "Next.js", "TypeScript", "Tailwind CSS", "Framer Motion", "Zustand"]
    },
    {
      title: "Backend Systems",
      icon: Server,
      skills: ["Node.js", "Go", "Rust", "GraphQL", "REST APIs", "gRPC"]
    },
    {
      title: "Data & Storage",
      icon: Database,
      skills: ["PostgreSQL", "Redis", "MongoDB", "Elasticsearch", "Kafka"]
    },
    {
      title: "Infrastructure",
      icon: Cpu,
      skills: ["Kubernetes", "Docker", "AWS", "Terraform", "CI/CD"]
    },
    {
      title: "Architecture Patterns",
      icon: Layers,
      skills: ["Microservices", "Event-Driven", "Serverless", "System Design"]
    },
    {
      title: "Tools & Practices",
      icon: Boxes,
      skills: ["Git", "Jest", "Cypress", "Agile", "TDD"]
    }
  ];

  return (
    <section id="skills" className="py-24 container mx-auto px-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="mb-16"
      >
        <h2 className="text-3xl md:text-4xl font-display font-bold mb-4 flex items-center gap-3">
          <span className="text-secondary font-mono text-xl font-normal">02.</span> 
          The Arsenal
        </h2>
        <div className="w-20 h-1 bg-primary shadow-[0_0_10px_var(--color-primary)]"></div>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {skillCategories.map((category, index) => (
          <motion.div
            key={category.title}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.1 }}
            className="ember-glass p-6 rounded-xl group hover:border-primary/50 transition-colors duration-300"
          >
            <div className="flex items-center gap-4 mb-6">
              <div className="p-3 rounded-lg bg-primary/10 text-primary group-hover:bg-primary group-hover:text-background transition-colors duration-300">
                <category.icon className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-display font-semibold text-foreground">{category.title}</h3>
            </div>
            <ul className="flex flex-wrap gap-2">
              {category.skills.map(skill => (
                <li 
                  key={skill}
                  className="px-3 py-1 bg-background/50 border border-border rounded-md text-sm font-mono text-muted-foreground group-hover:border-primary/30 transition-colors duration-300"
                >
                  {skill}
                </li>
              ))}
            </ul>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
