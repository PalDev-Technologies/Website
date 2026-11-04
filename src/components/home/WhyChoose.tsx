import { ValueGlyph } from "@/components/ui/icons";
import type { ValueIcon } from "@/lib/site";
import styles from "./WhyChoose.module.css";

const features: ReadonlyArray<{
  title: string;
  description: string;
  icon: ValueIcon;
}> = [
  {
    title: "Tailored Solutions",
    description: "Technology designed around your business, not the other way around.",
    icon: "sliders",
  },
  {
    title: "Engineering Excellence",
    description: "Clean, scalable solutions built with care and precision.",
    icon: "layers",
  },
  {
    title: "Transparent Collaboration",
    description: "Clear communication throughout every stage of development.",
    icon: "chat",
  },
  {
    title: "Built for the Long Term",
    description: "Digital solutions designed to evolve alongside your business.",
    icon: "partnership",
  },
];

export function WhyChoose() {
  return (
    <section className={styles.section} aria-labelledby="why-title">
      <div className={styles.inner}>
        <header className={styles.header}>
          <p className={styles.label}>Why PalDev</p>
          <h2 id="why-title">Built Around Your Success.</h2>
          <p className={styles.support}>
            More than development. We build technology that works for your business.
          </p>
        </header>
        <div className={styles.grid}>
          {features.map((feature) => (
            <article key={feature.title} className={styles.card}>
              <span className={styles.icon}>
                <ValueGlyph name={feature.icon} />
              </span>
              <h3>{feature.title}</h3>
              <p>{feature.description}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
