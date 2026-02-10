import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

function isEmail(value) {
  return typeof value === "string" && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

function sanitize(str, max = 2000) {
  if (typeof str !== "string") return "";
  return str.replace(/\s+/g, " ").trim().slice(0, max);
}

export default async function handler(req, res) {
  // CORS
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") return res.status(204).end();
  if (req.method !== "POST")
    return res.status(405).json({ ok: false, error: "Method not allowed" });

  try {
    const { name, email, message, website } = req.body || {};

    // Logs mínimos de request
    console.log("[api/contact] POST /api/contact");
    console.log("[api/contact] body keys:", Object.keys(req.body || {}));
    console.log("[api/contact] honeypot website present:", Boolean(website));

    // Honeypot
    if (website) {
      console.log("[api/contact] honeypot triggered -> returning ok:true without sending");
      return res.status(200).json({ ok: true, honeypot: true });
    }

    const cleanName = sanitize(name, 80);
    const cleanEmail = sanitize(email, 120);
    const cleanMessage = sanitize(message, 4000);

    console.log("[api/contact] cleanName length:", cleanName.length);
    console.log("[api/contact] cleanEmail:", cleanEmail);
    console.log("[api/contact] cleanMessage length:", cleanMessage.length);

    if (!cleanName || !cleanEmail || !cleanMessage) {
      console.log("[api/contact] validation failed: Missing fields");
      return res.status(400).json({ ok: false, error: "Missing fields" });
    }

    if (!isEmail(cleanEmail)) {
      console.log("[api/contact] validation failed: Invalid email");
      return res.status(400).json({ ok: false, error: "Invalid email" });
    }

    const to = process.env.CONTACT_TO_EMAIL;
    const from = process.env.CONTACT_FROM_EMAIL;
    const key = process.env.RESEND_API_KEY;

    console.log("[api/contact] env to:", to);
    console.log("[api/contact] env from:", from);
    console.log("[api/contact] env RESEND_API_KEY present:", Boolean(key));

    if (!to || !from || !key) {
      console.log("[api/contact] server not configured (missing env vars)");
      return res.status(500).json({ ok: false, error: "Server not configured" });
    }

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

    console.log("[api/contact] sending email...");
    const result = await resend.emails.send({
      from,
      to,
      subject,
      html,
      headers: {
        "reply-to": cleanEmail,
      },
    });

    // Resend devuelve info útil aquí (id, error, etc.)
    console.log("[api/contact] resend result:", result);

    // Si la librería retorna { error: ... } aunque no lance excepción
    if (result?.error) {
      console.error("[api/contact] resend returned error:", result.error);
      return res.status(502).json({ ok: false, error: "Email provider error", provider: result.error });
    }

    console.log("[api/contact] done ok");
    return res.status(200).json({ ok: true, id: result?.data?.id || result?.id });
  } catch (err) {
    console.error("[api/contact] exception:", err);
    return res.status(500).json({
      ok: false,
      error: "Server error",
      details: String(err?.message || err),
    });
  }
}
