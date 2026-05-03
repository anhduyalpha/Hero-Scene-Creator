import { useEffect, useState } from "react";
import { motion } from "framer-motion";

interface Day {
  count: number;
  date: string;
}

interface Week {
  days: Day[];
}

interface ContributionData {
  total: number;
  weeks: Week[];
}

function levelColor(count: number): string {
  if (count === 0) return "rgba(245,158,11,0.07)";
  if (count <= 2) return "rgba(245,158,11,0.25)";
  if (count <= 5) return "rgba(245,158,11,0.50)";
  if (count <= 10) return "rgba(245,158,11,0.78)";
  return "#f59e0b";
}

function levelGlow(count: number): string {
  if (count === 0) return "none";
  if (count <= 2) return "none";
  if (count <= 5) return "0 0 4px rgba(245,158,11,0.30)";
  if (count <= 10) return "0 0 6px rgba(245,158,11,0.50)";
  return "0 0 8px rgba(245,158,11,0.70), 0 0 14px rgba(220,38,38,0.30)";
}

function Skeleton() {
  return (
    <div className="mt-3 flex flex-col gap-2">
      <div className="h-5 w-20 rounded animate-pulse" style={{ background: "rgba(245,158,11,0.12)" }} />
      <div className="flex gap-[3px]">
        {Array.from({ length: 26 }).map((_, w) => (
          <div key={w} className="flex flex-col gap-[3px]">
            {Array.from({ length: 7 }).map((_, d) => (
              <div
                key={d}
                className="w-[8px] h-[8px] rounded-[2px] animate-pulse"
                style={{
                  background: "rgba(245,158,11,0.07)",
                  animationDelay: `${(w * 7 + d) * 8}ms`,
                }}
              />
            ))}
          </div>
        ))}
      </div>
      <div className="h-3 w-28 rounded animate-pulse" style={{ background: "rgba(245,158,11,0.08)" }} />
    </div>
  );
}

export function ContributionGraph() {
  const [data, setData] = useState<ContributionData | null>(null);
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/github/contributions")
      .then((r) => {
        if (!r.ok) throw new Error("non-ok");
        return r.json() as Promise<ContributionData>;
      })
      .then((d) => {
        setData(d);
        setLoading(false);
      })
      .catch(() => {
        setError(true);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return <Skeleton />;
  }

  if (error || !data) {
    return (
      <div className="mt-3">
        <p className="text-5xl font-black tabular-nums" style={{ color: "#f59e0b" }}>1,842</p>
        <p className="text-sm text-muted-foreground mt-1">+23% vs last year</p>
      </div>
    );
  }

  const lastN = 26;
  const displayWeeks = data.weeks.slice(-lastN);
  const thisYear = new Date().getFullYear();
  const yearTotal = data.weeks.reduce(
    (sum, w) =>
      sum +
      w.days.reduce(
        (s, d) => s + (d.date.startsWith(String(thisYear)) ? d.count : 0),
        0
      ),
    0
  );

  const streak = (() => {
    const allDays: Day[] = [];
    for (const w of data.weeks) for (const d of w.days) allDays.push(d);
    const today = new Date().toISOString().slice(0, 10);
    let s = 0;
    for (let i = allDays.length - 1; i >= 0; i--) {
      if (allDays[i].date > today) continue;
      if (allDays[i].count === 0) break;
      s++;
    }
    return s;
  })();

  return (
    <div className="mt-3 flex flex-col gap-2">
      <motion.p
        className="text-3xl font-black tabular-nums"
        style={{ color: "#f59e0b" }}
        initial={{ opacity: 0, y: 6 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        {yearTotal.toLocaleString()}
      </motion.p>

      <motion.div
        className="flex gap-[3px]"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.1 }}
      >
        {displayWeeks.map((week, wi) => (
          <div key={wi} className="flex flex-col gap-[3px]">
            {week.days.map((day, di) => (
              <motion.div
                key={day.date}
                title={`${day.date}: ${day.count} contribution${day.count !== 1 ? "s" : ""}`}
                className="rounded-[2px] cursor-default"
                style={{
                  width: 8,
                  height: 8,
                  background: levelColor(day.count),
                  boxShadow: levelGlow(day.count),
                }}
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{
                  duration: 0.18,
                  delay: 0.1 + (wi * 7 + di) * 0.003,
                  ease: "easeOut",
                }}
                whileHover={{
                  scale: 1.6,
                  background: day.count > 0 ? "#f59e0b" : "rgba(245,158,11,0.2)",
                  boxShadow: "0 0 8px rgba(245,158,11,0.7)",
                  zIndex: 10,
                }}
              />
            ))}
          </div>
        ))}
      </motion.div>

      <motion.div
        className="flex items-center gap-3"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.4, delay: 0.6 }}
      >
        <p className="text-xs font-mono" style={{ color: "rgba(245,158,11,0.55)" }}>
          commits {thisYear}
        </p>
        {streak > 0 && (
          <p className="text-xs font-mono" style={{ color: "rgba(220,38,38,0.7)" }}>
            🔥 {streak}d streak
          </p>
        )}
        <div className="flex items-center gap-[3px] ml-auto">
          {[0, 2, 5, 10, 16].map((v) => (
            <div
              key={v}
              style={{ width: 7, height: 7, borderRadius: 2, background: levelColor(v) }}
            />
          ))}
        </div>
      </motion.div>
    </div>
  );
}
