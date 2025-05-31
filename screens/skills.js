import { lang } from "../i18n/lang.js";

const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

let selectedSkillIndex = 0;
let currentSkills = [];

let scrollOffset = 0;
const visibleLines = 8; // cantidad de skills visibles antes de hacer scroll
const lineHeight = 50;

const nivelToValor = {
    "Básico": 3,
    "Intermedio": 6,
    "Avanzado": 10
};

export function drawSkillsScreen(skills) {
    currentSkills = skills;
    renderSkills();
}

function renderSkills() {
    ctx.fillStyle = "#000";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = "#00ff88";
    ctx.font = "25px monospace";
    ctx.fillText(`=== ${lang.menu_skills.toUpperCase()} ===`, 100, 50);

    currentSkills.forEach((skill, index) => {
        const y = 100 + (index - scrollOffset) * lineHeight;
        if (y < 100 || y > canvas.height - 100) return; // no dibujar fuera de pantalla

        const barWidth = 150;
        const filledBars = nivelToValor[skill.nivel] || 0;
        const barX = 240;

        if (index === selectedSkillIndex) {
            ctx.fillStyle = "#222";
            ctx.fillRect(20, y - 24, 500, 40);
        }

        // Logo
        const img = new Image();
        img.src = `./assets/icons/${skill.logo}`;
        img.onload = () => ctx.drawImage(img, 20, y - 32, 32, 32);

        // Nombre
        ctx.fillStyle = "#ffff00";
        ctx.fillText(skill.nombre, 60, y);

        // Barra
        ctx.fillStyle = "#333";
        ctx.fillRect(barX, y - 16, barWidth, 20);
        ctx.fillStyle = "#00ff88";
        ctx.fillRect(barX, y - 16, (filledBars / 10) * barWidth, 20);

        // Nivel y estado
        ctx.fillStyle = "#888";
        ctx.font = "25px monospace";
        ctx.fillText(skill.nivel, barX + barWidth + 10, y);

        // const estado = skill.estado === "aprendiendo" ? lang.skill_learning : lang.skill_mastered;
        // ctx.fillStyle = "#aaa";
        // ctx.fillText(`(${estado})`, barX + barWidth + 90, y);
    });

    // Panel lateral de descripción
    const selected = currentSkills[selectedSkillIndex];
    if (selected) {
        const panelX = 600;
        const panelY = 100;
        const panelWidth = 180;

        ctx.fillStyle = "#003322";
        ctx.fillRect(panelX, panelY, panelWidth, 400);

        ctx.strokeStyle = "#00ff88";
        ctx.strokeRect(panelX, panelY, panelWidth, 400);

        ctx.fillStyle = "#ffff00";
        ctx.font = "25px monospace";
        ctx.fillText(selected.nombre, panelX + 10, panelY + 25);

        ctx.fillStyle = "#ccc";
        ctx.font = "25px monospace";

        // Descripción (envuelta manualmente si es muy larga)
        const maxWidth = panelWidth - 20;
        const words = selected.descripcion.split(" ");
        let line = "", lineY = panelY + 50;

        words.forEach((word) => {
            const testLine = line + word + " ";
            const testWidth = ctx.measureText(testLine).width;
            if (testWidth > maxWidth) {
                ctx.fillText(line, panelX + 10, lineY);
                line = word + " ";
                lineY += 18;
            } else {
                line = testLine;
            }
        });

        if (line) ctx.fillText(line, panelX + 10, lineY);
    }

    ctx.fillStyle = "#555";
    ctx.font = "20px monospace";
    ctx.fillText(lang.back_hint, 200, canvas.height - 20);
}


export function handleSkillsInput(e) {
    if (e.key === "ArrowDown") {
        if (selectedSkillIndex < currentSkills.length - 1) {
            selectedSkillIndex++;
            if (selectedSkillIndex >= scrollOffset + visibleLines) {
                scrollOffset++;
            }
            renderSkills();
        }
    } else if (e.key === "ArrowUp") {
        if (selectedSkillIndex > 0) {
            selectedSkillIndex--;
            if (selectedSkillIndex < scrollOffset) {
                scrollOffset--;
            }
            renderSkills();
        }
    } else if (e.key === "Escape") {
        window.currentScreen = "menu";
        import("./menu.js").then(module => module.drawMenu());
    }
}

