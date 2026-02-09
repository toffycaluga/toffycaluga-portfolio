// game.js
import { drawMenu } from "./screens/menu.js";
import { drawProjectsScreen } from "./screens/projects.js";
import { drawSkillsScreen, handleSkillsInput } from "./screens/skills.js";
import { drawAboutScreen, handleAboutInput } from "./screens/about.js";

let selectedOption = 0;

const menuOptions = [
  "menu_projects",
  "menu_skills",
  "menu_about",
  "menu_contact",
  "menu_language",
];

// Cache real por idioma
let cachedSkills = null;
let cachedProjects = null;
let cachedAbout = null;

// ===============================
// Helpers
// ===============================
function requireLangCode() {
  const code = window.currentLang;
  if (!code) throw new Error("[game] window.currentLang no está seteado");
  return code;
}

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

function cleanupOnBackToMenu() {
  // Contact form
  const form = document.getElementById("contact-form");
  if (form) {
    form.style.display = "none";
    form.reset?.();

    const name = document.getElementById("contact-name");
    const email = document.getElementById("contact-email");
    const message = document.getElementById("contact-message");
    if (name) name.value = "";
    if (email) email.value = "";
    if (message) message.value = "";
  }

  // Project links overlay
  const linksContainer = document.getElementById("project-links");
  if (linksContainer) linksContainer.replaceChildren();
}

function goBackToMenu() {
  window.currentScreen = "menu";
  cleanupOnBackToMenu();
  drawMenu(selectedOption);
}

async function openMenuOption(optionKey) {
  const langCode = requireLangCode();
  console.log("[game] Open option:", optionKey, "| lang:", langCode);

  if (optionKey === "menu_projects") {
    const cacheKey = `projects:${langCode}`;
    if (cachedProjects?.key === cacheKey) {
      window.currentScreen = "projects";
      drawProjectsScreen(cachedProjects.data);
      return;
    }

    const projects = await fetchJson(`data/projects.${langCode}.json`, "projects");
    cachedProjects = { key: cacheKey, data: projects };
    window.currentScreen = "projects";
    drawProjectsScreen(projects);
    return;
  }

  if (optionKey === "menu_skills") {
    const cacheKey = `skills:${langCode}`;
    if (cachedSkills?.key === cacheKey) {
      window.currentScreen = "skills";
      drawSkillsScreen(cachedSkills.data);
      return;
    }

    const skills = await fetchJson(`data/skills.${langCode}.json`, "skills");
    cachedSkills = { key: cacheKey, data: skills };
    window.currentScreen = "skills";
    drawSkillsScreen(skills);
    return;
  }

  if (optionKey === "menu_about") {
    const cacheKey = `about:${langCode}`;
    if (cachedAbout?.key === cacheKey) {
      window.currentScreen = "about";
      drawAboutScreen(cachedAbout.data);
      return;
    }

    const about = await fetchJson(`data/about.${langCode}.json`, "about");
    cachedAbout = { key: cacheKey, data: about };
    window.currentScreen = "about";
    drawAboutScreen(about);
    return;
  }

  if (optionKey === "menu_contact") {
    window.currentScreen = "contact";
    const mod = await import("./screens/contact.js");
    mod.drawContactScreen();
    mod.setupContactForm?.();
    return;
  }

  if (optionKey === "menu_language") {
    window.currentScreen = "language-select";
    const mod = await import("./screens/language.js");
    mod.drawLanguageScreen();
    return;
  }

  alert(`Elegiste: ${optionKey}`);
}

// ===============================
// Input Router
// ===============================
export async function handleKeyDown(e) {
  if (!e?.key) return;

  const screen = window.currentScreen;

  // BACK global primero (para que About/Skills NO se lo coman)
  const isBackKey =
    e.key === "Escape" ||
    e.key === "b" ||
    e.key === "B";

  if (
    ["projects", "skills", "about", "contact", "language-select"].includes(screen) &&
    isBackKey
  ) {
    e.preventDefault();
    goBackToMenu();
    return;
  }

  // Delegación por pantalla
  if (screen === "skills") {
    handleSkillsInput(e);
    return;
  }

  if (screen === "about") {
    handleAboutInput(e);
    return;
  }

  if (screen === "language-select") {
    const mod = await import("./screens/language.js");
    mod.handleLanguageInput(e);
    return;
  }

  // MENU
  if (screen === "menu") {
    if (e.key === "ArrowUp") {
      selectedOption = (selectedOption - 1 + menuOptions.length) % menuOptions.length;
      drawMenu(selectedOption);
      return;
    }

    if (e.key === "ArrowDown") {
      selectedOption = (selectedOption + 1) % menuOptions.length;
      drawMenu(selectedOption);
      return;
    }

    if (e.key === "Enter") {
      const selected = menuOptions[selectedOption];
      try {
        await openMenuOption(selected);
      } catch (err) {
        console.error("[game] Error al abrir opción:", selected, err);
      }
      return;
    }
  }
}
