# Task 1 v143 — complete the v135 selected front-match answer review

**27 October 2026.** This is an **audit-only release** on top of the published v142 deck. It does not add or change any cards, IDs, progress settings, mock flags, World photos, XP, purchases, cloud sync or scanner code.

## Actual review

- The old v135 snapshot contained **113 selected atomic questions**, **106** of them with front-text keyword matches but not yet verified answers. Six more had already been checked, and one had been labelled partially supported.
- **All 106 remaining candidates** have now been checked against the actual active **v142 deck**, retaining at least one exact card ID, question and model answer for every reviewed requirement.
- **94** have suitable existing answers for the *specific narrow memory requirement*. The other **12** are partial or need exam-style application checks; **they are not certified complete**.
- Split of the 106 reviewed: **71 Chemistry and 35 Physics**.
- Every exact answer snapshot is in `editorial/task1-v143-v135-answer-evidence.json`, and `tests/task1-v143-v135-answer-evidence.cjs` protects its linkage to the current deck. This prevents future edits silently invalidating the audit.
- This is **not a full-syllabus audit**. Neither v135 nor v137 was an exhaustive inventory of all compulsory AQA specification outcomes, and the original unsatisfied v135 item is outside these 106 checks.

## The twelve qualified requirements

| ID | Area | Why it remains qualified |
|---|---|---|
| A005 | Chemistry atomic structure | Weighted isotope mean is recalled; full mass-spectrum interpretation needs practice |
| A006 | Chemistry electron configurations | Rules and exceptions exist; constructing unfamiliar atomic/ionic configurations needs practice |
| A024 | Chemistry bonding | Typical structures and properties exist; comparing unknown materials is exam application |
| A027 | Chemistry shapes | Common angles and lone-pair rules exist; deductive shapes and ions need structural diagrams |
| A048 | Chemistry equilibria | Le Chatelier is recalled; predictions for specific conditions still need questions |
| A055 | Chemistry redox | Half-equation rules are covered; combining unfamiliar half-equations is a skill |
| A059 | Chemistry periodicity | Several specific melting trends are explained; integrated Period 3 interpretations need practice |
| A075 | Chemistry E/Z isomerism | CIP priority is recalled; assigning unknown structures needs diagram questions |
| A090 | Physics stationary waves | Frequency factors are covered, but not the whole equation on a card; importantly **AQA supplies the formula**, so this is an application priority rather than a missing rote-learning fact |
| A093 | Physics diffraction | Narrower slit → wider pattern exists, but increased-wavelength effect is not explicit |
| A103 | Physics mechanics | SUVAT constant-acceleration condition exists; using given formulae in unfamiliar questions is an exam skill |
| A108 | Physics collisions | Momentum conservation condition exists; collision calculations still need varied practice |

These statuses distinguish **adequate short-answer recall** from **exam competence**. Even the 94 narrowly supported rows may require diagrams, calculations, or practical skills; do not count them as whole-topic completion.

## Formula/data booklet cross-check

Confirmed against [AQA A-level Physics data and formulae](https://store.aqa.org.uk/resources/physics/AQA-7408-SDB.PDF): the first-harmonic string equation, SUVAT equations, key wave equations, momentum/impulse, quark charges, and electron/proton masses are provided. This matters when allocating flashcard-writing effort: interpretation and *non-given* definitions take priority over copying formulae or constants. The earlier v142 cards remain unchanged, including their stable progress IDs.

## Next priorities

1. Review the single **pre-existing partial** v135 requirement separately, without assuming it was fixed by a front-text match.
2. Add a **very short wave-diffraction conceptual card** only if no equivalent exists and the item is genuinely required by AQA. Do not turn every calculation or diagram into a long flashcard.
3. Prioritise **exam questions and worked marking criteria** for the eight Chemistry reasoning/diagram gaps, plus Physics diffraction, strings and mechanics.
4. Start a **fresh official AQA compulsory Year 2 crosswalk**; selected v135 and v137 samples are now audited but cannot stand for the entire specification.
5. Continue the Physics/Chemistry **required practicals** checklist (aim, variables, controls, measurements, limitations, uncertainty, interpretations), and confirm the centre's Physics optional topic before treating any option as compulsory.

## Safety and deployment

Baseline is the successfully deployed **v142, 3,144 total cards, 3,140 active**. All original data are preserved. The new regression is included in the existing cloud/layout/flashcard workflow; require all relevant checks green (including World browser and scanner) before merging v143. An audit merge will not change the browser's flashcards; Pages deployment is not evidence of all-specification completion.
