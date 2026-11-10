# v433: Chemistry qualitative-analysis recall cross-check

Date: 10 November 2026
Course: AQA A-level Chemistry **7405**, not the GCSE 8462 list.

## Verified current-bank evidence

- Core `deck.json`: **1,981 Chemistry cards** of 3,345 total, with no IDs edited by this change.
- Before v433, the booklet-aware `flashcard-priority-v429.js` predominantly prioritised definitions and directly requested unprovided equations. A broad check of 163 Chemistry core prompts about ions, observations, reagents, colours or testing found only 15 previously prioritised. This is a limited prompt-sample, **not** a specification coverage percentage.
- After conservative v433 classification, **104 existing core Chemistry cards** receive the new **Chemical test to know** priority. Supplementary banks are also classified at runtime, so the live full-bank number may be larger. Some direct definitions still have the existing definition badge.
- Eleven new, concise, theory-only recall prompts cover specific gaps not directly seen in the core: magnesium hydroxide, the Group 2 hydroxide solubility comparison, ammonium/carbonate ionic equations, simplified electron-impact/electrospray ionisation equations, and Fe(II), Fe(III), Al(III), Cu(II) carbonate results and Fe(II) oxidation in air.
- All new IDs use `chem_test_v433_XX`. **Six AS** cards may enter the first-school Chemistry mock; **five A-level-only 3.2.6** cards have `mock:false`, `taught:false` and remain in full revision.
- The new category returns `kind:'chemical-test'` rather than falsely calling observations **definitions** or **equations**. Equations continue to have their own label. Unrelated Chemistry synthesis, Physics and Maths are not reprioritised.

## Specification audit categories

| Area | Relevant knowledge in existing core / addition | Status / caution |
|---|---|---|
| RP4 Group 2 cations | Hydroxide and sulfate relative solubilities; Mg(OH)₂ observation and Ca(OH)₂ comparison | Covered at short recall level; a concentration-independent, single colour chart is **not** a substitute for interpreting solubility |
| RP4 NH₄⁺, OH⁻, CO₃²⁻ | Ammonia and damp litmus; hydroxide indication; CO₂ identification and carbonate equation | Core already has qualitative observations, plus one short equation |
| Group 7 / RP4 | Silver chloride/bromide/iodide colours and relative solubility in ammonia, acidification reasoning | Existing numerous separate short prompts; **do not duplicate** them |
| Sulfate | White BaSO₄ evidence, acidification interference, ion equation | Present in several original cards; no new duplicated card |
| RP6 organic groups | Bromine-water observation, oxidation of alcohols, Tollens, Fehling, 2,4-DNPH and carboxylic-acid/carbonate indication | Some belong to Year 2; short recall is not practical mastery |
| RP11, **A-level only** | Fe²⁺, Cu²⁺, Fe³⁺, Al³⁺ hydroxide observations and excess reagent behaviour; carbonate distinction | Core plus five targeted new observation cards; no school-mock leak |
| Mass spectrometry | TOF principles and simple EI/ESI ionisation forms | Two theory-only equations added, separate from chemical test labels |
| Flame colours | GCSE list in supplied screenshots (Li, Na, K, Ca, Cu) | **Not** a stand-alone mandatory 7405 ion-colour table; left outside the A-level must-memorise classification |

## Editorial boundaries

- This is a targeted identification/recall improvement, **not full AQA Chemistry practical-specification sign-off**, laboratory directions, a marking of diagrams, or a claim that all practical tests have now been individually tested on a real device.
- For 3.2.6, AQA's official metal-ion colour guide gives specific results for Fe²⁺, Cu²⁺, Fe³⁺, Al³⁺ with hydroxide, ammonia and carbonate. In particular **Fe³⁺ and Al³⁺ with carbonate can release CO₂**, unlike Fe²⁺; avoid treating all aqueous metal carbonates as ordinary carbonate precipitates.
- Observations for dilute Group 2 solutions may depend on conditions and solubility. Do not turn an uncertain absence of visible precipitate into a guaranteed identifying result.
- The screenshots include GCSE-specific flame wording; keep course levels distinguished.
- The user must still review and practise exam methods; don't equate a classifier badge or a card bank with demonstrated mastery.

## Source checks

- AQA A-level Chemistry inorganic specification (Groups 2/7, RP4 and 3.2.6):
  https://www.aqa.org.uk/subjects/chemistry/a-level/chemistry-7405/specification/subject-content/inorganic-chemistry
- AQA organic specification (RP6, carbonyl identification and alcohol oxidation):
  https://www.aqa.org.uk/subjects/chemistry/a-level/chemistry-7405/specification/subject-content/organic-chemistry
- AQA atomic/TOF mass spectrometry and ionisation:
  https://www.aqa.org.uk/subjects/chemistry/a-level/chemistry-7405/specification/subject-content/physical-chemistry
- AQA mandatory practical list:
  https://www.aqa.org.uk/subjects/chemistry/a-level/chemistry-7405/specification/practical-assessment
- AQA official transition-metal ion observation teaching guide:
  https://filestore.aqa.org.uk/resources/chemistry/AQA-7405-REACTIONS-OF-METAL-IONS.PDF

## Release gates

1. Source and Chromium tests for v433 on 360px/390px/1280px with synthetic progress; no saved-user data touched.
2. v429 and v430 + v432 flashcard/marking/backup/regression CI green.
3. Exact-head Vercel READY preview, then dependency release ordering.
4. Unfinished full-paper / required-practical and real-device Google-sync QA remain explicitly open.
