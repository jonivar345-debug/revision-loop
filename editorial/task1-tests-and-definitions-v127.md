# Task 1 v127 — AQA identification tests and exact definitions

**26 October 2026.** Branch based on the independently merged 100-card Year 1 Chemistry **v126** release.

## Exact inventory and preserved content

| | Main v126 baseline | Proposed v127 |
|---|---:|---:|
| All flashcards | 2,514 | **2,603** |
| Active | 2,510 | **2,599** |
| 100 Chemistry Year 1 additions from independent v126 | 100 | **100, unchanged** |
| New identification/definition cards | — | **89** (76 Chemistry, 13 Physics) |

Every one of the 2,514 pre-v127 card IDs is retained. This includes cloud-linked review progress and the 100 new cards covering Kinetics, Equilibria, Redox, Periodicity, Group 2 and Group 7.

## Study content added

The new batch prioritises the kinds of *test results and definitions students are expected to know*:

- Chemistry RP4: interpreting silver-halide colours and ammonia-solubility observations; identifying sulfate, carbonate and ammonium results; discussing limits of observations
- Chemistry RP6: interpreting alkene and carboxylic-acid observations, recognising alcohol oxidation results, distinguishing primary/secondary alcohol limitations
- Carbonyl analysis: interpreting combined 2,4-DNPH, Tollens' and Fehling's outcomes, identifying aldehyde/ketone ambiguity
- Spectroscopy and hydrolysis: simple IR patterns and evidence of halogenoalkane hydrolysis
- A2 aqueous ions: interpreting Fe(II), Fe(III), Cu(II), Al(III) hydroxide colours and explaining ligand/colour changes
- Chemistry definitions: titration end point versus equivalence point, concordance, false positives/negatives, anomalous results, standard molar entropy, enthalpy of solution, half-cell and electrode-potential terms
- Physics definitions: repeatability, reproducibility, instrument resolution, fractional uncertainty, wave intensity, elasticity and stiffness

Counts by preset: **63 AS/mock**, **13 taught A2 Chemistry/mock**, and **13 future A2/non-mock**. Earlier cards, practicals, Worlds and questions are unchanged.

## Exact-answer quality

The default answer checker continues accepting normal paraphrases. Four new charge-sensitive cards deliberately specify `strictRecall:true`, with multiple curated exact equivalent answers. For example, **Fe(II) must not be credited as Fe(III)**. This prevents the previous fuzzy-marking failure without forcing exact wording for ordinary definitions. Test automation covers every new model answer and accepted variant, plus wrong-ion, wrong-halide and other contradiction examples.

Only observation recognition and scientific definitions are included. The cards are not operational chemistry instructions.

## Release requirements

- Run all existing cloud, scanner, World and browser regression suites.
- Run `tests/chemistry-year1-chat-v126.cjs` for the 100 separately added cards.
- Run `tests/task1-tests-definitions-v127.cjs` for the additional 89 cards, charge-sensitive marking, existing ID preservation, section tags and mock scope.
- Verify the actual Pages deployment after merge; no cloud storage, XP, saved purchases, profile keys, and data migration are changed.

## Limits

There are **1,216 active historic flashcards lacking individual AQA specRef metadata**. They still need a manual semantic mapping to every specification sub-bullet before claiming complete coverage. Long calculations and practical planning belong in exam questions.

Source: AQA Chemistry 7405 sections 3.1, 3.2, 3.3 and practical assessment; AQA Physics 7408 sections 3.1, 3.3 and 3.4.
