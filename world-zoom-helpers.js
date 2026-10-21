/* Globe zoom clamp, independent of exam marking. */
function clampWorldZoom(value) {
  return Math.max(1, Math.min(2.2, Number(value) || 1));
}
