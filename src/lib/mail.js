import { Resend } from "resend";

// Email is abstracted so you can swap Resend for SMTP/Nodemailer later without
// touching the route handlers. If RESEND_API_KEY is unset, sends become no-ops
// (the quote/contact is still persisted to the DB) so local dev never breaks.

const apiKey = process.env.RESEND_API_KEY;
const resend = apiKey ? new Resend(apiKey) : null;

const FROM = process.env.MAIL_FROM || "AJS Baustoffe <onboarding@resend.dev>";
const TO = process.env.MAIL_TO || "info@ajsbaustoffe.de";

async function send({ subject, html, replyTo }) {
  if (!resend) {
    console.info("[mail] RESEND_API_KEY not set — skipping send:", subject);
    return { skipped: true };
  }
  try {
    const res = await resend.emails.send({
      from: FROM,
      to: TO,
      subject,
      html,
      replyTo,
    });
    return res;
  } catch (e) {
    // Never let a mail failure break the user-facing request.
    console.error("[mail] send failed:", e);
    return { error: String(e) };
  }
}

const esc = (s) =>
  String(s ?? "").replace(/[&<>"']/g, (c) =>
    ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c])
  );

export async function sendQuoteNotification(quote) {
  const rows = quote.lines
    .map(
      (l) =>
        `<tr><td style="padding:4px 12px 4px 0">${esc(l.name)}</td><td style="padding:4px 12px 4px 0;color:#6b7280">${esc(
          l.variation
        )}</td><td style="padding:4px 0;font-weight:600">${l.qty}×</td></tr>`
    )
    .join("");
  const html = `
    <div style="font-family:Helvetica,Arial,sans-serif;color:#111827">
      <h2 style="margin:0 0 4px">Neue Anfrage ${esc(quote.reference)}</h2>
      <p style="margin:0 0 16px;color:#6b7280">${esc(quote.contactName)}${
    quote.company ? " · " + esc(quote.company) : ""
  }</p>
      <table style="border-collapse:collapse;font-size:14px">${rows}</table>
      ${quote.note ? `<p style="margin-top:16px"><strong>Notiz:</strong> ${esc(quote.note)}</p>` : ""}
      <p style="margin-top:16px;font-size:13px;color:#6b7280">
        E-Mail: ${esc(quote.contactEmail)}${quote.contactPhone ? " · Tel: " + esc(quote.contactPhone) : ""}
      </p>
    </div>`;
  return send({
    subject: `Neue Anfrage ${quote.reference} — ${quote.contactName}`,
    html,
    replyTo: quote.contactEmail,
  });
}

export async function sendContactNotification(msg) {
  const html = `
    <div style="font-family:Helvetica,Arial,sans-serif;color:#111827">
      <h2 style="margin:0 0 4px">Neue Kontaktanfrage</h2>
      <p style="margin:0 0 16px;color:#6b7280">${esc(msg.name)}${msg.firma ? " · " + esc(msg.firma) : ""}</p>
      <p style="white-space:pre-wrap">${esc(msg.message)}</p>
      <p style="margin-top:16px;font-size:13px;color:#6b7280">Antwort an: ${esc(msg.email)}</p>
    </div>`;
  return send({
    subject: `Kontaktanfrage — ${msg.name}`,
    html,
    replyTo: msg.email,
  });
}
