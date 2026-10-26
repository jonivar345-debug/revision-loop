# Revision Loop — stable development handover
**Recorded:** 26 October 2026  
**Website:** https://jonivar345-debug.github.io/revision-loop/  
**Photo release:** World v117, PR #63 (14 extra local galleries)  
**Purpose:** Finish a larger photograph batch, deliberately pause photo expansion, and return to revision features without losing work.

## Release status and exact photo figures

| Checkpoint | Local photos | Complete four-photo galleries | Still incomplete | Missing local photo slots |
|---|---:|---:|---:|---:|
| World v116, previously published | 1,008 | 252 / 376 | 124 | 496 |
| World v117, after its archive build passes | **1,064** | **266 / 376** | **110** | **440** |

The v117 archive workflow passed **45 steps** (including source licensing, dimensions, genuine locally hosted WebP files, digital duplicate checks, prior-source preservation, attribution records and the generated review index). These values describe actual committed images on the **v117 development branch** until PR #63 is merged and Pages deployment succeeds; do not confuse an archive build with live publication. `editorial/world-local-photo-audit-v117.json` and `editorial/reviews/world-local-photo-review-index.json` must agree. All 252 existing v116 gallery source sequences are protected against silent replacement by `editorial/world-v116-protected-source-baseline.json`.

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

## Safe future working order

1. Read this handover, check `main`, GitHub Pages, recent PRs and any concurrent code changes.
2. Verify the user's actual progress remains in their usual browser. Ask the user to keep a downloaded backup; do not claim to possess the file.
3. Work in a dedicated branch for the next revision/marking feature. Do **not** touch `assets/world` or photo manifests unless repairing a real bug.
4. Run World safety, browser acceptance and scanner/marking workflows; review failures and preserve unrelated concurrent work before merging.
5. When photos are deliberately resumed, start from **266/376** rather than redoing the original 252, and recheck Commons rights and image quality.

**Reference PRs:** #62 progress backup; #63 v117 photographs; #57 v116 photographs; #56 ongoing photo-development issue. The actual merge SHA and successful Pages workflow must be checked after release.
