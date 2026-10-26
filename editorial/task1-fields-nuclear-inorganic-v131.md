# Task 1 v131 — fields, nuclear and inorganic recall
26 October 2026. Unpublished development candidate.

## Baseline
v130 has 2,846 cards, 2,842 active. All old IDs kept.
New v131 contains 129 cards: 70 Physics and 59 Chemistry. Draft total 2,975 (2,971 active).
Physics Year 2 fields, induction and nuclear cards are kept out of AS mock sessions.
38 new AS Chemistry cards are mock-eligible, and later untaught Chemistry cards are excluded.
12 similar existing prompts were removed from the proposed additions before commit.

## Scope
AQA Physics 7408 3.7: gravitational, electric and magnetic fields, capacitors, induction and AC.
AQA Physics 7408 3.8: Rutherford scattering, gamma absorption, nuclear decay and binding energies.
AQA Chemistry 7405 3.2: Group 2, Group 7, Period 3 oxides and transition metal complexes.
AQA Chemistry 7405 3.3: organic terminology, infrared analysis, ester derivatives.
No Maths expansion in this batch because worked problem practice is more useful than additional one-line facts.

## Safeguards
Preserve all pre-v131 IDs and review histories. Do not touch Firestore, XP, shop, World or exam bank.
New automated regression checks model answers, concise alternatives, wrong answers, exact prior counts, metadata, mock filters.
Earlier v127-v130 historical count tests are updated to ignore additive v131 records.
Require cloud-flashcards, scanner, World safety, browser acceptance to pass before merging.

## Not certified
The 1,216 older cards remain incompletely mapped to individual AQA requirements. Topic matches are not proof of complete bullet-level coverage.
Chemistry and Physics practical results, graphs and uncertainty interpretations still need per-item auditing.
Calculations, detailed mechanisms, apparatus questions and the chosen optional Physics module need further assessment.

## Official specifications
https://www.aqa.org.uk/subjects/physics/a-level/physics-7408/specification/subject-content/fields-and-their-consequences-a-level-only
https://www.aqa.org.uk/subjects/physics/a-level/physics-7408/specification/subject-content/nuclear-physics-a-level-only
https://www.aqa.org.uk/subjects/chemistry/a-level/chemistry-7405/specification/subject-content/inorganic-chemistry
https://www.aqa.org.uk/subjects/chemistry/a-level/chemistry-7405/specification/subject-content/organic-chemistry
