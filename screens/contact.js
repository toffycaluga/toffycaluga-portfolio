import { lang } from "../i18n/lang.js";
import { clearScreen, drawPanel, drawTitle, drawFooterHints } from "../ui/draw.js";
import { LAYOUT } from "../ui/layout.js";
import { THEME } from "../ui/theme.js";
import { TYPO } from "../ui/typography.js";

const canvas = document.getElementById("gameCanvas");
if (!canvas) throw new Error("[contact] No se encontró #gameCanvas");

const ctx = canvas.getContext("2d");
if (!ctx) throw new Error("[contact] No se pudo obtener contexto 2D");

// ===============================
// API PÚBLICA
// ===============================
export function drawContactScreen() {
  render();
  showContactForm();
}

// ===============================
// RENDER
// ===============================
function render() {
  clearScreen(ctx, canvas);
  drawPanel(ctx, canvas);
  drawTitle(ctx, lang.menu_contact);

  drawInstructions();
  drawFooterHints(ctx, canvas, "Completa el formulario", lang.back_hint);
}

function drawInstructions() {
  let y = 100;

  ctx.fillStyle = THEME.colors.text;
  ctx.font = TYPO.font("text");

  ctx.fillText("Puedes contactarme directamente desde este formulario.", LAYOUT.contentPadding, y);
  y += 30;

  ctx.fillText("Responderé lo antes posible.", LAYOUT.contentPadding, y);
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
}

// Opcional: para ocultarlo desde fuera
export function hideContactForm() {
  const form = document.getElementById("contact-form");
  if (!form) return;

  form.style.display = "none";
  form.style.opacity = "0";
  form.style.pointerEvents = "none";
}
