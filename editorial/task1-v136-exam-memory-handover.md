# Task 1 v136 — exam-booklet-aware memory recall

26 October 2026 — proposed flashcard expansion.

## Actual changes
- Base v134: 3,008 records / 3,004 active.
- Draft v136: **3,113 records / 3,109 active**, adding exactly 105 concise recall cards: 46 Mathematics, 29 Physics and 30 Chemistry.
- All prior IDs and card contents are retained, allowing saved reviews and cross-device progress to continue using existing keys.
- No Firebase, cloud-sync, XP, shop, World photograph, or scanner-marking source files are modified.
- Distinguishes Year 1 / AS material (`mock: true`, `taught: true`) from Year 2 (`mock: false`, `taught: false`) unless and until school teaching scope is separately confirmed. The optional Physics module is not changed.

## What was actually audited
The wider draft had **127 candidate** questions, with five exact duplicates eliminated at the first stage. A further human-focused review then rejected low-value semantic repeats; the selected 105 were additionally compared to the live deck and a final exact duplicate was removed. Counts in `editorial/task1-v136-curated-coverage.json` are the authoritative new additions.

**AQA Maths 7357:** special attention to Appendix B formulae/identities AQA explicitly expects pupils to use without them being supplied; quadratic formula, index laws, logarithms, sequences/series sums, double-angle identities, derivatives, integrals, calculus rules, variable-motion relations and statistical formulas. This is a targeted memory list, not all of Pure, Mechanics and Statistics.

**AQA Physics 7408:** measurement uncertainty, particle conservation laws, phase, elastic energy, electrical components, SHM, ideal gases, equipotentials, induction and logarithmic decay. Formulae given in the physics data booklet are added only where their interpretation or application is itself a useful compact recall point.

**AQA Chemistry 7405:** concise high-yield definitions, equilibrium and rate concepts, water-treatment risk/benefit evaluation, organic electron-arrow conventions, oxidation/distillation reasoning, NMR reference, indicators and reaction energetics. Some equations can be derived or found in supplied data; focus is recall and interpreting chemical context.

## Review safeguards
- All 105 new cards preserve a `task1_v136_` progress identity and explicit AQA section.
- `tests/task1-exam-memory-v136.cjs` checks subject breakdown, base-record preservation, mock/taught scope, maximum answer size and website recognition of actual model answers.
- Older chronological test windows are made forward-compatible by excluding cards prefixed `task1_v136_` from their historical baselines. Those tests still assert the original exact number of legacy cards and original IDs.
- New material has not yet been performance-assessed by a student. Creation and passing CI are not evidence of learning.
- This release does **not** establish exhaustive AQA specification coverage. The v135 ledger still has 106 front-only candidate matches needing answer audits; Maths, remaining Physics/Chemistry subrequirements and practical evaluations require further work.

## AQA reference sources
- https://www.aqa.org.uk/subjects/mathematics/a-level/mathematics-7357/specification/appendix-b-mathematical-formulae-and-identities
- https://www.aqa.org.uk/subjects/physics/a-level/physics-7408/specification/subject-content
- https://www.aqa.org.uk/subjects/chemistry/a-level/chemistry-7405/specification/subject-content

## Next logical work
Complete the full per-requirement spec-to-card ledger for all three subjects, cross-check formula-booklet coverage, and use the same duplicate/marking checks before future smaller targeted releases. Longer calculations remain in exam questions.
