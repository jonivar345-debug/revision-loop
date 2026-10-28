## v167: broader valid-answer marking (proposed, awaiting tests)

The free local checker now supports **question-specific accepted alternative explanations** alongside the original marking points. An alternative is recognised only when a substantial, vetted phrase appears in the student's typed answer. A shared isolated number or keyword is not enough, and restrictive source-verified evidence rules take priority.

The marking panel shows **the weight of each mark point**, examples of accepted alternative wording, and, on selected questions, an **error-carried-forward note**. These notes are guidance for checking demonstrated method, not permission to give an incorrect final value full marks. The free ChatGPT Plus hand-off includes the same evidence and ECF guidance.

The **manual total-score override** now displays a warning when it differs from the ticked mark points. Changing the total does not pretend that the individual method criteria were ticked. Always compare your answer and calculation steps with the criteria before saving.

This first release adds 20 vetted alternative phrasings across 8 original AQA-style questions, not to every question. Other valid correct solutions may still need a manual tick or score correction. Handwritten OCR is experimental, particularly for equations and diagrams; the student remains responsible for confirming any transcription and provisional score.

---

# Free-first marking in Revision Loop (v51)

The public site is still on GitHub Pages. The established local scanner,
typed-answer checker, mark-point review, flashcards, questions, and progress
tracking continue to work without OpenAI API billing.

## Default: free local marking
1. Open an exam question.
2. Type an answer, or attach and crop a photo.
3. Press **Mark my answer (free local checker)**.
4. If a photo was used, check the recogniser's editable transcription.
   Correct symbols and press **Confirm transcription and suggest marks**
   when prompted.
5. Review every mark-point checkbox and **Save** the final mark.

Tesseract OCR is intended for printed text and can misread mathematical
handwriting. Its confidence scores do not guarantee mathematical accuracy.
Always check the original photo.

## ChatGPT Plus hand-off: no API calls from the site
1. Expand **Mark with ChatGPT Plus — free hand-off**.
2. Press **Copy marking instructions**.
3. Press **Open ChatGPT**.
4. Manually attach the answer photograph in ChatGPT and paste the copied
   question, mark points, and marking instructions.
5. Copy ChatGPT's final `POINTS: 1,0,...` line and paste it into the
   website.
6. Press **Import suggested marks for review**.
7. Review and correct each mark-point checkbox, then save.

Photographs are NOT sent to ChatGPT automatically. Neither the copying
nor the import calls the paid OpenAI API; ChatGPT use is within the
user's ChatGPT account and plan limits.

## Paid model requests: disabled by default

The Vercel vision endpoint remains available for private-session
management and free account diagnostics, but actual paid photo-marking
requests return HTTP 403 unless the eligible account owner explicitly
sets `ENABLE_PAID_VISION_MARKING=true` as a Production environment
variable AND redeploys. That opt-in is not currently configured.

The paid button is hidden inside **Paid API photo marking — off by
default** and also requires a deliberate on-page acknowledgement.
A remembered private token is NOT sufficient to enable paid calls.

## Fully local handwriting AI: experimental only

A separate expandable panel lets the user voluntarily try an on-device
handwriting model, with explicit large-download consent. It loads the
public Transformers.js runtime and **Xenova/trocr-small-handwritten**
weights on demand. Photos are passed as local data URLs to browser
inference rather than uploaded to a paid AI endpoint. Downloads of the
library and model require internet and could fail; caching and offline
reuse depend on browser storage. It is **not the default**.

- TrOCR small handwritten: suited to short lines of handwritten
  *ordinary text*. A complete multi-line exam solution, graphs, formulas,
  and diagrams are not reliable input to this model.
- Math-specific ONNX TrOCR model
  `onnx-community/latex_finetuned-ONNX`: research option for one
  handwritten mathematical expression, not full answers. It requires
  large model downloads, so it is not installed by default.
- Normal local OCR remains the recommended fallback. Experimental
  output is placed into an editable **draft**, not automatically marked.
  The user must confirm it before any score is suggested.

References:
- https://github.com/naptha/tesseract.js/blob/master/docs/faq.md
- https://huggingface.co/Xenova/trocr-small-handwritten
- https://huggingface.co/onnx-community/latex_finetuned-ONNX
- https://huggingface.co/docs/transformers.js/guides/webgpu

No live-device handwriting accuracy benchmark has been claimed or
completed. Browser model support and photo quality vary considerably.
