import { lang } from "../i18n/lang.js";
import {
  clearScreen,
  drawPanel,
  drawTitle,
  drawFooterHints,
  wrapText, // ✅ IMPORTANTE
} from "../ui/draw.js";
import { LAYOUT } from "../ui/layout.js";
import { THEME } from "../ui/theme.js";
import { TYPO } from "../ui/typography.js";

const canvas = document.getElementById("gameCanvas");
if (!canvas) throw new Error("[contact] No se encontró #gameCanvas");

const ctx = canvas.getContext("2d");
if (!ctx) throw new Error("[contact] No se pudo obtener contexto 2D");

// Guarda dónde termina el texto para ubicar el formulario debajo
let instructionsBottomY = 0;

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

  instructionsBottomY = drawInstructions();

  drawFooterHints(ctx, canvas, lang.contact_footer_hint, lang.back_hint);
}

function drawInstructions() {
  // Posición inicial del texto (ajústala si quieres)
  let y = 95;

  ctx.fillStyle = THEME.colors.text;
  ctx.font = TYPO.font("text");

  const maxWidth = canvas.width - LAYOUT.contentPadding * 2;

  // 1) línea / párrafo 1 (con wrap)
  wrapText(ctx, String(lang.contact_instructions_1 ?? ""), LAYOUT.contentPadding, y, {
    maxWidth,
    lineHeight: 24, // ✅ más compacto
    maxLines: 4,    // evita que se coma la pantalla si el texto es enorme
  });

  // Estimación simple de cuánto avanzó (si tu wrapText no retorna líneas)
  // Si tu wrapText sí retorna "linesUsed", me lo dices y lo hacemos perfecto.
  const p1Lines = estimateLines(String(lang.contact_instructions_1 ?? ""), maxWidth);
  y += p1Lines * 24 + 10;

  // 2) línea / párrafo 2 (con wrap)
  wrapText(ctx, String(lang.contact_instructions_2 ?? ""), LAYOUT.contentPadding, y, {
    maxWidth,
    lineHeight: 24,
    maxLines: 4,
  });

  const p2Lines = estimateLines(String(lang.contact_instructions_2 ?? ""), maxWidth);
  y += p2Lines * 24;

  return y; // ✅ esto es donde termina el texto
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

  // ✅ Colocarlo debajo del texto (en vez de fijo "20px")
  const top = Math.min(instructionsBottomY + 14, canvas.height - 380);
  form.style.marginTop = `${top - 165}px`; // 95 = y inicial aproximado del bloque

  form.style.marginLeft = "auto";
  form.style.marginRight = "auto";
}

// Opcional: para ocultarlo desde fuera
export function hideContactForm() {
  const form = document.getElementById("contact-form");
  if (!form) return;

  form.style.display = "none";
  form.style.opacity = "0";
  form.style.pointerEvents = "none";
}

// ===============================
// Helper: estimar líneas según ancho (para avanzar Y)
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
