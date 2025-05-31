import { drawLanguageScreen, handleLanguageInput } from "./screens/language.js";
import { handleKeyDown } from "./main.js";

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
