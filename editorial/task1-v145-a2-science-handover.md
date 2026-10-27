# Task 1 v145 — Year 2 Physics and Chemistry narrow recall audit
27 October 2026

## What changed
- Starting published deck v144: **3,152** records, **3,148 active**.
- Added **27** short recall cards: 8 Physics and 19 Chemistry.
- Draft v145 deck: **3,179** records, **3,175 active**.
- Audited **59 selected narrow requirements/outcomes** with AQA links, preserved actual fronts/backs and explicit limits in `editorial/task1-v145-a2-science-evidence.json`: 24 supported by existing cards, 27 added recall cards, 8 requiring applied exam-question work.
- All 3,152 old flashcard IDs and answer records preserved; 27 new distinct IDs appended.
- No changes to app logic, Firebase, XP, progress records, shop, World photos, paper banks, scanner/marking or optional Physics-module assignment.
- New A2 items remain outside **November mocks** until teaching scope is verified (`stage:A2, taught:false, mock:false, scope:full`).

## Topic emphasis
Physics 7408 3.7: signed gradients and areas on capacitor current/charge graphs and electric field–distance interpretation. Physics 7408 3.8: nuclear scale, electron-diffraction evidence and energy conversion at closest approach.

Chemistry 7405 3.1.11: simplified commercial lithium cell and alkaline hydrogen–oxygen cell half-equations, cell emf interpretation. Chemistry 7405 3.2.4: structures/formulae of Period 3 oxyacids and conjugate ions; silicon dioxide. Chemistry 7405 3.2.5–3.2.6: vanadium oxidation-state colours, octahedral cis/trans distinction, absorption and observed colour, and aqueous-ion observations.

Vanadium-ion colours are specifically affirmed in AQA's teaching guide. Avoid replacing prior brief cards with larger multi-mark exercises.

## What remains explicitly incomplete
The 59 ledger entries are **selected outcomes**, not every bullet of the official specifications. Many older cards lack fine-grained specification tags; topic counts are only candidates until front/back reviewed. Untaught and optional Physics material must not be pushed into November mock filters.

Exam-question bank must independently assess eight listed applied outcomes: capacitor log plots/uncertainty, electric trajectories, gamma inverse-square practical, nuclear radius data, electrochemical cell notation, catalytic cycles, aqueous-ion identification and complex diagrams. Chemistry and Physics required practicals also need line-by-line apparatus, data, uncertainty and evaluation checks. Maths 7357 full compulsory specification needs the same audit. Do not claim mastery from authored content.

## Release gate
`tests/task1-v145-a2-science.cjs` verifies exact historical IDs/counts, new prompt uniqueness, accepted model answers, mock safety, official source links and ledger snapshots; preceding historical regressions are updated to ignore additive v145 IDs. All four repository workflows must pass on the latest head, followed by merge and Pages success.

## Official sources
- https://www.aqa.org.uk/subjects/physics/a-level/physics-7408/specification/subject-content/fields-and-their-consequences-a-level-only
- https://www.aqa.org.uk/subjects/physics/a-level/physics-7408/specification/subject-content/nuclear-physics-a-level-only
- https://www.aqa.org.uk/subjects/chemistry/a-level/chemistry-7405/specification/subject-content/physical-chemistry
- https://www.aqa.org.uk/subjects/chemistry/a-level/chemistry-7405/specification/subject-content/inorganic-chemistry
- https://filestore.aqa.org.uk/resources/chemistry/AQA-7405-REACTIONS-OF-METAL-IONS.PDF
