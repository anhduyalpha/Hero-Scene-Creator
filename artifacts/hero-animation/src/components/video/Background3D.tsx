import { motion } from 'framer-motion';

const sceneConfigs = [
  { sphere1: { x: '60vw', y: '15vh', scale: 1.2, opacity: 0.7 }, sphere2: { x: '10vw', y: '60vh', scale: 0.8 }, torus: { x: '75vw', y: '65vh', rotateZ: 0 }, gem: { x: '20vw', y: '20vh', rotateY: 0 } },
  { sphere1: { x: '15vw', y: '20vh', scale: 1.5, opacity: 0.6 }, sphere2: { x: '70vw', y: '40vh', scale: 1.1 }, torus: { x: '20vw', y: '70vh', rotateZ: 45 }, gem: { x: '75vw', y: '15vh', rotateY: 180 } },
  { sphere1: { x: '50vw', y: '65vh', scale: 0.9, opacity: 0.8 }, sphere2: { x: '85vw', y: '20vh', scale: 0.7 }, torus: { x: '60vw', y: '25vh', rotateZ: 90 }, gem: { x: '10vw', y: '50vh', rotateY: 90 } },
  { sphere1: { x: '30vw', y: '40vh', scale: 1.3, opacity: 0.5 }, sphere2: { x: '60vw', y: '70vh', scale: 1.0 }, torus: { x: '15vw', y: '25vh', rotateZ: 135 }, gem: { x: '80vw', y: '60vh', rotateY: 270 } },
];

export function Background3D({ currentScene }: { currentScene: number }) {
  const cfg = sceneConfigs[currentScene % sceneConfigs.length];
  const trans = { duration: 2.4, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] };

  return (
    <div className="absolute inset-0 overflow-hidden" style={{ perspective: '1000px' }}>

      {/* Dark warm gradient base */}
      <div className="absolute inset-0" style={{
        background: 'radial-gradient(ellipse at 30% 40%, #3d1a08 0%, #1a0a03 40%, #0d0501 100%)'
      }} />

      {/* Animated warm mesh gradient */}
      <motion.div
        className="absolute inset-0"
        animate={{
          background: currentScene % 2 === 0
            ? 'radial-gradient(ellipse at 70% 60%, rgba(234,88,12,0.18) 0%, transparent 60%), radial-gradient(ellipse at 20% 30%, rgba(217,119,6,0.12) 0%, transparent 50%)'
            : 'radial-gradient(ellipse at 30% 70%, rgba(234,88,12,0.15) 0%, transparent 60%), radial-gradient(ellipse at 80% 20%, rgba(120,53,15,0.2) 0%, transparent 50%)',
        }}
        transition={{ duration: 2.5, ease: 'easeInOut' }}
      />

      {/* Large glowing sphere 1 — amber */}
      <motion.div
        className="absolute w-[38vw] h-[38vw] rounded-full"
        style={{
          background: 'radial-gradient(circle at 35% 35%, #f59e0b, #d97706 40%, #92400e 70%, transparent 100%)',
          filter: 'blur(2px)',
          boxShadow: '0 0 80px 20px rgba(217,119,6,0.3)',
        }}
        animate={{
          left: cfg.sphere1.x,
          top: cfg.sphere1.y,
          scale: cfg.sphere1.scale,
          opacity: cfg.sphere1.opacity,
          translateZ: currentScene % 2 === 0 ? 40 : -20,
        }}
        transition={trans}
      />

      {/* Sphere 2 — rust orange */}
      <motion.div
        className="absolute w-[22vw] h-[22vw] rounded-full"
        style={{
          background: 'radial-gradient(circle at 30% 30%, #fb923c, #ea580c 45%, #7c2d12 75%, transparent)',
          filter: 'blur(1px)',
          boxShadow: '0 0 60px 15px rgba(234,88,12,0.25)',
        }}
        animate={{
          left: cfg.sphere2.x,
          top: cfg.sphere2.y,
          scale: cfg.sphere2.scale,
          translateZ: currentScene % 2 === 0 ? -30 : 50,
        }}
        transition={trans}
      />

      {/* CSS 3D Torus ring */}
      <motion.div
        className="absolute w-[16vw] h-[16vw]"
        animate={{ left: cfg.torus.x, top: cfg.torus.y, rotateZ: cfg.torus.rotateZ }}
        transition={trans}
        style={{ transformStyle: 'preserve-3d' }}
      >
        <motion.div
          className="w-full h-full rounded-full border-[2.5vw]"
          style={{
            borderColor: '#d97706',
            boxShadow: '0 0 30px 8px rgba(217,119,6,0.4), inset 0 0 20px rgba(234,88,12,0.3)',
            filter: 'blur(0.5px)',
          }}
          animate={{ rotateX: [0, 360] }}
          transition={{ duration: 4, repeat: Infinity, ease: 'linear' }}
        />
      </motion.div>

      {/* CSS diamond/gem shape */}
      <motion.div
        className="absolute w-[10vw] h-[10vw]"
        animate={{ left: cfg.gem.x, top: cfg.gem.y }}
        transition={trans}
        style={{ transformStyle: 'preserve-3d' }}
      >
        <motion.div
          className="w-full h-full"
          style={{
            background: 'linear-gradient(135deg, #fbbf24 0%, #ea580c 40%, #7c2d12 80%, #1a0a03 100%)',
            clipPath: 'polygon(50% 0%, 100% 40%, 70% 100%, 30% 100%, 0% 40%)',
            boxShadow: '0 0 40px 10px rgba(251,191,36,0.3)',
          }}
          animate={{ rotateY: [0, 360] }}
          transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
        />
      </motion.div>

      {/* Floating accent particles */}
      {[
        { x: '45vw', y: '25vh', size: '4vw', delay: 0 },
        { x: '80vw', y: '50vh', size: '2.5vw', delay: 0.8 },
        { x: '25vw', y: '75vh', size: '3vw', delay: 1.6 },
        { x: '65vw', y: '80vh', size: '2vw', delay: 2.4 },
      ].map((p, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full"
          style={{
            left: p.x,
            top: p.y,
            width: p.size,
            height: p.size,
            background: 'radial-gradient(circle, #fbbf24, #ea580c)',
            opacity: 0.4,
          }}
          animate={{ y: [0, -18, 0], opacity: [0.4, 0.7, 0.4] }}
          transition={{ duration: 3.5, repeat: Infinity, ease: 'easeInOut', delay: p.delay }}
        />
      ))}

      {/* Noise texture overlay for depth */}
      <div className="absolute inset-0 opacity-[0.03]" style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
        backgroundSize: '200px 200px',
      }} />

      {/* Vignette */}
      <div className="absolute inset-0" style={{
        background: 'radial-gradient(ellipse at center, transparent 40%, rgba(13,5,1,0.7) 100%)'
      }} />
    </div>
  );
}
