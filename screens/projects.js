import { lang } from "../i18n/lang.js";

const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

export function drawProjectsScreen(projects) {
  ctx.fillStyle = "#000";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  ctx.fillStyle = "#00ff88";
  ctx.font = "18px monospace";
  ctx.fillText(`=== ${lang.menu_projects.toUpperCase()} ===`, 250, 50);

  projects.forEach((proyecto, index) => {
    const y = 100 + index * 60;
    ctx.fillStyle = "#ffff00";
    ctx.fillText(proyecto.titulo, 100, y);
    ctx.fillStyle = "#00ff88";
    ctx.fillText(proyecto.descripcion, 100, y + 20);
    ctx.fillText(proyecto.link, 100, y + 40);
  });

  ctx.fillStyle = "#555";
  ctx.font = "16px monospace";
  ctx.fillText(lang.back_hint, 200, canvas.height - 30);
}
