'use strict';
/* v440: exact source requirements; never change learning state to toggle focus. */
const assert = require('node:assert/strict');
const fs = require('node:fs');
const html = fs.readFileSync('index.html','utf8');
const css = fs.readFileSync('study-focus-v440.css','utf8');
const js = fs.readFileSync('study-focus-v440.js','utf8');
const sw = fs.readFileSync('sw.js','utf8');
assert(html.includes('id="studyFocusControls"') && html.includes('id="studyFocusToggle"'));
assert(html.includes('<link rel="stylesheet" href="study-focus-v440.css?v=440">'));
assert(html.includes('<script src="study-focus-v440.js?v=440" defer></script>'));
assert(html.includes('id="sessionBanner"') && html.includes('id="studyHost"'));
assert(/sessionBanner[\s\S]*studyFocusControls[\s\S]*studyHost/.test(html));
assert(js.includes("document.body.classList.add('rl-study-focus')"));
assert(js.includes("document.body.classList.remove('rl-study-focus')"));
assert(js.includes('MutationObserver') && js.includes("event.key !== 'Escape'"));
assert(js.includes('const hasQuestion') && js.includes('.review-card, .exam-card'));
assert(js.includes('window.RevisionStudyFocus') && js.includes('const isCompletion'));
assert(!/\.innerHTML\s*=|activeSession\s*=|\bprofile\s*=|localStorage\.|sessionStorage\.|\bsave\(\)/.test(js),
  'Full-screen toggle must not change flashcard content, answers, records or saved XP');
assert(/body\.rl-study-focus #study\s*\{/.test(css));
assert(css.includes('position:fixed') && css.includes('overflow-y:auto'));
assert(css.includes('safe-area-inset-bottom') && css.includes('@media (max-width:520px)'));
assert(css.includes('#mockControls') && css.includes('#flashControls') && css.includes('#examControls'));
assert(sw.includes("'./study-focus-v440.js'") && sw.includes("'./study-focus-v440.css'"));
assert(sw.includes('v440-study-focus'));
console.log('PASS v440: focus toggle, overlay, Esc, completion, edit-preservation and offline asset safeguards');
