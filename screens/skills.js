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
const getCategory = (s) => s?.categoria || s?.category || "";
const getStatus = (s) => s?.estado || s?.status || "";
const getPrimary = (s) => s?.principal ?? s?.primary ?? false;
const getUsedInProjects = (s) => s?.usado_en_proyectos || s?.used_in_projects || [];
const getExperienceType = (s) => s?.tipo_experiencia || s?.experience_type || "";


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

  const category = getCategory(skill);
  const level = getLevel(skill);
  const status = getStatus(skill);
  const primary = getPrimary(skill);
  const usedIn = getUsedInProjects(skill);
  const expType = getExperienceType(skill);

  const x = LAYOUT.contentPadding;
  const y = 120;
  const w = canvas.width - LAYOUT.contentPadding * 2;
  const h = canvas.height - 170;

  // ===== Panel base =====
  ctx.fillStyle = THEME.colors.panelBg;
  ctx.fillRect(x, y, w, h);
  ctx.strokeStyle = THEME.colors.panelBorder;
  ctx.lineWidth = 2;
  ctx.strokeRect(x, y, w, h);

  const pad = 18;
  const innerX = x + pad;
  const innerY = y + pad;
  const innerW = w - pad * 2;

  // ===== Header =====
  const iconSize = 34;
  const titleX = innerX + iconSize + 12;
  const titleY = innerY + 18;

  // Icon
  if (logo) {
    preloadIcon(logo);
    const entry = iconCache.get(logo);
    if (entry?.status === "loaded") {
      ctx.drawImage(entry.img, innerX, innerY, iconSize, iconSize);
    } else {
      // placeholder suave (si aún carga)
      ctx.strokeStyle = THEME.colors.panelBorder;
      ctx.strokeRect(innerX, innerY, iconSize, iconSize);
    }
  }

  // Title
  ctx.fillStyle = THEME.colors.label;
  ctx.font = TYPO.font("section");
  ctx.fillText(name, titleX, titleY-20);

  // Línea separadora bajo header
  ctx.strokeStyle = THEME.colors.panelBorder;
  ctx.globalAlpha = 0.7;
  ctx.beginPath();
  ctx.moveTo(innerX, innerY + 48);
  ctx.lineTo(innerX + innerW, innerY + 48);
  ctx.stroke();
  ctx.globalAlpha = 1;

  // ===== Badges (chips) =====
  const chipY1 = innerY + 74;
  let chipX = innerX;

  const drawChip = (text, cx, cy) => {
    if (!text) return 0;

    ctx.font = TYPO.font("footer");
    const padX = 10;
    const chipH = 24;
    const textW = ctx.measureText(text).width;
    const chipW = textW + padX * 2;

    // fondo badge
    ctx.fillStyle = THEME.colors.selectedBg;
    ctx.fillRect(cx, cy - chipH + 6, chipW, chipH);

    // borde sutil
    ctx.strokeStyle = THEME.colors.panelBorder;
    ctx.globalAlpha = 0.6;
    ctx.strokeRect(cx, cy - chipH + 6, chipW, chipH);
    ctx.globalAlpha = 1;

    // texto
    ctx.fillStyle = THEME.colors.label;
    ctx.fillText(text, cx + padX, cy-15);

    return chipW + 10;
  };

  const chips = [
    category ? `Category: ${category}` : "",
    level ? `Level: ${level}` : "",
    status ? `Status: ${status}` : "",
    primary ? "Primary" : "",
  ].filter(Boolean);

  // si no caben, bajan a segunda fila
  let rowY = chipY1;
  chips.forEach((c) => {
    const testW = ctx.measureText(c).width + 20 + 10; // aprox chip
    if (chipX + testW > innerX + innerW) {
      chipX = innerX;
      rowY += 30;
    }
    chipX += drawChip(c, chipX, rowY);
  });

  // Cursor para secciones
  let cursorY = rowY + 34;

  const drawDivider = () => {
    ctx.strokeStyle = THEME.colors.panelBorder;
    ctx.globalAlpha = 0.5;
    ctx.beginPath();
    ctx.moveTo(innerX, cursorY);
    ctx.lineTo(innerX + innerW, cursorY);
    ctx.stroke();
    ctx.globalAlpha = 1;
    cursorY += 18;
  };

  const drawSectionTitle = (title) => {
    ctx.fillStyle = THEME.colors.label;
    ctx.font = TYPO.font("label");
    ctx.fillText(title, innerX, cursorY);
    cursorY += 18;
  };

  const drawParagraph = (text) => {
    ctx.fillStyle = THEME.colors.text;
    ctx.font = TYPO.font("text");
    wrapText(ctx, String(text ?? ""), innerX, cursorY, {
      maxWidth: innerW,
      lineHeight: LAYOUT.lineHeight,
      maxLines: 999,
    });
    // avance aproximado razonable
    const approxLines = Math.max(2, Math.min(10, Math.ceil(String(text ?? "").length / 52)));
    cursorY += approxLines * LAYOUT.lineHeight + 10;
  };

  const drawBullets = (items) => {
    if (!items?.length) return;
    ctx.fillStyle = THEME.colors.text;
    ctx.font = TYPO.font("text");

    items.forEach((item) => {
      // bullet
      ctx.fillText("•", innerX, cursorY);
      wrapText(ctx, String(item), innerX + 18, cursorY, {
        maxWidth: innerW - 18,
        lineHeight: LAYOUT.lineHeight,
        maxLines: 3,
      });
      // avance
      const approxLines = Math.max(1, Math.min(3, Math.ceil(String(item).length / 40)));
      cursorY += approxLines * LAYOUT.lineHeight;
    });

    cursorY += 8;
  };

  // ===== Secciones =====
  drawDivider();

  if (desc) {
    drawSectionTitle("Description");
    drawParagraph(desc);
  }

  if (Array.isArray(usedIn) && usedIn.length) {
    drawSectionTitle("Used in projects");
    drawBullets(usedIn);
  }

  if (expType) {
    drawSectionTitle("Experience type");
    drawParagraph(expType);
  }

  ctx.restore();
}
