"use client";

import { useId, useState } from "react";
import styles from "./contact.module.css";

const questions = [
  {
    question: "Do I need technical knowledge to request a quote?",
    answer:
      "No. Simply describe your idea or business challenge in your own words. We can help explore the technical options.",
  },
  {
    question: "Can I request a quote without knowing my budget?",
    answer: 'Yes. You can select "Not Sure Yet" or "Prefer to Discuss" when completing the form.',
  },
  {
    question: "Can PalDev improve an existing application?",
    answer:
      "We can review existing platforms and discuss potential improvements, integrations, or modernization based on their requirements.",
  },
  {
    question: "Do you work with international clients?",
    answer:
      "Yes. We welcome project inquiries from businesses locally and internationally. How we collaborate depends on the project, timeline, and the way your team prefers to work.",
  },
  {
    question: "Will I receive an instant quotation?",
    answer:
      "Not necessarily. Software development pricing depends on project scope, features, integrations, and technical complexity. Additional discussion may be needed before a proposal is prepared.",
  },
  {
    question: "Can I request a technical consultation?",
    answer:
      "Yes. You can use the general contact form or technical quote form to describe the technical challenge you would like to discuss.",
  },
  {
    question: "Can I change my project requirements later?",
    answer:
      "Project requirements can be discussed and refined during the initial consultation and planning process.",
  },
];

export function ContactFaq() {
  const baseId = useId();
  const [open, setOpen] = useState<number | null>(0);

  return (
    <section className={`${styles.section} ${styles.sectionLight}`} aria-labelledby="contact-faq-title">
      <div className={`${styles.inner} ${styles.faqInner}`}>
        <header className={styles.sectionHead}>
          <p className={styles.eyebrow}>Questions</p>
          <h2 id="contact-faq-title">Frequently Asked Questions.</h2>
        </header>
        <div className={styles.faq}>
          {questions.map((item, index) => {
            const expanded = open === index;
            const panelId = `${baseId}-panel-${index}`;
            const buttonId = `${baseId}-button-${index}`;
            return (
              <div key={item.question} className={styles.faqItem}>
                <h3>
                  <button
                    id={buttonId}
                    type="button"
                    aria-expanded={expanded}
                    aria-controls={panelId}
                    onClick={() => setOpen(expanded ? null : index)}
                  >
                    {item.question}
                    <span aria-hidden="true">{expanded ? "–" : "+"}</span>
                  </button>
                </h3>
                <div id={panelId} role="region" aria-labelledby={buttonId} hidden={!expanded}>
                  <p>{item.answer}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
