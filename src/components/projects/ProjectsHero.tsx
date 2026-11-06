import Image from "next/image";
import Link from "next/link";
import { quoteHref } from "@/lib/site";
import styles from "./projects.module.css";

export function ProjectsHero() {
  return (
    <section className={styles.hero} aria-labelledby="projects-hero-title">
      <div className={`${styles.inner} ${styles.heroInner}`}>
        <div className={styles.heroCopy}>
          <p className={styles.eyebrow}>Our Work</p>
          <h1 id="projects-hero-title">
            Digital Experiences.
            <span>Built for Real Work.</span>
          </h1>
          <p className={styles.lede}>
            Selected software developed by PalDev Technologies for businesses that need a clear
            customer experience and practical tools for day-to-day operations.
          </p>
          <div className={styles.actions}>
            <a className={styles.primary} href="#selected-work">
              Explore Our Projects
              <Chevron />
            </a>
            <Link className={styles.secondary} href={quoteHref}>
              Discuss Your Project
              <Arrow />
            </Link>
          </div>
        </div>
        <figure className={styles.stage}>
          <Image
            src="/images/project_Paldev.png?v=2"
            alt="Illustration of a laptop, tablet, and phone showing digital product interfaces"
            width={1671}
            height={941}
            sizes="(max-width: 1024px) 1px, 900px"
            className={styles.heroArt}
          />
        </figure>
      </div>
    </section>
  );
}

function Chevron() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
      <path d="M6 9l6 6 6-6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function Arrow() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
      <path d="M5 12h14M13 6l6 6-6 6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

