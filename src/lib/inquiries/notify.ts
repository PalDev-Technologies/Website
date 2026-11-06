import { appendFile, mkdir } from "node:fs/promises";
import path from "node:path";
import nodemailer from "nodemailer";
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

function emailDocument(title: string, text: string) {
  return `<!doctype html>
<html>
  <body style="margin:0;background:#f5f8fc;color:#0a1a35;font-family:Segoe UI,Helvetica,Arial,sans-serif;">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#f5f8fc;padding:32px 16px;">
      <tr>
        <td align="center">
          <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:640px;background:#ffffff;border:1px solid #e4edf6;border-radius:16px;overflow:hidden;">
            <tr>
              <td style="background:#06152f;padding:22px 28px;color:#ffffff;font-size:18px;font-weight:700;">${escapeHtml(title)}</td>
            </tr>
            <tr>
              <td style="padding:28px;font-size:15px;line-height:1.6;">
                <p style="margin:0;white-space:pre-wrap;">${escapeHtml(text)}</p>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>`;
}

function replyAddress(email: string, name: string) {
  const safeEmail = email.replace(/[\r\n]/g, "");
  const safeName = name.replace(/[\r\n<>"]/g, "").trim();
  return safeName ? `${safeName} <${safeEmail}>` : safeEmail;
}

type OutgoingMail = {
  to: string;
  replyTo: string;
  subject: string;
  text: string;
};

function mailbox() {
  const host = process.env.PALDEV_SMTP_HOST?.trim() || "";
  const user = process.env.PALDEV_SMTP_USER?.trim() || "";
  const pass = process.env.PALDEV_SMTP_PASS?.trim() || "";
  const port = Number(process.env.PALDEV_SMTP_PORT?.trim() || "465");
  if (!host || !user || !pass || !Number.isInteger(port)) return null;
  return {
    from: process.env.PALDEV_NOTIFY_FROM?.trim() || user,
    to: process.env.PALDEV_NOTIFY_TO?.trim() || user,
    transport: nodemailer.createTransport({
      host,
      port,
      secure: port === 465,
      auth: { user, pass },
      connectionTimeout: 8000,
      greetingTimeout: 8000,
      socketTimeout: 8000,
    }),
  };
}

async function sendToInbox(mail: OutgoingMail) {
  const account = mailbox();
  if (!account) throw new Error("Mailbox is not configured.");
  await account.transport.sendMail({
    from: account.from,
    to: account.to,
    replyTo: mail.replyTo,
    subject: mail.subject,
    text: mail.text,
    html: emailDocument(mail.subject, mail.text),
  });
}

function customerName(record: StoredContact | StoredQuote) {
  return "fullName" in record ? record.fullName : record.contactName;
}

export async function queueNotification(record: StoredContact | StoredQuote, kind: "contact" | "quote"): Promise<NotificationState> {
  const name = customerName(record);
  const subject =
    kind === "contact"
      ? `New message from ${name} | PalDev Technologies`
      : `New quote request from ${name} | PalDev Technologies`;
  const text = kind === "contact" ? contactText(record as StoredContact) : quoteText(record as StoredQuote);
  const account = mailbox();
  const to = account?.to || process.env.PALDEV_NOTIFY_TO?.trim() || "";
  const from = account?.from || process.env.PALDEV_NOTIFY_FROM?.trim() || "";
  const webhook = process.env.PALDEV_NOTIFY_WEBHOOK?.trim() || "";
  const payload = {
    reference: record.reference,
    kind,
    createdAt: record.createdAt,
    to: to || null,
    from: from || null,
    replyTo: record.email,
    subject,
    text,
    html: emailDocument(subject, text),
    status: "queued" as NotificationState,
  };

  let status: NotificationState = "queued";
  if (account) {
    try {
      await sendToInbox({
        to,
        replyTo: replyAddress(record.email, name),
        subject,
        text,
      });
      status = "sent";
    } catch (error) {
      console.error(
        JSON.stringify({
          event: "inquiry_notification_failed",
          reference: record.reference,
          message: error instanceof Error ? error.message : "Notification failed",
        }),
      );
    }
  } else if (webhook.startsWith("https://") && to) {
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
  } else {
    console.error(
      JSON.stringify({
        event: "email_not_configured",
        reference: record.reference,
        hasMailbox: Boolean(account),
        hasTo: Boolean(to),
      }),
    );
  }

  payload.status = status;
  try {
    await mkdir(path.dirname(outbox), { recursive: true });
    await appendFile(outbox, `${JSON.stringify(payload)}\n`);
  } catch (error) {
    console.error(
      JSON.stringify({
        event: "inquiry_outbox_failed",
        reference: record.reference,
        message: error instanceof Error ? error.message : "Outbox write failed",
      }),
    );
  }
  console.info(JSON.stringify({ event: "inquiry_saved", kind, reference: record.reference, notification: status }));
  return status;
}
