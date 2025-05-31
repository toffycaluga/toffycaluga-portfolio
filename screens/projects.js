import { lang } from "../i18n/lang.js";

const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

export function drawProjectsScreen(projects) {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  ctx.fillStyle = "#000";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  ctx.fillStyle = "#00ff88";
  ctx.font = "22px monospace";
  ctx.fillText(`=== ${lang.menu_projects.toUpperCase()} ===`, 230, 40);

  const linksContainer = document.getElementById("project-links");
  linksContainer.innerHTML = "";

  // 🔥 Escalado según tamaño real del canvas en pantalla
  const rect = canvas.getBoundingClientRect();
  const scaleX = rect.width / canvas.width;
  const scaleY = rect.height / canvas.height;

  // 🔁 Compensar posición del canvas en la página (clave)
  const offsetTop = rect.top + window.scrollY;
  const offsetLeft = rect.left + window.scrollX;

  projects.forEach((proyecto, index) => {
    const baseY = 80 + index * 100;

    // Dibujo en canvas
    ctx.fillStyle = "#ffff00";
    ctx.font = "18px monospace";
    ctx.fillText(`• ${proyecto.titulo}`, 80, baseY);

    ctx.fillStyle = "#00ff88";
    ctx.fillText(proyecto.descripcion, 100, baseY + 20);

    const visibleLink = proyecto.link.replace("https://", "");

    const link = document.createElement("a");
    link.href = proyecto.link;
    link.target = "_blank";
    link.textContent = visibleLink;

    link.style.position = "absolute";
    link.style.left = `${offsetLeft + 100 * scaleX}px`;
    link.style.top = `${offsetTop + (baseY + 28) * scaleY}px`;

    linksContainer.appendChild(link);
  });

  ctx.fillStyle = "#888";
  ctx.font = "16px monospace";
  ctx.fillText(lang.back_hint, 220, canvas.height - 30);
}
