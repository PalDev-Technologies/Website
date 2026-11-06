import Link from "next/link";
import { HeroArt } from "@/components/layout/HeroArt";
import { ArrowIcon } from "@/components/ui/icons";
import { quoteHref } from "@/lib/site";
import styles from "./Hero.module.css";

export function Hero() {
  return (
    <section className={styles.hero} aria-labelledby="hero-title">
      <div className={styles.copy}>
        <h1 id="hero-title">
          Technology
          <span className={styles.line}>Solutions for</span>
          <span className={styles.accent}>Real Impact</span>
        </h1>
        <p className={styles.lede}>
          We design, develop, and deliver innovative digital solutions that help businesses grow,
          operate smarter, and create lasting value.
        </p>
        <div className={styles.actions}>
          <Link href={quoteHref} className={styles.primary}>
            Get in Touch
            <ArrowIcon />
          </Link>
          <Link href="/services" className={styles.secondary}>
            Our Services
          </Link>
        </div>
      </div>
      <div className={styles.grid}>
        <div className={styles.visual}>
          <HeroArt
            id="home"
            alt="PalDev P mark with a laptop, code, and digital technology graphics"
            className={styles.heroImage}
          />
        </div>
      </div>
    </section>
  );
}
