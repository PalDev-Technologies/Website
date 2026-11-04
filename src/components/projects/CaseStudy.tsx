import Image from "next/image";
import Link from "next/link";
import { cardTitle, type PortfolioProject } from "@/lib/projects";
import { ProjectsCta } from "./ProjectsCta";
import styles from "./projects.module.css";

const sectionLinks = [
  { href: "#overview", label: "Overview" },
  { href: "#challenge", label: "Challenge" },
  { href: "#solution", label: "Solution" },
  { href: "#features", label: "Features" },
  { href: "#workflow", label: "How It Works" },
  { href: "#value", label: "Value" },
] as const;

export function CaseStudy({
  project,
  next,
}: {
  project: PortfolioProject;
  next: PortfolioProject | null;
}) {
  const title = cardTitle[project.id] ?? project.projectTitle;
  const nextTitle = next ? (cardTitle[next.id] ?? next.projectTitle) : "";

  return (
    <>
      <section className={styles.studyHero} aria-labelledby="case-title">
        <div className={styles.inner}>
          <nav className={styles.crumbs} aria-label="Breadcrumb">
            <ol>
              <li>
                <Link href="/">Home</Link>
              </li>
              <li>
                <Link href="/projects">Projects</Link>
              </li>
              <li aria-current="page">{title}</li>
            </ol>
          </nav>
          <div className={styles.studyLayout}>
            <div className={styles.studyCopy}>
              <p className={styles.meta}>{project.category}</p>
              <h1 id="case-title">{project.projectTitle}</h1>
              <p className={styles.headline}>{project.headline}</p>
              <p>{project.shortDescription}</p>
              <div className={styles.actions}>
                {project.websiteUrl ? (
                  <a
                    className={styles.primary}
                    href={project.websiteUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Visit {project.clientName ?? "Website"}
                    <External />
                  </a>
                ) : (
                  <a className={styles.primary} href="#overview">
                    View Project Details
                    <Chevron />
                  </a>
                )}
                <Link className={styles.secondary} href="/contact">
                  Discuss a Similar Project
                  <Arrow />
                </Link>
              </div>
            </div>
            <figure className={styles.logoPanel}>
              {project.clientLogo ? (
                <Image
                  src={project.clientLogo.src}
                  alt={project.clientLogo.alt}
                  width={project.clientLogo.width}
                  height={project.clientLogo.height}
                  priority
                  sizes="(min-width: 1024px) 460px, 100vw"
                  className={logoClass(project, styles)}
                />
              ) : (
                <div className={styles.wordmark}>
                  <p>Project</p>
                  <strong>{project.projectTitle}</strong>
                </div>
              )}
            </figure>
          </div>
        </div>
      </section>

      <nav className={styles.sectionNav} aria-label="On this page">
        <div className={styles.inner}>
          <ul>
            {sectionLinks.map((link) => (
              <li key={link.href}>
                <a href={link.href}>{link.label}</a>
              </li>
            ))}
            {project.technologies ? (
              <li>
                <a href="#technologies">Technologies</a>
              </li>
            ) : null}
          </ul>
        </div>
      </nav>

      <section id="overview" className={`${styles.section} ${styles.sectionWhite}`} aria-labelledby="overview-title">
        <div className={`${styles.inner} ${styles.split}`}>
          <div>
            <p className={styles.eyebrow}>Overview</p>
            <h2 id="overview-title">Project Overview</h2>
          </div>
          <div className={styles.prose}>
            {project.overview.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </div>
        </div>
      </section>

      <section id="challenge" className={`${styles.section} ${styles.sectionInk}`} aria-labelledby="challenge-title">
        <div className={`${styles.inner} ${styles.split}`}>
          <div>
            <p className={styles.eyebrow}>Context</p>
            <h2 id="challenge-title">{project.challenge.title}</h2>
          </div>
          <div className={styles.prose}>
            {project.challenge.paragraphs.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </div>
        </div>
      </section>

      <section id="solution" className={`${styles.section} ${styles.sectionLight}`} aria-labelledby="solution-title">
        <div className={styles.inner}>
          <header className={styles.sectionHead}>
            <p className={styles.eyebrow}>Approach</p>
            <h2 id="solution-title">{project.solution.title}</h2>
          </header>
          <div className={project.solution.diagram ? styles.solutionGrid : styles.proseWide}>
            <div className={styles.prose}>
              {project.solution.paragraphs.map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
              {project.solution.parts ? (
                <ol className={styles.parts}>
                  {project.solution.parts.map((part) => (
                    <li key={part.number}>
                      <span>{part.number}</span>
                      <div>
                        <h3>{part.title}</h3>
                        <p>{part.description}</p>
                      </div>
                    </li>
                  ))}
                </ol>
              ) : null}
            </div>
            {project.solution.diagram === "storefront" ? <StorefrontDiagram /> : null}
          </div>
        </div>
      </section>

      <div id="features">
        {project.featureGroups.map((group, index) => (
          <section
            key={group.id}
            className={`${styles.section} ${index % 2 === 0 ? styles.sectionWhite : styles.sectionLight}`}
            aria-labelledby={`${group.id}-title`}
          >
            <div className={styles.inner}>
              <header className={styles.sectionHead}>
                <p className={styles.eyebrow}>{group.eyebrow}</p>
                <h2 id={`${group.id}-title`}>{group.heading}</h2>
                <p>{group.description}</p>
              </header>
              <ol className={index % 2 === 0 ? styles.featureRail : styles.featureGrid}>
                {group.features.map((feature, featureIndex) => (
                  <li key={feature.title}>
                    <span>{String(featureIndex + 1).padStart(2, "0")}</span>
                    <div>
                      <h3>{feature.title}</h3>
                      <p>{feature.description}</p>
                      {feature.items ? (
                        <ul>
                          {feature.items.map((item) => (
                            <li key={item}>{item}</li>
                          ))}
                        </ul>
                      ) : null}
                    </div>
                  </li>
                ))}
              </ol>
            </div>
          </section>
        ))}
      </div>

      <section id="workflow" className={`${styles.section} ${styles.sectionWhite}`} aria-labelledby="workflow-title">
        <div className={styles.inner}>
          <header className={styles.sectionHead}>
            <p className={styles.eyebrow}>Workflow</p>
            <h2 id="workflow-title">{project.workflow.title}</h2>
          </header>
          <div className={styles.tracks}>
            {project.workflow.tracks.map((track) => (
              <div key={track.id}>
                <h3 className={styles.trackLabel}>{track.label}</h3>
                <ol className={styles.flow}>
                  {track.steps.map((step, index) => (
                    <li key={step.title}>
                      <span>{String(index + 1).padStart(2, "0")}</span>
                      <h4>{step.title}</h4>
                      {step.description ? <p>{step.description}</p> : null}
                    </li>
                  ))}
                </ol>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="value" className={`${styles.section} ${styles.sectionLight}`} aria-labelledby="value-title">
        <div className={`${styles.inner} ${styles.split}`}>
          <div>
            <p className={styles.eyebrow}>{project.businessValue.eyebrow}</p>
            <h2 id="value-title">{project.businessValue.heading}</h2>
            <p className={styles.support}>{project.businessValue.description}</p>
          </div>
          <ul className={styles.highlights}>
            {project.businessValue.highlights.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </div>
      </section>

      {project.technologies ? (
        <section id="technologies" className={`${styles.section} ${styles.techSection}`} aria-labelledby="tech-title">
          <div className={styles.inner}>
            <h2 id="tech-title">Technologies</h2>
            <ul className={styles.techList}>
              {project.technologies.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>
        </section>
      ) : null}

      {next ? (
        <section className={`${styles.section} ${styles.next}`} aria-labelledby="next-title">
          <div className={styles.inner}>
            <Link className={styles.nextCard} href={`/projects/${next.slug}`}>
              <div className={styles.nextCopy}>
                <p className={styles.eyebrow}>Next Project</p>
                <h2 id="next-title">{nextTitle}</h2>
                <p>{next.subtitle}</p>
              </div>
              <span className={styles.view}>
                View Project
                <Arrow />
              </span>
            </Link>
          </div>
        </section>
      ) : null}
      <ProjectsCta />
    </>
  );
}

function StorefrontDiagram() {
  return (
    <figure className={styles.diagram} aria-label="Conceptual platform structure">
      <figcaption>Platform structure</figcaption>
      <div className={styles.diagramNode}>
        <StoreIcon />
        <strong>Customer Storefront</strong>
        <span>Browse, cart, and orders</span>
      </div>
      <div className={styles.diagramLink} aria-hidden="true">
        <span />
      </div>
      <div className={`${styles.diagramNode} ${styles.diagramCore}`}>
        <LayersIcon />
        <strong>Shared Business Platform</strong>
        <span>Products, orders, and records</span>
      </div>
      <div className={styles.diagramLink} aria-hidden="true">
        <span />
      </div>
      <div className={styles.diagramNode}>
        <DashboardIcon />
        <strong>Administrative Dashboard</strong>
        <span>Catalog, stock, and reporting</span>
      </div>
    </figure>
  );
}

function logoClass(project: PortfolioProject, sheet: typeof styles) {
  const logo = project.clientLogo;
  return logo && logo.width > logo.height * 1.4 ? sheet.logoWide : sheet.logo;
}

function Arrow() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
      <path d="M5 12h14M13 6l6 6-6 6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function Chevron() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
      <path d="M6 9l6 6 6-6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function External() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
      <path d="M14 5h5v5M19 5l-9 9M10 5H5v14h14v-5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function StoreIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true">
      <path d="M4 10h16v9H4zM3 10l1.5-5h15L21 10M9 19v-5h6v5" strokeLinejoin="round" />
    </svg>
  );
}

function LayersIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true">
      <path d="M12 4l8 4-8 4-8-4 8-4zM4 12l8 4 8-4M4 16l8 4 8-4" strokeLinejoin="round" />
    </svg>
  );
}

function DashboardIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true">
      <rect x="3" y="3" width="8" height="8" rx="1.5" />
      <rect x="13" y="3" width="8" height="5" rx="1.5" />
      <rect x="13" y="10" width="8" height="11" rx="1.5" />
      <rect x="3" y="13" width="8" height="8" rx="1.5" />
    </svg>
  );
}
