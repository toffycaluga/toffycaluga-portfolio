// i18n/lang.js
export let lang = {};

export async function setLanguage(code) {
  const response = await fetch(`i18n/${code}.json`);
  lang = await response.json();
  window.currentLang = code; // 🔥 ESTO FALTABA
}
