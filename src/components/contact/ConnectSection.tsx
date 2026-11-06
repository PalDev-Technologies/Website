import styles from "./contact.module.css";

export function ConnectSection() {
  return (
    <section className={`${styles.section} ${styles.sectionWhite}`} aria-labelledby="connect-title">
      <div className={styles.inner}>
        <header className={styles.sectionHead}>
          <p className={styles.eyebrow}>Other Ways to Connect</p>
          <h2 id="connect-title">We&apos;re Here to Connect.</h2>
          <p>
            Questions and project inquiries are received through the forms on this page. Share a few
            details and PalDev will review them directly.
          </p>
        </header>
        <div className={styles.connectActions}>
          <a className={styles.secondaryDark} href="#general-contact">
            Send a Message
          </a>
          <a className={styles.primary} href="#technical-quote">
            Get a Technical Quote
          </a>
        </div>
      </div>
    </section>
  );
}
