import Image from "next/image";
import Link from "next/link";
import { ArrowIcon } from "@/components/ui/icons";
import { quoteHref } from "@/lib/site";
import styles from "./services.module.css";

export function ServicesHero() {
  return (
    <section className={styles.hero} aria-labelledby="services-title">
      <div className={styles.heroInner}>
        <div className={styles.heroCopy}>
          <p className={styles.eyebrow}>Our Services</p>
          <h1 id="services-title">
            Smart Technology.
            <span>Real Business Impact.</span>
          </h1>
          <p>
            From custom software to intelligent digital solutions, we help businesses turn challenges
            into opportunities through technology.
          </p>
          <div className={styles.actions}>
            <Link href={quoteHref} className={styles.primary}>
              Start Your Project
              <ArrowIcon />
            </Link>
            <a href="#services-overview" className={styles.secondary}>
              Explore Our Expertise
              <DownIcon />
            </a>
          </div>
        </div>
        <HeroVisual />
      </div>
    </section>
  );
}

function HeroVisual() {
  return (
    <figure className={styles.stage}>
      <Image
        src="/images/services_Paldev.png"
        alt="Illustration of a laptop dashboard surrounded by code, data, and cloud tools"
        width={1672}
        height={941}
        sizes="(max-width: 1024px) 1px, 900px"
        className={styles.heroImage}
      />
    </figure>
  );
}

function DownIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" aria-hidden="true">
      <path d="M12 5v14M6 13l6 6 6-6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
