# Task 1 v148 — Year 1 Organic Chemistry evidence-first specification crosswalk

27 October 2026. The baseline is **published v147**, with **3,263 flashcards (3,259 active)** and **1,200 main-bank questions**. This release is an **audit-only** change. No cards, exam questions, progress IDs, Firebase, XP, scanner, World content or site runtime are changed.

## What was checked

Official AQA Chemistry 7405 organic sections **3.3.1–3.3.6**, including all **19 numbered Year 1 subsections** and RP5/RP6-related applied material, against the real published v147 deck and question bank, not just topic labels. The JSON evidence ledger contains **80 atomic learning checks** with the exact card fronts and backs, question prompts and mark points of every cited existing activity. Breakdown: supported_recall: 44, partial: 9, supported_application: 19, gap_applied: 5, gap_recall: 3.

**Important limitation:** These rows are a structured audit of significant assessable demands, not a line-for-line exhaustive certification of every possible AQA exam skill, nor student mastery. 'Supported' means narrow evidence for the named requirement; it does not imply all unfamiliar questions are covered. Partial/gap statuses are editorial findings, not proof that no other resource addresses the idea.

Official sources: https://www.aqa.org.uk/subjects/chemistry/a-level/chemistry-7405/specification/subject-content/organic-chemistry and https://www.aqa.org.uk/subjects/chemistry/a-level/chemistry-7405/specification/practical-assessment.

## Most useful next changes

1. **Organic analysis, 3.3.6.2:** Add an original high-resolution mass-spectrometry exam question requiring precise-atomic-mass calculations to distinguish candidate molecular formulae. v146's conceptual card is present; simple Mᵣ examples are not equivalent.
2. **Alcohol production, 3.3.5.1:** Check for duplicates before adding a concise fermentation-conditions/justification card; add an applied biofuel/neutrality comparison using supplied balanced equations, including ethical land-use trade-offs.
3. **Organic structures, 3.3.1.1/3.3.1.3:** Add varied image- or paper-based naming, skeletal, E/Z and CIP exam questions; do not make them multi-stage flashcards.
4. **Addition polymers, 3.3.4.3:** Address polyalkene intermolecular forces and ordinary PVC uses with one fact per card after semantic duplicate checking.
5. **Organic analysis, 3.3.6.3:** Improve links between atmospheric IR absorption by CO2, methane and water vapour, and practice deriving a plausible full structure from supplied spectra/data rather than guessing from one peak.
6. **Other application points:** Balance unfamiliar cracking equations, assess pollutant data and explain ozone research/legislation. These belong in exam practice or short explanatory recall only when necessary.

**Release procedure:** The new `tests/task1-v148-organic-crosswalk.cjs` test checks all snapshots against deck and question-bank data, preserves exact baseline counts, records the full 19-subsection spread and does not certify completeness. It is wired into cloud/flashcard CI. Merge only once relevant CI checks pass; confirm Pages if publication is claimed.
