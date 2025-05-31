import { lang } from "../i18n/lang.js";

const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

export function drawProjectsScreen(projects) {
  ctx.fillStyle = "#000";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  ctx.fillStyle = "#00ff88";
  ctx.font = "22px monospace";
  ctx.fillText(`=== ${lang.menu_projects.toUpperCase()} ===`, 230, 40);

  const linksContainer = document.getElementById("project-links");
  linksContainer.innerHTML = ""; // Limpia los enlaces anteriores

  projects.forEach((proyecto, index) => {
    const y = 80 + index * 100;

    // Dibujo en canvas
    ctx.fillStyle = "#ffff00";
    ctx.font = "18px monospace";
    ctx.fillText(`• ${proyecto.titulo}`, 80, y);

    ctx.fillStyle = "#00ff88";
    ctx.font = "16px monospace";
    ctx.fillText(proyecto.descripcion, 100, y + 20);

    ctx.fillStyle = "#0088ff";
    const visibleLink = proyecto.link.replace("https://", "");
    // ctx.fillText(visibleLink, 100, y + 40);

    // Overlay HTML link
    const link = document.createElement("a");
    link.href = proyecto.link;
    link.target = "_blank";
    link.textContent = visibleLink;
    link.style.top = `${y + 28}px`;
    link.style.left = "100px";
    linksContainer.appendChild(link);
  });

  // Hint para volver
  ctx.fillStyle = "#888";
  ctx.font = "16px monospace";
  ctx.fillText(lang.back_hint, 220, canvas.height - 30);
}
