"use client";

import { useId, useState } from "react";
import styles from "./services.module.css";

const questions = [
  {
    question: "What types of businesses does PalDev work with?",
    answer:
      "We work with businesses looking to build, modernize, or improve their digital systems. The right solution depends on your goals, requirements, and existing technology.",
  },
  {
    question: "Can PalDev build a completely custom system?",
    answer:
      "Yes. Custom software development is one of our core service areas. We begin by understanding your requirements before proposing an appropriate solution.",
  },
  {
    question: "Can you improve an existing website or system?",
    answer:
      "We can assess existing digital platforms and discuss improvements, integrations, or modernization based on their condition and technical requirements.",
  },
  {
    question: "Do you work with international clients?",
    answer:
      "Yes. We welcome project inquiries from businesses locally and internationally. How we collaborate depends on the project, timeline, and the way your team prefers to work.",
  },
  {
    question: "How much does a software project cost?",
    answer:
      "Pricing depends on scope, features, complexity, integrations, and support requirements. Contact us to discuss your needs and receive a tailored proposal.",
  },
  {
    question: "How do we start a project?",
    answer:
      "Start by contacting us with a brief description of your idea or challenge. We'll review your requirements and discuss possible next steps.",
  },
] as const;

export function ServicesFaq() {
  const baseId = useId();
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <section className={`${styles.section} ${styles.toneLight} ${styles.rise}`} aria-labelledby="faq-title">
      <div className={styles.inner}>
        <header className={styles.sectionHead}>
          <p className={styles.eyebrow}>Frequently Asked Questions</p>
          <h2 id="faq-title">Questions? We&apos;ve Got Answers.</h2>
        </header>
        <div className={styles.faqList}>
          {questions.map((item, index) => {
            const open = openIndex === index;
            const panelId = `${baseId}-panel-${index}`;
            const buttonId = `${baseId}-button-${index}`;

            return (
              <div key={item.question} className={styles.item}>
                <h3>
                  <button
                    id={buttonId}
                    className={styles.question}
                    type="button"
                    aria-expanded={open}
                    aria-controls={panelId}
                    onClick={() => setOpenIndex(open ? null : index)}
                  >
                    {item.question}
                    <svg
                      className={open ? styles.iconOpen : undefined}
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.8"
                      aria-hidden="true"
                    >
                      <path d="m6 9 6 6 6-6" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </button>
                </h3>
                <div id={panelId} role="region" aria-labelledby={buttonId} className={`${styles.panel} ${open ? styles.panelOpen : ""}`}>
                  <div className={styles.panelInner}>
                    <div className={styles.answer}>
                      <p>{item.answer}</p>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
