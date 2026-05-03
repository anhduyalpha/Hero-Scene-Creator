import React from "react";
import { motion } from "framer-motion";

export function Experience() {
  const experiences = [
    {
      role: "Staff Engineer",
      company: "Nexus Systems",
      period: "2021 - Present",
      description: "Architected and implemented a high-throughput distributed task queue handling 5M+ events per day. Led the migration from monolithic architecture to Go-based microservices, reducing latency by 40% and infrastructure costs by 25%. Mentored a team of 8 engineers.",
      tech: ["Go", "Kubernetes", "PostgreSQL", "Redis", "gRPC"]
    },
    {
      role: "Senior Full-Stack Engineer",
      company: "Vanguard Tech",
      period: "2018 - 2021",
      description: "Spearheaded the development of a real-time collaborative workspace used by 100k+ MAU. Implemented operational transforms for conflict-free concurrent editing. Built the frontend rendering engine using React and WebGL for complex data visualizations.",
      tech: ["React", "Node.js", "WebSockets", "MongoDB", "AWS"]
    },
    {
      role: "Software Engineer",
      company: "Aether Dynamics",
      period: "2016 - 2018",
      description: "Developed core features for a cloud-based logistics platform. Optimized database queries and caching strategies to improve dashboard load times by 3x. Implemented comprehensive test suites increasing coverage to 85%.",
      tech: ["JavaScript", "Python", "React", "PostgreSQL", "Docker"]
    }
  ];

  return (
    <section id="experience" className="py-24 container mx-auto px-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="mb-16"
      >
        <h2 className="text-3xl md:text-4xl font-display font-bold mb-4 flex items-center gap-3">
          <span className="text-secondary font-mono text-xl font-normal">03.</span> 
          Experience
        </h2>
        <div className="w-20 h-1 bg-primary shadow-[0_0_10px_var(--color-primary)]"></div>
      </motion.div>

      <div className="max-w-4xl mx-auto">
        {experiences.map((exp, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.1 }}
            className="relative pl-8 md:pl-0 mb-12 last:mb-0"
          >
            <div className="md:grid md:grid-cols-5 md:gap-8 items-start">
              {/* Timeline indicator for mobile */}
              <div className="absolute left-0 top-2 bottom-0 w-px bg-border md:hidden"></div>
              <div className="absolute left-[-4px] top-2 w-2 h-2 rounded-full bg-primary md:hidden shadow-[0_0_8px_var(--color-primary)]"></div>

              <div className="md:col-span-1 mb-2 md:mb-0 md:text-right pt-1">
                <span className="text-primary font-mono text-sm uppercase tracking-wider">{exp.period}</span>
              </div>
              
              <div className="md:col-span-4 ember-glass p-6 md:p-8 rounded-xl relative group hover:border-primary/50 transition-all duration-300">
                {/* Timeline connector for desktop */}
                <div className="hidden md:block absolute -left-[4.5rem] top-8 w-8 h-px bg-border group-hover:bg-primary/50 transition-colors"></div>
                <div className="hidden md:block absolute -left-[4.5rem] top-[1.875rem] w-3 h-3 rounded-full bg-background border-2 border-primary shadow-[0_0_8px_var(--color-primary)] group-hover:scale-125 transition-transform"></div>

                <h3 className="text-2xl font-display font-bold text-foreground mb-1">
                  {exp.role} <span className="text-primary">@</span> <span className="text-foreground/90">{exp.company}</span>
                </h3>
                
                <p className="text-muted-foreground font-sans mt-4 leading-relaxed">
                  {exp.description}
                </p>
                
                <div className="flex flex-wrap gap-2 mt-6">
                  {exp.tech.map(tech => (
                    <span 
                      key={tech}
                      className="px-2 py-1 bg-primary/10 text-primary font-mono text-xs rounded border border-primary/20"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
