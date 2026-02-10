import { lang } from "../i18n/lang.js";
import {
  clearScreen,
  drawPanel,
  drawTitle,
  drawFooterHints,
  wrapText,
} from "../ui/draw.js";
import { LAYOUT } from "../ui/layout.js";
import { THEME } from "../ui/theme.js";
import { TYPO } from "../ui/typography.js";

const canvas = document.getElementById("gameCanvas");
if (!canvas) throw new Error("[contact] No se encontró #gameCanvas");

const ctx = canvas.getContext("2d");
if (!ctx) throw new Error("[contact] No se pudo obtener contexto 2D");

let instructionsBottomY = 0;

// ===============================
// API PÚBLICA
// ===============================
export function drawContactScreen() {
  render();
  showContactForm();
  bindContactSubmit();
}

// ===============================
// RENDER
// ===============================
function render() {
  clearScreen(ctx, canvas);
  drawPanel(ctx, canvas);
  drawTitle(ctx, lang.menu_contact);

  instructionsBottomY = drawInstructions();
  drawFooterHints(ctx, canvas, lang.contact_footer_hint, lang.back_hint);
}

function drawInstructions() {
  let y = 95;

  ctx.fillStyle = THEME.colors.text;
  ctx.font = TYPO.font("text");

  const maxWidth = canvas.width - LAYOUT.contentPadding * 2;
  const lineHeight = 24;

  const t1 = String(lang.contact_instructions_1 ?? "");
  wrapText(ctx, t1, LAYOUT.contentPadding, y, { maxWidth, lineHeight, maxLines: 6 });
  y += estimateLines(t1, maxWidth) * lineHeight + 10;

  const t2 = String(lang.contact_instructions_2 ?? "");
  wrapText(ctx, t2, LAYOUT.contentPadding, y, { maxWidth, lineHeight, maxLines: 6 });
  y += estimateLines(t2, maxWidth) * lineHeight;

  return y;
}

// ===============================
// FORMULARIO HTML
// ===============================
function showContactForm() {
  const form = document.getElementById("contact-form");
  if (!form) {
    console.error("[contact] No se encontró #contact-form en el DOM");
    return;
  }

  form.style.display = "flex";
  form.style.opacity = "1";
  form.style.pointerEvents = "auto";

  form.style.maxWidth = "360px";
  form.style.width = "80%";

  // Colocar debajo del texto (sin chocar con footer)
  const formTop = Math.min(instructionsBottomY + 18, canvas.height - 380);

  // Como el form está overlay sobre el canvas, marginTop funciona relativo a su flujo.
  // Ajuste: el texto empieza cerca de 95, por eso restamos ese "origen".
  form.style.marginTop = `${Math.max(16, formTop - 160)}px`;

  form.style.marginLeft = "auto";
  form.style.marginRight = "auto";
}

export function hideContactForm() {
  const form = document.getElementById("contact-form");
  if (!form) return;

  form.style.display = "none";
  form.style.opacity = "0";
  form.style.pointerEvents = "none";
}

// ===============================
// ENVÍO REAL (Vercel API)
// ===============================
function bindContactSubmit() {
  const form = document.getElementById("contact-form");
  if (!form) return;

  if (form.dataset.bound === "1") return;
  form.dataset.bound = "1";

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const btn = document.getElementById("contact-submit");
    const originalText = btn?.textContent ?? "Enviar";

    const name = form.querySelector('[name="name"]')?.value?.trim() ?? "";
    const email = form.querySelector('[name="email"]')?.value?.trim() ?? "";
    const message = form.querySelector('[name="message"]')?.value?.trim() ?? "";
    const website = form.querySelector('[name="website"]')?.value ?? ""; // honeypot

    if (!name || !email || !message) {
      showContactToast(false, lang?.contact_error_fields ?? "❌ Completa todos los campos.");
      return;
    }

    try {
      if (btn) {
        btn.disabled = true;
        btn.textContent = lang?.sending ?? "Enviando...";
      }

      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, message, website }),
      });

      const data = await res.json().catch(() => ({}));

      if (!res.ok || !data?.ok) {
        throw new Error(data?.error || "Request failed");
      }

      form.reset();
      showContactToast(true, lang?.contact_success ?? "✅ Mensaje enviado. Te respondo lo antes posible.");
    } catch (err) {
      console.error("[contact] submit error:", err);
      showContactToast(false, lang?.contact_error ?? "❌ Error al enviar. Intenta de nuevo.");
    } finally {
      if (btn) {
        btn.disabled = false;
        btn.textContent = lang?.send ?? originalText;
      }
    }
  });
}

function showContactToast(ok, text) {
  const toast = document.getElementById("contact-toast");
  if (!toast) {
    alert(text);
    return;
  }

  toast.textContent = text;
  toast.dataset.kind = ok ? "ok" : "err";
  toast.style.display = "block";
  toast.style.opacity = "1";

  clearTimeout(showContactToast._t1);
  clearTimeout(showContactToast._t2);

  showContactToast._t1 = setTimeout(() => {
    toast.style.opacity = "0";
    showContactToast._t2 = setTimeout(() => (toast.style.display = "none"), 250);
  }, 2600);
}

// ===============================
// Helper: estimar líneas para el Y
// ===============================
function estimateLines(text, maxWidth) {
  const words = String(text ?? "").split(/\s+/).filter(Boolean);
  if (!words.length) return 1;

  let lines = 1;
  let line = "";

  ctx.font = TYPO.font("text");

  for (const w of words) {
    const test = line ? `${line} ${w}` : w;
    const testW = ctx.measureText(test).width;

    if (testW > maxWidth) {
      lines++;
      line = w;
    } else {
      line = test;
    }
  }

  return Math.max(1, lines);
}
