import { motion } from "framer-motion";
import { Code2, Globe, Cpu, Rocket, Terminal } from "lucide-react";

const cards = [
  {
    id: "stack",
    className: "col-span-2 row-span-1",
    tint: "rgba(245,158,11,0.10)",
    accentFrom: "rgba(245,158,11,0.7)",
    accentTo: "rgba(220,38,38,0.25)",
    icon: <Code2 className="w-5 h-5" aria-hidden="true" />,
    label: "My Stack",
    content: (
      <div className="mt-4 flex flex-wrap gap-2">
        {["React", "TypeScript", "Go", "Rust", "Node.js", "PostgreSQL", "Redis", "Docker", "Kubernetes", "gRPC"].map((t) => (
          <span
            key={t}
            className="px-2 py-1 text-xs font-mono rounded-sm"
            style={{
              background: "rgba(245,158,11,0.12)",
              border: "1px solid rgba(245,158,11,0.25)",
              color: "rgba(254,243,199,0.9)",
            }}
          >
            {t}
          </span>
        ))}
      </div>
    ),
  },
  {
    id: "coffee",
    className: "col-span-1 row-span-1",
    tint: "rgba(220,38,38,0.08)",
    accentFrom: "rgba(220,38,38,0.7)",
    accentTo: "rgba(245,158,11,0.2)",
    icon: <span aria-hidden="true" className="text-lg" style={{ color: "#dc2626" }}>🔥</span>,
    label: "Lines / Day",
    content: (
      <div className="mt-4">
        <p className="text-5xl font-black tabular-nums" style={{ color: "#f59e0b" }}>600+</p>
        <p className="text-sm text-muted-foreground mt-1">Lines of code forged</p>
      </div>
    ),
  },
  {
    id: "commits",
    className: "col-span-1 row-span-1",
    tint: "rgba(180,83,9,0.08)",
    accentFrom: "rgba(180,83,9,0.7)",
    accentTo: "rgba(220,38,38,0.2)",
    icon: <Terminal className="w-5 h-5" aria-hidden="true" style={{ color: "#f59e0b" }} />,
    label: "Commits in 2025",
    content: (
      <div className="mt-4">
        <p className="text-5xl font-black tabular-nums" style={{ color: "#f59e0b" }}>1,842</p>
        <p className="text-sm text-muted-foreground mt-1">+23% vs last year</p>
      </div>
    ),
  },
  {
    id: "location",
    className: "col-span-2 row-span-1",
    tint: "rgba(245,158,11,0.06)",
    accentFrom: "rgba(245,158,11,0.6)",
    accentTo: "rgba(220,38,38,0.2)",
    icon: <Globe className="w-5 h-5" aria-hidden="true" style={{ color: "#f59e0b" }} />,
    label: "Currently Based In",
    content: (
      <div className="mt-4 flex items-end justify-between">
        <div>
          <p className="text-3xl font-bold text-foreground">Ho Chi Minh City</p>
          <p className="text-muted-foreground mt-1">Vietnam · UTC+7</p>
        </div>
        <div className="text-right">
          <p className="font-mono text-sm text-muted-foreground">Open to remote ✓</p>
          <p className="font-mono text-xs text-muted-foreground/60 mt-1">worldwide</p>
        </div>
      </div>
    ),
  },
  {
    id: "experience",
    className: "col-span-1 row-span-1",
    tint: "rgba(220,38,38,0.08)",
    accentFrom: "rgba(220,38,38,0.7)",
    accentTo: "rgba(245,158,11,0.2)",
    icon: <Rocket className="w-5 h-5" aria-hidden="true" style={{ color: "#dc2626" }} />,
    label: "Years XP",
    content: (
      <div className="mt-4">
        <p className="text-5xl font-black tabular-nums" style={{ color: "#f59e0b" }}>5+</p>
        <p className="text-sm text-muted-foreground mt-1">Professional years</p>
      </div>
    ),
  },
  {
    id: "tools",
    className: "col-span-1 row-span-1",
    tint: "rgba(245,158,11,0.08)",
    accentFrom: "rgba(245,158,11,0.7)",
    accentTo: "rgba(180,83,9,0.2)",
    icon: <Cpu className="w-5 h-5" aria-hidden="true" style={{ color: "#f59e0b" }} />,
    label: "Favourite Tools",
    content: (
      <ul className="mt-4 space-y-1 text-sm text-muted-foreground">
        {["Neovim", "Warp Terminal", "Raycast", "Figma", "Obsidian"].map((t) => (
          <li key={t} className="flex items-center gap-2">
            <span className="w-1 h-1 rounded-full bg-primary inline-block" aria-hidden="true" />
            {t}
          </li>
        ))}
      </ul>
    ),
  },
];

export function Bento() {
  return (
    <section id="bento" aria-label="Quick facts about me" className="py-20 bg-background relative z-10">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 auto-rows-[minmax(180px,auto)]">
          {cards.map((card, i) => (
            <motion.div
              key={card.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.5, delay: i * 0.07 }}
              className={`ember-glass rounded-2xl p-6 flex flex-col relative overflow-hidden ${card.className}`}
              style={{
                background: `linear-gradient(135deg, ${card.tint} 0%, rgba(10,6,2,0.72) 55%, rgba(6,4,2,0.90) 100%)`,
                backdropFilter: "blur(24px) saturate(180%)",
                WebkitBackdropFilter: "blur(24px) saturate(180%)",
              }}
            >
              <div
                className="absolute top-0 left-0 right-0 h-[2px] rounded-t-2xl"
                style={{
                  background: `linear-gradient(to right, ${card.accentFrom}, ${card.accentTo}, transparent)`,
                }}
                aria-hidden="true"
              />
              <div
                className="absolute top-0 left-0 w-32 h-32 pointer-events-none"
                style={{
                  background: `radial-gradient(ellipse at top left, ${card.tint.replace("0.08", "0.25").replace("0.10", "0.25").replace("0.06", "0.20")} 0%, transparent 65%)`,
                }}
                aria-hidden="true"
              />
              <div className="relative z-10 flex items-center gap-2 text-muted-foreground">
                {card.icon}
                <span className="font-mono text-xs uppercase tracking-widest">{card.label}</span>
              </div>
              <div className="relative z-10">
                {card.content}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
