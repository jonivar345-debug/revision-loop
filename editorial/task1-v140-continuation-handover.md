# Task 1 v140 — answer-evidence closure and next work

**27 October 2026.** Follow-on to merged v139. This iteration changes **audit evidence only**; it does not create or edit flashcards, exam questions, user profiles or runtime code.

## Exact checks completed

- 25 more AQA requirements from the existing v137 *sample* now have original card IDs, full front text and full model-answer text recorded in `editorial/task1-v140-evidence-follow-up.json`.
- **22** requirements are supported for their **narrow recall wording**. **3** are explicitly marked **partial**, not complete.
- Breakdown: **7 Physics, 3 Chemistry, 15 Maths**. The evidence comes from the previously curated v136 answer list and the actual v138 add-card commit, and is checked against `deck.json` in CI.
- Partial evidence requires more checking:
  - **B002:** relative masses are recalled, but the candidate wording also asks for orders of magnitude of absolute proton/electron masses.
  - **B074:** saturation is defined, but the supporting card does not itself state that an alkane is a hydrocarbon.
  - **B085:** primary and secondary alcohol oxidation are compared, but that particular answer omits tertiary alcohols.
- This explicitly avoids the false conclusion that one familiar flashcard front proves a whole AQA skill or topic is covered.

## Reconciled v137 sample (142 narrow items)

| Disjoint category | Items |
|---|---:|
| Answer checked in original v137 audit | 23 |
| Additional answers checked in merged v139 | 48 |
| Reviewed in this v140 extension: full narrow recall | 22 |
| Reviewed in this v140 extension: partial | 3 |
| **Still needing first substantive answer check** | **46** |

Among those 46: **25 Physics, 18 Chemistry and 3 Maths**. The separate first-sample v135 ledger still has **106 front-match-only** items that need exact answer audits. Neither ledger represents every AQA specification sub-bullet, and there may be overlaps between their topics; do not add these figures to claim unique uncovered facts.

## Next highest-value work

1. Review the remaining **Physics 25** v137 rows, prioritising current/potential difference, particle definitions, photoelectric intensity and threshold, and electricity/resistivity; inspect *front and back* before adding definitions.
2. Review the remaining **Chemistry 18** v137 rows, prioritising test observations, cracking, mass spectra, oxidation and organic structures/mechanisms; separate memorisable recall from longer questions.
3. Review the remaining **Maths 3** v137 rows (arithmetic/geometric nth-term and radian arc length), then reconcile the AQA Appendix B memory formula checklist with existing answers.
4. Work through the **106** v135 selected candidates, keeping Year 1 mock filters accurate.
5. Extend the ledger beyond these selected early outcomes into compulsory Year 2, required practical observations and evaluation, and whole-paper skills; confirm the school's Physics option separately.
6. Add only genuinely absent, concise flashcards, and keep calculations, drawings and multi-mark reasoning in exam questions rather than overlong cards.

## Safety and release

- Main baseline after v139: **deck v138, 3,128 cards, 3,124 active**. v139/v140 are audit-only: no ID, answer, XP, cloud, shop, World, mock flag or progress key changed.
- `tests/task1-v140-evidence.cjs` validates all 25 exact card snapshots, their requirement links, partial qualifications, distinct v139 reviews and the precise 46-item remainder.
- The flashcard/cloud regression workflow must run this test before merging. Existing scanner, browser and World tests must also succeed. Do not claim deployment until the Pages build finishes.
- Prior photos checkpoint remains World v117: 1,064 local photos, 266/376 complete galleries, paused deliberately.

Source requirements: AQA 7408 Physics 3.2/3.5, 7405 Chemistry 3.3 and Maths 7357 Appendix B, with individual URLs in the evidence ledger.
