# Revision Loop: private AI handwriting marking

The optional AI feature can read a photographed solution directly and suggest
marks for each AQA-style marking point. It can credit valid working even when a
final answer is wrong. It is **not an official AQA examiner**. Every point is
editable before the result is saved.

## Deployment status (21 October 2026)

The private Vercel backend is deployed on the verified production endpoint:

`https://revision-loop-jonivar345-5189.vercel.app/api/vision-mark`

All three required **Production** environment variable names have been confirmed
present: `OPENAI_API_KEY`, `VISION_ACCESS_TOKEN` and `FRONTEND_ORIGIN`. The
values themselves were neither read nor exposed. The production deployment is
configured so the public endpoint is reachable, while every real marking
request is protected by the separate private bearer passphrase.

A live public smoke test passed:
- OPTIONS preflight is accepted by the configured GitHub Pages origin;
- unauthenticated POST is rejected with HTTP 401 before any AI request;
- GitHub marking and API validation tests also pass.

**The live OpenAI model has not yet been exercised using a genuine handwritten
photo.** A successfully saved API key does not establish that billing, model
access or every handwritten marking request works.

### Finish the connection on your phone

1. Open [Revision Loop](https://jonivar345-debug.github.io/revision-loop/) and
   open an exam question.
2. Add a photograph of your answer.
3. Expand **Connect private AI marking service**. The backend URL is already
   filled in and cannot be redirected to an unknown host.
4. Enter the **original passphrase** saved privately as
   `VISION_ACCESS_TOKEN` (never enter `OPENAI_API_KEY` or the four-digit
   Revision Loop entrance PIN).
5. Press **Use these settings in this tab**, then **Test connection (no AI
   charge)**. This sends deliberately invalid question data to verify the
   private passphrase and does **not** send a photo or invoke the model.
6. Once the test succeeds, press **Mark photographed working with AI** to send
   your photo for a provisional score. Check each individual method mark before
   saving it.

Keep the original `VISION_ACCESS_TOKEN` value in a password manager. Vercel
sensitive environment values might not be readable after being saved; if it
is lost, an authorised account-holder should **rotate it in Vercel** rather
than pasting a key into GitHub or a chat.

ChatGPT subscriptions do not include OpenAI API billing. An eligible adult
managing the API account should confirm model access and set a suitable API
spending limit before testing photographs.

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
