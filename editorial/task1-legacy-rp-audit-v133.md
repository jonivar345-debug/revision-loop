# Task 1 v133 — verified deck audit and practical interpretation

26 October 2026. **Development candidate**; not merged unless release tests pass.

## Exact deck position
- Baseline v132: 2,981 flashcards, 2,977 active.
- v133 adds 13 concise recall cards: 5 Physics (A2 practical graphs and counting statistics) and 8 Chemistry (IR interpretation, pH curves, chromatography and drug–DNA context).
- Proposed v133: **2,994 flashcards, 2,990 active**. All older IDs unchanged. No review progress, XP, points, Firestore, exam-question packs, shops, photos or location records modified.
- Mock filtering: Physics A2 and untaught Chemistry A2 remain outside Year 1 mock selections; Year 1 IR-analysis cards are eligible.

## Original-legacy audit progress
- Earlier v132 audit: 354 original Physics and Chemistry flashcards.
- v133 reviews **442 further** original prompts (111 Physics, 331 Chemistry), including earlier practicals, particles, motion, spectroscopy, bonding, enthalpy, rates, esters, Kp and polarity.
- Cumulative **796/1,216** active, originally untagged cards now have an ID-preserving question/answer review at the broad AQA section level.
- Reviewed Physics 232/408, Chemistry 564/705, Maths 0/103. Remaining 420: Physics 176, Chemistry 141, Maths 103.
- The audit records preserve each original front, original subject and topic, tentative spec section and content-format classification. Multi-point/drawing/calculation prompts flagged for future moving to exam practice; none deleted or deactivated.
- This is **not** certification of each assessable syllabus sub-bullet. Individual bullet mapping and spot-checking answer validity across the whole bank remain necessary.

## Required-practical inventory
- Compared AQA section 7.2 lists directly: 12 Physics activities and 12 Chemistry activities.
- All 24 practicals already have at least some cards, but some are sparse and no practical is certified as complete from that fact.
- The ledger records card IDs and counts per practical. Areas for further review include RP7 pendulum gradient, RP9 pH comparisons, spectroscopy interpretation and measurements/uncertainties.
- Descriptive recall has been separated from laboratory operating instructions and lengthy multi-mark practical exam questions.

## Automated safeguards
- New `tests/task1-practical-legacy-v133.cjs` checks 796 audited IDs, old prompts and sections, complete 24-practical inventory, correct/wrong short-answer marking and preserved 2,981-card baseline.
- v127–v132 tests continue requiring the same historical counts after excluding the new additive v133 IDs.
- Require cloud/flashcard, World safety, browser acceptance and scanner-marking regression before merging.

## Official references
- https://www.aqa.org.uk/subjects/physics/a-level/physics-7408/specification/subject-content
- https://www.aqa.org.uk/subjects/physics/a-level/physics-7408/specification/practical-assessment
- https://www.aqa.org.uk/subjects/chemistry/a-level/chemistry-7405/specification/subject-content
- https://www.aqa.org.uk/subjects/chemistry/a-level/chemistry-7405/specification/practical-assessment

## Next verification tasks
- Audit remaining 176 Physics, 141 Chemistry and 103 Maths original cards.
- Check the chosen Physics optional module before treating any option as compulsory.
- Reconcile per-bullet syllabus coverage independently of cards and keep multi-step worked questions in exam practice.
