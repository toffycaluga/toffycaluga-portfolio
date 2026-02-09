import { lang } from "../i18n/lang.js";
import { playSound, sounds } from "../utils/sound.js";

import { clearScreen, drawPanel, drawTitle, drawFooterHints } from "../ui/draw.js";
import { TYPO } from "../ui/typography.js";
import { THEME } from "../ui/theme.js";
import { LAYOUT } from "../ui/layout.js";

const canvas = document.getElementById("gameCanvas");
if (!canvas) throw new Error("[menu] No se encontró #gameCanvas");

const ctx = canvas.getContext("2d");
if (!ctx) throw new Error("[menu] No se pudo obtener contexto 2D");

// Este array DEBE coincidir con game.js
const menuOptions = [
  "menu_projects",
  "menu_skills",
  "menu_about",
  "menu_contact",
  "menu_language",
];

// ===============================
// API PÚBLICA
// ===============================
export function drawMenu(selectedOption = 0) {
  render(selectedOption);
}

// ===============================
// RENDER
// ===============================
function render(selectedOption) {
  clearScreen(ctx, canvas);
  drawPanel(ctx, canvas);

  drawTitle(ctx, lang.menu_title);

  drawOptions(selectedOption);
  drawFooterHints(ctx, canvas, "↑ ↓ Navegar", "Enter: Seleccionar");
}

// Opciones del menú
function drawOptions(selectedOption) {
  const startY = 140;
  const gap = 42;
  const centerX = canvas.width / 2;

  ctx.font = TYPO.font("section");
  ctx.textAlign = "center"; // 👈 clave

  menuOptions.forEach((key, index) => {
    const isSelected = index === selectedOption;

    ctx.fillStyle = isSelected
      ? THEME.colors.label
      : THEME.colors.title;

    ctx.fillText(
      lang[key],
      centerX,
      startY + index * gap
    );
  });

  // 🔁 restaurar estado
  ctx.textAlign = "left";
}
