import { lang } from "../i18n/lang.js";

const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

// Este array debe coincidir con las claves usadas en game.js
const menuOptions = ["menu_projects", "menu_skills", "menu_about", "menu_contact",
    "menu_language"
];

export function drawMenu(selectedOption) {
    ctx.fillStyle = "#000";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = "#008855";
    ctx.font = "35px monospace";
    ctx.fillText(lang.menu_title, 200, 100);

    menuOptions.forEach((key, index) => {
        ctx.fillStyle = index === selectedOption ? "#ffff00" : "#00ff88";
        ctx.fillText(lang[key], 320, 160 + index * 40);
    });
}
