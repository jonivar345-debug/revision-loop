# Task 1 v143 — complete answer review of the selected v135 AQA sample

**27 October 2026.** Based on published v142 deck: **3,144 records (3,140 active)**.

## Work actually carried out

All **106 previously keyword-matched-only** requirements from the earlier v135 sample have now been reviewed against the current deck's **full question and model-answer texts**. The evidence is in `editorial/task1-v143-v135-106-answer-evidence.json`, with exact supporting active card IDs, questions, answers, original paraphrased requirement and AQA source URL for each row.

| Classification of 106 further rows | Chemistry | Physics | Total |
|---|---:|---:|---:|
| Narrow memory requirement supported by reviewed answers |  |  | **88** |
| Partial coverage or separate applied-question assessment necessary |  |  | **18** |
| **Total checked** | **71** | **35** | **106** |

The original v135 seven other sampled outcomes had already received initial scrutiny (six answer-supported and one partial). Therefore **all 113 requirements in that selected sample now have an initial answer-level review**, albeit with unresolved skills/gaps. The separate 142-item v137 sample has also been triaged through v137–v141. Overlap between these two samples is possible; do **not** count them as 255 unique AQA specification points or infer complete subject coverage.

## Remaining 18 qualifications

- **Chemistry:** A006 (representing arbitrary configurations and ions), A010 (direct definition of the mole), A021 (complete range of common ionic formulae), A024 (comparative structure–property explanations), A027 (new VSEPR deductions), A048 (applying Le Chatelier under changed conditions), A055 (new ionic half-equations), A059 (the full Period 3 melting-point explanation), A062 and A063 (whether explanation beyond Group 2 solubility trends is expected), A075 (CIP decisions on unfamiliar structures), A076 (interpreting unseen IR spectra).
- **Physics:** A085 (period/frequency relation alongside wave speed), A090 (applying stretched-string equation to measurements), A095 (a standalone definition of vector), A100 (non-linear motion graph applications), A103 (using SUVAT in calculations), A109 (linked work/energy/power/efficiency problems).

These are **not 18 definitively missing flashcards**. Many are calculation, diagram, experimental interpretation or multi-step explanation outcomes better assessed in short or longer exam questions. Before writing more short cards, confirm truly absent recall and specification/formula-booklet requirements. For example the AQA Physics and Chemistry data booklets supply some equations; practising correct application is often more useful than copying them onto many flashcards.

## How the review was protected

- Exact support snapshots are asserted in `tests/task1-v143-v135-answer-review.cjs` against the current `deck.json`.
- All 106 requirement IDs, AQA section references and original source URLs are checked; the regression demands exactly **88 narrow supported and 18 partial** records.
- No existing flashcard front/back, ID, topics, mock flags or progress key is modified. No Firebase, XP, point balances, purchased items, scanned-answer marking, World galleries or photo files were changed.
- The test is included in the cloud/flashcard GitHub Actions workflow. Cloud, scanner, World safety and World browser regression checks must succeed before release.
- Previous v135 and v137 ledgers are retained unchanged as historical source evidence, so initial keyword-only labels in those archives must not be interpreted as today's current audit status.

## Recommended next work

1. Cross-check the 18 partial requirements and the seven originally reviewed v135 rows with the official AQA wording. Separate *missing memorisable facts* from exam-practice outcomes.
2. Build a **full specification-to-learning-activity index** for all compulsory AQA Physics 7408 sections, Chemistry 7405 topics and Maths 7357 content, not just the two historical samples. Confirm the centre's selected Physics optional section first.
3. Check each required practical for apparatus, method principles, control variables, interpretation, uncertainties, evaluation, safety reasoning and typical exam answers; don't certify it from a single flashcard.
4. Repair unclear grading/typed-answer aliases and introduce any missing short definitions, tests, observations or non-given formulae in small, tested batches.
5. Keep detailed calculations, diagrams and six-mark explanations as exam questions rather than making oversized flashcards. Prioritise Year 1 Physics and the Chemistry content confirmed as taught for the November mocks.

**Status:** audit-only development release. It does not publish new cards or claim that every AQA sub-bullet has been covered.
