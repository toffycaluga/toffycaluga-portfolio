import { drawLanguageScreen, handleLanguageInput } from "./screens/language.js";
import { handleKeyDown } from "./game.js";
import { drawIntroScreen } from "./screens/intro.js";
import { playBackgroundMusic, stopBackgroundMusic } from "./utils/sound.js";

window.currentLang = "es";
window.currentScreen = "intro";

let isAudioOn = true;
let ready = false;

window.addEventListener("DOMContentLoaded", () => {
  // =========================
  // Audio toggle
  // =========================
  const audioToggle = document.getElementById("audio-toggle");
  if (audioToggle) {
    isAudioOn = audioToggle.checked;
    audioToggle.addEventListener("change", () => {
      isAudioOn = audioToggle.checked;
      if (isAudioOn) playBackgroundMusic();
      else stopBackgroundMusic();
    });
  }

  // =========================
  // Intro
  // =========================
  drawIntroScreen(() => {
    ready = true;
  });

  // =========================
  // Keyboard router (tu lógica)
  // =========================
  const globalKeyHandler = async (e) => {
    if (!e?.key) return;

    // INTRO
    if (window.currentScreen === "intro") {
      if (!ready) return;

      if (e.key === "Enter" || e.key.toLowerCase() === "a") {
        if (isAudioOn) playBackgroundMusic();
        window.currentScreen = "language-select";
        drawLanguageScreen();
      }
      return;
    }

    // LANGUAGE
    if (window.currentScreen === "language-select") {
      handleLanguageInput(e);
      return;
    }

    // RESTO (menu, skills, about, projects, contact...)
    await handleKeyDown(e);
  };

  window.addEventListener("keydown", globalKeyHandler);

  // =========================
  // GameBoy Buttons -> Keyboard
  // =========================
  setupGameboyControls();

  // =========================
  // Contact submit (mailto)
  // =========================
  // const submitButton = document.getElementById("contact-submit");
  // if (submitButton) {
  //   submitButton.addEventListener("click", () => {
  //     const name = document.getElementById("contact-name")?.value ?? "";
  //     const email = document.getElementById("contact-email")?.value ?? "";
  //     const message = document.getElementById("contact-message")?.value ?? "";

  //     const subject = "Contacto desde el portafolio";
  //     const body = `Nombre: ${name}\nCorreo: ${email}\nMensaje:\n${message}`;

  //     const mailto = `mailto:p.abraham.lillo@gmail.com?subject=${encodeURIComponent(
  //       subject
  //     )}&body=${encodeURIComponent(body)}`;

  //     window.location.href = mailto;
  //   });
  // }
});

// ======================================================
// Helpers: Simular teclas desde botones del GameBoy
// ======================================================
function setupGameboyControls() {
  // Mapeo solicitado:
  // A = Enter | B = Escape | Start = Enter | Select = Escape | D-pad = arrows
  const bindings = [
    ["btn-a", "Enter"],
    ["btn-b", "Escape"],
    ["btn-start", "Enter"],
    ["btn-select", "Escape"],
    ["btn-up", "ArrowUp"],
    ["btn-down", "ArrowDown"],
    ["btn-left", "ArrowLeft"],
    ["btn-right", "ArrowRight"],
  ];

  bindings.forEach(([id, key]) => bindButtonToKey(id, key));
}

// click/touch -> dispatch KeyboardEvent (keydown)
function bindButtonToKey(buttonId, key) {
  const el = document.getElementById(buttonId);
  if (!el) return;

  const fire = () => {
    // Dispara "keydown" como si fuese teclado
    const evt = new KeyboardEvent("keydown", {
      key,
      bubbles: true,
      cancelable: true,
    });
    window.dispatchEvent(evt);
  };

  // click
  el.addEventListener("click", (e) => {
    e.preventDefault();
    fire();
  });

  // touch (mobile)
  el.addEventListener(
    "touchstart",
    (e) => {
      e.preventDefault();
      fire();
    },
    { passive: false }
  );
}
