import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ArticleView } from "@/components/insights/ArticleView";
import { articleBySlug, publishedArticles, relatedArticles } from "@/lib/insights";
import { brand } from "@/lib/site";

type ArticlePageProps = {
  params: Promise<{ slug: string }>;
};

const emptyParam = "_";

export function generateStaticParams() {
  const articles = publishedArticles();
  // Cache Components requires at least one param so the route can be validated.
  // The placeholder is not an article and resolves to a 404.
  if (articles.length === 0) return [{ slug: emptyParam }];
  return articles.map((article) => ({ slug: article.slug }));
}

export async function generateMetadata({ params }: ArticlePageProps): Promise<Metadata> {
  const { slug } = await params;
  const article = articleBySlug(slug);
  if (!article) return { title: "Insight" };

  const title = article.seoTitle || article.title;
  const description = article.seoDescription || article.excerpt;
  const image = article.coverImage
    ? [{ url: article.coverImage, alt: article.coverAlt || article.title }]
    : [{ url: brand.logoPoster, alt: brand.name }];

  return {
    title,
    description,
    alternates: {
      canonical: `/insights/${article.slug}`,
    },
    openGraph: {
      type: "article",
      title: `${title} | PalDev Technologies`,
      description,
      url: `/insights/${article.slug}`,
      publishedTime: article.publishedAt,
      modifiedTime: article.updatedAt ?? undefined,
      images: image,
    },
    twitter: {
      card: article.coverImage ? "summary_large_image" : "summary",
      title: `${title} | PalDev Technologies`,
      description,
      images: [article.coverImage || brand.logoPoster],
    },
  };
}

export default async function InsightArticlePage({ params }: ArticlePageProps) {
  const { slug } = await params;
  const article = articleBySlug(slug);
  if (!article) notFound();

  const jsonLd: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: article.title,
    description: article.excerpt,
    datePublished: article.publishedAt,
    mainEntityOfPage: `${brand.url}/insights/${article.slug}`,
    publisher: {
      "@type": "Organization",
      name: brand.name,
      url: brand.url,
      logo: `${brand.url}${brand.icon}`,
    },
  };

  if (article.updatedAt) jsonLd.dateModified = article.updatedAt;
  if (article.coverImage) jsonLd.image = absoluteAsset(article.coverImage);
  if (article.author) jsonLd.author = { "@type": "Person", name: article.author };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }}
      />
      <ArticleView article={article} related={relatedArticles(article.slug)} />
    </>
  );
}

function absoluteAsset(path: string) {
  if (path.startsWith("https://") || path.startsWith("http://")) return path;
  return `${brand.url}${path.startsWith("/") ? path : `/${path}`}`;
}
