import { useQuery } from "@tanstack/react-query";
import { motion, AnimatePresence } from "framer-motion";

/* ── Spotify SVG icon ─────────────────────────────────── */
function SpotifyIcon({ className }: { className?: string }) {
  return (
    <svg
      role="img"
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
      fill="currentColor"
      className={className}
      aria-label="Spotify"
    >
      <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z" />
    </svg>
  );
}

/* ── Animated equalizer bars ─────────────────────────── */
function EqBars() {
  return (
    <span className="flex items-end gap-[2.5px] h-[14px] w-[16px] shrink-0" aria-hidden="true">
      {[0, 1, 2].map((i) => (
        <motion.span
          key={i}
          className="w-[3px] rounded-full"
          style={{ background: "#f59e0b", display: "block" }}
          animate={{ height: ["30%", "100%", "55%", "85%", "30%"] }}
          transition={{
            duration: 1.1,
            repeat: Infinity,
            ease: "easeInOut",
            delay: i * 0.18,
          }}
        />
      ))}
    </span>
  );
}

type NowPlayingData = {
  isPlaying: boolean;
  track?: {
    name: string;
    artist: string;
    albumArt: string;
    url: string;
  };
};

async function fetchNowPlaying(): Promise<NowPlayingData> {
  const res = await fetch("/api/spotify/now-playing");
  if (!res.ok) throw new Error("fetch failed");
  return res.json() as Promise<NowPlayingData>;
}

export function SpotifyWidget() {
  const { data, isLoading } = useQuery({
    queryKey: ["spotify-now-playing"],
    queryFn: fetchNowPlaying,
    refetchInterval: 30_000,
    retry: false,
    staleTime: 25_000,
  });

  if (isLoading) return null;

  const isPlaying = data?.isPlaying && data.track;

  return (
    <AnimatePresence mode="wait">
      {isPlaying ? (
        <motion.a
          key="playing"
          href={data!.track!.url}
          target="_blank"
          rel="noopener noreferrer"
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -6 }}
          transition={{ duration: 0.3 }}
          className="flex items-center gap-3 px-3 py-2.5 rounded-xl border no-underline group/spot"
          style={{
            background: "rgba(245,158,11,0.05)",
            borderColor: "rgba(245,158,11,0.18)",
            textDecoration: "none",
          }}
          whileHover={{
            borderColor: "rgba(245,158,11,0.40)",
            background: "rgba(245,158,11,0.09)",
            boxShadow: "0 0 20px rgba(245,158,11,0.10)",
          }}
        >
          <img
            src={data!.track!.albumArt}
            alt={data!.track!.name}
            className="w-9 h-9 rounded-md object-cover shrink-0"
            style={{ boxShadow: "0 0 8px rgba(245,158,11,0.25)" }}
          />
          <EqBars />
          <div className="flex flex-col min-w-0">
            <span className="text-[11px] font-semibold truncate max-w-[130px] leading-tight" style={{ color: "#fef3c7" }}>
              {data!.track!.name}
            </span>
            <span className="text-[10px] truncate max-w-[130px] leading-tight mt-0.5" style={{ color: "rgba(245,158,11,0.55)" }}>
              {data!.track!.artist}
            </span>
          </div>
        </motion.a>
      ) : (
        <motion.div key="idle" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex items-center gap-2">
          <SpotifyIcon className="w-3.5 h-3.5 shrink-0" />
          <span className="font-mono text-[10px]" style={{ color: "rgba(245,158,11,0.30)" }}>
            Not playing
          </span>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
