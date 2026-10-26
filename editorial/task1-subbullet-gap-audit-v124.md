# Task 1 — AQA specification sub-bullet gap pass (v124)

**Recorded:** 26 October 2026. **Status:** draft release on a separate branch; not a certified whole-specification audit.

## Baseline and change

- Starting point: merged v123, **1,826 total / 1,822 active**, existing 1,220 pre-Task-1 IDs and 606 v122-v123 additions.
- This pass adds **38 independently worded short recall cards**, Physics **20**, Chemistry **18**, none for Maths.
- Proposed total: **1,864 total / 1,860 active**.
- All 1,826 previous card records and IDs remain present. No XP, review records, questions, Firebase data, shop assets or World photos were touched.
- Each new card has a specific AQA 3.x section reference, at least one curated alternative answer, and is `stage:A2, taught:false, mock:false` pending confirmation of teaching.

## Previously weak or absent individual requirements now tested

| AQA section | New single-point prompts | Not a replacement for |
| --- | --- | --- |
| Physics 3.7.2 | Satellite KE/PE/total energy, escape speed equation, orbit energy trend, geostationary direction, gravitational field–distance area, equipotential work | multi-step satellite calculations |
| Physics 3.7.3–4 | Charged particle motion, electric field–distance area, dielectric polarisation, plate separation | drawn field maps and capacitor calculations |
| Physics 3.7.5 | Fleming's rule and moving negative charges; induced emf amplitude, transformer flux, efficiency and AC RMS/peak-to-peak | vector diagrams and longer induction questions |
| Chemistry 3.1.11–12 | Cell notation/bridge, basic buffer composition and qualitative response | titration/pH/EMF calculations |
| Chemistry 3.3.11–12 | Amines, quaternary ammonium surfactants, polymer hydrolysis/recycling and condensation links | drawing mechanisms and polymer repeat units |
| Chemistry 3.2.5–6 | Haemoglobin coordination and charge-density explanation of metal-aqua ion acidity | aqueous-ion equations and observations |

## Quality controls

- The existing duplicate-prompt inventory was checked before choosing these prompts. The additions distinguish adjacent ideas rather than reword definitions already in the bank.
- All new fronts <=170 characters and backs <=205 characters; no long worked problems.
- The v123 practical test must remain cumulative rather than require an exact total of 1,826 forever; the new v124 test checks the incremental counts and protects previous ID associations.
- The cloud-sync workflow should run the v124 regression alongside the v122 and v123 checks. All PR checks should pass before considering merge.
- No local user session was inspected or changed; data-preservation claims refer to stable card IDs and no changes to storage code, not a live check of the user's Firestore record.

## Known boundaries; do not say 'every syllabus bullet covered'

1. **Physics 3.1–3.8:** a full item-by-item mapping remains necessary, especially nuclear methods and every 3.7 subsequence. Medical Physics 3.10 is the site's default optional locked topic, but the actual exam option is not confirmed.
2. **Chemistry 3.1–3.3:** finish explicit mapping of numerical/practical outcomes as *exam questions*, not flashcards. Advanced Period 3 oxides, transition-metal reaction equations, mechanisms, NMR interpretation and organic synthesis still need attention.
3. **Mathematics 7357:** prioritise worked questions and method marking; retain a small recall deck.
4. **Answer marking:** curated acceptable strings reduce unfair rejections but do not prove that every actual student response will be marked correctly. Test both synonyms and plausible misconceptions.
5. **Before mocks:** do not automatically include untaught A2 or the optional Physics topic in the November AS-focused mock queue.

## Source sections checked for this limited pass

- https://www.aqa.org.uk/subjects/physics/a-level/physics-7408/specification/subject-content/fields-and-their-consequences-a-level-only
- https://www.aqa.org.uk/subjects/chemistry/a-level/chemistry-7405/specification/subject-content/physical-chemistry
- https://www.aqa.org.uk/subjects/chemistry/a-level/chemistry-7405/specification/subject-content/inorganic-chemistry
- https://www.aqa.org.uk/subjects/chemistry/a-level/chemistry-7405/specification/subject-content/organic-chemistry
