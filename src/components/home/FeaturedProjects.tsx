import Link from "next/link";
import { ProjectCard } from "@/components/projects/SelectedWork";
import { featuredProjects } from "@/lib/projects";
import cardStyles from "@/components/projects/projects.module.css";
import styles from "./FeaturedProjects.module.css";

export function FeaturedProjects() {
  const projects = featuredProjects();

  return (
    <section className={styles.section} aria-labelledby="projects-title">
      <div className={styles.inner}>
        <header className={styles.header}>
          <p className={styles.label}>Our Work</p>
          <h2 id="projects-title">
            Real Projects.
            <span>Built for Real Business Needs.</span>
          </h2>
          <p className={styles.support}>
            Explore how PalDev Technologies transforms business requirements into practical digital
            solutions through custom software development.
          </p>
        </header>
        <div className={styles.gridWrap}>
          <div className={cardStyles.workGrid}>
            {projects.map((project) => (
              <ProjectCard key={project.id} project={project} />
            ))}
          </div>
        </div>
        <div className={styles.more}>
          <Link href="/projects" className={styles.all}>
            View All Projects
            <Arrow />
          </Link>
        </div>
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
