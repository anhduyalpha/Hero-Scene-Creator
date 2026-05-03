import { useParams, Link } from "wouter";
import { getPostBySlug, formatDate } from "@/lib/blog";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { ShaderBackground } from "@/components/ShaderBackground";
import { ArrowLeft } from "lucide-react";
import { motion } from "framer-motion";
import { useEffect } from "react";

export default function BlogPost() {
  const { slug } = useParams<{ slug: string }>();
  const post = getPostBySlug(slug);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [slug]);

  if (!post) {
    return (
      <>
        <ShaderBackground />
        <div className="relative min-h-screen text-foreground flex items-center justify-center" style={{ zIndex: 2 }}>
          <div className="text-center">
            <h1 className="text-4xl font-bold mb-4">Post Not Found</h1>
            <Link href="/#blog" className="text-primary hover:underline font-mono">
              ← Back to Blog
            </Link>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <ShaderBackground />
      <div className="relative min-h-screen text-foreground" style={{ zIndex: 2 }}>
        <Navbar />

        <main id="main-content" className="pt-32 pb-24">
          <div className="container mx-auto px-6 max-w-3xl">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <Link
                href="/#blog"
                className="inline-flex items-center gap-2 font-mono text-sm text-muted-foreground hover:text-primary transition-colors mb-12 group"
              >
                <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
                Back to Writing
              </Link>

              <div className="flex items-center gap-3 mb-6">
                <span className="font-mono text-xs px-2.5 py-1 bg-primary/10 text-primary border border-primary/20 rounded-sm">
                  {post.tag}
                </span>
                <time dateTime={post.date} className="font-mono text-sm text-muted-foreground">
                  {formatDate(post.date)}
                </time>
                <span className="text-muted-foreground/40">·</span>
                <span className="font-mono text-sm text-muted-foreground">{post.readTime}</span>
              </div>

              <h1
                className="text-4xl md:text-5xl font-black leading-[1.05] tracking-tight mb-8"
                style={{ fontFamily: "var(--app-font-display)" }}
              >
                {post.title}
              </h1>

              <p className="text-xl text-muted-foreground leading-relaxed mb-12 pb-12 border-b border-border">
                {post.excerpt}
              </p>

              <div
                className="prose prose-invert prose-lg max-w-none
                  prose-headings:font-display prose-headings:tracking-tight
                  prose-h2:text-2xl prose-h2:font-bold prose-h2:mt-12 prose-h2:mb-4
                  prose-h3:text-xl prose-h3:font-semibold prose-h3:mt-8 prose-h3:mb-3
                  prose-p:text-muted-foreground prose-p:leading-[1.8]
                  prose-a:text-primary prose-a:no-underline hover:prose-a:underline
                  prose-strong:text-foreground prose-strong:font-semibold
                  prose-code:text-primary prose-code:bg-primary/10 prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded prose-code:font-mono prose-code:text-sm prose-code:before:content-none prose-code:after:content-none
                  prose-pre:bg-card prose-pre:border prose-pre:border-card-border prose-pre:rounded-xl prose-pre:p-6 prose-pre:text-sm prose-pre:overflow-x-auto
                  prose-blockquote:border-primary prose-blockquote:text-muted-foreground
                  prose-ul:text-muted-foreground prose-ol:text-muted-foreground
                  prose-li:leading-relaxed
                  prose-table:text-sm
                  prose-thead:border-border prose-tbody:border-border
                  prose-th:text-foreground prose-th:font-semibold prose-th:py-3 prose-th:px-4
                  prose-td:text-muted-foreground prose-td:py-3 prose-td:px-4
                  prose-hr:border-border"
                dangerouslySetInnerHTML={{ __html: post.html }}
              />

              <div className="mt-16 pt-12 border-t border-border">
                <Link
                  href="/#blog"
                  className="inline-flex items-center gap-2 font-mono text-sm text-muted-foreground hover:text-primary transition-colors group"
                >
                  <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
                  Back to all posts
                </Link>
              </div>
            </motion.div>
          </div>
        </main>

        <Footer />
      </div>
    </>
  );
}
