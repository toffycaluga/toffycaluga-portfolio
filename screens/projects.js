import { lang } from "../i18n/lang.js";

const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

export function drawProjectsScreen(projects) {
  // Limpia canvas
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = "#000";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Título
  ctx.fillStyle = "#00ff88";
  ctx.font = "35px monospace";
  ctx.fillText(`=== ${lang.menu_projects.toUpperCase()} ===`, 230, 40);

  // Limpia links anteriores
  const linksContainer = document.getElementById("project-links");
  linksContainer.innerHTML = "";

  // Escalado y offset relativo a .canvas-wrapper
  const canvasRect = canvas.getBoundingClientRect();
  const wrapperRect = canvas.parentElement.getBoundingClientRect();

  const scaleX = canvasRect.width / canvas.width;
  const scaleY = canvasRect.height / canvas.height;

  const offsetX = canvasRect.left - wrapperRect.left;
  const offsetY = canvasRect.top - wrapperRect.top;

  projects.forEach((proyecto, index) => {
    const baseY = 80 + index * 100;

    // Título en canvas
    ctx.fillStyle = "#ffff00";
    ctx.font = "23px monospace";
    ctx.fillText(`• ${proyecto.titulo}`, 30, baseY);

    // Descripción
    ctx.fillStyle = "#00ff88";
    ctx.fillText(proyecto.descripcion, 20, baseY + 30);

    // Enlace sobre el canvas
    const visibleLink = proyecto.link.replace(/^https?:\/\//, "");
    const link = document.createElement("a");
    link.href = proyecto.link;
    link.target = "_blank";
    link.textContent = visibleLink;

    // Posición absoluta dentro de .project-links
    link.style.position = "absolute";
    link.style.left = `${50 * scaleX + offsetX}px`;
    link.style.top = `${(baseY + 28) * scaleY + offsetY}px`;

    linksContainer.appendChild(link);
  });

  // Hint de volver
  ctx.fillStyle = "#888";
  ctx.font = "16px monospace";
  ctx.fillText(lang.back_hint, 220, canvas.height - 30);
}
