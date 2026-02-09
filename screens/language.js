import { setLanguage } from "../i18n/lang.js";
import { playSound, sounds } from "../utils/sound.js";
import { drawMenu } from "./menu.js";

import { clearScreen, drawPanel, drawTitle, drawFooterHints } from "../ui/draw.js";
import { TYPO } from "../ui/typography.js";
import { THEME } from "../ui/theme.js";
import { LAYOUT } from "../ui/layout.js";

const canvas = document.getElementById("gameCanvas");
if (!canvas) throw new Error("[language] No se encontró #gameCanvas");

const ctx = canvas.getContext("2d");
if (!ctx) throw new Error("[language] No se pudo obtener contexto 2D");

// Estado
let selectedLang = 0;

const options = [
  { label: "Español", code: "es" },
  { label: "English", code: "en" },
];

export function drawLanguageScreen() {
  render();
}

export function handleLanguageInput(e) {
  if (!e?.key) return;

  if (e.key === "ArrowUp") {
    playSound?.(sounds?.click);
    selectedLang = (selectedLang - 1 + options.length) % options.length;
    render();
    return;
  }

  if (e.key === "ArrowDown") {
    playSound?.(sounds?.click);
    selectedLang = (selectedLang + 1) % options.length;
    render();
    return;
  }

  if (e.key === "Enter") {
    playSound?.(sounds?.enter);
    applySelectedLanguage().catch((err) =>
      console.error("[language] Error aplicando idioma:", err)
    );
    return;
  }
}

async function applySelectedLanguage() {
  const choice = options[selectedLang];
  if (!choice?.code) throw new Error("[language] Idioma seleccionado inválido");

  console.log("[language] Setting language ->", choice.code);

  await setLanguage(choice.code);

  console.log("[language] currentLang =", window.currentLang);

  window.currentScreen = "menu";
  drawMenu(0);
}

function render() {
  clearScreen(ctx, canvas);
  drawPanel(ctx, canvas);

  // ✅ Título centrado (ya lo hace drawTitle)
  drawTitle(ctx, "Language");

  // ✅ Subtítulo centrado
  ctx.fillStyle = THEME.colors.text;
  ctx.font = TYPO.font("text");

  ctx.textAlign = "center";
  const centerX = canvas.width / 2;

  ctx.fillText(
    "Selecciona tu idioma y presiona Enter / (A)",
    centerX,
    125
  );

  // ✅ Opciones centradas
  const startY = 190;
  const gap = 40;

  ctx.font = TYPO.font("section");

  options.forEach((opt, index) => {
    const isSelected = index === selectedLang;
    ctx.fillStyle = isSelected ? THEME.colors.label : THEME.colors.title;
    ctx.fillText(opt.label, centerX, startY + index * gap);
  });

  // 🔁 restaurar
  ctx.textAlign = "left";

  drawFooterHints(ctx, canvas, "↑ ↓ Cambiar", "Enter: Confirmar");
}
