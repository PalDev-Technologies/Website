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
  const formatted = new Intl.DateTimeFormat("en", {
    dateStyle: "long",
    timeStyle: "short",
    timeZone: "UTC",
  }).format(date);
  return `${formatted} UTC`;
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

const mailFont = "Segoe UI,Helvetica,Arial,sans-serif";

function htmlBreaks(value: string) {
  return escapeHtml(value).replaceAll("\n", "<br>");
}

function clipPreview(value: string) {
  const text = value.replace(/\s+/g, " ").trim();
  if (text.length <= 140) return text;
  return `${text.slice(0, 137).trimEnd()}…`;
}

function valueHtml(value: string) {
  const safe = value.trim();
  const link = "color:#087cf5;text-decoration:underline;word-break:break-word;";
  if (/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(safe)) {
    return `<a href="mailto:${escapeHtml(safe)}" style="${link}">${escapeHtml(safe)}</a>`;
  }
  if (/^https?:\/\//i.test(safe)) {
    return `<a href="${escapeHtml(safe)}" style="${link}">${escapeHtml(safe)}</a>`;
  }
  return htmlBreaks(safe);
}

function detailTable(rows: Detail[]) {
  return rows
    .map((row, index) => {
      const border = index < rows.length - 1 ? "border-bottom:1px solid #e7edf3;" : "";
      return `<tr>
        <td width="148" valign="top" style="padding:11px 18px 11px 0;${border}color:#5c6d84;font-family:${mailFont};font-size:13px;line-height:1.45;">${escapeHtml(row.label)}</td>
        <td valign="top" style="padding:11px 0;${border}color:#122033;font-family:${mailFont};font-size:14px;line-height:1.5;">${valueHtml(row.value)}</td>
      </tr>`;
    })
    .join("");
}

function sectionHtml(section: MailSection) {
  const rows = section.rows ?? [];
  const body = section.body?.trim();
  if (!body && rows.length === 0) return "";
  const content = body
    ? `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" bgcolor="#f6f8fb" style="background:#f6f8fb;border:1px solid #e6ebf2;">
        <tr>
          <td style="padding:16px 18px;color:#122033;font-family:${mailFont};font-size:15px;line-height:1.65;">${htmlBreaks(body)}</td>
        </tr>
      </table>`
    : `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">${detailTable(rows)}</table>`;
  return `<tr>
    <td class="gutter" style="padding:22px 32px 0;">
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
        <tr>
          <td style="border-top:1px solid #e6ebf2;padding-top:20px;">
            <p style="margin:0 0 12px;color:#5c6d84;font-family:${mailFont};font-size:11px;line-height:1.2;font-weight:700;letter-spacing:0.14em;text-transform:uppercase;">${escapeHtml(section.title)}</p>
            ${content}
          </td>
        </tr>
      </table>
    </td>
  </tr>`;
}

function factsHtml(facts: Detail[]) {
  if (facts.length === 0) return "";
  const width = Math.floor(100 / facts.length);
  const cells = facts
    .map((fact, index) => {
      const divider = index > 0 ? "border-left:1px solid #e1e7ee;" : "";
      return `<td class="fact" width="${width}%" valign="top" style="padding:14px 16px;${divider}">
        <p style="margin:0;color:#5c6d84;font-family:${mailFont};font-size:11px;line-height:1.2;font-weight:700;letter-spacing:0.12em;text-transform:uppercase;">${escapeHtml(fact.label)}</p>
        <p style="margin:6px 0 0;color:#06152f;font-family:${mailFont};font-size:15px;line-height:1.35;font-weight:600;">${escapeHtml(fact.value)}</p>
      </td>`;
    })
    .join("");
  return `<tr>
    <td class="gutter" style="padding:22px 32px 0;">
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" bgcolor="#f6f8fb" style="background:#f6f8fb;">
        <tr>${cells}</tr>
      </table>
    </td>
  </tr>`;
}

function phoneHref(phone: string) {
  const digits = phone.replace(/[^\d+]/g, "");
  return digits ? `tel:${digits}` : "";
}

function actionHtml(email: string, phone?: string | null) {
  const reply = `mailto:${email.replace(/[\r\n]/g, "")}`;
  const number = phone?.trim() ?? "";
  const call = number ? phoneHref(number) : "";
  const phoneCell = call
    ? `<td valign="middle" style="padding-left:18px;font-family:${mailFont};font-size:14px;line-height:1.4;">
        <a href="${escapeHtml(call)}" style="color:#087cf5;font-weight:600;text-decoration:underline;">${escapeHtml(number)}</a>
      </td>`
    : "";
  return `<table role="presentation" cellpadding="0" cellspacing="0" border="0">
    <tr>
      <td bgcolor="#087cf5" style="background:#087cf5;border-radius:4px;">
        <a href="${escapeHtml(reply)}" style="display:inline-block;padding:12px 18px;color:#ffffff;font-family:${mailFont};font-size:14px;font-weight:600;line-height:16px;text-decoration:none;">Reply</a>
      </td>
      ${phoneCell}
    </tr>
  </table>`;
}

function inquiryHtml(input: {
  kicker: string;
  headline: string;
  subline: string;
  preheader: string;
  email: string;
  phone?: string | null;
  reference: string;
  submitted: string;
  facts?: Detail[];
  sections: MailSection[];
}) {
  const logo = `${brand.url}${brand.icon}`;
  const previewPad = "&zwnj;&nbsp;".repeat(30);
  const year = new Date().getUTCFullYear();
  return `<!doctype html>
<html lang="en" xmlns="http://www.w3.org/1999/xhtml">
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <meta name="color-scheme" content="light">
    <meta name="supported-color-schemes" content="light">
    <title>${escapeHtml(input.kicker)} — ${escapeHtml(input.headline)}</title>
    <style>
      :root { color-scheme: light; }
      @media only screen and (max-width: 620px) {
        .container { width: 100% !important; }
        .gutter { padding-left: 20px !important; padding-right: 20px !important; }
        .brand-cell, .meta-cell { display: block !important; width: 100% !important; box-sizing: border-box !important; }
        .meta-cell { padding: 16px 0 0 !important; text-align: left !important; }
        .meta { text-align: left !important; }
        .fact { display: block !important; width: 100% !important; box-sizing: border-box !important; border-left: 0 !important; border-top: 1px solid #e1e7ee !important; }
        .fact:first-child { border-top: 0 !important; }
      }
    </style>
  </head>
  <body style="margin:0;padding:0;background:#f3f6f9;color:#122033;">
    <div style="display:none;max-height:0;max-width:0;overflow:hidden;opacity:0;color:#f3f6f9;font-size:1px;line-height:1px;">
      ${escapeHtml(input.preheader)}${previewPad}
    </div>
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" bgcolor="#f3f6f9" style="background:#f3f6f9;">
      <tr>
        <td align="center" style="padding:28px 12px;">
          <table role="presentation" class="container" width="600" cellpadding="0" cellspacing="0" border="0" bgcolor="#ffffff" style="width:100%;max-width:600px;background:#ffffff;border:1px solid #dbe3ec;font-family:${mailFont};">
            <tr>
              <td bgcolor="#06152f" class="gutter" style="background:#06152f;padding:22px 32px;">
                <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
                  <tr>
                    <td class="brand-cell" valign="middle" style="padding-right:16px;">
                      <table role="presentation" cellpadding="0" cellspacing="0" border="0">
                        <tr>
                          <td valign="middle" style="padding-right:12px;">
                            <img src="${logo}" width="36" height="36" alt="" style="display:block;border:0;border-radius:8px;">
                          </td>
                          <td valign="middle">
                            <p style="margin:0;font-family:${mailFont};font-size:18px;line-height:1;font-weight:700;letter-spacing:-0.03em;">
                              <span style="color:#ffffff;">Pal</span><span style="color:#3aa0ff;">Dev</span>
                            </p>
                            <p style="margin:5px 0 0;color:#9aadc4;font-family:${mailFont};font-size:10px;line-height:1;font-weight:700;letter-spacing:0.18em;text-transform:uppercase;">Technologies</p>
                          </td>
                        </tr>
                      </table>
                    </td>
                    <td class="meta-cell" valign="middle" align="right">
                      <p class="meta" style="margin:0;color:#8ea4bf;font-family:${mailFont};font-size:11px;line-height:1.2;font-weight:700;letter-spacing:0.14em;text-transform:uppercase;text-align:right;">${escapeHtml(input.kicker)}</p>
                      <p class="meta" style="margin:6px 0 0;color:#ffffff;font-family:${mailFont};font-size:12px;line-height:1.3;font-weight:600;text-align:right;">${escapeHtml(input.reference)}</p>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>
            <tr>
              <td bgcolor="#087cf5" height="2" style="background:#087cf5;height:2px;font-size:0;line-height:0;">&nbsp;</td>
            </tr>
            <tr>
              <td bgcolor="#ffffff" class="gutter" style="background:#ffffff;padding:28px 32px 4px;">
                <p style="margin:0;color:#06152f;font-family:${mailFont};font-size:22px;line-height:1.3;font-weight:700;">${escapeHtml(input.headline)}</p>
                <p style="margin:8px 0 0;color:#5c6d84;font-family:${mailFont};font-size:14px;line-height:1.5;">${escapeHtml(input.subline)}</p>
                <table role="presentation" cellpadding="0" cellspacing="0" border="0">
                  <tr>
                    <td style="padding-top:20px;">${actionHtml(input.email, input.phone)}</td>
                  </tr>
                </table>
              </td>
            </tr>
            ${factsHtml(input.facts ?? [])}
            ${input.sections.map(sectionHtml).join("")}
            <tr>
              <td bgcolor="#ffffff" style="background:#ffffff;padding:28px 32px 0;font-size:0;line-height:0;">&nbsp;</td>
            </tr>
            <tr>
              <td bgcolor="#f7f9fb" class="gutter" style="background:#f7f9fb;border-top:1px solid #e6ebf2;padding:18px 32px 20px;">
                <p style="margin:0;color:#5c6d84;font-family:${mailFont};font-size:12px;line-height:1.6;">
                  Reference <span style="color:#122033;font-weight:600;">${escapeHtml(input.reference)}</span><br>
                  Received ${escapeHtml(input.submitted)}
                </p>
                <p style="margin:12px 0 0;color:#5c6d84;font-family:${mailFont};font-size:12px;line-height:1.6;">
                  <span style="color:#122033;font-weight:600;">${escapeHtml(brand.name)}</span><br>
                  <a href="${brand.url}" style="color:#087cf5;text-decoration:underline;">paldev.tech</a><br>
                  Sent from the PalDev website. A reply is delivered to the sender.
                </p>
                <p style="margin:12px 0 0;color:#8b9aaf;font-family:${mailFont};font-size:11px;line-height:1.5;">© ${year} ${escapeHtml(brand.name)}</p>
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
  const subline = [record.fullName, record.company, record.inquiryType].filter(Boolean).join(" · ");
  return inquiryHtml({
    kicker: "New message",
    headline: record.subject,
    subline: subline || "Website inquiry",
    preheader: clipPreview(record.message),
    email: record.email,
    phone: record.phone,
    reference: record.reference,
    submitted: formatWhen(record.createdAt),
    sections: [
      { title: "Message", body: record.message },
      {
        title: "Contact",
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

const scopeTitles: Record<string, string> = {
  ecommerce: "Store",
  mobile: "Mobile app",
  booking: "Booking",
  ai: "AI and data",
  business: "Business system",
};

function scopeSections(value: StoredQuote["conditionalRequirements"]): MailSection[] {
  const groups = Object.entries(value).flatMap(([key, item]) => {
    const rows = flattenDetails(item);
    if (rows.length === 0) return [];
    return [{ title: scopeTitles[key] ?? humanize(key), rows }];
  });
  if (groups.length === 0) return [];
  if (groups.length === 1) return [{ title: groups[0].title, rows: groups[0].rows }];
  return [
    {
      title: "Project specifics",
      rows: groups.flatMap((group) =>
        group.rows.map((row) => ({ label: `${group.title} · ${row.label}`, value: row.value })),
      ),
    },
  ];
}

function quoteMail(record: StoredQuote) {
  const types = record.projectTypes.join(", ");
  const subline = [record.contactName, record.company, record.country].filter(Boolean).join(" · ");
  const facts = present([
    ["Budget", record.budget],
    ["Timeline", record.timeline],
    ["Readiness", record.readiness],
  ]);
  return inquiryHtml({
    kicker: "Quote request",
    headline: record.projectName || "Project inquiry",
    subline: subline || "Website inquiry",
    preheader: clipPreview(record.description),
    email: record.email,
    phone: record.phone,
    reference: record.reference,
    submitted: formatWhen(record.createdAt),
    facts,
    sections: [
      { title: "Description", body: record.description },
      {
        title: "Project",
        rows: present([
          ["Project", record.projectName],
          ["Type", types],
          ["Other type", record.otherProjectType],
          ["Status", record.projectStatus],
          ["Target users", record.targetUsers.join(", ")],
          ["Platforms", record.platforms.join(", ")],
          ["Features", record.features.join(", ")],
        ]),
      },
      {
        title: "Contact",
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
        title: "Technical",
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
          ["Priorities", record.priorities.join(", ")],
          ["Notes", record.additionalNotes],
        ]),
      },
      ...scopeSections(record.conditionalRequirements),
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
  fromName: string;
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

function senderAddress(from: string, fallback: string) {
  const match = from.match(/<([^>]+)>/);
  return (match?.[1] || from || fallback).trim();
}

async function sendToInbox(mail: OutgoingMail) {
  const account = mailbox();
  if (!account) throw new Error("Mailbox is not configured.");
  const safeName = mail.fromName.replace(/[\r\n<>"]/g, "").trim();
  await account.transport.sendMail({
    from: {
      name: safeName || brand.name,
      address: senderAddress(account.from, account.to),
    },
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
        fromName: name,
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
