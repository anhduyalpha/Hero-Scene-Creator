import React from "react";
import { motion } from "framer-motion";

export function About() {
  return (
    <section id="about" className="py-24 container mx-auto px-6 relative">
      <div className="flex flex-col md:flex-row gap-16 items-start">
        <div className="md:w-1/3">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="sticky top-32"
          >
            <h2 className="text-3xl md:text-4xl font-display font-bold mb-4 flex items-center gap-3">
              <span className="text-secondary font-mono text-xl font-normal">01.</span> 
              About Me
            </h2>
            <div className="w-20 h-1 bg-primary mb-8 shadow-[0_0_10px_var(--color-primary)]"></div>
          </motion.div>
        </div>
        
        <div className="md:w-2/3">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="prose prose-invert max-w-none text-lg text-muted-foreground font-sans leading-relaxed"
          >
            <p className="mb-6">
              I view software engineering the same way a blacksmith views forging metal. It requires immense heat, heavy strikes, and meticulous attention to detail. Since writing my first lines of code in a dimly lit dorm room, I've been fascinated by the process of turning raw logic into systems that withstand the test of time and scale.
            </p>
            <p className="mb-6">
              Currently, I'm a Senior Full-Stack Engineer building high-throughput infrastructure. I thrive in the midnight hours, where the noise of the day fades and deep focus takes over. Whether it's optimizing a complex PostgreSQL query, architecting a distributed Redis queue, or refining the micro-interactions of a React component, I approach every layer of the stack with the same level of craftsmanship.
            </p>
            <p>
              When I'm not striking the anvil of my mechanical keyboard, I'm contributing to open-source tooling, mentoring junior developers, and studying system design patterns.
            </p>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
