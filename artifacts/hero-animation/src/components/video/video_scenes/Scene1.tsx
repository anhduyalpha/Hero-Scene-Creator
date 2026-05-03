import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

export function Scene1() {
  const [phase, setPhase] = useState(0);

  useEffect(() => {
    const timers = [
      setTimeout(() => setPhase(1), 200),
      setTimeout(() => setPhase(2), 1000),
      setTimeout(() => setPhase(3), 2000),
      setTimeout(() => setPhase(4), 3000),
    ];
    return () => timers.forEach(t => clearTimeout(t));
  }, []);

  return (
    <motion.div 
      className="absolute inset-0 flex items-center justify-center p-12"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, scale: 1.1 }}
      transition={{ duration: 1 }}
    >
      <div className="max-w-4xl text-center">
        <motion.p 
          className="text-accent text-2xl font-mono tracking-widest uppercase mb-6"
          initial={{ opacity: 0, y: 20 }}
          animate={phase >= 1 ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.8 }}
        >
          Welcome to the future
        </motion.p>
        <h1 className="text-7xl md:text-9xl font-display font-bold text-bg-light leading-tight tracking-tighter">
          {'ELEVATE'.split('').map((char, i) => (
            <motion.span 
              key={i} 
              className="inline-block"
              initial={{ opacity: 0, y: 100, rotateX: -90 }}
              animate={phase >= 2 ? { opacity: 1, y: 0, rotateX: 0 } : { opacity: 0, y: 100, rotateX: -90 }}
              transition={{ type: 'spring', stiffness: 200, damping: 20, delay: phase >= 2 ? i * 0.05 : 0 }}
            >
              {char}
            </motion.span>
          ))}
        </h1>
        <motion.div 
          className="mt-8 text-3xl text-text-secondary font-light max-w-2xl mx-auto"
          initial={{ opacity: 0, y: 20 }}
          animate={phase >= 3 ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.8 }}
        >
          Immersive 3D experiences for your brand.
        </motion.div>
      </div>
    </motion.div>
  );
}
