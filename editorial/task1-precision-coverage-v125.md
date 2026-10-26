# Revision Loop Task 1 — v125 precision coverage ledger

**26 October 2026 — development branch; not a release until checks and deployment pass.**

## Current draft inventory

- Merged v124 baseline: **2,251 total, 2,247 active**.
- New v125: **165** concise cards: **85 Physics**, **80 Chemistry**, **0 Maths**.
- Proposed total: **2,416 total, 2,412 active**.
- **All 2,251 old card records and IDs remain**. No local storage, cloud/Firebase, XP, points, purchases, World galleries, source questions, or marking algorithms were altered.
- **80** v125 prompts have manually added alternative correct answers (some have several).
- Two proposed prompts were excluded before release: an ambiguous enthalpy question and a third-order rate-order prompt outside AQA's individual order range. Three exact/high-similarity candidates were also excluded.
- Scope rules: v125 Year 1 Physics is mock-eligible; taught A2 Chemistry is Chemistry-mock-eligible; v124 untaught A2 Physics and optional Medical cards stay outside mock mode.
- Full v125 tests: counts, historical ID retention, length and section refs, short-answer examples, wrong-answer counterexamples and scope controls. Existing v124, v123 and v122 tests remain in CI.

## Added material by topic

**Physics**: vector components and force equilibrium; couples and moments; reading all signed motion-graph gradients and areas; projectile motion; impulses and momentum; work/power and energy conversion; Hooke's law, stress/strain and wire diameter; wave polarisation, stationary-wave spacing and refraction; resistance and circuits; precise practical recall for Physics RP1–6.

**Chemistry**: standard formation and combustion enthalpy details; Kc responses and catalysts; Period 3 conductivity/melting explanations; Group 2 reactions, trends and solubility; halogen colour and silver nitrate/ammonia tests; Born–Haber enthalpy definitions and hydration; Gibbs/entropy unit consistency; rate-order and k-unit definitions; buffers, Ka/pH, indicators; curly-arrow conventions; carbonyl tests and acyl-derivative terminology.

## What the machine-readable ledger can and cannot prove

`editorial/task1-spec-ledger-v125.json` lists **102 subject/section groups** and counts card tags, taught flags, mock flags and topic labels. It reports **1,216 active untagged historic cards**. These cards remain in the deck, often grouped by a meaningful topic name. Their lack of an exact `specRef` makes a literal line-by-line coverage declaration premature; missing a specific tag does **not** prove missing subject content.

A proper certification process still needs:
1. Extract every assessed AQA subject-content *sub-bullet*, including practical assessment, numerical and maths skills, as the audit baseline.
2. Map **all old cards**, including the 1,216 active untagged entries, to those bullets when semantically valid. Do not assign a section just to inflate coverage.
3. Distinguish suitable **recall cards** from mechanisms, multi-stage maths/Physics workings, experimental graphs and extended Chemistry calculations that belong in exam-question practice.
4. Investigate truly unmatched bullets, then add targeted cards or exam questions with positive **and** negative answer-marking examples.
5. Confirm actual Physics optional module with the user before unlocking its cards or declaring the optional syllabus covered.
6. Validate randomised practice sessions, diagrams, answer-side images, space-repetition transitions and cross-device progress after each significant release.

The v124 and v125 expansions cover every principal compulsory chapter at least at topic level, **not** every individual AQA bullet. We should never advertise them as a guaranteed complete specification audit.

## Official AQA reference pages

- Physics 7408 content: https://www.aqa.org.uk/subjects/physics/a-level/physics-7408/specification/subject-content
- Physics Mechanics and Materials: https://www.aqa.org.uk/subjects/physics/a-level/physics-7408/specification/subject-content/mechanics-and-materials
- Physics Measurements and Errors: https://www.aqa.org.uk/subjects/physics/a-level/physics-7408/specification/subject-content/measurements-and-their-errors
- Chemistry 7405 Physical: https://www.aqa.org.uk/subjects/chemistry/a-level/chemistry-7405/specification/subject-content/physical-chemistry
- Chemistry 7405 Inorganic: https://www.aqa.org.uk/subjects/chemistry/a-level/chemistry-7405/specification/subject-content/inorganic-chemistry
- Chemistry 7405 Organic: https://www.aqa.org.uk/subjects/chemistry/a-level/chemistry-7405/specification/subject-content/organic-chemistry
