import { Link } from "wouter";

export default function NotFound() {
  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-background">
      <div className="text-center ember-glass p-12 rounded-2xl max-w-md mx-4">
        <p className="font-mono text-primary text-sm tracking-widest uppercase mb-4">404</p>
        <h1 className="text-4xl font-black text-foreground mb-4">Page Not Found</h1>
        <p className="text-muted-foreground mb-8">This page doesn't exist in the forge.</p>
        <Link
          href="/"
          className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground font-mono text-sm rounded-lg hover:bg-primary/90 transition-colors"
        >
          ← Back to Portfolio
        </Link>
      </div>
    </div>
  );
}
