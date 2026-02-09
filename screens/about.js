import { lang } from "../i18n/lang.js";
import { LAYOUT } from "../ui/layout.js";
import { clearScreen, drawPanel, drawTitle, drawFooterHints, drawLabelValue, wrapText } from "../ui/draw.js";

const canvas = document.getElementById("gameCanvas");
if (!canvas) throw new Error("[about] No se encontró #gameCanvas");

const ctx = canvas.getContext("2d");
if (!ctx) throw new Error("[about] No se pudo obtener contexto 2D");

let currentPage = 0;
let aboutData = null;

const PAGES = ["profile", "experience", "status"];

export function drawAboutScreen(data) {
  if (!data) throw new Error("[about] No se recibió data");
  aboutData = data;
  currentPage = 0;
  render();
}

export function handleAboutInput(e) {
  if (e.key === "ArrowDown") {
    currentPage = (currentPage + 1) % PAGES.length;
    render();
  } else if (e.key === "ArrowUp") {
    currentPage = (currentPage - 1 + PAGES.length) % PAGES.length;
    render();
  }
}

function render() {
  clearScreen(ctx, canvas);
  drawPanel(ctx, canvas);
  drawTitle(ctx, lang.about_title, `${currentPage + 1}/${PAGES.length}`);

  switch (PAGES[currentPage]) {
    case "profile":
      drawProfile();
      break;
    case "experience":
      drawExperience();
      break;
    case "status":
      drawStatus();
      break;
  }

  drawFooterHints(ctx, canvas, "↑ ↓ Cambiar sección", lang.back_hint);
}

function drawProfile() {
  let y = 80;

  drawLabelValue(ctx, lang.about_name_label, aboutData.nombre_real, LAYOUT.contentPadding, y);
  y += 30;

  drawLabelValue(ctx, lang.about_stage_name_label, aboutData.nombre_artistico, LAYOUT.contentPadding, y);
  y += 40;

  // Título sección
  ctx.fillText(lang.about_description_label, LAYOUT.contentPadding, y);
  y += 25;

  wrapText(ctx, canvas, aboutData.descripcion, LAYOUT.contentPadding, y);
}

function drawExperience() {
  let y = 90;

  ctx.fillText(lang.about_experience_label, LAYOUT.contentPadding, y);
  y += 30;

  aboutData.experiencia.forEach((item) => {
    wrapText(ctx, canvas, `• ${item}`, LAYOUT.contentPadding, y);
    y += 45;
  });
}

function drawStatus() {
  let y = 90;

  ctx.fillText(lang.about_status_label, LAYOUT.contentPadding, y);
  y += 30;

  aboutData.estado_actual.forEach((item) => {
    wrapText(ctx, canvas, `• ${item}`, LAYOUT.contentPadding, y);
    y += 35;
  });
}
