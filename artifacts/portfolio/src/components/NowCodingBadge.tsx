import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface Commit {
  message: string;
  repo: string;
  url: string;
  timestamp: string;
}

function timeAgo(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime();
  const m = Math.floor(diff / 60000);
  if (m < 1) return "just now";
  if (m < 60) return `${m}m ago`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h ago`;
  return `${Math.floor(h / 24)}d ago`;
}

export function NowCodingBadge() {
  const [commit, setCommit] = useState<Commit | null>(null);
  const [visible, setVisible] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    fetch("/api/github/latest-commit")
      .then((r) => (r.ok ? r.json() : null))
      .then((d: Commit | null) => {
        if (d) {
          setCommit(d);
          setTimeout(() => setVisible(true), 2400);
        }
      })
      .catch(() => {});
  }, []);

  if (!commit || dismissed) return null;

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          className="fixed bottom-8 left-8 z-30 max-w-[340px] hidden md:flex items-start gap-3 px-4 py-3 rounded-xl cursor-default select-none"
          style={{
            background: "rgba(10,6,2,0.88)",
            border: "1px solid rgba(245,158,11,0.2)",
            backdropFilter: "blur(20px) saturate(180%)",
            WebkitBackdropFilter: "blur(20px) saturate(180%)",
            boxShadow: "0 8px 32px rgba(0,0,0,0.6), 0 0 0 0.5px rgba(245,158,11,0.08)",
          }}
          initial={{ opacity: 0, y: 16, scale: 0.94 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 12, scale: 0.94 }}
          transition={{ type: "spring", stiffness: 260, damping: 24 }}
        >
          {/* pulsing status dot */}
          <div className="relative flex-shrink-0 mt-0.5">
            <span
              className="block w-2 h-2 rounded-full"
              style={{ background: "#22c55e", boxShadow: "0 0 6px #22c55e" }}
            />
            <motion.span
              className="absolute inset-0 rounded-full"
              style={{ background: "#22c55e" }}
              animate={{ scale: [1, 2.2, 1], opacity: [0.6, 0, 0.6] }}
              transition={{ duration: 2.2, repeat: Infinity, ease: "easeOut" }}
            />
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-1.5 mb-0.5">
              <span className="text-[10px] font-mono uppercase tracking-widest" style={{ color: "#22c55e" }}>
                Now Coding
              </span>
              <span className="text-[10px] font-mono text-muted-foreground">·</span>
              <span className="text-[10px] font-mono text-muted-foreground">
                {timeAgo(commit.timestamp)}
              </span>
            </div>
            <p className="text-xs font-mono truncate" style={{ color: "rgba(254,243,199,0.85)" }}>
              {commit.message}
            </p>
            <a
              href={commit.url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-[10px] font-mono transition-colors duration-150 hover:text-primary"
              style={{ color: "rgba(245,158,11,0.55)" }}
            >
              {commit.repo}
            </a>
          </div>

          <button
            onClick={() => setDismissed(true)}
            aria-label="Dismiss"
            className="flex-shrink-0 text-muted-foreground hover:text-foreground transition-colors mt-0.5 text-xs leading-none"
            style={{ opacity: 0.45 }}
          >
            ✕
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
