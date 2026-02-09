import { preloadSounds } from "../utils/sound.js";
import { clearScreen, drawPanel, drawFooterHints } from "../ui/draw.js";
import { TYPO } from "../ui/typography.js";
import { THEME } from "../ui/theme.js";
import { LAYOUT } from "../ui/layout.js";

const canvas = document.getElementById("gameCanvas");
if (!canvas) throw new Error("[intro] No se encontró #gameCanvas");

const ctx = canvas.getContext("2d");
if (!ctx) throw new Error("[intro] No se pudo obtener contexto 2D");

// ===============================
// ESTADO
// ===============================
let tick = 0;
let showStartPrompt = false;
let intervalId = null;

// ===============================
// API PÚBLICA
// ===============================
export function drawIntroScreen(onReadyToContinue) {
  if (typeof onReadyToContinue !== "function") {
    throw new Error("[intro] onReadyToContinue debe ser una función");
  }

  tick = 0;
  showStartPrompt = false;

  // Preload sonidos (una sola vez)
  preloadSounds()
    .then(() => {
      showStartPrompt = true;
      onReadyToContinue();
    })
    .catch((err) => {
      console.error("[intro] Error precargando sonidos:", err);
      showStartPrompt = true;
      onReadyToContinue();
    });

  startLoop();
}

// ===============================
// LOOP
// ===============================
function startLoop() {
  stopLoop();

  intervalId = setInterval(() => {
    if (window.currentScreen !== "intro") {
      stopLoop();
      return;
    }

    render();
    tick++;
  }, 500);
}

function stopLoop() {
  if (intervalId) {
    clearInterval(intervalId);
    intervalId = null;
  }
}

// ===============================
// RENDER
// ===============================
function render() {
  clearScreen(ctx, canvas);
  drawPanel(ctx, canvas);

  drawTitle();
  drawSubtitle();
  drawStatus();
}

function drawTitle() {
  ctx.fillStyle = THEME.colors.title;
  ctx.font = TYPO.font("title");

  ctx.fillText(
    "TOFFY DEV QUEST",
    LAYOUT.contentPadding + 40,
    canvas.height / 2 - 40
  );
}

function drawSubtitle() {
  ctx.fillStyle = THEME.colors.text;
  ctx.font = TYPO.font("section");

  ctx.fillText(
    "presentado por Toffy Caluga",
    LAYOUT.contentPadding + 40,
    canvas.height / 2
  );
}

function drawStatus() {
  ctx.fillStyle = THEME.colors.hint;
  ctx.font = TYPO.font("footer");

  if (!showStartPrompt) {
    const dots = ".".repeat((tick % 3) + 1);
    ctx.fillText(
      `Cargando${dots}`,
      LAYOUT.contentPadding + 40,
      canvas.height / 2 + 50
    );
  } else {
    ctx.fillText(
      "Presiona Enter o (A) para comenzar",
      LAYOUT.contentPadding + 40,
      canvas.height / 2 + 50
    );
  }
}
