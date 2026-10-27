# Task 1 v147 — mechanism exam practice and organic RP5/RP6, without making flashcards overlong

## Source and baseline
- User request 27 Oct 2026: ensure ten ChatGPT review ideas already exist in the Revision Loop website, prevent overcomplicated flashcards, continue next task. The ten concept-to-existing-ID mappings are recorded in editorial/task1-v147-organic-exam-audit.json.
- Official Chemistry 7405 subject content: https://www.aqa.org.uk/subjects/chemistry/a-level/chemistry-7405/specification/subject-content/organic-chemistry
- Required Practicals 5/6: https://www.aqa.org.uk/subjects/chemistry/a-level/chemistry-7405/specification/practical-assessment
- Baseline v146 deck: 3,263 flashcards, 3,259 active; main exam bank: 1,182 questions.

## Implemented
18 original AS Chemistry exam questions, 97 marks, 11 prompts explicitly involving drawings or structural/arrow representations. Each includes discrete mark points with full weighting and answers. Categories: electrophilic addition (4); substitution (2); halogenoalkane elimination (1); free-radical mechanisms (2); alcohol elimination (1); polymer repeating units (1); organic isomerism (1); RP5 distillation/analysis (2); RP6 functional-group tests (2); IR interpretation (1); hydrolysis observations/data (1).

All questions are explicitly year Practice / paper Original / sourceVerified false, not presented as real AQA past-paper questions. They are tagged for mock revision with AS level and the relevant revisionTopic. Practical questions are based on supplied observations and physical principles rather than operational preparation details. New questions do not alter site runtime or existing question/flashcard IDs.

## Concluded about chat's ten quick review cards
Ten ideas are covered in website deck, mostly with different front wording. The exact question asking 'skeletal corner' is not reproduced; existing cards explain an unlabelled line end and the conventions for skeletal carbon, so there is conceptual support rather than identical text. Do not create exact duplicates unless student feedback shows a gap.

## Flashcard length policy
v146's 84 cards already have back lengths at most 95 characters and all single-sentence answers. Mechanisms with multiple arrows, full structures or several scoring criteria should be exam questions only. Do not convert these 18 into flashcards or treat completing authored content as proven mastery.

## Verification/release
tests/task1-v147-organic-exam.cjs checks the exact 18 new cards in the question bank, 97 marks, source disclosure, original IDs and snapshots, and 10 existing flashcard mappings. Existing question-alignment regression runs as well, within cloud workflow. Verify CI/Pages and merge if green.

## Unfinished work
Line-by-line audit for all AS Chemistry 3.3.1–3.3.6, especially RP5/6, and A2 organics. More visual-diagram practice and image/photo answer marking validation in real browser. Whole AQA Chemistry 7405, Physics 7408 and Maths 7357 specification crosswalk is incomplete. Physics optional module unconfirmed.
