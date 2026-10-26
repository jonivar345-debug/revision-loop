# Task 1 v135 — first atomic AQA syllabus crosswalk

26 October 2026. Development audit, not a full-syllabus certificate.

## Starting point
- PR #81 (v134) has been merged; the website deck has **3,008 cards, 3,004 active**.
- The old 1,113 active original science cards have been provisionally mapped to broad sections, but a broad topic label cannot prove that an individual assessable point has been checked.
- No flashcards, model answers, marks, saved IDs, XP, Firestore accounts, purchases, exam papers, photographs or app runtime files are edited in **this** v135 audit.

## Narrow, checkable specification outcomes
The file `editorial/task1-atomic-spec-first-pass-v135.json` records **113 deliberately narrow, paraphrased AQA outcomes** rather than using one row for an entire heading:
- **76 Chemistry**: early physical chemistry (atomic structure, moles, bonding, energetics, rates, equilibria and redox), Group 2/7, periodicity and selected early organic analysis.
- **37 Physics**: measurement/uncertainty, waves, force/motion, mechanics and materials.
- These are *selected* Year 1 outcomes from the six AQA source pages recorded per row. They are not the full set of Year 1 or A-level bullets. Year 2 expansion, required-practical skill evaluation and the school-chosen Physics option all require separate audits.

For each row we store a stable ID, section, original paraphrased learning requirement, source page, and IDs/prompts of **existing active cards** whose *front* matches a narrow search. Automated candidate matching is a discovery aid only. A card's appearance on a list is not proof that its answer is complete, correct or sufficient.

## Real checks rather than blindly adding cards
- First pass: 106 outcomes had candidate fronts; 7 appeared to have none.
- Reading questions **and answers** found existing evidence for six of the seven: boiling points and intermolecular forces; collision requirements; Haber-process compromise; Period 3 ionisation anomalies; Group 2 shielding/radius; falling-body drag and terminal speed.
- The seventh, percentage uncertainty, already has an exponent/power-rule card, but the multiplication/division rule still needs a distinct short-answer check.
- Result: **106 front-match-only**, **6 answer-checked existing**, **1 partly supported** and **0 unmatched after semantic review**. None of these categories certifies a whole topic.
- Two Physics syllabus IDs were corrected while reviewing the AQA page: Newton's laws **3.4.1.5** and projectile motion **3.4.1.4**.

## Four precision flashcards proposed, not yet published
The ledger has drafts for:
1. combining percentage uncertainties for products/quotients;
2. estimating uncertainty in the graph y-intercept;
3. elastic strain energy of a Hooke's-law spring, distinguished from an existing long numerical worked card;
4. benefits and risks of drinking-water chlorination.

These remain **editorial candidates**, not additions to the website. Before adding, perform another semantic duplicate check on all 3,008 existing front/answer pairs and then run the live short-answer grader, mock filter, cloud, scanner, World and browser checks. No claim of a missing card is final solely from zero regex matches.

## Quality and release rules
- `tests/task1-atomic-spec-v135.cjs` checks each referenced ID, current subject, prompt and the exact answer for manually reviewed evidence, all AQA source hosts and the non-destructive deck baseline.
- The cloud/flashcard CI workflow must execute this check.
- Keep Chemistry and Physics Year 1 mock priorities first; maintain longer worked equations and drawing exercises in exam questions, rather than filling flashcards with six-mark prompts.
- Keep Medical Physics optional, never force it into compulsory Physics coverage without the school's choice.

## Remaining work in sensible order
1. Verify question **and answer** for each of the remaining 106 candidate-only outcomes, recording supported, partial, incorrect or absent.
2. Expand the requirement ledger across remaining **Physics 3.2 Particles, 3.5 Electricity** and remaining **Chemistry 3.3** compulsory first-year content, then into compulsory Year 2 sections. Check required practicals by observation/interpretation/error/evaluation, not simply by the existence of one card.
3. Add and grader-test truly missing, concise definitions and test observations in coherent batches without duplicating existing prompts.
4. Repeat per-specification-bullet validation for compulsory Year 2 content; keep the Physics option dependent on school confirmation, and use Maths flashcards only where they help.

## Official AQA sources
- https://www.aqa.org.uk/subjects/chemistry/a-level/chemistry-7405/specification/subject-content/physical-chemistry
- https://www.aqa.org.uk/subjects/chemistry/a-level/chemistry-7405/specification/subject-content/inorganic-chemistry
- https://www.aqa.org.uk/subjects/chemistry/a-level/chemistry-7405/specification/subject-content/organic-chemistry
- https://www.aqa.org.uk/subjects/physics/a-level/physics-7408/specification/subject-content/measurements-and-their-errors
- https://www.aqa.org.uk/subjects/physics/a-level/physics-7408/specification/subject-content/waves
- https://www.aqa.org.uk/subjects/physics/a-level/physics-7408/specification/subject-content/mechanics-and-materials
