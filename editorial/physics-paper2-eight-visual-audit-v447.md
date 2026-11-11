# v447 — eight original visual questions for AQA AS Physics Paper 2

**Date:** 11 November 2026  
**Scope:** AQA 7407/2 Section C, **June 2024**. The v446 audit identified eight questions whose central skill depends on a diagram or graph. We added one *new original* visual multiple-choice practice question for each technique. They are deliberately **not** copies of the original AQA diagrams, question text, data sets or answer options.

**Primary comparison:** [June 2024 AQA 7407/2 question paper](https://mmerevise.co.uk/app/uploads/2025/10/AQA-74072-QP-JUN241.pdf) and [final AQA mark scheme](https://mmerevise.co.uk/app/uploads/2025/10/AQA-74072-MS-JUN241.pdf). The existing complete 30-question skill inventory is in `editorial/physics-paper2-mcq-2024-skill-matrix-v446.json`.

| Source style | Original illustrated practice | What the learner must do |
|---|---|---|
| 2024 Q09: voltage divider | `as_p2_v447_001` | Read **which component** the voltmeter spans; calculate 12×6/(3+6)=**8.0 V** across the 6 kΩ resistor |
| 2024 Q10: force–extension/energy graphs | `as_p2_v447_002` | From linear Hooke-law `F=kx`, infer `E=½kx²`: energy against extension is an **upward-curving** graph |
| 2024 Q11: falling object graph | `as_p2_v447_003` | Read graph **axes**: speed approaches a nonzero terminal speed as air resistance grows, not constant acceleration |
| 2024 Q15: two-source interference geometry | `as_p2_v447_004` | Take the **difference of the two real paths**, 1.50−1.20=0.30 m, and use first-minimum `Δ=λ/2` to obtain **0.60 m** |
| 2024 Q18: resistor network | `as_p2_v447_005` | Analyse separately labelled parallel paths; add 9/6+9/3=**4.5 A** instead of dividing the source voltage |
| 2024 Q19: acceleration graph | `as_p2_v447_006` | Add the **signed areas** +2×3 and −1×2 to initial velocity +1, giving **+5.0 m s⁻¹** |
| 2024 Q25: balanced cable forces | `as_p2_v447_007` | Resolve the two angled tensions vertically: `2T sin30°=mg`, so **T=40 N** for 4 kg at g=10 |
| 2024 Q26: uniform resistance-wire divider | `as_p2_v447_008` | Read **the correct segment AC** and use voltage/length proportionality: 10×0.30/1.00 = **3.0 V** |

## How the card works

Every card presents its own SVG diagram first, followed by one short question and four original options. Correct responses receive the existing Paper 2 marking, points/review controls and explanation. An optional first-step hint and explicit *common trap* explain the method. The SVG includes a readable title and description, and the card has a visible text caption for accessibility and small screens.

The diagrams are schematic and, unless a question states otherwise, **not drawn to scale**. The labelled values, not the drawing's visual proportions, govern calculations.

## Identity and regression gates

- New original IDs: `as_p2_v447_001`–`008`; the previous **190 cards** are unchanged, with SHA-256 `e69a41dfcd57f198bacd132f6d2f929e2187b422922befb85affd2dacd0846ca` for the existing card array.
- The trainer now contains **198 cards**: **71 Section A, 44 Section B, 83 Section C**.
- New diagrams are defined in **`physics-paper2-visuals-v447.js`**, independent of external images and therefore available offline. The app uses the existing diagram renderer only for the new identifiers and leaves legacy diagrams alone.
- HTML and service-worker versions are updated; no existing progress, cloud-sync, profile, XP, shop or marking data keys are changed.
- The new cards remain **outside school mock eligibility** (`mock:false`), and the separate unlimited sessions, Skip and self-rating actions are unchanged.
- `tests/physics-paper2-visual-v447.cjs` asserts distinct valid accessible SVGs, sourced skill references, physics answers, unique choices, earlier card identity and offline asset listing. The real Chromium Paper 2 test renders **all eight** on phone/desktop, checks each caption/visual, validates model answers and rejects incorrect distractors.

## What is *not* certified

These eight new questions train the major *diagram-dependent ideas*, but **do not establish exact equivalence to the corresponding AQA figures and MCQ answer options**. The earlier 2024 full Section C classification has 30 source rows and is a skills inventory, not a reproduced set of 30 AQA questions. A line-by-line examiner-mark-equivalence audit, especially across all years, remains necessary. The **2025** original paper and scheme remain to be checked independently before the provisional v446 source labels are promoted to verified status. Task 1 and Task 2 remain open.
