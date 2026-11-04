import styles from "./services.module.css";

const steps = [
  {
    number: "01",
    title: "Discover",
    description: "Understand the business, goals, challenges, users, and requirements.",
  },
  {
    number: "02",
    title: "Plan & Design",
    description: "Define the solution, user experience, technical approach, and project scope.",
  },
  {
    number: "03",
    title: "Develop & Test",
    description: "Build, review, and test the solution with attention to quality and reliability.",
  },
  {
    number: "04",
    title: "Launch & Improve",
    description: "Support implementation and identify opportunities for future improvements.",
  },
] as const;

export function DevelopmentProcess() {
  return (
    <section className={`${styles.section} ${styles.process} ${styles.rise}`} aria-labelledby="process-title">
      <div className={styles.inner}>
        <header className={styles.sectionHead}>
          <p className={styles.eyebrow}>How We Work</p>
          <h2 id="process-title">A Clear Path From Idea to Launch.</h2>
          <p>We follow a practical, collaborative approach to turning business requirements into working digital solutions.</p>
        </header>
        <ol className={styles.timeline}>
          {steps.map((step) => (
            <li key={step.number} className={styles.step}>
              <span className={styles.num}>{step.number}</span>
              <h3>{step.title}</h3>
              <p>{step.description}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
