# Task 1 v134 — complete provisional AQA science legacy map

26 October 2026. Draft release. Do not claim that the entire specification is now certified.

## Starting point and work completed
- v133 merged 2,994 total cards and 2,990 active. v134 adds 14 concise cards (8 Physics and 6 Chemistry), proposing 3,008 total / 3,004 active.
- Every original card ID and its existing answer is retained. Firestore, cloud progress, XP, point balances, purchased locations, exam question banks and media files are unchanged.
- The pre-existing legacy audit had 796 original active flashcards linked to broad AQA sections. This iteration adds 317 (176 Physics, 141 Chemistry). Provisional section candidates now cover all 1,113 original active science cards (408 Physics and 705 Chemistry).
- The separate 103 original Maths cards remain without this content-level crosswalk. These are largely equations/practice reminders and are lower priority for flashcard creation.
- 40 original Physics flashcards refer to AQA Medical Physics option 3.10. This is optional and should not appear as mandatory until the school confirms it.

## 14 new flashcards
- Physics AS waves: polarised aerial alignment, crossed polarisers and qualitative single-slit diffraction.
- Physics A2 compulsory: circular satellite gravitational potential, kinetic and total orbital energy, plus the energy change on moving to a higher circular orbit.
- Chemistry A2: TLC pencil baseline interpretation, equivalent-proton NMR splitting, chemical shielding and carbon-13 decoupling, plus two green-synthesis recall points.
- Model answers are short and have several precise accepted alternatives. Misconceptions and reversed relationships have explicit reject variants.
- Year 2 additions are excluded from mock mode; AS Physics wave cards remain eligible.

## What this does and does not prove
- This is a prompt-and-answer-aware broad section mapping, not independent validation of every original model answer or 100% bullet-by-bullet compliance with AQA.
- Original calculation-heavy cards, multi-point prompts and drawing requests were classified and flagged rather than deleted or silently replaced.
- A proper bullet-level comparison needs a numbered list of requirements for every section, evidence of one or more suitably accurate cards for each, and separate coverage for worked exam problems and practical evaluation.
- Only the school-selected Physics option should be treated as compulsory. Medical Physics remains optional and other options (Astrophysics, Engineering, Turning Points, Electronics) are not automatically required.

## Release checks
- The v134 test verifies all 1,113 original science IDs have a section candidate, all 2,994 earlier card records are present, 40 optional Medical Physics records are distinguished and new accepted/rejected typed answers behave as expected.
- Earlier v127–v133 regression suites remain active but ignore additive v134 records in historical count comparisons.
- Merge only once cloud/flashcards, scanner marking, World safety and browser acceptance succeed. Then verify the Pages deployment and public deck separately.

## AQA specifications
- https://www.aqa.org.uk/subjects/physics/a-level/physics-7408/specification/subject-content
- https://www.aqa.org.uk/subjects/chemistry/a-level/chemistry-7405/specification/subject-content

## Next
- Build a per-spec-bullet coverage ledger using all tagged and newly mapped cards; note genuine deficits and avoid repeating tested definitions.
- Prefer Chemistry practical observation/result cards, Physics wave and field definitions and concise short-answer accuracy tests over hundreds of repeated prompts.
- Keep mock selection limited to the stated teaching stage, and exam practice separate for multi-step work.
