import type { ReactNode } from "react";
import Link from "next/link";
import { quoteHref } from "@/lib/site";
import styles from "./services.module.css";

type ServiceDetailProps = {
  id: string;
  alias?: string;
  eyebrow: string;
  title: string;
  description: string;
  subheading: string;
  solutions: readonly string[];
  benefit: string;
  cta: string;
  visualSide: "left" | "right";
  tone: "light" | "white";
  children: ReactNode;
};

export function ServiceDetail({
  id,
  alias,
  eyebrow,
  title,
  description,
  subheading,
  solutions,
  benefit,
  cta,
  visualSide,
  tone,
  children,
}: ServiceDetailProps) {
  return (
    <section
      id={id}
      className={`${styles.detail} ${tone === "light" ? styles.toneLight : styles.toneWhite} ${styles.rise}`}
      aria-labelledby={`${id}-title`}
    >
      {alias ? <span id={alias} className={styles.legacyAnchor} /> : null}
      <div className={`${styles.detailInner} ${visualSide === "left" ? styles.visualLeft : styles.visualRight}`}>
        <div className={styles.copy}>
          <p className={styles.kicker}>{eyebrow}</p>
          <h2 id={`${id}-title`}>{title}</h2>
          <p>{description}</p>
          <h3 className={styles.subhead}>{subheading}</h3>
          <ul className={styles.solutionList}>
            {solutions.map((item) => (
              <li key={item}>
                <CheckIcon />
                {item}
              </li>
            ))}
          </ul>
          <p className={styles.benefit}>{benefit}</p>
          <Link href={quoteHref} className={styles.detailCta}>
            {cta}
            <Arrow />
          </Link>
        </div>
        <div className={styles.visual}>{children}</div>
      </div>
    </section>
  );
}

function CheckIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
      <path d="M5 12.5 9.2 17 19 7" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function Arrow() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" aria-hidden="true">
      <path d="M5 12h14M13 6l6 6-6 6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
