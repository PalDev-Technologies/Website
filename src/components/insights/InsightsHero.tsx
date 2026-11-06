import Link from "next/link";
import { HeroArt } from "@/components/layout/HeroArt";
import { ArrowIcon } from "@/components/ui/icons";
import { publishedArticles } from "@/lib/insights";
import styles from "./insights.module.css";

export function InsightsHero() {
  const target = publishedArticles().length > 0 ? "#article-discovery" : "#featured-insight";

  return (
    <section className={styles.hero} aria-labelledby="insights-title">
      <div className={`${styles.inner} ${styles.heroInner}`}>
        <div className={styles.heroCopy}>
          <p className={styles.eyebrow}>PalDev Insights</p>
          <h1 id="insights-title">
            Ideas, Insights &
            <span className={styles.heroLine}>
              the <em>Future of Technology.</em>
            </span>
          </h1>
          <p className={styles.lede}>
            Explore practical perspectives on software development, artificial intelligence, digital
            transformation, and the technologies shaping modern business.
          </p>
          <div className={styles.actions}>
            <a className={styles.primary} href={target}>
              Explore Insights
              <ArrowIcon />
            </a>
            <Link className={styles.secondary} href="/services">
              Our Services
              <ArrowIcon />
            </Link>
          </div>
        </div>
        <figure className={styles.stage}>
          <HeroArt
            id="insights"
            alt="Illustration of documents, a magnifying glass, and technology icons on a glowing platform"
            className={styles.heroArt}
          />
        </figure>
      </div>
    </section>
  );
}
