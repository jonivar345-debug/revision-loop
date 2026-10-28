# Task 1 v151 — AQA A-level-only Organic Chemistry evidence audit

Date: 28 October 2026. **Audit-only release**, checked against published Revision Loop v150 deck **3,270 cards (3,266 active)** and v149 main-bank **1,212 questions**. No changes to site content, app code, mocks, XP, Firebase, saved progress or galleries.

## Scope and evidence

Official AQA 7405 specification: https://www.aqa.org.uk/subjects/chemistry/a-level/chemistry-7405/specification/subject-content/organic-chemistry (3.3.7–3.3.16). 109 selected atomic assessable checks across 10 sections and all 19 numbered subsections, with exact cited flashcard fronts and backs and actual main-bank question prompts/mark points in `editorial/task1-v151-a2-organic-crosswalk.json`.

The status breakdown is: supported_recall: 55; partial: 15; supported_practice: 23; gap_applied: 12; gap_recall: 4. **Supported** means evidence of a specific card or question, not complete syllabus certification or demonstrated student mastery; **partial/gap** is a priority for editorial checking, not absolute proof a concept appears nowhere else.

## Most useful next work

- 3.3.7: Include genuine unfamiliar 3D enantiomer drawings, not only chirality definitions and racemate explanations.
- 3.3.8: Keep dangerous chemical contexts theory-only; assess full arrow-based carbonyl mechanisms and equations as exam questions rather than dense flashcards.
- 3.3.9: Preserve substantial existing ester/soap/biodiesel/acylation recall; strengthen RP10 purity interpretation and unseen triglyceride structures. Avoid repeating established chemistry v40/v41 cards.
- 3.3.10–11: Numerical benzene stability reasoning, Friedel–Crafts diagram-based explanation; review amine-preparation conceptual recall and sequential classification.
- 3.3.12–13: Prioritise polyester/polyamide repeat units, peptide/tripeptide drawing, biological diagram interpretation, stereospecific binding and RP12 standard comparisons.
- 3.3.14: Multi-step synthesis **up to four steps** is thin; add exam problems with appropriate supplied data, not memorisation cards.
- 3.3.15: Combined 13C and 1H NMR structure questions need checking; original generated questions on 4–5 adjacent protons exceed the AQA **specified** doublet, triplet and quartet n+1 scope (they can remain optional enrichment if clearly labelled).
- 3.3.16: More interpretation of complete chromatograms and retention-time standards, beyond single-spot Rf drills.

**Mocks:** the ten topics here are A2-only content in the specification. Do **not** mark any future new cards as `mock:true` until taught/current mock scope is independently confirmed. Existing records/flags are left exactly as-is in this audit.

Regression: `tests/task1-v151-a2-organic-crosswalk.cjs` verifies each evidence snapshot, baseline content counts and all 19 subsections. Release only after four CI checks and Pages deployment, without claiming complete qualification-wide coverage.
