import { isRateLimited, clientAddress } from "@/lib/inquiries/guard";
import { queueNotification } from "@/lib/inquiries/notify";
import { saveContact } from "@/lib/inquiries/store";
import { normalizeContact, validateContact } from "@/lib/inquiries/validate";

const maxBody = 80_000;

export async function POST(request: Request) {
  const address = clientAddress(request);
  if (isRateLimited(`contact:${address}`)) {
    return Response.json(
      { ok: false, message: "Please wait a few minutes before sending another message." },
      { status: 429 },
    );
  }

  const raw = await request.text();
  if (raw.length > maxBody) {
    return Response.json({ ok: false, message: "The message is too large to send." }, { status: 413 });
  }

  let body: unknown;
  try {
    body = JSON.parse(raw);
  } catch {
    return Response.json({ ok: false, message: "The message could not be read." }, { status: 400 });
  }

  const input = normalizeContact(body);
  if (input.website) {
    return Response.json({ ok: true, ignored: true });
  }

  const errors = validateContact(input);
  if (Object.keys(errors).length > 0) {
    return Response.json({ ok: false, errors }, { status: 400 });
  }

  try {
    const record = await saveContact(input);
    const notification = await queueNotification(record, "contact");
    if (notification !== "sent") {
      return Response.json(
        { ok: false, message: "We couldn't send your message. Please try again in a few minutes." },
        { status: 502 },
      );
    }
    return Response.json({
      ok: true,
      reference: record.reference,
      submittedAt: record.createdAt,
      notification,
    });
  } catch (error) {
    console.error(
      JSON.stringify({
        event: "contact_save_failed",
        message: error instanceof Error ? error.message : "Save failed",
      }),
    );
    return Response.json(
      { ok: false, message: "We couldn't save your message. Please try again." },
      { status: 500 },
    );
  }
}
