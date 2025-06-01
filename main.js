import { drawMenu } from "./screens/menu.js";
import { drawProjectsScreen } from "./screens/projects.js";
import { drawSkillsScreen, handleSkillsInput } from "./screens/skills.js";
import { playSound, sounds } from "./utils/sound.js";

let selectedOption = 0;

const menuOptions = [
  "menu_projects",
  "menu_skills",
  "menu_about",
  "menu_contact",
  "menu_language"
];

export function handleKeyDown(e) {
  // 🎮 Desde pantalla de inicio
  if (window.currentScreen === "start" && e.key === "Enter") {
    window.currentScreen = "menu";
    drawMenu(selectedOption);
    return;
  }

  // 🎯 Navegación interna de skills
  if (window.currentScreen === "skills") {
    handleSkillsInput(e);
    return;
  }

  // 📋 Navegación en el menú principal
  if (window.currentScreen === "menu") {
    if (e.key === "ArrowUp") {
      playSound(sounds.click);
      selectedOption = (selectedOption - 1 + menuOptions.length) % menuOptions.length;
      drawMenu(selectedOption);
    } else if (e.key === "ArrowDown") {
      playSound(sounds.click);
      selectedOption = (selectedOption + 1) % menuOptions.length;
      drawMenu(selectedOption);
    } else if (e.key === "Enter") {
      playSound(sounds.enter);
      const selected = menuOptions[selectedOption];
      const langCode = window.currentLang || "es";

      switch (selected) {
        case "menu_projects":
          fetch(`data/projects.${langCode}.json`)
            .then(res => res.json())
            .then(projects => {
              window.currentScreen = "projects";
              import("./screens/projects.js").then(mod => mod.drawProjectsScreen(projects));
            });
          break;

        case "menu_skills":
          fetch("data/skills.json")
            .then(res => res.json())
            .then(skills => {
              window.currentScreen = "skills";
              drawSkillsScreen(skills);
            });
          break;

        case "menu_about":
          fetch(`data/about.${langCode}.json`)
            .then(res => res.json())
            .then(data => {
              window.currentScreen = "about";
              import("./screens/about.js").then(mod => mod.drawAboutScreen(data));
            });
          break;

        case "menu_contact":
          window.currentScreen = "contact";
          import("./screens/contact.js").then(mod => {
            mod.drawContactScreen();
            mod.setupContactForm?.(); // Safe call
          });
          break;

        case "menu_language":
          window.currentScreen = "language-select";
          import("./screens/language.js").then(mod => mod.drawLanguageScreen());
          break;
      }
    }
  }

  // 🔙 Volver al menú desde otras pantallas
  if (
    ["projects", "skills", "about", "contact"].includes(window.currentScreen) &&
    e.key === "Escape"
  ) {
    playSound(sounds.back);
    window.currentScreen = "menu";
    drawMenu(selectedOption);

    // 🧼 Limpiar y ocultar el formulario de contacto
    const form = document.getElementById("contact-form");
    if (form) {
      form.reset?.();
      form.style.display = "none";
      ["contact-name", "contact-email", "contact-message"].forEach(id => {
        const input = document.getElementById(id);
        if (input) input.value = "";
      });
    }

    // 🧼 Limpiar enlaces de proyectos si los hay
    document.getElementById("project-links")?.replaceChildren();
  }
}

// 🎮 Simulación de teclas desde botones táctiles
const simulateKey = (key) => {
  window.dispatchEvent(new KeyboardEvent("keydown", { key }));
};

document.getElementById("btn-up")?.addEventListener("click", () => simulateKey("ArrowUp"));
document.getElementById("btn-down")?.addEventListener("click", () => simulateKey("ArrowDown"));
document.getElementById("btn-left")?.addEventListener("click", () => simulateKey("ArrowLeft"));
document.getElementById("btn-right")?.addEventListener("click", () => simulateKey("ArrowRight"));
document.getElementById("btn-a")?.addEventListener("click", () => simulateKey("Enter"));
document.getElementById("btn-b")?.addEventListener("click", () => simulateKey("Escape"));
