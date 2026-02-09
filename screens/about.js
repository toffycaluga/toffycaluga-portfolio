import { lang } from "../i18n/lang.js";
import { clearScreen, drawPanel, drawTitle, drawFooterHints, wrapText } from "../ui/draw.js";
import { LAYOUT } from "../ui/layout.js";
import { THEME } from "../ui/theme.js";
import { TYPO } from "../ui/typography.js";

const canvas = document.getElementById("gameCanvas");
if (!canvas) throw new Error("[about] No se encontró #gameCanvas");

const ctx = canvas.getContext("2d");
if (!ctx) throw new Error("[about] No se pudo obtener contexto 2D");

// Estado interno
let aboutData = null;
let page = 1;
const totalPages = 3;

export function drawAboutScreen(data) {
  aboutData = data;
  page = 1;
  render();
}

export function handleAboutInput(e) {
  if (!e?.key) return;

  if (e.key === "ArrowRight") {
    if (page < totalPages) {
      page++;
      render();
    }
    return;
  }

  if (e.key === "ArrowLeft") {
    if (page > 1) {
      page--;
      render();
    }
    return;
  }

  // Escape lo maneja game.js
}

function render() {
  if (!aboutData) {
    console.error("[about] No hay datos para renderizar");
    return;
  }

  clearScreen(ctx, canvas);
  drawPanel(ctx, canvas);

  // Título paginado
  const title = `${lang.about_title || "Sobre mí"} (${page}/${totalPages})`;
  drawTitle(ctx, title);

  // Área útil
  const left = LAYOUT.contentPadding;
  const top = 110;
  const maxWidth = canvas.width - left * 2 - 30; // margen interno real
  const lineHeight = LAYOUT.lineHeight || 26;

  // Encabezado sección
  ctx.fillStyle = THEME.colors.label;
  ctx.font = TYPO.font("section");

  let y = top;

  if (page === 1) {
    // ===============================
    // PAGE 1: Identidad + Bio
    // ===============================
    ctx.fillText(lang.about_name_label || "Nombre", left, y);
    y += 30;

    ctx.fillStyle = THEME.colors.text;
    ctx.font = TYPO.font("text");
    y = wrapText(ctx, aboutData.nombre_real || "", left, y, { maxWidth, lineHeight });
    y += 14;

    ctx.fillStyle = THEME.colors.label;
    ctx.font = TYPO.font("section");
    ctx.fillText(lang.about_stage_name_label || "Alias", left, y);
    y += 30;

    ctx.fillStyle = THEME.colors.text;
    ctx.font = TYPO.font("text");
    y = wrapText(ctx, aboutData.nombre_artistico || "", left, y, { maxWidth, lineHeight });
    y += 18;

    ctx.fillStyle = THEME.colors.label;
    ctx.font = TYPO.font("section");
    ctx.fillText(lang.about_description_label || "Bio", left, y);
    y += 30;

    ctx.fillStyle = THEME.colors.text;
    ctx.font = TYPO.font("text");
    y = wrapText(ctx, aboutData.descripcion || "", left, y, { maxWidth, lineHeight, maxLines: 9 });
  }

  if (page === 2) {
    // ===============================
    // PAGE 2: Experiencia
    // ===============================
    ctx.fillText(lang.about_experience_label || "Experiencia", left, y);
    y += 34;

    ctx.fillStyle = THEME.colors.text;
    ctx.font = TYPO.font("text");

    const exp = Array.isArray(aboutData.experiencia) ? aboutData.experiencia : [];
    exp.forEach((item) => {
      y = wrapText(ctx, `• ${item}`, left, y, { maxWidth, lineHeight });
      y += 6; // separación bullets real
    });
  }

  if (page === 3) {
    // ===============================
    // PAGE 3: Estado actual + Contacto
    // ===============================
    ctx.fillText(lang.about_status_label || "Estado actual", left, y);
    y += 34;

    ctx.fillStyle = THEME.colors.text;
    ctx.font = TYPO.font("text");

    const status = Array.isArray(aboutData.estado_actual) ? aboutData.estado_actual : [];
    status.forEach((item) => {
      y = wrapText(ctx, `• ${item}`, left, y, { maxWidth, lineHeight });
      y += 6;
    });

    y += 12;

    // Contacto (si lo quieres visible)
    if (aboutData.contacto) {
      ctx.fillStyle = THEME.colors.label;
      ctx.font = TYPO.font("section");
      ctx.fillText(lang.about_contact_label || "Contacto", left, y);
      y += 34;

      ctx.fillStyle = THEME.colors.text;
      ctx.font = TYPO.font("text");

      const email = aboutData.contacto.email ? `• Email: ${aboutData.contacto.email}` : "";
      const web = aboutData.contacto.portafolio ? `• Web: ${aboutData.contacto.portafolio}` : "";
      const li = aboutData.contacto.linkedin ? `• LinkedIn: ${aboutData.contacto.linkedin}` : "";

      [email, web, li].filter(Boolean).forEach((line) => {
        y = wrapText(ctx, line, left, y, { maxWidth, lineHeight });
        y += 6;
      });
    }
  }

  drawFooterHints(ctx, canvas, "← → Cambiar sección", lang.back_hint || "ESC para volver");
}
