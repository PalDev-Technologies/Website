/**
 * Insight categories and search helpers.
 * This module stays free of article bodies so client filters can import it
 * without shipping unpublished drafts.
 */

export const insightCategories = [
  {
    id: "software-development",
    label: "Software Development",
    description:
      "Engineering practices, application design, modern frameworks, and building reliable systems.",
    icon: "code",
  },
  {
    id: "ai-data",
    label: "AI & Data",
    description:
      "Practical artificial intelligence, analytics, automation, and data-driven decision-making.",
    icon: "brain",
  },
  {
    id: "digital-transformation",
    label: "Digital Transformation",
    description: "Modernizing business processes and creating more connected digital operations.",
    icon: "workflow",
  },
  {
    id: "technology-security",
    label: "Technology & Security",
    description: "System reliability, architecture, security principles, and responsible technology choices.",
    icon: "shield",
  },
  {
    id: "business-innovation",
    label: "Business & Innovation",
    description: "How technology supports better customer experiences and business growth.",
    icon: "lightbulb",
  },
] as const;

export type InsightCategoryId = (typeof insightCategories)[number]["id"];
export type InsightIcon = (typeof insightCategories)[number]["icon"];
export type InsightSort = "newest" | "oldest";

export type SearchableInsight = {
  title: string;
  excerpt: string;
  tags: readonly string[];
  category: InsightCategoryId;
  publishedAt: string;
};

const MONTHS = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
] as const;

export function categoryById(id: InsightCategoryId) {
  const category = insightCategories.find((item) => item.id === id);
  if (!category) throw new Error(`Unknown insight category: ${id}`);
  return category;
}

export function isInsightCategory(value: string | null | undefined): value is InsightCategoryId {
  return insightCategories.some((category) => category.id === value);
}

export function formatPublishedDate(isoDate: string) {
  const match = /^(\d{4})-(\d{2})-(\d{2})/.exec(isoDate);
  if (!match) return isoDate;
  const month = MONTHS[Number(match[2]) - 1];
  if (!month) return isoDate;
  return `${month} ${Number(match[3])}, ${match[1]}`;
}

export function filterInsights<T extends SearchableInsight>(
  list: readonly T[],
  options: { query: string; category: InsightCategoryId | "all"; sort: InsightSort },
) {
  const query = options.query.trim().toLowerCase();
  const matched = list.filter((article) => {
    if (options.category !== "all" && article.category !== options.category) return false;
    if (!query) return true;
    const haystack = [article.title, article.excerpt, ...article.tags].join(" ").toLowerCase();
    return haystack.includes(query);
  });
  return [...matched].sort((a, b) => {
    const order = a.publishedAt.localeCompare(b.publishedAt);
    return options.sort === "oldest" ? order : -order;
  });
}
