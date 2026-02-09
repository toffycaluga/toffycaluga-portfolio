// ui/draw.js
import { THEME } from "./theme.js";
import { TYPO } from "./typography.js";
import { LAYOUT } from "./layout.js";

export function clearScreen(ctx, canvas) {
  ctx.fillStyle = THEME.colors.bg;
  ctx.fillRect(0, 0, canvas.width, canvas.height);
}

export function drawPanel(ctx, canvas) {
  const pad = LAYOUT.framePadding;

  ctx.fillStyle = THEME.colors.panelBg;
  ctx.fillRect(pad, LAYOUT.topOffset, canvas.width - pad * 2, canvas.height - LAYOUT.bottomOffset);

  ctx.strokeStyle = THEME.colors.panelBorder;
  ctx.strokeRect(pad, LAYOUT.topOffset, canvas.width - pad * 2, canvas.height - LAYOUT.bottomOffset);
}

export function drawTitle(ctx, text, pageInfo = "") {
  ctx.fillStyle = THEME.colors.title;
  ctx.font = TYPO.font("title");
  const suffix = pageInfo ? ` (${pageInfo})` : "";
  ctx.fillText(`=== ${text.toUpperCase()}${suffix} ===`, 90, 35);
}

export function drawFooterHints(ctx, canvas, leftText, rightText) {
  ctx.fillStyle = THEME.colors.hint;
  ctx.font = TYPO.font("footer");
  ctx.fillText(leftText, LAYOUT.contentPadding, canvas.height - 35);
  ctx.fillText(rightText, canvas.width - 220, canvas.height - 35);
}

export function drawLabelValue(ctx, label, value, x, y) {
  ctx.fillStyle = THEME.colors.label;
  ctx.font = TYPO.font("label");
  ctx.fillText(`${label}:`, x, y);

  ctx.fillStyle = THEME.colors.value;
  ctx.font = TYPO.font("label");
  ctx.fillText(value, x + ctx.measureText(`${label}: `).width + 10, y);
}

export function wrapText(ctx, canvas, text, x, y) {
  const maxWidth = canvas.width - LAYOUT.contentPadding * 2;
  const words = String(text).split(" ");
  let line = "";

  ctx.font = TYPO.font("text");
  ctx.fillStyle = THEME.colors.text;

  for (const word of words) {
    const testLine = line + word + " ";
    const { width } = ctx.measureText(testLine);

    if (width > maxWidth) {
      ctx.fillText(line, x, y);
      line = word + " ";
      y += LAYOUT.lineHeight;
    } else {
      line = testLine;
    }
  }

  if (line) ctx.fillText(line, x, y);
  return y; // por si quieres continuar abajo
}
