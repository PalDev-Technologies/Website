import styles from "./about.module.css";

export function WhoWeAre() {
  return (
    <section className={styles.who} aria-labelledby="who-title">
      <div className={styles.whoInner}>
        <div>
          <p className={styles.eyebrow}>Who We Are</p>
          <h2 id="who-title">
            <span>Building Digital Solutions</span>
            <span>That Make a Difference.</span>
          </h2>
        </div>
        <div className={styles.whoCopy}>
          <p>
            PalDev Technologies is a software development and digital solutions company focused on
            helping businesses turn ideas into reliable, practical technology.
          </p>
          <p>
            From custom applications and digital platforms to business process improvements and
            technical consulting, we approach every project with a focus on understanding the real
            challenge and delivering a solution that creates meaningful value.
          </p>
          <p className={styles.statement}>Designed for businesses everywhere.</p>
        </div>
      </div>
    </section>
  );
}
