# Task 1 v126 — tests to memorise and exact definitions

**Date:** 26 October 2026. **State:** pull-request candidate, not live until merged and deployed.

## Release inventory

- Base v125 on main: **2,414 cards (2,410 active)**, with all historical IDs kept.
- New v126: **89 compact flashcards** (76 Chemistry, 13 Physics).
- Proposed v126: **2,503 cards (2,499 active)**. None of the original 2,414 card records, review IDs, cloud saving, XP, purchased items or World photographs has been changed.
- Subject/topic focus: RP4 ion identification (14), RP6 organic identification (10), aldehydes and ketones (9), aqueous metal ions (9), organic analysis (7), halogenoalkanes (3), Chemistry practical and titration definitions (16), thermodynamics (4), electrochemical cells (4), Physics measurements (6), materials (4) and waves (3).
- Of the 89 new cards: **63 AS/mock eligible**, **13 taught A2 Chemistry/mock eligible**, **13 untaught A2/non-mock**.
- This release concentrates on recalling observations, correct inferences and exact definitions. It is deliberately not an experimental instruction pack.

## Main quality decisions

- New identification questions reverse the usual direction: observations on the front, ion/functional-group identification on the back; existing forward colour-recall questions are kept.
- Four answers where oxidation-state numerals matter use `strictRecall:true` and explicit alternatives (Fe²⁺/Fe³⁺/Cu²⁺/Al³⁺). Those cards must not grant full credit to near-spellings that are chemically different.
- All other cards retain flexible equivalent-wording grading. The exact mode is opt-in only.
- All model answers and every accepted alternative have been run through the actual `evaluateCard` logic, with deliberate wrong-ion and wrong-test counterexamples. The regression suite runs these again in CI.
- Nine unclear, redundant or semantically duplicate candidates were removed during review; three card prompts/answers were clarified.
- Individual card fronts are at most 150 characters, answers at most 180, with accepted one-line synonyms and no long numerical workings.
- Standard chemical-test observations are academic interpretation prompts only; there are no directions for obtaining or handling chemicals.

## Remaining Task 1 work

The bank's **1,216 active older cards without exact `specRef` tags** still need semantic mapping to the individual AQA bullets. Extra flashcards on broad chapter headings are not proof of complete specification coverage. Confirm the Physics option before enabling all option cards. The written exam bank remains the place for multi-step calculations, mechanisms, experimental design and full marks.

## Source specifications

- AQA 7405 Inorganic: https://www.aqa.org.uk/subjects/chemistry/a-level/chemistry-7405/specification/subject-content/inorganic-chemistry
- AQA 7405 Organic: https://www.aqa.org.uk/subjects/chemistry/a-level/chemistry-7405/specification/subject-content/organic-chemistry
- AQA 7405 Physical: https://www.aqa.org.uk/subjects/chemistry/a-level/chemistry-7405/specification/subject-content/physical-chemistry
- AQA 7408 Measurements: https://www.aqa.org.uk/subjects/physics/a-level/physics-7408/specification/subject-content/measurements-and-their-errors
- AQA 7408 Mechanics: https://www.aqa.org.uk/subjects/physics/a-level/physics-7408/specification/subject-content/mechanics-and-materials
