import styles from "./about.module.css";

const steps = [
  {
    number: "01",
    title: "Discover",
    description: "We listen, understand your challenges, and define clear project goals.",
  },
  {
    number: "02",
    title: "Plan & Design",
    description: "We shape the solution, map the experience, and establish a practical development plan.",
  },
  {
    number: "03",
    title: "Build & Test",
    description: "We develop, refine, and test the solution with attention to quality and reliability.",
  },
  {
    number: "04",
    title: "Launch & Improve",
    description: "We support implementation and help the solution evolve as your needs change.",
  },
] as const;

export function OurProcess() {
  return (
    <section className={styles.process} aria-labelledby="process-title">
      <div className={styles.inner}>
        <header className={styles.sectionHead}>
          <p className={styles.eyebrow}>Our Approach</p>
          <h2 id="process-title">From Idea to Impact.</h2>
          <p>A clear, collaborative approach to building technology that delivers real value.</p>
        </header>
        <ol className={styles.steps}>
          {steps.map((step) => (
            <li key={step.number}>
              <span className={styles.stepNum}>{step.number}</span>
              <h3>{step.title}</h3>
              <p>{step.description}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
