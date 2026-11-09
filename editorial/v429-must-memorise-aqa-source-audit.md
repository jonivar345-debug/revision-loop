# v429: Must-memorise recall priority (AQA)

## Purpose
In all flashcard study, make **unlearned, due, or low-retention key definitions and equations absent from the subject's relevant AQA formulae booklet** appear before ordinary flashcards. Preserve ordinary revision, the existing marking rules, strict mock filters and saved card IDs. A voluntary "Only must-memorise cards" option is available in the Flashcards panel.

## Verified sources
- [AQA A-level Physics 7408 data and formulae](https://store.aqa.org.uk/resources/physics/AQA-7408-SDB.PDF). This explicitly prints `F=ma`, SUVAT, `P=VI`, `v=fλ`, Young fringe spacing, photoelectric formulas, thermal gas laws and SHM formulae. Cards asking to recall these printed formulae **must not** be marked as absent from the booklet. Formula **applications** remain in ordinary revision.
- [AQA AS/A-level Maths 7356/7357 MFB8](https://filestore.aqa.org.uk/resources/mathematics/AQA-AS-A-MATHS-FORMULAE.PDF) prints binomial and arithmetic/geometric sums, trigonometric addition identities, and specific Year-13 differentiation/integration methods. [AQA Appendix B](https://www.aqa.org.uk/subjects/mathematics/a-level/mathematics-7357/specification/appendix-b-mathematical-formulae-and-identities) separately lists formulae and identities to use from memory, including the sine/cosine rules and standard differentiation.
- [AQA Chemistry 7405 specification](https://www.aqa.org.uk/subjects/chemistry/a-level/chemistry-7405/specification/subject-content) and the associated Periodic Table/Data Booklet: its tables provide reference data, but not an all-purpose equations sheet. Thus a short card *explicitly asking for a chemistry equation or formula* is prioritised. Data-table lookups are not added.

## Conservative classification
1. Key definitions: prompts explicitly beginning with **Define**, **What is meant by**, **State the definition**, **State a named law/principle**, or an unambiguous short **What is a/an …?** definition question.
2. Chemistry equations: explicit formula/equation/expression/relationship recall with a symbolic answer; no promotion simply because a card happens to include `=`.
3. Physics: positive-list of specific formula relationships missing from the AQA insert. Other formulas are deliberately **not assumed** missing from the insert.
4. Maths: positive-list based on MFB8 vs Appendix B (e.g. sine/cosine rules, quadratic formula, circle/line formulae, power rules and standard derivatives), with exclusions for printed formulae.
5. Future carefully checked flashcards can explicitly use `memoryPriority:'definition'` or `memoryPriority:'unprovided-equation'`, or override a formula as `formulaBooklet:'provided'`. No existing cards are rewritten.

The automatic rule is a *conservative first pass*, **not** a guarantee that every must-learn definition/equation has been tagged. Any exact wording or formula absent from these patterns remains part of normal revision until individually reviewed.

## Selection behaviour
- Default priority ON: pick unlearned, due, or weak must-memorise cards first. Random weighted selection continues within the priority group, then ordinary cards fill spare slots.
- Applies to **Flashcards**, **Mock flashcards** and priority ordering of starter challenge cards. Mock-only/Year 1 Pure filters remain unchanged.
- **Only must-memorise cards**: limits ordinary Flashcards sessions to qualifying cards **within the selected subject, taught/mock scope and chosen topics**.
- Display a small reason badge on matching cards; show a count of matching cards in the selected Flashcards topics.
- Both preferences save inside the existing `revisionLoopSettings11` settings document for optional cloud syncing. No card IDs, review schedules, XP, progress or reward logic changes.

## Release acceptance
- Check exact AQA sheet exclusions (printed vs genuinely unprovided).
- Run pure classification and real weighted-pick regressions.
- Use Chromium to test cards loaded from the actual banks on phone layouts, "only" mode and preference persistence without changing unrelated XP/history.
- Verify all legacy GitHub Actions checks and READY matching Vercel preview before merge.

## Core deck source audit (v429, 9 November 2026)
The repository's actual `deck.json` (3,345 cards) was independently checked with the v429 classifier. After false-positive corrections it identifies **309 priority candidates**:

| Subject | All original cards | Key definitions | Missing-equation cards | Total priority |
|---|---:|---:|---:|---:|
| Physics | 1,154 | 82 | 5 | 87 |
| Chemistry | 1,981 | 151 | 49 | 200 |
| Maths | 210 | 11 | 11 | 22 |
| **Total** | **3,345** | **244** | **65** | **309** |

The counts are **not** a specification completeness claim, and supplemental banks increase the number of eligible recall cards in the actual site. Conservative Physics equation tagging is deliberate because most core equations already appear on its insert. Automated QA found and corrected three ordinary Chemistry process/calculation cards that should *not* have been called memorisation equations, and added key definitions for ionic/metallic bonding, decay constant, mass defect and a first-principles derivative definition, plus Maths index and logarithm laws, line/vector and triangle-area formulae. After cross-checking the actual MFB8 formula booklet, the first-principles differentiation formula is **not** labelled missing because it is supplied; ordinary safety advice and practical instrument questions are also excluded from the definition priority.

The algorithm does not guarantee every important fact has been reviewed individually. All non-priority cards remain available, and previously scheduled `Again/Hard/Good/Easy` ratings are untouched.
