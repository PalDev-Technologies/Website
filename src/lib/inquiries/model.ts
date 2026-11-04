/**
 * Inquiry configuration.
 *
 * Email delivery is optional. Set these environment variables to send notifications:
 * - PALDEV_NOTIFY_TO: inbox that should receive inquiry emails
 * - PALDEV_NOTIFY_FROM: from address, when a provider is configured
 * - PALDEV_NOTIFY_WEBHOOK: https URL that receives the notification JSON
 *
 * Submissions are stored even when email is not configured.
 * There is no public privacy-policy page, so consent checkboxes do not link to one.
 */

export const inquiryTypes = [
  "General Inquiry",
  "Business Partnership",
  "Technical Consultation",
  "Existing Project Support",
  "Other",
] as const;

export const projectTypes = [
  "Custom Web Application",
  "Corporate Website",
  "E-Commerce Platform",
  "Mobile Application",
  "Business Management System",
  "Booking & Reservation System",
  "AI & Data Solution",
  "Workflow Automation",
  "API / System Integration",
  "Technical Consulting",
  "Other",
  "Not Sure Yet",
] as const;

export const projectStatuses = [
  "New Project",
  "Existing Project Enhancement",
  "Redesign / Modernization",
  "Not Sure Yet",
] as const;

export const targetUsers = [
  "Customers",
  "Employees",
  "Administrators",
  "Business Partners",
  "General Public",
  "Other",
  "Not Sure Yet",
] as const;

export const platforms = [
  "Web Application",
  "iOS",
  "Android",
  "Desktop Application",
  "Internal Business System",
  "Not Sure Yet",
] as const;

export const features = [
  "User Accounts & Login",
  "Admin Dashboard",
  "User Roles & Permissions",
  "Online Payments",
  "Product & Inventory Management",
  "Booking & Scheduling",
  "Email / SMS Notifications",
  "Push Notifications",
  "Reporting & Analytics",
  "Multilingual Support",
  "API Integrations",
  "AI-Assisted Features",
  "Document Management",
  "Search & Filtering",
  "Customer Management",
  "Other",
  "Not Sure Yet",
] as const;

export const budgets = [
  "Under $1,000",
  "$1,000 – $3,000",
  "$3,000 – $5,000",
  "$5,000 – $10,000",
  "$10,000 – $25,000",
  "$25,000+",
  "Not Sure Yet",
  "Prefer to Discuss",
] as const;

export const timelines = [
  "As Soon As Possible",
  "Within 1 Month",
  "1–3 Months",
  "3–6 Months",
  "Flexible",
  "Not Sure Yet",
] as const;

export const readinessOptions = [
  "Exploring an Idea",
  "Planning Requirements",
  "Ready to Start",
  "Improving an Existing System",
] as const;

export const priorities = [
  "Fast Delivery",
  "Cost Efficiency",
  "High Performance",
  "Scalability",
  "Security",
  "User Experience",
  "Easy Maintenance",
  "Long-Term Flexibility",
] as const;

export const contactMethods = ["Email", "Phone Call", "WhatsApp"] as const;
export const languages = ["English", "Arabic", "Other"] as const;
export const yesNo = ["Yes", "No", "Not Sure"] as const;

export type InquiryType = (typeof inquiryTypes)[number];
export type ProjectType = (typeof projectTypes)[number];
export type YesNo = (typeof yesNo)[number];

export type ContactInput = {
  fullName: string;
  email: string;
  company: string;
  phone: string;
  inquiryType: string;
  subject: string;
  message: string;
  consent: boolean;
  website: string;
  idempotencyKey: string;
};

export type ConditionalAnswers = {
  ecommerce: {
    productCount: string;
    paymentMethods: string;
    inventory: string;
    shipping: string;
    multilingual: string;
  };
  mobile: {
    targets: string[];
    accounts: string;
    pushNotifications: string;
    existingBackend: string;
  };
  booking: {
    reservationType: string;
    locations: string;
    payments: string;
    scheduling: string;
    reminders: string;
  };
  ai: {
    useCase: string;
    dataSources: string;
    focus: string;
    datasets: string;
  };
  business: {
    departments: string;
    users: string;
    workflows: string;
    integrations: string;
  };
};

export type QuoteInput = {
  projectName: string;
  projectTypes: string[];
  otherProjectType: string;
  projectStatus: string;
  description: string;
  targetUsers: string[];
  platforms: string[];
  features: string[];
  existingSystem: string;
  existingSystemUrl: string;
  existingImprovements: string;
  integrationsNeeded: string;
  integrationsDetail: string;
  technologyPreference: string;
  recommendTechnology: boolean;
  additionalTechnical: string;
  conditional: ConditionalAnswers;
  budget: string;
  timeline: string;
  readiness: string;
  priorities: string[];
  planningNotes: string;
  fullName: string;
  company: string;
  email: string;
  phone: string;
  country: string;
  contactMethod: string;
  language: string;
  additionalMessage: string;
  consent: boolean;
  website: string;
  idempotencyKey: string;
};

export type FieldErrors = Record<string, string>;

export function emptyConditional(): ConditionalAnswers {
  return {
    ecommerce: { productCount: "", paymentMethods: "", inventory: "", shipping: "", multilingual: "" },
    mobile: { targets: [], accounts: "", pushNotifications: "", existingBackend: "" },
    booking: { reservationType: "", locations: "", payments: "", scheduling: "", reminders: "" },
    ai: { useCase: "", dataSources: "", focus: "", datasets: "" },
    business: { departments: "", users: "", workflows: "", integrations: "" },
  };
}

export function emptyQuote(): QuoteInput {
  return {
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
  };
}
