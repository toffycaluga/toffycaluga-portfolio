import { lang } from "../i18n/lang.js";

const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

export function drawContactScreen() {
  ctx.fillStyle = "#000";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  ctx.fillStyle = "#00ff88";
  ctx.font = "22px monospace";
  ctx.fillText(`=== ${lang.menu_contact.toUpperCase()} ===`, 230, 40);

  // Mostrar inputs HTML
  const form = document.getElementById("contact-form");
  if (form) form.style.display = "flex";
}
