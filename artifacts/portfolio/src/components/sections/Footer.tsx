import React from "react";
import { Github, Twitter, Linkedin, Mail } from "lucide-react";

export function Footer() {
  return (
    <footer className="py-8 mt-12 border-t border-border/50 bg-background/80 backdrop-blur-md relative z-10 text-center flex flex-col items-center">
      <div className="flex justify-center items-center gap-6 mb-6">
        <a href="#" className="text-muted-foreground hover:text-primary transition-colors p-2 hover:bg-primary/10 rounded-full" aria-label="GitHub">
          <Github className="w-5 h-5" />
        </a>
        <a href="#" className="text-muted-foreground hover:text-primary transition-colors p-2 hover:bg-primary/10 rounded-full" aria-label="Twitter">
          <Twitter className="w-5 h-5" />
        </a>
        <a href="#" className="text-muted-foreground hover:text-primary transition-colors p-2 hover:bg-primary/10 rounded-full" aria-label="LinkedIn">
          <Linkedin className="w-5 h-5" />
        </a>
        <a href="mailto:alex@example.com" className="text-muted-foreground hover:text-primary transition-colors p-2 hover:bg-primary/10 rounded-full" aria-label="Email">
          <Mail className="w-5 h-5" />
        </a>
      </div>
      <p className="text-sm font-mono text-muted-foreground">
        Designed & Built by Alex Chen
      </p>
      <div className="mt-2 text-xs font-mono text-primary/60 flex items-center justify-center gap-2">
        <span>&copy; {new Date().getFullYear()}</span>
        <span className="w-1 h-1 rounded-full bg-secondary"></span>
        <span>Obsidian Ember System</span>
      </div>
    </footer>
  );
}
