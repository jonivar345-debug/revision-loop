# Task 1 v144 — eight precise AQA Chemistry Year 1 flashcards

**27 October 2026.** Follow-on to merged Task 1 v143, which completed actual answer review of the 106 previously front-keyword-only candidates in the selected v135 AQA sample.

## Contents

Eight newly created, concise Chemistry AS/Year 1 cards (`task1_v144_001`–`task1_v144_008`) addressing actual short-recall gaps or useful formula/structure facts rather than repeating long exam questions.

| New ID | Section | Focus |
|---|---|---|
| 001 | 3.1.2.2 | Meaning of a mole; amount of specified entities, Avogadro number |
| 002 | 3.1.3.1 | Phosphate and hydrogencarbonate formulae and charges (useful extension beyond listed examples) |
| 003 | 3.1.3.1 | Charge balancing in a neutral ionic formula |
| 004 | 3.1.3.4 | Mobile electrons and electrical conductivity in metals |
| 005 | 3.1.3.4 | Why molecular substances normally do not conduct |
| 006 | 3.2.1.2 | Increasing metallic bond strength and melting point from Na to Al |
| 007 | 3.2.1.2 | Sulfur S₈ compared with chlorine Cl₂ intermolecular forces |
| 008 | 3.2.1.2 | Argon compared with chlorine melting points |

**Why these:** AQA specifically includes using the mole concept, formulae of compound ions, explaining material properties from bonding, and the Period 3 melting-point trends. AQA does **not** require recall of the numerical Avogadro constant, so the new mole flashcard tests the concept, not an unnecessary memorised 15-digit constant. The phosphate and hydrogencarbonate card is supplementary useful practice, not an assertion that both are a separately named required AQA list.

## Release and safety

- Original deck v142: **3,144 cards / 3,140 active**. Proposed v144: **3,152 / 3,148 active**.
- All original 3,144 card records, exact IDs and model answers left unchanged. Version metadata updated and eight new unique review IDs appended.
- All eight new cards: subject Chemistry, taught Year 1 `stage:AS`, `scope:mock`, `mock:true`, `active:true`, short question/answer.
- No alterations to app runtime, Firebase sync, progress keys, user XP, shop, World, image galleries, required practical documents, scan-marking logic or exam questions.
- Historic tests retain their own fixed original version cohorts by excluding only `task1_v144_` new IDs; v143 audit snapshots still point at the v142 deck.
- New `tests/task1-v144-chemistry-precision.cjs` guards previous counts and IDs, AQA section labels, answer lengths, unique prompts, correct mock scope, accepted typed model answers and save key invariants.
- **Do not treat this as full syllabus certification.** The wider compulsory Year 2 coverage crosswalk and all required practical skills are still needed; a flashcard audit does not prove exam application mastery.

## Next work

1. Continue across each compulsory Year 2 Chemistry and Physics AQA subsection, checking memory facts before adding them.
2. Build an exact specification-to-deck-and-exam-question matrix for all three subjects and required practicals, with `covered / partially covered / needs question / absent / not applicable` states.
3. Leave calculation-heavy Mechanics graphs, SUVAT, unfamiliar VSEPR, IR interpretation, equations and practical evaluation principally in exam-question practice, with concise flashcards only for core rules.
4. Confirm the centre's actual Physics optional topic rather than assuming Medical Physics.

Source: AQA 7405 physical chemistry 3.1.2 and 3.1.3; inorganic chemistry 3.2.1. Source URLs in earlier v135/v143 audits.

**Publication gate:** all four existing CI workflows pass on this branch, then merge and confirm a successful Pages build. Until then the live deck remains v142.
