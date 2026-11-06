import Image from "next/image";
import Link from "next/link";
import type { PortfolioProject } from "@/lib/projects";
import styles from "./projects.module.css";

export function SelectedWork({ projects }: { projects: readonly PortfolioProject[] }) {
  return (
    <section id="selected-work" className={styles.work} aria-labelledby="selected-work-title">
      <div className={styles.inner}>
        <header className={styles.sectionHead}>
          <p className={styles.eyebrow}>Selected Work</p>
          <h2 id="selected-work-title">Real Projects. Practical Solutions.</h2>
          <p>
            Explore selected digital solutions developed by PalDev Technologies, helping businesses
            improve customer experiences and streamline operations through custom technology.
          </p>
        </header>
        <div className={styles.workGrid}>
          {projects.map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </div>
      </div>
    </section>
  );
}

export function ProjectCard({ project }: { project: PortfolioProject }) {
  const { listing } = project;

  return (
    <article className={styles.workCard}>
      <div className={styles.cardLogo}>
        {project.clientLogo ? (
          <Image
            src={project.clientLogo.src}
            alt={project.clientLogo.alt}
            width={project.clientLogo.width}
            height={project.clientLogo.height}
            sizes="220px"
            className={styles.cardMark}
          />
        ) : null}
      </div>
      <p className={styles.cardCategory}>{listing.category}</p>
      <h3 className={styles.cardTitle}>
        <Link href={`/projects/${project.slug}`}>{listing.title}</Link>
      </h3>
      <p className={styles.cardSubtitle}>{listing.subtitle}</p>
      <p className={styles.cardDescription}>{listing.description}</p>
      <ul className={styles.cardPills} aria-label="Key capabilities">
        {listing.capabilities.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
      <div className={styles.cardActions}>
        <Link className={styles.explore} href={`/projects/${project.slug}`}>
          Explore Project
          <Arrow />
        </Link>
        {project.websiteUrl ? (
          <a
            className={styles.visit}
            href={project.websiteUrl}
            target="_blank"
            rel="noopener noreferrer"
          >
            Visit Website
            <External />
          </a>
        ) : null}
      </div>
    </article>
  );
}

function Arrow() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
      <path d="M5 12h14M13 6l6 6-6 6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function External() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
      <path d="M14 5h5v5M19 5l-9 9" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
