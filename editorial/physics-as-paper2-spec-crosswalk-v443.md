# v443 — AS Physics Paper 2 (7407/2) specification and guided-card audit

**Date:** 11 November 2026  
**Scope:** Existing 132 original Paper 2 coaching cards, eight new original targeted examples, and the specific first-year AQA subject-content subsection codes. This is **not** a claim that every AQA paper, question style or mark scheme is fully reproduced or independently audited.

## Verified findings

1. The original v430 bank used only **nine** repeated `specRef` values, some of which were not valid AQA subsection numbers (for example `3.1.2.1`). Other cards were assigned to an unrelated subject area: an emf–current graph card was labelled `3.3.2.3` (refraction), and a projectile question was labelled `3.4.1.5` (Newton's laws). **122 of 132** original `specRef` fields were corrected to the closest valid AQA 7407 assessed content subsection.
2. **All 132 historic IDs, prompts, answers, accepted equivalents, A–D distractors, hints, explanations, priority tags and scheduling fields remain byte-for-byte equivalent after excluding the `specRef` field.** Canonical SHA-256 of those original 132 card objects: `19fa55eb4dbfee8d9c5115e5fd1daeffc40e3419c7688f2707a024c30e34ddf9`.
3. After correction, **32 of AQA's 36 AS subsection codes** had at least one directly tagged short coaching card. The four missing codes were `3.1.3` (estimation), `3.2.1.1` (atomic constituents/nuclear notation), `3.2.1.5` (particle classification) and `3.2.1.7` (conservation laws applied to particle reactions).
4. Eight **original, brief and non-copyrighted coaching questions** have been added with their own `as_p2_v443_001`–`008` IDs, exactly two for each missing code. These train first-step estimation, specific charge and nuclide reasoning, hadron/lepton classification, baryon number and strangeness conservation. The resulting **140-card** pack contains **A41, B32, C67**; the Section C extension has four original four-option MCQs. None enters the school Mock preset (`mock:false`), and all source IDs remain stable.
5. The pack now has at least one direct-topic card assigned to **each of the 36 AQA AS subject-content subsection codes**, across measurements and errors, particles, waves, mechanics/materials and electricity. This is **tag-level representation only**. One card is not enough to teach a complete subsection, and no mark-scheme or paper-completeness conclusion follows from it.

## Areas still requiring editorial sign-off

- A full bullet-by-bullet check of all 36 subsections against the complete revision-site flashcard and exam-question libraries, including symbols, caveats, diagrams, misleading equivalences and required practical apparatus, remains outstanding.
- AQA AS Physics 7407/2 assesses **20 marks of practical/data work, 20 marks of applied written work and 30 one-mark MCQs**. Completing flashcards cannot replace timed, sustained work on a 70-mark/90-minute paper.
- The historical **2018–2025 paper questions and mark schemes have not been independently checked part by part** against the coaching bank, and missing styles cannot be inferred solely from a topic tag.
- Four new Section C MCQs have correct-answer/distractor checks in code, but all possible student paraphrases and handwritten answers have not been certified as automatically marked. The existing manual review option must remain.
- 2026 official paper public release must be checked against AQA's actual publication status before being added to any completeness claim.

## Regression gates

`tests/physics-paper2-spec-v443.cjs` checks the official code list, preservation digest, 132 original IDs, eight distinct IDs, all A/B/C counts, Section C option integrity, offline resource inclusion and unchanged saved progress keys. Existing `tests/physics-paper2-coach-v430.cjs` and `tests/physics-paper2-coach-browser-v430.mjs` were updated to require **140** real loaded cards rather than blindly assuming 132. Run 360px, 390px and 1280px browser checks before release.

## Official AQA references

- [AQA 7407 assessed subject content](https://www.aqa.org.uk/subjects/physics/as-level/physics-7407/specification/subject-content)
- [Measurements and errors](https://www.aqa.org.uk/subjects/physics/as-level/physics-7407/specification/subject-content/measurements-and-their-errors)
- [Particles and radiation](https://www.aqa.org.uk/subjects/physics/as-level/physics-7407/specification/subject-content/particles-and-radiation)
- [Waves](https://www.aqa.org.uk/subjects/physics/as-level/physics-7407/specification/subject-content/waves)
- [Mechanics and materials](https://www.aqa.org.uk/subjects/physics/as-level/physics-7407/specification/subject-content/mechanics-and-materials)
- [Electricity](https://www.aqa.org.uk/subjects/physics/as-level/physics-7407/specification/subject-content/electricity)
- [Practical assessment and apparatus](https://www.aqa.org.uk/subjects/physics/as-level/physics-7407/specification/practical-assessment)
- [AS scheme of assessment](https://www.aqa.org.uk/subjects/physics/as-level/physics-7407/specification/scheme-of-assessment)
