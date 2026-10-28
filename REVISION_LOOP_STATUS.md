# Revision Loop v170 — practical calculation method marks and fair ECF review (28 October 2026)

**Proposed until CI, merge, and Pages deployment verification.** Continues the merged v169 marking work without changing question IDs, prompt text, mark totals, old flashcards, progress keys, World content, or saved results.

This update records **24 editor-reviewed correct alternative phrases** for **eight long Physics and Chemistry practical/data questions**. Subjects include double-slit uncertainty, emf/internal-resistance graph interpretation, wire breaking stress and Young modulus, repeats and systematic errors, back-titration mole accounting, distillation readings, reflux interpretation, and aldehyde/ketone identification.

Each question gets clear **error-carried-forward review guidance**, distinguishing demonstrated formulas/substitutions from correct numerical answers. ECF marks are **not automatically awarded** for a wrong final number. Each vetted alternative statement must credit its own single criterion, never unrelated points; explicit denial earns none. The cumulative pilot now includes **74 vetted phrases on 26 questions** (from 50 on 18 in v169).

The dedicated `tests/task1-v170-practical-marking.cjs` checks all 24 alternatives, exact-denial noncredit, formula-only noncredit for unrelated steps, and **all 1,268 stored model answers** continue to receive their own total marks. Earlier v167–v169 tests still run. Prior v169 regression's count is scoped to its own original cohort to preserve the historical baseline, not to hide new questions.

**Important limits:** Correct model self-matching is not independent verification of the scientific answers. Handwriting, graphs, diagrams and unfamiliar equivalent methods still need honest human review. This is a fair-marking increment, **not** complete AQA mark scheme certification or the completion of Task 1.

---

# Revision Loop v169 — fair partial credit after Physics model-answer repairs (28 October 2026)

**Proposed until CI and merge.** This combines the previous, fully merged v168 Physics model-answer repairs with the next round of marking improvements. All original question IDs, mark totals, past-paper links and **1,268 bank questions** remain intact; the flashcard deck stays at **3,335**.

Independent trials found that a single short assertion could be credited for several similar-sounding criteria in a lengthy multi-step answer. The new `singleClaimEvidenceCap` gives conservative suggested marks for short one-claim responses on a working-required question worth at least five marks, without limiting complete model answers or genuinely multi-stage written working. For example, the isolated statement that the second derivative is positive at x=3 no longer suggests 4/8; it suggests 2/8. A bare statement of 32.4% total yield suggests 1/7 rather than 2/7. These are editable suggestions, not automatic penalties in a formal AQA assessment.

Six more independently written questions have **18 vetted alternate phrasings**, with worked-method and error-carried-forward review notes. The merged bank now contains **50 vetted answer alternatives across 18 questions**, including the 12 phrases and four complete Physics model answers merged in the preceding update. Individually negated alternatives remain rejected; a standalone accepted phrase does not grant unrelated points.

Regression `tests/task1-v169-marking-calibration.cjs` checks actual overcredit cases, completeness of original worked model answers, accepted phrases, negation controls and separated method marks. It runs alongside existing Physics, scanner and World tests. No unverified claims of official AQA mark scheme coverage, automatic ECF judgement or perfect OCR are made.

---

# Revision Loop v168 — repair incomplete Physics model answers (28 October 2026)

**Proposed until all CI, merge and public website verification.** A complete, local marking audit of the current 1,268-question main bank found **four older 3-mark original Physics practice questions where the stored model answer failed to demonstrate all three separate marking points**. Two were free-body diagrams, one Boyle's law and one electric fields. Their old displayed answers earned only 1/3 when checked honestly, because they omitted diagrams/force directions, physical conditions or working.

The four model answers now state the complete method and outcome. Their `requiresWorking` flags are corrected so a bare numeric result cannot be mistaken for all requested diagram, explanation and calculation marks. **All four revised model answers earn 3/3 while their old bare answers still earn less than full marks**. Twelve separately verified equivalent phrasings (three per question) and four case-specific error-carried-forward method review notes are added. Every alternate statement on its own earns just its own mark; explicit denials earn none. The new regression is `tests/task1-v168-physics-model-marking.cjs`, supported by `editorial/task1-v168-physics-model-answer-audit.json`.

No question IDs, mark totals, original criteria, flashcards, saved revision states, scanner data, photos, World, XP or published AQA paper text were changed. The bank remains 1,268 questions; the deck remains 3,335 card records. **These are original practice model schemes, not official AQA mark schemes.** The student must still review method credit, OCR accuracy and any unfamiliar valid working before saving.

---

# Revision Loop v167 — fairer free marking and clearer mark schemes (28 October 2026)

**Proposed until all CI checks, merge and GitHub Pages verification.** This revision improves the real answer-marking user interface and the free ChatGPT marking hand-off while preserving all existing questions, marks, flashcards, progress and scanner data.

- Adds **20 independently reviewed alternative correct phrases** to **8 original exam-style questions** across Physics (2), Chemistry (2) and Maths (4); a distinct criterion is credited only for a complete vetted alternative. It does not auto-accept a lone keyword or a negated assertion.
- Shows individual mark-point weights and accepted alternatives beside tick boxes. Existing **source-verified strict evidence rules remain authoritative** and are not bypassed.
- Adds **error-carried-forward guidance** to those eight questions, requiring visible method or substitution evidence. An incorrect numerical answer does not automatically receive full marks; ECF decisions still require careful review.
- Makes a manual total-score override explicitly visible when it differs from ticked marking criteria, preventing misleading missed-point feedback.
- Includes alternate correct explanations and ECF notes in the existing **free manual ChatGPT marking hand-off**, not an automatic paid API request.
- Improves readability on mobile; adds a dedicated test `tests/task1-v167-fairer-mark-schemes.cjs` in cloud CI and an honest audit at `editorial/task1-v167-marking-quality-audit.json`.

**Scope limitation:** the bank remains at **1,268 questions** and the deck **3,335 cards**. This is an initial question-specific fair-marking pilot, not verification of every original mark scheme or a guarantee that OCR recognises unfamiliar handwritten workings. The student reviews provisional marking decisions before saving.

---

# Revision Loop v164 — transparent AS/A-level paper archive and 2026 availability (28 October 2026)

**Proposed until CI, merge and Pages verification.** The public website's paper-archive matrix now explicitly shows **2015–2026**, not 2015–2025. Its summer **2026** entry states that the official AQA papers are **not yet publicly released**, with public release of question papers and mark schemes scheduled for **9 July 2027**, linking to AQA's assessment-material release timetable. Do not invent AQA 2026 PDFs or questions.

A read-only evidence report, `editorial/task1-v164-paper-and-science-coverage-truth.json`, reconciles the existing `paper_inventory_2015_2025.json` (134 papers, 31 with source-indexed parts, 231 indexed parts, **zero whole papers certified complete**) with current Physics (1,154 active; 730 mock) and Chemistry (1,981 active; 1,533 mock) flashcards. Fifteen summer 2026 AS/A-level paper codes are recorded as **pending public release**, separate from the 134 historical current-specification papers, and are **not counted as indexed**. The 2015 papers use older specifications; the normal summer 2020 and 2021 exam series were cancelled.

The Physics and Chemistry card totals reflect volume, **not final line-by-line AQA specification certification**. Older cards with no explicit `specRef` cannot be treated as proven coverage gaps without reading the relevant content. The archive separates source-linked original-paper parts from independently written original AQA-style practice and links to official original papers where verified. Neither the website nor this release reproduces whole copyrighted papers or close substitute paraphrases.

Regression evidence: `tests/archive-regression.cjs` validates the 12-year public archive and 2026 release notice, while `tests/task1-v164-paper-archive-truth.cjs` validates exact Physics/Chemistry counts and paper inventory. The cloud-sync CI workflow runs the new test. No question, card, mark, World, saved progress or user profile IDs change in this release. This release is a **truthful coverage-status correction**, not completion of the request to cover every 2015–2026 question.

---
# Revision Loop v163 — challenging Year 1 Pure Maths exam questions (28 October 2026)

**Proposed; CI/merge/Pages verification required.** Based on the school's November AQA Year 1 Pure-only mock, the explicitly eligible Maths question pool rises from **121 to 129**, and the main original exam bank from **1,260 to 1,268**. Adds **eight original multi-part questions, 56 marks**, no new flashcards; deck remains **3,335 total, 3,331 active, 2,369 mock-eligible** as proposed in v162.

New practice: combined horizontal and vertical function transformations (7); trig equations in degrees using identities (6); stationary points, second derivative classification and tangent (8); positive-integer binomial expansion and approximation (7); signed definite integral versus geometric area (7); inverse function, restricted domain and range (7); circle tangent and chord (7); factor theorem, cubic factorisation and inequality (7). Each is an original, standalone, AQA-style challenge with explicit one-mark steps, not an official AQA paper question. All exclude Year 2 calculus and the school's excluded radians, Statistics and Mechanics.

Evidence: `editorial/task1-v163-maths-pure-challenge-audit.json`. CI: `tests/task1-v163-maths-pure-challenge.cjs` checks exact questions, 56 mark points, mathematical results and Year 1 scope. Historical bank projections are for **old regression expectations only**; the dedicated v163 test checks all 1,268 current records. All existing question IDs, marks and answers, flashcard progress keys, Firebase, World, scanner and XP remain unchanged.

**Limitations:** This is a response to observed targeted gaps, not a complete AQA AS Pure specification certification and not evidence of independently demonstrated student mastery. The harder questions should be attempted without worked solutions first.

---

# Revision Loop v162 — targeted Year 1 Pure Maths recall correction (28 October 2026)

**Proposed until CI, merge and Pages deployment.** Deck v162: **3,335 total cards (3,331 active), 2,369 mock-eligible**: Physics 730, Chemistry 1,533, Maths **106**. Main bank stays at **1,260 original exam-style questions**; Year 1 Pure Maths question selection stays **121** from v161.

AQA AS Pure sections 3.3–3.10 have been checked against the current Maths recall prompts for selected, demonstrably missing single facts. **23 short, single-fact cards** added: vertical reflection and stretch, leftward translation, factorials/binomial coefficients/general term, sequences and recurrence, quadratic inequalities, reciprocal-curve asymptotes, circle properties, degree-based exact trigonometry, change of base, first-principles differentiation, normals, monotonicity and 2D vector subtraction.

**Eight existing Maths cards reclassified**, rather than duplicated, from full/A2 to mock/AS: arithmetic and geometric series sums, inverse domain/range, sigma notation, the r=1 geometric case, and the inconclusive second-derivative test. **Two radian-worded exact-value cards removed from the school's November mock**, while retained intact in full A-level revision; the same important trigonometric values are now asked in degrees. All old IDs, fronts, backs, accepted answers, saved progress keys, XP, marking, scanner, Firebase, World and images remain unchanged.

Evidence and regression: `editorial/task1-v162-maths-year1-recall-audit.json`, `tests/task1-v162-maths-year1-recall.cjs`. Historical v160-and-earlier tests use `tests/task1-v162-historical-snapshot.cjs` to reconstruct their exact old flags and avoid treating deliberate v162 retagging as regression; the separate v162 regression verifies *current* live records. **This is a targeted recall audit, not certification of every AS Maths specification line or independent exam mastery.**

---

# Revision Loop v161 — November Maths mock-only exam scope correction (28 October 2026)

**Proposed until CI, merge and Pages deployment.** This release changes mock-session and daily-challenge question eligibility in `app.js`, not the question bank or flashcard deck. **Existing totals remain 3,312 flashcards (3,308 active; 2,340 mock-eligible) and 1,260 original exam questions**.

Prior selection used `q.mock === true || q.level === 'AS'` and therefore offered **224** Maths questions despite the school's **Year 1 Pure-only** mock. The centralised `mockEligibleQuestion` predicate now requires the explicit mock flag and excludes Maths **Statistics (26), Mechanics (23), and three school-excluded radian questions**. The corrected Maths mock selection contains **121 Pure questions**. The other **51** Maths AS questions lacking explicit mock eligibility are also excluded. All 103 removed from mock selection **remain in full revision**, with original text, answers, marks, IDs and progress unchanged. Physics and Chemistry mock exam pools continue to use explicit flags (240 and 249 respectively).

**Evidence:** `editorial/task1-v161-maths-mock-question-eligibility.json` includes all excluded IDs and the exact screening logic. `tests/task1-v161-maths-mock-question-scope.cjs` checks the runtime predicate, both filter call sites, counts and the school-specific exclusions. It runs in the cloud-sync CI workflow. **No new cards or questions** in this release. This is a functional eligibility correction, not a full AQA specification or personal mastery certification. Existing historical question-level `mock` flags have not been rewritten; in-scope filtering is enforced when selecting questions for November mock sessions and mock daily challenges.

---

# Revision Loop v160 — AS Physics Particles and Measurements mock coverage (28 October 2026)

**Proposed until CI, merge and Pages:** deck v160 **3,312 cards** (3,308 active), **2,340 mock-eligible** (Physics 730; Chemistry 1,533; Maths 77). Exam bank v68: **1,260 questions**. Existing cards, questions, IDs, app runtime, scanner, progress keys, XP and World assets unchanged.

AQA 7408 **3.2 Particles and Radiation**: 46 selected exact-evidence checks. Three concise cards cover baryon numbers of quarks and antiquarks, antineutron quark content and electron/positron rest energy. Two original mock questions, **14 marks**, assess conservation laws in beta-minus decay and photoelectric-energy/stopping-potential calculations.

AQA 7408 **3.1 Measurements and their Errors**: 32 selected exact-evidence checks. Three concise cards address the half-range estimate from repeated readings, matching decimal places for values and uncertainties, and deciding whether a graph intercept is consistent with zero. Two original applied questions, **13 marks**, cover wire resistivity uncertainty and graph/reading uncertainty.

Evidence: `editorial/task1-v160-particles-mock-audit.json` and `editorial/task1-v160-measurements-mock-audit.json`. Regression: `tests/task1-v160-particles-measurements-mock.cjs`, historical release-count tests amended only to exclude additive v160 IDs, and World economy standalone questions regression updated to preserve its historical baseline. **Selected checks are not full AQA specification certification, practical proficiency or proof of independent student mastery.** Questions are original exam-style, not official AQA papers. Terms the AQA specification expressly excludes from testing, including gluon, Z⁰ and graviton, have not been added as required recall.

---

# Revision Loop v159 — Physics AS Waves mock audit (28 October 2026)

**Release candidate until checks, merge and Pages deployment:** deck v159 **3,306 flashcards** (3,302 active), **2,334 mock-eligible**: Physics 724, Chemistry 1,533, Maths 77. Exam bank v67 **1,256 original questions**. All existing card and question IDs, app code, progress keys and settings are unchanged.

Targeted AQA 7408 section 3.3 Waves review: **45 selected** evidence-linked outcomes across progressive and stationary waves, polarisation, interference, diffraction, refraction, fibre optics and RP1/RP2. Four short mock cards fill directly checked recall gaps: absorption of light in fibres; the white central single-slit diffraction maximum; integer harmonic frequencies; and red fringes farther from the centre in white-light double-slit interference. There are three original harder mock questions worth **20 marks**: fixed-string wave speed and harmonics (7), double-slit fringe spacing and white light (6), and fibre critical angle, dispersion, attenuation and pulse broadening (7). Existing covered facts were not duplicated.

Evidence ledger: `editorial/task1-v159-waves-mock-audit.json`, with full live front/back, specification subsection, selected question mark points and explicit limitations. Regression: `tests/task1-v159-waves-mock-audit.cjs`, plus historical v122–v158 baselines excluding *only* additive v159 IDs. This does **not** certify complete AQA coverage or independent student mastery. No modification to marking, scanner, XP, images or World. All new questions are original rather than official AQA paper content.

---

# Revision Loop v158 — Physics AS Electricity mock coverage (28 October 2026)

**Release candidate until checks, merge and Pages:** deck v158 **3,302 cards** (3,298 active), **2,330 mock-eligible** (Physics 720, Chemistry 1,533, Maths 77). Exam bank v66 **1,253 questions**. The update adds three short AQA 3.5 recall cards: identical cell emfs and internal resistances in series, in parallel, and terminal p.d. when no current flows. Three original theoretical exam-style questions (6+7+6 = **19 marks**) cover combined cells including internal resistance, comparison of identical series/parallel cells, and the effect of loading and warming an NTC potential divider. All prior cards, questions, IDs, progress/settings and app runtime remain intact.

Evidence: `editorial/task1-v158-physics-electricity-mock-audit.json` records **33 selected** requirements spanning AQA Physics 3.5.1.1–3.5.1.6 with exact active mock card front/back and selected exam-question mark points. This is targeted evidence, **not comprehensive specification certification or independent mastery**. More topic-specific practice and remaining Year 1/Year 2 audit are needed. Questions are original, not official AQA mark schemes. Regression `tests/task1-v158-electricity-mock-audit.cjs` and cloud safety workflow run with preserved historical exact release baselines.

---

# Revision Loop v157 — Physics AS Mechanics and Materials mock audit (28 October 2026)

**Proposed until CI, merge and Pages deployment:** 3,299 flashcards (3,295 active), **2,327 mock-eligible** (Physics 717; Chemistry 1,533; Maths 77). Main exam bank v65 = **1,250 questions**, including three original AS Physics problems worth 20 marks. No existing question, card, or progress ID was removed or altered.

AQA 7408 section 3.4 targeted review: 33 selected, exactly evidenced recall/application requirements across vectors and moments, motion graphs, projectiles, Newton's laws, momentum, work/energy/power, materials and RP3/RP4. Added four **single-fact** Physics mock cards: qualitative meaning of lift, increasing drag at greater speed, breaking stress distinct from maximum tensile stress, and conservation of energy. Added three challenging original mock questions: falling-body drag/terminal speed (7 marks), tensile and breaking stress plus Young modulus (7 marks), and work from a variable-force graph plus kinetic energy and instantaneous power (6 marks). Complex maths and interpretation belong in exam practice, not overlong recall cards.

**Evidence:** `editorial/task1-v157-physics-mechanics-mock-audit.json` contains the exact live fronts, backs, matching AQA subsection labels, and selected question prompts/mark points. `tests/task1-v157-physics-mock-mechanics.cjs` checks snapshots, short cards, 20 marks, preserved bank IDs and mock flags. Historical exact-count regressions filter additive v157 IDs rather than relaxing earlier baselines.

**Limits:** 33 selected checks do not certify every point in AQA 3.4, the other Physics AS topics, or complete three-subject mock coverage. They do not prove independent student mastery. New exam questions are original AQA-aligned practice, not official AQA past questions or mark schemes. App/Firebase, scanner, XP, World, images and saved progress keys are unchanged.

---

# Revision Loop — v156 targeted mock Chemistry recall verification (28 October 2026)

**Release candidate; not live until CI passes, PR merges and Pages deploys:** 3,295 flashcards (3,291 active); **2,323 mock-eligible**: Physics 713, Chemistry 1,533, Maths 77. Exam question bank remains v64 / **1,247** original practice questions.

A careful review of the **11 unmatched items** in v155's 67-point AS Organic Chemistry keyword audit found **nine already covered** by active mock cards, **one newly covered** through a concise carbon-monoxide harm card and **one still partly covered** (the solvent-dependent competition between substitution and elimination). The remaining partly covered point must not be labelled closed. A separate one-fact mock card recalls that nitrogen oxides and sulfur dioxide can contribute to acid rain. These are two new short cards, not an 11-card addition.

**Precise evidence:** `editorial/task1-v156-chemistry-mock-recall-resolution.json` records the front, back, ID and mock eligibility of each mapped source card, including the unresolved point. `tests/task1-v156-chemistry-mock-recall.cjs` checks those snapshots, two new recall items, preserved IDs, subject counts and unchanged question bank. The v155 regression now checks its historical snapshot, excluding additive v156 IDs.

This is a **targeted correction**, not a full AQA 7405 or three-subject mock syllabus audit, nor proof of the student's personal recall. Multi-mark mechanisms, unfamiliar interpretation and calculations still need exam-question evidence. No changes to app runtime, Firebase, World, scanner, progress keys, shop, XP, existing cards or exam questions.

---

# Revision Loop — v155 mock-only scope repair and AQA recall audit (28 October 2026)

**Proposed v155, not live until CI/merge/Pages:** **3,293 flashcards (3,289 active)**, including **2,321 eligible in mock-only revision** (Physics 713, Chemistry 1,531, Maths 77). The decrease in mock eligibility is **deliberate**: 35 existing cards are no longer presented in mock-only selection, but **remain available in full A-level revision, unchanged and with their original IDs**. Specifically 18 Physics Year 2 periodic-motion/thermal cards (teacher confirmed Year 1/AS Physics mock), 8 excluded Chemistry buffers/half-neutralisation cards, and 9 Maths Year 2/radian concepts (Year 1 Pure-only mock).

Added **13 one-fact AQA-aligned flashcards**: Chemistry crude-oil fractions, volatility, converter equation, sulfur impurity, condenser, bioethanol carbon-neutrality, alkene definition, CFC research and economic role of cracking; Physics loaded potential-divider fundamentals. Longer explanations, graph interpretation, unfamiliar mechanisms and calculations continue to belong in **exam questions**. Main exam bank stays at **1,247 questions**, bank v64; all existing questions and their IDs are preserved.

**Evidence**: `editorial/task1-v155-mock-scope-recall.json` documents exact before/after mock flags and every added card. `editorial/task1-v155-chemistry-as-organic-mock-crosswalk.json` maps 67 selected single-fact prompts from AQA Chemistry 3.3.2–3.3.5 against the **actual active mock-only flashcard pool**, capturing exact front/back answers. **56 matched a direct recall question, 11 were not matched by the conservative wording search**; this is a screening result, not a claim that those facts are absent or that all 67 are mastered. More atomic spec points and full subject audits remain.

**AQA precision:** none of the new cards introduce sigma/pi bond terminology. AQA expects recognition of the electron-rich C=C bond and mechanistic curly arrows, not extra orbital vocabulary. The remaining legacy question wording must be reviewed separately; old exam-question text was not changed in this release.

**Safety:** no `app.js`, Firebase, scanner, XP, purchases, shop, images or World changes. Existing study/progress IDs remain stable. Regression: `tests/task1-v155-mock-scope-recall.cjs`, included in CI. Do not claim website publication until all four PR checks pass, merge and Pages deployment success.

---

# Revision Loop v154 — AQA-only mock recall and harder applied questions (28 October 2026)

**Release candidate (NOT live until merged and Pages completes):** 22 existing Chemistry card prompts/answers reworded to AQA-relevant descriptions of double-bond electron density, curly-arrow electron-pair movement and delocalised electrons, without optional sigma/pi bond terminology. The original card IDs are unchanged and saved user progress remains keyed to those IDs. Mathematical π in Physics and Maths is unaffected. **Four new short, single-fact Physics cards** cover superconductors and loading a potential divider. **Nine original AS/mock-only Physics/Chemistry exam questions worth 55 marks** target all nine selected partial-applied evidence demands from v153.

**Totals:** flashcards **3,276 → 3,280**, active **3,272 → 3,276**, mock-eligible **2,339 → 2,343**; exam bank **1,238 → 1,247** (v63 → v64). Each new card is `mock:true`, `taught:true`, `scope:mock`. Each new question is `mock:true` and `level:AS`. **No A2 scope, application UI, Firebase, XP or saved-progress-key changes.**

**Evidence and regression:** `editorial/task1-v154-mock-aqa-terminology-audit.json` records exact before-and-after flashcard text and the new items. `editorial/task1-v154-mock-applied-questions.json` ties the nine problems to the nine previously partly evidenced checks. `tests/task1-v154-mock-aqa-regression.cjs` guards totals, provenance, preserved IDs, mock flags, concise cards and AQA wording. Practice questions are original—not official past-paper questions. All exact counts are conditional on the main branch not changing before merge.

**Important limitation:** 2,343 mock-only recall cards is a large bank, **not proof that every exam assessable demand in all three AQA subjects is covered or that the student knows it independently**. The audit work so far is selective: more specification-by-specification checks remain, including Year 2 Chemistry material taught up to Kp. The five earlier mock question explanations that use sigma/pi wording still need a separate precise editorial review, as do other legacy questions. Exam questions are deliberately more complex than flashcards.

**Release gate:** Four CI workflows, merge, Pages deployment success before saying it is live.

---

# Revision Loop — v153 Organic exam mechanisms and Year 1 science audit (28 October 2026)

**Release candidate v153:** 12 original A-level-only Chemistry exam questions worth **81 marks**. Bank v62 → v63, **1,226 → 1,238 questions**. The questions are paper-only mechanism and functional-group mapping exercises: carbonyl electron-pair arrows; abstract nitrogen substitution and acylation; theoretical electrophilic aromatic substitution; and four-stage route ordering, evaluation, overall yield and atom economy. No practical chemical preparation or material-handling instructions. All new questions have `mock:false` and original—not AQA past paper—provenance. **Flashcards remain at 3,276 (3,272 active)** and all saved card IDs remain untouched.

**Year 1/mock priorities:** A second evidence ledger reviews **33 selected checks** in AQA Physics 7408 Mechanics and Materials (3.4), Electricity (3.5), and AQA Chemistry 7405 Bonding (3.1.3) and Energetics (3.1.4). Status breakdown: **11 supported recall**, **13 supported applied practice**, **9 partial**, with complete snapshots of every cited card answer and question marking point. Priority gaps for following releases: multi-interval distance vs displacement, curved s–t tangent, unequal-height projectile, unknown force-extension data, emf–current graph, loaded dividers, London-force unfamiliar comparisons, bond-enthalpy calculations and RP2 cooling-curve analysis. 'Partial' means limited mapped evidence, not absence or poor personal performance.

**Files:** `editorial/task1-v153-organic-theory-questions.json`, `editorial/task1-v153-mock-priority-evidence.json`, regression `tests/task1-v153-organic-mechanism-audit.cjs`. Sources are official AQA specifications. This is **not exhaustive qualification-wide coverage**; theoretical generic route maps do not demonstrate mastery of named compound synthesis. The specific hydroxynitrile mechanism from the v151 audit remains a partly unresolved advanced applied target. No new flashcards were required by this selected audit.

**Preservation:** no changes to `deck.json`, `app.js`, progress/Firebase, XP/shop, World, scanner or mock settings. Existing historical exam tests now exclude additive v153 IDs when testing their older exact release baselines. Release only after **all four PR checks**, merge and confirmed GitHub Pages deployment.

---

# Revision Loop — v152 A-level Organic Chemistry applied practice and recall (28 October 2026)

**Proposed v152 (not live until PR checks, merge and Pages deployment):** 14 independently written A-level-only Chemistry questions worth **84 marks** and six short, single-fact recall cards. Totals: **3,270 → 3,276 flashcards (3,266 → 3,272 active)**; **1,212 → 1,226 main-bank questions** (bank v61 → v62). All 3,270 old card IDs and 1,212 existing question IDs remain in place. New A2 material has `mock:false`, `taught:false` on cards and `scope:full`, so none is newly included in the November mock preset.

This is a *targeted response* to AQA 7405 v151 evidence gaps: 3D optical isomers, glycerol triester structures, RP10 melting-point interpretation, benzene stability arithmetic, polyester and polyamide drawings, unfamiliar amino-acid forms, tripeptide construction, protein structure and enzyme stereospecificity, combined ¹³C/¹H NMR, RP12 TLC/GC data and amine structural classes. New cards cover Terylene, nylon 6,6 and Kevlar uses, interchain polyamide hydrogen bonds and two conceptual amine-formation recall facts. Multi-mark drawing, calculation and interpretation remains in the exam bank, not on flashcards. No handling procedures for dangerous substances are provided.

**Evidence**: `editorial/task1-v152-a2-organic-additions.json`, cross-referenced to v151 row IDs; regression: `tests/task1-v152-a2-organic-additions.cjs`. Questions are original practice, not official AQA past questions/mark schemes. This does **not** establish qualification-wide specification coverage or independently demonstrated mastery. Retained v151 work includes unfinished arrow-based mechanisms, four-step synthesis, and several gap/partial rows. Do not change Firebase, saved progress keys, XP, shop, World, scanner, or app runtime.

**Release gate:** verify four existing CI workflows, merge PR, then verify GitHub Pages before describing the new website content as published.

---

# Revision Loop — v150 short Organic Chemistry recall cards (28 October 2026)

**Proposed v150 (based on the v149 development branch):** seven short AS Chemistry recall flashcards, 3,263 → 3,270 total (3,259 → 3,266 active). All previous card records and progress IDs preserved. One fact per card, no long reaction mechanisms, calculations or practical chemical-handling instructions. Areas: general formula, ozone UV protection, polyalkene London forces and chain length, common PVC applications, and atmospheric water vapour IR absorption.

Source: AQA Chemistry 7405 Year 1 organic sections 3.3.1, 3.3.3, 3.3.4 and 3.3.6. Evidence: `editorial/task1-v150-organic-short-cards.json`. Regression: `tests/task1-v150-organic-short-cards.cjs`. This does not certify every AQA sub-bullet or independently demonstrated mastery. Do not alter XP, shop, mock-only filters, Firebase, progress keys, exams or World images. Merge v149 first, then v150 only when four CI suites pass and Pages deploys.

---

# Revision Loop — v149 Year 1 Organic Chemistry exam practice (27 October 2026)

**Published starting baseline:** v148, 3,263 flashcards (3,259 active) and 1,200 exam questions. **Proposed v149:** 12 original AS Chemistry applied questions worth **66 marks**, raising the main bank to **1,212** (bank v61). No flashcards, review IDs, XP, purchases, cloud data, Firebase, scanner runtime, mock filters, or World photographs have been changed.

The v149 practice tasks cover precise-mass formula selection, E/Z and unfamiliar ring drawing, types of isomerism, cracked-product mass balance, vehicle pollutants, ozone chemistry and evidence, polyalkene/PVC intermolecular forces, polymer-to-monomer diagrams, IR structure suggestions, atmospheric infrared absorption, and biofuel lifecycle evaluation. All are **original practice questions**, not official AQA past-paper questions or mark schemes; each has explicit marking points. No practical chemical preparation instructions are included.

Evidence: `editorial/task1-v149-organic-applied-questions.json`; regression: `tests/task1-v149-organic-applied.cjs`. Historical v147/v148 tests filter v149 additions without relaxing preserved source snapshots. All four PR checks must pass before merging. Confirm GitHub Pages deployment before reporting publication. Next: duplicate-screened short recall cards, remaining Organic Analysis questions and A-level-only science specification coverage.

---

# Revision Loop — v147 applied organic exam questions (27 October 2026)

**Published baseline:** v146 / 3,263 flashcards (3,259 active) and 1,182 main-bank exam questions. No changes to any flashcards, saved-progress IDs, Firebase, XP, shop or World in v147.

**Pending release v147:** adds **18 original AQA-style Chemistry exam questions (97 marks)** to the main bank, bringing total to **1,200** if published. Includes 11 drawing/diagram/mechanism prompts with detailed mark points, and application questions covering theoretical electrophilic addition, nucleophilic substitution, elimination, free radicals, alkene polymers, stereoisomerism, **Required Practical 5** distillation interpretation, **Required Practical 6** functional-group observations and IR/organic analysis. All are short-answer/multi-mark **exam questions**, not flashcards; 84 v146 flashcards remain short and unchanged.

- Checked all 10 separately created ChatGPT review-card concepts against published website cards: ten conceptually supported, but skeletal corner is represented by adjacent line-end/general skeletal formula cards rather than an exact duplicate sentence.
- Record: editorial/task1-v147-organic-exam-audit.json. This is **not complete specification coverage** or demonstrated student mastery.
- Source: user's Year 1 organic notes, official AQA Chemistry 7405 sections 3.3.1–3.3.6 and practical assessment. Questions are **original**, not official AQA past-paper extracts or official mark schemes.
- No experimental procedures for hazardous reagents; practical questions involve apparatus reasoning and supplied observations.
- New regression tests verify 18 question IDs, 97 marks, marking points, original provenance, pre-existing 1,182-question records, all old deck IDs and progress storage keys.
- Release gate: CI success and GitHub Pages publication; do not claim live until confirmed.

**Next:** Detailed compulsory-syllabus crosswalk (each bullet against validated flashcards *and* questions); expand 3.3.6 organic analysis application where gaps remain and later A-level-only 3.3.7–3.3.14, plus Physics and Maths specification checks.

---

# Revision Loop — v146 Organic Chemistry mechanisms (27 October 2026)

**Published baseline:** v145 / 3,179 records (3,175 active). v146 is not live until all four CI workflows pass, PR merges and Pages deploys successfully.

**v146 proposal:** 84 additional concise Chemistry flashcards, increasing the deck to **3,263 records (3,259 active)** if published. All pre-v146 3,179 records and stable review IDs remain unchanged. Cards cover uploaded **Parts 11–15 (AQA 3.3.1–3.3.5)** plus initial **Part 16 (3.3.6)** Organic Analysis. **35** new cards are staged mechanisms, equation-completion, cloze or next-step prompts.

- Direct source: user-supplied pasted Chemistry notes covering organic foundations, alkanes, halogenoalkanes, alkenes and alcohols.
- Compared against active Chemistry flashcard fronts and backs; 12 proposed prompts removed for direct or near-semantic duplication and eight targeted follow-up mechanisms added.
- New cards are Year 1 mock-eligible; previous Year 2/mock boundaries unchanged.
- Source evidence and exact card mapping: editorial/task1-v146-organic-recall-audit.json. **This is not full syllabus-to-card-and-question certification.**
- Further exam questions needed for drawn curly arrows, carbocation structures, radical equations, elimination, polymer units, RP5/RP6 apparatus and practical interpretation.
- Cloud/Firebase, saved review keys, points/shop, World, scanner and question banks untouched.

**Release:** tests/task1-v146-organic-recall.cjs checks grading, mock eligibility, ID persistence and source snapshots. Historical tests exclude only additive v146 IDs. Merge only after all four green workflows and successful Pages deployment.

---

# Revision Loop — v145 science audit development (27 October 2026)

**Live baseline:** v144 published, 3,152 cards (3,148 active), merge #91 and successful GitHub Pages deployment. Do not describe v145 as published before PR merge and successful Pages build.

**Proposed v145:** 27 short A-level-only recall cards (8 Physics, 19 Chemistry) after reviewing existing answers, with 3,179 cards (3,175 active) if released. A separate source-linked evidence ledger records 24 checked existing recall facts, 27 new recall prompts and 8 outcomes needing applied exam questions. These 59 are selected atomic outcomes, **not** a complete compulsory AQA syllabus certification.

**Focus:** Physics capacitor/electric-field graph interpretation and nuclear size; Chemistry electrochemical cells, Period 3 oxides and their acids, transition-metal oxidation states and aqueous ion observations. All 27 proposed cards are A2 stage, `taught:false`, `mock:false`, `scope:full`, protecting November mock filters. Original 3,152 records/IDs retained. No app runtime, Firebase, progress keys, World, shop, images or question banks altered.

**Next:** Confirm all four workflows green on PR head, merge, verify Pages; then continue complete 7408/7405/7357 specification-to-deck and question crosswalk, practical and graph questions, with optional Physics module unconfirmed. See `editorial/task1-v145-a2-science-handover.md` and `editorial/task1-v145-a2-science-evidence.json`.

---

# Revision Loop — current project checkpoint (27 October 2026)

**Latest published flashcards:** v142, PR #89, **3,144 cards (3,140 active)**, on GitHub Pages. All original 3,128 pre-v142 records and stable review IDs were preserved.

**v143 completed:** PR #90 merged after all four CI checks passed; answered the previously outstanding **106 front-only candidate requirements** in the v135 selected AQA sample. **90 narrowly supported**, **16 partial or requiring applied exam-question work**. This was an audit-only release: no flashcards or progress keys altered.

**v144 proposed:** eight new Chemistry Year 1 flashcards, bringing the deck to **3,152 (3,148 active)** if the branch passes checks and is merged/deployed. See `editorial/task1-v144-chemistry-precision-handover.md`. Do not assume publication until the Pages workflow succeeds.

- Both selected earlier audits, v135 (113 rows) and v137 (142 rows), have been individually checked, but neither constitutes a complete AQA syllabus crosswalk. Different rows can overlap. Prioritise complete compulsory Physics, Chemistry and Maths specification-to-activity checks next.
- The v143 partial rows are **not all absent flashcards**: some test calculation, experimental interpretation, unfamiliar chemical structures, graph application or multi-step explanation. Reserve these for exam questions; only missing short definitions/facts belong in flashcards.
- The school's **Physics optional topic is still unconfirmed**. Do not claim Medical Physics or another option is compulsory before confirmation. Keep untaught advanced material out of mock revision.
- **World expansion remains paused:** 1,064 locally hosted photos and 266/376 complete galleries, leaving 110 incomplete.
- **Progress safety:** do not reset `revisionLoopProgress5`, `revisionLoopProfile11`, `revisionLoopSettings11`, original card IDs, Firebase/cloud history, XP, purchases or backups. Source tests cannot directly inspect private review history.
- **Release gates:** flashcard/cloud, scanner marking, World safety and World browser acceptance all need to pass on the final PR head, followed by merge and successful Pages deployment.

## Archived development handover (26 October 2026)

The following earlier snapshot remains for historical photo and Mechanics v118 context. Its older statements about cloud sync and the then-current card counts have been superseded by the current checkpoint above.

# Revision Loop — stable development handover
**Recorded:** 26 October 2026  
**Website:** https://jonivar345-debug.github.io/revision-loop/  
**Photo release:** World v117, PR #63 (14 extra local galleries)  
**Purpose:** Finish a larger photograph batch, deliberately pause photo expansion, and return to revision features without losing work.

## Release status and exact photo figures

| Checkpoint | Local photos | Complete four-photo galleries | Still incomplete | Missing local photo slots |
|---|---:|---:|---:|---:|
| World v116, previously published | 1,008 | 252 / 376 | 124 | 496 |
| World v117, merged into `main` | **1,064** | **266 / 376** | **110** | **440** |

The v117 archive workflow passed **45 steps** (including source licensing, dimensions, genuine locally hosted WebP files, digital duplicate checks, prior-source preservation, attribution records and the generated review index). These values describe the 1,064 locally hosted photos merged via PR #63. Pages deployment for this merge succeeded. Do not confuse a later development-branch archive build with live publication. `editorial/world-local-photo-audit-v117.json` and `editorial/reviews/world-local-photo-review-index.json` must agree. All 252 existing v116 gallery source sequences are protected against silent replacement by `editorial/world-v116-protected-source-baseline.json`.

### Fourteen new local four-photo galleries

1. Nairobi — KICC, city skyline/national park and wildlife.
2. Reykjavík — Hallgrímskirkja, Harpa, old harbour and city panorama.
3. Budapest — Parliament, Liberty Bridge, Fisherman's Bastion and Chain Bridge.
4. Grand Canyon — South Rim, Colorado River, Guano Point and heritage railway.
5. Sossusvlei — Dune 45, Deadvlei, oryx and the desert landscape.
6. Torres del Paine — mountain reflections, Pehoé Lake, guanaco and landscape.
7. Antigua Guatemala — Santa Catalina Arch, Agua Volcano, ruins and La Merced.
8. Panama City — skyline, Casco Viejo, Miraflores Locks and waterfront.
9. Lagos — skyline, Third Mainland Bridge, urban districts and waterways.
10. Kigali — produce market, city viewpoint, convention centre and memorial.
11. Bhutan — Taktsang, Punakha Dzong, hills and historic bridge.
12. Nepal — Mustang, Budhanilkantha Temple, Swayambhunath and Annapurna.
13. Singapore — Marina Bay, Merlion, Gardens by the Bay and Botanic Gardens.
14. Victoria Falls — falls, aerial view, bridge/rainbow and waterfall viewpoint.

**Visual decisions:** first shop covers for 14 destinations were actually inspected as rendered WebP files. The exceptionally thin Budapest Parliament panorama and a weak Victoria Falls view were replaced **for the shop card only** with Fisherman's Bastion (slot 3) and a clear aerial waterfall photograph (slot 2), respectively. All four original gallery pictures remain available in their original sequence. Full human visual inspection of all 1,064 photos is still outstanding and is **not** claimed complete.

**Source and review files:** `editorial/world-v117-batch-targets.json`, `editorial/world-v116-protected-source-baseline.json`, `editorial/world-v117-visual-review.json`, `editorial/reviews/world-v117-cover-contact-sheet.jpg`, `editorial/reviews/world-local-photo-review-index.json` and `assets/world/ATTRIBUTION.json`. Attribution is retained in the repository to meet source licensing requirements even if it is visually unobtrusive on the website.

## Saved student progress — critical

Revision Loop uses **device/browser localStorage**, not an account sync server. The three core keys are:

- `revisionLoopProgress5`: spaced repetition, flashcard review data.
- `revisionLoopProfile11`: XP, points, purchased characters/outfits/locations, exam results, achievements and progress-related records.
- `revisionLoopSettings11`: personal revision preferences.

Other optional caches, including outfit images, are **not** part of the three-key essential progress backup. Publishing a newer static website version should **not** erase these keys or reset XP/purchases; the implementation and CI must preserve them. **GitHub does not contain the student's actual browser progress**, which cannot be remotely recovered by an assistant.

The Progress tab now provides **Download progress backup** and **Restore a saved backup** through `progress-backup.js`, added in PR #62. The student must press Download and store the resulting `.json` somewhere safe (ideally keep a second copy off-device) to protect against clearing browser data or moving browsers. Restore validates the file and asks permission before replacing current local progress. These actions never upload personal progress, and the backup is not a cloud-sync feature.

**Important operational rule:** Never clear browser data, change localStorage key names, run destructive migrations or replace the stored profile as part of photo work. Run `node tests/revision-backup.cjs`, `node tests/world-profile-preservation.cjs`, `node tests/world-production-economy-integration.cjs` and the complete scanner and World/browser acceptance workflows before shipping. The user can keep revising during development on separate branches.

## Website availability and offline behaviour

The working site is GitHub Pages. Locally hosted photos are served from `assets/world/*` on the same website rather than requiring Wikipedia/Commons to load. This **does not guarantee that every gallery is available without internet**, since the service worker does not precache thousands of picture files. The shell and locally saved progress remain separate from the photo build. If a deployment is in progress, check GitHub Pages workflow completion before claiming the new release is live. The site is still usable in between photo releases.

## PAUSE photo expansion after v117

**Do not start another source-gathering or archive-batch PR by default.** Record the v117 checkpoint and stop photo development. The remaining 110 destinations/440 slots, and a later review of less attractive cover crops and photograph relevance, remain open for when the student explicitly returns to photographs. Some priority examples: Banff, Sossusvlei if any follow-up compositions, countries with no fully local archive, and world destinations with inaccurate/overly repetitive imagery. Sossusvlei itself is complete in v117; do not count it as unfinished. Existing `editorial/world_photo_collection_template_376.csv` lists all 376 locations. See GitHub issue #56 for earlier candidates and correction notes.

## Next feature priorities while photographs are paused

**First: Task 1 — AQA revision question bank and marking.** Prioritise exam questions, model answer checks and follow-up flashcards for Mechanics (especially displacement–time/velocity–time/acceleration–time graphs, forces on slopes and resolving), Chemistry Energetics (Hess cycles, `q=mcΔT`, `ΔH=-q/n`, stoichiometric scaling and standard conditions), Bonding/VSEPR, acids and bases, Chemistry practical questions, and Year 1 Maths Pure. Keep original exam questions and licensing restrictions respected. Verify scanner-assisted marking, correct/alternative methods, partial credit, dependent marks and progress persistence against actual regression tests.

**Second: remaining Task 2 non-photo features.** Review character art, outfits, unlocked galleries, shop purchases, point balances, globe pins and location information; ensure no purchased item disappears and UI performs on mobile. Keep any weak third-party portraits distinguishable from the now-locally-hosted destination photos.

**Third: reliable backups/UX and performance.** Provide clear user controls for manual backup/restore, verify mobile/browser reload behaviour, optimise photo loading and check that updating a service worker does not regress exam or world modules.

## New revision development after the photograph pause: Mechanics v118

**Published source work:** PR #64, merge commit `ae057b11ac61bf4b803481a7ebca01f6e81a30e0`.

- `mechanics_graphs_v118.json`: **10 new independently authored AQA-style Year 1 Physics Mechanics questions, 70 marks**. Covers s–t, v–t and a–t graphs (signed areas, velocity, distance, changes of direction), inclined-plane force components and reaction, moments and couples, impulse and free-fall experiment gradients.
- `deck.json`: **12 new targeted Physics flashcards** (deck version 118, 1,220 total cards at merge).
- Existing `mechanics_focus_v39.json`: 16 original questions, 118 marks, preserved.
- Website loads the extra bank via `app.js` and pre-caches its data file via `sw.js`; the document references `app.js?v=118`.
- Regression `tests/mechanics-graphs-v118.cjs` confirms numerical answers, unique IDs, mark totals and local progress key invariants; **World safety, browser acceptance and scanner marking all passed before merge**.
- Existing credits/photos, purchased items, XP, stored profiles and JSON progress-backup tool were not intentionally changed.

**Next actions:** independently test the new questions in live use, especially the signed-area ones, and repair any marking edge cases. Then strengthen Maths Pure and Chemistry physical topics from weak areas, followed by remaining character/shop/globe reliability. **Do not resume World photo scraping automatically.**

## Safe future working order

1. Read this handover, check `main`, GitHub Pages, recent PRs and any concurrent code changes.
2. Verify the user's actual progress remains in their usual browser. Ask the user to keep a downloaded backup; do not claim to possess the file.
3. Work in a dedicated branch for the next revision/marking feature. Do **not** touch `assets/world` or photo manifests unless repairing a real bug.
4. Run World safety, browser acceptance and scanner/marking workflows; review failures and preserve unrelated concurrent work before merging.
5. When photos are deliberately resumed, start from **266/376** rather than redoing the original 252, and recheck Commons rights and image quality.

**Reference PRs:** #62 progress backup; #63 v117 photographs; #64 Mechanics question bank; #57 v116 photographs; #56 ongoing photo-development issue. Check the most recent production Pages workflow if the site is updated again.
