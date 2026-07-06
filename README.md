# Muballigha Website

Landing page for the **Online Muballigha Course** — a certified, women-only online
course teaching Quran Recitation, Tajweed, Surah Memorisation, Hadees, Fiqh and
Akhlaq in Tamil, run by Shahanaz Begam Islamic Academy.

Deployed on Netlify (https://shahanazacademy.netlify.app) using Netlify Forms,
Functions, Blobs, and Identity for the review moderation flow.

```
index.html                          page markup
assets/style.css, assets/app.js     styling + interactivity
admin/reviews.html, assets/admin.js login-gated review moderation page
netlify/functions/                  serverless functions (see below)
```

## Run locally

```
python3 -m http.server 8000
```

Then open http://localhost:8000. Note: the review submission/moderation
flow depends on Netlify Functions, Blobs and Identity, none of which are
available from a plain local server — it only works once deployed.

## How reviews work

1. A visitor submits the "Write a Review" form on the main page. Netlify
   Forms captures it and automatically invokes
   `netlify/functions/submission-created.js`, which stores it as **pending**
   in Netlify Blobs.
2. You get an email notification (Site configuration → Forms → Form
   notifications) that a new review is waiting.
3. Log in at `/admin/reviews.html` with your Netlify Identity account to see
   all pending reviews and **Approve** or **Reject** each one.
4. Approved reviews move into a public "approved" list, served by
   `netlify/functions/reviews-public.js`. The main page fetches from there
   directly — no rebuild or redeploy needed for a review to go live.

### One-time Netlify dashboard setup

- **Forms**: already enabled ("Enable form detection").
- **Identity**: Site configuration → Identity → Enable Identity, then set
  registration to **Invite only** (important — otherwise anyone could
  self-register and get access to the moderation page). Then Identity →
  Invite users → invite your own email.
- Accept the invite email, set a password, then log in at
  `/admin/reviews.html`.

## To do before launch

- Replace the placeholder WhatsApp number (+91 99522 60891) if it changes.
- Add real fee/duration details if you decide to display them instead of
  "contact for details".
