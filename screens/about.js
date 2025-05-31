import { lang } from "../i18n/lang.js";

const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

export function drawAboutScreen(data) {
  ctx.fillStyle = "#000";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  let y = 60;
  ctx.fillStyle = "#00ff88";
  ctx.font = "18px monospace";
  ctx.fillText(`=== ${lang.about_title.toUpperCase()} ===`, 100, y);
  y += 40;

  ctx.fillStyle = "#ffff00";
  ctx.font = "16px monospace";
  ctx.fillText(`${lang.about_name_label}:`, 100, y);
  ctx.fillStyle = "#fff";
  ctx.fillText(data.nombre_real, 260, y);
  y += 25;

  ctx.fillStyle = "#ffff00";
  ctx.fillText(`${lang.about_stage_name_label}:`, 100, y);
  ctx.fillStyle = "#fff";
  ctx.fillText(data.nombre_artistico, 260, y);
  y += 40;

  ctx.fillStyle = "#00ff88";
  ctx.fillText(`${lang.about_description_label}:`, 100, y);
  y += 25;
  wrapText(data.descripcion, 100, y);
  y += 60;

  ctx.fillStyle = "#00ff88";
  ctx.fillText(`${lang.about_experience_label}:`, 100, y);
  y += 25;
  data.experiencia.forEach((exp) => {
    ctx.fillStyle = "#ccc";
    ctx.fillText(exp, 120, y);
    y += 20;
  });

  y += 15;
  ctx.fillStyle = "#00ff88";
  ctx.fillText(`${lang.about_status_label}:`, 100, y);
  y += 25;
  data.estado_actual.forEach((line) => {
    ctx.fillStyle = "#ccc";
    ctx.fillText(line, 120, y);
    y += 20;
  });

  y += 15;
  ctx.fillStyle = "#00ff88";
  ctx.fillText(`${lang.about_contact_label}:`, 100, y);
  y += 25;
  ctx.fillStyle = "#ccc";
  ctx.fillText(`📧 ${data.contacto.email}`, 120, y); y += 20;
  ctx.fillText(`🌐 ${data.contacto.portafolio}`, 120, y); y += 20;
  ctx.fillText(`💼 ${data.contacto.linkedin}`, 120, y);

  ctx.fillStyle = "#555";
  ctx.font = "16px monospace";
  ctx.fillText(lang.back_hint, 200, canvas.height - 20);
}

function wrapText(text, x, y) {
  const maxWidth = 600;
  const lineHeight = 20;
  const words = text.split(" ");
  let line = "";

  for (let i = 0; i < words.length; i++) {
    const testLine = line + words[i] + " ";
    const metrics = ctx.measureText(testLine);
    if (metrics.width > maxWidth) {
      ctx.fillStyle = "#ccc";
      ctx.fillText(line, x, y);
      line = words[i] + " ";
      y += lineHeight;
    } else {
      line = testLine;
    }
  }
  ctx.fillText(line, x, y);
}
