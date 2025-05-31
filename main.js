import { drawMenu } from "./screens/menu.js";
import { drawProjectsScreen } from "./screens/projects.js";
import { drawSkillsScreen } from "./screens/skills.js";
import { handleSkillsInput } from "./screens/skills.js";


let selectedOption = 0;

const menuOptions = [
  "menu_projects",
  "menu_skills",
  "menu_about",
  "menu_contact",
  "menu_language"
];

export function handleKeyDown(e) {
  // 👉 Pantalla de inicio (HTML, antes de canvas)
  if (window.currentScreen === "start" && e.key === "Enter") {
    window.currentScreen = "menu";
    drawMenu(selectedOption);
    return;
  }
  if (window.currentScreen === "skills") {
    handleSkillsInput(e);
  }

  // 👉 Menú principal
  if (window.currentScreen === "menu") {
    if (e.key === "ArrowUp") {
      selectedOption = (selectedOption - 1 + menuOptions.length) % menuOptions.length;
      drawMenu(selectedOption);
    } else if (e.key === "ArrowDown") {
      selectedOption = (selectedOption + 1) % menuOptions.length;
      drawMenu(selectedOption);
    } else if (e.key === "Enter") {
      const selected = menuOptions[selectedOption];

      if (selected === "menu_projects") {
        fetch("data/projects.json")
          .then((res) => res.json())
          .then((projects) => {
            window.currentScreen = "projects";
            drawProjectsScreen(projects);
          });

      } else if (selected === "menu_skills") {
        fetch("data/skills.json")
          .then((res) => res.json())
          .then((skills) => {
            window.currentScreen = "skills";
            drawSkillsScreen(skills);
          });

      } else if (selected === "menu_language") {
        window.currentScreen = "language-select";
        import("./screens/language.js").then((module) => {
          module.drawLanguageScreen();
        });
      } else {
        alert(`Elegiste: ${selected}`);
      }
    }
  }

  // 👉 Escape: volver al menú desde cualquier sección
  if (
    ["projects", "skills", "about", "contact"].includes(window.currentScreen) &&
    e.key === "Escape"
  ) {
    window.currentScreen = "menu";
    drawMenu(selectedOption);
  }
}
