# Task 1: Required practical recall — v123 extension

Recorded: 26 October 2026. Source: current AQA 7408 and 7405 section 7.2. This is a revision-content handover, **not** evidence that a student has completed a practical or mastered it.

## Status

v122 was merged and deployed successfully. v123 extends the deck on a separate branch. The additions are **69 short questions** across the six remaining Year 2 required practicals in each science: Physics **35**, Chemistry **34**. If released, the bank becomes **1,826 cards (1,822 active)**. All new cards have their own IDs; existing 1,757 cards, saved progress IDs and associated XP/purchases are preserved.

## Physics — required practicals 7–12

| Practical | Concise recall focus |
|---|---|
| RP7 spring and pendulum SHM | period, relevant square-law relationships, repeated oscillations and small-angle approximation |
| RP8 Boyle's and Charles's gas laws | what is controlled, suitable graphs, kelvin and proportionality |
| RP9 capacitor charge/discharge | RC, logarithmic gradients and oscilloscope time-base |
| RP10 magnetic force on wire | F = BIL at 90°, force/current graphs and balance readings |
| RP11 flux linkage with search coil | flux angle, coil orientation and oscilloscope signals |
| RP12 gamma inverse-square law | expected graph, background subtraction, randomness and distance dependence |

## Chemistry — required practicals 7–12

| Practical | Concise recall focus |
|---|---|
| RP7 reaction rate | initial rate, continuous tracking, gradients and endpoint timing |
| RP8 electrochemical-cell emf | electrode potentials, voltmeter polarity and salt bridge |
| RP9 pH titration curves | equivalence, half-neutralisation, indicator range and pH measurements |
| RP10 organic product purity | melting-point interpretation, recrystallisation and liquid separation principles |
| RP11 transition-metal ion tests | common precipitate colours, ligand changes and complex colours |
| RP12 thin-layer chromatography | stationary/mobile phases, separation, purity and Rf |

## Quality rules

- Prompt and answer are short; one clearly defined retrieval target per card.
- Correct wording variants are explicitly stored in `accept`. The v122 generic marking and the answer-override control are retained.
- Every new card has `specRef: 7.2 RP#`, `taught:false`, `mock:false`; **new future practical cards stay out of mock and taught presets**.
- No unsupervised practical procedures, dangerous handling instructions or source acquisition are included.
- All original card IDs survive; revision progress is not reset.
- Tests: `tests/task1-practicals-v123.cjs`, `tests/task1-deck-audit-v122.cjs`, full cloud/marking/World safety workflows.

## Further work towards genuine specification completeness

This release improves practical coverage but **does not certify every AQA theory specification sub-bullet**. Main remaining work is an item-by-item mapping of each official subject-content bullet to one or more appropriate existing cards, separating recall facts from multi-step questions. The specification includes compulsory Physics sections 3.1–3.8 plus **one** optional topic from 3.9–3.13, not all five options for one student's examination. The existing site prepares Medical Physics as an optional locked selection; which option the user's centre will examine has not been confirmed here. Keep optional topic cards locked by default. Chemistry all 3.1/3.2/3.3 areas and all 12 required practicals remain in scope; Maths should continue to favour worked practice over extra rote cards.

Sources:
- https://www.aqa.org.uk/subjects/physics/a-level/physics-7408/specification/practical-assessment
- https://www.aqa.org.uk/subjects/chemistry/a-level/chemistry-7405/specification/practical-assessment
- https://www.aqa.org.uk/subjects/physics/a-level/physics-7408/specification/specification-at-a-glance
