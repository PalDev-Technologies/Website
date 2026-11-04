import Link from "next/link";
import type { SVGProps } from "react";
import { ArrowIcon } from "@/components/ui/icons";
import { insightCategories, type InsightIcon } from "@/lib/insight-catalog";
import { articleCountForCategory } from "@/lib/insights";
import styles from "./insights.module.css";

export function TopicExplorer() {
  return (
    <section className={`${styles.section} ${styles.sectionWhite}`} aria-labelledby="insight-topics-title">
      <div className={styles.inner}>
        <header className={styles.sectionHead}>
          <p className={styles.eyebrow}>Topics We Explore</p>
          <h2 id="insight-topics-title">Knowledge Across Technology.</h2>
        </header>
        <div className={styles.topics}>
          {insightCategories.map((topic) => {
            const count = articleCountForCategory(topic.id);
            const body = (
              <>
                <span className={styles.icon}>
                  <TopicIcon name={topic.icon} />
                </span>
                <div>
                  <h3>{topic.label}</h3>
                  <p>{topic.description}</p>
                  {count > 0 ? (
                    <span className={styles.topicMore}>
                      View articles
                      <ArrowIcon />
                    </span>
                  ) : null}
                </div>
              </>
            );

            if (count > 0) {
              return (
                <Link
                  key={topic.id}
                  className={styles.topicLink}
                  href={`/insights?category=${topic.id}#article-discovery`}
                >
                  {body}
                </Link>
              );
            }

            return (
              <article key={topic.id} className={styles.topic}>
                {body}
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}

function TopicIcon({ name }: { name: InsightIcon }) {
  if (name === "code") {
    return (
      <Glyph>
        <path d="M9 8 5.5 12 9 16" />
        <path d="m15 8 3.5 4-3.5 4" />
        <path d="m13 6-2 12" />
      </Glyph>
    );
  }

  if (name === "brain") {
    return (
      <Glyph>
        <path d="M9 7.5a2.5 2.5 0 0 1 4.2-1.6A2.7 2.7 0 0 1 18 8.2 2.4 2.4 0 0 1 17 12.5V16a2 2 0 0 1-2 2h-1" />
        <path d="M9 7.5A2.6 2.6 0 0 0 6 10a2.4 2.4 0 0 0 .2 4.4V16a2 2 0 0 0 2 2h1" />
        <path d="M12 8.5V18M9.5 12H8M15.5 11.5H17" />
      </Glyph>
    );
  }

  if (name === "workflow") {
    return (
      <Glyph>
        <rect x="3.5" y="4" width="6" height="6" rx="1.5" />
        <rect x="14.5" y="4" width="6" height="6" rx="1.5" />
        <rect x="9" y="14" width="6" height="6" rx="1.5" />
        <path d="M6.5 10v2.2A1.5 1.5 0 0 0 8 13.7h1M17.5 10v2.2a1.5 1.5 0 0 1-1.5 1.5H15" />
      </Glyph>
    );
  }

  if (name === "shield") {
    return (
      <Glyph>
        <path d="M12 3.5 19 6.2v5.2c0 4.1-2.7 6.8-7 8.6-4.3-1.8-7-4.5-7-8.6V6.2L12 3.5Z" />
        <path d="m8.8 12 2.1 2.1 4.3-4.4" />
      </Glyph>
    );
  }

  return (
    <Glyph>
      <path d="M9 17h6" />
      <path d="M10 20h4" />
      <path d="M8.2 14.5a5 5 0 1 1 7.6 0c-.7.7-1.1 1.4-1.2 2.5H9.4c-.1-1.1-.5-1.8-1.2-2.5Z" />
    </Glyph>
  );
}

function Glyph({ children }: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" aria-hidden="true">
      {children}
    </svg>
  );
}
