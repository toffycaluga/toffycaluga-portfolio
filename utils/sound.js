const base = "/assets/sounds/";

export const sounds = {
  click: base + "click.wav",
  enter: base + "enter.mp3",
  back: base + "back.wav",
  bgm: base + "intro-theme.wav",
  turn: base + "turn-music.wav",
};

let bgmAudio = null;
const cachedSounds = {}; // 🎧 para almacenar los sonidos precargados

export function preloadSounds() {
  const promises = Object.entries(sounds).map(([key, src]) => {
    return new Promise((resolve) => {
      const audio = new Audio(src);
      audio.preload = "auto";
      audio.addEventListener("canplaythrough", () => {
        cachedSounds[key] = audio;
        resolve();
      }, { once: true });
      audio.load();
    });
  });

  return Promise.all(promises);
}

export function playBackgroundMusic() {
  const turn = cachedSounds.turn?.cloneNode();
  if (!turn) return;

  turn.play().then(() => {
    turn.onended = () => {
      if (!bgmAudio) {
        bgmAudio = cachedSounds.bgm?.cloneNode();
        if (bgmAudio) {
          bgmAudio.loop = true;
          bgmAudio.volume = 0.1;
        }
      }

      bgmAudio?.play().catch((err) => {
        console.warn("No se pudo reproducir la música de fondo:", err);
      });
    };
  }).catch((err) => {
    console.warn("No se pudo reproducir el sonido 'turn':", err);
  });
}

export function stopBackgroundMusic() {
  const turn = cachedSounds.turn?.cloneNode();
  if (!turn) return;

  turn.play().then(() => {
    turn.onended = () => {
      if (bgmAudio) {
        bgmAudio.pause();
        bgmAudio.currentTime = 0;
      }
    };
  });
}

export function playSound(src) {
  const sound = Object.entries(sounds).find(([_, path]) => path === src);
  if (sound && cachedSounds[sound[0]]) {
    const instance = cachedSounds[sound[0]].cloneNode();
    instance.currentTime = 0;
    instance.play();
  } else {
    const fallback = new Audio(src);
    fallback.currentTime = 0;
    fallback.play();
  }
}
