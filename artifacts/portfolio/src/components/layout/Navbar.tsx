import { motion, useScroll, useSpring } from "framer-motion";
import { useEffect, useState } from "react";
import { Menu, X } from "lucide-react";

export function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("");

  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 100, damping: 30, restDelta: 0.001 });

  const links = [
    { name: "About",      href: "#about" },
    { name: "Projects",   href: "#projects" },
    { name: "Experience", href: "#experience" },
    { name: "Contact",    href: "#contact" },
    { name: "Blog",       href: "#blog" },
  ];

  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => entries.forEach((e) => e.isIntersecting && setActiveSection(e.target.id)),
      { rootMargin: "-50% 0px -50% 0px" }
    );
    document.querySelectorAll("section[id]").forEach((s) => observer.observe(s));
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!isMobileMenuOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setIsMobileMenuOpen(false);
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [isMobileMenuOpen]);

  return (
    <>
      {/* Amber scroll progress bar */}
      <motion.div
        role="progressbar"
        aria-label="Page scroll progress"
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={0}
        className="fixed top-0 left-0 right-0 h-[2px] z-[60] origin-left"
        style={{
          scaleX,
          background: "linear-gradient(to right, #b45309, #f59e0b, #dc2626)",
          boxShadow: "0 0 10px rgba(245,158,11,0.5)",
        }}
      />

      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          isScrolled ? "py-3" : "py-6"
        }`}
        style={isScrolled ? {
          background: "linear-gradient(180deg, rgba(10,6,2,0.88) 0%, rgba(6,4,2,0.84) 100%)",
          backdropFilter: "blur(24px) saturate(180%)",
          WebkitBackdropFilter: "blur(24px) saturate(180%)",
          borderBottom: "1px solid rgba(245,158,11,0.12)",
          boxShadow: "0 8px 32px rgba(0,0,0,0.6), inset 0 -1px 0 rgba(245,158,11,0.08)",
        } : {}}
      >
        <div className="container mx-auto px-6 flex items-center justify-between">
          <a
            href="#hero"
            className="flex items-center gap-1.5 tracking-tight transition-all duration-200 hover:opacity-85 focus-visible:outline-2 focus-visible:outline-primary focus-visible:outline-offset-4 rounded-sm group"
            aria-label="AlphaD — back to top"
          >
            <span
              className="text-2xl font-black"
              style={{
                fontFamily: "'Space Grotesk', sans-serif",
                background: "linear-gradient(135deg, #fef3c7 0%, #f59e0b 55%, #dc2626 100%)",
                WebkitBackgroundClip: "text",
                backgroundClip: "text",
                color: "transparent",
              }}
            >
              α
            </span>
            <span
              className="text-xl font-bold"
              style={{
                fontFamily: "'Space Grotesk', sans-serif",
                background: "linear-gradient(135deg, #fde68a 0%, #f59e0b 70%, #b45309 100%)",
                WebkitBackgroundClip: "text",
                backgroundClip: "text",
                color: "transparent",
              }}
            >
              D
            </span>
            <span
              className="text-[10px] font-mono tracking-[0.2em] uppercase self-end mb-0.5 opacity-50 group-hover:opacity-70 transition-opacity"
              style={{ color: "#f59e0b" }}
            >
              ·AlphaD
            </span>
          </a>

          <nav className="hidden md:flex items-center gap-8" aria-label="Primary navigation">
            <ul className="flex items-center gap-8 m-0 p-0 list-none">
              {links.map((link, i) => {
                const isActive = activeSection === link.href.slice(1);
                return (
                  <motion.li
                    key={link.name}
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: i * 0.08 }}
                    className="relative"
                  >
                    <a
                      href={link.href}
                      className="font-mono text-sm flex items-center gap-1.5 rounded px-1 py-0.5 focus-visible:outline-2 focus-visible:outline-primary focus-visible:outline-offset-2 transition-colors duration-200"
                      style={{
                        color: isActive ? "hsl(var(--primary))" : "hsl(var(--muted-foreground))",
                        touchAction: "manipulation",
                      }}
                      onMouseEnter={(e) => !isActive && ((e.currentTarget as HTMLElement).style.color = "hsl(var(--foreground))")}
                      onMouseLeave={(e) => !isActive && ((e.currentTarget as HTMLElement).style.color = "hsl(var(--muted-foreground))")}
                    >
                      <span className="text-[10px]" style={{ color: "rgba(245,158,11,0.6)" }}>0{i + 1}.</span>
                      {link.name}
                    </a>

                    {isActive && (
                      <motion.div
                        layoutId="nav-active"
                        className="absolute -bottom-1 left-0 right-0 h-[2px] rounded-full"
                        style={{
                          background: "linear-gradient(to right, #f59e0b, #dc2626)",
                          boxShadow: "0 0 8px rgba(245,158,11,0.5)",
                        }}
                        transition={{ type: "spring", stiffness: 380, damping: 30 }}
                      />
                    )}
                  </motion.li>
                );
              })}
            </ul>

            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: links.length * 0.08 }}
            >
              <a
                href="#"
                className="relative overflow-hidden group px-4 py-2 font-mono text-sm text-primary rounded-lg focus-visible:outline-2 focus-visible:outline-primary focus-visible:outline-offset-2 transition-all duration-300"
                style={{
                  background: "linear-gradient(135deg, rgba(245,158,11,0.12) 0%, rgba(180,83,9,0.08) 100%)",
                  border: "1px solid rgba(245,158,11,0.28)",
                  boxShadow: "inset 0 1px 0 rgba(255,255,255,0.04)",
                  touchAction: "manipulation",
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLElement).style.background = "linear-gradient(135deg, rgba(245,158,11,0.20) 0%, rgba(180,83,9,0.14) 100%)";
                  (e.currentTarget as HTMLElement).style.borderColor = "rgba(245,158,11,0.50)";
                  (e.currentTarget as HTMLElement).style.boxShadow = "0 0 16px rgba(245,158,11,0.2), inset 0 1px 0 rgba(255,255,255,0.06)";
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLElement).style.background = "linear-gradient(135deg, rgba(245,158,11,0.12) 0%, rgba(180,83,9,0.08) 100%)";
                  (e.currentTarget as HTMLElement).style.borderColor = "rgba(245,158,11,0.28)";
                  (e.currentTarget as HTMLElement).style.boxShadow = "inset 0 1px 0 rgba(255,255,255,0.04)";
                }}
                aria-label="Download resume"
              >
                <span className="relative z-10">Resume</span>
              </a>
            </motion.div>
          </nav>

          <button
            className="md:hidden w-11 h-11 flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors duration-200 rounded-lg focus-visible:outline-2 focus-visible:outline-primary"
            onClick={() => setIsMobileMenuOpen((o) => !o)}
            aria-label={isMobileMenuOpen ? "Close menu" : "Open menu"}
            aria-expanded={isMobileMenuOpen}
            aria-controls="mobile-nav"
            style={{ touchAction: "manipulation" }}
          >
            {isMobileMenuOpen ? <X className="w-5 h-5" aria-hidden="true" /> : <Menu className="w-5 h-5" aria-hidden="true" />}
          </button>
        </div>

        {isMobileMenuOpen && (
          <motion.div
            id="mobile-nav"
            initial={{ opacity: 0, y: -16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -16 }}
            className="absolute top-full left-0 right-0 py-4 md:hidden"
            style={{
              background: "linear-gradient(180deg, rgba(10,6,2,0.97) 0%, rgba(6,4,2,0.94) 100%)",
              backdropFilter: "blur(24px) saturate(180%)",
              WebkitBackdropFilter: "blur(24px) saturate(180%)",
              borderBottom: "1px solid rgba(245,158,11,0.14)",
              boxShadow: "0 16px 40px rgba(0,0,0,0.7)",
            }}
          >
            <nav className="flex flex-col items-center gap-2 py-6" aria-label="Mobile navigation">
              {links.map((link, i) => (
                <a
                  key={link.name}
                  href={link.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="w-full text-center font-mono text-lg text-muted-foreground hover:text-primary transition-colors duration-200 py-3 focus-visible:outline-2 focus-visible:outline-primary"
                  style={{ touchAction: "manipulation" }}
                >
                  <span className="text-primary/60 text-sm mr-2">0{i + 1}.</span>
                  {link.name}
                </a>
              ))}
              <a
                href="#"
                className="mt-4 px-8 py-3 font-mono text-primary rounded-xl focus-visible:outline-2 focus-visible:outline-primary transition-all duration-200"
                style={{
                  background: "linear-gradient(135deg, rgba(245,158,11,0.15) 0%, rgba(180,83,9,0.10) 100%)",
                  border: "1px solid rgba(245,158,11,0.30)",
                  touchAction: "manipulation",
                }}
              >
                Resume
              </a>
            </nav>
          </motion.div>
        )}
      </header>
    </>
  );
}
