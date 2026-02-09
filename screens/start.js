import { lang } from "../i18n/lang.js";

import { clearScreen, drawPanel, drawFooterHints } from "../ui/draw.js";
import { TYPO } from "../ui/typography.js";
import { THEME } from "../ui/theme.js";
import { LAYOUT } from "../ui/layout.js";

const canvas = document.getElementById("gameCanvas");
if (!canvas) throw new Error("[start] No se encontró #gameCanvas");

const ctx = canvas.getContext("2d");
if (!ctx) throw new Error("[start] No se pudo obtener contexto 2D");

// ===============================
// API PÚBLICA
// ===============================
export function drawStartScreen() {
  render();
}

// ===============================
// RENDER
// ===============================
function render() {
  clearScreen(ctx, canvas);
  drawPanel(ctx, canvas);

  drawTitle();
  drawPrompt();

  drawFooterHints(ctx, canvas, "", "Enter / (A)");
}

function drawTitle() {
  ctx.fillStyle = THEME.colors.title;
  ctx.font = TYPO.font("section");

  ctx.fillText(
    lang.start_title,
    LAYOUT.contentPadding + 60,
    canvas.height / 2 - 30
  );
}

function drawPrompt() {
  ctx.fillStyle = THEME.colors.text;
  ctx.font = TYPO.font("text");

  ctx.fillText(
    lang.start_prompt,
    LAYOUT.contentPadding + 60,
    canvas.height / 2 + 10
  );
}
