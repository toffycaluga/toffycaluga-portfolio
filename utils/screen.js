export function showCanvas({ withTransition = true, duration = 300 } = {}) {
  const overlay = document.getElementById("start-overlay");
  const canvas = document.getElementById("gameCanvas");

  if (!canvas) {
    console.error("[ui] #gameCanvas no encontrado");
    return;
  }

  // Mostrar canvas
  canvas.style.display = "block";

  if (withTransition) {
    canvas.style.opacity = "0";
    canvas.style.transition = `opacity ${duration}ms ease`;

    requestAnimationFrame(() => {
      canvas.style.opacity = "1";
    });
  }

  // Ocultar overlay
  if (!overlay) {
    console.warn("[ui] #start-overlay no encontrado");
    return;
  }

  if (withTransition) {
    overlay.style.transition = `opacity ${duration}ms ease`;
    overlay.style.opacity = "0";

    setTimeout(() => {
      overlay.style.display = "none";
    }, duration);
  } else {
    overlay.style.display = "none";
  }
}
