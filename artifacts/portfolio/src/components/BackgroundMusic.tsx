import { useEffect, useMemo, useRef, useState } from "react";
import { motion } from "framer-motion";
import { Music2, Pause, Play, SkipForward, Minus, Plus } from "lucide-react";

const TRACKS = [
  {
    title: "Ember Drift",
    artist: "Royalty-free ambient",
    src: `${import.meta.env.BASE_URL}ember-drift.mp3`,
  },
];

function VolumeEqualizer({ active, volume }: { active: boolean; volume: number }) {
  const bars = [
    { h: "40%", d: 0 },
    { h: "85%", d: 0.12 },
    { h: "55%", d: 0.24 },
    { h: "95%", d: 0.1 },
    { h: "65%", d: 0.18 },
  ];
  const level = Math.max(0.2, volume);

  return (
    <div className="flex items-end gap-1 h-5 w-12" aria-hidden="true">
      {bars.map((bar, i) => (
        <motion.span
          key={i}
          className="w-1 rounded-full origin-bottom"
          style={{ background: "linear-gradient(180deg, #fef3c7 0%, #f59e0b 55%, #dc2626 100%)" }}
          animate={active ? { height: [bar.h, `${Math.min(100, 55 + level * 50)}%`, "30%", "85%", bar.h] } : { height: `${20 + level * 30}%` }}
          transition={{
            duration: 0.9,
            repeat: active ? Infinity : 0,
            ease: "easeInOut",
            delay: bar.d,
          }}
        />
      ))}
    </div>
  );
}

export function BackgroundMusic() {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [armed, setArmed] = useState(false);
  const [volume, setVolume] = useState(0.7);
  const track = TRACKS[0];

  const percent = useMemo(() => {
    if (!duration) return 0;
    return Math.min(100, Math.max(0, (progress / duration) * 100));
  }, [duration, progress]);

  useEffect(() => {
    const audio = audioRef.current;
    if (audio) audio.volume = volume;
  }, [volume]);

  useEffect(() => {
    const start = () => setArmed(true);
    window.addEventListener("pointerdown", start, { once: true, passive: true });
    window.addEventListener("keydown", start, { once: true });
    void playAudio();
    return () => {
      window.removeEventListener("pointerdown", start);
      window.removeEventListener("keydown", start);
    };
  }, []);

  const playAudio = async () => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.muted = false;
    audio.volume = volume;
    try {
      await audio.play();
      setIsPlaying(true);
    } catch {
      setIsPlaying(false);
    }
  };

  useEffect(() => {
    if (!armed) return;
    void playAudio();
  }, [armed]);

  const toggle = async () => {
    const audio = audioRef.current;
    if (!audio) return;

    audio.muted = false;
    audio.volume = volume;
    if (audio.paused) {
      await playAudio();
    } else {
      audio.pause();
      setIsPlaying(false);
    }
  };

  const restart = async () => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.muted = false;
    audio.volume = volume;
    audio.currentTime = 0;
    await playAudio();
  };

  const changeVolume = async (delta: number) => {
    const audio = audioRef.current;
    const next = Math.min(1, Math.max(0, Number((volume + delta).toFixed(2))));
    setVolume(next);
    if (audio) audio.volume = next;
    if (next > 0 && armed && audio?.paused) {
      await playAudio();
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="w-full max-w-sm rounded-2xl border p-4"
      style={{
        background: "rgba(6,4,2,0.72)",
        borderColor: "rgba(245,158,11,0.16)",
        boxShadow: "0 0 28px rgba(245,158,11,0.06)",
      }}
    >
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: "rgba(245,158,11,0.12)", color: "#f59e0b" }}>
          <Music2 className="w-5 h-5" />
        </div>

        <div className="min-w-0 flex-1">
          <p className="text-xs font-mono" style={{ color: "rgba(245,158,11,0.6)" }}>
            Background music
          </p>
          <p className="text-sm font-semibold truncate" style={{ color: "#fef3c7" }}>
            {track.title}
          </p>
          <p className="text-xs truncate" style={{ color: "rgba(245,158,11,0.5)" }}>
            {track.artist}
          </p>
        </div>

        <VolumeEqualizer active={isPlaying} volume={volume} />

        <button
          type="button"
          onClick={toggle}
          className="w-10 h-10 rounded-full flex items-center justify-center transition-transform active:scale-95"
          style={{ background: "rgba(245,158,11,0.12)", color: "#f59e0b" }}
          aria-label={isPlaying ? "Pause music" : "Play music"}
        >
          {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 ml-0.5" />}
        </button>

        <button
          type="button"
          onClick={restart}
          className="w-10 h-10 rounded-full flex items-center justify-center transition-transform active:scale-95"
          style={{ background: "rgba(245,158,11,0.08)", color: "#f59e0b" }}
          aria-label="Restart track"
        >
          <SkipForward className="w-4 h-4" />
        </button>
      </div>

      <div className="mt-4 flex items-center gap-2">
        <button
          type="button"
          onClick={() => void changeVolume(-0.1)}
          className="w-9 h-9 rounded-full flex items-center justify-center transition-transform active:scale-95"
          style={{ background: "rgba(245,158,11,0.08)", color: "#f59e0b" }}
          aria-label="Decrease volume"
        >
          <Minus className="w-4 h-4" />
        </button>

        <div className="flex-1 h-1.5 rounded-full overflow-hidden" style={{ background: "rgba(245,158,11,0.08)" }}>
          <div
            className="h-full rounded-full"
            style={{ width: `${percent}%`, background: "linear-gradient(90deg, #dc2626, #f59e0b)" }}
          />
        </div>

        <button
          type="button"
          onClick={() => void changeVolume(0.1)}
          className="w-9 h-9 rounded-full flex items-center justify-center transition-transform active:scale-95"
          style={{ background: "rgba(245,158,11,0.08)", color: "#f59e0b" }}
          aria-label="Increase volume"
        >
          <Plus className="w-4 h-4" />
        </button>
      </div>

      <audio
        ref={audioRef}
        src={track.src}
        preload="metadata"
        loop
        muted={!armed}
        onTimeUpdate={(e) => {
          const audio = e.currentTarget;
          setProgress(audio.currentTime);
          setDuration(Number.isFinite(audio.duration) ? audio.duration : 0);
        }}
        onLoadedMetadata={(e) => {
          const audio = e.currentTarget;
          audio.volume = volume;
          setDuration(Number.isFinite(audio.duration) ? audio.duration : 0);
        }}
        onEnded={() => {
          setIsPlaying(false);
          setProgress(0);
        }}
      />

      <p className="mt-2 text-[10px] font-mono" style={{ color: "rgba(245,158,11,0.38)" }}>
        Starts after your first interaction.
      </p>
    </motion.div>
  );
}
