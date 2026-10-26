# Revision Loop — cloud saving and Google sign-in (planning and safety)

**Status:** foundation only, NOT enabled on the live site. The existing PIN, offline learning progress, shop purchases, photo galleries and automatic browser saves must keep working unchanged until a Firebase project is configured and migration tests pass.

## Intended student experience

1. Google sign-in happens **on Revision Loop**, not in GitHub.
2. A Google account is required **only to enable cloud sync**. Local-only use remains available during the transition.
3. The present four-digit PIN is a shared client-side access gate (the source includes its verifier), **not a private user identity**. It must not protect cloud data or decide Firestore permissions. In the eventual UX it can be replaced with an optional device-only screen lock.
4. A device that has saved work should first **Download progress backup** from Progress. On first Google sign-in, the app must show exactly what it will upload and obtain explicit confirmation. It must never automatically overwrite non-empty cloud progress.
5. On another device, Google sign-in restores data only after checking for conflicting locally saved progress and offering a non-destructive merge or choosing a backup. Never silently select the newer full snapshot just by timestamp.
6. Keep manual JSON download and restore as an independent escape hatch. The initial cloud-sync build must not disable it.

## Three existing persistent storage keys (do not rename or clear)

- `revisionLoopProgress5` — learning history and spaced repetition.
- `revisionLoopProfile11` — XP, points, owned locations, purchased characters/outfits, achievements, exam results and other profile fields.
- `revisionLoopSettings11` — revision preferences.

The current `progress-backup.js` exports exactly these keys and validates before restoration. Do not upload `rl_auth`, the PIN, Firebase auth credentials, tokens, or optional caches (such as image thumbnails) to Firestore.

## Proposed Firestore layout

- `users/{uid}/state/progress`: `{payload: JSON string, revision: integer, updatedAt: serverTimestamp}`
- `users/{uid}/state/profile`: same shape
- `users/{uid}/state/settings`: same shape
- `users/{uid}/history/{snapshotId}`: immutable per-segment snapshots, each with `segment`, `payload`, `baseRevision`, `createdAt`. Retention should be bounded in app code once recovery policy is agreed.

`firestore.rules` restricts reads and writes to the authenticated Firebase UID. Writes to current state must increment the revision to avoid accepting stale snapshots. A write rejected because its revision is old must fetch remote state and request/perform a tested merge, **not** discard or overwrite progress. Firebase's built-in last-write-wins behaviour is not sufficient on its own for XP and exam history.

Check actual data sizes before enabling this: **Cloud Firestore documents cannot exceed 1 MiB**. Large keys may need to be partitioned further, while maintaining backwards-compatible browser saving.

## Setup action needed from the project owner

1. Save a downloaded JSON backup from Revision Loop's Progress tab, plus a second copy.
2. Review Google/Firebase developer service terms and eligibility. If the intended project owner cannot accept them (including any age requirements), use an eligible adult as owner; do not misstate age.
3. At https://console.firebase.google.com/ create a Firebase project, e.g. *Revision Loop Cloud*. Google Analytics can be left off.
4. Register a **Web** application called *Revision Loop* (Firebase Hosting is not required; the website stays on GitHub Pages).
5. Firebase Console -> Authentication -> Sign-in method -> **Google** -> Enable; add `jonivar345-debug.github.io` to Authentication -> Settings -> Authorized domains as needed.
6. Firebase Console -> Firestore Database -> Create database in production/locked mode, choose a suitable region, and publish the reviewed `firestore.rules` using the console or authenticated deployment.
7. Share **only the web app's normal Firebase configuration object** (`apiKey`, `authDomain`, `projectId`, `appId`, and similar public browser config). This is public app configuration, **not** an admin/service-account private key. Never upload a service-account JSON file, passwords or tokens.
8. Implement/test Firebase client, import preview, merge algorithm, conflict handling, offline re-connect, periodic history snapshots, cross-device restore and clear status UI on a development branch. Then test with two browsers and an intentionally interrupted sync. Only merge after World, browser and marking suites pass.

## Release acceptance checks

- Live v118 baseline remains unchanged until a reviewed and tested release.
- Existing local browser progress, PIN behaviour, points and purchases survive upgrade, failed sign-in, denied permissions, failed writes, offline use and return online.
- First sign-in on a device with substantial local work does NOT overwrite a populated cloud profile.
- Devices cannot read/write another user's Firestore documents.
- Conflicting writes fail safely and preserve both recoverable versions until reconciled.
- Blank browser restores backed-up values only for an explicitly signed-in account.
- No network service is contacted for local-only users.
- Google account sign-out must not delete local progress. A device's locally saved data should not be exposed to a different signed-in account.
- JSON export/restore remains fully functional.
- Validate Chrome and mobile; test Firebase rules with the emulator before enabling writes.

**Do not mark cloud sync or automatic online backup as completed merely because these foundation files exist.**