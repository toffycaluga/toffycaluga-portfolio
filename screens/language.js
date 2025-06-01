import { setLanguage } from "../i18n/lang.js";
import { playSound, sounds } from "../utils/sound.js";
import { drawMenu } from "./menu.js";

let selectedLang = 0;
const options = ["Español", "English"];
const codes = ["es", "en"];

export function drawLanguageScreen() {
  const canvas = document.getElementById("gameCanvas");
  const ctx = canvas.getContext("2d");

  ctx.fillStyle = "#000";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = "#008855";
  ctx.font = "35px monospace";
  ctx.fillText("=== SELECT YOUR LANGUAGE ===", 120, 80);
  ctx.fillText("Presiona START (A)/Enter", 180, 270);

  options.forEach((lang, index) => {
    ctx.fillStyle = index === selectedLang ? "#ffff00" : "#00ff88";
    ctx.fillText(lang, 320, 160 + index * 40);
  });
}

export function handleLanguageInput(e) {
  if (e.key === "ArrowUp") {
    playSound(sounds.click);
    selectedLang = (selectedLang - 1 + options.length) % options.length;
    drawLanguageScreen();
  } else if (e.key === "ArrowDown") {
    playSound(sounds.click);
    selectedLang = (selectedLang + 1) % options.length;
    drawLanguageScreen();
  } else if (e.key === "Enter") {
    playSound(sounds.enter);
    const langCode = codes[selectedLang];
    setLanguage(langCode).then(() => {
      window.currentScreen = "menu";
      drawMenu();
    });
  }
}
