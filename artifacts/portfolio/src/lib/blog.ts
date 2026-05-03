import { marked } from "marked";

export interface BlogPost {
  slug: string;
  title: string;
  date: string;
  tag: string;
  readTime: string;
  excerpt: string;
  content: string;
  html: string;
}

/** Tiny browser-safe frontmatter parser — no Buffer dependency */
function parseFrontmatter(raw: string): {
  data: Record<string, string>;
  content: string;
} {
  const match = raw.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n([\s\S]*)$/);
  if (!match) return { data: {}, content: raw };

  const data: Record<string, string> = {};
  for (const line of match[1].split("\n")) {
    const colonIdx = line.indexOf(":");
    if (colonIdx === -1) continue;
    const key = line.slice(0, colonIdx).trim();
    let value = line.slice(colonIdx + 1).trim();
    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1);
    }
    data[key] = value;
  }

  return { data, content: match[2] };
}

const rawFiles = import.meta.glob("/content/blog/*.md", {
  query: "?raw",
  import: "default",
  eager: true,
}) as Record<string, string>;

function parseDate(dateStr: string): Date {
  return new Date(dateStr + "T00:00:00Z");
}

export function formatDate(dateStr: string): string {
  return parseDate(dateStr).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    timeZone: "UTC",
  });
}

const posts: BlogPost[] = Object.entries(rawFiles)
  .map(([, raw]) => {
    const { data, content } = parseFrontmatter(raw);
    const html = marked(content, { async: false }) as string;
    return {
      slug: data.slug ?? "",
      title: data.title ?? "",
      date: data.date ?? "",
      tag: data.tag ?? "",
      readTime: data.readTime ?? "",
      excerpt: data.excerpt ?? "",
      content,
      html,
    };
  })
  .filter((p) => p.slug)
  .sort((a, b) => parseDate(b.date).getTime() - parseDate(a.date).getTime());

export function getAllPosts(): BlogPost[] {
  return posts;
}

export function getPostBySlug(slug: string): BlogPost | undefined {
  return posts.find((p) => p.slug === slug);
}
