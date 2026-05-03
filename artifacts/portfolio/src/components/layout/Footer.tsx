import { activeSocials } from "../../config/socials";
import { SocialIcon } from "../SocialIcon";

export function Footer() {
  return (
    <footer className="relative py-12 bg-background mt-20">
      <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-primary/30 to-transparent" />
      <div className="container mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-8 items-center">

        <div className="flex flex-col items-start gap-2">
          <a
            href="#hero"
            className="text-2xl font-black tracking-tighter bg-clip-text text-transparent bg-gradient-to-r from-primary to-purple-400"
            style={{ fontFamily: "var(--app-font-display)" }}
          >
            AlphaD
          </a>
          <p className="text-sm text-muted-foreground">Building exceptional digital experiences.</p>
        </div>

        <nav className="flex flex-wrap justify-center gap-6" aria-label="Footer navigation">
          <a href="#about"      className="text-sm font-mono text-muted-foreground hover:text-primary transition-colors focus-visible:outline-2 focus-visible:outline-primary rounded-sm">01. About</a>
          <a href="#projects"   className="text-sm font-mono text-muted-foreground hover:text-primary transition-colors focus-visible:outline-2 focus-visible:outline-primary rounded-sm">02. Projects</a>
          <a href="#experience" className="text-sm font-mono text-muted-foreground hover:text-primary transition-colors focus-visible:outline-2 focus-visible:outline-primary rounded-sm">03. Experience</a>
          <a href="#blog"       className="text-sm font-mono text-muted-foreground hover:text-primary transition-colors focus-visible:outline-2 focus-visible:outline-primary rounded-sm">04. Blog</a>
          <a href="#contact"    className="text-sm font-mono text-muted-foreground hover:text-primary transition-colors focus-visible:outline-2 focus-visible:outline-primary rounded-sm">05. Contact</a>
        </nav>

        <div className="flex flex-col items-end gap-4">
          {activeSocials.length > 0 && (
            <ul className="flex gap-4 m-0 p-0 list-none">
              {activeSocials.map((s) => (
                <li key={s.platform}>
                  <a
                    href={s.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={s.platform}
                    className="w-9 h-9 flex items-center justify-center rounded-lg text-muted-foreground hover:text-primary transition-colors focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background"
                  >
                    <SocialIcon icon={s.icon} className="w-4 h-4" />
                  </a>
                </li>
              ))}
            </ul>
          )}
          <p className="font-mono text-xs text-muted-foreground">Designed & Built by Anh Duy</p>
        </div>

      </div>
    </footer>
  );
}
