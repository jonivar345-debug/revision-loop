# Revision Loop: private AI handwriting marking

The optional AI feature can read a photographed solution directly and suggest
marks for each AQA-style marking point. It can credit valid working even when a
final answer is wrong. It is **not an official AQA examiner**. Every point is
editable before the result is saved.

## Deployment status

The GitHub Pages website is public static hosting. It cannot safely keep an
OpenAI API key. The backend in `api/vision-mark.mjs` is designed to run as a
separate private-access Vercel serverless function.

The AI option will remain **unconfigured** until the owner connects Vercel and
sets up their own API service. Local OCR, flashcards and exam questions continue
working without the AI service. Do not put credentials in GitHub, the website's
JavaScript, or a chat message.

## Complete the private setup

1. Connect a Vercel account that has permission to import the existing
   `jonivar345-debug/revision-loop` GitHub repository.
2. Create a Vercel project from this repository, keeping the repository root as
   the project root and using the standard static/Other framework settings.
   The `api/vision-mark.mjs` server function should be available at
   `https://<your-project>.vercel.app/api/vision-mark`.
3. In **Vercel → Project → Settings → Environment Variables**, configure the
   following server-only environment variables:
   
   | Name | Value |
   | --- | --- |
   | `OPENAI_API_KEY` | A private API key held by the account managing API billing |
   | `VISION_ACCESS_TOKEN` | A **separate**, long random private passphrase (24+ characters) |
   | `FRONTEND_ORIGIN` | `https://jonivar345-debug.github.io` (default if omitted) |
   | `VISION_MODEL` | Optional; defaults to `gpt-4.1-mini` |

4. Redeploy the Vercel project after adding these variables. If API billing
   requires an adult account-holder, have a parent or guardian manage that
   setup. ChatGPT subscriptions do not automatically include API usage.
5. Open the Revision Loop GitHub Pages site, start an exam question, and attach
   a photograph. Open **Connect private AI marking service** and enter the
   deployed `https://…vercel.app/api/vision-mark` address and
   `VISION_ACCESS_TOKEN` passphrase. The website keeps these details in
   browser *session storage* for the current tab only.
6. Press **Mark photographed working with AI**. The photo is transmitted only
   after this explicit action. Review the detected calculations and
   individual marking points before saving your score.

Never use the public four-digit Revision Loop entrance code as the private AI
passphrase. The entrance code is embedded in a public static website and
**does not provide server-side protection** for a paid model endpoint.

## Privacy, security and cost

- The OpenAI API key remains on the Vercel server, not inside the browser.
- The separate AI access passphrase is transmitted only to your HTTPS Vercel
  endpoint after you choose AI marking; it is not committed to GitHub.
- The server accepts only requests from the configured website origin in
  normal browsers, requires the private passphrase, checks file types and
  sizes, and rejects malformed scoring instructions.
- Photos are transmitted to Vercel and the AI provider for this request.
  The function requests `store:false` and deliberately does not log image
  contents. The AI provider's applicable data processing policies still apply.
- The function accepts up to three photos of approximately 1.85 MB each per
  question. Crop around the writing for the clearest results.
- **Each model request may cost money.** Set appropriate usage and spending
  limits in the provider's account and Vercel project before making it
  available. The current function does not have a durable distributed
  rate-limiting database, so a strong private passphrase and provider-side
  limits are particularly important.
- The AI returns provisional suggested marks. It must provide supporting
  evidence for each credited marking point, but it may misread handwriting.
  Confirm or correct every mark before saving.
- Existing local OCR remains available if the backend is missing, unavailable,
  unauthorised or unaffordable.

## Testing

GitHub Actions runs the existing 1,169 model-answer regressions, OCR review
checks, plus synthetic API validation and browser integration tests.

```bash
node tests/scanner-regression.cjs
node tests/photo-review-regression.cjs
node tests/vision-backend-regression.mjs
node tests/vision-client-regression.cjs
```

The tests **do not** contact a real AI provider, verify live billing or prove
teacher-equivalent accuracy on real handwriting. Those checks still need a
configured deployment and representative photographed exam solutions.
