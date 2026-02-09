const base = "/assets/sounds/";

export const sounds = {
  click: base + "click.wav",
  enter: base + "enter.mp3",
  back: base + "back.wav",
  bgm: base + "intro-theme.wav",
  turn: base + "turn-music.wav",
};

let bgmAudio = null;
const cachedSounds = {}; // key -> Audio

export function preloadSounds({ timeoutMs = 8000 } = {}) {
  const entries = Object.entries(sounds);

  const promises = entries.map(([key, src]) => {
    return new Promise((resolve) => {
      const audio = new Audio(src);
      audio.preload = "auto";

      let done = false;
      const finish = (status, err) => {
        if (done) return;
        done = true;

        if (status === "ok") {
          cachedSounds[key] = audio;
          console.log(`[sound] Preloaded OK: ${key} -> ${src}`);
        } else {
          console.error(`[sound] Preload FAIL: ${key} -> ${src}`, err || "");
        }
        resolve(); // ⚠️ siempre resolvemos para no colgar la app
      };

      const onReady = () => finish("ok");
      const onError = (e) => finish("error", e);

      audio.addEventListener("canplaythrough", onReady, { once: true });
      audio.addEventListener("error", onError, { once: true });

      // Timeout por si el evento no llega nunca
      setTimeout(() => finish("timeout", new Error("timeout")), timeoutMs);

      audio.load();
    });
  });

  return Promise.all(promises);
}

// Helper interno: devuelve una instancia lista para play (clon)
function makeInstance(key) {
  const baseAudio = cachedSounds[key];
  if (!baseAudio) return null;
  const instance = baseAudio.cloneNode(true);
  instance.currentTime = 0;
  return instance;
}

export function playBackgroundMusic() {
  const turn = makeInstance("turn");
  if (!turn) {
    console.warn("[sound] 'turn' no está precargado");
    startLoopBgm();
    return;
  }

  turn.play()
    .then(() => {
      turn.onended = () => startLoopBgm();
    })
    .catch((err) => {
      console.warn("[sound] No se pudo reproducir 'turn':", err);
      startLoopBgm();
    });
}

function startLoopBgm() {
  if (!bgmAudio) {
    bgmAudio = makeInstance("bgm");
    if (!bgmAudio) {
      console.warn("[sound] 'bgm' no está precargado");
      return;
    }
    bgmAudio.loop = true;
    bgmAudio.volume = 0.1;
  }

  bgmAudio.play().catch((err) => {
    console.warn("[sound] No se pudo reproducir bgm (autoplay policy?):", err);
  });
}

// ✅ Parada inmediata (respeta toggle OFF)
export function stopBackgroundMusic({ withTurn = false } = {}) {
  if (!withTurn) {
    if (bgmAudio) {
      bgmAudio.pause();
      bgmAudio.currentTime = 0;
    }
    return;
  }

  // Opcional: efecto de “turn” antes de parar
  const turn = makeInstance("turn");
  if (!turn) {
    if (bgmAudio) {
      bgmAudio.pause();
      bgmAudio.currentTime = 0;
    }
    return;
  }

  turn.play()
    .then(() => {
      turn.onended = () => {
        if (bgmAudio) {
          bgmAudio.pause();
          bgmAudio.currentTime = 0;
        }
      };
    })
    .catch(() => {
      if (bgmAudio) {
        bgmAudio.pause();
        bgmAudio.currentTime = 0;
      }
    });
}

export function playSound(src) {
  // Encontrar la key por src real
  const entry = Object.entries(sounds).find(([_, path]) => path === src);

  if (entry && cachedSounds[entry[0]]) {
    const instance = makeInstance(entry[0]);
    instance?.play().catch((err) => {
      console.warn(`[sound] No se pudo reproducir ${entry[0]}:`, err);
    });
    return;
  }

  // Fallback real (si no estaba precargado)
  const fallback = new Audio(src);
  fallback.currentTime = 0;
  fallback.play().catch((err) => {
    console.warn("[sound] Fallback play() falló:", err);
  });
}
