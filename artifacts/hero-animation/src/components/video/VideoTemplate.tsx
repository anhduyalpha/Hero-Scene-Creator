import { AnimatePresence, motion } from 'framer-motion';
import { useVideoPlayer } from '@/lib/video';
import { Background3D } from './Background3D';
import { Scene1 } from './video_scenes/Scene1';
import { Scene2 } from './video_scenes/Scene2';
import { Scene3 } from './video_scenes/Scene3';
import { Scene4 } from './video_scenes/Scene4';
import { Scene5 } from './video_scenes/Scene5';
import { useEffect } from 'react';

export const SCENE_DURATIONS = {
  open: 5500,
  warmth: 4500,
  depth: 4500,
  impact: 5000,
  close: 5000,
};

const SCENE_COMPONENTS: Record<string, React.ComponentType> = {
  open: Scene1,
  warmth: Scene2,
  depth: Scene3,
  impact: Scene4,
  close: Scene5,
};

export default function VideoTemplate({
  durations = SCENE_DURATIONS,
  loop = true,
  onSceneChange,
}: {
  durations?: Record<string, number>;
  loop?: boolean;
  onSceneChange?: (sceneKey: string) => void;
} = {}) {
  const { currentScene, currentSceneKey } = useVideoPlayer({ durations, loop });

  useEffect(() => {
    onSceneChange?.(currentSceneKey);
  }, [currentSceneKey, onSceneChange]);

  const baseSceneKey = currentSceneKey.replace(/_r[12]$/, '') as keyof typeof SCENE_DURATIONS;
  const sceneIndex = Object.keys(SCENE_DURATIONS).indexOf(baseSceneKey);
  const SceneComponent = SCENE_COMPONENTS[baseSceneKey];

  return (
    <div className="w-full h-screen overflow-hidden relative" style={{ backgroundColor: '#0d0501' }}>

      {/* CSS 3D Background */}
      <Background3D currentScene={sceneIndex} />

      {/* Persistent accent line that travels across scenes */}
      <motion.div
        className="absolute h-[2px] z-20 pointer-events-none"
        style={{ background: 'linear-gradient(90deg, transparent, #ea580c, #fbbf24, transparent)' }}
        animate={{
          left: ['0%', '5%', '60%', '20%', '0%'][sceneIndex],
          width: ['40%', '30%', '50%', '70%', '40%'][sceneIndex],
          top: ['30%', '70%', '20%', '55%', '30%'][sceneIndex],
          opacity: [0.7, 0.5, 0.8, 0.6, 0.7][sceneIndex],
        }}
        transition={{ duration: 1.5, ease: [0.16, 1, 0.3, 1] }}
      />

      {/* Second accent line */}
      <motion.div
        className="absolute h-[1px] z-20 pointer-events-none"
        style={{ background: 'linear-gradient(90deg, transparent, #d97706, transparent)' }}
        animate={{
          right: ['10%', '20%', '5%', '30%', '10%'][sceneIndex],
          width: ['25%', '45%', '20%', '35%', '25%'][sceneIndex],
          top: ['65%', '25%', '75%', '35%', '65%'][sceneIndex],
          opacity: [0.4, 0.6, 0.3, 0.5, 0.4][sceneIndex],
        }}
        transition={{ duration: 1.8, ease: [0.16, 1, 0.3, 1] }}
      />

      {/* Scene foreground */}
      <div className="absolute inset-0 z-30 pointer-events-none">
        <AnimatePresence initial={false} mode="popLayout">
          {SceneComponent && <SceneComponent key={currentSceneKey} />}
        </AnimatePresence>
      </div>
    </div>
  );
}
