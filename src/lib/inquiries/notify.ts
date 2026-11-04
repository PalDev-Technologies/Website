import { appendFile, mkdir } from "node:fs/promises";
import path from "node:path";
import type { StoredContact, StoredQuote } from "@/lib/inquiries/store";

export type NotificationState = "sent" | "queued";

const outbox = path.join(process.cwd(), "data", "outbox.jsonl");

function escapeHtml(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

function lines(entries: Array<[string, string | null | undefined]>) {
  return entries
    .filter((entry) => entry[1])
    .map(([label, value]) => `${label}: ${value}`)
    .join("\n");
}

function contactText(record: StoredContact) {
  return [
    "New contact inquiry",
    "",
    lines([
      ["Reference", record.reference],
      ["Name", record.fullName],
      ["Email", record.email],
      ["Company", record.company],
      ["Phone", record.phone],
      ["Inquiry type", record.inquiryType],
      ["Subject", record.subject],
      ["Submitted", record.createdAt],
    ]),
    "",
    "Message:",
    record.message,
  ].join("\n");
}

function quoteText(record: StoredQuote) {
  const conditional = JSON.stringify(record.conditionalRequirements, null, 2);
  return [
    "New technical quote request",
    "",
    lines([
      ["Reference", record.reference],
      ["Name", record.contactName],
      ["Email", record.email],
      ["Company", record.company],
      ["Phone", record.phone],
      ["Country", record.country],
      ["Preferred contact", record.preferredContactMethod],
      ["Language", record.preferredLanguage],
      ["Project", record.projectName],
      ["Project types", record.projectTypes.join(", ")],
      ["Other type", record.otherProjectType],
      ["Status", record.projectStatus],
      ["Target users", record.targetUsers.join(", ")],
      ["Platforms", record.platforms.join(", ")],
      ["Features", record.features.join(", ")],
      ["Existing system", record.existingSystem],
      ["Existing URL", record.existingSystemUrl],
      ["Improvements", record.existingImprovements],
      ["Integrations", record.integrations.needed],
      ["Integration detail", record.integrations.detail],
      ["Technology", record.technologyPreference],
      ["Technical notes", record.additionalTechnicalRequirements],
      ["Budget", record.budget],
      ["Timeline", record.timeline],
      ["Readiness", record.readiness],
      ["Priorities", record.priorities.join(", ")],
      ["Planning notes", record.additionalNotes],
      ["Additional message", record.additionalMessage],
      ["Submitted", record.createdAt],
    ]),
    "",
    "Description:",
    record.description,
    "",
    "Conditional requirements:",
    conditional === "{}" ? "None" : conditional,
  ].join("\n");
}

function customerText(reference: string, createdAt: string, kind: "contact" | "quote") {
  const received =
    kind === "quote"
      ? "We have received your project inquiry and will review the information you provided."
      : "We have received your message and will review the information you provided.";
  return [
    "Thank you for contacting PalDev Technologies.",
    "",
    received,
    "Our team will contact you regarding the appropriate next steps.",
    "",
    `Reference: ${reference}`,
    `Submitted: ${createdAt}`,
  ].join("\n");
}

export async function queueNotification(record: StoredContact | StoredQuote, kind: "contact" | "quote"): Promise<NotificationState> {
  const subject =
    kind === "contact"
      ? "New Contact Inquiry | PalDev Technologies"
      : "New Technical Quote Request | PalDev Technologies";
  const text = kind === "contact" ? contactText(record as StoredContact) : quoteText(record as StoredQuote);
  const confirmation = customerText(record.reference, record.createdAt, kind);
  const to = process.env.PALDEV_NOTIFY_TO?.trim() || null;
  const webhook = process.env.PALDEV_NOTIFY_WEBHOOK?.trim() || "";
  const payload = {
    reference: record.reference,
    kind,
    createdAt: record.createdAt,
    to,
    from: process.env.PALDEV_NOTIFY_FROM?.trim() || null,
    subject,
    text,
    html: `<pre>${escapeHtml(text)}</pre>`,
    customerSubject:
      kind === "quote"
        ? "We Received Your Project Request | PalDev Technologies"
        : "We Received Your Message | PalDev Technologies",
    customerText: confirmation,
    customerHtml: `<pre>${escapeHtml(confirmation)}</pre>`,
    status: "queued" as NotificationState,
  };

  let status: NotificationState = "queued";
  if (webhook.startsWith("https://") && to) {
    try {
      const response = await fetch(webhook, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(payload),
        signal: AbortSignal.timeout(8000),
      });
      if (response.ok) status = "sent";
    } catch (error) {
      console.error(
        JSON.stringify({
          event: "inquiry_notification_failed",
          reference: record.reference,
          message: error instanceof Error ? error.message : "Notification failed",
        }),
      );
    }
  }

  payload.status = status;
  await mkdir(path.dirname(outbox), { recursive: true });
  await appendFile(outbox, `${JSON.stringify(payload)}\n`);
  console.info(JSON.stringify({ event: "inquiry_saved", kind, reference: record.reference, notification: status }));
  return status;
}
