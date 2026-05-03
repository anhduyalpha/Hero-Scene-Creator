import { useState, useRef, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Terminal as TermIcon } from "lucide-react";

/* ── command registry ───────────────────────────────────── */
type Line = { text: string; color?: string };
type CmdResult = Line[] | "clear";

const COMMANDS: Partial<Record<string, () => CmdResult>> = {
  help: () => [
    { text: "Available commands:", color: "#f59e0b" },
    { text: "  whoami           — About AlphaD" },
    { text: "  ls               — List sections" },
    { text: "  cat about        — About section" },
    { text: "  cat skills       — Tech arsenal" },
    { text: "  ls projects      — Featured projects" },
    { text: "  contact          — Open contact form" },
    { text: "  date             — Current time (UTC+7)" },
    { text: "  clear            — Clear terminal" },
    { text: "  sudo hire anhduy — 👀" },
  ],
  whoami: () => [
    { text: "AlphaD (Anh Duy)", color: "#f59e0b" },
    { text: "Software Engineer · Ho Chi Minh City, Vietnam · UTC+7" },
    { text: "5+ years forging distributed systems at scale." },
    { text: "Currently: high-throughput infrastructure @ Nexus Systems." },
    { text: "Open to remote opportunities worldwide.", color: "rgba(245,158,11,0.6)" },
  ],
  ls: () => [
    { text: "sections/", color: "#60a5fa" },
    { text: "  about         skills        code-craft" },
    { text: "  projects       open-source  experience" },
    { text: "  blog           terminal      contact" },
  ],
  "cat about": () => [
    { text: "// about.md", color: "rgba(255,255,255,0.3)" },
    { text: "I view software the same way a blacksmith views forging metal —" },
    { text: "immense heat, heavy strikes, meticulous craft." },
    { text: "Since a dimly lit dorm room, I've been fascinated by turning" },
    { text: "raw logic into systems that withstand time and scale." },
  ],
  "cat skills": () => [
    { text: "FRONTEND   ", color: "#f59e0b" },
    { text: "  React · Next.js · TypeScript · Framer Motion · Tailwind" },
    { text: "BACKEND    ", color: "#f59e0b" },
    { text: "  Go · Node.js · Rust · gRPC · GraphQL · REST" },
    { text: "DATA       ", color: "#f59e0b" },
    { text: "  PostgreSQL · Redis · MongoDB · Elasticsearch · Kafka" },
    { text: "INFRA      ", color: "#f59e0b" },
    { text: "  Kubernetes · Docker · AWS · Terraform · CI/CD" },
  ],
  "ls projects": () => [
    { text: "forge-queue    Go + Redis    — distributed task queue (5M+ events/day)", color: "#86efac" },
    { text: "ember-cli      Rust          — microservice scaffolding CLI", color: "#86efac" },
    { text: "hoverkit-3d    TypeScript    — GPU-accelerated 3D hover library (500+ npm users)", color: "#86efac" },
    { text: "redline-db     C++           — embedded time-series DB for IoT workloads", color: "#86efac" },
  ],
  contact: () => {
    setTimeout(() => {
      const el = document.getElementById("contact");
      el?.scrollIntoView({ behavior: "smooth" });
    }, 600);
    return [
      { text: "Navigating to contact section...", color: "#f59e0b" },
      { text: "Opening #contact ↓" },
    ];
  },
  date: () => {
    const now = new Date().toLocaleString("en-US", { timeZone: "Asia/Ho_Chi_Minh", dateStyle: "full", timeStyle: "long" });
    return [{ text: now }];
  },
  clear: () => "clear",
  "sudo hire anhduy": () => [
    { text: "Password: ████████", color: "rgba(255,255,255,0.4)" },
    { text: "Authenticating...", color: "#f59e0b" },
    { text: "✓ Access granted.", color: "#86efac" },
    { text: "Initiating hire sequence 🔥", color: "#f59e0b" },
    { text: "→ Opening contact form...", color: "rgba(245,158,11,0.6)" },
    ...[(() => {
      setTimeout(() => {
        window.location.href = "mailto:anhduy@example.com?subject=Let's Work Together";
      }, 800);
      return { text: "" };
    })()],
  ],
};

/* ── history entry ─────────────────────────────────────── */
interface HistoryEntry {
  id: number;
  type: "input" | "output" | "error";
  lines: Line[];
}

let COUNTER = 0;

/* ── component ─────────────────────────────────────────── */
export function Terminal() {
  const [history, setHistory] = useState<HistoryEntry[]>([
    {
      id: COUNTER++,
      type: "output",
      lines: [
        { text: "AlphaD Terminal v1.0 — type 'help' for commands.", color: "#f59e0b" },
        { text: "─".repeat(52), color: "rgba(245,158,11,0.2)" },
      ],
    },
  ]);
  const [input, setInput] = useState("");
  const [cmdHistory, setCmdHistory] = useState<string[]>([]);
  const [histIdx, setHistIdx] = useState(-1);
  const [blink, setBlink] = useState(true);
  const inputRef = useRef<HTMLInputElement>(null);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const t = setInterval(() => setBlink((b) => !b), 530);
    return () => clearInterval(t);
  }, []);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [history]);

  const exec = useCallback((raw: string) => {
    const cmd = raw.trim().toLowerCase();
    if (!cmd) return;

    setCmdHistory((h) => [cmd, ...h]);
    setHistIdx(-1);

    const inputEntry: HistoryEntry = {
      id: COUNTER++,
      type: "input",
      lines: [{ text: `> ${raw.trim()}`, color: "#f59e0b" }],
    };

    const handler = COMMANDS[cmd];
    if (cmd === "clear") {
      setHistory([]);
      return;
    }

    const result = handler ? handler() : null;
    const outputEntry: HistoryEntry = handler
      ? { id: COUNTER++, type: "output", lines: result as Line[] }
      : {
          id: COUNTER++,
          type: "error",
          lines: [
            { text: `command not found: ${cmd}`, color: "#f87171" },
            { text: "Type 'help' for available commands.", color: "rgba(255,255,255,0.4)" },
          ],
        };

    setHistory((h) => [...h, inputEntry, outputEntry]);
  }, []);

  const onKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      exec(input);
      setInput("");
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      const next = Math.min(histIdx + 1, cmdHistory.length - 1);
      setHistIdx(next);
      setInput(cmdHistory[next] ?? "");
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      const next = Math.max(histIdx - 1, -1);
      setHistIdx(next);
      setInput(next === -1 ? "" : cmdHistory[next]);
    } else if (e.key === "Tab") {
      e.preventDefault();
      const matches = Object.keys(COMMANDS).filter((c) => c.startsWith(input));
      if (matches.length === 1) setInput(matches[0]);
    }
  };

  return (
    <section id="terminal" className="py-24 container mx-auto px-6">
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
            07.
          </motion.span>
          Terminal
        </h2>
        <motion.div
          className="h-1 bg-primary shadow-[0_0_10px_var(--color-primary)] origin-left"
          initial={{ scaleX: 0, width: "5rem" }}
          whileInView={{ scaleX: 1, width: "5rem" }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
        />
        <p className="mt-3 text-sm font-mono text-muted-foreground">
          Interactive — click to focus, type a command, press Enter.
        </p>
      </motion.div>

      <motion.div
        className="max-w-3xl mx-auto ember-glass rounded-2xl overflow-hidden cursor-text"
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        onClick={() => inputRef.current?.focus()}
        whileHover={{ borderColor: "rgba(245,158,11,0.35)" }}
      >
        {/* title bar */}
        <div
          className="flex items-center gap-2 px-4 py-2.5 border-b"
          style={{ background: "rgba(0,0,0,0.4)", borderColor: "rgba(245,158,11,0.12)" }}
        >
          <span className="w-3 h-3 rounded-full" style={{ background: "#dc2626" }} />
          <span className="w-3 h-3 rounded-full" style={{ background: "#f59e0b" }} />
          <span className="w-3 h-3 rounded-full" style={{ background: "#22c55e" }} />
          <div className="flex items-center gap-1.5 ml-3 text-muted-foreground">
            <TermIcon className="w-3.5 h-3.5" />
            <span className="font-mono text-xs">alphaD — bash</span>
          </div>
        </div>

        {/* output */}
        <div className="px-5 py-4 min-h-[280px] max-h-[420px] overflow-y-auto font-mono text-sm leading-relaxed">
          <AnimatePresence initial={false}>
            {history.map((entry) => (
              <motion.div
                key={entry.id}
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.18 }}
                className="mb-1"
              >
                {entry.lines.map((line, li) => (
                  <div
                    key={li}
                    style={{ color: line.color ?? "rgba(254,243,199,0.75)", whiteSpace: "pre-wrap" }}
                  >
                    {line.text}
                  </div>
                ))}
              </motion.div>
            ))}
          </AnimatePresence>
          <div ref={bottomRef} />

          {/* prompt row */}
          <div className="flex items-center gap-1.5 mt-1">
            <span style={{ color: "#f59e0b" }}>›</span>
            <span style={{ color: "rgba(254,243,199,0.85)" }}>{input}</span>
            <motion.span
              className="inline-block w-[7px] h-[14px] rounded-sm ml-px"
              style={{ background: "#f59e0b" }}
              animate={{ opacity: blink ? 1 : 0 }}
              transition={{ duration: 0 }}
            />
          </div>
        </div>

        {/* hidden real input */}
        <input
          ref={inputRef}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={onKeyDown}
          className="sr-only"
          aria-label="Terminal input"
          autoComplete="off"
          autoCorrect="off"
          autoCapitalize="none"
          spellCheck={false}
        />
      </motion.div>
    </section>
  );
}
