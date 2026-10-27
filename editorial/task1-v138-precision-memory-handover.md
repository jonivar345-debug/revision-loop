# Task 1 v138 — narrow AQA memory gaps

Date: 27 October 2026. Proposed follow-on to published v136 and v137 audit.

## Changes
- **15 new short flashcards**: 9 Physics, 5 Chemistry, 1 Maths.
- Total proposal: **3,128 cards, 3,124 active**.
- Corrects a confirmed omission in AQA Maths 7357 Appendix B: the logarithm quotient law, `logₐ(x/y) = logₐx − logₐy`. The product and power laws already existed, so this is one new card rather than another full duplicate log deck.
- Physics: relative charges/masses of nucleons and electrons; series and parallel resistance expressions; how potential-divider output responds when it is connected across an NTC thermistor, a fixed resistor, or an LDR; the reciprocal gradients of I–V and V–I graphs. These are short answers, not multi-step calculation problems.
- Chemistry: precise saturated-alkane definition, drawing unpaired electrons as dots, avoiding electron-pair curly arrows in radical mechanisms and two concise chromatography interpretation points.
- Existing cards for temperature/resistivity, Tollens and Fehling observations, aldehyde distillation and the Rf definition were examined and deliberately *not* duplicated.

## Syllabus and scope
- Maths: AQA 7357 Appendix B, logarithm laws. Pure Year 1 mock eligible.
- Physics: AQA 7408 sections 3.2.1.1, 3.5.1.2, 3.5.1.4 and 3.5.1.5. Year 1 mock eligible.
- Chemistry: AQA 7405 sections 3.3.1.2, 3.3.2.1 (Year 1), and 3.3.16 chromatography (Year 2). The two chromatography cards are **not** added to November mock revision.
- The exact sensor answer explicitly states which component has output measured **across it**. Without that detail, a potential-divider card is ambiguous.
- The v137 `B125` candidate missing quotient law is addressed in this proposed branch; the archived v137 audit is deliberately unchanged.

## Release safeguards
- All existing 3,113 card records, answers and IDs retained unchanged.
- New `task1_v138_###` progress IDs are stable; original XP, cloud, purchases, shop, World and exam-scanner source code are untouched.
- Historic fixed-count tests exclude v138 cards while still checking their own original sets; new `tests/task1-precision-memory-v138.cjs` checks totals, card lengths, exact answers and mock filters.
- The cloud/flashcard, scanner, World safety and browser tests must all pass before merging.
- This release is **not evidence that full AQA specification coverage is finished**. Previously identified front-only matches still require careful answer verification.

## References
- https://www.aqa.org.uk/subjects/mathematics/a-level/mathematics-7357/specification/appendix-b-mathematical-formulae-and-identities
- https://www.aqa.org.uk/subjects/physics/a-level/physics-7408/specification/subject-content/particles-and-radiation
- https://www.aqa.org.uk/subjects/physics/a-level/physics-7408/specification/subject-content/electricity
- https://www.aqa.org.uk/subjects/chemistry/a-level/chemistry-7405/specification/subject-content/organic-chemistry
