# Muballigha Website

Landing page for the **Online Muballigha Course** — a certified, women-only online
course teaching Quran Recitation, Tajweed, Surah Memorisation, Hadees, Fiqh and
Akhlaq in Tamil, run by Shahanaz Begam Islamic Academy.

Deployed on Netlify (https://shahanazacademy.netlify.app) using Netlify Forms,
Functions, and Blobs for the reviews feature.

```
index.html                          page markup
assets/style.css, assets/app.js     styling + interactivity
netlify/functions/                  serverless functions (see below)
```

## Run locally

```
python3 -m http.server 8000
```

Then open http://localhost:8000. Note: the review submission flow depends on
Netlify Functions and Blobs, which aren't available from a plain local
server — it only works once deployed.

## How reviews work

Like a typical Google-style review widget: a visitor submits the "Write a
Review" form (name, star rating, text) on the main page. Netlify Forms
captures it and automatically invokes
`netlify/functions/submission-created.js`, which stores it directly in
Netlify Blobs — no approval step. The main page fetches the current list
from `netlify/functions/reviews-public.js` on load, so a new review shows up
immediately for the next visitor, with no rebuild or redeploy needed.

There's no moderation queue, so anything submitted goes live right away
(basic bot spam is still filtered by Netlify Forms' built-in honeypot field).

## To do before launch

- Replace the placeholder WhatsApp number (+91 99522 60891) if it changes.
- Add real fee/duration details if you decide to display them instead of
  "contact for details".
