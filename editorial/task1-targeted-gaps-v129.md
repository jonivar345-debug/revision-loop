# Task 1 v129 — targeted specification gaps

**26 October 2026. Draft: not merged or published.**

## Verified additions
- Original v128 bank: **2,659 cards / 2,655 active**. v129 draft: **2,686 cards / 2,682 active**.
- **Seven AS Physics** recall cards in optical-fibre communication: lower-index cladding, material versus modal dispersion, attenuation, pulse broadening and single-mode reduction of dispersion. All seven are eligible for the Year 1 Physics mock.
- **Twenty A2 Chemistry** recall cards: amino-acid ionic forms, peptide and DNA chemistry, protein denaturation, transition-metal coordination/catalysis, and chromatography phases/retention time. All 20 are **not yet taught / excluded from November mocks**.
- Every previously issued flashcard ID retained, including those in v127 and v128. No progress, reward, Firestore, World, shop or account code changed.

## Editorial check
The new questions target concepts absent or thinly represented in existing topic groups. These are short answers rather than calculation exercises or handling instructions. Test each new accepted answer against the website's actual grader; reject common confusions (material versus modal dispersion, opposite amino-acid ionic forms, hydrogen-bond counts, chromatography mobile phases).

## Existing deck observations
- A previous topic-only mapping of 1,216 untagged cards was not a verified specification crosswalk: 1,100 have broad-topic candidates, 116 remain without even a candidate.
- Repeated Physics wave prompts already cover much of 3.3.1 and interference in 3.3.2; more copies of those questions are not needed.
- Further work should map individual old prompts and model answers against the exact assessed AQA wording, and add only genuine gaps.
- The Physics option section is school-specific and remains **uncertified**; do not present optional Medical Physics as compulsory.

## Sources
- https://www.aqa.org.uk/subjects/physics/a-level/physics-7408/specification/subject-content/waves
- https://www.aqa.org.uk/subjects/chemistry/a-level/chemistry-7405/specification/subject-content/inorganic-chemistry
- https://www.aqa.org.uk/subjects/chemistry/a-level/chemistry-7405/specification/subject-content/organic-chemistry

## Release gate
Run all four PR check suites (cloud/flashcards including v129, scanner marking, World safety, browser acceptance). Merge only if all succeed, then separately verify GitHub Pages deployment and browser deck version.
