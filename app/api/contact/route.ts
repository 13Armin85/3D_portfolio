import { Resend } from "resend";

export const runtime = "nodejs";

const MAX_BODY_BYTES = 20_000;
const success = () =>
  Response.json({ message: "Thanks! Your message has been sent." });
const failure = (message: string, status: number) =>
  Response.json({ error: message }, { status });

export async function POST(request: Request) {
  const origin = request.headers.get("origin");
  if (origin && origin !== new URL(request.url).origin) {
    return failure("This request is not allowed.", 403);
  }
  if (
    request.headers.get("content-type")?.split(";")[0].trim() !==
    "application/json"
  ) {
    return failure("Please submit the form as JSON.", 415);
  }
  if (Number(request.headers.get("content-length")) > MAX_BODY_BYTES) {
    return failure("Your message is too large.", 413);
  }

  let payload: unknown;
  try {
    // Bound the body even when the request does not include Content-Length.
    const reader = request.body?.getReader();
    if (!reader) return failure("Please complete all fields.", 400);
    const chunks: Uint8Array[] = [];
    let size = 0;
    try {
      while (true) {
        const { value, done } = await reader.read();
        if (done) break;
        size += value.byteLength;
        if (size > MAX_BODY_BYTES) {
          await reader.cancel();
          return failure("Your message is too large.", 413);
        }
        chunks.push(value);
      }
    } finally {
      reader.releaseLock();
    }
    payload = JSON.parse(Buffer.concat(chunks).toString("utf8"));
  } catch {
    return failure("Please submit a valid contact form.", 400);
  }

  if (!payload || typeof payload !== "object" || Array.isArray(payload)) {
    return failure("Please complete all fields.", 400);
  }
  const { name, email, message, website } = payload as Record<string, unknown>;
  // This hidden field is left empty by visitors; simple form bots often fill it.
  if (typeof website === "string" && website.trim()) return success();
  if (
    typeof name !== "string" ||
    !name.trim() ||
    name.trim().length > 100 ||
    /[\r\n]/.test(name) ||
    typeof email !== "string" ||
    email.trim().length > 254 ||
    !/^[^\s@<>]+@[^\s@<>]+\.[^\s@<>]+$/.test(email.trim()) ||
    typeof message !== "string" ||
    message.trim().length < 10 ||
    message.trim().length > 3000
  ) {
    return failure(
      "Enter your name, a valid email, and a message between 10 and 3,000 characters.",
      400,
    );
  }

  const apiKey = process.env.RESEND_API_KEY?.trim();
  const from = process.env.RESEND_FROM_EMAIL?.trim();
  const to = process.env.CONTACT_TO_EMAIL?.trim();
  if (!apiKey || !from || !to) {
    return failure(
      "The contact form is temporarily unavailable. Please use the email link above.",
      503,
    );
  }

  try {
    const resend = new Resend(apiKey);
    const { data, error } = await resend.emails.send({
      from,
      to,
      replyTo: email.trim(),
      subject: `Portfolio message from ${name.trim()}`,
      text: `Name: ${name.trim()}\nEmail: ${email.trim()}\n\n${message.trim()}`,
    });
    if (error || !data?.id) {
      // Avoid logging visitors' messages, addresses, credentials, or provider details.
      console.error("Contact email was not accepted by Resend.");
      return failure(
        "Your message could not be sent. Please try again or use the email link above.",
        502,
      );
    }
    return success();
  } catch {
    console.error("Contact email service could not be reached.");
    return failure(
      "Your message could not be sent. Please try again or use the email link above.",
      502,
    );
  }
}
