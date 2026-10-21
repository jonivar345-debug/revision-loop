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
  document.getElementById('globeZoomReset')?.addEventListener('click', () => zoomTo(1));
  canvas.addEventListener('wheel', event => {
    event.preventDefault();
    zoomTo(scale * (event.deltaY < 0 ? 1.12 : 1 / 1.12));
  }, {passive: false});
})();
