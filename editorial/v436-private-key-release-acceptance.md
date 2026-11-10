# v436 private-key synchronisation: release acceptance checklist

**Status: development only. Do not merge or announce live until every release gate has evidence.**

## Purpose and credentials
- Website's original 4-digit unlock and the separate private **8-character random progress key** have different roles.
- A new learner can create a private progress account on their first computer, even with zero progress, then enter that same key on a different computer to retrieve changes.
- A private key uses the existing Firebase Email/Password auth service and an internal reserved example.com pseudonymous identifier. There is **no Google sign-in requirement in this flow** and **no recoverable email inbox**.
- The 8-character base32 key has approximately 40 bits of entropy **only when generated randomly**. It is a compromise versus a long secret. The original PIN and predictable/reused keys must not authorise progress. An exposed key must be retired by migrating to a new account, after the data migration flow is independently tested.
- Browser-session auth expires when the session ends. School/shared machines should still be explicitly signed out of and should not use Remember this device on the website gate.

## Account/platform prerequisites (admin-only)
1. In **Firebase console → Authentication → Sign-in method**, verify Email/Password enabled for project `revision-loop-cloud` (do not enable email-link/passwordless unless required separately).
2. Check Email enumeration protection and authentication abuse protections. Verify any password policy permits the derived internal password format, but do not relax global protections to accommodate this feature.
3. Verify the **actually deployed** Firestore security rules: every read/write under `users/{uid}` requires `request.auth.uid == uid`; versioned state updates must be sequential; history is append-only. The checked-in `firestore.rules` document explicitly says it is NOT DEPLOYED: a matching file is not proof of deployed rules.
4. Check Firebase auth authorised domains and quota/billing limits. No paid upgrade should be required merely to make this feature work; report any paid prerequisite before proceeding.
5. Confirm the final Vercel exact-head preview is READY, not only a previous branch head. The free-plan build-rate limit is an outstanding blocker.

## Synthetic two-browser acceptance test (NEVER use actual learner data)
- A: start with clean browser storage. Unlock website PIN. Generate a new key, copy it into a secure temporary test record, choose **Set up key with this device's progress**. Expect Firebase account creation plus revision 1 in Firestore. Confirm a JSON recovery download, and status says private-key account connected.
- A: complete one mock flashcard and one scored exam question. Check visible XP, reviews, purchases and results; wait until status confirms cloud saved.
- B: in a different browser profile with fresh storage, unlock website, enter the same key and choose **Load progress using key**. Expect exactly A's saved XP, answers, progress and settings after automatic restore. Reopen browser and repeat key sign-in.
- B: revise another card and check cloud-saved status. Return to A after it has no unsaved answer: expect newer revision to arrive without losing A's data.
- Confirm browser-session sign-in is not persistent across a fresh browser session on shared machines.
- Confirm wrong/short key cannot read another account. An empty new key must not silently load another account. Existing Google cloud account remains separate.
- C: a browser with an existing local exam answer or purchased location must **not** be overwritten automatically; it must present deliberate review/backup. Cloud revisions changing concurrently must pause sync rather than overwrite.
- Switch from offline to online and test that local work is not lost. Test failed initial Firestore upload and a post-upload checkpoint failure separately: the former may remove only the just-created empty auth account; the latter MUST keep the uploaded cloud account.
- A fresh computer must not require Google sign-in. First account creation should happen only after the user's explicit setup action, not merely entering the website PIN.

## Build/test gates
- `node tests/private-key-auth-v436.cjs`
- `node tests/cloud-seamless-v435.cjs`
- `node tests/cloud-sync-v119.cjs`
- `node tests/revision-backup.cjs` (if present)
- Existing v428 mobile/cloud regression workflow, v436 dedicated regression, and any required baseline CI.
- Check desktop and 360px/390px Chromium for clickability, keyboard focus, cropped fields, reload, and offline cache update.
- Ensure the final test SHA matches the exact PR head. A stale green run does not approve a newer commit.

## Known limitations
- The key is an account credential, not end-to-end encryption. Firebase project administrators and the existing app's data model still control storage.
- There is no self-service forgotten-key recovery because the pseudonymous address has no inbox.
- Email/password provider and deployed Firestore rules cannot be verified by inspecting repository source alone.
- Function-level simulations do not prove real Firebase authentication or Firestore permission behaviour. A successful static syntax test or Vercel preview **does not prove** that real Firebase authentication, Firestore writes or two-device sync work.
- Firebase project configuration and currently deployed rules have not yet been verified using an authenticated Firebase administration connection.
- Latest Vercel production deployment remains v433; the new private-key branch must not be treated as live.

Merge order: v435 (#404) and then v436 (#405), with fresh exact-main integration tests at each step.