import { Suspense } from "react";
import { categoriesInUse, publishedArticles, toInsightCard } from "@/lib/insights";
import { InsightDiscovery } from "./InsightDiscovery";
import styles from "./insights.module.css";

export function InsightLibrary() {
  const articles = publishedArticles().map(toInsightCard);
  if (articles.length === 0) return null;

  const categories = categoriesInUse().map((category) => ({
    id: category.id,
    label: category.label,
  }));

  return (
    <Suspense fallback={<LibraryFallback />}>
      <InsightDiscovery articles={articles} categories={categories} />
    </Suspense>
  );
}

function LibraryFallback() {
  return (
    <section id="article-discovery" className={`${styles.section} ${styles.sectionLight}`}>
      <div className={styles.inner}>
        <header className={styles.sectionHead}>
          <p className={styles.eyebrow}>Explore Our Knowledge</p>
          <h2>Explore the Topics That Matter.</h2>
          <p>Discover practical ideas and perspectives to help you navigate technology and digital business.</p>
        </header>
      </div>
    </section>
  );
}
