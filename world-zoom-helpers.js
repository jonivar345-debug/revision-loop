/* Globe zoom UI, separate from question and marking code. */
(() => {
  const canvas = document.getElementById('globe');
  let scale = 1;
  function zoomTo(value) {
    scale = Math.max(1, Math.min(2.2, value));
    canvas.style.transform = 'scale(' + scale + ')';
  }
  document.getElementById('globeZoomIn')?.addEventListener('click', () => zoomTo(scale * 1.25));
  document.getElementById('globeZoomOut')?.addEventListener('click', () => zoomTo(scale / 1.25));
})();
