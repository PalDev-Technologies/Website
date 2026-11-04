import { AboutIcon } from "./icons";
import styles from "./about.module.css";

const principles = [
  {
    icon: "shield",
    title: "Quality First",
    description: "We prioritize reliable, maintainable, and thoughtfully built solutions.",
  },
  {
    icon: "messages",
    title: "Clear Communication",
    description: "We believe strong collaboration starts with transparency and shared understanding.",
  },
  {
    icon: "lightbulb",
    title: "Practical Innovation",
    description: "We focus on technology that solves real challenges rather than adding complexity.",
  },
  {
    icon: "trend",
    title: "Long-Term Thinking",
    description: "We design solutions with future growth, adaptability, and sustainability in mind.",
  },
] as const;

export function OurPrinciples() {
  return (
    <section className={styles.principles} aria-labelledby="principles-title">
      <div className={styles.inner}>
        <header className={styles.sectionHead}>
          <p className={styles.eyebrow}>What Drives Us</p>
          <h2 id="principles-title">The Principles Behind Our Work.</h2>
          <p>The way we build matters just as much as what we build.</p>
        </header>
        <div className={styles.principleGrid}>
          {principles.map((principle) => (
            <article key={principle.title} className={styles.principle}>
              <h3>
                <AboutIcon name={principle.icon} />
                {principle.title}
              </h3>
              <p>{principle.description}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
