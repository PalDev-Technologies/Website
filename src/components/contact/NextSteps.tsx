import styles from "./contact.module.css";

const steps = [
  {
    number: "01",
    title: "We Review Your Request",
    text: "We review the information you share to understand your goals, requirements, and project priorities.",
  },
  {
    number: "02",
    title: "We Discuss Your Needs",
    text: "We may arrange a conversation to clarify the scope, technical considerations, and potential approaches.",
  },
  {
    number: "03",
    title: "We Plan the Next Steps",
    text: "Based on your requirements, we can discuss a suitable solution and prepare a tailored proposal where appropriate.",
  },
];

export function NextSteps() {
  return (
    <section className={`${styles.section} ${styles.sectionLight}`} aria-labelledby="next-steps-title">
      <div className={styles.inner}>
        <header className={styles.sectionHead}>
          <p className={styles.eyebrow}>Our Process</p>
          <h2 id="next-steps-title">What Happens After You Reach Out?</h2>
          <p>We keep the process straightforward, collaborative, and focused on your needs.</p>
        </header>
        <ol className={styles.timeline}>
          {steps.map((step) => (
            <li key={step.number}>
              <span>{step.number}</span>
              <h3>{step.title}</h3>
              <p>{step.text}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
