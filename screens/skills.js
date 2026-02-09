import { lang } from "../i18n/lang.js";
import { playSound, sounds } from "../utils/sound.js";

import {
  clearScreen,
  drawPanel,
  drawTitle,
  drawFooterHints,
  wrapText,
} from "../ui/draw.js";
import { LAYOUT } from "../ui/layout.js";
import { THEME } from "../ui/theme.js";
import { TYPO } from "../ui/typography.js";

const canvas = document.getElementById("gameCanvas");
if (!canvas) throw new Error("[skills] No se encontró #gameCanvas");

const ctx = canvas.getContext("2d");
if (!ctx) throw new Error("[skills] No se pudo obtener contexto 2D");

// ===============================
// ESTADO
// ===============================
let selectedSkillIndex = 0;
let currentSkills = [];
let scrollOffset = 0;
let skillsMode = "list"; // "list" | "detail"

// animación slide
let transition = null; // { from, to, start, duration }
let rafId = null;

const visibleLines = 8;
const lineHeight = 44;

const nivelToValor = {
  Básico: 3,
  Intermedio: 6,
  Avanzado: 10,
  Basic: 3,
  Intermediate: 6,
  Advanced: 10,
};

const iconCache = new Map();

const getName = (s) => s?.nombre || s?.name || "";
const getLevel = (s) => s?.nivel || s?.level || "";
const getDescription = (s) => s?.descripcion || s?.description || "";
const getLogo = (s) => s?.logo || "";

// ===============================
// ICONOS
// ===============================
function preloadIcon(filename) {
  if (!filename || iconCache.has(filename)) return;

  const img = new Image();
  iconCache.set(filename, { img, status: "loading" });

  img.onload = () => {
    iconCache.set(filename, { img, status: "loaded" });
    renderSkills();
  };

  img.onerror = () => {
    iconCache.set(filename, { img, status: "error" });
    console.error("[skills] No se pudo cargar icono:", filename);
  };

  img.src = `./assets/icons/${filename}`;
}

// ===============================
// API
// ===============================
export function drawSkillsScreen(skills) {
  if (!Array.isArray(skills)) throw new Error("[skills] drawSkillsScreen esperaba un array");

  currentSkills = skills;
  selectedSkillIndex = 0;
  scrollOffset = 0;
  skillsMode = "list";
  transition = null;

  currentSkills.forEach((s) => preloadIcon(getLogo(s)));
  renderSkills();
}

export function handleSkillsInput(e) {
  if (!e?.key) return;

  const key = e.key;

  const isUp = key === "ArrowUp";
  const isDown = key === "ArrowDown";
  const isRight = key === "ArrowRight";
  const isLeft = key === "ArrowLeft";
  const isEnter = key === "Enter";
  const isEsc = key === "Escape";
  const isA = key === "a" || key === "A";
  const isB = key === "b" || key === "B";

  // si hay animación, ignoramos inputs para no romper
  if (transition) return;

  // ===============================
  // MODO DETALLE
  // ===============================
  if (skillsMode === "detail") {
    if (isLeft || isEsc || isB) {
      playSound?.(sounds?.back);
      startTransition("detail", "list");
    }
    return;
  }

  // ===============================
  // MODO LISTA
  // ===============================
  if (isDown && selectedSkillIndex < currentSkills.length - 1) {
    playSound?.(sounds?.click);
    selectedSkillIndex++;
    if (selectedSkillIndex >= scrollOffset + visibleLines) scrollOffset++;
    renderSkills();
    return;
  }

  if (isUp && selectedSkillIndex > 0) {
    playSound?.(sounds?.click);
    selectedSkillIndex--;
    if (selectedSkillIndex < scrollOffset) scrollOffset--;
    renderSkills();
    return;
  }

  // Abrir detalle SOLO con → / Enter / A
  if (isRight || isEnter || isA) {
    playSound?.(sounds?.enter);
    startTransition("list", "detail");
    return;
  }

  // Escape (menu) lo maneja game.js
}

// ===============================
// ANIMACIÓN
// ===============================
function easeOutCubic(t) {
  return 1 - Math.pow(1 - t, 3);
}

function startTransition(from, to) {
  transition = {
    from,
    to,
    start: performance.now(),
    duration: 220, // ms
  };

  if (rafId) cancelAnimationFrame(rafId);

  const tick = () => {
    renderSkills();
    if (transition) rafId = requestAnimationFrame(tick);
  };

  rafId = requestAnimationFrame(tick);
}

// ===============================
// RENDER
// ===============================
function renderSkills() {
  clearScreen(ctx, canvas);
  drawPanel(ctx, canvas);
  drawTitle(ctx, lang.menu_skills);

  // transición
  if (transition) {
    const now = performance.now();
    const raw = (now - transition.start) / transition.duration;
    const t = Math.min(Math.max(raw, 0), 1);
    const p = easeOutCubic(t);

    const slideW = canvas.width; // distancia de slide

    // list -> detail
    if (transition.from === "list" && transition.to === "detail") {
      // lista sale hacia la izquierda
      drawSkillsList(-p * slideW);

      // detalle entra desde la derecha
      drawSkillDetail((1 - p) * slideW);

      // footer durante animación (opcional: vacío)
      drawFooterHints(ctx, canvas, "", "");
    }

    // detail -> list
    if (transition.from === "detail" && transition.to === "list") {
      // detalle sale hacia la derecha
      drawSkillDetail(p * slideW);

      // lista entra desde la izquierda
      drawSkillsList(-(1 - p) * slideW);

      drawFooterHints(ctx, canvas, "", "");
    }

    // fin animación
    if (t >= 1) {
      skillsMode = transition.to;
      transition = null;
      if (rafId) cancelAnimationFrame(rafId);
      rafId = null;

      // render final limpio
      renderSkills();
    }

    return;
  }

  // render normal
  if (skillsMode === "detail") {
    drawSkillDetail(0);
    drawFooterHints(ctx, canvas, lang.skills_detail_back_hint, "");
    return;
  }

  drawSkillsList(0);
  drawFooterHints(ctx, canvas, lang.skills_nav_hint, lang.back_hint);
}

// ===============================
// LISTA (sin side panel)
// ===============================
function drawSkillsList(offsetX = 0) {
  ctx.save();
  ctx.translate(offsetX, 0);

  const listX = LAYOUT.contentPadding;
  const listY = 110;
  const rowW = 520;

  currentSkills.forEach((skill, index) => {
    const y = listY + (index - scrollOffset) * lineHeight;
    if (y < listY || y > canvas.height - 110) return;

    const name = getName(skill);
    const level = getLevel(skill);
    const logo = getLogo(skill);

    // Selección
    if (index === selectedSkillIndex) {
      ctx.fillStyle = THEME.colors.selectedBg;
      ctx.fillRect(listX - 10, y - 24, rowW, 38);
    }

    // Flecha a la derecha (todas)
    ctx.fillStyle = index === selectedSkillIndex ? THEME.colors.label : THEME.colors.hint;
    ctx.font = TYPO.font("label");
    // ✅ dentro del ancho de la fila (sin desbordar)
    ctx.fillText(">", listX - 10 + rowW + 70, y);

    // Icono
    if (logo) {
      const entry = iconCache.get(logo);
      if (entry?.status === "loaded") {
        ctx.drawImage(entry.img, listX, y - 24, 26, 26);
      }
    }

    // Nombre
    ctx.fillStyle = THEME.colors.label;
    ctx.font = TYPO.font("label");
    ctx.fillText(name, listX + 34, y);

    // Barra nivel (lista sí)
    const barX = listX + 260;
    const barY = y - 14;
    const barW = 160;
    const barH = 16;

    ctx.fillStyle = THEME.colors.barBg;
    ctx.fillRect(barX, barY, barW, barH);

    const filled = nivelToValor[level] ?? 0;
    ctx.fillStyle = THEME.colors.barFill;
    ctx.fillRect(barX, barY, (filled / 10) * barW, barH);

    // Texto nivel
    ctx.fillStyle = THEME.colors.hint;
    ctx.font = TYPO.font("footer");
    ctx.fillText(level, barX + barW + 10, y);
  });

  ctx.restore();
}

// ===============================
// DETALLE (aparece SOLO al entrar)
// ===============================
function drawSkillDetail(offsetX = 0) {
  const skill = currentSkills[selectedSkillIndex];
  if (!skill) return;

  ctx.save();
  ctx.translate(offsetX, 0);

  const name = getName(skill);
  const desc = getDescription(skill);
  const logo = getLogo(skill);

  const x = LAYOUT.contentPadding;
  const y = 120;
  const w = canvas.width - LAYOUT.contentPadding * 2;
  const h = canvas.height - 170;

  // Panel
  ctx.fillStyle = THEME.colors.panelBg;
  ctx.fillRect(x, y, w, h);
  ctx.strokeStyle = THEME.colors.panelBorder;
  ctx.lineWidth = 2;
  ctx.strokeRect(x, y, w, h);

  // Icono (si existe)
  if (logo) {
    preloadIcon(logo);
    const entry = iconCache.get(logo);
    if (entry?.status === "loaded") {
      ctx.drawImage(entry.img, x + 16, y + 16, 34, 34);
    }
  }

  // Título
  ctx.fillStyle = THEME.colors.label;
  ctx.font = TYPO.font("section");
  ctx.fillText(name, x + 60, y + 40);

  // ✅ SIN barra ni nivel en detalle (limpio)
  ctx.fillStyle = THEME.colors.text;
  ctx.font = TYPO.font("text");

  // subimos descripción para aprovechar espacio
  wrapText(ctx, String(desc ?? ""), x + 16, y + 85, {
    maxWidth: w - 32,
    lineHeight: LAYOUT.lineHeight,
    maxLines: 999,
  });

  ctx.restore();
}
