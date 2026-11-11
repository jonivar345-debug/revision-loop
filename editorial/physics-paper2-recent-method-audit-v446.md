# v446 — 2024–2025 AS Physics Paper 2 coaching audit

**Exam:** AQA 7407/2 (AS Physics Paper 2). **Checked:** 11 November 2026. **Release status:** development branch until exact-head build and browser QA pass.

## Evidence standard — do not confuse these sources

**June 2024: primary paper and mark scheme checked.** Original AQA [question paper](https://pmt.physicsandmathstutor.com/download/Physics/A-level/Past-Papers/AQA/AS-Paper-2/QP/June%202024%20QP.pdf) and [mark scheme](https://pmt.physicsandmathstutor.com/download/Physics/A-level/Past-Papers/AQA/AS-Paper-2/MS/June%202024%20MS.pdf), mirrored by PMT, were inspected directly. Twelve **original, short** coaching questions target techniques verified in those sources. The adapted numerical values and wording are different from AQA's.

**June 2025: topic-index summary only.** The [question-by-question index](https://questionvault.co.uk/past-paper-questions/aqa-as-level-physics/papers/2025-june-7407-paper-2/) records grating measurements, balance-based centre of mass, internal-resistance energy conservation, projectiles and certain MCQ themes. An accessible full **original 2025 question paper plus complete mark scheme were not obtained** in this audit. The eight new 2025-style questions are deliberately marked as **provisional original practice**, not exact source-and-scheme verified adaptations. Do not imply their question numbers represent an individually audited subpart or their numerical answers were marked by AQA.

## 2024: actual assessment techniques

| AQA question | What the answer method must teach | New card |
|---|---|---|
| 01.2 | Count non-integer cycles on an oscillation trace, then multiply by the period | `as_p2_v446_001` |
| 01.4 | Acceleration from displacement and time using `s=½at²` for release from rest | `002` |
| 01.6 | Combine percentage uncertainties from `a=2s/t²`, doubling the time uncertainty | `003` |
| 01.7 | Friction reduces acceleration and makes `g=a/sinθ` underestimate g | `004` |
| 02.2 | Use a smooth fitted curve to interpolate a graph, not a jagged dot-to-dot line | `005` |
| 02.3 | Identify when an indentation depth is physically impossible and change the apparatus force/ball diameter | `006` |
| 02.5 | Explain *why* a larger measured diameter improves fractional uncertainty or allows averaging | `007` |
| 03.2 | Combine multiple tension forces, subtract the total weight, then apply Newton's second law | `008` |
| 03.3 | Check the specified safety factor by comparing a multiple of working stress to breaking stress | `009` |
| 03.4 | Convert power/energy consistently, account for delivery efficiency and compare supply with demand | `010` |
| 04.1 | Include a reflection-induced half-cycle phase reversal in two-beam interference | `011` |
| 04.3 | Frequency stays constant on entering water, wavelength and wedge fringe spacing decrease | `012` |

These are **skill-to-source** links, not imported AQA exam questions. They remain short method cards with optional hints/traps. A longer written problem still needs detailed working and human review where appropriate.

## 2025: separately labelled *provisional* question styles

| Indexed 2025 theme | New original example | Card |
|---|---|---|
| Q1 diffraction grating | Line density conversion then first-order grating wavelength | `013` |
| Q1 uncertainty | Add two endpoint reading uncertainties and express as a percentage | `014` |
| Q2 balancing a tapered beam | Find centre of mass by moments from two support reactions | `015` |
| Q2 balance experiment | Independent horizontal-alignment check | `016` |
| Q3 headlamp/source circuit | Conservation of power including lost power in internal resistance | `017` |
| Q4 projectile motion | Separate the vertical drop from horizontal launch motion | `018` |
| Q5 MCQ string frequency | First-harmonic frequency scales with square root of tension or hanging mass | `019` |
| Q27 MCQ resistivity | Diameter contributes *twice* its percentage uncertainty to resistivity | `020` |

All 2025 entries carry `sourceStyle.verification="2025_secondary_question_index_only_mark_scheme_unverified"`, which must be respected in editorial reports and future releases.

## Code, content and safety checkpoints

- The original **170 cards** must remain unchanged in all fields, including IDs, accepted wording, hints, distractors and saved scheduling history. SHA256 of the first 170 card objects (serialised array): `939165b0d8079a3fd1bd954642734799c17942c5fedac21b1bbb47d05994b942`.
- Adds exactly **20** distinct `as_p2_v446_001`–`020` cards; now **190** in the trainer: **Section A 71, B 44, C 75**. New questions are original text with independently authored numbers.
- The school Mock selector remains separate (`mock:false`). App loader now accepts the new ID family without changing original IDs or user progress schema.
- Numeric answers, subject-specific options, phone/desktop layout, skip, override, unlimited sessions, offline cache and cloud/history protection require explicit regression checks.
- Machine-readable mapping: `editorial/physics-paper2-recent-sources-v446.json`; the primary/provisional distinction must not be lost when future authors add further cards.

## Full 2024 Section C question-family inventory

The **30 source MCQs, 05–34**, now have a concise question-by-question assessed-method classification in `editorial/physics-paper2-mcq-2024-skill-matrix-v446.json`, based on the same original 2024 question paper and mark scheme. This **does not** reproduce the original exam items or answer key; nor does it certify the 190-card trainer reproduces every distinct 2024 MCQ style. Eight styles depend on original diagrams/graphs and are flagged for visual editorial review, particularly divider circuits, spring-energy graphs, fall-with-drag graphs, two-source interference, resistor networks, acceleration graphs, cable tensions and the resistance-wire divider. The regression `tests/physics-paper2-mcq-2024-audit-v446.cjs` requires exactly 30 consecutive question rows and these eight diagram-sensitive cases.

## Remaining work before Task 1 sign-off

A full check of the **2025 original question paper and mark scheme**; a line-by-line paper coverage assessment for **each year from 2018 onwards**, especially every Section C MCQ; full AS specification practical-method and multi-mark answer calibration; and wider Maths/Chemistry mock topic work. Completing the coach does not guarantee a particular exam grade or replace timed official past-paper practice. Task 2's remaining photo/character quality work is separate.
