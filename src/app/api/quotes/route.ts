import { clientAddress, isRateLimited } from "@/lib/inquiries/guard";
import { queueNotification } from "@/lib/inquiries/notify";
import { saveQuote } from "@/lib/inquiries/store";
import { normalizeQuote, validateQuote } from "@/lib/inquiries/validate";

const maxBody = 120_000;

export async function POST(request: Request) {
  const address = clientAddress(request);
  if (isRateLimited(`quote:${address}`)) {
    return Response.json(
      { ok: false, message: "Please wait a few minutes before sending another request." },
      { status: 429 },
    );
  }

  const raw = await request.text();
  if (raw.length > maxBody) {
    return Response.json({ ok: false, message: "The request is too large to send." }, { status: 413 });
  }

  let body: unknown;
  try {
    body = JSON.parse(raw);
  } catch {
    return Response.json({ ok: false, message: "The request could not be read." }, { status: 400 });
  }

  const input = normalizeQuote(body);
  if (input.website) {
    return Response.json({ ok: true, ignored: true });
  }

  const errors = validateQuote(input);
  if (Object.keys(errors).length > 0) {
    return Response.json({ ok: false, errors }, { status: 400 });
  }

  try {
    const record = await saveQuote(input);
    const notification = await queueNotification(record, "quote");
    if (notification !== "sent") {
      return Response.json(
        {
          ok: false,
          message: "We couldn't send your project request. Please try again in a few minutes.",
          reason: notification,
        },
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
        event: "quote_save_failed",
        message: error instanceof Error ? error.message : "Save failed",
      }),
    );
    return Response.json(
      { ok: false, message: "We couldn't save your project request. Please try again." },
      { status: 500 },
    );
  }
}
