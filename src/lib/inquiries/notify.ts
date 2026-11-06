import { appendFile, mkdir } from "node:fs/promises";
import path from "node:path";
import nodemailer from "nodemailer";
import type { StoredContact, StoredQuote } from "@/lib/inquiries/store";
import { brand } from "@/lib/site";

export type NotificationState = "sent" | "queued" | "unconfigured";

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

function formatWhen(iso: string) {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return iso;
  return new Intl.DateTimeFormat("en", {
    dateStyle: "long",
    timeStyle: "short",
    timeZone: "UTC",
  }).format(date);
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
      ["Submitted", formatWhen(record.createdAt)],
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
      ["Submitted", formatWhen(record.createdAt)],
    ]),
    "",
    "Description:",
    record.description,
    "",
    "Conditional requirements:",
    conditional === "{}" ? "None" : conditional,
  ].join("\n");
}

type Detail = { label: string; value: string };
type MailSection = { title: string; rows?: Detail[]; body?: string };

function present(entries: Array<[string, string | null | undefined]>): Detail[] {
  return entries.flatMap(([label, value]) => {
    const text = value?.trim();
    return text ? [{ label, value: text }] : [];
  });
}

function humanize(key: string) {
  const label = key
    .replace(/([a-z])([A-Z])/g, "$1 $2")
    .replace(/[_-]+/g, " ")
    .trim();
  return label.charAt(0).toUpperCase() + label.slice(1);
}

function flattenDetails(value: unknown, prefix = ""): Detail[] {
  if (value == null) return [];
  if (typeof value === "string" || typeof value === "number" || typeof value === "boolean") {
    const text = String(value).trim();
    return text && prefix ? [{ label: prefix, value: text }] : [];
  }
  if (Array.isArray(value)) {
    const text = value.map(String).map((item) => item.trim()).filter(Boolean).join(", ");
    return text && prefix ? [{ label: prefix, value: text }] : [];
  }
  if (typeof value === "object") {
    return Object.entries(value).flatMap(([key, item]) => {
      const label = prefix ? `${prefix} · ${humanize(key)}` : humanize(key);
      return flattenDetails(item, label);
    });
  }
  return [];
}

function htmlBreaks(value: string) {
  return escapeHtml(value).replaceAll("\n", "<br>");
}

function valueHtml(value: string) {
  const safe = value.trim();
  if (/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(safe)) {
    return `<a href="mailto:${escapeHtml(safe)}" style="color:#087cf5;text-decoration:none;">${escapeHtml(safe)}</a>`;
  }
  if (/^https?:\/\//i.test(safe)) {
    return `<a href="${escapeHtml(safe)}" style="color:#087cf5;text-decoration:none;">${escapeHtml(safe)}</a>`;
  }
  return htmlBreaks(safe);
}

function detailTable(rows: Detail[]) {
  return rows
    .map((row, index) => {
      const border = index < rows.length - 1 ? "border-bottom:1px solid #e4edf6;" : "";
      return `<tr>
        <td width="148" style="padding:12px 16px 12px 0;${border}color:#63748c;font-size:13px;line-height:1.45;vertical-align:top;">${escapeHtml(row.label)}</td>
        <td style="padding:12px 0;${border}color:#0a1a35;font-size:14px;line-height:1.5;font-weight:600;vertical-align:top;">${valueHtml(row.value)}</td>
      </tr>`;
    })
    .join("");
}

function sectionHtml(section: MailSection) {
  const rows = section.rows ?? [];
  const body = section.body?.trim();
  if (!body && rows.length === 0) return "";
  const content = body
    ? `<div style="background:#f5f8fc;border-left:3px solid #087cf5;border-radius:12px;padding:16px 18px;color:#0a1a35;font-size:15px;line-height:1.65;">${htmlBreaks(body)}</div>`
    : `<table role="presentation" width="100%" cellpadding="0" cellspacing="0">${detailTable(rows)}</table>`;
  return `<tr>
    <td style="padding:28px 32px 0;">
      <p style="margin:0 0 12px;color:#087cf5;font-size:12px;line-height:1.2;font-weight:700;letter-spacing:0.08em;text-transform:uppercase;">${escapeHtml(section.title)}</p>
      ${content}
    </td>
  </tr>`;
}

function inquiryHtml(input: {
  kicker: string;
  name: string;
  summary: string;
  email: string;
  reference: string;
  submitted: string;
  sections: MailSection[];
}) {
  const logo = `${brand.url}${brand.icon}`;
  const reply = `mailto:${input.email.replace(/[\r\n]/g, "")}`;
  return `<!doctype html>
<html lang="en">
  <body style="margin:0;padding:0;background:#f5f8fc;color:#0a1a35;">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#f5f8fc;">
      <tr>
        <td align="center" style="padding:32px 16px;">
          <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:640px;font-family:Segoe UI,Helvetica,Arial,sans-serif;">
            <tr>
              <td style="background:#06152f;border-radius:20px 20px 0 0;padding:26px 32px 22px;">
                <table role="presentation" cellpadding="0" cellspacing="0">
                  <tr>
                    <td style="padding-right:14px;vertical-align:middle;">
                      <img src="${logo}" width="42" height="42" alt="" style="display:block;border:0;border-radius:12px;background:#ffffff;">
                    </td>
                    <td style="vertical-align:middle;">
                      <p style="margin:0;color:#ffffff;font-size:16px;line-height:1.2;font-weight:700;">${escapeHtml(brand.name)}</p>
                      <p style="margin:6px 0 0;color:#08d8ed;font-size:12px;line-height:1.2;font-weight:700;letter-spacing:0.08em;text-transform:uppercase;">${escapeHtml(input.kicker)}</p>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>
            <tr>
              <td style="height:3px;background:#087cf5;font-size:0;line-height:0;">&nbsp;</td>
            </tr>
            <tr>
              <td style="background:#ffffff;border-left:1px solid #e4edf6;border-right:1px solid #e4edf6;padding:32px 32px 4px;">
                <p style="margin:0;color:#06152f;font-size:28px;line-height:1.15;font-weight:800;">${escapeHtml(input.name)}</p>
                <p style="margin:10px 0 0;color:#63748c;font-size:15px;line-height:1.5;">${escapeHtml(input.summary)}</p>
                <p style="margin:22px 0 0;">
                  <a href="${escapeHtml(reply)}" style="display:inline-block;background:#087cf5;color:#ffffff;text-decoration:none;font-size:14px;line-height:1;font-weight:700;padding:13px 18px;border-radius:999px;">Reply to client</a>
                </p>
              </td>
            </tr>
            ${input.sections.map(sectionHtml).join("")}
            <tr>
              <td style="background:#ffffff;border-left:1px solid #e4edf6;border-right:1px solid #e4edf6;padding:8px 32px 0;font-size:0;line-height:0;">&nbsp;</td>
            </tr>
            <tr>
              <td style="background:#f7fafc;border:1px solid #e4edf6;border-top:0;border-radius:0 0 20px 20px;padding:18px 32px 20px;">
                <p style="margin:0;color:#63748c;font-size:12px;line-height:1.6;">
                  Reference <strong style="color:#0a1a35;">${escapeHtml(input.reference)}</strong><br>
                  Submitted ${escapeHtml(input.submitted)}
                </p>
                <p style="margin:8px 0 0;font-size:12px;line-height:1.6;">
                  <a href="${brand.url}" style="color:#087cf5;text-decoration:none;">paldev.tech</a>
                </p>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>`;
}

function contactMail(record: StoredContact) {
  const summary = [record.inquiryType, record.company].filter(Boolean).join(" · ");
  return inquiryHtml({
    kicker: "New message",
    name: record.fullName,
    summary: summary || "General inquiry",
    email: record.email,
    reference: record.reference,
    submitted: formatWhen(record.createdAt),
    sections: [
      { title: "Message", body: record.subject ? `${record.subject}\n\n${record.message}` : record.message },
      {
        title: "Client",
        rows: present([
          ["Name", record.fullName],
          ["Email", record.email],
          ["Company", record.company],
          ["Phone", record.phone],
          ["Inquiry", record.inquiryType],
        ]),
      },
    ],
  });
}

function quoteMail(record: StoredQuote) {
  const summary = [record.projectName, record.projectTypes.join(", ")].filter(Boolean).join(" · ");
  const conditional = flattenDetails(record.conditionalRequirements);
  return inquiryHtml({
    kicker: "New quote request",
    name: record.contactName,
    summary: summary || "Project inquiry",
    email: record.email,
    reference: record.reference,
    submitted: formatWhen(record.createdAt),
    sections: [
      { title: "Project description", body: record.description },
      {
        title: "Client",
        rows: present([
          ["Name", record.contactName],
          ["Email", record.email],
          ["Company", record.company],
          ["Phone", record.phone],
          ["Country", record.country],
          ["Preferred contact", record.preferredContactMethod],
          ["Language", record.preferredLanguage],
        ]),
      },
      {
        title: "Project",
        rows: present([
          ["Project", record.projectName],
          ["Type", record.projectTypes.join(", ")],
          ["Other type", record.otherProjectType],
          ["Status", record.projectStatus],
          ["Target users", record.targetUsers.join(", ")],
          ["Platforms", record.platforms.join(", ")],
          ["Features", record.features.join(", ")],
        ]),
      },
      {
        title: "Technical notes",
        rows: present([
          ["Existing system", record.existingSystem],
          ["Existing URL", record.existingSystemUrl],
          ["Improvements", record.existingImprovements],
          ["Integrations", record.integrations.needed],
          ["Integration detail", record.integrations.detail],
          ["Technology", record.technologyPreference],
          ["Technical notes", record.additionalTechnicalRequirements],
        ]),
      },
      {
        title: "Planning",
        rows: present([
          ["Budget", record.budget],
          ["Timeline", record.timeline],
          ["Readiness", record.readiness],
          ["Priorities", record.priorities.join(", ")],
          ["Planning notes", record.additionalNotes],
        ]),
      },
      { title: "Project specifics", rows: conditional },
      { title: "Additional message", body: record.additionalMessage ?? "" },
    ],
  });
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
  html: string;
};

function setting(name: string) {
  const value = process.env[name];
  return typeof value === "string" ? value.trim() : "";
}

function mailbox() {
  const host = setting("PALDEV_SMTP_HOST");
  const user = setting("PALDEV_SMTP_USER");
  const pass = setting("PALDEV_SMTP_PASS").replace(/\s+/g, "");
  const port = Number(setting("PALDEV_SMTP_PORT") || "465");
  if (!host || !user || !pass || !Number.isInteger(port)) return null;
  return {
    from: setting("PALDEV_NOTIFY_FROM") || user,
    to: setting("PALDEV_NOTIFY_TO") || user,
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
    html: mail.html,
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
  const html = kind === "contact" ? contactMail(record as StoredContact) : quoteMail(record as StoredQuote);
  const account = mailbox();
  const to = account?.to || setting("PALDEV_NOTIFY_TO");
  const from = account?.from || setting("PALDEV_NOTIFY_FROM");
  const webhook = setting("PALDEV_NOTIFY_WEBHOOK");
  const payload = {
    reference: record.reference,
    kind,
    createdAt: record.createdAt,
    to: to || null,
    from: from || null,
    replyTo: record.email,
    subject,
    text,
    html,
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
        html,
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
    status = "unconfigured";
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
