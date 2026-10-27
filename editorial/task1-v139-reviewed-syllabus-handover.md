# Task 1 v139 — second-stage AQA answer-evidence review

27 October 2026. Audits the same 142 narrow outcomes introduced in v137, now against the v138 card bank.

## What is checked
- **48 more narrow syllabus recall requirements**: 21 Physics and 27 Chemistry.
- Exact existing front and back texts are saved for every supporting card in `editorial/task1-v139-verified-answer-evidence.json`.
- Science topics include particle interaction definitions, photoelectric equations, electricity components, organic definitions, isomerism, polymers, DNA and spectroscopy.
- AQA **Maths quotient log law** was previously a genuine recall gap: now linked to `task1_v138_001`.
- The meaning of resistivity remains marked **partial**: formula and units exist but precise definition still needs verification.
- Explicit distinction: narrow answer checks do **not** certify complete questions, laboratory practical interpretation, drawings, compound mechanisms or all spec outcomes.
- The other 61 front-keyword candidates in v137 remain unverified in this second-stage audit, as well as rows identified as partial or needing semantic search. The earlier v135 106 front-only checks are likewise unfinished.
- This is not 48 new flashcards: it is a recorded quality check of existing material, designed to avoid making duplicates.

## Data and protection
Deck remains v138 with 3,128 records, 3,124 active. No changes to deck or runtime, mock flags, answer-marking logic, cloud sync, XP, purchases, World, original review IDs or saved progress.

A dedicated regression `tests/task1-v139-verified-evidence.cjs` cross-checks every reviewed question and answer and requires explicit qualified labels for partial coverage.

Official evidence pages:
- https://www.aqa.org.uk/subjects/physics/a-level/physics-7408/specification/subject-content/particles-and-radiation
- https://www.aqa.org.uk/subjects/physics/a-level/physics-7408/specification/subject-content/electricity
- https://www.aqa.org.uk/subjects/chemistry/a-level/chemistry-7405/specification/subject-content/organic-chemistry
- https://www.aqa.org.uk/subjects/mathematics/a-level/mathematics-7357/specification/appendix-b-mathematical-formulae-and-identities

Next: complete the remaining front-match review and optional-topic confirmation, then audit specification points beyond the initial Year 1 selected set, including all A-level Maths required recall identities and required practical evaluations. Do not claim full AQA coverage until this is complete.
