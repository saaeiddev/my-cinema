(() => {
  const REDIRECT_AFTER_MS = 4200;
  const target = new URL('./compat.html?fallback=1', window.location.href).href;

  window.setTimeout(() => {
    const loader = document.getElementById('loader');
    const compatScene = document.getElementById('compat-scene');
    if (compatScene || !loader || loader.hidden || !loader.isConnected) return;

    const style = window.getComputedStyle(loader);
    const stillVisible = style.display !== 'none' && style.visibility !== 'hidden' && Number(style.opacity || 1) > 0.05;
    if (!stillVisible) return;

    try {
      window.location.replace(target);
    } catch (_) {
      window.location.href = target;
    }
  }, REDIRECT_AFTER_MS);
})();
