import { AboutIcon } from "./icons";
import styles from "./about.module.css";

const cards = [
  {
    icon: "target",
    title: "Our Mission",
    description:
      "To make reliable, thoughtfully engineered digital solutions accessible to businesses, helping them simplify operations, embrace innovation, and unlock new opportunities.",
  },
  {
    icon: "telescope",
    title: "Our Vision",
    description:
      "To become a trusted technology partner, recognized for quality, creativity, and lasting impact.",
  },
] as const;

export function MissionVision() {
  return (
    <section className={styles.purpose} aria-labelledby="purpose-title">
      <div className={styles.inner}>
        <header className={styles.sectionHead}>
          <p className={styles.eyebrow}>Our Purpose</p>
          <h2 id="purpose-title">Driven by Purpose. Focused on Impact.</h2>
          <p>Our direction is simple: build technology that creates meaningful value.</p>
        </header>
        <div className={styles.purposeGrid}>
          {cards.map((card) => (
            <article key={card.title} className={styles.purposeCard}>
              <span className={styles.purposeIcon}>
                <AboutIcon name={card.icon} />
              </span>
              <h3>{card.title}</h3>
              <p>{card.description}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
