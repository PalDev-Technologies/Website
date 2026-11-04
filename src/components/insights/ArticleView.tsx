import Image from "next/image";
import Link from "next/link";
import { Fragment } from "react";
import { categoryById, formatPublishedDate } from "@/lib/insight-catalog";
import {
  articleDocument,
  parseInline,
  readingMinutes,
  toInsightCard,
  type InsightCardData,
  type PublishedInsight,
} from "@/lib/insights";
import { InsightMedia } from "./InsightMedia";
import { InsightsCta } from "./InsightsCta";
import { InsightCard } from "./InsightCard";
import styles from "./insights.module.css";

export function ArticleView({
  article,
  related,
}: {
  article: PublishedInsight;
  related: readonly PublishedInsight[];
}) {
  const { outline, blocks } = articleDocument(article);
  const showContents = outline.length >= 2;
  const cards: InsightCardData[] = related.map(toInsightCard);

  return (
    <>
      <header className={styles.articleHero}>
        <div className={styles.inner}>
          <Link className={styles.back} href="/insights">
            <BackIcon />
            All Insights
          </Link>
          <p className={styles.kicker}>{categoryById(article.category).label}</p>
          <h1>{article.title}</h1>
          <p className={styles.articleLede}>{article.excerpt}</p>
          <p className={styles.meta}>
            <time dateTime={article.publishedAt}>{formatPublishedDate(article.publishedAt)}</time>
            <span>{readingMinutes(article)} min read</span>
            {article.author ? <span>By {article.author}</span> : null}
          </p>
        </div>
      </header>
      <figure className={styles.coverWrap}>
        <InsightMedia
          category={article.category}
          coverImage={article.coverImage}
          coverAlt={article.coverImage ? article.coverAlt || article.title : ""}
          priority
          sizes="(min-width: 1240px) 1240px, 100vw"
        />
        {article.coverImage ? null : (
          <figcaption className={styles.caption}>Decorative illustration. Not a product screenshot.</figcaption>
        )}
      </figure>
      <div className={showContents ? styles.reading : styles.readingSolo}>
        {showContents ? <Contents items={outline} /> : null}
        <article className={styles.prose}>
          {blocks.map(({ block, headingId }, index) => {
            if (block.type === "heading") {
              const id = headingId ?? undefined;
              if (block.level === 2) {
                return (
                  <h2 key={index} id={id}>
                    {block.text}
                  </h2>
                );
              }
              return (
                <h3 key={index} id={id}>
                  {block.text}
                </h3>
              );
            }

            if (block.type === "paragraph") {
              return (
                <p key={index}>
                  <Inline text={block.text} />
                </p>
              );
            }

            if (block.type === "list") {
              const ListTag = block.ordered ? "ol" : "ul";
              return (
                <ListTag key={index}>
                  {block.items.map((item) => (
                    <li key={item}>
                      <Inline text={item} />
                    </li>
                  ))}
                </ListTag>
              );
            }

            if (block.type === "quote") {
              return (
                <blockquote key={index}>
                  <Inline text={block.text} />
                </blockquote>
              );
            }

            if (block.type === "code") {
              return (
                <figure key={index} className={styles.figure}>
                  {block.language ? <p className={styles.language}>{block.language}</p> : null}
                  <pre>
                    <code>{block.code}</code>
                  </pre>
                </figure>
              );
            }

            return (
              <figure key={index} className={styles.figure}>
                <Image src={block.src} alt={block.alt} width={block.width} height={block.height} />
                {block.caption ? <figcaption>{block.caption}</figcaption> : null}
              </figure>
            );
          })}
        </article>
      </div>
      {cards.length > 0 ? (
        <section className={styles.related} aria-labelledby="related-insights-title">
          <div className={styles.inner}>
            <header className={styles.relatedHead}>
              <p className={styles.eyebrow}>Keep Reading</p>
              <h2 id="related-insights-title">Related Insights</h2>
            </header>
            <div
              className={`${styles.grid} ${cards.length === 1 ? styles.soloGrid : ""} ${cards.length === 2 ? styles.relatedFew : ""}`}
            >
              {cards.map((card) => (
                <InsightCard key={card.slug} article={card} />
              ))}
            </div>
          </div>
        </section>
      ) : null}
      <InsightsCta
        titleId="article-cta-title"
        title="Need Help Turning Ideas Into Technology?"
        description="Explore PalDev's services or discuss your project with our team."
      />
    </>
  );
}

function Contents({ items }: { items: { id: string; text: string; level: 2 | 3 }[] }) {
  const list = () => (
    <ol className={styles.toc}>
      {items.map((item) => (
        <li key={item.id} className={item.level === 3 ? styles.sub : undefined}>
          <a href={`#${item.id}`}>{item.text}</a>
        </li>
      ))}
    </ol>
  );

  return (
    <>
      <details className={styles.tocMobile}>
        <summary>On this page</summary>
        {list()}
      </details>
      <nav className={styles.tocDesktop} aria-label="On this page">
        <p className={styles.tocLabel}>On this page</p>
        {list()}
      </nav>
    </>
  );
}

function Inline({ text }: { text: string }) {
  return parseInline(text).map((part, index) => {
    if (part.type === "text") return <Fragment key={index}>{part.value}</Fragment>;
    if (part.href.startsWith("/")) {
      return (
        <Link key={index} href={part.href}>
          {part.label}
        </Link>
      );
    }
    return (
      <a key={index} href={part.href}>
        {part.label}
      </a>
    );
  });
}

function BackIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
      <path d="M19 12H5M11 6l-6 6 6 6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
