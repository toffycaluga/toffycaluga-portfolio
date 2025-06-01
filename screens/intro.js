import { preloadSounds } from "../utils/sound.js";

export function drawIntroScreen(onReadyToContinue) {
  const canvas = document.getElementById("gameCanvas");
  const ctx = canvas.getContext("2d");

  let tick = 0;
  let showStartPrompt = false;

  preloadSounds();

  const interval = setInterval(() => {
    if (window.currentScreen !== "intro") {
      clearInterval(interval);
      return;
    }

    ctx.fillStyle = "#000";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = "#ffff00";
    ctx.font = "50px monospace";
    ctx.fillText("Toffy Dev Quest", 200, 250);

    ctx.fillStyle = "#00ff88";
    ctx.font = "35px monospace";
    ctx.fillText("presentado por Toffy Caluga", 150, 320);

    ctx.font = "35px monospace";
    if (!showStartPrompt) {
      const dots = ".".repeat((tick % 3) + 1);
      ctx.fillText(`Cargando${dots}`, 330, 380);
    } else {
      ctx.fillText("Presiona Enter o (A) para comenzar", 110, 380);
    }

    tick++;
  }, 500);

  setTimeout(() => {
    showStartPrompt = true;
    onReadyToContinue();
  }, 3000);
}
