# Revision Loop Task 1 v142 — confirmed precision recall additions

**Prepared 27 October 2026.** Base: merged v141 syllabus audit, original deck v138 (3,128 cards, 3,124 active).

## Actual flashcard changes

**16 new, short flashcards**, eight AQA Physics and eight AQA Chemistry. Proposed deck: **3,144 total / 3,140 active**. Every original 3,128 record, its ID and its model answer are preserved; IDs `task1_v142_001` to `task1_v142_016` are new.

| Subject | New question focus | AQA section | Mock |
|---|---|---|---|
| Physics | Neutron count: N = A − Z | 3.2.1.1 | Yes |
| Physics | Recognise isotopes using Z and A | 3.2.1.1 | Yes |
| Physics | Baryon number: baryon +1 / antibaryon −1 | Particles | Yes |
| Physics | Charge of strange quark | Particles | Yes |
| Physics | Resistivity definition, ρ = RA/L, Ω m | Electricity | Yes |
| Physics | Conservation of charge at a junction | Electricity | Yes |
| Physics | Conservation of energy around a circuit loop | Electricity | Yes |
| Physics | Approximate proton/electron SI masses | Particles | Yes |
| Chemistry | Define an alkane as a saturated hydrocarbon | 3.3.2.1 | Yes |
| Chemistry | Carbon products from incomplete combustion | 3.3.2.3 | Yes |
| Chemistry | Catalytic cracking: catalyst and key products | 3.3.2.2 | Yes |
| Chemistry | Economic reasons for cracking | 3.3.2.2 | Yes |
| Chemistry | Secondary amine classification | 3.3.11 | No (untaught A2) |
| Chemistry | Tertiary amine classification | 3.3.11 | No (untaught A2) |
| Chemistry | Environmental drawback of polymer incineration | 3.3.12.2 | No (untaught A2) |
| Chemistry | Difficulty of recycling mixed polymers | 3.3.12.2 | No (untaught A2) |

Existing tertiary-alcohol oxidation and AQA-defined biodiesel (methyl ester) cards were deliberately not duplicated. AQA Chemistry IR C–H absorption values are in the supplied data booklet, so interpreting supplied data is more useful than rote recall. Extended polymer evaluation, molecule drawings and reaction mechanisms remain exam-question skills, not long flashcards. A proposed isoelectric-point card was removed after verifying that it is not expressly required by the AQA amino-acid specification.

## Audit and quality safeguards

- Flashcard prompts ask one or two closely related recall facts and have short model answers; no six-mark calculation prompts were added.
- v142 adds no Maths flashcards: the three remaining v137 Maths formula requirements already had accurate model answers.
- Existing Physics and Chemistry flashcards remain untouched; progress IDs and save keys retain their names. Existing cloud sync, XP, purchases, World, photos and scanner code are unchanged.
- `tests/task1-v142-precision-cards.cjs` checks 3,128 pre-existing records, total 3,144, active 3,140, exact prefix IDs, short answer size, subject grouping, scope, unique fronts, accepted model answers and saved-key invariants.
- Historical v127–v141 tests are adapted to ignore **only** the additive `task1_v142_` cards when comparing their original exact-count baselines, rather than editing their protected old records.
- The four A2 amine/polymer cards are excluded from taught/mock selection. The 12 AS cards are included. Biodiesel is already covered by pre-existing cards and remains unaffected.
- No statement of 100% AQA syllabus coverage is made by this release.

## Still open after these cards

The v137 selected sample's incomplete recall points have been reduced through these additions, but the historic evidence JSON deliberately remains a snapshot of the v138 baseline. Some partials need further checking rather than another duplicate. The separate **v135 106 front-only candidates** are next for exact-answer audits. The full Year 2 syllabus and required practical assessment/evaluation skills still require a true specification-to-activity crosswalk; confirm the centre's Physics optional module separately.

## Sources and review

- AQA Physics 7408 Particles and radiation, Electricity specification.
- AQA Chemistry 7405 Organic Chemistry specification (especially 3.3.2).
- AQA Chemistry supplied data sheet for IR absorption (so avoid rote-memorisation of provided numerical ranges).
- Source review audit: `editorial/task1-v141-full-v137-answer-review.json`, `editorial/task1-v140-evidence-follow-up.json`.

**Release gate:** Green flashcard/cloud, scanner, World safety and World browser acceptance. Do not claim `main` or GitHub Pages has v142 until merge and successful Pages deployment.
