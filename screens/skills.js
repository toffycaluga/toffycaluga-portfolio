import { lang } from "../i18n/lang.js";
import { playSound, sounds } from "./../utils/sound.js";

import { clearScreen, drawPanel, drawTitle, drawFooterHints, wrapText } from "../ui/draw.js";
import { LAYOUT } from "../ui/layout.js";
import { THEME } from "../ui/theme.js";
import { TYPO } from "../ui/typography.js";

const canvas = document.getElementById("gameCanvas");
if (!canvas) throw new Error("[skills] No se encontró #gameCanvas");

const ctx = canvas.getContext("2d");
if (!ctx) throw new Error("[skills] No se pudo obtener contexto 2D del canvas");

// ===============================
// ESTADO
// ===============================
let selectedSkillIndex = 0;
let currentSkills = [];
let scrollOffset = 0;

// Ajusta según tu layout
const visibleLines = 8;
const lineHeight = 44;

// Mapea niveles ES/EN al mismo valor numérico (0–10)
const nivelToValor = {
  Básico: 3,
  Intermedio: 6,
  Avanzado: 10,
  Basic: 3,
  Intermediate: 6,
  Advanced: 10,
};

// Cache real de imágenes (no placeholders). Evita recrear Image() por render
const iconCache = new Map(); // filename -> { img, status: "loading"|"loaded"|"error" }

// ===============================
// HELPERS DATA (bilingüe)
// ===============================
function getName(skill) {
  return skill?.nombre || skill?.name || "";
}

function getLevel(skill) {
  return skill?.nivel || skill?.level || "";
}

function getDescription(skill) {
  return skill?.descripcion || skill?.description || "";
}

function getLogo(skill) {
  return skill?.logo || "";
}

// ===============================
// VALIDACIONES (sin fallback)
// ===============================
function validateLangKeys() {
  if (!lang) console.error("[i18n] lang es undefined/null");
  if (!lang?.menu_skills) console.error("[i18n] Falta la key: lang.menu_skills", lang);
  if (!lang?.back_hint) console.error("[i18n] Falta la key: lang.back_hint", lang);
}

function validateSkill(skill, index) {
  if (!skill) {
    console.error(`[skills] Skill vacío en índice ${index}`);
    return;
  }
  if (!skill.nombre && !skill.name) {
    console.error(`[skills] Skill sin nombre en índice ${index}`, skill);
  }
  if (!skill.nivel && !skill.level) {
    console.error(`[skills] Skill sin nivel en índice ${index}`, skill);
  }
  if (!skill.descripcion && !skill.description) {
    console.warn(`[skills] Skill sin descripción en índice ${index}`, skill);
  }
  if (!skill.logo) {
    console.warn(`[skills] Skill sin logo en índice ${index}`, skill);
  }
}

function clampSelection() {
  if (!Array.isArray(currentSkills)) {
    console.error("[skills] currentSkills no es un array", currentSkills);
    currentSkills = [];
    selectedSkillIndex = 0;
    scrollOffset = 0;
    return;
  }

  if (selectedSkillIndex < 0 || selectedSkillIndex >= currentSkills.length) {
    console.error("[skills] selectedSkillIndex fuera de rango", {
      selectedSkillIndex,
      length: currentSkills.length,
    });
    selectedSkillIndex = 0;
    scrollOffset = 0;
  }
}

// ===============================
// ICONOS (carga real + logs)
// ===============================
function preloadIcon(filename, skillContext) {
  if (!filename) return;

  if (iconCache.has(filename)) return;

  const img = new Image();
  iconCache.set(filename, { img, status: "loading" });

  const src = `./assets/icons/${filename}`;

  img.onload = () => {
    iconCache.set(filename, { img, status: "loaded" });
    console.log(`[skills] Icono cargado OK: ${src}`);
    renderSkills(); // redibuja para que aparezca
  };

  img.onerror = () => {
    iconCache.set(filename, { img, status: "error" });
    console.error(`[skills] No se pudo cargar icono: ${src}`, "Skill:", skillContext);
  };

  img.src = src;
}

// ===============================
// API PÚBLICA
// ===============================
export function drawSkillsScreen(skills) {
  console.group("[skills] drawSkillsScreen");
  console.log("skills recibido:", skills);
  console.log("Array.isArray(skills):", Array.isArray(skills));
  console.groupEnd();

  validateLangKeys();

  if (!Array.isArray(skills)) {
    throw new Error("[skills] drawSkillsScreen esperaba un array de skills");
  }

  currentSkills = skills;

  selectedSkillIndex = 0;
  scrollOffset = 0;

  // Precarga iconos (real)
  currentSkills.forEach((s, i) => {
    validateSkill(s, i);
    preloadIcon(getLogo(s), s);
  });

  renderSkills();
}

export function handleSkillsInput(e) {
  if (!e?.key) return;

  if (!Array.isArray(currentSkills)) {
    console.error("[skills] currentSkills no es array en handleSkillsInput", currentSkills);
    return;
  }

  if (e.key === "ArrowDown") {
    playSound?.(sounds?.click);

    if (selectedSkillIndex < currentSkills.length - 1) {
      selectedSkillIndex++;

      if (selectedSkillIndex >= scrollOffset + visibleLines) {
        scrollOffset++;
      }

      console.log(
        `[skills] Selected: ${selectedSkillIndex + 1}/${currentSkills.length} (scrollOffset=${scrollOffset})`,
      );
      renderSkills();
    }
    return;
  }

  if (e.key === "ArrowUp") {
    playSound?.(sounds?.click);

    if (selectedSkillIndex > 0) {
      selectedSkillIndex--;

      if (selectedSkillIndex < scrollOffset) {
        scrollOffset--;
      }

      console.log(
        `[skills] Selected: ${selectedSkillIndex + 1}/${currentSkills.length} (scrollOffset=${scrollOffset})`,
      );
      renderSkills();
    }
    return;
  }

  // Escape lo maneja game.js (volver y limpiar)
  // Si igual quieres mantenerlo aquí, deja solo el cambio de pantalla.
  if (e.key === "Escape") {
    playSound?.(sounds?.back);
    window.currentScreen = "menu";
    import("./menu.js").then((module) => module.drawMenu(0));
  }
}

// ===============================
// RENDER
// ===============================
function renderSkills() {
  validateLangKeys();
  clampSelection();

  clearScreen(ctx, canvas);
  drawPanel(ctx, canvas);
  drawTitle(ctx, lang.menu_skills);

  drawSkillsList();
  drawSidePanel();

  drawFooterHints(ctx, canvas, "↑ ↓ Navegar", lang.back_hint);
}

function drawSkillsList() {
  const listX = LAYOUT.contentPadding;
  const listY = 110;

  // Fondo de área lista (opcional sutil)
  // ctx.fillStyle = "rgba(0,0,0,0.2)";
  // ctx.fillRect(listX - 10, listY - 30, 520, 420);

  currentSkills.forEach((skill, index) => {
    const y = listY + (index - scrollOffset) * lineHeight;
    if (y < listY || y > canvas.height - 110) return;

    validateSkill(skill, index);

    const name = getName(skill);
    const level = getLevel(skill);
    const logo = getLogo(skill);

    // Selección
    if (index === selectedSkillIndex) {
      ctx.fillStyle = THEME.colors.selectedBg;
      ctx.fillRect(listX - 10, y - 24, 520, 38);
    }

    // Icono (solo si cargó)
    if (logo) {
      preloadIcon(logo, skill);
      const entry = iconCache.get(logo);
      if (entry?.status === "loaded") {
        ctx.drawImage(entry.img, listX, y - 24, 26, 26);
      }
    }

    // Nombre
    ctx.fillStyle = THEME.colors.label;
    ctx.font = TYPO.font("label");
    ctx.fillText(name, listX + 34, y);

    // Barra nivel
    const barX = listX + 260;
    const barY = y - 14;
    const barW = 160;
    const barH = 16;

    ctx.fillStyle = THEME.colors.barBg;
    ctx.fillRect(barX, barY, barW, barH);

    const filled = nivelToValor[level];
    if (level && filled === undefined) {
      console.error(`[skills] Nivel no reconocido "${level}". Revisa nivelToValor o JSON.`, skill);
    }
    if (filled !== undefined) {
      ctx.fillStyle = THEME.colors.barFill;
      ctx.fillRect(barX, barY, (filled / 10) * barW, barH);
    }

    // Texto nivel
    ctx.fillStyle = THEME.colors.hint;
    ctx.font = TYPO.font("footer");
    ctx.fillText(level, barX + barW + 10, y);
  });
}

function drawSidePanel() {
  const selected = currentSkills[selectedSkillIndex];
  if (!selected) return;

  const panelX = 600;
  const panelY = 105;
  const panelW = 280;
  const panelH = 360;

  // Panel lateral
  ctx.fillStyle = THEME.colors.panelBg;
  ctx.fillRect(panelX, panelY, panelW, panelH);

  ctx.strokeStyle = THEME.colors.panelBorder;
  ctx.strokeRect(panelX, panelY, panelW, panelH);

  const name = getName(selected);
  const desc = getDescription(selected);

  // Título skill
  ctx.fillStyle = THEME.colors.label;
  ctx.font = TYPO.font("section");
  ctx.fillText(name, panelX + 12, panelY + 30);

  // Descripción
  if (desc != null && typeof desc !== "string") {
    console.error("[skills] La descripción no es string. Revisa JSON:", desc, selected);
  }

  ctx.fillStyle = THEME.colors.text;
  ctx.font = TYPO.font("text");

  wrapText(ctx, canvas, String(desc ?? ""), panelX + 12, panelY + 60);
}
