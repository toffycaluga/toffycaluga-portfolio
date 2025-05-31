import { lang } from "../i18n/lang.js";

const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

export function drawSkillsScreen(skills) {
  ctx.fillStyle = "#000";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = "#00ff88";
  ctx.font = "18px monospace";
  ctx.fillText(`=== ${lang.menu_skills.toUpperCase()} ===`, 250, 50);

  skills.forEach((skill, index) => {
    const y = 100 + index * 40;
    ctx.fillStyle = "#ffff00";
    ctx.fillText(skill.nombre, 100, y);
    ctx.fillStyle = "#00ff88";
    ctx.fillText(skill.nivel, 400, y);
  });

  ctx.fillStyle = "#555";
  ctx.font = "16px monospace";
  ctx.fillText(lang.back_hint, 200, canvas.height - 30);
}
