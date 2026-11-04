import { randomBytes } from "node:crypto";
import { mkdir, readFile, rename, writeFile } from "node:fs/promises";
import path from "node:path";
import { applicableConditional } from "@/lib/inquiries/validate";
import type { ContactInput, QuoteInput } from "@/lib/inquiries/model";

export type InquiryStatus = "NEW" | "UNDER_REVIEW" | "CONTACTED" | "PROPOSAL_PREPARATION" | "PROPOSAL_SENT" | "CLOSED";

export type StoredContact = {
  id: string;
  reference: string;
  fullName: string;
  email: string;
  company: string | null;
  phone: string | null;
  inquiryType: string;
  subject: string;
  message: string;
  status: InquiryStatus;
  createdAt: string;
  updatedAt: string;
};

export type StoredQuote = {
  id: string;
  reference: string;
  projectName: string | null;
  projectTypes: string[];
  otherProjectType: string | null;
  projectStatus: string;
  description: string;
  targetUsers: string[];
  platforms: string[];
  features: string[];
  conditionalRequirements: ReturnType<typeof applicableConditional>;
  existingSystem: string | null;
  existingSystemUrl: string | null;
  existingImprovements: string | null;
  integrations: { needed: string | null; detail: string | null };
  technologyPreference: string | null;
  recommendTechnology: boolean;
  additionalTechnicalRequirements: string | null;
  budget: string | null;
  timeline: string | null;
  readiness: string | null;
  priorities: string[];
  additionalNotes: string | null;
  contactName: string;
  company: string | null;
  email: string;
  phone: string | null;
  country: string | null;
  preferredContactMethod: string;
  preferredLanguage: string | null;
  additionalMessage: string | null;
  status: InquiryStatus;
  createdAt: string;
  updatedAt: string;
};

type IdempotencyRecord = {
  kind: "contact" | "quote";
  reference: string;
  submittedAt: string;
};

type StoreFile = {
  contacts: StoredContact[];
  quotes: StoredQuote[];
  idempotency: Record<string, IdempotencyRecord>;
};

const directory = path.join(process.cwd(), "data");
const filePath = path.join(directory, "inquiries.json");

let queue: Promise<unknown> = Promise.resolve();

function withLock<T>(task: () => Promise<T>) {
  const run = queue.then(task, task);
  queue = run.then(
    () => undefined,
    () => undefined,
  );
  return run;
}

function emptyStore(): StoreFile {
  return { contacts: [], quotes: [], idempotency: {} };
}

async function readStore(): Promise<StoreFile> {
  try {
    const raw = await readFile(filePath, "utf8");
    const parsed = JSON.parse(raw) as StoreFile;
    if (!parsed || !Array.isArray(parsed.contacts) || !Array.isArray(parsed.quotes)) {
      throw new Error("Inquiry store is unreadable.");
    }
    return { ...emptyStore(), ...parsed, idempotency: parsed.idempotency ?? {} };
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === "ENOENT") return emptyStore();
    throw error;
  }
}

async function writeStore(store: StoreFile) {
  await mkdir(directory, { recursive: true });
  const temporary = `${filePath}.tmp`;
  await writeFile(temporary, JSON.stringify(store, null, 2));
  await rename(temporary, filePath);
}

function reference(prefix: "C" | "Q", now: Date) {
  const year = now.getUTCFullYear();
  const month = String(now.getUTCMonth() + 1).padStart(2, "0");
  const day = String(now.getUTCDate()).padStart(2, "0");
  const suffix = randomBytes(2).toString("hex").toUpperCase();
  return `PAL-${prefix}-${year}${month}${day}-${suffix}`;
}

function blankToNull(value: string) {
  return value ? value : null;
}

export function findIdempotent(key: string) {
  return withLock(async () => {
    const store = await readStore();
    return store.idempotency[key] ?? null;
  });
}

export function saveContact(input: ContactInput) {
  return withLock(async () => {
    const store = await readStore();
    const existing = store.idempotency[input.idempotencyKey];
    if (existing?.kind === "contact") {
      const saved = store.contacts.find((item) => item.reference === existing.reference);
      if (saved) return saved;
    }

    const now = new Date();
    const timestamp = now.toISOString();
    const record: StoredContact = {
      id: randomBytes(16).toString("hex"),
      reference: reference("C", now),
      fullName: input.fullName,
      email: input.email,
      company: blankToNull(input.company),
      phone: blankToNull(input.phone),
      inquiryType: input.inquiryType,
      subject: input.subject,
      message: input.message,
      status: "NEW",
      createdAt: timestamp,
      updatedAt: timestamp,
    };
    store.contacts.push(record);
    store.idempotency[input.idempotencyKey] = {
      kind: "contact",
      reference: record.reference,
      submittedAt: timestamp,
    };
    await writeStore(store);
    return record;
  });
}

export function saveQuote(input: QuoteInput) {
  return withLock(async () => {
    const store = await readStore();
    const existing = store.idempotency[input.idempotencyKey];
    if (existing?.kind === "quote") {
      const saved = store.quotes.find((item) => item.reference === existing.reference);
      if (saved) return saved;
    }

    const now = new Date();
    const timestamp = now.toISOString();
    const record: StoredQuote = {
      id: randomBytes(16).toString("hex"),
      reference: reference("Q", now),
      projectName: blankToNull(input.projectName),
      projectTypes: input.projectTypes,
      otherProjectType: input.projectTypes.includes("Other") ? blankToNull(input.otherProjectType) : null,
      projectStatus: input.projectStatus,
      description: input.description,
      targetUsers: input.targetUsers,
      platforms: input.platforms,
      features: input.features,
      conditionalRequirements: applicableConditional(input),
      existingSystem: blankToNull(input.existingSystem),
      existingSystemUrl: input.existingSystem === "Yes" ? blankToNull(input.existingSystemUrl) : null,
      existingImprovements: input.existingSystem === "Yes" ? blankToNull(input.existingImprovements) : null,
      integrations: {
        needed: blankToNull(input.integrationsNeeded),
        detail: input.integrationsNeeded === "Yes" ? blankToNull(input.integrationsDetail) : null,
      },
      technologyPreference: input.recommendTechnology
        ? "PalDev should recommend the technology."
        : blankToNull(input.technologyPreference),
      recommendTechnology: input.recommendTechnology,
      additionalTechnicalRequirements: blankToNull(input.additionalTechnical),
      budget: blankToNull(input.budget),
      timeline: blankToNull(input.timeline),
      readiness: blankToNull(input.readiness),
      priorities: input.priorities,
      additionalNotes: blankToNull(input.planningNotes),
      contactName: input.fullName,
      company: blankToNull(input.company),
      email: input.email,
      phone: blankToNull(input.phone),
      country: blankToNull(input.country),
      preferredContactMethod: input.contactMethod,
      preferredLanguage: blankToNull(input.language),
      additionalMessage: blankToNull(input.additionalMessage),
      status: "NEW",
      createdAt: timestamp,
      updatedAt: timestamp,
    };
    store.quotes.push(record);
    store.idempotency[input.idempotencyKey] = {
      kind: "quote",
      reference: record.reference,
      submittedAt: timestamp,
    };
    await writeStore(store);
    return record;
  });
}
