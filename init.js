import { drawLanguageScreen, handleLanguageInput } from "./screens/language.js";
import { handleKeyDown } from "./main.js";
window.currentLang = "es"; // español por defecto si no se elige nada
window.currentScreen = "language-select";

function showCanvas() {
    document.getElementById("start-overlay").style.display = "none";
    document.getElementById("gameCanvas").style.display = "block";

}

window.addEventListener("DOMContentLoaded", () => {
    // Teclado
    window.addEventListener("keydown", (e) => {
        if (["language-select", "start"].includes(window.currentScreen)) {
            handleLanguageInput(e); // para language-select
            handleKeyDown(e);       // para start
        } else {
            handleKeyDown(e);
        }
        const submitButton = document.getElementById("contact-submit");
        if (submitButton) {
            submitButton.addEventListener("click", () => {
                const name = document.getElementById("contact-name").value;
                const email = document.getElementById("contact-email").value;
                const message = document.getElementById("contact-message").value;

                console.log("Mensaje enviado:", { name, email, message });

                // Enviar por mailto:
                window.location.href = `mailto:toffycaluga@gmail.com?subject=Contacto desde el portafolio&body=Nombre: ${name}%0ACorreo: ${email}%0AMensaje:%0A${message}`;
            });
        }

    });

    // Botón
    const startButton = document.getElementById("start-button");
    if (startButton) {
        startButton.addEventListener("click", () => {
            console.log("Botón presionado");
            handleLanguageInput({ key: "Enter" });
        });
    }

    drawLanguageScreen();
});
