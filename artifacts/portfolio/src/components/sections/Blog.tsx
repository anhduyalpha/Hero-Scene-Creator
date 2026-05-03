import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { Link } from "wouter";
import { getAllPosts, formatDate } from "@/lib/blog";

const posts = getAllPosts();

export function Blog() {
  return (
    <section id="blog" className="py-32 bg-background relative z-10">
      <div className="container mx-auto px-6 max-w-5xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-bold flex items-center gap-4 mb-4">
            <span className="gradient-text font-mono text-xl font-normal">04.</span>
            Writing
            <div
              className="h-[1px] flex-1 max-w-xs ml-4"
              style={{ background: "linear-gradient(to right, rgba(139,92,246,0.5), transparent)" }}
              aria-hidden="true"
            />
          </h2>
          <p className="text-muted-foreground text-lg ml-12">
            Thoughts on engineering, architecture, and building things at scale.
          </p>
        </motion.div>

        <div
          className="flex flex-col border-t"
          style={{ borderColor: "rgba(255,255,255,0.06)" }}
        >
          {posts.map((post, i) => (
            <motion.div
              key={post.slug}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
            >
              <Link
                href={`/blog/${post.slug}`}
                className="group flex flex-col md:flex-row gap-6 md:gap-12 py-10 border-b px-4 -mx-4 rounded-xl items-start md:items-center transition-all duration-300"
                style={{
                  borderColor: "rgba(255,255,255,0.06)",
                  touchAction: "manipulation",
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLElement).style.background = "rgba(139,92,246,0.05)";
                  (e.currentTarget as HTMLElement).style.backdropFilter = "blur(8px)";
                  (e.currentTarget as HTMLElement).style.borderColor = "rgba(139,92,246,0.15)";
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLElement).style.background = "";
                  (e.currentTarget as HTMLElement).style.backdropFilter = "";
                  (e.currentTarget as HTMLElement).style.borderColor = "rgba(255,255,255,0.06)";
                }}
              >
                <div className="md:w-1/4 shrink-0 flex flex-row md:flex-col gap-3 md:gap-2 items-center md:items-start text-sm">
                  {/* Gradient tag chip */}
                  <span
                    className="font-mono text-xs px-2.5 py-1 rounded-sm border"
                    style={{
                      background: "linear-gradient(135deg, rgba(139,92,246,0.18) 0%, rgba(109,40,217,0.10) 100%)",
                      borderColor: "rgba(139,92,246,0.30)",
                      color: "rgba(196,181,253,0.9)",
                    }}
                  >
                    {post.tag}
                  </span>
                  <time
                    dateTime={post.date}
                    className="text-muted-foreground font-mono"
                  >
                    {formatDate(post.date)}
                  </time>
                  <span className="text-muted-foreground/60 hidden md:inline">
                    {post.readTime}
                  </span>
                </div>

                <div className="flex-1 min-w-0">
                  <h3 className="text-2xl font-bold text-foreground group-hover:text-primary transition-colors duration-200 mb-3 leading-tight">
                    {post.title}
                  </h3>
                  <p className="text-muted-foreground leading-relaxed">
                    {post.excerpt}
                  </p>
                </div>

                {/* Glass circle arrow */}
                <div
                  className="hidden md:flex shrink-0 w-12 h-12 rounded-full items-center justify-center transition-all duration-300 group-hover:text-primary"
                  style={{
                    background: "rgba(14,14,22,0.5)",
                    backdropFilter: "blur(10px)",
                    border: "1px solid rgba(255,255,255,0.08)",
                    boxShadow: "inset 0 1px 0 rgba(255,255,255,0.05)",
                  }}
                  onMouseEnter={(e) => {
                    (e.currentTarget as HTMLElement).style.borderColor = "rgba(139,92,246,0.5)";
                    (e.currentTarget as HTMLElement).style.boxShadow = "0 0 14px rgba(139,92,246,0.2), inset 0 1px 0 rgba(255,255,255,0.06)";
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLElement).style.borderColor = "rgba(255,255,255,0.08)";
                    (e.currentTarget as HTMLElement).style.boxShadow = "inset 0 1px 0 rgba(255,255,255,0.05)";
                  }}
                >
                  <ArrowRight className="w-5 h-5 transition-transform duration-200 group-hover:translate-x-1" aria-hidden="true" />
                </div>
              </Link>
            </motion.div>
          ))}
        </div>

        {posts.length === 0 && (
          <p className="text-center text-muted-foreground py-16 font-mono">
            No posts yet — check back soon.
          </p>
        )}
      </div>
    </section>
  );
}
