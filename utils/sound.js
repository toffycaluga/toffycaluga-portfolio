const base = "/assets/sounds/";

export const sounds = {
  click: base + "click.wav",
  enter: base + "enter.mp3",
  back:base +"back.wav",
  bgm: base + "intro-theme.wav", // 🎵 sonido de fondo
};

let bgmAudio = null;

export function preloadSounds() {
  Object.values(sounds).forEach((src) => {
    const audio = new Audio(src);
    audio.preload = "auto";
    audio.load();
  });
}

// 🔁 Reproducir sonido en loop
export function playBackgroundMusic() {
  bgmAudio = new Audio(sounds.bgm);
  bgmAudio.loop = true;
  bgmAudio.volume = 0.1;
  bgmAudio.play();
}

// 🚫 Detener fondo cuando quieras cambiar de vista
export function stopBackgroundMusic() {
  if (bgmAudio) {
    bgmAudio.pause();
    bgmAudio.currentTime = 0;
  }
}

export function playSound(src) {
  const sound = new Audio(src);
  sound.currentTime = 0;
  sound.play();
}
