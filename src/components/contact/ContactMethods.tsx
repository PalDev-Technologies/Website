import styles from "./contact.module.css";

export function ContactMethods() {
  return (
    <section className={`${styles.section} ${styles.sectionWhite}`} aria-labelledby="contact-methods-title">
      <div className={styles.inner}>
        <header className={styles.sectionHead}>
          <p className={styles.eyebrow}>How Can We Help?</p>
          <h2 id="contact-methods-title">The Right Conversation Starts Here.</h2>
          <p>Whether you have a quick question or a detailed project in mind, choose the best way to connect.</p>
        </header>
        <div className={styles.methodGrid}>
          <article className={styles.method}>
            <span className={styles.methodIcon}>
              <MessageIcon />
            </span>
            <h3>General Inquiry</h3>
            <p>Have a question, partnership opportunity, or general business inquiry? Send us a message.</p>
            <a className={styles.textLink} href="#general-contact">
              Send a Message
              <Arrow />
            </a>
          </article>
          <article className={`${styles.method} ${styles.methodAccent}`}>
            <span className={styles.methodIcon}>
              <FileIcon />
            </span>
            <h3>Request a Technical Quote</h3>
            <p>
              Planning a software project? Share your requirements and let us help you explore the right
              technical approach.
            </p>
            <a className={styles.textLink} href="#technical-quote">
              Get a Technical Quote
              <Arrow />
            </a>
          </article>
        </div>
      </div>
    </section>
  );
}

function MessageIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" aria-hidden="true">
      <path d="M6 16.5 4 19v-5.2A6.8 6.8 0 0 1 7.2 6h9.6A6.8 6.8 0 0 1 20 12.2 5.3 5.3 0 0 1 14.7 17H8.2L6 16.5Z" />
      <path d="M8.5 11h7" />
    </svg>
  );
}

function FileIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" aria-hidden="true">
      <path d="M7 3.5h7l4 4V20a1.5 1.5 0 0 1-1.5 1.5h-9.5A1.5 1.5 0 0 1 5.5 20V5A1.5 1.5 0 0 1 7 3.5Z" />
      <path d="M14 3.5V8h4.5M9 13l2 2 4-4" />
    </svg>
  );
}

function Arrow() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
      <path d="M5 12h14M13 6l6 6-6 6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
