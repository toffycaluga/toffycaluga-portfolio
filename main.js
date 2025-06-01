import { drawMenu } from "./screens/menu.js";
import { drawProjectsScreen } from "./screens/projects.js";
import { drawSkillsScreen, handleSkillsInput } from "./screens/skills.js";
import { playSound } from "./utils/sound.js";

let selectedOption = 0;

const menuOptions = [
  "menu_projects",
  "menu_skills",
  "menu_about",
  "menu_contact",
  "menu_language"
];

export function handleKeyDown(e) {
  if (window.currentScreen === "start" && e.key === "Enter") {
    window.currentScreen = "menu";
    drawMenu(selectedOption);
    return;
  }

  if (window.currentScreen === "skills") {
    handleSkillsInput(e);
    return;
  }

  if (window.currentScreen === "menu") {
    if (e.key === "ArrowUp") {
      playSound();
      selectedOption = (selectedOption - 1 + menuOptions.length) % menuOptions.length;
      drawMenu(selectedOption);
    } else if (e.key === "ArrowDown") {
      selectedOption = (selectedOption + 1) % menuOptions.length;
      drawMenu(selectedOption);
    } else if (e.key === "Enter") {
      const selected = menuOptions[selectedOption];
      const langCode = window.currentLang || "es";

      if (selected === "menu_projects") {
        fetch(`data/projects.${langCode}.json`)
          .then((res) => res.json())
          .then((projects) => {
            window.currentScreen = "projects";
            import("./screens/projects.js").then((module) => {
              module.drawProjectsScreen(projects);
            });
          });
      } else if (selected === "menu_skills") {
        fetch("data/skills.json")
          .then((res) => res.json())
          .then((skills) => {
            window.currentScreen = "skills";
            drawSkillsScreen(skills);
          });
      } else if (selected === "menu_about") {
        fetch(`data/about.${langCode}.json`)
          .then((res) => res.json())
          .then((data) => {
            window.currentScreen = "about";
            import("./screens/about.js").then((module) => {
              module.drawAboutScreen(data);
            });
          });
      } else if (selected === "menu_contact") {
        window.currentScreen = "contact";
        import("./screens/contact.js").then((module) => {
          module.drawContactScreen();
          module.setupContactForm();
        });
      } else if (selected === "menu_language") {
        window.currentScreen = "language-select";
        import("./screens/language.js").then((module) => {
          module.drawLanguageScreen();
        });
      }
    }
  }

  if (
    ["projects", "skills", "about", "contact"].includes(window.currentScreen) &&
    e.key === "Escape"
  ) {
    window.currentScreen = "menu";
    drawMenu(selectedOption);

    const form = document.getElementById("contact-form");
    if (form) {
      form.style.display = "none";
      form.reset?.();
      document.getElementById("contact-name").value = "";
      document.getElementById("contact-email").value = "";
      document.getElementById("contact-message").value = "";
    }

    const linksContainer = document.getElementById("project-links");
    if (linksContainer) linksContainer.innerHTML = "";
  }
}

const simulateKey = (key) => {
  window.dispatchEvent(new KeyboardEvent("keydown", { key }));
};

document.getElementById("btn-up")?.addEventListener("click", () => simulateKey("ArrowUp"));
document.getElementById("btn-down")?.addEventListener("click", () => simulateKey("ArrowDown"));
document.getElementById("btn-left")?.addEventListener("click", () => simulateKey("ArrowLeft"));
document.getElementById("btn-right")?.addEventListener("click", () => simulateKey("ArrowRight"));
document.getElementById("btn-a")?.addEventListener("click", () => simulateKey("Enter"));
document.getElementById("btn-b")?.addEventListener("click", () => simulateKey("Escape"));
