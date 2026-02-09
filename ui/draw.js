import { THEME } from "./theme.js";
import { LAYOUT } from "./layout.js";
import { TYPO } from "./typography.js";

// Limpia canvas
export function clearScreen(ctx, canvas) {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = THEME.colors.bg;
  ctx.fillRect(0, 0, canvas.width, canvas.height);
}

// Dibuja panel principal (marco y fondo)
export function drawPanel(ctx, canvas) {
  const x = LAYOUT.framePadding;
  const y = LAYOUT.framePadding;
  const w = canvas.width - LAYOUT.framePadding * 2;
  const h = canvas.height - LAYOUT.framePadding * 2;

  // Fondo panel
  ctx.fillStyle = THEME.colors.panelBg;
  ctx.fillRect(x, y, w, h);

  // Borde
  ctx.strokeStyle = THEME.colors.panelBorder;
  ctx.lineWidth = 2;
  ctx.strokeRect(x, y, w, h);

  // Inner glow (suave)
  ctx.strokeStyle = THEME.colors.panelGlow;
  ctx.lineWidth = 1;
  ctx.strokeRect(x + 3, y + 3, w - 6, h - 6);
}

// Título estilo consola
export function drawTitle(ctx, titleText) {
  ctx.fillStyle = THEME.colors.title;
  ctx.font = TYPO.font("title");

  ctx.textAlign = "center";          // 👈 clave
  ctx.textBaseline = "top";

  const centerX = ctx.canvas.width / 2;

  ctx.fillText(
    `=== ${String(titleText).toUpperCase()} ===`,
    centerX,
    LAYOUT.topOffset
  );

  // 🔁 MUY importante: restaurar alineación por defecto
  ctx.textAlign = "left";
}


// Footer/hints
export function drawFooterHints(ctx, canvas, leftHint = "", rightHint = "") {
  const y = canvas.height - LAYOUT.bottomOffset;

  ctx.font = TYPO.font("footer");

  // Izquierda
  ctx.fillStyle = THEME.colors.hint;
  if (leftHint) ctx.fillText(leftHint, LAYOUT.contentPadding, y);

  // Derecha
  if (rightHint) {
    const width = ctx.measureText(rightHint).width;
    ctx.fillText(rightHint, canvas.width - LAYOUT.contentPadding - width, y);
  }
}

/**
 * Wrap real: dibuja y devuelve el nextY real.
 * IMPORTANT: ctx.font debe estar seteado antes de llamar a wrapText().
 */
export function wrapText(ctx, text, x, y, {
  maxWidth = 600,
  lineHeight = 22,
  maxLines = Infinity,
} = {}) {
  const safeText = String(text ?? "");
  const words = safeText.split(/\s+/).filter(Boolean);

  let line = "";
  let linesUsed = 0;

  for (let i = 0; i < words.length; i++) {
    const testLine = line ? `${line} ${words[i]}` : words[i];
    const width = ctx.measureText(testLine).width;

    if (width > maxWidth && line) {
      ctx.fillText(line, x, y);
      y += lineHeight;
      linesUsed++;

      if (linesUsed >= maxLines) return y;

      line = words[i];
    } else {
      line = testLine;
    }
  }

  if (line && linesUsed < maxLines) {
    ctx.fillText(line, x, y);
    y += lineHeight;
    linesUsed++;
  }

  return y; // ✅ nextY real
}
