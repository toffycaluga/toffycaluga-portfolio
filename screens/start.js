import { lang } from "../i18n/lang.js";

export function drawStartScreen() {
  const canvas = document.getElementById("gameCanvas");
  const ctx = canvas.getContext("2d");

  ctx.fillStyle = "#000";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = "#00ff88";
  ctx.font = "24px monospace";
  ctx.fillText(lang.start_title, 280, 100);
  ctx.fillText(lang.start_prompt, 240, 140);
}
