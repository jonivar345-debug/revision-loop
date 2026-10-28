# Task 1 v166 — legacy mock-science card crosswalk (28 October 2026)

**Audit-only.** No card, answer, accepted marking synonym, stage, taught flag, progress key, exam question or application code has been changed.

This release carries forward the v165 Task 1 sign-off checklist and the v164 archive corrections on the current `main` branch. It also makes the next narrower progress check: account for **all 971 active Physics and Chemistry mock flashcards lacking a direct AQA `specRef`**.

| | Physics | Chemistry |
|---|---:|---:|
| Older eligible cards without `specRef` | 311 | 660 |
| AS-labelled | 311 | 466 |
| Taught A2-labelled | 0 | 194 |
| Blank model answers | 0 | 0 |

All 971 now have a **provisional specification section candidate** recorded in `editorial/task1-v166-legacy-mock-card-map.json`, using existing course topics and AQA's actual subject-content headings. That is a navigation aid for further checking, **not proof of full specification compliance or accurate answers**. Existing broad organic labels such as "Organic chemistry" deliberately remain broad where a narrower chapter is not justified.

Two previously ambiguous Physics graph cards were examined at answer level and assigned to 3.4.1 (impulse/work graph areas) and 3.5.1 (ohmic V–I/I–V gradients). One photoelectric-effect card has a longer-than-target answer but remains scientifically useful; it is flagged for editorial shortening rather than silently changed. This audit found no blank model answers.

Chemistry's 194 untagged A2 mock-eligible cards belong to the taught groups previously recorded: Kp, thermodynamics/Born–Haber, rate equations/Arrhenius, acids and bases up to the stated coverage, optical isomerism, carbonyls, carboxylic acids, esters and acyl chlorides. **Individual card scope is not yet independently certified**, and broader late-A2 topics should not be added to the November mock on the strength of these group names.

The v165 checklist is still marked **Task 1 incomplete** because paper-by-paper source verification, full AQA bullet-level checks, school-selected optional Physics unit, and published-site verification remain open. This v166 evidence does not create those papers or falsely award completeness.

Regression files `tests/task1-v165-completion-gate.cjs` and `tests/task1-v166-legacy-mock-crosswalk.cjs` run in cloud CI. Future work can review individual cards by ID, correct a specific issue, and keep all existing progress intact.
