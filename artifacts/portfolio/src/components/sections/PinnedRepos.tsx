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
    <div className="ember-glass rounded-xl p-6 flex flex-col gap-3 relative overflow-hidden" aria-hidden="true">
      <div className="absolute top-0 left-0 right-0 h-[2px] rounded-t-xl animate-pulse" style={{ background: "rgba(245,158,11,0.25)" }} />
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
          <div key={i} className="h-5 w-12 rounded-full animate-pulse" style={{ background: "rgba(245,158,11,0.08)" }} />
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
      whileInView={{ opacity: 1, y: 0, transition: { duration: 0.5, delay: index * 0.08, ease: [0.16, 1, 0.3, 1] } }}
      viewport={{ once: true, margin: "-50px" }}
      className="ember-glass rounded-xl p-6 flex flex-col gap-3 relative overflow-hidden group cursor-pointer"
      whileHover={{ borderColor: "rgba(245,158,11,0.45)", boxShadow: "0 0 28px rgba(245,158,11,0.09), 0 12px 40px rgba(0,0,0,0.5)", y: -3 }}
      transition={{ duration: 0.22 }}
    >
      <motion.div className="absolute top-0 left-0 right-0 h-[2px] rounded-t-xl" style={{ background: `linear-gradient(to right, ${langColor}, rgba(220,38,38,0.4), transparent)` }} initial={{ scaleX: 0 }} whileInView={{ scaleX: 1 }} viewport={{ once: true }} transition={{ duration: 0.6, delay: 0.15 + index * 0.08 }} />
      <motion.div className="absolute inset-0 pointer-events-none" initial={{ opacity: 0 }} whileHover={{ opacity: 1 }} transition={{ duration: 0.3 }} style={{ background: "linear-gradient(135deg, rgba(245,158,11,0.04) 0%, transparent 55%)" }} />
      <div className="flex items-start justify-between gap-2 relative z-10">
        <div className="flex items-center gap-2">
          <BookOpen className="w-4 h-4 flex-shrink-0" style={{ color: "#f59e0b" }} />
          <h3 className="font-mono font-semibold text-sm leading-tight group-hover:text-primary transition-colors duration-200" style={{ color: "rgba(254,243,199,0.9)" }}>
            {repo.name}
          </h3>
        </div>
        <motion.div className="flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity duration-200" style={{ color: "#f59e0b" }}>
          <ExternalLink className="w-3.5 h-3.5" />
        </motion.div>
      </div>
      <p className="text-xs text-muted-foreground leading-relaxed line-clamp-2 flex-1 relative z-10 min-h-[2.5rem]">{repo.description || "No description provided."}</p>
      {repo.topics.length > 0 && (
        <div className="flex flex-wrap gap-1.5 relative z-10">
          {repo.topics.slice(0, 4).map((topic, ti) => (
            <motion.span key={topic} className="px-2 py-0.5 text-[10px] font-mono rounded-full" style={{ background: "rgba(245,158,11,0.09)", border: "1px solid rgba(245,158,11,0.2)", color: "rgba(245,158,11,0.8)" }} initial={{ opacity: 0, scale: 0.8 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ type: "spring", stiffness: 300, damping: 22, delay: 0.2 + index * 0.06 + ti * 0.04 }} whileHover={{ background: "rgba(245,158,11,0.2)", borderColor: "rgba(245,158,11,0.5)", scale: 1.07 }}>
              {topic}
            </motion.span>
          ))}
        </div>
      )}
      <div className="flex items-center justify-between pt-1 border-t relative z-10" style={{ borderColor: "rgba(245,158,11,0.1)" }}>
        <div className="flex items-center gap-4">
          {repo.language && (
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ background: repo.language.color }} />
              <span className="text-[11px] font-mono text-muted-foreground">{repo.language.name}</span>
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
        <span className="text-[11px] font-mono text-muted-foreground">{timeAgo(repo.updatedAt)}</span>
      </div>
    </motion.a>
  );
}

const FALLBACK: Repo[] = [
  {
    name: "Ultimate-Portfolio",
    description: "Personal portfolio — Obsidian Ember design system, React + Vite, Framer Motion animations.",
    url: "https://github.com/anhduyalpha",
    stars: 0,
    forks: 0,
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
    <section id="open-source" className="py-20 px-6">
      <div className="container mx-auto">
        <h2 className="text-2xl font-bold mb-8">Open Source</h2>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {loading || !repos
            ? Array.from({ length: 3 }, (_, index) => <RepoCardSkeleton key={index} />)
            : repos.map((repo, index) => <RepoCard key={repo.name} repo={repo} index={index} />)}
        </div>
      </div>
    </section>
  );
}
