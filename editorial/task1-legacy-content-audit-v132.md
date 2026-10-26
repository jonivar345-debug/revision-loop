# Task 1 v132 — evidence-led legacy flashcard audit

26 October 2026. Revision Loop AQA Physics/Chemistry.

## Scope and deliverables
- Read both the question and model answer of 354 active untagged legacy cards: 121 Physics and 233 Chemistry. They belong to 17 existing topic groups.
- Each audited record is keyed to its unchanged progress ID and actual front prompt in `editorial/task1-legacy-card-content-audit-v132.json`, with a candidate AQA section and a quality classification.
- Remaining without this level of content review: 862 (Physics 287, Chemistry 472, Maths 103). These are not claims of missing flashcards; they are outstanding legacy classification checks.
- Among 354: 314 concise-recall candidates, 22 worked-example candidates, 13 multi-point cards for later editing and 5 advanced shape examples.
- None of the older records, review IDs, saved schedules, XP, purchases, account settings or worlds have been changed. Flagged worked questions are not disabled: they should eventually be copied into exam practice before any legacy content is changed.

## Corrected interpretation of apparent gaps
- Period 3 has considerably more coverage than a literal search for `Period 3 melting` suggests: silicon's giant covalent structure, P4/S8, stronger dispersion and related trends already have multiple cards.
- Group 7 has repeated silver-halide precipitate colours, ammonia solubility results, displacement reactions and oxidising/reducing trends. Adding identical wording would be less useful than reviewing marking.
- Much of the older Mechanics motion-graph content duplicates newer concise prompts. The original set also includes arithmetic examples that are better suited to worked questions.
- Group 2 *melting point* irregularity, the special centre-of-mass rule, free-fall intercept interpretation and a numeric two-reading titre uncertainty were identified as small specific gaps. Six short v132 cards now cover them.

## Audit limits
Section-level evidence is not full AQA sub-bullet certification. Detailed mechanisms, graphical interpretation, experimental evaluation and optional Physics Paper 3 topics may require more than one recall card. User's mock syllabus and untaught material filters must be maintained.

## Source specification references
- AQA Physics 7408, sections 3.1, 3.2, 3.4.
- AQA Chemistry 7405, sections 3.1, 3.2 and 3.3.
- https://www.aqa.org.uk/subjects/physics/a-level/physics-7408/specification/subject-content/mechanics-and-materials
- https://www.aqa.org.uk/subjects/chemistry/a-level/chemistry-7405/specification/subject-content/physical-chemistry
- https://www.aqa.org.uk/subjects/chemistry/a-level/chemistry-7405/specification/subject-content/inorganic-chemistry
- https://www.aqa.org.uk/subjects/chemistry/a-level/chemistry-7405/specification/subject-content/organic-chemistry

## Release criteria
- `tests/task1-legacy-content-audit-v132.cjs` verifies 354 audited IDs, prompt integrity, exact totals, valid metadata and accepted/rejected card answers.
- Older v127–v131 regression suites continue to verify their own historical counts with v132 records excluded.
- Cloud/flashcard, scanner, World and browser acceptance must all pass before merging and deploying.
