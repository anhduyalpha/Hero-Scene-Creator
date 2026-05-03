import { motion } from "framer-motion";
import { Mail, Send, ArrowRight } from "lucide-react";
import { useState, useRef, FormEvent } from "react";
import { MagneticButton } from "../MagneticButton";
import { activeSocials } from "../../config/socials";
import { SocialIcon } from "../SocialIcon";

const EMAIL = "hello@alphadphone.dev";

export function Contact() {
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");
  const formRef = useRef<HTMLFormElement>(null);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setStatus("sending");
    await new Promise((r) => setTimeout(r, 1200));
    setStatus("sent");
    setForm({ name: "", email: "", message: "" });
  };

  return (
    <section id="contact" className="py-32 bg-background relative z-10" aria-labelledby="contact-heading">
      {/* Ambient glow behind section */}
      <div
        className="pointer-events-none absolute inset-0 overflow-hidden"
        aria-hidden="true"
      >
        <div
          style={{
            position: "absolute",
            width: "50vw",
            height: "50vw",
            left: "50%",
            top: "50%",
            transform: "translate(-50%, -50%)",
            background: "radial-gradient(ellipse, rgba(139,92,246,0.08) 0%, transparent 65%)",
            filter: "blur(60px)",
          }}
        />
      </div>

      <div className="container mx-auto px-6 max-w-5xl relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="mb-16"
        >
          <h2 id="contact-heading" className="text-3xl md:text-4xl font-bold flex items-center gap-4 mb-4">
            <span className="gradient-text font-mono text-xl font-normal">05.</span>
            Get in Touch
            <div
              className="h-[1px] flex-1 max-w-xs ml-4"
              style={{ background: "linear-gradient(to right, rgba(139,92,246,0.5), transparent)" }}
              aria-hidden="true"
            />
          </h2>
          <p className="text-muted-foreground text-lg ml-12 max-w-xl">
            Whether you have an opportunity, a project, or just want to say hi — I&apos;d love to hear from you.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
          {/* Left column */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            {/* Email box — glass panel */}
            <div className="glass-panel rounded-2xl p-5 flex items-center gap-4 mb-8 gradient-border">
              <div
                className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0"
                style={{
                  background: "linear-gradient(135deg, rgba(139,92,246,0.25) 0%, rgba(109,40,217,0.15) 100%)",
                  border: "1px solid rgba(139,92,246,0.35)",
                  boxShadow: "0 0 16px rgba(139,92,246,0.15)",
                }}
                aria-hidden="true"
              >
                <Mail className="w-6 h-6 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground font-mono">Reach me directly at</p>
                <a
                  href={`mailto:${EMAIL}`}
                  className="text-lg font-semibold text-foreground hover:text-primary transition-colors duration-200 focus-visible:outline-2 focus-visible:outline-primary"
                >
                  {EMAIL}
                </a>
              </div>
            </div>

            <div className="space-y-6 text-muted-foreground leading-relaxed mb-10">
              <p>
                I&apos;m currently open to new opportunities. My inbox is always open — whether for a project
                collaboration, job opportunity, or just to say hi. I&apos;ll do my best to reply promptly.
              </p>
              <p>
                I&apos;m particularly interested in roles involving distributed systems, developer tooling,
                or working on products that have real impact.
              </p>
            </div>

            {activeSocials.length > 0 && (
              <div>
                <p className="font-mono text-xs text-muted-foreground uppercase tracking-widest mb-4">Or find me on</p>
                <ul className="flex flex-wrap gap-3 m-0 p-0 list-none">
                  {activeSocials.map((s) => (
                    <li key={s.platform}>
                      <a
                        href={s.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label={`${s.platform}: ${s.handle}`}
                        className="flex items-center gap-2.5 px-4 py-2.5 glass rounded-xl text-sm text-muted-foreground hover:text-foreground transition-colors duration-200 group focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background gradient-border"
                        style={{ touchAction: "manipulation" }}
                      >
                        <SocialIcon icon={s.icon} className="w-4 h-4 transition-transform duration-200 group-hover:scale-110" />
                        {s.handle || s.platform}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {activeSocials.length === 0 && (
              <div className="flex flex-col gap-3">
                <MagneticButton
                  href={`mailto:${EMAIL}`}
                  className="gradient-btn inline-flex items-center gap-3 text-white px-8 py-4 font-semibold text-sm rounded-xl w-fit"
                >
                  Say Hello <ArrowRight className="w-4 h-4" aria-hidden="true" />
                </MagneticButton>
              </div>
            )}
          </motion.div>

          {/* Right column — glass form panel */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <div className="glass-panel rounded-2xl p-8 gradient-border">
              <form
                ref={formRef}
                onSubmit={handleSubmit}
                noValidate
                className="space-y-6"
                aria-label="Contact form"
              >
                <div>
                  <label htmlFor="contact-name" className="block font-mono text-xs uppercase tracking-widest text-muted-foreground mb-2">
                    Name *
                  </label>
                  <input
                    id="contact-name"
                    type="text"
                    required
                    aria-required="true"
                    autoComplete="name"
                    name="name"
                    value={form.name}
                    onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))}
                    placeholder="Your name…"
                    spellCheck={false}
                    className="input-glass w-full rounded-xl px-5 py-4 text-foreground placeholder:text-muted-foreground/40"
                  />
                </div>

                <div>
                  <label htmlFor="contact-email" className="block font-mono text-xs uppercase tracking-widest text-muted-foreground mb-2">
                    Email *
                  </label>
                  <input
                    id="contact-email"
                    type="email"
                    required
                    aria-required="true"
                    autoComplete="email"
                    name="email"
                    inputMode="email"
                    value={form.email}
                    onChange={(e) => setForm((p) => ({ ...p, email: e.target.value }))}
                    placeholder="your@email.com…"
                    spellCheck={false}
                    className="input-glass w-full rounded-xl px-5 py-4 text-foreground placeholder:text-muted-foreground/40"
                  />
                </div>

                <div>
                  <label htmlFor="contact-message" className="block font-mono text-xs uppercase tracking-widest text-muted-foreground mb-2">
                    Message *
                  </label>
                  <textarea
                    id="contact-message"
                    required
                    aria-required="true"
                    name="message"
                    value={form.message}
                    onChange={(e) => setForm((p) => ({ ...p, message: e.target.value }))}
                    placeholder="What's on your mind?…"
                    rows={6}
                    className="input-glass w-full rounded-xl px-5 py-4 text-foreground placeholder:text-muted-foreground/40 resize-none"
                  />
                </div>

                <button
                  type="submit"
                  disabled={status === "sending" || status === "sent"}
                  className="gradient-btn flex items-center gap-3 text-white px-8 py-4 font-semibold text-sm rounded-xl disabled:opacity-50 disabled:cursor-not-allowed w-full justify-center group"
                  style={{ touchAction: "manipulation" }}
                >
                  {status === "sending" && (
                    <><span className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent" aria-hidden="true" />Sending…</>
                  )}
                  {status === "sent" && <>Message Sent!</>}
                  {status === "error" && <>Try Again</>}
                  {status === "idle" && (
                    <>Send Message <Send className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-1" aria-hidden="true" /></>
                  )}
                </button>

                <div role="status" aria-live="polite" aria-atomic="true" className="min-h-[1.5rem]">
                  {status === "sent" && (
                    <p className="text-center text-sm text-green-400 font-mono">
                      Thanks! I&apos;ll get back to you soon.
                    </p>
                  )}
                  {status === "error" && (
                    <p className="text-center text-sm text-red-400 font-mono">
                      Something went wrong. Please try again.
                    </p>
                  )}
                </div>
              </form>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
