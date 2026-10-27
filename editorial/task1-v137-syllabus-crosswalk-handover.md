# Task 1 v137 — additional atomic AQA crosswalk

26 October 2026. Follow-on editorial audit after 105-card v136 release.

## Scope and results
- Another **142 deliberately narrow** recall requirements (68 Physics, 50 Chemistry, 24 Maths) were checked using official AQA pages.
- Focus: AQA Physics 3.2 Particles and radiation and 3.5 Electricity; Chemistry 3.3 Organic chemistry; Mathematics 7357 Appendix B remembered formulae.
- First front-keyword pass: 109 candidate matches and 33 apparent unmatched.
- Semantic inspection of front **and back** corrected 23 apparent misses. Four more have nearby cards but remain only partial/unclear. Five require semantic inspection.
- **109 additional candidate-only matches remain unverified.** Do not interpret a candidate match as confirmed coverage.
- AQA Appendix B's logarithm quotient law appears to lack a direct Maths recall card; mark as probable missing and verify once more before adding.

## Method and limitations
`editorial/task1-v137-additional-syllabus-candidate-ledger.json` contains source page URLs, individually paraphrased requirements, candidate IDs/fronts and 23 exact question-and-answer snapshots. Test `tests/task1-syllabus-crosswalk-v137.cjs` protects these references and checks the unchanged 3,113-card v136 deck.

These sampled outcomes are **not** every bullet in the full specifications. Neither a regex hit nor this audit confirms diagrams, complex calculations, practical skill outcomes, multi-step questions, or full coverage of a section. Use longer questions in exam practice. No Maths statistics or mechanics content is included in the school's November Pure-only mock selection by this work.

The main next steps:
1. Check every candidate and model answer in these and v135's earlier 113 rows.
2. Add only truly absent facts, including the AQA Maths logarithm quotient law if its absence is confirmed.
3. Extend the crosswalk into Physics A2 3.6–3.8 and Chemistry compulsory Year 2 inorganic/physical sections, and all Maths subject content, including the practical interpretation elements in both sciences.
4. Compare all mandatory memory equations against the official AQA data and formulae booklets and test typed-answer aliases before releasing each batch.

## Safeguards
No deck entries, card IDs, profile progress, cloud sync, XP, World galleries, study filters, question marking or scanner source files change in v137. The source base is v136 with 3,113 records, 3,109 active. The optional Physics module remains undecided.

Official source pages:
- https://www.aqa.org.uk/subjects/physics/a-level/physics-7408/specification/subject-content/particles-and-radiation
- https://www.aqa.org.uk/subjects/physics/a-level/physics-7408/specification/subject-content/electricity
- https://www.aqa.org.uk/subjects/chemistry/a-level/chemistry-7405/specification/subject-content/organic-chemistry
- https://www.aqa.org.uk/subjects/mathematics/a-level/mathematics-7357/specification/appendix-b-mathematical-formulae-and-identities
