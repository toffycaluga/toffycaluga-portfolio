import { drawLanguageScreen, handleLanguageInput } from "./screens/language.js";
import { handleKeyDown } from "./main.js";
import { drawIntroScreen } from "./screens/intro.js";
import { playBackgroundMusic, stopBackgroundMusic, preloadSounds } from "./utils/sound.js";

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
      if (isAudioOn) {
        playBackgroundMusic();
      } else {
        stopBackgroundMusic();
      }
    });
  }

  // ⚡ Precargar sonidos antes de mostrar "Presiona Enter"
  preloadSounds().then(() => {
    drawIntroScreen(() => {
      ready = true;
    });
  });

  const globalKeyHandler = (e) => {
    if (window.currentScreen === "intro") {
      if (!ready) return;

      if (e.key === "Enter" || e.key.toLowerCase() === "a") {
        if (isAudioOn) playBackgroundMusic();
        window.currentScreen = "language-select";
        drawLanguageScreen();
      }
      return;
    }

    if (window.currentScreen === "language-select") {
      handleLanguageInput(e);
    } else {
      handleKeyDown(e);
    }
  };

  window.addEventListener("keydown", globalKeyHandler);

  const submitButton = document.getElementById("contact-submit");
  if (submitButton) {
    submitButton.addEventListener("click", () => {
      const name = document.getElementById("contact-name").value;
      const email = document.getElementById("contact-email").value;
      const message = document.getElementById("contact-message").value;

      window.location.href = `mailto:toffycaluga@gmail.com?subject=Contacto desde el portafolio&body=Nombre: ${name}%0ACorreo: ${email}%0AMensaje:%0A${message}`;
    });
  }
});
