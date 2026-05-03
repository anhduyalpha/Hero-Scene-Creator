import { createContext, useContext, useState, useEffect, ReactNode } from "react";

interface CursorContextValue {
  enabled: boolean;
  toggle: () => void;
}

const CursorContext = createContext<CursorContextValue>({
  enabled: true,
  toggle: () => {},
});

export function CursorProvider({ children }: { children: ReactNode }) {
  const [enabled, setEnabled] = useState(() => {
    try {
      const stored = localStorage.getItem("custom-cursor");
      return stored === null ? true : stored === "true";
    } catch {
      return true;
    }
  });

  useEffect(() => {
    localStorage.setItem("custom-cursor", String(enabled));
    if (enabled) {
      document.documentElement.classList.add("custom-cursor");
    } else {
      document.documentElement.classList.remove("custom-cursor");
    }
  }, [enabled]);

  useEffect(() => {
    document.documentElement.classList.add("custom-cursor");
  }, []);

  const toggle = () => setEnabled((prev) => !prev);

  return (
    <CursorContext.Provider value={{ enabled, toggle }}>
      {children}
    </CursorContext.Provider>
  );
}

export function useCursor() {
  return useContext(CursorContext);
}
