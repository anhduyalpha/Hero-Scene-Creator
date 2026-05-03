import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

export function Scene3() {
  const [phase, setPhase] = useState(0);

  useEffect(() => {
    const timers = [
      setTimeout(() => setPhase(1), 200),
      setTimeout(() => setPhase(2), 600),
      setTimeout(() => setPhase(3), 1000),
    ];
    return () => timers.forEach(t => clearTimeout(t));
  }, []);

  return (
    <motion.div 
      className="absolute inset-0 flex items-center justify-end p-24"
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 1.1 }}
      transition={{ duration: 1 }}
    >
      <div className="max-w-2xl text-right relative z-10">
        <motion.h2 
          className="text-6xl font-display font-bold text-bg-light mb-6"
          initial={{ opacity: 0, x: 50 }}
          animate={phase >= 1 ? { opacity: 1, x: 0 } : { opacity: 0, x: 50 }}
          transition={{ duration: 0.8 }}
        >
          Dynamic Motion
        </motion.h2>
        
        <div className="flex flex-col items-end gap-6">
          {[
            "Fluid 3D primitives",
            "Real-time distortion",
            "Cinematic lighting"
          ].map((item, i) => (
            <motion.div 
              key={i}
              className="bg-secondary/40 backdrop-blur-sm border border-primary/30 px-8 py-4 rounded-xl text-xl text-text-primary"
              initial={{ opacity: 0, x: 50 }}
              animate={phase >= 2 ? { opacity: 1, x: 0 } : { opacity: 0, x: 50 }}
              transition={{ duration: 0.6, delay: phase >= 2 ? i * 0.15 : 0 }}
            >
              {item}
            </motion.div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}
