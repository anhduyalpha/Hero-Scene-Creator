import { activeSocials } from "../../config/socials";
import { SocialIcon } from "../SocialIcon";
import { BackgroundMusic } from "../BackgroundMusic";

export function Footer() {
  return (
    <footer className="relative mt-24 overflow-hidden border-t border-[rgba(245,158,11,0.08)] bg-background/90 py-16">
      <div
        className="absolute inset-x-0 top-0 h-px"
        style={{ background: "linear-gradient(to right, transparent, rgba(245,158,11,0.22), transparent)" }}
      />
      <div
        className="absolute inset-0 opacity-30"
        style={{
          background:
            "radial-gradient(circle at top, rgba(245,158,11,0.08), transparent 42%), radial-gradient(circle at bottom right, rgba(220,38,38,0.05), transparent 30%)",
        }}
      />

      <div className="container relative mx-auto grid max-w-6xl grid-cols-1 gap-8 px-6 md:grid-cols-[1fr_0.95fr_1fr] md:items-start">
        <div className="rounded-[24px] border border-[rgba(245,158,11,0.08)] bg-[rgba(6,4,2,0.28)] p-5 backdrop-blur-md">
          <div className="flex flex-col items-start gap-3">
            <a href="#hero" className="group flex items-center gap-1.5" aria-label="AlphaD — back to top">
              <span
                className="text-3xl font-black transition-transform duration-300 group-hover:-translate-y-0.5"
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
                className="text-2xl font-bold transition-transform duration-300 group-hover:-translate-y-0.5"
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
            </a>
            <p className="text-xs font-mono tracking-[0.22em]" style={{ color: "rgba(245,158,11,0.48)" }}>
              ANH DUY · ALPHAD
            </p>
            <p className="max-w-xs text-sm leading-6 text-muted-foreground">
              Forging scalable systems and beautiful interfaces with a warm ember glow.
            </p>
          </div>
        </div>

        <nav
          className="rounded-[24px] border border-[rgba(245,158,11,0.08)] bg-[rgba(6,4,2,0.2)] p-5 backdrop-blur-md"
          aria-label="Footer navigation"
        >
          <div className="flex flex-wrap justify-start gap-x-7 gap-y-3 md:justify-center">
            <a href="#about" className="rounded-sm text-sm font-mono text-muted-foreground transition-colors hover:text-primary focus-visible:outline-2 focus-visible:outline-primary">01. About</a>
            <a href="#projects" className="rounded-sm text-sm font-mono text-muted-foreground transition-colors hover:text-primary focus-visible:outline-2 focus-visible:outline-primary">02. Projects</a>
            <a href="#experience" className="rounded-sm text-sm font-mono text-muted-foreground transition-colors hover:text-primary focus-visible:outline-2 focus-visible:outline-primary">03. Experience</a>
            <a href="#blog" className="rounded-sm text-sm font-mono text-muted-foreground transition-colors hover:text-primary focus-visible:outline-2 focus-visible:outline-primary">04. Blog</a>
            <a href="#contact" className="rounded-sm text-sm font-mono text-muted-foreground transition-colors hover:text-primary focus-visible:outline-2 focus-visible:outline-primary">05. Contact</a>
          </div>
        </nav>

        <div className="flex flex-col items-stretch gap-4 md:items-end">
          <div className="rounded-[24px] border border-[rgba(245,158,11,0.08)] bg-[rgba(6,4,2,0.18)] p-3 backdrop-blur-md">
            <BackgroundMusic />
          </div>

          {activeSocials.length > 0 && (
            <ul className="flex flex-wrap justify-start gap-3 md:justify-end">
              {activeSocials.map((s) => (
                <li key={s.platform}>
                  <a
                    href={s.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={s.platform}
                    className="flex h-10 w-10 items-center justify-center rounded-xl border border-[rgba(245,158,11,0.08)] bg-[rgba(245,158,11,0.03)] text-muted-foreground transition-all duration-200 hover:-translate-y-0.5 hover:border-[rgba(245,158,11,0.22)] hover:text-primary focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background"
                  >
                    <SocialIcon icon={s.icon} className="h-4 w-4" />
                  </a>
                </li>
              ))}
            </ul>
          )}
          <p className="font-mono text-xs text-muted-foreground md:text-right">
            Designed & Built by <span style={{ color: "#f59e0b" }}>Anh Duy</span>
          </p>
        </div>
      </div>
    </footer>
  );
}
