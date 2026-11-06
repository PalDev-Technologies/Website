"use client";

import { useRef, useState, type FormEvent, type ReactNode } from "react";
import { inquiryTypes, type ContactInput, type FieldErrors } from "@/lib/inquiries/model";
import { validateContact } from "@/lib/inquiries/validate";
import styles from "./contact.module.css";

const empty: ContactInput = {
  fullName: "",
  email: "",
  company: "",
  phone: "",
  inquiryType: "",
  subject: "",
  message: "",
  consent: false,
  website: "",
  idempotencyKey: "",
};

type Success = { reference: string; submittedAt: string };

export function GeneralContact() {
  const [values, setValues] = useState(empty);
  const [errors, setErrors] = useState<FieldErrors>({});
  const [submitting, setSubmitting] = useState(false);
  const [failure, setFailure] = useState("");
  const [success, setSuccess] = useState<Success | null>(null);
  const key = useRef<string | null>(null);

  function update<K extends keyof ContactInput>(field: K, value: ContactInput[K]) {
    setValues((current) => ({ ...current, [field]: value }));
  }

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (submitting) return;
    if (key.current == null) key.current = crypto.randomUUID().replaceAll("-", "");
    const payload = { ...values, idempotencyKey: key.current };
    const nextErrors = validateContact(payload);
    setErrors(nextErrors);
    setFailure("");
    if (Object.keys(nextErrors).length > 0) {
      focusField(Object.keys(nextErrors)[0]);
      return;
    }

    setSubmitting(true);
    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = (await response.json()) as {
        ok?: boolean;
        reference?: string;
        submittedAt?: string;
        message?: string;
        errors?: FieldErrors;
      };
      if (!response.ok || !data.ok || !data.reference || !data.submittedAt) {
        if (data.errors) {
          setErrors(data.errors);
          focusField(Object.keys(data.errors)[0]);
        } else {
          setFailure(data.message || "We couldn't save your message. Please try again.");
        }
        return;
      }
      setSuccess({ reference: data.reference, submittedAt: data.submittedAt });
    } catch {
      setFailure("We couldn't save your message. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <section id="general-contact" className={`${styles.section} ${styles.sectionLight}`} aria-labelledby="general-contact-title">
      <div className={`${styles.inner} ${styles.split}`}>
        <div>
          <p className={styles.eyebrow}>Send Us a Message</p>
          <h2 id="general-contact-title">Let&apos;s Start a Conversation.</h2>
          <p className={styles.intro}>
            Have a question or want to discuss an opportunity? Send us a message and tell us how we can help.
          </p>
          <ul className={styles.points}>
            <li>General business inquiries</li>
            <li>Partnership opportunities</li>
            <li>Technical questions</li>
          </ul>
        </div>
        <div className={styles.panel}>
          {success ? (
            <div className={styles.success} role="status">
              <span className={styles.check} aria-hidden="true">
                ✓
              </span>
              <h3>Your Message Has Been Sent.</h3>
              <p>Thank you. PalDev will review your message and contact you about the next step.</p>
              <p className={styles.reference}>
                Reference <strong>{success.reference}</strong>
              </p>
              <p className={styles.metaLine}>Submitted {formatSubmitted(success.submittedAt)}</p>
            </div>
          ) : (
            <form onSubmit={onSubmit} noValidate>
              {failure ? (
                <p className={styles.formError} role="alert">
                  {failure}
                </p>
              ) : null}
              <Field label="Full name" required error={errors.fullName} id="contact-name">
                <input
                  id="contact-name"
                  autoComplete="name"
                  placeholder="Your full name"
                  value={values.fullName}
                  aria-invalid={Boolean(errors.fullName)}
                  onChange={(event) => update("fullName", event.target.value)}
                />
              </Field>
              <Field label="Email address" required error={errors.email} id="contact-email">
                <input
                  id="contact-email"
                  type="email"
                  autoComplete="email"
                  placeholder="you@company.com"
                  value={values.email}
                  aria-invalid={Boolean(errors.email)}
                  onChange={(event) => update("email", event.target.value)}
                />
              </Field>
              <div className={styles.fieldRow}>
                <Field label="Company / organization" error={errors.company} id="contact-company">
                  <input
                    id="contact-company"
                    autoComplete="organization"
                    placeholder="Company name"
                    value={values.company}
                    onChange={(event) => update("company", event.target.value)}
                  />
                </Field>
                <Field label="Phone number" error={errors.phone} id="contact-phone">
                  <input
                    id="contact-phone"
                    type="tel"
                    autoComplete="tel"
                    inputMode="tel"
                    placeholder="+000 000 000000"
                    value={values.phone}
                    aria-invalid={Boolean(errors.phone)}
                    onChange={(event) => update("phone", event.target.value)}
                  />
                </Field>
              </div>
              <Field label="Inquiry type" required error={errors.inquiryType} id="contact-type">
                <select
                  id="contact-type"
                  value={values.inquiryType}
                  aria-invalid={Boolean(errors.inquiryType)}
                  onChange={(event) => update("inquiryType", event.target.value)}
                >
                  <option value="">Select an inquiry type</option>
                  {inquiryTypes.map((type) => (
                    <option key={type}>{type}</option>
                  ))}
                </select>
              </Field>
              <Field label="Subject" required error={errors.subject} id="contact-subject">
                <input
                  id="contact-subject"
                  placeholder="What would you like to discuss?"
                  value={values.subject}
                  aria-invalid={Boolean(errors.subject)}
                  onChange={(event) => update("subject", event.target.value)}
                />
              </Field>
              <Field label="Message" required error={errors.message} id="contact-message">
                <textarea
                  id="contact-message"
                  rows={6}
                  maxLength={5000}
                  placeholder="Tell us a little more about your inquiry..."
                  value={values.message}
                  aria-invalid={Boolean(errors.message)}
                  onChange={(event) => update("message", event.target.value)}
                />
              </Field>
              <label className={styles.checkLabel}>
                <input
                  id="contact-consent"
                  type="checkbox"
                  checked={values.consent}
                  aria-invalid={Boolean(errors.consent)}
                  onChange={(event) => update("consent", event.target.checked)}
                />
                <span>I understand that PalDev Technologies will use the information provided to respond to my inquiry.</span>
              </label>
              {errors.consent ? (
                <p className={styles.error} role="alert">
                  {errors.consent}
                </p>
              ) : null}
              <div className={styles.honey} aria-hidden="true">
                <label>
                  Website
                  <input
                    tabIndex={-1}
                    autoComplete="off"
                    value={values.website}
                    onChange={(event) => update("website", event.target.value)}
                  />
                </label>
              </div>
              <button className={styles.primary} type="submit" disabled={submitting}>
                {submitting ? "Sending..." : "Send Message"}
                {submitting ? null : <Arrow />}
              </button>
            </form>
          )}
        </div>
      </div>
    </section>
  );
}

function Field({
  id,
  label,
  required,
  error,
  children,
}: {
  id: string;
  label: string;
  required?: boolean;
  error?: string;
  children: ReactNode;
}) {
  const errorId = `${id}-error`;
  return (
    <div className={styles.field}>
      <label htmlFor={id}>
        {label}
        {required ? <span aria-hidden="true"> *</span> : null}
        {required ? <span className={styles.srOnly}> required</span> : null}
      </label>
      {children}
      {error ? (
        <p id={errorId} className={styles.error} role="alert">
          {error}
        </p>
      ) : null}
    </div>
  );
}

function focusField(field: string | undefined) {
  const ids: Record<string, string> = {
    fullName: "contact-name",
    email: "contact-email",
    phone: "contact-phone",
    inquiryType: "contact-type",
    subject: "contact-subject",
    message: "contact-message",
    consent: "contact-consent",
  };
  if (!field) return;
  document.getElementById(ids[field] ?? field)?.focus();
}

function formatSubmitted(iso: string) {
  const match = /^(\d{4})-(\d{2})-(\d{2})/.exec(iso);
  if (!match) return iso;
  const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
  return `${months[Number(match[2]) - 1]} ${Number(match[3])}, ${match[1]}`;
}

function Arrow() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
      <path d="M5 12h14M13 6l6 6-6 6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
