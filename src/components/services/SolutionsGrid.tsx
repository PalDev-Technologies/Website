import styles from "./services.module.css";

const solutions = [
  {
    title: "Business Management Platforms",
    description: "Organize operations, tasks, information, and internal workflows.",
    icon: "grid",
  },
  {
    title: "E-Commerce Platforms",
    description: "Modern online shopping experiences with product, order, and inventory management.",
    icon: "bag",
  },
  {
    title: "Customer Portals",
    description: "Convenient access to services, information, and updates.",
    icon: "portal",
  },
  {
    title: "Booking & Reservation Systems",
    description: "Simplify scheduling, reservations, and customer interactions.",
    icon: "calendar",
  },
  {
    title: "Reporting & Analytics Dashboards",
    description: "Turn business information into clear, actionable insights.",
    icon: "chart",
  },
  {
    title: "Workflow Automation Systems",
    description: "Reduce repetitive administrative work through connected digital processes.",
    icon: "flow",
  },
] as const;

export function SolutionsGrid() {
  return (
    <section className={`${styles.section} ${styles.toneLight} ${styles.rise}`} aria-labelledby="solutions-title">
      <div className={styles.inner}>
        <header className={styles.sectionHead}>
          <p className={styles.eyebrow}>Possibilities</p>
          <h2 id="solutions-title">Your Challenge. A Smarter Solution.</h2>
          <p>
            Every business has different needs. Here are some of the digital solutions we can help
            design and develop.
          </p>
        </header>
        <div className={styles.solutionGrid}>
          {solutions.map((solution) => (
            <article key={solution.title} className={styles.tile}>
              <span className={styles.icon}>
                <SolutionIcon name={solution.icon} />
              </span>
              <h3>{solution.title}</h3>
              <p>{solution.description}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

function SolutionIcon({ name }: { name: (typeof solutions)[number]["icon"] }) {
  const common = {
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.7,
    "aria-hidden": true as const,
  };

  if (name === "grid") {
    return (
      <svg {...common}>
        <rect x="4" y="4" width="6.5" height="6.5" rx="1.4" />
        <rect x="13.5" y="4" width="6.5" height="6.5" rx="1.4" />
        <rect x="4" y="13.5" width="6.5" height="6.5" rx="1.4" />
        <rect x="13.5" y="13.5" width="6.5" height="6.5" rx="1.4" />
      </svg>
    );
  }

  if (name === "bag") {
    return (
      <svg {...common}>
        <path d="M6 8h12l-.8 11.2a1.5 1.5 0 0 1-1.5 1.4H8.3a1.5 1.5 0 0 1-1.5-1.4L6 8Z" strokeLinejoin="round" />
        <path d="M9 8V6.8A3 3 0 0 1 12 3.8 3 3 0 0 1 15 6.8V8" strokeLinecap="round" />
      </svg>
    );
  }

  if (name === "portal") {
    return (
      <svg {...common}>
        <circle cx="12" cy="9" r="3" />
        <path d="M5.5 19.2a6.5 6.5 0 0 1 13 0" strokeLinecap="round" />
      </svg>
    );
  }

  if (name === "calendar") {
    return (
      <svg {...common}>
        <rect x="4" y="5.5" width="16" height="14" rx="2" />
        <path d="M8 3.8v3.2M16 3.8v3.2M4 9.5h16" strokeLinecap="round" />
      </svg>
    );
  }

  if (name === "chart") {
    return (
      <svg {...common}>
        <path d="M4 19h16M7 16v-4M12 16V7M17 16v-6" strokeLinecap="round" />
      </svg>
    );
  }

  return (
    <svg {...common}>
      <rect x="3" y="4" width="6" height="5" rx="1.2" />
      <rect x="15" y="15" width="6" height="5" rx="1.2" />
      <path d="M6 9v3.2A1.8 1.8 0 0 0 7.8 14H15" strokeLinecap="round" />
    </svg>
  );
}
