# v439 — AQA Physics mock-focused quality and coverage audit

**Scope:** school Physics mock restricted to AQA first-year/AS topics 3.1–3.5. The Physics Paper 2 guided practice remains a separate selectable flashcard topic; it is not silently added to the school mock. A more difficult question is appropriate, but it must apply taught content rather than introduce untaught Year 13-only concepts.

## Baseline evidence (live v438 original banks)
- Core Physics flashcards: **730** active mock-tagged cards in `deck.json` (before the optional supplements are loaded).
- Core Physics examination questions: **240** mock-tagged parts in `exam_questions.json` (**231 groups**), before optional applications.
- All five first-year AQA Physics domains are represented: measurements and their errors, particles and radiation, waves, mechanics and materials, electricity.
- The six required practicals each already appeared in the original flashcards and question bank, although coverage in experimental method, evaluation, repeated measurements, graph interpretation and uncertainty was less prominent than routine calculations.
- The app also loads mock-eligible material from a substantial range of earlier optional Physics and mixed-science banks, including mechanics graphs, projectiles, particle conservation, circuits, optics and practical analysis.

## New in v439
- **26 brief, one-skill Physics flashcards** covering RP1–RP6 (two per practical) and fourteen data/evaluation/method and applied-physics facts. All have explicit correct and incorrect examples; they do not replace original cards, IDs, or progress records.
- **Twelve original worked, 6-mark exam questions**: one per required practical plus six data-analysis/application questions. Each has six explicit reviewed mark points, a worked model answer, and checked numerical values.
- Both banks are loaded into the ordinary Mock selector through a **separately validated optional add-on**, preserving the original 56 flashcard and 52 question supplement positions. New IDs are checked before insertion so they cannot silently overwrite older cards.
- New files are cached for offline use and the main script cache is refreshed.

## Subject coverage and follow-up quality checks
| AQA content | Earlier core bank | v439 focus |
| --- | --- | --- |
| 3.1 Measurements and errors | Uncertainties, significant figures, data, graphs | Gradient ranges, percentage uncertainties, good graph design and controls |
| 3.2 Particles and radiation | Atomic/particle processes, conservation laws, photoelectric effect | Already substantial; no duplicate short-card flood |
| 3.3 Waves | Wave properties, refraction, stationary waves, diffraction, interference | RP1 string relationships and RP2 diffraction-grating data |
| 3.4 Mechanics and materials | Graphs, forces, moments, momentum, projectiles, elastic deformation | RP3 free-fall interpretation, RP4 elastic-wire methods |
| 3.5 Electricity | Circuit analysis, sensors, potential dividers, I–V, internal resistance | RP5 resistivity uncertainty, RP6 emf and internal resistance |

### Safeguards
1. Retain all existing original cards and questions, skip/override controls, marking history, saved XP and the v436 one-key Firebase synchronisation.
2. Use a real mobile/desktop browser check to confirm new items appear in Physics Mock but not Chemistry/Maths.
3. Verify all new mark-point totals equal the printed question mark totals; independent calculations confirm numerical answers.
4. Existing cards with source-first diagrams require the cited original figures. New v439 questions include the complete input data in the prompt.
5. This is a coverage/quality improvement, **not proof that every possible future AQA paper variation, marking alternative or school-specific exclusion has been exhaustively audited**. Continue targeted reviews of examiner wording, alternative methods, diagrams and numerical equivalent-answer marking.

## AS Paper 2-style practice crosswalk (new data questions)

AQA AS Physics Paper 2 (7407/2) comprises Section A (20 marks practical skills/data analysis), Section B (20 marks across AS content) and Section C (30 multiple-choice marks). This is **not** A-level 7408 Paper 3; only the overlapping first-year practical and mathematical skills belong in the mock bank. The existing separate Paper 2 guided trainer provides additional Section A/B coaching and MCQ practice; the ordinary mock contains the same *skills* through its general AS cards, questions and these additions.

| Added exam item | Paper 2-style skill |
| --- | --- |
| `v439_phy_exam_data01` | Best-fit graph gradient, maximum/minimum slopes, absolute and % uncertainty |
| `v439_phy_exam_data02` | Micrometer zero correction, area, systematic vs random error |
| `v439_phy_exam_data03` | Percentage uncertainty propagation with a squared measurement |
| `v439_phy_exam_data04` | Photoelectric stopping-potential gradient, estimating Planck's constant and threshold frequency |
| `v439_phy_exam_data05` | Double-slit fringe graph, linearisation, wavelength and method improvement |
| `v439_phy_exam_data06` | LDR potential divider, predicted measurements and controlled variables |

All six practical RPs already have their own worked question in this pack; adding data questions does not reduce ordinary AS material or change the separate Paper 2 trainer. The six extra short flashcards target systematic zero errors, calibration, the stopping-potential graph, the LDR trend, fringe graph interpretation and free-fall gradient interpretation. The mock picker still needs the independently developed breadth/filter fix in PR #409 before complete sign-off.
