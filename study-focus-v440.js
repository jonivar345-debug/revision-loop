/* v440: optional full-viewport study mode. Does not rebuild or move a live answer. */
(() => {
  'use strict';
  const study = document.getElementById('study');
  const host = document.getElementById('studyHost');
  const controls = document.getElementById('studyFocusControls');
  const toggle = document.getElementById('studyFocusToggle');
  if (!study || !host || !controls || !toggle) return;

  let active = false;
  let previousScroll = 0;
  let previousCard = host.firstElementChild;
  const hasQuestion = () => Boolean(host.querySelector('.review-card, .exam-card'));
  const isCompletion = () => Boolean(host.querySelector('#endSession'));

  function updateControls() {
    controls.hidden = !(active || hasQuestion());
    toggle.textContent = active ? 'Exit full screen' : 'Full screen';
    toggle.setAttribute('aria-pressed', String(active));
    toggle.setAttribute('aria-label', active ? 'Exit full-screen study view and return to dashboard' : 'Open full-screen study view');
    toggle.title = active ? 'Return to the dashboard (Esc)' : 'Study without dashboard distractions';
  }

  function setFocus(enter) {
    if (enter === active || (enter && !hasQuestion())) return;
    if (enter) {
      previousScroll = window.scrollY;
      active = true;
      document.body.classList.add('rl-study-focus');
      study.scrollTop = 0;
    } else {
      active = false;
      document.body.classList.remove('rl-study-focus');
      // The original card and any unsent typed answer stay in the DOM.
      window.scrollTo(0, previousScroll);
    }
    updateControls();
    if (!controls.hidden) toggle.focus({preventScroll: true});
  }

  toggle.addEventListener('click', () => setFocus(!active));
  document.addEventListener('keydown', event => {
    if (!active || event.key !== 'Escape' || event.defaultPrevented) return;
    // Let open image, drawing, camera and marking dialogs handle Escape first.
    if (document.querySelector('dialog[open], [role="dialog"][aria-modal="true"]')) return;
    event.preventDefault();
    setFocus(false);
  });

  const observer = new MutationObserver(() => {
    const nextCard = host.firstElementChild;
    if (nextCard !== previousCard) {
      previousCard = nextCard;
      if (active) study.scrollTop = 0;
    }
    // Finishing a session returns to the normal chooser, not an empty overlay.
    if (active && !hasQuestion() && !isCompletion()) setFocus(false);
    updateControls();
  });
  observer.observe(host, {childList: true});

  // Closing or switching the Study tab must never leave a full-screen layer behind.
  new MutationObserver(() => {
    if (active && !study.classList.contains('active')) setFocus(false);
  }).observe(study, {attributes: true, attributeFilter: ['class']});

  window.RevisionStudyFocus = Object.freeze({
    enter: () => setFocus(true),
    exit: () => setFocus(false),
    isActive: () => active
  });
  updateControls();
})();
