import styles from "./services.module.css";

const services = [
  {
    href: "#custom-software-development",
    title: "Custom Software Development",
    description: "Tailored applications, platforms, and business systems built around your goals.",
    icon: "code",
  },
  {
    href: "#business-digitalization",
    title: "Business Digitalization",
    description: "Smarter workflows and connected digital systems that simplify operations.",
    icon: "workflow",
  },
  {
    href: "#ai-data-solutions",
    title: "AI & Data Solutions",
    description: "Practical data, analytics, and intelligent automation for better decisions.",
    icon: "data",
  },
  {
    href: "#it-consulting-support",
    title: "IT Consulting & Technical Support",
    description: "Technical guidance and system improvements to support reliable operations.",
    icon: "support",
  },
] as const;

export function ServicesOverview() {
  return (
    <section className={`${styles.section} ${styles.toneWhite} ${styles.rise}`} id="services-overview" aria-labelledby="overview-title">
      <div className={styles.inner}>
        <header className={styles.sectionHead}>
          <p className={styles.eyebrow}>What We Do</p>
          <h2 id="overview-title">Everything You Need to Move Forward.</h2>
          <p>We help businesses design, build, and improve the technology behind their operations.</p>
        </header>
        <div className={styles.overviewGrid}>
          {services.map((service) => (
            <a key={service.href} href={service.href} className={styles.card}>
              <span className={styles.icon}>
                <OverviewIcon name={service.icon} />
              </span>
              <h3>{service.title}</h3>
              <p>{service.description}</p>
              <span className={styles.cardArrow}>
                Explore Service
                <Arrow />
              </span>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}

function Arrow() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" aria-hidden="true">
      <path d="M5 12h14M13 6l6 6-6 6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function OverviewIcon({ name }: { name: (typeof services)[number]["icon"] }) {
  if (name === "code") {
    return (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" aria-hidden="true">
        <rect x="3.5" y="4.5" width="17" height="15" rx="2.5" />
        <path d="M8 10.5 6 12l2 1.5M16 10.5 18 12l-2 1.5M13 9.5l-2 5" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    );
  }

  if (name === "workflow") {
    return (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" aria-hidden="true">
        <rect x="3" y="4" width="6" height="6" rx="1.5" />
        <rect x="15" y="4" width="6" height="6" rx="1.5" />
        <rect x="9" y="14" width="6" height="6" rx="1.5" />
        <path d="M6 10v2.5A1.5 1.5 0 0 0 7.5 14H9M18 10v2.5A1.5 1.5 0 0 1 16.5 14H15" strokeLinecap="round" />
      </svg>
    );
  }

  if (name === "data") {
    return (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" aria-hidden="true">
        <path d="M4 19V10M10 19V5M16 19v-7M21 19H3" strokeLinecap="round" />
        <path d="m15 8 5-4M20 8V4h-4" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    );
  }

  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" aria-hidden="true">
      <circle cx="12" cy="12" r="8" />
      <circle cx="12" cy="12" r="2.2" />
      <path d="M12 4v2.2M12 17.8V20M4 12h2.2M17.8 12H20" strokeLinecap="round" />
    </svg>
  );
}
