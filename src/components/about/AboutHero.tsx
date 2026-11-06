import Link from "next/link";
import { HeroArt } from "@/components/layout/HeroArt";
import { ArrowIcon } from "@/components/ui/icons";
import styles from "./about.module.css";

export function AboutHero() {
  return (
    <section className={styles.hero} aria-labelledby="about-title">
      <div className={styles.heroInner}>
        <div className={styles.heroCopy}>
          <p className={styles.eyebrowLight}>About PalDev Technologies</p>
          <h1 id="about-title">
            Technology Built Around
            <span>People, Ideas &amp; Growth.</span>
          </h1>
          <p>
            We transform ambitious ideas into practical digital solutions that help businesses work
            smarter, innovate, and grow with confidence.
          </p>
          <Link href="/services" className={styles.heroButton}>
            Explore Our Services
            <ArrowIcon />
          </Link>
        </div>
        <HeroVisual />
      </div>
    </section>
  );
}

function HeroVisual() {
  return (
    <figure className={styles.stage}>
      <HeroArt
        id="about"
        alt="Illustration of software, data, and digital technology"
        className={styles.heroImage}
      />
    </figure>
  );
}
