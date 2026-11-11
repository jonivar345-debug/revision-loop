# v439 Physics mock breadth and question-quality audit

**Date:** 11 November 2026. **Scope:** Revision Loop → Study → Mock → Physics, including mixed, flashcard-only, exam-only and Unlimited sessions. **Exam board:** AQA AS Physics 7407, the shared first-year content in 7408.

## Primary specification checks

AQA's five first-year strands, all expected in Physics mock revision:

1. 3.1 Measurements and their errors: SI units, uncertainty, graph/experimental evaluation
2. 3.2 Particles and radiation: fundamental particles, interactions, photons, photoelectric effect, spectra
3. 3.3 Waves: travelling/stationary waves, superposition, polarisation, interference, diffraction and refraction
4. 3.4 Mechanics and materials: vectors, slopes, motion graphs, force, energy, momentum, moments, solids
5. 3.5 Electricity: current, resistivity, I–V graphs, circuits, potential dividers, emf and internal resistance

Official syllabus: https://www.aqa.org.uk/subjects/physics/as-level/physics-7407/specification/subject-content

All six AQA AS required practicals were found among the original Physics mock exam question topics:

- RP1 — stationary waves on a string
- RP2 — Young's double-slit interference and a diffraction grating
- RP3 — determining g by free fall
- RP4 — determining Young modulus
- RP5 — wire resistivity with micrometer, ammeter and voltmeter
- RP6 — terminal potential difference against current to find emf and internal resistance

Official practical requirements: https://www.aqa.org.uk/subjects/physics/as-level/physics-7407/specification/practical-assessment

AQA Paper 1 assesses across all five strands; AS Paper 2 has 20 marks practical/data, 20 marks written Physics, and 30 multiple-choice marks. Short-form flashcards are for facts and *how to approach* a question, not substitutes for doing multistep workings. The separate Paper 2 guided pack remains available rather than being silently conflated with short mock sessions.

## Actual bank inspection

- Core deck: **730** Physics cards with `mock=true`, `active!==false`; all original active mock cards retained.
- Core exam bank: **240** Physics mock question parts, **231** distinct group identifiers, each with a mark-point list matching its stated marks. 223 were marked as original exam-style practice; this metadata **does not** mean they were AQA originals.
- Audited supplemental files: **397** additional Physics mock flashcards and **105** additional Physics mock application/question records in the reviewed set, before other separately loaded banks. These are existing materials, **not newly created** by v439.
- The wider core bank also contained **30 AS Physics past-paper parts lacking a `mock` flag**. Of these, **27** carry recorded verification against official AQA question papers and mark schemes and are now accepted by the Physics mock selector without rewriting their text or marking. Three 2025 entries are only secondarily indexed and remain in general exam practice until independently checked.
- Main deck: all five strands represented by many items. Original core Physics mock cards had only six unclassified broad-topic labels; none was excluded or deleted. Main Physics mock exam question metadata could be assigned across all five strands.
- Practical calculations and explanations, uncertainty, signed graph areas, stationary waves, photoelectric stopping-potential gradients, divider layouts, forces on slopes, Young modulus, moments/couples and particle exchange were present in the sampled extension banks.

The main issue identified was **a real selection leak**: the Mock tab called `subjectExam(sub)`, which applied the other Exam questions tab's AS/A-level filter. Choosing **A-level only** on the Exam tab could therefore silently make all Physics AS exam questions disappear from mock revision. v439 now reads eligible mock exam questions independently.

## v439 correction and safeguards

- A standalone `physics-mock-balance-v439.js` helper maps Physics metadata to the five AQA AS strands, then draws a balanced sample from **existing eligible** items. It does not drop unclassified material, alter answers or award marks.
- Physics mock exam-only and mixed batches aim to include a tagged required practical whenever a sizeable pool permits. Across five or more items, the balanced picker can represent all five strands if each is available.
- All other subjects retain their existing selectors. The must-memorise-first system and weakness weighting still operate *within* each pool.
- Unlimited mode still works through material before repeating it. Short sessions deliberately sample across strands; **they cannot contain every question**. No new progress schema or cloud authentication changes.
- The website explains this distinction directly in the Physics Mock panel.

## Checks and known limits

- Automated Node assertions for breadth, question inventory, six practicals, short-session sampling, independent exam filters, intact mock queue, offline helper and unchanged saved IDs.
- Chromium checks at phone and desktop widths for actual session creation, exam-level isolation, balanced strands, unlimited refill and preserved existing XP/history.
- **Limitation:** labels and sampled editorial files are not enough to certify every individual AQA subsection or every historical past-paper question. This is a coverage audit, not an assertion that every possible examination question is indexed.
- Continue to prefer short, precise flashcards; use reviewed mark points for longer practical/data, multi-stage calculations and explanations. Questions needing a sketch or graph should retain manual review, rather than automatic full marks.
