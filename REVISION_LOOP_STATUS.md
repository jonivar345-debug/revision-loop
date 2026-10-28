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
