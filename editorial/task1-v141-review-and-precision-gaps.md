# Task 1 v141 — close the selected v137 atomic answer audit

**Date:** 27 October 2026. This is an answer-evidence and gap ledger only, not a deck release or proof of complete AQA syllabus coverage.

## Scope and verified work

- Audited **all 46 previously unreviewed** rows in the v137 *selected* 142-requirement sample: **25 Physics, 18 Chemistry, 3 Maths**.
- Evidence stores the **actual active flashcard ID, exact front and exact back** for every supporting answer in `editorial/task1-v141-full-v137-answer-review.json`.
- **33 of 46** support their narrowly worded memory requirement, **12** are partial, and **1** (an explicit Physics isotope definition) has no direct Physics recall card.
- Source deck remains v138, 3,128 total cards and 3,124 active. All existing IDs, student progress, cloud code, mock tags, World content, purchases, question marking and XP are untouched.
- Combined with the original v137 (23), merged v139 (48) and merged v140 (25), **all 142 sampled rows have been triaged once**. This is *not 142 fully satisfied outcomes*: v140 alone has three partial findings, and v141 has 13 incomplete/missing items.

## Incomplete recall points identified by the new audit

### Physics (six)
- **B005:** explicit neutron-number formula `N = A − Z` (nuclide notation currently defines A and Z only)
- **B006:** what isotopes are (no direct active Physics definition)
- **B020:** explicit baryon number +1 for baryons, −1 for antibaryons
- **B024:** charge of a strange quark, −⅓e, alongside u and d
- **B050:** precise intrinsic/material-property wording for resistivity and its SI unit, not just dimensional calculations
- **B060:** connect current conservation at junctions to charge conservation and series/loop voltage sums to energy conservation

### Chemistry (seven)
- **B075:** products of incomplete hydrocarbon combustion (CO and sometimes solid carbon/soot, with water formed)
- **B077:** catalytic cracking, catalyst and product emphasis; differentiate from thermal cracking without claiming all cracking always yields fixed products
- **B089:** C–H IR absorption recall, supplementing existing O–H and C=O cards
- **B096:** optional ethyl, as well as methyl, fatty-acid esters in biodiesel
- **B103:** secondary and tertiary amines, alongside existing primary amine definition
- **B104:** responsible discussion of recycling/disposal and why many addition polyalkenes resist biodegradation
- **B106:** definition of isoelectric point in relation to net charge / amino acid zwitterions

### Other selected earlier partials
- v140 **B002**: relative masses do not directly give the *SI order of magnitude* of proton/electron masses.
- v140 **B074**: define an alkane explicitly as a saturated hydrocarbon, rather than defining only “saturated”.
- v140 **B085**: oxidation comparison needs the resistance of tertiary alcohols to the usual oxidation conditions.

These are proposed *precision recall additions* only. Before adding each, recheck whole-deck semantically, actual AQA wording and the formula/data booklet. Tests must assert answer alternatives, acceptable formatting, topic scope and preservation of previous IDs. Any derivations or lengthy mechanism drawings belong in exam questions.

## Next development move

1. Add a **small, targeted Physics and Chemistry batch** for confirmed gaps, not another duplicate topic dump; prioritise Year 1/mock-relevant B005, B006, B020, B024, B050, B060, B075, B077 and older B002/B074/B085 first.
2. Follow up the Year 2 Chemistry partials while retaining `mock:false` for untaught content; consider whether IR C–H is an AQA memorisation point before adding it.
3. Move to the separate **106 v135 front-only candidate matches**, and then extend coverage beyond these selected samples to full AQA Physics/Chemistry/Maths bullet lists and science practical evaluations.
4. Confirm the actual school Physics optional topic before making any option compulsory.
5. Protect students' existing cards, save keys, Firebase progress, purchased items and World photographs. World photo expansion remains paused at 266/376 completed galleries.

## CI acceptance

`tests/task1-v141-full-v137-review.cjs` checks every exact question and answer, all 142 unique v137 sample IDs, 33 supported/12 partial/1 absent, and the unchanged v138 deck. Cloud/flashcard, World browser, World safety and scanner workflows must pass before merging. Do not claim a website deployment until the Pages workflow succeeds.

**AQA source scope:** Physics 7408 Particles and radiation, Electricity; Chemistry 7405 Organic Chemistry; Maths 7357 Appendix B. Requirement-specific official source URLs remain in the JSON evidence.
