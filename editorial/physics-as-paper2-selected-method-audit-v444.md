# v444 — AQA AS Physics Paper 2: selected question-style verification

**Exam:** 7407/2, June 2022 and June 2023. **Date checked:** 11 November 2026.  
**Status:** 10 selected techniques checked against official question papers and mark schemes, and transformed into original coaching prompts. **This is not a complete past-paper index or full examiner-style marking certification.**

## Source documents

- [June 2022 question paper](https://filestore.aqa.org.uk/sample-papers-and-mark-schemes/2022/june/AQA-74072-QP-JUN22.PDF) and [mark scheme](https://filestore.aqa.org.uk/sample-papers-and-mark-schemes/2022/june/AQA-74072-MS-JUN22.PDF)
- [June 2023 question paper](https://filestore.aqa.org.uk/sample-papers-and-mark-schemes/2023/june/AQA-74072-QP-JUN23.PDF) and [mark scheme](https://filestore.aqa.org.uk/sample-papers-and-mark-schemes/2023/june/AQA-74072-MS-JUN23.PDF)

These links cite actual AQA sources; **none of the following questions copies an original question's wording or numerical dataset.** Exact source-to-card mappings are in `editorial/physics-as-paper2-selected-sources-v444.json`.

## Distinct techniques checked and added

| AQA question reference | Original answer skill | New original coaching ID |
|---|---|---|
| June 2022 Q01.6 | Distinguish a systematic trigger delay from random errors and explain the displacement of points in a transformed motion graph | `as_p2_v444_001` |
| June 2022 Q02.2 | Rearrange a balanced electrical bridge ratio to find an unknown resistor, then divide by wire length when required | `as_p2_v444_002` |
| June 2022 Q02.6 | Infer the necessary diameter change from a resistivity change at fixed resistance per unit length; take the **square root** of the ratio | `as_p2_v444_003` |
| June 2023 Q01.5 | Test an asserted inverse proportionality by comparing **two or more** calculated products, with correct units and a conclusion | `as_p2_v444_004` |
| June 2023 Q01.6 | Use the square-root relation between tension and the first-harmonic frequency of a string | `as_p2_v444_005` |
| June 2023 Q02.5 | Use the turning point of a best-fit curve, then take **closer measurements around that point** rather than vaguely repeating readings | `as_p2_v444_006` |
| June 2022 Q03.4–03.5 | Find *actual* source-to-detector path differences for coherent waves; a first minimum corresponds to a half-wavelength difference | `as_p2_v444_007` |
| June 2022 Q03.1 | Distinguish charging duration from discharge duration when calculating an average battery output power | `as_p2_v444_008` |
| June 2022 Q03.3 | Know both coherence conditions: constant phase difference and same frequency | `as_p2_v444_009` |
| June 2023 Q02.4 | A constant stopwatch absolute uncertainty becomes a smaller percentage of a longer measured interval | `as_p2_v444_010` |

## Mark-scheme cautions worth teaching

- In the **2022 timing graph** example, saying only “the measurements change” is too vague: refer to what changes in the **graph** itself. The reviewed marking guidance allows a rightwards displacement or related accurately described change.
- In the **2022 interference** example, the mark scheme does **not** credit an inappropriate small-angle double-slit shortcut. Find the two geometrical path lengths.
- In the **2023 standing-wave** example, showing calculations at multiple points is stronger than making an unsupported visual assertion of an inverse relationship.
- In the **2023 turning-point** example, “take more readings” is too general; target the region near the minimum.
- MCQ coaching is strictly four-choice with one canonical marked answer and three authored distractors. These are *original questions*, not AQA MCQs.

## Code and progress integrity

- 140 prior AS Paper 2 cards stay **byte-equivalent**, with SHA-256 `7367d4a13e90caf94a99e6234f21df9fa587960d85c84e7a6458886ae5b7f528` when serialised as the existing card array.
- 10 additional cards use only new `as_p2_v444_001`–`010` IDs. The combined trainer has **150 cards**: Section A **47**, B **34**, C **69**.
- Existing progress, profile, settings, marks, cloud keys and World purchases are not migrated or reset. School Mock eligibility remains separate (`mock:false`).
- The original `physics_as_paper2_guided_v430.json` asset path is retained so service-worker caching and the existing trainer can load the expanded bank.

## Remaining sign-off

This audit covered selected *written* question parts from only two sittings, not every question or any of the 30 real Section C MCQs on either paper. Verification of the other parts of 2022/2023 and the 2018–2021 and 2024–2025 papers remains open. The full AQA subsection ledger, examination marking calibrations, diagrams, practical setups and historical paper completeness must still be checked before **Task 1** is called complete.
