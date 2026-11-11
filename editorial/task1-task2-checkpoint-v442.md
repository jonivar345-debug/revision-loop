# Task 1 / Task 2 evidence checkpoint — 11 November 2026 (v442)

**Sign-off state: neither Task 1 nor Task 2 can yet be certified complete.** This checkpoint is based on the current `main` code at **v441** plus the proposed v442 satellite-display correction. Historical completion claims are not substitutes for source- and browser-level verification.

## Task 1 — revision, AQA questions and marking

**Implemented and released:** AQA Physics, Chemistry and Maths flashcards, practice/exam/mock modes, spaced repetition, weakness tracking, reward history, daily challenges, saved cloud progress and offline support, scanning and manual review, global Skip and manual “I know this” override, unlimited mocks, full-screen study. Dedicated AS Physics Paper 2 coach has **132 original cards**, including **63 MCQ-style cards**. The v439/v441 Physics mock restoration balances the five first-year subject strands, retains all six AS required practical topics and adds **26** short practical/data cards and **12** original six-mark worked exam questions. Source and browser regressions passed in the v441 release.

**Not signed off:**
- The requirement-by-requirement AQA Physics/Chemistry/Maths specification audit has not certified every assessed point and practical/diagram alternative.
- Historical archive is **not** a complete paper index. The latest published internal paper inventory (v164) records **134** paper slots, **31** with indexed parts, **231** indexed parts and **zero fully verified complete papers**. A source-verified adaptation and an original exam-style question must not be described as a full original past paper; 2015 belongs to older specifications. Check availability and indexing of 2026 material independently before any completeness claim.
- Marking accuracy is supported by many regression cases, but all multi-step calculations, diagrams, partial-credit interpretations, scan reading and alternative answers have not been individually certified. Handwritten equation OCR remains device/lighting dependent.
- The school's A-level Physics optional unit is not recorded as confirmed. Do not assert the optional Paper 3 unit is covered specifically for this student without checking.
- Final editorial assessment of mock difficulty, distractor quality, and reliable worked feedback remains open.

**Next Task 1 gate:** build an exact subsection/required-practical ledger crosswalk covering *verified* card + question evidence, plus a by-year 7407/2 and 7408 paper-style verification queue, with source links and explicit unverified rows. Fix material gaps and incorrect marking in a targeted way, without generating large unreviewed batches.

## Task 2 — globe, destinations, photos, characters, shop and rewards

**Implemented and checked:** Globe and location controls, country/destination descriptions, 116 character shop entries, 928 outfits, 379 purchasable destinations (shop test), points-only daily streak bonus, old purchases/points/XP migration, offline Earth geography. Current local photo QA validates **1,064 licensed photographs represented by 2,128 local WebP files** (gallery and cover formats); this count is not the number of independently signed-off complete four-photo galleries. World photo collection's canonical stable base still contains 376 destination IDs; the shop now includes expanded geography, so counts must be described separately.

**Found and fixed for v442:** Satellite-preview image was drawn onto a **2048×1024** canvas, then read from only **1024×512** pixels and compared with the full-size buffer. The condition was necessarily false, so an otherwise valid remote Blue Marble image was never used. v442 reads the full canvas, validates its actual size and preserves local Natural Earth pixels on remote/CORS failure. Source and Chromium tests cover both paths and ensure study progress, points and XP remain unchanged.

**Not signed off:**
- Visual verification of all destination galleries for location relevance, misidentification, quality, distinctness, cropping, attribution and low-resolution/delayed loading remains outstanding.
- Some original image candidates are externally sourced; offline galleries/remote dependencies, older mobile devices and all screen sizes have not been visually certified one by one.
- The 116 characters and 928 outfits have passed catalogue and economy checks, but accuracy of recognisable character images and outfit appearances has not been approved individually.
- Complete user journey across unlocking locations, using photo galleries, zooming/rotating globe, restoring old profile and changing phones is only partially covered by automated checks.

**Next Task 2 gate:** a gallery-by-gallery photo and licence audit with replacement of incorrect or repeated images, plus browser/mobile checks of purchase-to-unlock, zoom, local image fallback, character art and complete restored-profile workflows. Never change existing purchased IDs or balance/saved progress schema as an incidental content edit.

## Release policy
Promote a change only after targeted Node and browser tests on the exact revision, Vercel READY preview and verification that the production alias serves the released commit. Never mark the entire workstreams complete merely because a feature batch is deployed.
