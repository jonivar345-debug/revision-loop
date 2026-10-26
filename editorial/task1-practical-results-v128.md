# Task 1 v128 — practical results and definitions

**26 October 2026. Release candidate pending GitHub checks.**

## What was changed
- Merged v127 baseline: **2,603 cards / 2,599 active**.
- Proposed v128: **2,659 cards / 2,655 active**, adding **56** concise prompts: **49 Chemistry**, **7 Physics**.
- All **2,603 previous flashcard records and IDs remain unchanged**. No personal storage, Firestore, XP, shop ownership, World galleries, exam question records, or progress migration changed.
- Focus: interpreting *results* and recalling *definitions*, not practical reagent handling or long worked questions.
- 3 exact and 25 more semantic/redundant candidates discarded. Out-of-spec concepts including reaction quotient and confidence intervals were excluded.

## Subject/topic additions
- Chemistry RP7: initial rate, interpreting tangents, clock endpoint and reciprocal-time approximation.
- Chemistry RP9: titration pH-curve axes, buffer region, equivalence and indicator selection.
- Chemistry RP8: interpreting cell emf, anode/cathode, salt-bridge charge transport, standard electrode notation.
- Chemistry RP10: solid melting range and liquid boiling point as purity/identity evidence; limits of percentage yield.
- Chemistry RP12: TLC retention, multiple spots, phase affinity and why matching Rf is not absolute proof of identity.
- Chemistry RP11: a small number of aqua-ion and ligand concepts without duplicating v127's Fe²⁺/Fe³⁺ identification test questions.
- Chemistry theory: basic analytical definitions, evidence from IR, rate constant and equilibrium composition.
- Physics: calibrated measurements, random versus systematic errors, gradient uncertainty and emf/internal-resistance concepts.

**Mock filters:** 32 new cards eligible, made up of AS cards and taught Year 2 Chemistry. Another 24 are later A2 content and remain outside the November mock queue.

## Quality and preservation checks
The new automated `tests/task1-practical-results-v128.cjs` checks:
- exact total and subject/preset counts and unique card IDs
- preservation of the 2,603 pre-v128 card records, including the independently merged 100-card Year 1 Chemistry v126 batch
- all new model answers and every curated alternative against the site's actual answer checker
- 20 counterexamples to ensure opposite conclusions cannot receive full credit
- flashcard length, correct AQA references and no multi-stage questions.

The cumulative v127 test was updated to retain its exact 89-card and historical ID assertions while allowing later additions. The new test is included in GitHub cloud/flashcard CI. Merge only when cloud, scanner, World safety and browser checks pass.

## Historical untagged flashcards — separate review list
See `editorial/legacy-spec-topic-crosswalk-v128.json`. The file supplies provisional topic-based *candidates* for all 1,216 active untagged cards, **not a claim of verified mapping**.

| Subject | Active older cards without exact specRef | Broad topic candidate identified | Still requiring manual topic classification |
| --- | ---: | ---: | ---: |
| Physics | 408 | 408 | 0 |
| Chemistry | 705 | 692 | 13 |
| Maths | 103 | 0 | 103 |
| **Total** | **1,216** | **1,100** | **116** |

Even the **1,100 candidates have not been verified by reading individual card content**. A chapter label cannot certify coverage of its sub-bullets. Maths was deliberately left unclassified because its cards mix Year 1 and Year 2 topics, and Maths is better assessed by worked questions.

## What remains
1. Compare official AQA 7408 and 7405 individual compulsory specification bullets against every relevant *card front and back*, including the legacy set. Mark actual recall coverage separately from calculations and experimental design.
2. Prioritise missing precise definitions and test-result recognition; avoid duplicated trivial prompts.
3. Check images and correct-answer recognition with real student responses, including alternatives with the opposite meaning.
4. Keep full Physics A-level optional modules separate until the school's actual optional topic is known.

## Official reference material
- https://www.aqa.org.uk/subjects/chemistry/a-level/chemistry-7405/specification/practical-assessment
- https://www.aqa.org.uk/subjects/chemistry/a-level/chemistry-7405/specification/subject-content/organic-chemistry
- https://www.aqa.org.uk/subjects/chemistry/a-level/chemistry-7405/specification/subject-content/inorganic-chemistry
- https://www.aqa.org.uk/subjects/physics/a-level/physics-7408/specification/subject-content/measurements-and-their-errors
