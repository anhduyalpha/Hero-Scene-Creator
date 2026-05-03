import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, ExternalLink } from "lucide-react";

/* ── token types ───────────────────────────────────────── */
type TType = "kw" | "str" | "cmt" | "num" | "type" | "fn" | "punct" | "def";

const COLOR: Record<TType, string> = {
  kw:    "#f59e0b",
  str:   "#86efac",
  cmt:   "rgba(255,255,255,0.28)",
  num:   "#fb923c",
  type:  "#c084fc",
  fn:    "#60a5fa",
  punct: "rgba(254,243,199,0.45)",
  def:   "rgba(254,243,199,0.82)",
};

const KW: Record<string, string[]> = {
  ts:   ["async","await","const","let","var","function","return","if","else","for","while","of","in","throw","try","catch","class","new","import","export","from","type","interface","extends","implements","void","null","undefined","true","false","Promise","string","number","boolean","unknown","never","readonly","private","public"],
  go:   ["func","package","import","var","const","type","struct","interface","map","chan","go","defer","return","if","else","for","range","select","case","default","break","nil","true","false","int","int64","string","bool","any","byte","error","context","make","new"],
  rust: ["fn","pub","use","let","mut","struct","impl","trait","enum","match","if","else","for","while","return","async","await","move","where","type","true","false","self","Self","Arc","Vec","Option","Result","Ok","Err","Some","None","usize","tokio","drop"],
  sql:  ["SELECT","FROM","WHERE","WITH","AS","GROUP","BY","ORDER","HAVING","JOIN","LEFT","RIGHT","INNER","ON","IN","NOT","AND","OR","NULL","INTERVAL","COUNT","MAX","MIN","SUM","OVER","ROW_NUMBER","DISTINCT","LIMIT","DATE","INSERT","UPDATE","INTO","VALUES","OVER"],
};

interface Token { text: string; type: TType }

function tokenizeLine(line: string, lang: string): Token[] {
  const tokens: Token[] = [];
  let i = 0;
  const kws = new Set(KW[lang] ?? []);

  while (i < line.length) {
    // comment
    if ((lang === "ts" || lang === "go" || lang === "rust") && line.slice(i, i + 2) === "//") {
      tokens.push({ text: line.slice(i), type: "cmt" }); break;
    }
    if (lang === "sql" && line.slice(i, i + 2) === "--") {
      tokens.push({ text: line.slice(i), type: "cmt" }); break;
    }
    // string
    if (line[i] === '"' || line[i] === "'" || line[i] === "`") {
      const q = line[i];
      let j = i + 1;
      while (j < line.length && !(line[j] === q && line[j - 1] !== "\\")) j++;
      tokens.push({ text: line.slice(i, j + 1), type: "str" });
      i = j + 1; continue;
    }
    // number
    if (/\d/.test(line[i]) && (i === 0 || /\W/.test(line[i - 1]))) {
      let j = i;
      while (j < line.length && /[\d.]/.test(line[j])) j++;
      tokens.push({ text: line.slice(i, j), type: "num" });
      i = j; continue;
    }
    // word (keyword / type / fn / default)
    if (/[a-zA-Z_$]/.test(line[i])) {
      let j = i;
      while (j < line.length && /[\w$]/.test(line[j])) j++;
      const word = line.slice(i, j);
      let type: TType = "def";
      if (kws.has(word)) type = "kw";
      else if (/^[A-Z]/.test(word)) type = "type";
      else if (j < line.length && line[j] === "(") type = "fn";
      tokens.push({ text: word, type });
      i = j; continue;
    }
    // punctuation vs whitespace
    const ch = line[i];
    const isPunct = /[{}[\]().,;:<>!|&*+\-=/\\^%@#]/.test(ch);
    tokens.push({ text: ch, type: isPunct ? "punct" : "def" });
    i++;
  }
  return tokens;
}

/* ── snippets ───────────────────────────────────────────── */
const SNIPPETS = [
  {
    lang: "ts", langLabel: "TypeScript", langColor: "#3178c6",
    title: "Exponential Backoff Retry",
    url: "https://github.com/anhduyalpha",
    code: `async function withRetry<T>(
  fn: () => Promise<T>,
  retries = 3,
  baseMs = 300,
): Promise<T> {
  for (let i = 0; i < retries; i++) {
    try { return await fn() }
    catch (err) {
      if (i === retries - 1) throw err;
      await sleep(baseMs * 2 ** i);
    }
  }
  throw new Error("unreachable");
}`,
  },
  {
    lang: "go", langLabel: "Go", langColor: "#00ADD8",
    title: "Redis Distributed Lock",
    url: "https://github.com/anhduyalpha",
    code: `func (r *Client) Lock(
  ctx context.Context,
  key string,
  ttl time.Duration,
) (bool, error) {
  ok, err := r.rdb.SetNX(
    ctx, "lock:"+key, 1, ttl,
  ).Result()
  if err != nil {
    return false, fmt.Errorf("lock %q: %w", key, err)
  }
  return ok, nil
}`,
  },
  {
    lang: "rust", langLabel: "Rust", langColor: "#dea584",
    title: "Concurrent Semaphore Batch",
    url: "https://github.com/anhduyalpha",
    code: `pub async fn batch<T, F, Fut>(
  items: Vec<T>,
  limit: usize,
  f: impl Fn(T) -> Fut + Send + Sync,
) where
  T: Send + 'static,
  Fut: Future<Output = ()> + Send,
{
  let sem = Arc::new(Semaphore::new(limit));
  let tasks: Vec<_> = items.into_iter().map(|item| {
    let permit = Arc::clone(&sem).acquire_owned();
    tokio::spawn(async move {
      let _p = permit.await.unwrap();
      f(item).await;
    })
  }).collect();
  join_all(tasks).await;
}`,
  },
  {
    lang: "sql", langLabel: "SQL", langColor: "#e38c00",
    title: "Contribution Streak via Window Fn",
    url: "https://github.com/anhduyalpha",
    code: `WITH days AS (
  SELECT DATE(created_at) AS day
  FROM commits
  WHERE author_id = $1
  GROUP BY 1
),
grouped AS (
  SELECT day,
    day - ROW_NUMBER()
      OVER (ORDER BY day) AS grp
  FROM days
)
SELECT MAX(count) AS longest_streak
FROM (
  SELECT grp, COUNT(*) AS count
  FROM grouped GROUP BY grp
) sub;`,
  },
  {
    lang: "ts", langLabel: "TypeScript", langColor: "#3178c6",
    title: "LRU Cache (O(1) get/set)",
    url: "https://github.com/anhduyalpha",
    code: `class LRU<K, V> {
  #map = new Map<K, V>();
  constructor(private cap: number) {}

  get(key: K): V | undefined {
    if (!this.#map.has(key)) return;
    const v = this.#map.get(key)!;
    this.#map.delete(key);
    this.#map.set(key, v);
    return v;
  }

  set(key: K, v: V): void {
    this.#map.delete(key);
    if (this.#map.size >= this.cap)
      this.#map.delete(
        this.#map.keys().next().value!,
      );
    this.#map.set(key, v);
  }
}`,
  },
];

function CodeLine({ line, lang, delay }: { line: string; lang: string; delay: number }) {
  const tokens = tokenizeLine(line, lang);
  return (
    <motion.div
      className="flex flex-wrap"
      initial={{ opacity: 0, x: -8 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.28, delay, ease: "easeOut" }}
    >
      {tokens.map((t, i) => (
        <span key={i} style={{ color: COLOR[t.type], whiteSpace: "pre" }}>{t.text}</span>
      ))}
    </motion.div>
  );
}

export function CodeCarousel() {
  const [idx, setIdx] = useState(0);
  const [dir, setDir] = useState(1);
  const [key, setKey] = useState(0);

  const go = useCallback((newIdx: number, direction: number) => {
    setDir(direction);
    setIdx((newIdx + SNIPPETS.length) % SNIPPETS.length);
    setKey((k) => k + 1);
  }, []);

  useEffect(() => {
    const t = setTimeout(() => go(idx + 1, 1), 7000);
    return () => clearTimeout(t);
  }, [idx, go, key]);

  const snippet = SNIPPETS[idx];
  const lines = snippet.code.split("\n");

  return (
    <section id="code-craft" className="py-24 container mx-auto px-6">
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
            02.5
          </motion.span>
          <span>The Craft</span>
        </h2>
        <motion.div
          className="h-1 bg-primary shadow-[0_0_10px_var(--color-primary)] origin-left"
          initial={{ scaleX: 0, width: "5rem" }}
          whileInView={{ scaleX: 1, width: "5rem" }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
        />
        <p className="mt-3 text-sm font-mono text-muted-foreground">
          Real patterns from production code — hover to pause, arrow to navigate.
        </p>
      </motion.div>

      <div className="max-w-4xl mx-auto">
        <div
          className="ember-glass rounded-2xl overflow-hidden"
          onMouseEnter={() => {}}
        >
          {/* header bar */}
          <div
            className="flex items-center justify-between px-5 py-3 border-b"
            style={{ borderColor: "rgba(245,158,11,0.12)", background: "rgba(0,0,0,0.3)" }}
          >
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full" style={{ background: "#dc2626" }} />
              <span className="w-3 h-3 rounded-full" style={{ background: "#f59e0b" }} />
              <span className="w-3 h-3 rounded-full" style={{ background: "#22c55e" }} />
              <span className="ml-3 font-mono text-xs text-muted-foreground">
                {snippet.title}
              </span>
            </div>
            <div className="flex items-center gap-3">
              <motion.span
                className="px-2 py-0.5 rounded text-[11px] font-mono font-semibold"
                style={{ background: `${snippet.langColor}22`, color: snippet.langColor, border: `1px solid ${snippet.langColor}44` }}
                key={snippet.lang + idx}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.25 }}
              >
                {snippet.langLabel}
              </motion.span>
              <a
                href={snippet.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-primary transition-colors"
                aria-label="View source"
              >
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>

          {/* code body */}
          <div className="px-6 py-5 min-h-[320px] relative overflow-hidden">
            <AnimatePresence mode="wait" initial={false}>
              <motion.div
                key={key}
                initial={{ opacity: 0, x: dir * 24 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: dir * -24 }}
                transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                className="font-mono text-sm leading-relaxed"
                style={{ tabSize: 2 }}
              >
                {lines.map((line, li) => (
                  <CodeLine
                    key={li}
                    line={line === "" ? " " : line}
                    lang={snippet.lang}
                    delay={li * 0.028}
                  />
                ))}
              </motion.div>
            </AnimatePresence>
          </div>

          {/* footer nav */}
          <div
            className="flex items-center justify-between px-5 py-3 border-t"
            style={{ borderColor: "rgba(245,158,11,0.10)", background: "rgba(0,0,0,0.25)" }}
          >
            <div className="flex gap-1.5">
              {SNIPPETS.map((_, i) => (
                <button
                  key={i}
                  onClick={() => go(i, i > idx ? 1 : -1)}
                  aria-label={`Go to snippet ${i + 1}`}
                  className="w-1.5 h-1.5 rounded-full transition-all duration-200"
                  style={{
                    background: i === idx ? "#f59e0b" : "rgba(245,158,11,0.25)",
                    transform: i === idx ? "scale(1.4)" : "scale(1)",
                  }}
                />
              ))}
            </div>
            <div className="flex gap-2">
              {[
                { label: "prev", icon: <ChevronLeft className="w-4 h-4" />, dir: -1, next: idx - 1 },
                { label: "next", icon: <ChevronRight className="w-4 h-4" />, dir: 1, next: idx + 1 },
              ].map((btn) => (
                <motion.button
                  key={btn.label}
                  onClick={() => go(btn.next, btn.dir)}
                  aria-label={btn.label}
                  className="w-7 h-7 flex items-center justify-center rounded-md text-muted-foreground"
                  style={{ background: "rgba(245,158,11,0.08)", border: "1px solid rgba(245,158,11,0.15)" }}
                  whileHover={{ color: "#f59e0b", background: "rgba(245,158,11,0.16)", borderColor: "rgba(245,158,11,0.4)" }}
                  whileTap={{ scale: 0.9 }}
                  transition={{ duration: 0.15 }}
                >
                  {btn.icon}
                </motion.button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
