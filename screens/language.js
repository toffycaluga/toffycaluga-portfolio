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

// Puedes extender esto a más idiomas sin tocar lógica
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

  // Opcional: volver atrás (si tu game.js lo permite)
  // if (e.key === "Escape") {
  //   playSound?.(sounds?.back);
  //   window.currentScreen = "menu";
  //   drawMenu(0);
  // }
}

async function applySelectedLanguage() {
  const choice = options[selectedLang];
  if (!choice?.code) throw new Error("[language] Idioma seleccionado inválido");

  console.log("[language] Setting language ->", choice.code);

  // Espera real para evitar que el menú se dibuje con lang vacío
  await setLanguage(choice.code);

  console.log("[language] currentLang =", window.currentLang);

  window.currentScreen = "menu";
  drawMenu(0); // si tu drawMenu necesita índice, pásalo; si no, puedes usar drawMenu()
}

// Render UI
function render() {
  clearScreen(ctx, canvas);
  drawPanel(ctx, canvas);

  // Título UI (sin hardcode del color/fuente)
  ctx.fillStyle = THEME.colors.title;
  ctx.font = TYPO.font("title");
  ctx.fillText("=== LANGUAGE ===", 180, 85);

  // Subtítulo / instrucción
  ctx.fillStyle = THEME.colors.text;
  ctx.font = TYPO.font("text");
  ctx.fillText("Selecciona tu idioma y presiona Enter / (A)", LAYOUT.contentPadding, 125);

  // Opciones
  const startY = 180;
  const gap = 40;

  options.forEach((opt, index) => {
    const isSelected = index === selectedLang;
    ctx.fillStyle = isSelected ? THEME.colors.label : THEME.colors.title;
    ctx.font = TYPO.font("section");
    ctx.fillText(opt.label, 320, startY + index * gap);
  });

  drawFooterHints(ctx, canvas, "↑ ↓ Cambiar", "Enter: Confirmar");
}
