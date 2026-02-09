import { drawLanguageScreen, handleLanguageInput } from "./screens/language.js";
import { handleKeyDown } from "./game.js";
import { drawIntroScreen } from "./screens/intro.js";
import { playBackgroundMusic, stopBackgroundMusic } from "./utils/sound.js";

window.currentLang = "es";
window.currentScreen = "intro";

let isAudioOn = true;
let ready = false;

window.addEventListener("DOMContentLoaded", () => {
  const audioToggle = document.getElementById("audio-toggle");

  if (audioToggle) {
    isAudioOn = audioToggle.checked;

    audioToggle.addEventListener("change", () => {
      isAudioOn = audioToggle.checked;
      if (isAudioOn) playBackgroundMusic();
      else stopBackgroundMusic();
    });
  }

  // ✅ NO precargues aquí si intro.js ya lo hace
  drawIntroScreen(() => {
    ready = true;
  });

  const globalKeyHandler = async (e) => {
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

  // Contact submit (mailto) — robusto
  const submitButton = document.getElementById("contact-submit");
  if (submitButton) {
    submitButton.addEventListener("click", () => {
      const name = document.getElementById("contact-name")?.value ?? "";
      const email = document.getElementById("contact-email")?.value ?? "";
      const message = document.getElementById("contact-message")?.value ?? "";

      const subject = "Contacto desde el portafolio";
      const body = `Nombre: ${name}\nCorreo: ${email}\nMensaje:\n${message}`;

      const mailto = `mailto:p.abraham.lillo@gmail.com?subject=${encodeURIComponent(
        subject
      )}&body=${encodeURIComponent(body)}`;

      window.location.href = mailto;
    });
  }
});
