/* World-view controls; no exam or marking dependencies. */
function clampWorldZoom(value) {
  return Math.max(1, Math.min(2.2, Number(value) || 1));
}
