import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { useVideoPlayer } from '@/lib/video';
import { Background3D } from './Background3D';
import { Scene1 } from './video_scenes/Scene1';
import { Scene2 } from './video_scenes/Scene2';
import { Scene3 } from './video_scenes/Scene3';
import { Scene4 } from './video_scenes/Scene4';
import { Scene5 } from './video_scenes/Scene5';
import { Scene6 } from './video_scenes/Scene6';
import { useEffect } from 'react';
import { SCENE_DURATIONS } from './sceneDurations';

const SCENE_COMPONENTS: Record<string, React.ComponentType> = {
  open:      Scene1,
  warmth:    Scene2,
  depth:     Scene3,
  impact:    Scene4,
  close:     Scene5,
  spotlight: Scene6,
};

/* Accent sweep lines — transform-only, no layout props animated */
const sweeps = [
  { top: '28%', widths: ['38%','28%','48%','65%','38%','52%'], lefts: ['2%','7%','58%','18%','2%','12%'] },
  { top: '66%', widths: ['22%','42%','18%','32%','22%','36%'], rights: ['12%','18%','6%','28%','12%','20%'] },
];

export default function VideoTemplate({
  durations = SCENE_DURATIONS,
  loop = true,
  onSceneChange,
}: {
  durations?: Record<string, number>;
  loop?: boolean;
  onSceneChange?: (sceneKey: string) => void;
} = {}) {
  const shouldReduce = useReducedMotion();
  const { currentSceneKey } = useVideoPlayer({ durations, loop });

  useEffect(() => {
    onSceneChange?.(currentSceneKey);
  }, [currentSceneKey, onSceneChange]);

  const baseSceneKey = currentSceneKey.replace(/_r[12]$/, '') as keyof typeof SCENE_DURATIONS;
  const sceneIndex = Object.keys(SCENE_DURATIONS).indexOf(baseSceneKey);
  const SceneComponent = SCENE_COMPONENTS[baseSceneKey];

  return (
    <div
      className="w-full h-screen overflow-hidden relative"
      style={{ backgroundColor: '#0d0501' }}
      role="main"
      aria-label="Portfolio hero animation"
    >
      {/* ── CSS 3D Background ── */}
      <Background3D currentScene={sceneIndex} />

      {/* ── Persistent horizontal sweep lines ── */}
      {!shouldReduce && sweeps.map((sweep, si) => (
        <motion.div
          key={si}
          className="absolute z-20 pointer-events-none"
          style={{
            top: sweep.top,
            height: si === 0 ? 2 : 1,
            background: si === 0
              ? 'linear-gradient(90deg, transparent, #ea580c, #fbbf24, transparent)'
              : 'linear-gradient(90deg, transparent, rgba(217,119,6,0.5), transparent)',
          }}
          animate={{
            width: sweep.widths[sceneIndex],
            ...(sweep.lefts
              ? { left: sweep.lefts[sceneIndex] }
              : { right: sweep.rights![sceneIndex] }
            ),
            opacity: si === 0 ? [0.8, 0.6, 0.8][sceneIndex % 3] : [0.4, 0.5, 0.35][sceneIndex % 3],
          }}
          transition={{ duration: 1.4, ease: [0.16, 1, 0.3, 1] }}
        />
      ))}

      {/* ── Corner decorations ── */}
      {[
        { corner: 'top-4 left-4', size: 16 },
        { corner: 'top-4 right-4', size: 12 },
        { corner: 'bottom-4 left-4', size: 12 },
        { corner: 'bottom-4 right-4', size: 16 },
      ].map(({ corner, size }, i) => (
        <motion.div
          key={i}
          className={`absolute ${corner} z-20 pointer-events-none`}
          style={{
            width: size, height: size,
            borderTop: i < 2 ? '1px solid rgba(217,119,6,0.3)' : undefined,
            borderBottom: i >= 2 ? '1px solid rgba(217,119,6,0.3)' : undefined,
            borderLeft: i % 2 === 0 ? '1px solid rgba(217,119,6,0.3)' : undefined,
            borderRight: i % 2 === 1 ? '1px solid rgba(217,119,6,0.3)' : undefined,
          }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: i * 0.1 }}
        />
      ))}

      {/* ── Scene number indicator ── */}
      <motion.div
        className="absolute bottom-8 right-8 z-20 pointer-events-none font-mono tabular-nums"
        style={{ fontSize: '0.7rem', color: 'rgba(217,119,6,0.45)', letterSpacing: '0.2em' }}
        animate={{ opacity: 1 }}
      >
        {String(sceneIndex + 1).padStart(2, '0')} / {String(Object.keys(SCENE_DURATIONS).length).padStart(2, '0')}
      </motion.div>

      {/* ── Foreground scenes ── */}
      <div className="absolute inset-0 z-30 pointer-events-none">
        <AnimatePresence initial={false} mode="popLayout">
          {SceneComponent && <SceneComponent key={currentSceneKey} />}
        </AnimatePresence>
      </div>
    </div>
  );
}
