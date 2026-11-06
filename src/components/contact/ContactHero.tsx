import { HeroArt } from "@/components/layout/HeroArt";
import styles from "./contact.module.css";

export function ContactHero() {
  return (
    <section className={styles.hero} aria-labelledby="contact-title">
      <div className={`${styles.inner} ${styles.heroInner}`}>
        <div className={styles.heroCopy}>
          <p className={styles.eyebrow}>Let&apos;s Connect</p>
          <h1 id="contact-title">
            Let&apos;s Build Something
            <span>
              <em>Exceptional.</em>
            </span>
          </h1>
          <p className={styles.lede}>
            Have an idea, a technical challenge, or a project ready to start? Tell us what you have in
            mind, and let&apos;s explore the right solution together.
          </p>
          <div className={styles.actions}>
            <a className={styles.primary} href="#technical-quote">
              Get a Technical Quote
              <Arrow />
            </a>
            <a className={styles.secondary} href="#general-contact">
              Send a Message
              <Arrow />
            </a>
          </div>
        </div>
        <figure className={styles.stage}>
          <HeroArt id="contact" alt="PalDev Technologies" className={styles.heroArt} />
        </figure>
      </div>
    </section>
  );
}

function Arrow() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
      <path d="M5 12h14M13 6l6 6-6 6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
