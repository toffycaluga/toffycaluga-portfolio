import { setLanguage } from "../i18n/lang.js";
import { drawStartScreen } from "./start.js";

let selectedLang = 0;
const options = ["Español", "English"];
const codes = ["es", "en"];

export function drawLanguageScreen() {
    const canvas = document.getElementById("gameCanvas");
    const ctx = canvas.getContext("2d");

    ctx.fillStyle = "#000";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = "#00ff88";
    ctx.font = "20px monospace";
    ctx.fillText("Elige tu idioma / Choose your language:", 150, 100);

    options.forEach((lang, index) => {
        ctx.fillStyle = index === selectedLang ? "#ffff00" : "#00ff88";
        ctx.fillText(lang, 320, 160 + index * 40);
    });
}

export function handleLanguageInput(e) {
    if (e.key === "ArrowUp") {
        selectedLang = (selectedLang - 1 + options.length) % options.length;
        drawLanguageScreen();
    } else if (e.key === "ArrowDown") {
        selectedLang = (selectedLang + 1) % options.length;
        drawLanguageScreen();
    } else if (e.key === "Enter") {
        const langCode = codes[selectedLang];
        setLanguage(langCode).then(() => {
            window.currentScreen = "start";
            import("./start.js").then((module) => {
                module.drawStartScreen();
            });
        });

    }
}
