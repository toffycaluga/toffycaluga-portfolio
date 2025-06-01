import { drawLanguageScreen, handleLanguageInput } from "./screens/language.js";
import { handleKeyDown } from "./main.js";
import { drawIntroScreen } from "./screens/intro.js";
import { playBackgroundMusic } from "./utils/sound.js";

window.currentLang = "es";
window.currentScreen = "intro";

window.addEventListener("DOMContentLoaded", () => {
  drawIntroScreen(() => {
    let ready = false;

    const globalKeyHandler = (e) => {
      if (window.currentScreen === "intro") {
        if (!ready) return;

        if (e.key === "Enter" || e.key.toLowerCase() === "a") {
          playBackgroundMusic();
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

    setTimeout(() => {
      ready = true;
    }, 3000);

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
});
