# revision-loop
## Marking and scanning checks

Run `node tests/scanner-regression.mjs` locally after changing answer marking. It checks partial-credit mean calculations, multi-step Maths, Physics internal resistance, Chemistry back titration, numeric false positives and the entire usable bank of model answers. Browser OCR depends on the device, lighting and handwriting; the on-device reader can misread equations, so unclear scans require manual transcription review before marks are suggested.
