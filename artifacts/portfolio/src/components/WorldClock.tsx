import { useEffect, useState } from "react";
import { motion } from "framer-motion";

const CITIES = [
  { label: "HCMC",   tz: "Asia/Ho_Chi_Minh", flag: "🇻🇳" },
  { label: "SF",     tz: "America/Los_Angeles", flag: "🇺🇸" },
  { label: "London", tz: "Europe/London",       flag: "🇬🇧" },
];

function getTime(tz: string) {
  return new Date().toLocaleTimeString("en-GB", {
    timeZone: tz,
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
  });
}

export function WorldClock() {
  const [times, setTimes] = useState(() => CITIES.map((c) => getTime(c.tz)));
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const t = setInterval(() => {
      setTimes(CITIES.map((c) => getTime(c.tz)));
    }, 1000);
    return () => clearInterval(t);
  }, []);

  return (
    <motion.div
      className="fixed bottom-20 left-4 z-40 select-none"
      initial={{ opacity: 0, x: -12 }}
      animate={{ opacity: visible ? 1 : 0, x: visible ? 0 : -12 }}
      transition={{ duration: 0.3 }}
      onMouseEnter={() => setVisible(true)}
    >
      <div
        className="rounded-xl overflow-hidden font-mono text-[10px] leading-none"
        style={{
          background: "rgba(10,6,2,0.88)",
          border: "1px solid rgba(245,158,11,0.18)",
          backdropFilter: "blur(16px)",
          boxShadow: "0 4px 24px rgba(0,0,0,0.55)",
        }}
      >
        {/* header */}
        <div
          className="flex items-center gap-1.5 px-3 py-1.5 border-b"
          style={{ borderColor: "rgba(245,158,11,0.12)" }}
        >
          <span
            className="w-1.5 h-1.5 rounded-full"
            style={{ background: "#f59e0b", boxShadow: "0 0 4px rgba(245,158,11,0.7)" }}
          />
          <span className="uppercase tracking-widest text-[8px]" style={{ color: "rgba(245,158,11,0.55)" }}>
            World Clock
          </span>
        </div>

        {/* rows */}
        <div className="px-3 py-2 flex flex-col gap-2">
          {CITIES.map((city, i) => (
            <div key={city.label} className="flex items-center gap-2.5">
              <span className="text-[11px]">{city.flag}</span>
              <span
                className="w-10 text-[9px] uppercase tracking-wider"
                style={{ color: "rgba(254,243,199,0.45)" }}
              >
                {city.label}
              </span>
              <motion.span
                key={times[i]}
                className="tabular-nums font-bold"
                style={{ color: "#f59e0b", letterSpacing: "0.04em" }}
                initial={{ opacity: 0.6 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.15 }}
              >
                {times[i]}
              </motion.span>
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}
