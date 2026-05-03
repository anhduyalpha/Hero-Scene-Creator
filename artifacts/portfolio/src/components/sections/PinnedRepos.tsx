import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Star, GitFork, ExternalLink, BookOpen } from "lucide-react";

interface Repo {
  name: string;
  description: string;
  url: string;
  stars: number;
  forks: number;
  language: { name: string; color: string } | null;
  topics: string[];
  updatedAt: string;
}

function timeAgo(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime();
  const days = Math.floor(diff / 86400000);
  if (days < 1) return "today";
  if (days === 1) return "yesterday";
  if (days < 30) return `${days}d ago`;
  const months = Math.floor(days / 30);
  if (months < 12) return `${months}mo ago`;
  return `${Math.floor(months / 12)}yr ago`;
}

function RepoCardSkeleton() {
  return (
    <div
      className="ember-glass rounded-xl p-6 flex flex-col gap-3 relative overflow-hidden"
      aria-hidden="true"
    >
      <div className="absolute top-0 left-0 right-0 h-[2px] rounded-t-xl animate-pulse"
        style={{ background: "rgba(245,158,11,0.25)" }} />
      <div className="flex items-center gap-2">
        <div className="w-4 h-4 rounded-sm animate-pulse" style={{ background: "rgba(245,158,11,0.15)" }} />
        <div className="h-4 w-32 rounded animate-pulse" style={{ background: "rgba(245,158,11,0.12)" }} />
      </div>
      <div className="space-y-2 flex-1">
        <div className="h-3 w-full rounded animate-pulse" style={{ background: "rgba(255,255,255,0.06)" }} />
        <div className="h-3 w-4/5 rounded animate-pulse" style={{ background: "rgba(255,255,255,0.04)" }} />
      </div>
      <div className="flex gap-2">
        {[1, 2].map((i) => (
          <div key={i} className="h-5 w-12 rounded-full animate-pulse"
            style={{ background: "rgba(245,158,11,0.08)" }} />
        ))}
      </div>
      <div className="flex gap-4 pt-1">
        <div className="h-3 w-14 rounded animate-pulse" style={{ background: "rgba(255,255,255,0.06)" }} />
        <div className="h-3 w-10 rounded animate-pulse" style={{ background: "rgba(255,255,255,0.04)" }} />
      </div>
    </div>
  );
}

function RepoCard({ repo, index }: { repo: Repo; index: number }) {
  const langColor = repo.language?.color ?? "#f59e0b";

  return (
    <motion.a
      href={repo.url}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={`${repo.name} on GitHub`}
      initial={{ opacity: 0, y: 28 }}
      whileInView={{
        opacity: 1,
        y: 0,
        transition: { duration: 0.5, delay: index * 0.08, ease: [0.16, 1, 0.3, 1] },
      }}
      viewport={{ once: true, margin: "-50px" }}
      className="ember-glass rounded-xl p-6 flex flex-col gap-3 relative overflow-hidden group cursor-pointer"
      whileHover={{
        borderColor: "rgba(245,158,11,0.45)",
        boxShadow: "0 0 28px rgba(245,158,11,0.09), 0 12px 40px rgba(0,0,0,0.5)",
        y: -3,
      }}
      transition={{ duration: 0.22 }}
    >
      <motion.div
        className="absolute top-0 left-0 right-0 h-[2px] rounded-t-xl"
        style={{
          background: `linear-gradient(to right, ${langColor}, rgba(220,38,38,0.4), transparent)`,
        }}
        initial={{ scaleX: 0 }}
        whileInView={{ scaleX: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, delay: 0.15 + index * 0.08 }}
      />

      <motion.div
        className="absolute inset-0 pointer-events-none"
        initial={{ opacity: 0 }}
        whileHover={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
        style={{
          background: "linear-gradient(135deg, rgba(245,158,11,0.04) 0%, transparent 55%)",
        }}
      />

      <div className="flex items-start justify-between gap-2 relative z-10">
        <div className="flex items-center gap-2">
          <BookOpen className="w-4 h-4 flex-shrink-0" style={{ color: "#f59e0b" }} />
          <h3
            className="font-mono font-semibold text-sm leading-tight group-hover:text-primary transition-colors duration-200"
            style={{ color: "rgba(254,243,199,0.9)" }}
          >
            {repo.name}
          </h3>
        </div>
        <motion.div
          className="flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity duration-200"
          style={{ color: "#f59e0b" }}
        >
          <ExternalLink className="w-3.5 h-3.5" />
        </motion.div>
      </div>

      <p className="text-xs text-muted-foreground leading-relaxed line-clamp-2 flex-1 relative z-10 min-h-[2.5rem]">
        {repo.description || "No description provided."}
      </p>

      {repo.topics.length > 0 && (
        <div className="flex flex-wrap gap-1.5 relative z-10">
          {repo.topics.slice(0, 4).map((topic, ti) => (
            <motion.span
              key={topic}
              className="px-2 py-0.5 text-[10px] font-mono rounded-full"
              style={{
                background: "rgba(245,158,11,0.09)",
                border: "1px solid rgba(245,158,11,0.2)",
                color: "rgba(245,158,11,0.8)",
              }}
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{
                type: "spring",
                stiffness: 300,
                damping: 22,
                delay: 0.2 + index * 0.06 + ti * 0.04,
              }}
              whileHover={{
                background: "rgba(245,158,11,0.2)",
                borderColor: "rgba(245,158,11,0.5)",
                scale: 1.07,
              }}
            >
              {topic}
            </motion.span>
          ))}
        </div>
      )}

      <div className="flex items-center justify-between pt-1 border-t relative z-10"
        style={{ borderColor: "rgba(245,158,11,0.1)" }}>
        <div className="flex items-center gap-4">
          {repo.language && (
            <div className="flex items-center gap-1.5">
              <span
                className="w-2.5 h-2.5 rounded-full flex-shrink-0"
                style={{ background: repo.language.color }}
              />
              <span className="text-[11px] font-mono text-muted-foreground">
                {repo.language.name}
              </span>
            </div>
          )}
          <div className="flex items-center gap-1 text-muted-foreground">
            <Star className="w-3 h-3" />
            <span className="text-[11px] font-mono">{repo.stars.toLocaleString()}</span>
          </div>
          <div className="flex items-center gap-1 text-muted-foreground">
            <GitFork className="w-3 h-3" />
            <span className="text-[11px] font-mono">{repo.forks.toLocaleString()}</span>
          </div>
        </div>
        <span className="text-[10px] font-mono" style={{ color: "rgba(245,158,11,0.4)" }}>
          {timeAgo(repo.updatedAt)}
        </span>
      </div>
    </motion.a>
  );
}

const FALLBACK: Repo[] = [
  {
    name: "AlphaD-Portfolio",
    description: "Personal portfolio — Obsidian Ember design system, React + Vite, Framer Motion animations.",
    url: "https://github.com/anhduyalpha",
    stars: 0, forks: 0,
    language: { name: "TypeScript", color: "#3178c6" },
    topics: ["portfolio", "react", "typescript"],
    updatedAt: new Date().toISOString(),
  },
];

export function PinnedRepos() {
  const [repos, setRepos] = useState<Repo[] | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/github/pinned")
      .then((r) => { if (!r.ok) throw new Error("non-ok"); return r.json() as Promise<Repo[]>; })
      .then((d) => { setRepos(d.length > 0 ? d : FALLBACK); setLoading(false); })
      .catch(() => { setRepos(FALLBACK); setLoading(false); });
  }, []);

  return (
    <section id="open-source" className="py-24 container mx-auto px-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="mb-12"
      >
        <h2 className="text-3xl md:text-4xl font-display font-bold mb-4 flex items-center gap-3">
          <motion.span
            className="text-secondary font-mono text-xl font-normal"
            initial={{ opacity: 0, x: -10 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4 }}
          >
            05.
          </motion.span>
          <motion.span>
            {"Open Source".split("").map((char, i) => (
              <motion.span
                key={i}
                style={{ display: char === " " ? "inline" : "inline-block" }}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.3, delay: 0.1 + i * 0.04, ease: [0.16, 1, 0.3, 1] }}
              >
                {char === " " ? "\u00A0" : char}
              </motion.span>
            ))}
          </motion.span>
        </h2>
        <motion.div
          className="h-1 bg-primary shadow-[0_0_10px_var(--color-primary)] origin-left"
          initial={{ scaleX: 0, width: "5rem" }}
          whileInView={{ scaleX: 1, width: "5rem" }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.35, ease: [0.16, 1, 0.3, 1] }}
        />
        <motion.p
          className="mt-4 text-muted-foreground font-mono text-sm flex items-center gap-2"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.5 }}
        >
          <svg className="w-4 h-4 flex-shrink-0" viewBox="0 0 24 24" fill="currentColor" style={{ color: "#f59e0b" }}>
            <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
          </svg>
          pinned from{" "}
          <motion.a
            href="https://github.com/anhduyalpha"
            target="_blank"
            rel="noopener noreferrer"
            className="underline underline-offset-2"
            style={{ color: "#f59e0b" }}
            whileHover={{ color: "#fbbf24" }}
          >
            github.com/anhduyalpha
          </motion.a>
          {!loading && repos && (
            <span style={{ color: "rgba(245,158,11,0.5)" }}>· {repos.length} repos</span>
          )}
        </motion.p>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {loading
          ? Array.from({ length: 6 }).map((_, i) => <RepoCardSkeleton key={i} />)
          : repos!.map((repo, i) => <RepoCard key={repo.name} repo={repo} index={i} />)
        }
      </div>
    </section>
  );
}
