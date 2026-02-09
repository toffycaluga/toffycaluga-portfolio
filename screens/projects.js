import { lang } from "../i18n/lang.js";

import { clearScreen, drawPanel, drawTitle, drawFooterHints, wrapText } from "../ui/draw.js";
import { LAYOUT } from "../ui/layout.js";
import { THEME } from "../ui/theme.js";
import { TYPO } from "../ui/typography.js";

const canvas = document.getElementById("gameCanvas");
if (!canvas) throw new Error("[projects] No se encontró #gameCanvas");

const ctx = canvas.getContext("2d");
if (!ctx) throw new Error("[projects] No se pudo obtener contexto 2D");

// Helpers
function safeGetLinksContainer() {
  const el = document.getElementById("project-links");
  if (!el) console.error("[projects] No se encontró #project-links en el DOM");
  return el;
}

function clearProjectLinks() {
  const linksContainer = safeGetLinksContainer();
  if (!linksContainer) return;
  linksContainer.replaceChildren();
}

function getCanvasTransform() {
  const canvasRect = canvas.getBoundingClientRect();
  const wrapper = canvas.parentElement;
  if (!wrapper) throw new Error("[projects] canvas.parentElement no existe (necesito .canvas-wrapper)");

  const wrapperRect = wrapper.getBoundingClientRect();

  const scaleX = canvasRect.width / canvas.width;
  const scaleY = canvasRect.height / canvas.height;

  const offsetX = canvasRect.left - wrapperRect.left;
  const offsetY = canvasRect.top - wrapperRect.top;

  return { scaleX, scaleY, offsetX, offsetY };
}

function createLink({ href, text, leftPx, topPx }) {
  const a = document.createElement("a");
  a.href = href;
  a.target = "_blank";
  a.rel = "noopener noreferrer";
  a.textContent = text;

  a.style.position = "absolute";
  a.style.left = `${leftPx}px`;
  a.style.top = `${topPx}px`;

  // Estilo básico coherente (idealmente lo mueves a CSS)
  a.style.color = THEME.colors.title;
  a.style.fontFamily = TYPO.family;
  a.style.fontSize = "14px";
  a.style.textDecoration = "none";

  a.addEventListener("mouseenter", () => (a.style.textDecoration = "underline"));
  a.addEventListener("mouseleave", () => (a.style.textDecoration = "none"));

  return a;
}

// ===============================
// API PÚBLICA
// ===============================
export function drawProjectsScreen(projects) {
  if (!Array.isArray(projects)) {
    throw new Error("[projects] drawProjectsScreen esperaba un array de proyectos");
  }

  clearProjectLinks();

  // Render base UI
  clearScreen(ctx, canvas);
  drawPanel(ctx, canvas);
  drawTitle(ctx, lang.menu_projects);

  // Dibujo listado + links sobre canvas
  renderProjects(projects);

  drawFooterHints(ctx, canvas, "Links encima del canvas", lang.back_hint);
}

// ===============================
// RENDER
// ===============================
function renderProjects(projects) {
  const linksContainer = safeGetLinksContainer();
  if (!linksContainer) return;

  const { scaleX, scaleY, offsetX, offsetY } = getCanvasTransform();

  // Layout del listado
  const startY = 110;
  const rowGap = 95;

  projects.forEach((proyecto, index) => {
    const baseY = startY + index * rowGap;

    // Título
    ctx.fillStyle = THEME.colors.label;
    ctx.font = TYPO.font("section");
    ctx.fillText(`• ${proyecto.titulo}`, LAYOUT.contentPadding, baseY);

    // Descripción (wrap)
    ctx.fillStyle = THEME.colors.text;
    ctx.font = TYPO.font("text");
    wrapText(ctx, canvas, proyecto.descripcion, LAYOUT.contentPadding, baseY + 26);

    // Link sobre canvas (posición calculada)
    if (proyecto.link) {
      const visibleLink = String(proyecto.link).replace(/^https?:\/\//, "");

      // Posición del link alineada con la descripción (aprox)
      const linkX = (LAYOUT.contentPadding + 10) * scaleX + offsetX;
      const linkY = (baseY + 48) * scaleY + offsetY;

      const a = createLink({
        href: proyecto.link,
        text: visibleLink,
        leftPx: linkX,
        topPx: linkY,
      });

      linksContainer.appendChild(a);
    } else {
      console.warn("[projects] Proyecto sin link:", proyecto);
    }
  });
}
