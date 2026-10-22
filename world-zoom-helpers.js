/* Standalone globe magnification: leaves the exam bank and globe projection untouched.
   The canvas (including markers) is scaled as one unit, so pin hit testing remains
   consistent with its transformed bounding rectangle. */
(() => {
  const canvas = document.getElementById('globe');
  const status = document.getElementById('globeZoomValue');
  if (!canvas || !status) return;

  const MIN = 1, MAX = 2.2;
  let zoom = 1;
  const touches = new Map();
  let pinchDistance = 0, pinchStartZoom = 1, suppressTouchDrag = false;

  function clampZoom(value) {
    return Math.min(MAX, Math.max(MIN, Number.isFinite(value) ? value : MIN));
  }
  function setZoom(value) {
    zoom = clampZoom(value);
    canvas.style.transformOrigin = '50% 50%';
    canvas.style.transform = 'scale(' + zoom.toFixed(3) + ')';
    status.textContent = Math.round(zoom * 100) + '%';
    document.getElementById('globeZoomIn').disabled = zoom >= MAX - 0.001;
    document.getElementById('globeZoomOut').disabled = zoom <= MIN + 0.001;
    document.getElementById('globeZoomReset').disabled = zoom <= MIN + 0.001;
  }

  document.getElementById('globeZoomIn')?.addEventListener('click', () => setZoom(zoom * 1.25));
  document.getElementById('globeZoomOut')?.addEventListener('click', () => setZoom(zoom / 1.25));
  document.getElementById('globeZoomReset')?.addEventListener('click', () => setZoom(1));
  canvas.addEventListener('wheel', event => {
    event.preventDefault();
    setZoom(zoom * (event.deltaY < 0 ? 1.12 : 1 / 1.12));
  }, {passive: false});

  // Two-finger pinch zoom; single-finger drag remains handled by the globe.
  canvas.addEventListener('pointerdown', event => {
    if (event.pointerType !== 'touch') return;
    touches.set(event.pointerId, {x: event.clientX, y: event.clientY});
    if (touches.size === 2) {
      const [a, b] = [...touches.values()];
      pinchDistance = Math.hypot(a.x - b.x, a.y - b.y);
      pinchStartZoom = zoom;
      suppressTouchDrag = true;
    }
  }, true);
  canvas.addEventListener('pointermove', event => {
    if (!touches.has(event.pointerId)) return;
    touches.set(event.pointerId, {x: event.clientX, y: event.clientY});
    // Suppress single-pointer rotation until both fingers are released.
    if (suppressTouchDrag) event.stopImmediatePropagation();
    if (touches.size < 2 || !pinchDistance) return;
    const [a, b] = [...touches.values()];
    const distance = Math.hypot(a.x - b.x, a.y - b.y);
    if (distance > 0) setZoom(pinchStartZoom * distance / pinchDistance);
  }, true);
  for (const name of ['pointerup', 'pointercancel', 'lostpointercapture']) {
    canvas.addEventListener(name, event => {
      if (suppressTouchDrag && touches.has(event.pointerId)) event.stopImmediatePropagation();
      touches.delete(event.pointerId);
      if (touches.size < 2) pinchDistance = 0;
      if (!touches.size) suppressTouchDrag = false;
    }, true);
  }
  setZoom(1);
})();
