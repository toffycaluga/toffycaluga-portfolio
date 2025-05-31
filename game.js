import { drawMenu } from "./screens/menu.js";
import { drawProjectsScreen } from "./screens/projects.js";
import { drawSkillsScreen } from "./screens/skills.js";
import { drawAboutScreen } from "./screens/about.js";

export let currentScreen = "menu";
let selectedOption = 0;
let cachedSkills = null;

const menuOptions = [
  "menu_projects",
  "menu_skills",
  "menu_about",
  "menu_contact",
  "menu_language"
];

export function handleKeyDown(e) {
  if (currentScreen === "menu") {
    if (e.key === "ArrowUp") {
      selectedOption = (selectedOption - 1 + menuOptions.length) % menuOptions.length;
      drawMenu(selectedOption);
    } else if (e.key === "ArrowDown") {
      selectedOption = (selectedOption + 1) % menuOptions.length;
      drawMenu(selectedOption);
    } else if (e.key === "Enter") {
      const selected = menuOptions[selectedOption];
      console.log("🔍 Opción seleccionada:", selected);

      if (selected === "menu_projects") {
        fetch("data/projects.json")
          .then((res) => res.json())
          .then((projects) => {
            currentScreen = "projects";
            drawProjectsScreen(projects);
          });
      } else if (selected === "menu_skills") {
        fetch("data/skills.json")
          .then((res) => res.json())
          .then((skills) => {
            cachedSkills = skills;
            currentScreen = "skills";
            drawSkillsScreen(skills);
          });
      } else if (selected === "menu_about") {
        fetch("data/about.json")
          .then((res) => res.json())
          .then((data) => {
            currentScreen = "about";
            drawAboutScreen(data);
          });
      } else if (selected === "menu_language") {
        currentScreen = "language-select";
        import("./screens/language.js").then((module) => {
          module.drawLanguageScreen();
        });
      } else {
        alert(`Elegiste: ${selected}`);
      }
    }
  }

  // Escape para volver al menú desde cualquier pantalla
  if (
    ["projects", "skills", "about", "contact"].includes(currentScreen) &&
    e.key === "Escape"
  ) {
    currentScreen = "menu";
    drawMenu(selectedOption);
  }
}
