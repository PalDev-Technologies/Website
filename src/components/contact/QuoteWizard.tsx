"use client";

import Link from "next/link";
import { useRef, useState, type ReactNode } from "react";
import {
  budgets,
  contactMethods,
  emptyConditional,
  features,
  languages,
  platforms,
  priorities,
  projectStatuses,
  projectTypes,
  readinessOptions,
  targetUsers,
  timelines,
  yesNo,
  type ConditionalAnswers,
  type FieldErrors,
  type QuoteInput,
} from "@/lib/inquiries/model";
import { applicableConditional, quoteStepForField, validateQuote, validateQuoteStep } from "@/lib/inquiries/validate";
import styles from "./contact.module.css";

const steps = [
  { label: "Project Basics", hint: "Tell us what you have in mind and what you want your project to achieve." },
  { label: "Technical Requirements", hint: "Select the features and platforms you think your project may need." },
  { label: "Budget & Timeline", hint: "A few planning details help us understand your priorities." },
  { label: "Contact Details", hint: "Share your contact details so we can follow up about your project." },
  { label: "Review & Submit", hint: "Please review your information before sending your request." },
];

const continueLabels = [
  "Continue to Technical Requirements",
  "Continue to Budget & Timeline",
  "Continue to Contact Details",
  "Review Request",
  "Submit Project Request",
];

export function QuoteWizard() {
  const [draft, setDraft] = useState<QuoteInput>(() => ({
    projectName: "",
    projectTypes: [],
    otherProjectType: "",
    projectStatus: "",
    description: "",
    targetUsers: [],
    platforms: [],
    features: [],
    existingSystem: "",
    existingSystemUrl: "",
    existingImprovements: "",
    integrationsNeeded: "",
    integrationsDetail: "",
    technologyPreference: "",
    recommendTechnology: false,
    additionalTechnical: "",
    conditional: emptyConditional(),
    budget: "",
    timeline: "",
    readiness: "",
    priorities: [],
    planningNotes: "",
    fullName: "",
    company: "",
    email: "",
    phone: "",
    country: "",
    contactMethod: "Email",
    language: "English",
    additionalMessage: "",
    consent: false,
    website: "",
    idempotencyKey: "",
  }));
  const [step, setStep] = useState(0);
  const [errors, setErrors] = useState<FieldErrors>({});
  const [submitting, setSubmitting] = useState(false);
  const [failure, setFailure] = useState("");
  const [success, setSuccess] = useState<{ reference: string; submittedAt: string } | null>(null);
  const key = useRef<string | null>(null);
  const phoneRequired = draft.contactMethod === "Phone Call" || draft.contactMethod === "WhatsApp";

  function payload(): QuoteInput {
    if (key.current == null) key.current = crypto.randomUUID().replaceAll("-", "");
    return { ...draft, idempotencyKey: key.current };
  }

  function patch(partial: Partial<QuoteInput>) {
    setDraft((current) => ({ ...current, ...partial }));
  }

  function toggle(list: string[], value: string) {
    return list.includes(value) ? list.filter((item) => item !== value) : [...list, value];
  }

  function toggleProjectType(value: string) {
    setDraft((current) => {
      const selected = toggle(current.projectTypes, value);
      const conditional = { ...current.conditional };
      const blank = emptyConditional();
      if (!selected.includes("E-Commerce Platform")) conditional.ecommerce = blank.ecommerce;
      if (!selected.includes("Mobile Application")) conditional.mobile = blank.mobile;
      if (!selected.includes("Booking & Reservation System")) conditional.booking = blank.booking;
      if (!selected.includes("AI & Data Solution")) conditional.ai = blank.ai;
      if (!selected.includes("Business Management System")) conditional.business = blank.business;
      return {
        ...current,
        projectTypes: selected,
        conditional,
        otherProjectType: selected.includes("Other") ? current.otherProjectType : "",
      };
    });
  }

  function patchConditional<K extends keyof ConditionalAnswers>(group: K, partial: Partial<ConditionalAnswers[K]>) {
    setDraft((current) => ({
      ...current,
      conditional: { ...current.conditional, [group]: { ...current.conditional[group], ...partial } },
    }));
  }

  function showErrors(nextErrors: FieldErrors) {
    setErrors(nextErrors);
    const first = Object.keys(nextErrors)[0];
    if (!first) return;
    const target = document.getElementById(fieldId(first));
    target?.focus();
  }

  function continueStep() {
    const nextErrors = validateQuoteStep(payload(), step);
    if (Object.keys(nextErrors).length > 0) {
      showErrors(nextErrors);
      return;
    }
    setErrors({});
    setStep((current) => Math.min(current + 1, steps.length - 1));
  }

  async function submit() {
    if (submitting) return;
    const nextErrors = validateQuote(payload());
    if (Object.keys(nextErrors).length > 0) {
      setStep(quoteStepForField(Object.keys(nextErrors)[0]));
      showErrors(nextErrors);
      return;
    }
    setSubmitting(true);
    setFailure("");
    try {
      const response = await fetch("/api/quotes", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(payload()),
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
          setStep(quoteStepForField(Object.keys(data.errors)[0]));
          showErrors(data.errors);
        } else {
          setFailure(data.message || "We couldn't save your project request. Please try again.");
        }
        return;
      }
      setSuccess({ reference: data.reference, submittedAt: data.submittedAt });
    } catch {
      setFailure("We couldn't save your project request. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  if (success) {
    return (
      <section id="technical-quote" className={`${styles.section} ${styles.sectionWhite}`}>
        <span id="quote" className={styles.hashAnchor} />
        <div className={`${styles.inner} ${styles.wizard}`}>
          <div className={styles.success} role="status">
            <span className={styles.check} aria-hidden="true">
              ✓
            </span>
            <h2>Your Project Request Has Been Received.</h2>
            <p>Thank you for sharing your project details. Our team will review your request and contact you to discuss the next steps.</p>
            <p className={styles.reference}>
              Reference <strong>{success.reference}</strong>
            </p>
            <p className={styles.metaLine}>Submitted {formatSubmitted(success.submittedAt)}</p>
            <ol className={styles.nextList}>
              <li>We review the requirements you shared.</li>
              <li>We contact you if any details need clarification.</li>
              <li>We discuss a suitable next step for the project.</li>
            </ol>
            <div className={styles.actions}>
              <Link className={styles.secondaryDark} href="/">
                Back to Homepage
              </Link>
              <Link className={styles.primary} href="/services">
                Explore Our Services
              </Link>
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="technical-quote" className={`${styles.section} ${styles.sectionWhite}`} aria-labelledby="quote-title">
      <span id="quote" className={styles.hashAnchor} />
      <div className={styles.inner}>
        <header className={styles.sectionHead}>
          <p className={styles.eyebrow}>Start Your Project</p>
          <h2 id="quote-title">Tell Us What You&apos;re Building.</h2>
          <p>
            Share a few details about your idea, requirements, and goals. We&apos;ll use this information to
            better understand your project and discuss the next steps.
          </p>
        </header>
        <div className={styles.wizard}>
          <div className={styles.progress} aria-label={`Step ${step + 1} of ${steps.length}`}>
            <p className={styles.compactProgress}>
              Step {step + 1} of {steps.length}
              <strong>{steps[step].label}</strong>
            </p>
            <ol className={styles.stepper}>
              {steps.map((item, index) => (
                <li key={item.label} className={index === step ? styles.stepOn : index < step ? styles.stepDone : undefined}>
                  <span>{String(index + 1).padStart(2, "0")}</span>
                  {item.label}
                </li>
              ))}
            </ol>
            <div className={styles.bar} aria-hidden="true">
              <span style={{ width: `${(step / (steps.length - 1)) * 100}%` }} />
            </div>
          </div>
          <div className={styles.wizardBody}>
            <h3>{step === 0 ? "Let's Understand Your Project." : step === 1 ? "Let's Explore the Technical Details." : step === 2 ? "Let's Align on Expectations." : step === 3 ? "How Can We Reach You?" : "Review Your Project Request."}</h3>
            <p className={styles.stepHint}>{steps[step].hint}</p>
            {Object.keys(errors).length > 0 ? (
              <p className={styles.formError} role="alert">
                Please correct the highlighted fields before continuing.
              </p>
            ) : null}
            {failure ? (
              <p className={styles.formError} role="alert">
                {failure}
              </p>
            ) : null}
            {step === 0 ? (
              <Basics
                draft={draft}
                errors={errors}
                onPatch={patch}
                onToggleType={toggleProjectType}
                onToggleUsers={(value) => patch({ targetUsers: toggle(draft.targetUsers, value) })}
              />
            ) : null}
            {step === 1 ? (
              <Technical
                draft={draft}
                errors={errors}
                onPatch={patch}
                onTogglePlatform={(value) => patch({ platforms: toggle(draft.platforms, value) })}
                onToggleFeature={(value) => patch({ features: toggle(draft.features, value) })}
                onConditional={patchConditional}
              />
            ) : null}
            {step === 2 ? (
              <Planning
                draft={draft}
                errors={errors}
                onPatch={patch}
                onTogglePriority={(value) => patch({ priorities: toggle(draft.priorities, value) })}
              />
            ) : null}
            {step === 3 ? <ContactStep draft={draft} errors={errors} phoneRequired={phoneRequired} onPatch={patch} /> : null}
            {step === 4 ? <Review draft={draft} onEdit={setStep} /> : null}
            <div className={styles.honey} aria-hidden="true">
              <label>
                Website
                <input tabIndex={-1} autoComplete="off" value={draft.website} onChange={(event) => patch({ website: event.target.value })} />
              </label>
            </div>
            <div className={styles.wizardActions}>
              {step > 0 ? (
                <button className={styles.secondaryDark} type="button" onClick={() => setStep((current) => current - 1)}>
                  Back
                </button>
              ) : (
                <span />
              )}
              {step < 4 ? (
                <button className={styles.primary} type="button" onClick={continueStep}>
                  {continueLabels[step]}
                  <Arrow />
                </button>
              ) : (
                <button className={styles.primary} type="button" onClick={submit} disabled={submitting}>
                  {submitting ? "Submitting Your Request..." : "Submit Project Request"}
                  {submitting ? null : <Arrow />}
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function Basics({
  draft,
  errors,
  onPatch,
  onToggleType,
  onToggleUsers,
}: {
  draft: QuoteInput;
  errors: FieldErrors;
  onPatch: (partial: Partial<QuoteInput>) => void;
  onToggleType: (value: string) => void;
  onToggleUsers: (value: string) => void;
}) {
  return (
    <>
      <Field id="quote-project-name" label="Project name">
        <input id="quote-project-name" placeholder="e.g. Customer Management Platform" value={draft.projectName} onChange={(event) => onPatch({ projectName: event.target.value })} />
      </Field>
      <fieldset id="quote-project-types" className={styles.choiceSet} tabIndex={-1}>
        <legend>
          Project type <span aria-hidden="true">*</span>
        </legend>
        <div className={styles.choiceGrid}>
          {projectTypes.map((type) => (
            <Choice
              key={type}
              checked={draft.projectTypes.includes(type)}
              onChange={() => onToggleType(type)}
              label={type}
              icon={projectTypeIcon(type)}
            />
          ))}
        </div>
        {errors.projectTypes ? <p className={styles.error} role="alert">{errors.projectTypes}</p> : null}
      </fieldset>
      {draft.projectTypes.includes("Other") ? (
        <Field id="quote-other-type" label="Other project type">
          <input id="quote-other-type" value={draft.otherProjectType} onChange={(event) => onPatch({ otherProjectType: event.target.value })} />
        </Field>
      ) : null}
      <fieldset id="quote-project-status" className={styles.choiceSet} tabIndex={-1}>
        <legend>
          Project status <span aria-hidden="true">*</span>
        </legend>
        <div className={styles.choiceGrid}>
          {projectStatuses.map((status) => (
            <Choice key={status} type="radio" name="project-status" checked={draft.projectStatus === status} onChange={() => onPatch({ projectStatus: status })} label={status} />
          ))}
        </div>
        {errors.projectStatus ? <p className={styles.error} role="alert">{errors.projectStatus}</p> : null}
      </fieldset>
      <Field id="quote-description" label="Project description" required error={errors.description}>
        <textarea id="quote-description" rows={6} maxLength={5000} placeholder="Describe your project idea, the business problem you want to solve, and what you would like the system to accomplish." value={draft.description} aria-invalid={Boolean(errors.description)} onChange={(event) => onPatch({ description: event.target.value })} />
      </Field>
      <fieldset className={styles.choiceSet}>
        <legend>Target users</legend>
        <div className={styles.choiceGrid}>
          {targetUsers.map((user) => (
            <Choice key={user} checked={draft.targetUsers.includes(user)} onChange={() => onToggleUsers(user)} label={user} />
          ))}
        </div>
      </fieldset>
    </>
  );
}

function Technical({
  draft,
  errors,
  onPatch,
  onTogglePlatform,
  onToggleFeature,
  onConditional,
}: {
  draft: QuoteInput;
  errors: FieldErrors;
  onPatch: (partial: Partial<QuoteInput>) => void;
  onTogglePlatform: (value: string) => void;
  onToggleFeature: (value: string) => void;
  onConditional: <K extends keyof ConditionalAnswers>(group: K, partial: Partial<ConditionalAnswers[K]>) => void;
}) {
  return (
    <>
      <p className={styles.help}>You don&apos;t need to know all the technical answers. We can help you determine the right approach.</p>
      <fieldset className={styles.choiceSet}>
        <legend>Platforms</legend>
        <div className={styles.choiceGrid}>
          {platforms.map((item) => (
            <Choice key={item} checked={draft.platforms.includes(item)} onChange={() => onTogglePlatform(item)} label={item} />
          ))}
        </div>
      </fieldset>
      <fieldset className={styles.choiceSet}>
        <legend>Features</legend>
        <div className={styles.choiceGrid}>
          {features.map((item) => (
            <Choice key={item} checked={draft.features.includes(item)} onChange={() => onToggleFeature(item)} label={item} />
          ))}
        </div>
      </fieldset>
      <Tri label="Do you already have an existing website or system?" name="existing" value={draft.existingSystem} onChange={(value) => onPatch({ existingSystem: value, existingSystemUrl: value === "Yes" ? draft.existingSystemUrl : "", existingImprovements: value === "Yes" ? draft.existingImprovements : "" })} />
      {draft.existingSystem === "Yes" ? (
        <>
          <Field id="quote-existing-url" label="Existing system URL" error={errors.existingSystemUrl}>
            <input id="quote-existing-url" inputMode="url" placeholder="https://" value={draft.existingSystemUrl} aria-invalid={Boolean(errors.existingSystemUrl)} onChange={(event) => onPatch({ existingSystemUrl: event.target.value })} />
          </Field>
          <Field id="quote-existing-notes" label="What would you like to improve?">
            <textarea id="quote-existing-notes" rows={4} value={draft.existingImprovements} onChange={(event) => onPatch({ existingImprovements: event.target.value })} />
          </Field>
        </>
      ) : null}
      <Tri label="Will your project need to connect with other platforms or services?" name="integrations" value={draft.integrationsNeeded} onChange={(value) => onPatch({ integrationsNeeded: value, integrationsDetail: value === "Yes" ? draft.integrationsDetail : "" })} />
      {draft.integrationsNeeded === "Yes" ? (
        <Field id="quote-integrations" label="Which systems or services need integration?">
          <textarea id="quote-integrations" rows={4} placeholder="Payment gateways, accounting software, ERP, CRM, shipping providers, external APIs." value={draft.integrationsDetail} onChange={(event) => onPatch({ integrationsDetail: event.target.value })} />
        </Field>
      ) : null}
      <Field id="quote-technology" label="Technology preference">
        <input id="quote-technology" placeholder="Any preferred programming languages, frameworks, hosting providers, or platforms?" value={draft.technologyPreference} disabled={draft.recommendTechnology} onChange={(event) => onPatch({ technologyPreference: event.target.value })} />
      </Field>
      <label className={styles.checkLabel}>
        <input type="checkbox" checked={draft.recommendTechnology} onChange={(event) => onPatch({ recommendTechnology: event.target.checked, technologyPreference: event.target.checked ? "" : draft.technologyPreference })} />
        <span>I would like PalDev to recommend the technology.</span>
      </label>
      <Field id="quote-technical-notes" label="Additional technical requirements">
        <textarea id="quote-technical-notes" rows={4} placeholder="Share any security, performance, hosting, scalability, or other technical requirements." value={draft.additionalTechnical} onChange={(event) => onPatch({ additionalTechnical: event.target.value })} />
      </Field>
      <ConditionalFields draft={draft} errors={errors} onConditional={onConditional} />
    </>
  );
}

function ConditionalFields({
  draft,
  errors,
  onConditional,
}: {
  draft: QuoteInput;
  errors: FieldErrors;
  onConditional: <K extends keyof ConditionalAnswers>(group: K, partial: Partial<ConditionalAnswers[K]>) => void;
}) {
  const selected = new Set(draft.projectTypes);
  if (![...selected].some((type) => ["E-Commerce Platform", "Mobile Application", "Booking & Reservation System", "AI & Data Solution", "Business Management System"].includes(type))) {
    return null;
  }
  return (
    <div className={styles.conditional}>
      <h4>A few optional details</h4>
      {selected.has("E-Commerce Platform") ? (
        <div>
          <p className={styles.groupLabel}>E-commerce</p>
          <Field id="quote-products" label="Approximate number of products">
            <input id="quote-products" value={draft.conditional.ecommerce.productCount} onChange={(event) => onConditional("ecommerce", { productCount: event.target.value })} />
          </Field>
          <Field id="quote-payments" label="Payment methods needed">
            <input id="quote-payments" value={draft.conditional.ecommerce.paymentMethods} onChange={(event) => onConditional("ecommerce", { paymentMethods: event.target.value })} />
          </Field>
          <Tri label="Inventory management needed?" name="inventory" value={draft.conditional.ecommerce.inventory} onChange={(value) => onConditional("ecommerce", { inventory: value })} />
          <Tri label="Delivery or shipping integration needed?" name="shipping" value={draft.conditional.ecommerce.shipping} onChange={(value) => onConditional("ecommerce", { shipping: value })} />
          <Tri label="Multilingual storefront needed?" name="storefront" value={draft.conditional.ecommerce.multilingual} onChange={(value) => onConditional("ecommerce", { multilingual: value })} />
        </div>
      ) : null}
      {selected.has("Mobile Application") ? (
        <div>
          <p className={styles.groupLabel}>Mobile application</p>
          <fieldset className={styles.choiceSet}>
            <legend>iOS, Android, or both?</legend>
            <div className={styles.choiceGrid}>
              {["iOS", "Android", "Both"].map((target) => (
                <Choice key={target} checked={draft.conditional.mobile.targets.includes(target)} onChange={() => onConditional("mobile", { targets: draft.conditional.mobile.targets.includes(target) ? draft.conditional.mobile.targets.filter((item) => item !== target) : [...draft.conditional.mobile.targets, target] })} label={target} />
              ))}
            </div>
          </fieldset>
          <Tri label="Does the app need user accounts?" name="accounts" value={draft.conditional.mobile.accounts} onChange={(value) => onConditional("mobile", { accounts: value })} />
          <Tri label="Push notifications needed?" name="push" value={draft.conditional.mobile.pushNotifications} onChange={(value) => onConditional("mobile", { pushNotifications: value })} />
          <Tri label="Existing backend available?" name="backend" value={draft.conditional.mobile.existingBackend} onChange={(value) => onConditional("mobile", { existingBackend: value })} />
        </div>
      ) : null}
      {selected.has("Booking & Reservation System") ? (
        <div>
          <p className={styles.groupLabel}>Booking system</p>
          <Field id="quote-booking-type" label="Appointment or reservation type">
            <input id="quote-booking-type" value={draft.conditional.booking.reservationType} onChange={(event) => onConditional("booking", { reservationType: event.target.value })} />
          </Field>
          <Field id="quote-locations" label="Number of locations">
            <input id="quote-locations" value={draft.conditional.booking.locations} onChange={(event) => onConditional("booking", { locations: event.target.value })} />
          </Field>
          <Tri label="Online payments required?" name="booking-pay" value={draft.conditional.booking.payments} onChange={(value) => onConditional("booking", { payments: value })} />
          <Tri label="Staff or resource scheduling needed?" name="booking-staff" value={draft.conditional.booking.scheduling} onChange={(value) => onConditional("booking", { scheduling: value })} />
          <Tri label="Automated reminders needed?" name="booking-reminders" value={draft.conditional.booking.reminders} onChange={(value) => onConditional("booking", { reminders: value })} />
        </div>
      ) : null}
      {selected.has("AI & Data Solution") ? (
        <div>
          <p className={styles.groupLabel}>AI and data</p>
          <Field id="quote-ai-case" label="Main business use case">
            <textarea id="quote-ai-case" rows={3} value={draft.conditional.ai.useCase} onChange={(event) => onConditional("ai", { useCase: event.target.value })} />
          </Field>
          <Tri label="Data sources available?" name="ai-data" value={draft.conditional.ai.dataSources} onChange={(value) => onConditional("ai", { dataSources: value })} />
          <fieldset className={styles.choiceSet}>
            <legend>Reporting or automation focus?</legend>
            <div className={styles.choiceGrid}>
              {["Reporting", "Automation", "Both", "Not Sure"].map((focus) => (
                <Choice key={focus} type="radio" name="ai-focus" checked={draft.conditional.ai.focus === focus} onChange={() => onConditional("ai", { focus })} label={focus} />
              ))}
            </div>
            {errors.aiFocus ? <p className={styles.error}>{errors.aiFocus}</p> : null}
          </fieldset>
          <Tri label="Existing datasets available?" name="ai-sets" value={draft.conditional.ai.datasets} onChange={(value) => onConditional("ai", { datasets: value })} />
        </div>
      ) : null}
      {selected.has("Business Management System") ? (
        <div>
          <p className={styles.groupLabel}>Business management</p>
          <Field id="quote-departments" label="Departments involved">
            <input id="quote-departments" value={draft.conditional.business.departments} onChange={(event) => onConditional("business", { departments: event.target.value })} />
          </Field>
          <Field id="quote-users" label="Approximate number of users">
            <input id="quote-users" value={draft.conditional.business.users} onChange={(event) => onConditional("business", { users: event.target.value })} />
          </Field>
          <Field id="quote-workflows" label="Main workflows to manage">
            <textarea id="quote-workflows" rows={3} value={draft.conditional.business.workflows} onChange={(event) => onConditional("business", { workflows: event.target.value })} />
          </Field>
          <Field id="quote-business-integrations" label="Existing system integrations">
            <textarea id="quote-business-integrations" rows={3} value={draft.conditional.business.integrations} onChange={(event) => onConditional("business", { integrations: event.target.value })} />
          </Field>
        </div>
      ) : null}
    </div>
  );
}

function Planning({
  draft,
  errors,
  onPatch,
  onTogglePriority,
}: {
  draft: QuoteInput;
  errors: FieldErrors;
  onPatch: (partial: Partial<QuoteInput>) => void;
  onTogglePriority: (value: string) => void;
}) {
  return (
    <>
      <fieldset className={styles.choiceSet}>
        <legend>Budget in USD</legend>
        <p className={styles.help}>Your selection is only an indication of your expected budget. It does not represent a final quotation or fixed project price.</p>
        <div className={styles.choiceGrid}>
          {budgets.map((budget) => (
            <Choice key={budget} type="radio" name="budget" checked={draft.budget === budget} onChange={() => onPatch({ budget })} label={budget} />
          ))}
        </div>
        {errors.budget ? <p className={styles.error}>{errors.budget}</p> : null}
      </fieldset>
      <fieldset className={styles.choiceSet}>
        <legend>Expected timeline</legend>
        <div className={styles.choiceGrid}>
          {timelines.map((timeline) => (
            <Choice key={timeline} type="radio" name="timeline" checked={draft.timeline === timeline} onChange={() => onPatch({ timeline })} label={timeline} />
          ))}
        </div>
      </fieldset>
      <fieldset className={styles.choiceSet}>
        <legend>Project readiness</legend>
        <div className={styles.choiceGrid}>
          {readinessOptions.map((item) => (
            <Choice key={item} type="radio" name="readiness" checked={draft.readiness === item} onChange={() => onPatch({ readiness: item })} label={item} />
          ))}
        </div>
      </fieldset>
      <fieldset className={styles.choiceSet}>
        <legend>Priorities</legend>
        <div className={styles.choiceGrid}>
          {priorities.map((item) => (
            <Choice key={item} checked={draft.priorities.includes(item)} onChange={() => onTogglePriority(item)} label={item} />
          ))}
        </div>
      </fieldset>
      <Field id="quote-planning-notes" label="Additional notes">
        <textarea id="quote-planning-notes" rows={4} placeholder="Anything else we should know about your budget, schedule, or priorities?" value={draft.planningNotes} onChange={(event) => onPatch({ planningNotes: event.target.value })} />
      </Field>
    </>
  );
}

function ContactStep({
  draft,
  errors,
  phoneRequired,
  onPatch,
}: {
  draft: QuoteInput;
  errors: FieldErrors;
  phoneRequired: boolean;
  onPatch: (partial: Partial<QuoteInput>) => void;
}) {
  return (
    <>
      <Field id="quote-name" label="Full name" required error={errors.fullName}>
        <input id="quote-name" autoComplete="name" value={draft.fullName} aria-invalid={Boolean(errors.fullName)} onChange={(event) => onPatch({ fullName: event.target.value })} />
      </Field>
      <Field id="quote-company" label="Company / organization">
        <input id="quote-company" autoComplete="organization" value={draft.company} onChange={(event) => onPatch({ company: event.target.value })} />
      </Field>
      <div className={styles.fieldRow}>
        <Field id="quote-email" label="Work email" required error={errors.email}>
          <input id="quote-email" type="email" autoComplete="email" value={draft.email} aria-invalid={Boolean(errors.email)} onChange={(event) => onPatch({ email: event.target.value })} />
        </Field>
        <Field id="quote-phone" label="Phone / WhatsApp" required={phoneRequired} error={errors.phone}>
          <input id="quote-phone" type="tel" autoComplete="tel" value={draft.phone} aria-invalid={Boolean(errors.phone)} onChange={(event) => onPatch({ phone: event.target.value })} />
        </Field>
      </div>
      <Field id="quote-country" label="Country">
        <input id="quote-country" autoComplete="country-name" value={draft.country} onChange={(event) => onPatch({ country: event.target.value })} />
      </Field>
      <fieldset className={styles.choiceSet}>
        <legend>Preferred contact method</legend>
        <div className={styles.choiceGrid}>
          {contactMethods.map((method) => (
            <Choice key={method} type="radio" name="contact-method" checked={draft.contactMethod === method} onChange={() => onPatch({ contactMethod: method })} label={method} />
          ))}
        </div>
        {errors.contactMethod ? <p className={styles.error}>{errors.contactMethod}</p> : null}
      </fieldset>
      <Field id="quote-language" label="Preferred language" error={errors.language}>
        <select id="quote-language" value={draft.language} onChange={(event) => onPatch({ language: event.target.value })}>
          {languages.map((language) => (
            <option key={language}>{language}</option>
          ))}
        </select>
      </Field>
      <Field id="quote-extra" label="Additional message">
        <textarea id="quote-extra" rows={4} value={draft.additionalMessage} onChange={(event) => onPatch({ additionalMessage: event.target.value })} />
      </Field>
      <label className={styles.checkLabel}>
        <input id="quote-consent" type="checkbox" checked={draft.consent} aria-invalid={Boolean(errors.consent)} onChange={(event) => onPatch({ consent: event.target.checked })} />
        <span>I understand that PalDev Technologies will use the information provided to review my project inquiry and contact me regarding it.</span>
      </label>
      {errors.consent ? <p className={styles.error} role="alert">{errors.consent}</p> : null}
    </>
  );
}

function Review({ draft, onEdit }: { draft: QuoteInput; onEdit: (step: number) => void }) {
  const conditional = applicableConditional(draft);
  return (
    <div className={styles.review}>
      <ReviewGroup title="Project overview" onEdit={() => onEdit(0)}>
        <Item label="Project name" value={draft.projectName} />
        <Item label="Project types" value={join(draft.projectTypes)} />
        <Item label="Other type" value={draft.otherProjectType} />
        <Item label="Project status" value={draft.projectStatus} />
        <Item label="Description" value={draft.description} />
        <Item label="Target users" value={join(draft.targetUsers)} />
      </ReviewGroup>
      <ReviewGroup title="Technical requirements" onEdit={() => onEdit(1)}>
        <Item label="Platforms" value={join(draft.platforms)} />
        <Item label="Features" value={join(draft.features)} />
        <Item label="Existing system" value={draft.existingSystem} />
        <Item label="Existing URL" value={draft.existingSystemUrl} />
        <Item label="Improvements" value={draft.existingImprovements} />
        <Item label="Integrations" value={draft.integrationsNeeded} />
        <Item label="Integration detail" value={draft.integrationsDetail} />
        <Item label="Technology" value={draft.recommendTechnology ? "PalDev should recommend the technology." : draft.technologyPreference} />
        <Item label="Technical notes" value={draft.additionalTechnical} />
        <Item label="Additional requirements" value={conditionalText(conditional)} />
      </ReviewGroup>
      <ReviewGroup title="Planning" onEdit={() => onEdit(2)}>
        <Item label="Budget" value={draft.budget} />
        <Item label="Timeline" value={draft.timeline} />
        <Item label="Readiness" value={draft.readiness} />
        <Item label="Priorities" value={join(draft.priorities)} />
        <Item label="Notes" value={draft.planningNotes} />
      </ReviewGroup>
      <ReviewGroup title="Contact" onEdit={() => onEdit(3)}>
        <Item label="Name" value={draft.fullName} />
        <Item label="Company" value={draft.company} />
        <Item label="Email" value={draft.email} />
        <Item label="Phone" value={draft.phone} />
        <Item label="Country" value={draft.country} />
        <Item label="Preferred contact" value={draft.contactMethod} />
        <Item label="Language" value={draft.language} />
        <Item label="Message" value={draft.additionalMessage} />
      </ReviewGroup>
    </div>
  );
}

function ReviewGroup({ title, onEdit, children }: { title: string; onEdit: () => void; children: ReactNode }) {
  return (
    <section className={styles.reviewGroup}>
      <div>
        <h4>{title}</h4>
        <button type="button" onClick={onEdit}>
          Edit
        </button>
      </div>
      <dl>{children}</dl>
    </section>
  );
}

function Item({ label, value }: { label: string; value: string }) {
  return (
    <>
      <dt>{label}</dt>
      <dd>{value.trim() ? value : "Not specified"}</dd>
    </>
  );
}

function conditionalText(value: ReturnType<typeof applicableConditional>) {
  const entries = Object.entries(value);
  if (entries.length === 0) return "";
  return entries
    .map(([group, answers]) => {
      const details = Object.entries(answers)
        .filter((entry) => (Array.isArray(entry[1]) ? entry[1].length > 0 : entry[1]))
        .map(([key, answer]) => `${key}: ${Array.isArray(answer) ? answer.join(", ") : answer}`);
      return details.length ? `${group} — ${details.join("; ")}` : "";
    })
    .filter(Boolean)
    .join("\n");
}

function join(values: string[]) {
  return values.join(", ");
}

function Tri({ label, name, value, onChange }: { label: string; name: string; value: string; onChange: (value: string) => void }) {
  return (
    <fieldset className={styles.choiceSet}>
      <legend>{label}</legend>
      <div className={styles.choiceGrid}>
        {yesNo.map((option) => (
          <Choice key={option} type="radio" name={name} checked={value === option} onChange={() => onChange(option)} label={option} />
        ))}
      </div>
    </fieldset>
  );
}

function Choice({
  checked,
  onChange,
  label,
  type = "checkbox",
  name,
  icon,
}: {
  checked: boolean;
  onChange: () => void;
  label: string;
  type?: "checkbox" | "radio";
  name?: string;
  icon?: string;
}) {
  return (
    <label className={checked ? styles.choiceOn : styles.choice}>
      <input type={type} name={name} checked={checked} onChange={onChange} />
      {icon ? (
        <svg className={styles.choiceIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" aria-hidden="true">
          <path d={icon} strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      ) : null}
      <span>{label}</span>
      {checked ? <span className={styles.choiceMark} aria-hidden="true">✓</span> : null}
    </label>
  );
}

function projectTypeIcon(type: string) {
  const icons: Record<string, string> = {
    "Custom Web Application": "M4 5h16v11H4zM8 20h8",
    "Corporate Website": "M4 7h16v12H4zM4 7l8 6 8-6",
    "E-Commerce Platform": "M6 7h12l-1 12H7zM9 7a3 3 0 0 1 6 0",
    "Mobile Application": "M9 3h6v18H9zM11 18h2",
    "Business Management System": "M4 18V6h6v12M14 18V10h6v8M4 18h16",
    "Booking & Reservation System": "M5 5h14v14H5zM5 9h14M9 3v4M15 3v4",
    "AI & Data Solution": "M12 4v4M12 16v4M4 12h4M16 12h4M7 7l2.5 2.5M14.5 14.5 17 17M17 7l-2.5 2.5M9.5 14.5 7 17",
    "Workflow Automation": "M5 7h6v4H5zM13 13h6v4h-6zM8 11v2h8",
    "API / System Integration": "M8 8H5v8h3M16 8h3v8h-3M10 12h4",
    "Technical Consulting": "M12 4a5 5 0 0 1 5 5c0 2.5-2 3.5-2 5h-6c0-1.5-2-2.5-2-5a5 5 0 0 1 5-5zM10 18h4",
    Other: "M12 5v14M5 12h14",
    "Not Sure Yet": "M12 17h.01M9.5 9a2.5 2.5 0 1 1 3.2 2.4c-.7.3-1.2.9-1.2 1.6V14",
  };
  return icons[type] ?? icons.Other;
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
  return (
    <div className={styles.field}>
      <label htmlFor={id}>
        {label}
        {required ? <span aria-hidden="true"> *</span> : null}
        {required ? <span className={styles.srOnly}> required</span> : null}
      </label>
      {children}
      {error ? (
        <p className={styles.error} role="alert">
          {error}
        </p>
      ) : null}
    </div>
  );
}

function fieldId(field: string) {
  const ids: Record<string, string> = {
    projectTypes: "quote-project-types",
    projectStatus: "quote-project-status",
    description: "quote-description",
    existingSystemUrl: "quote-existing-url",
    fullName: "quote-name",
    email: "quote-email",
    phone: "quote-phone",
    consent: "quote-consent",
    aiFocus: "quote-ai-case",
  };
  return ids[field] ?? field;
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
