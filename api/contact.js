import { Resend } from "resend";

function isEmail(value) {
  return typeof value === "string" && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

function sanitize(str, max = 2000) {
  if (typeof str !== "string") return "";
  return str.replace(/\s+/g, " ").trim().slice(0, max);
}

export default async function handler(req, res) {
  try {
    if (req.method === "OPTIONS") return res.status(204).end();
    if (req.method !== "POST") return res.status(405).json({ ok: false, error: "Method not allowed" });

    const key = process.env.RESEND_API_KEY;
    const to = process.env.CONTACT_TO_EMAIL;
    const from = process.env.CONTACT_FROM_EMAIL;

    if (!key || !to || !from) {
      return res.status(500).json({
        ok: false,
        error: "Server not configured",
        missing: {
          RESEND_API_KEY: !key,
          CONTACT_TO_EMAIL: !to,
          CONTACT_FROM_EMAIL: !from,
        },
      });
    }

    const body = req.body || {};
    const { name, email, message, website } = body;

    if (website) return res.status(200).json({ ok: true, honeypot: true });

    const cleanName = sanitize(name, 80);
    const cleanEmail = sanitize(email, 120);
    const cleanMessage = sanitize(message, 4000);

    if (!cleanName || !cleanEmail || !cleanMessage) {
      return res.status(400).json({ ok: false, error: "Missing fields" });
    }

    if (!isEmail(cleanEmail)) {
      return res.status(400).json({ ok: false, error: "Invalid email" });
    }

    const resend = new Resend(key);

    const subject = `📩 New message from portfolio — ${cleanName}`;
    const html = `
      <div style="font-family:Arial,sans-serif;line-height:1.5">
        <h2>New portfolio message</h2>
        <p><strong>Name:</strong> ${cleanName}</p>
        <p><strong>Email:</strong> ${cleanEmail}</p>
        <p><strong>Message:</strong></p>
        <p style="white-space:pre-wrap">${cleanMessage}</p>
        <hr />
        <p style="color:#666;font-size:12px">Sent from your Vercel contact form.</p>
      </div>
    `;

    const result = await resend.emails.send({
      from,
      to,
      subject,
      html,
      headers: { "reply-to": cleanEmail },
    });

    if (result?.error) {
      return res.status(result.error.statusCode || 502).json({
        ok: false,
        error: "Email provider error",
        provider: result.error,
      });
    }

    return res.status(200).json({ ok: true, id: result?.data?.id });
  } catch (err) {
    console.error("[api/contact] crash:", err);
    return res.status(500).json({
      ok: false,
      error: "Server error",
      details: String(err?.message || err),
    });
  }
}
