import Link from "next/link";
import { ArrowIcon } from "@/components/ui/icons";
import { categoryById, formatPublishedDate } from "@/lib/insight-catalog";
import type { InsightCardData } from "@/lib/insights";
import { InsightMedia } from "./InsightMedia";
import styles from "./insights.module.css";

export function InsightCard({ article }: { article: InsightCardData }) {
  return (
    <article>
      <Link className={styles.card} href={`/insights/${article.slug}`}>
        <InsightMedia
          category={article.category}
          coverImage={article.coverImage}
          coverAlt={coverAlt(article)}
          sizes="(min-width: 1024px) 380px, (min-width: 768px) 50vw, 100vw"
        />
        <div className={styles.cardBody}>
          <p className={styles.cardKicker}>{categoryById(article.category).label}</p>
          <h3>{article.title}</h3>
          <p className={styles.cardExcerpt}>{article.excerpt}</p>
          <p className={styles.cardMeta}>
            <time dateTime={article.publishedAt}>{formatPublishedDate(article.publishedAt)}</time>
            <span>{article.readingLabel}</span>
          </p>
          <span className={styles.view}>
            Read Article
            <ArrowIcon />
          </span>
        </div>
      </Link>
    </article>
  );
}

function coverAlt(article: InsightCardData) {
  if (article.coverImage) return article.coverAlt || article.title;
  return "";
}
