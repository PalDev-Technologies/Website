import {
  budgets,
  contactMethods,
  features,
  inquiryTypes,
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
  type ContactInput,
  type FieldErrors,
  type QuoteInput,
} from "@/lib/inquiries/model";

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function cleanText(value: unknown, max: number) {
  if (typeof value !== "string") return "";
  return value.replace(/\u0000/g, "").replace(/\r\n/g, "\n").trim().slice(0, max);
}

function asBoolean(value: unknown) {
  return value === true;
}

function asStringList(value: unknown, allowed: readonly string[], max = 20) {
  if (!Array.isArray(value)) return [];
  const unique = new Set<string>();
  for (const item of value) {
    if (typeof item === "string" && allowed.includes(item)) unique.add(item);
    if (unique.size >= max) break;
  }
  return [...unique];
}

function phoneError(value: string, required: boolean) {
  if (!value) return required ? "Enter a phone number." : "";
  if (!/^[+()\d\s.-]{7,40}$/.test(value)) return "Enter a valid phone number.";
  const digits = value.replace(/\D/g, "");
  if (digits.length < 7 || digits.length > 15) return "Enter a valid phone number.";
  return "";
}

function emailError(value: string) {
  if (!value) return "Enter your email address.";
  if (value.length > 254 || !emailPattern.test(value)) return "Enter a valid email address.";
  return "";
}

export function normalizeContact(input: unknown): ContactInput {
  const source = isRecord(input) ? input : {};
  return {
    fullName: cleanText(source.fullName, 120),
    email: cleanText(source.email, 254),
    company: cleanText(source.company, 160),
    phone: cleanText(source.phone, 40),
    inquiryType: cleanText(source.inquiryType, 80),
    subject: cleanText(source.subject, 180),
    message: cleanText(source.message, 5000),
    consent: asBoolean(source.consent),
    website: cleanText(source.website, 200),
    idempotencyKey: cleanText(source.idempotencyKey, 80),
  };
}

export function validateContact(input: ContactInput): FieldErrors {
  const errors: FieldErrors = {};
  if (input.fullName.length < 2) errors.fullName = "Enter your full name.";
  const email = emailError(input.email);
  if (email) errors.email = email;
  const phone = phoneError(input.phone, false);
  if (phone) errors.phone = phone;
  if (!inquiryTypes.includes(input.inquiryType as (typeof inquiryTypes)[number])) {
    errors.inquiryType = "Choose an inquiry type.";
  }
  if (input.subject.length < 3) errors.subject = "Enter a subject.";
  if (input.message.length < 10) errors.message = "Enter a message of at least 10 characters.";
  if (!input.consent) errors.consent = "Please confirm how PalDev may use this information.";
  if (!/^[A-Za-z0-9_-]{8,80}$/.test(input.idempotencyKey)) errors.form = "The form could not be submitted. Refresh and try again.";
  return errors;
}

function tri(value: unknown) {
  const text = cleanText(value, 20);
  return yesNo.includes(text as (typeof yesNo)[number]) ? text : "";
}

export function normalizeQuote(input: unknown): QuoteInput {
  const source = isRecord(input) ? input : {};
  const conditional = isRecord(source.conditional) ? source.conditional : {};
  const ecommerce = isRecord(conditional.ecommerce) ? conditional.ecommerce : {};
  const mobile = isRecord(conditional.mobile) ? conditional.mobile : {};
  const booking = isRecord(conditional.booking) ? conditional.booking : {};
  const ai = isRecord(conditional.ai) ? conditional.ai : {};
  const business = isRecord(conditional.business) ? conditional.business : {};

  return {
    projectName: cleanText(source.projectName, 160),
    projectTypes: asStringList(source.projectTypes, projectTypes),
    otherProjectType: cleanText(source.otherProjectType, 160),
    projectStatus: cleanText(source.projectStatus, 80),
    description: cleanText(source.description, 5000),
    targetUsers: asStringList(source.targetUsers, targetUsers),
    platforms: asStringList(source.platforms, platforms),
    features: asStringList(source.features, features),
    existingSystem: tri(source.existingSystem),
    existingSystemUrl: cleanText(source.existingSystemUrl, 300),
    existingImprovements: cleanText(source.existingImprovements, 2000),
    integrationsNeeded: tri(source.integrationsNeeded),
    integrationsDetail: cleanText(source.integrationsDetail, 2000),
    technologyPreference: cleanText(source.technologyPreference, 300),
    recommendTechnology: asBoolean(source.recommendTechnology),
    additionalTechnical: cleanText(source.additionalTechnical, 3000),
    conditional: {
      ecommerce: {
        productCount: cleanText(ecommerce.productCount, 80),
        paymentMethods: cleanText(ecommerce.paymentMethods, 300),
        inventory: tri(ecommerce.inventory),
        shipping: tri(ecommerce.shipping),
        multilingual: tri(ecommerce.multilingual),
      },
      mobile: {
        targets: asStringList(mobile.targets, ["iOS", "Android", "Both"]),
        accounts: tri(mobile.accounts),
        pushNotifications: tri(mobile.pushNotifications),
        existingBackend: tri(mobile.existingBackend),
      },
      booking: {
        reservationType: cleanText(booking.reservationType, 200),
        locations: cleanText(booking.locations, 80),
        payments: tri(booking.payments),
        scheduling: tri(booking.scheduling),
        reminders: tri(booking.reminders),
      },
      ai: {
        useCase: cleanText(ai.useCase, 1000),
        dataSources: tri(ai.dataSources),
        focus: cleanText(ai.focus, 80),
        datasets: tri(ai.datasets),
      },
      business: {
        departments: cleanText(business.departments, 300),
        users: cleanText(business.users, 80),
        workflows: cleanText(business.workflows, 1000),
        integrations: cleanText(business.integrations, 1000),
      },
    },
    budget: cleanText(source.budget, 40),
    timeline: cleanText(source.timeline, 40),
    readiness: cleanText(source.readiness, 80),
    priorities: asStringList(source.priorities, priorities),
    planningNotes: cleanText(source.planningNotes, 2000),
    fullName: cleanText(source.fullName, 120),
    company: cleanText(source.company, 160),
    email: cleanText(source.email, 254),
    phone: cleanText(source.phone, 40),
    country: cleanText(source.country, 80),
    contactMethod: cleanText(source.contactMethod, 40),
    language: cleanText(source.language, 40),
    additionalMessage: cleanText(source.additionalMessage, 2000),
    consent: asBoolean(source.consent),
    website: cleanText(source.website, 200),
    idempotencyKey: cleanText(source.idempotencyKey, 80),
  };
}

export function applicableConditional(quote: QuoteInput): Partial<ConditionalAnswers> {
  const selected = new Set(quote.projectTypes);
  const result: Partial<ConditionalAnswers> = {};
  if (selected.has("E-Commerce Platform")) result.ecommerce = quote.conditional.ecommerce;
  if (selected.has("Mobile Application")) result.mobile = quote.conditional.mobile;
  if (selected.has("Booking & Reservation System")) result.booking = quote.conditional.booking;
  if (selected.has("AI & Data Solution")) result.ai = quote.conditional.ai;
  if (selected.has("Business Management System")) result.business = quote.conditional.business;
  return result;
}

export function validateQuote(input: QuoteInput): FieldErrors {
  const errors: FieldErrors = {};
  if (input.projectTypes.length === 0) errors.projectTypes = "Select at least one project type.";
  if (!projectStatuses.includes(input.projectStatus as (typeof projectStatuses)[number])) {
    errors.projectStatus = "Select the project status.";
  }
  if (input.description.length < 10) errors.description = "Describe the project in at least 10 characters.";
  if (input.budget && !budgets.includes(input.budget as (typeof budgets)[number])) errors.budget = "Choose a budget option.";
  if (input.timeline && !timelines.includes(input.timeline as (typeof timelines)[number])) {
    errors.timeline = "Choose a timeline.";
  }
  if (input.readiness && !readinessOptions.includes(input.readiness as (typeof readinessOptions)[number])) {
    errors.readiness = "Choose a readiness option.";
  }
  if (input.fullName.length < 2) errors.fullName = "Enter your full name.";
  const email = emailError(input.email);
  if (email) errors.email = email;
  const phoneRequired = input.contactMethod === "Phone Call" || input.contactMethod === "WhatsApp";
  const phone = phoneError(input.phone, phoneRequired);
  if (phone) errors.phone = phone;
  if (!contactMethods.includes(input.contactMethod as (typeof contactMethods)[number])) {
    errors.contactMethod = "Choose how PalDev should contact you.";
  }
  if (input.language && !languages.includes(input.language as (typeof languages)[number])) {
    errors.language = "Choose a language.";
  }
  if (input.existingSystem === "Yes" && input.existingSystemUrl && !/^https?:\/\/\S+$/i.test(input.existingSystemUrl)) {
    errors.existingSystemUrl = "Enter a full URL starting with http:// or https://.";
  }
  const focus = input.conditional.ai.focus;
  if (focus && !["Reporting", "Automation", "Both", "Not Sure"].includes(focus)) {
    errors.aiFocus = "Choose a reporting or automation focus.";
  }
  if (!input.consent) errors.consent = "Please confirm how PalDev may use this information.";
  if (!/^[A-Za-z0-9_-]{8,80}$/.test(input.idempotencyKey)) errors.form = "The form could not be submitted. Refresh and try again.";
  return errors;
}

export function quoteStepForField(field: string) {
  if (["projectTypes", "projectStatus", "description", "projectName", "targetUsers", "otherProjectType"].includes(field)) {
    return 0;
  }
  if (
    [
      "platforms",
      "features",
      "existingSystem",
      "existingSystemUrl",
      "existingImprovements",
      "integrationsNeeded",
      "integrationsDetail",
      "technologyPreference",
      "additionalTechnical",
      "aiFocus",
    ].includes(field)
  ) {
    return 1;
  }
  if (["budget", "timeline", "readiness", "priorities", "planningNotes"].includes(field)) return 2;
  return 3;
}

export function validateQuoteStep(input: QuoteInput, step: number): FieldErrors {
  const errors = validateQuote(input);
  return Object.fromEntries(Object.entries(errors).filter(([field]) => quoteStepForField(field) === step));
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}
