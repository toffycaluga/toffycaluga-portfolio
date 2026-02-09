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
  "menu_language",
];

// ✅ Estricto: sin fallback de idioma
function requireLangCode() {
  const code = window.currentLang;
  if (!code) throw new Error("[game] window.currentLang no está seteado (llama setLanguage antes)");
  return code;
}

// ✅ Fetch estricto + logs reales
async function fetchJson(url, label = "data") {
  console.log(`[game] Fetch ${label} ->`, url);

  const res = await fetch(url);
  if (!res.ok) {
    const msg = `[game] HTTP ${res.status} cargando ${url}`;
    console.error(msg);
    throw new Error(msg);
  }

  const json = await res.json();
  console.log(`[game] OK ${label} ->`, url, json);
  return json;
}

// ✅ Limpieza cuando vuelves al menú
function cleanupOnBackToMenu() {
  // Formulario contacto
  const form = document.getElementById("contact-form");
  if (form) {
    form.reset?.();
    form.style.display = "none";
    ["contact-name", "contact-email", "contact-message"].forEach((id) => {
      const el = document.getElementById(id);
      if (el) el.value = "";
    });
  }

  // Links de proyectos
  const links = document.getElementById("project-links");
  if (links) links.replaceChildren();
}

export async function handleKeyDown(e) {
  if (!e?.key) return;

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
      playSound?.(sounds?.click);
      selectedOption = (selectedOption - 1 + menuOptions.length) % menuOptions.length;
      drawMenu(selectedOption);
      return;
    }

    if (e.key === "ArrowDown") {
      playSound?.(sounds?.click);
      selectedOption = (selectedOption + 1) % menuOptions.length;
      drawMenu(selectedOption);
      return;
    }

    if (e.key === "Enter") {
      playSound?.(sounds?.enter);

      const selected = menuOptions[selectedOption];

      try {
        const langCode = requireLangCode();

        switch (selected) {
          case "menu_projects": {
            const url = `data/projects.${langCode}.json`;
            const projects = await fetchJson(url, "projects");
            window.currentScreen = "projects";
            drawProjectsScreen(projects);
            break;
          }

          case "menu_skills": {
            const url = `data/skills.${langCode}.json`; // ✅ YA NO skills.json
            const skills = await fetchJson(url, "skills");
            window.currentScreen = "skills";
            drawSkillsScreen(skills);
            break;
          }

          case "menu_about": {
            const url = `data/about.${langCode}.json`;
            const data = await fetchJson(url, "about");
            window.currentScreen = "about";
            const mod = await import("./screens/about.js");
            mod.drawAboutScreen(data);
            break;
          }

          case "menu_contact": {
            window.currentScreen = "contact";
            const mod = await import("./screens/contact.js");
            mod.drawContactScreen();
            mod.setupContactForm?.();
            break;
          }

          case "menu_language": {
            window.currentScreen = "language-select";
            const mod = await import("./screens/language.js");
            mod.drawLanguageScreen();
            break;
          }

          default:
            alert(`Elegiste: ${selected}`);
            break;
        }
      } catch (err) {
        console.error("[game] Error al ejecutar opción del menú:", err);
      }

      return;
    }
  }

  // 🔙 Volver al menú desde otras pantallas
  if (["projects", "skills", "about", "contact"].includes(window.currentScreen) && e.key === "Escape") {
    playSound?.(sounds?.back);
    window.currentScreen = "menu";
    cleanupOnBackToMenu();
    drawMenu(selectedOption);
    return;
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

document.getElementById("btn-start")?.addEventListener("click", () => simulateKey("Enter"));
document.getElementById("btn-select")?.addEventListener("click", () => simulateKey("Escape"));
