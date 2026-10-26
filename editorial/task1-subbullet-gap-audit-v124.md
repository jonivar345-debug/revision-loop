# Revision Loop Task 1: full A-level flashcard sweep, v124

**Date:** 26 October 2026. **Release:** draft PR #70, pending all required checks and review. **Base:** merged v123.

## Exact inventory

| | Live v123 baseline | New in draft v124 | Proposed total |
|---|---:|---:|---:|
| Physics | 655 | **152** | 807 |
| Chemistry | 1,054 | **264** | 1,318 |
| Mathematics | 117 | **9** | 126 |
| **All cards** | **1,826** | **425** | **2,251** |
| Active cards | 1,822 | 425 | **2,247** |

All 1,826 pre-existing IDs are retained. Four legacy inactive cards remain inactive. There is no revision-history reset, point/XP change, new purchase, cloud-data migration or change to exam-question archives. Creating recall cards does not mean the student has mastered them.

**Quality design:** short single-target questions (new front ≤170 and back ≤205 characters); dedicated AQA references, AS mock flags separated from taught and untaught A2, curated answer alternatives; **17 new fill-in-the-gap prompts**; **21 existing labelled SVGs reused on answer side only**, never revealing answers on the front. Nine near-duplicate Physics prompts and several Chemistry near-duplicates were excluded. Over 90 question-specific short-answer additions and safe grammatical variants were supplied to the existing marking system, with positive and negative regression cases.

## Coverage added in this sweep

### Physics AQA 7408

- 3.1 Measurement: prefixes and SI dimensions, uncertainty arithmetic, random/systematic errors and graph interpretation.
- 3.2 Particles and radiation: quarks, interaction exchange particles, lepton conservation, photon/stopping potential and photoelectric graphs.
- 3.3 Waves: phase, stationary-wave nodes and antinodes, diffraction, coherence, fringe spacing and refraction.
- 3.4 Mechanics and materials: signed areas/gradients on motion graphs, resultant forces, slopes, impulse, equilibrium, elastic/plastic deformation, Young modulus interpretation.
- 3.5 Electricity: meters, terminal voltage versus current, internal resistance, current sharing and resistor/semiconductor behaviour.
- 3.6 Further mechanics and thermal physics: SHM phase, natural frequency, resonance, heat/state changes, ideal-gas assumptions and RMS speed.
- 3.7 Fields: satellite energy/escape/orbits, field versus potential graphs, dielectrics/capacitance, magnetic forces, alternating current, transformers and electromagnetic induction.
- 3.8 Nuclear: decay graphs and λ, half-life, binding energy, radius and conceptual fission/fusion.
- 3.10 Medical option: a few additional MRI concepts retained **outside mock by default**, as the school's actual Physics option has not been confirmed.

AQA 3.7 subsection labels have been reconciled: 3.7.1 Fields, 3.7.2 Gravitational, 3.7.3 Electric, 3.7.4 Capacitance and 3.7.5 Magnetic/Induction/AC/Transformers. Eight older v122 cards carrying the nonexistent 3.7.6 reference were metadata-corrected. No historical card IDs were changed.

### Chemistry AQA 7405

- **3.1.1–3.1.7 physical AS**: isotope/mass spectra and 4s electrons, mole/stoichiometric relationships, intermolecular forces/VSEPR, calorimetry and Hess cycles, collisions/distributions, Kc and redox.
- **3.1.8–3.1.12 advanced physical**: lattice/Born–Haber, entropy/ΔG, orders and Arrhenius, Kp, electrode-cell notation and buffers/pH including basic buffers.
- **3.2.1–3.2.3 inorganic AS**: Period 3 trends, Group 2 solubilities and applications, Group 7 oxidising/reducing trends and halide tests.
- **3.2.4–3.2.6 advanced inorganic**: Period 3 oxides and acidity, transition-metal coordination/ligands/isomerism and aqua-ion reactions/colours.
- **3.3.1–3.3.6 organic AS**: formulae and isomerism, radical steps, halogenoalkanes, electrophilic addition, alcohols and IR/MS identification.
- **3.3.7–3.3.16 advanced organic**: chirality, carbonyl tests, carboxylic acids/acyl derivatives, benzene reactions, amines, polyesters/polyamides, amino acids/DNA, synthetic efficiency, NMR and chromatography.

### Mathematics AQA 7357

Nine brief Maths prompts on proof, domains and functions, differentiation, trigonometry and integration. Selected Year 2 concepts are **not** included in the Year 1 Pure November mock preset. Maths still needs written questions with working/method marks, rather than an enormous recall deck.

## Mock and saved-progress safeguards

- AS review cards from confirmed Year 1 content can be selected in November mock mode.
- Selected taught A2 Physics 3.6 and Chemistry 3.1.8/9/10/12 and 3.3.7–9 are tagged taught where appropriate but **not** inserted into the AS Physics or Year 1 Maths presets merely because the topic exists.
- Future compulsory A2 and Medical option cards are `taught:false, mock:false`.
- CI verifies previous card IDs, new card lengths, current totals, distinct prompts, mock gating, actual diagram IDs, alternate correct answers, common wrong answers and AQA subsection tags.
- Old version regressions are cumulative: v123 required-practical test no longer wrongly assumes the entire future deck must remain exactly 1,826.

## Unfinished work: NOT a specification completeness certificate

**This is a broad sweep of all main theory sections, not an independently verified one-to-one mapping of every assessed line.** Remaining work includes individually mapping each official AQA sub-bullet to current flashcards and/or exam-style calculations, reviewing many hundreds of real answer variants, checking images in browsers, and confirming the chosen Physics option. In particular, lengthy mechanisms, full organic multi-step syntheses, physical experimental data interpretation and all multi-step mathematics remain better assessed through the written question bank.

Do not resume paused World photograph expansion in this Task 1 release. Preserve cloud/local progress and all purchases.

## AQA source pages

- Physics 7408 subject content: https://www.aqa.org.uk/subjects/physics/a-level/physics-7408/specification/subject-content
- Physics Fields section (3.7, including subsection numbering): https://www.aqa.org.uk/subjects/physics/a-level/physics-7408/specification/subject-content/fields-and-their-consequences-a-level-only
- Chemistry 7405 full list: https://www.aqa.org.uk/subjects/chemistry/a-level/chemistry-7405/specification/specification-at-a-glance
- Chemistry physical: https://www.aqa.org.uk/subjects/chemistry/a-level/chemistry-7405/specification/subject-content/physical-chemistry
- Chemistry inorganic: https://www.aqa.org.uk/subjects/chemistry/a-level/chemistry-7405/specification/subject-content/inorganic-chemistry
- Chemistry organic: https://www.aqa.org.uk/subjects/chemistry/a-level/chemistry-7405/specification/subject-content/organic-chemistry
- Mathematics 7357: https://www.aqa.org.uk/subjects/mathematics/a-level/mathematics-7357/specification/subject-content
