function hasWebGL() {
  try {
    const c = document.createElement('canvas');
    return !!(c.getContext('webgl2', { powerPreference: 'high-performance' }) || c.getContext('webgl'));
  } catch (_) {
    return false;
  }
}

const forceCompat = new URLSearchParams(location.search).has('compat');

if (forceCompat || !hasWebGL()) {
  location.replace('./compat.html?fallback=1');
} else {
  import('./premium.js?v=1').catch((err) => {
    console.error('MY CINEMA premium renderer failed:', err);
    location.replace('./compat.html?fallback=1&reason=premium');
  });
}
