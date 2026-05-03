import { useEffect, useRef, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search, ArrowRight, Copy, Github, Mail, ChevronUp,
  Code2, User, Briefcase, BookOpen, Terminal, Zap,
} from "lucide-react";

/* ── command definitions ─────────────────────────────── */
type CmdCategory = "Navigate" | "Actions";
interface Cmd {
  id: string;
  label: string;
  sublabel?: string;
  category: CmdCategory;
  icon: React.ReactNode;
  action: () => void;
}

function scrollTo(id: string) {
  document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
}

async function copyText(text: string) {
  await navigator.clipboard.writeText(text);
}

const NAV_ICON_MAP: Record<string, React.ReactNode> = {
  about: <User className="w-4 h-4" />,
  skills: <Zap className="w-4 h-4" />,
  "code-craft": <Code2 className="w-4 h-4" />,
  projects: <Briefcase className="w-4 h-4" />,
  "open-source": <Github className="w-4 h-4" />,
  experience: <Briefcase className="w-4 h-4" />,
  blog: <BookOpen className="w-4 h-4" />,
  terminal: <Terminal className="w-4 h-4" />,
  contact: <Mail className="w-4 h-4" />,
};

function buildCommands(close: () => void): Cmd[] {
  const nav: Cmd[] = [
    { id: "about",       label: "About",       sublabel: "01",   category: "Navigate" as CmdCategory, icon: NAV_ICON_MAP["about"]       },
    { id: "skills",      label: "Skills",       sublabel: "02",   category: "Navigate" as CmdCategory, icon: NAV_ICON_MAP["skills"]      },
    { id: "code-craft",  label: "The Craft",    sublabel: "02.5", category: "Navigate" as CmdCategory, icon: NAV_ICON_MAP["code-craft"]  },
    { id: "projects",    label: "Projects",     sublabel: "03",   category: "Navigate" as CmdCategory, icon: NAV_ICON_MAP["projects"]    },
    { id: "open-source", label: "Open Source",  sublabel: "04",   category: "Navigate" as CmdCategory, icon: NAV_ICON_MAP["open-source"] },
    { id: "experience",  label: "Experience",   sublabel: "05",   category: "Navigate" as CmdCategory, icon: NAV_ICON_MAP["experience"]  },
    { id: "blog",        label: "Blog",          sublabel: "06",   category: "Navigate" as CmdCategory, icon: NAV_ICON_MAP["blog"]        },
    { id: "terminal",    label: "Terminal",      sublabel: "07",   category: "Navigate" as CmdCategory, icon: NAV_ICON_MAP["terminal"]    },
    { id: "contact",     label: "Contact",       sublabel: "08",   category: "Navigate" as CmdCategory, icon: NAV_ICON_MAP["contact"]     },
  ].map((n) => ({
    ...n,
    action: () => { close(); setTimeout(() => scrollTo(n.id), 120); },
  }));

  const actions: Cmd[] = [
    {
      id: "copy-email", label: "Copy Email", sublabel: "anhduy@example.com",
      category: "Actions", icon: <Copy className="w-4 h-4" />,
      action: () => { copyText("anhduy@example.com"); close(); },
    },
    {
      id: "github", label: "Open GitHub", sublabel: "github.com/anhduyalpha",
      category: "Actions", icon: <Github className="w-4 h-4" />,
      action: () => { window.open("https://github.com/anhduyalpha", "_blank"); close(); },
    },
    {
      id: "top", label: "Scroll to Top",
      category: "Actions", icon: <ChevronUp className="w-4 h-4" />,
      action: () => { close(); window.scrollTo({ top: 0, behavior: "smooth" }); },
    },
    {
      id: "resume", label: "Request Resume",
      category: "Actions", icon: <ArrowRight className="w-4 h-4" />,
      action: () => { window.location.href = "mailto:anhduy@example.com?subject=Resume Request"; close(); },
    },
  ];

  return [...nav, ...actions];
}

/* ── component ───────────────────────────────────────── */
export function CommandPalette() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  const close = useCallback(() => {
    setOpen(false);
    setQuery("");
    setSelected(0);
  }, []);

  const COMMANDS = buildCommands(close);

  const filtered = query.trim()
    ? COMMANDS.filter(
        (c) =>
          c.label.toLowerCase().includes(query.toLowerCase()) ||
          c.sublabel?.toLowerCase().includes(query.toLowerCase()) ||
          c.category.toLowerCase().includes(query.toLowerCase())
      )
    : COMMANDS;

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setOpen((o) => !o);
      }
      if (!open) return;
      if (e.key === "Escape") close();
      if (e.key === "ArrowDown") { e.preventDefault(); setSelected((s) => Math.min(s + 1, filtered.length - 1)); }
      if (e.key === "ArrowUp")   { e.preventDefault(); setSelected((s) => Math.max(s - 1, 0)); }
      if (e.key === "Enter") { e.preventDefault(); filtered[selected]?.action(); }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, close, filtered, selected]);

  useEffect(() => { if (open) setTimeout(() => inputRef.current?.focus(), 50); }, [open]);
  useEffect(() => { setSelected(0); }, [query]);

  /* group by category */
  const grouped = filtered.reduce<Record<string, Cmd[]>>((acc, cmd) => {
    (acc[cmd.category] ??= []).push(cmd);
    return acc;
  }, {});

  return (
    <AnimatePresence>
      {open && (
        <>
          {/* backdrop */}
          <motion.div
            className="fixed inset-0 z-[90] bg-black/60"
            style={{ backdropFilter: "blur(4px)", WebkitBackdropFilter: "blur(4px)" }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.18 }}
            onClick={close}
          />

          {/* panel */}
          <div className="fixed inset-0 z-[91] flex items-start justify-center pt-[15vh] px-4 pointer-events-none">
            <motion.div
              className="w-full max-w-lg pointer-events-auto overflow-hidden rounded-2xl"
              style={{
                background: "rgba(10,6,2,0.96)",
                border: "1px solid rgba(245,158,11,0.2)",
                backdropFilter: "blur(32px) saturate(200%)",
                WebkitBackdropFilter: "blur(32px) saturate(200%)",
                boxShadow: "0 32px 80px rgba(0,0,0,0.8), 0 0 0 0.5px rgba(245,158,11,0.08), 0 0 60px rgba(245,158,11,0.04)",
              }}
              initial={{ opacity: 0, y: -20, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -12, scale: 0.97 }}
              transition={{ type: "spring", stiffness: 380, damping: 28 }}
            >
              {/* search bar */}
              <div
                className="flex items-center gap-3 px-4 py-3.5 border-b"
                style={{ borderColor: "rgba(245,158,11,0.12)" }}
              >
                <Search className="w-4 h-4 flex-shrink-0" style={{ color: "rgba(245,158,11,0.5)" }} />
                <input
                  ref={inputRef}
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search sections, actions..."
                  className="flex-1 bg-transparent outline-none font-mono text-sm placeholder:text-muted-foreground"
                  style={{ color: "rgba(254,243,199,0.9)" }}
                  autoComplete="off"
                  spellCheck={false}
                />
                <kbd
                  className="hidden sm:block font-mono text-[10px] px-1.5 py-0.5 rounded border"
                  style={{
                    color: "rgba(245,158,11,0.5)",
                    borderColor: "rgba(245,158,11,0.2)",
                    background: "rgba(245,158,11,0.06)",
                  }}
                >
                  ESC
                </kbd>
              </div>

              {/* results */}
              <div className="max-h-[380px] overflow-y-auto py-2">
                {filtered.length === 0 && (
                  <p className="text-center font-mono text-sm text-muted-foreground py-10">
                    No results for "{query}"
                  </p>
                )}

                {Object.entries(grouped).map(([category, cmds]) => {
                  let globalIdx = filtered.indexOf(cmds[0]);
                  return (
                    <div key={category}>
                      <p
                        className="px-4 pt-3 pb-1 font-mono text-[10px] uppercase tracking-widest"
                        style={{ color: "rgba(245,158,11,0.4)" }}
                      >
                        {category}
                      </p>
                      {cmds.map((cmd) => {
                        const idx = globalIdx++;
                        const isSelected = idx === selected;
                        return (
                          <motion.button
                            key={cmd.id}
                            className="w-full flex items-center gap-3 px-4 py-2.5 text-left transition-colors"
                            style={{
                              background: isSelected ? "rgba(245,158,11,0.1)" : "transparent",
                              borderLeft: isSelected ? "2px solid rgba(245,158,11,0.6)" : "2px solid transparent",
                            }}
                            onClick={cmd.action}
                            onMouseEnter={() => setSelected(idx)}
                          >
                            <span
                              className="flex-shrink-0 w-7 h-7 flex items-center justify-center rounded-md"
                              style={{
                                background: isSelected ? "rgba(245,158,11,0.15)" : "rgba(255,255,255,0.04)",
                                color: isSelected ? "#f59e0b" : "rgba(255,255,255,0.4)",
                              }}
                            >
                              {cmd.icon}
                            </span>
                            <span className="flex-1 min-w-0">
                              <span
                                className="block font-mono text-sm truncate"
                                style={{ color: isSelected ? "rgba(254,243,199,0.95)" : "rgba(254,243,199,0.7)" }}
                              >
                                {cmd.label}
                              </span>
                              {cmd.sublabel && (
                                <span className="block font-mono text-[11px] text-muted-foreground truncate">
                                  {cmd.sublabel}
                                </span>
                              )}
                            </span>
                            {isSelected && (
                              <kbd
                                className="font-mono text-[10px] px-1.5 py-0.5 rounded border flex-shrink-0"
                                style={{
                                  color: "rgba(245,158,11,0.6)",
                                  borderColor: "rgba(245,158,11,0.25)",
                                  background: "rgba(245,158,11,0.08)",
                                }}
                              >
                                ↵
                              </kbd>
                            )}
                          </motion.button>
                        );
                      })}
                    </div>
                  );
                })}
              </div>

              {/* footer hint */}
              <div
                className="flex items-center gap-4 px-4 py-2.5 border-t"
                style={{ borderColor: "rgba(245,158,11,0.08)" }}
              >
                {[
                  ["↑↓", "navigate"],
                  ["↵", "select"],
                  ["esc", "close"],
                ].map(([key, label]) => (
                  <span key={key} className="flex items-center gap-1.5 font-mono text-[10px] text-muted-foreground">
                    <kbd
                      className="px-1 py-0.5 rounded border text-[9px]"
                      style={{ borderColor: "rgba(255,255,255,0.1)", background: "rgba(255,255,255,0.04)" }}
                    >
                      {key}
                    </kbd>
                    {label}
                  </span>
                ))}
                <span className="ml-auto font-mono text-[10px] text-muted-foreground opacity-40">
                  ⌘K
                </span>
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}
