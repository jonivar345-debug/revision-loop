# Task 1 v130 — AQA short-recall specification pass
26 October 2026 — development candidate, NOT independently certified as full-specification coverage.

## Scope and totals
- Starting point: v129 branch, 2,686 total cards / 2,682 active.
- New: 160 short recall cards — 72 Physics, 84 Chemistry, 4 Maths.
- Draft count: 2,846 total / 2,842 active, with every previous card ID retained.
- 105 new cards are marked mock-eligible; later untaught A2 material excluded. Year 2 Physics is excluded from the Year 1 Physics mock even where taught.
- 19 candidates were removed during lexical duplicate checks. Distinct E/Z and NMR triplet/quartet facts were retained separately.
- No Firestore, profile, purchases, XP, cloud save, World photos or exam-bank data changed.

## Coverage priorities
Physics: SI units and uncertainties, particle conservation laws and quantum effects, waves, motion and force graphs, electricity, SHM, ideal gases and latent heat, gravitational and electric fields, capacitance, magnetism, nuclear physics.
Chemistry: mass spectrometry, bonding, Hess-law definitions, equilibria, entropy, rate equations, weak acids, Kp and cells, Period 3 oxides, transition metals, organic isomerism, cracking, ozone, alkenes, alcohols, IR and qualitative tests, aldehydes, esters, aromatic chemistry, amines, polymers, NMR and synthesis.
Maths: four very short Year 1 Pure reminders. Calculations remain in exam practice.

## Quality and corrections
- All 2,686 previous card IDs preserved; no exact repeated ID or new repeated prompt.
- New test tests/task1-coverage-precision-v130.cjs checks concise prompts, subject distribution, mock filtering, every model answer and alternative, and negative answers.
- Older v127, v128 and v129 tests still verify exact historical counts excluding later additive v130 cards.
- Atomisation tagged Chemistry 3.1.8 rather than AS Energetics. Required graphite structure-property content instead of graphene. Uniform circular motion correctly Year 2.

## Limitations
Even 2,846 cards do not prove every assessed AQA bullet is addressed. Older topic-only crosswalk entries remain uncertified. Long calculations, experimental design and mechanisms belong in exam question practice. A full per-bullet coverage audit, including practicals and the school's Physics option, remains outstanding.

## Sources
https://www.aqa.org.uk/subjects/physics/a-level/physics-7408/specification/subject-content
https://www.aqa.org.uk/subjects/chemistry/a-level/chemistry-7405/specification/subject-content
https://www.aqa.org.uk/subjects/mathematics/a-level/mathematics-7357/specification

## Release gate
Merge only when cloud/flashcards, scanner marking, World safety and browser tests pass. Independently check Pages and the public deck after merge.
