/**
 * PalDev Insights content.
 *
 * No articles are published until a real piece is added here.
 * Drafts stay out of the public page, article routes, and the sitemap.
 *
 * To add an article:
 * 1. Add an object to `articles`.
 * 2. Keep status as "draft" until the piece is ready for the public site.
 * 3. When publishing, set status to "published" and publishedAt to the real
 *    date as YYYY-MM-DD. Do not invent a date.
 * 4. Leave author null unless that person is verified and may be named.
 * 5. Leave readingTime null to calculate it from the body (200 words per minute).
 * 6. Cover images belong in public/images. Set coverImage to "/images/file.png"
 *    and coverAlt to a description of that image. Leave coverImage null to show
 *    a decorative illustration instead of pretending there is a photograph.
 * 7. Write the body with content blocks: paragraph, heading, list, quote, code, image.
 *    Paragraphs and list items may include links as [label](/path) or [label](https://...).
 * 8. Set one published article's featured flag to true to pin the featured slot.
 *    If none is featured, the newest published article is used.
 * 9. seoTitle is the document title without the site name. seoDescription is the
 *    meta description. Leave either null to fall back to the title or excerpt.
 *
 * A published article with no date, title, excerpt, slug, or body is treated as
 * unpublished.
 */

import { insightCategories, type InsightCategoryId, type SearchableInsight } from "@/lib/insight-catalog";

export type InsightStatus = "draft" | "published";

export type InsightBlock =
  | { type: "paragraph"; text: string }
  | { type: "heading"; level: 2 | 3; text: string; id?: string }
  | { type: "list"; ordered?: boolean; items: readonly string[] }
  | { type: "quote"; text: string }
  | { type: "code"; language?: string; code: string }
  | {
      type: "image";
      src: string;
      alt: string;
      width: number;
      height: number;
      caption?: string;
    };

export type InsightArticle = {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  category: InsightCategoryId;
  tags: readonly string[];
  coverImage: string | null;
  coverAlt: string;
  author: string | null;
  publishedAt: string | null;
  updatedAt: string | null;
  readingTime: number | null;
  featured: boolean;
  status: InsightStatus;
  content: readonly InsightBlock[];
  seoTitle: string | null;
  seoDescription: string | null;
};

export type PublishedInsight = InsightArticle & {
  status: "published";
  publishedAt: string;
};

export type InsightCardData = SearchableInsight & {
  slug: string;
  coverImage: string | null;
  coverAlt: string;
  readingLabel: string;
};

export const articles: readonly InsightArticle[] = [];

function isPublished(article: InsightArticle): article is PublishedInsight {
  return (
    article.status === "published" &&
    Boolean(article.publishedAt) &&
    article.slug.trim().length > 0 &&
    article.title.trim().length > 0 &&
    article.excerpt.trim().length > 0 &&
    article.content.length > 0
  );
}

export function publishedArticles(): PublishedInsight[] {
  return articles
    .filter(isPublished)
    .sort((a, b) => b.publishedAt.localeCompare(a.publishedAt));
}

export function featuredArticle() {
  const list = publishedArticles();
  const pinned = list.filter((article) => article.featured);
  return (pinned.length > 0 ? pinned : list)[0] ?? null;
}

export function articleBySlug(slug: string) {
  return publishedArticles().find((article) => article.slug === slug) ?? null;
}

export function categoriesInUse() {
  const used = new Set(publishedArticles().map((article) => article.category));
  return insightCategories.filter((category) => used.has(category.id));
}

export function articleCountForCategory(id: InsightCategoryId) {
  return publishedArticles().filter((article) => article.category === id).length;
}

export function relatedArticles(slug: string, limit = 3) {
  const current = articleBySlug(slug);
  if (!current) return [];
  const others = publishedArticles().filter((article) => article.slug !== slug);
  const sameCategory = others.filter((article) => article.category === current.category);
  const rest = others.filter((article) => article.category !== current.category);
  return [...sameCategory, ...rest].slice(0, limit);
}

export function toInsightCard(article: PublishedInsight): InsightCardData {
  return {
    slug: article.slug,
    title: article.title,
    excerpt: article.excerpt,
    category: article.category,
    tags: article.tags,
    coverImage: article.coverImage,
    coverAlt: article.coverAlt || article.title,
    publishedAt: article.publishedAt,
    readingLabel: `${readingMinutes(article)} min read`,
  };
}

function blockText(block: InsightBlock) {
  switch (block.type) {
    case "paragraph":
    case "heading":
    case "quote":
      return block.text;
    case "list":
      return block.items.join(" ");
    case "code":
      return block.code;
    case "image":
      return block.caption ?? "";
    default:
      return "";
  }
}

export function readingMinutes(article: InsightArticle) {
  if (article.readingTime && article.readingTime > 0) return Math.round(article.readingTime);
  const words = article.content
    .map(blockText)
    .join(" ")
    .trim()
    .split(/\s+/)
    .filter(Boolean).length;
  if (words === 0) return 1;
  return Math.max(1, Math.round(words / 200));
}

export type ArticleHeading = {
  id: string;
  text: string;
  level: 2 | 3;
};

function slugify(value: string) {
  const slug = value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
  return slug || "section";
}

export function articleDocument(article: InsightArticle) {
  const outline = articleOutline(article);
  let index = 0;
  const blocks = article.content.map((block) => {
    if (block.type !== "heading") return { block, headingId: null as string | null };
    const headingId = outline[index]?.id ?? null;
    index += 1;
    return { block, headingId };
  });
  return { outline, blocks };
}

export function articleOutline(article: InsightArticle): ArticleHeading[] {
  const used = new Set<string>();
  const outline: ArticleHeading[] = [];

  for (const block of article.content) {
    if (block.type !== "heading") continue;
    const base = slugify(block.id || block.text);
    let id = base;
    let count = 2;
    while (used.has(id)) {
      id = `${base}-${count}`;
      count += 1;
    }
    used.add(id);
    outline.push({ id, text: block.text, level: block.level });
  }

  return outline;
}

export type InlinePart =
  | { type: "text"; value: string }
  | { type: "link"; label: string; href: string };

export function parseInline(text: string): InlinePart[] {
  const parts: InlinePart[] = [];
  const pattern = /\[([^\]]+)\]\(([^)\s]+)\)/g;
  let lastIndex = 0;

  for (const match of text.matchAll(pattern)) {
    const index = match.index ?? 0;
    if (index > lastIndex) parts.push({ type: "text", value: text.slice(lastIndex, index) });
    const href = match[2];
    const label = match[1];
    if (href.startsWith("/") || href.startsWith("https://") || href.startsWith("http://")) {
      parts.push({ type: "link", label, href });
    } else {
      parts.push({ type: "text", value: match[0] });
    }
    lastIndex = index + match[0].length;
  }

  if (lastIndex < text.length) parts.push({ type: "text", value: text.slice(lastIndex) });
  return parts;
}
