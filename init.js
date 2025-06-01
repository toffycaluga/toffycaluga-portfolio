import { drawLanguageScreen, handleLanguageInput } from "./screens/language.js";
import { handleKeyDown } from "./main.js";

window.currentLang = "es";
window.currentScreen = "language-select";

window.addEventListener("DOMContentLoaded", () => {
  drawLanguageScreen();

  window.addEventListener("keydown", (e) => {
    if (window.currentScreen === "language-select") {
      handleLanguageInput(e);
    } else {
      handleKeyDown(e);
    }
  });

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
