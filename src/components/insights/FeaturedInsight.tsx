import Image from "next/image";
import Link from "next/link";
import { ArrowIcon } from "@/components/ui/icons";
import { categoryById, formatPublishedDate } from "@/lib/insight-catalog";
import { featuredArticle, readingMinutes } from "@/lib/insights";
import { InsightMedia } from "./InsightMedia";
import styles from "./insights.module.css";

export function FeaturedInsight() {
  const article = featuredArticle();

  if (!article) {
    return (
      <section
        id="featured-insight"
        className={`${styles.section} ${styles.sectionWhite}`}
        aria-labelledby="featured-insight-title"
      >
        <div className={styles.inner}>
          <div className={styles.empty}>
            <figure className={styles.emptyArt}>
              <Image
                src="/images/insights_1.png"
                alt="Illustration of article pages, a magnifying glass, and technology icons on a glowing platform"
                width={1666}
                height={944}
                sizes="(min-width: 1024px) 680px, 100vw"
                className={styles.emptyImage}
              />
            </figure>
            <div className={styles.emptyCopy}>
              <p className={styles.eyebrow}>Insights</p>
              <h2 id="featured-insight-title">Fresh Perspectives Are on the Way.</h2>
              <p>
                We&apos;re preparing practical insights on software, AI, digital transformation, and
                the technology behind modern business.
              </p>
              <Link className={styles.primary} href="/services">
                Explore Our Services
                <ArrowIcon />
              </Link>
            </div>
          </div>
        </div>
      </section>
    );
  }

  const category = categoryById(article.category).label;

  return (
    <section
      id="featured-insight"
      className={`${styles.section} ${styles.sectionWhite}`}
      aria-labelledby="featured-insight-title"
    >
      <div className={styles.inner}>
        <header className={styles.sectionHead}>
          <p className={styles.eyebrow}>Featured Insight</p>
          <h2 id="featured-insight-title">Worth a Closer Look.</h2>
        </header>
        <article className={styles.featured}>
          <InsightMedia
            category={article.category}
            coverImage={article.coverImage}
            coverAlt={article.coverImage ? article.coverAlt || article.title : ""}
            priority
            sizes="(min-width: 1024px) 680px, 100vw"
          />
          <div className={styles.featuredCopy}>
            <p className={styles.kicker}>{category}</p>
            <h3>{article.title}</h3>
            <p>{article.excerpt}</p>
            <p className={styles.meta}>
              <time dateTime={article.publishedAt}>{formatPublishedDate(article.publishedAt)}</time>
              <span>{readingMinutes(article)} min read</span>
            </p>
            <Link className={styles.textLink} href={`/insights/${article.slug}`}>
              Read Article
              <ArrowIcon />
            </Link>
          </div>
        </article>
      </div>
    </section>
  );
}
