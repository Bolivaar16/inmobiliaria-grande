# Inmobiliaria Grande — Website Prototype

Commercial prototype of a new website for Inmobiliaria Grande, a real-estate agency in Granada, Spain, founded 1970. Static bilingual (ES/EN) site, generated from data, with real property listings and an audit report for the agency owner.

**Status**: prototype only, not yet approved by the client. Contains real property listings and brand materials belonging to a third party. This repository must remain private; nothing may be deployed or published publicly without explicit written approval from the owner.

## Design

The site follows design direction **"1b Galería"** from the private Claude Design canvas (dark indigo/violet, pill components, floating search bar) combined with the **serif typography of direction "1a"** (Playfair Display headings). Canvas: https://claude.ai/design/p/5556b49e-e8b8-4993-b410-16f1bf3e09d4

The full system (palette, type, components) is documented in `docs/BRAND.md`. `docs/DESIGN-PLAN.md` is the original plan; its visual rules are superseded (see the note at its top) but its accessibility and testing sections still apply. Earlier artboards (a different, indigo/red direction) are in `design/artboards/` for history only.

## Repository layout

- **src/es/\*.html, src/en/\*.html** — page sources. Each starts with a `<!--@page {...}-->` JSON header (title, description, active nav item, language-twin path) and is assembled by `scripts/build.mjs` into the final page at the repo root (`es`) or under `en/` (`en`).
- **templates/partials/es/, templates/partials/en/** — shared `head.html` / `header.html` / `footer.html`, per language.
- **templates/listing.es.html, templates/listing.en.html** — the property-detail page, filled per listing.
- **scripts/scrape-listings.py** — reads listing pages from the live site and prints the prototype's JSON. Parses only the page's own `<section id="modulo-fichapropiedad">`; the surrounding carousels advertise other properties and page-wide matching returns their prices.
- **scripts/fetch-photos.py** — takes that JSON, downloads up to `MAX_PHOTOS` images per listing and writes the six derivatives per photo into `assets/photos/<id>/`.
- **scripts/build.mjs** — generates every page: `index.html`, `inmuebles.html`, …, `en/index.html`, `en/properties.html`, …, `inmuebles/<slug>.html` + `en/properties/<slug>.html` per listing, and `sitemap.xml` (with `hreflang` alternates). Run after editing anything in `src/`, `templates/`, or `data/`.
- **scripts/check.sh** — static checks on the generated site (one `<h1>` per page, no `href="#"`, unique titles/descriptions, `alt` + dimensions on every image, lazy-loading, no external scripts, internal links resolve, no secrets, production files present). Run after `build.mjs`.
- **data/listings.json** — all property data, the single source for the generated pages.
- **data/i18n.json** — English UI strings, per-type translations, and per-listing English title/headline overrides (the long `description` stays Spanish, `lang="es"`, on English pages too).
- **css/styles.css** — single CSS file (design tokens, fonts, layout, every component, responsive).
- **js/main.js** — ES-module entry point (`<script type="module">`), no dependencies, no bundler. It imports one initialiser per feature from **js/modules/**: `nav.js` (mobile nav, sticky home header), `lists.js` + `storage.js` (favourites/dismissed/viewed in `localStorage`), `filters.js` (listing filters + tabs + sort + pagination, 9 per page), `cookies.js` (necessary + optional Google Maps), `forms.js` (validation with visible per-field errors), `gallery.js`, `share.js` (native share, clipboard fallback), `mortgage.js`. Each returns early when its nodes are absent.
- **assets/photos/<id>/N.jpg, N-s.jpg** — full-size (1400×933) and medium (640×426) photos per listing, scraped from the current site. Each also has `.webp` (same size, q78), `-m.webp` (1024w, q72, mid breakpoint) and `-s.jpg`'s `-t.webp` (240w, q68, gallery-thumbnail size). `<picture>` serves WebP first; the JPEGs are the fallback for the ~0% of browsers without WebP support — some of those fallbacks are still >200 KB (`scripts/check.sh`'s sibling in the `web-production` skill flags this; it does not know about `<picture>`).
- **assets/fonts/** — self-hosted variable fonts (Playfair Display, Libre Franklin, JetBrains Mono), latin subset, woff2.
- **assets/team/**, **assets/hero-oficina.\***, **assets/grupo-inmobiliario-granada.\*** — team portraits (cropped 3:4), the office photo, and the "Grupo Inmobiliario de Granada" banner, all taken from the client's current website.
- **assets/hero-granada.\*** — the image behind the home hero (1280×854). **AI-generated** (Higgsfield, Nano Banana Pro, 2026-09-03): Albaicin rooftops with the Alhambra at dusk. A prototype placeholder, not a real photograph and not the agency's office; it must be replaced with a real photo, or explicitly approved and labelled as an illustration, before any deployment. The previous office photo is kept in `assets/hero-oficina.*`.
- **assets/vendor/leaflet/** — Leaflet 1.9.4, self-hosted, loaded by `js/map.js` only when the home-page map scrolls into view. Tiles come from tile.openstreetmap.org (the only external request on the site besides the consent-gated Google Maps embed on the contact page).
- **data/geo.json** — approximate coordinates per listing (neighbourhood/municipality centre) for the home map; the source site publishes no exact positions.
- **.github/workflows/pages.yml** — publishes the generated site (without sources, docs or design files) to GitHub Pages for prototype previews.
- **assets/brand/** — emblem/rosette, favicons, `site.webmanifest`.
- **docs/BRAND.md** — current design system (tokens, type, components, logo, contact data).
- **docs/DESIGN-PLAN.md** — original plan; superseded on visuals, see the note at the top.
- **docs/PENDIENTES.md** — every `[DATO A CONFIRMAR]` / `[FOTO A CONFIRMAR]` in the site, listed with why.
- **docs/audit/redesign/** — Lighthouse JSON and full-page screenshots (1440 + 375 px, ES + EN) from the last verification pass.
- **docs/informe/**, **docs/audit/evidence.md** — the original audit report and evidence on the *current* live site (not this prototype).
- **docs/competidores/** — competitor study; its "opportunities" section drove the "Desde 1970" positioning and copy.
- **_headers** — Netlify cache-control hints for fonts/photos/css/js.
- **netlify.toml** — `pretty_urls = false` (so `inmuebles.html` and `inmuebles/` don't collide) and a catch-all redirect to `404.html` with a real 404 status.

## Run locally

```bash
node scripts/build.mjs   # regenerate every page from src/, templates/, data/
bash scripts/check.sh    # static checks (must print ALL CHECKS PASSED)
python3 -m http.server 8000
```

Then open http://localhost:8000/ (Spanish) or http://localhost:8000/en/index.html (English).

## Deploy

- **Netlify**: publish directory is `.` (project root); no build command (pages are pre-generated and committed). `netlify.toml` + `_headers` are already set up. Forms use Netlify Forms (`data-netlify="true"` + honeypot on every form).
- **Vercel**: static site, no build command needed; deploy the folder as-is (the `_headers`/`netlify.toml` conventions won't apply — add Vercel's equivalents if deploying there).

**Important**: deployment has not been done. It requires the client's explicit written approval and access to their domain. Do not deploy without authorization. Before deploying, resolve every item in `docs/PENDIENTES.md`.

## Editing listings

All property data lives in `data/listings.json`. To add or update a listing:

1. Add or modify an entry in the JSON array — see the field list that was already documented here (id, ref, slug, title, headline, type, operation, zone/city/province, price, surfaces, rooms/baths, condition, year_built, status, features, description, energy, photos, photo_count_on_source, source_url, source_fetched_at).
2. Add its English title/headline to `data/i18n.json` under `listings.<id>` (optional — falls back to `"<Type> in <Zone>, <City>"` if omitted).
3. Upload photos to `assets/photos/<id>/`: full-size `N.jpg` (≈1400×933) and medium `N-s.jpg` (≈640×426). Generate the WebP siblings:
   ```bash
   for f in assets/photos/<id>/*.jpg; do
     convert "$f" -quality 78 "${f%.jpg}.webp"
   done
   for f in assets/photos/<id>/*.jpg; do  # skip the -s ones for this ffirst loop
     [[ "$f" == *-s.jpg ]] || convert "$f" -resize 1024x -quality 72 "${f%.jpg}-m.webp"
   done
   for f in assets/photos/<id>/*-s.jpg; do
     convert "$f" -resize 240x -quality 68 "${f%-s.jpg}-t.webp"
   done
   ```
4. Regenerate and check:
   ```bash
   node scripts/build.mjs && bash scripts/check.sh
   ```
5. Commit the JSON, the photos (all four variants), and the generated HTML files.

## Brand

`docs/BRAND.md` is the source of truth for palette, typography and components. The emblem (`assets/brand/rosette.png`) is a cleaned crop of a photographed business card, not a vector — production needs the client's vector file. The wordmark is set in text (no logo file), so it never blurs or needs re-export.

## Audit report (current live site, not this prototype)

A comprehensive audit report (Spanish: *informe-inmobiliaria-grande*) evaluates **the client's existing website**, not this redesign:
- **docs/informe/informe-inmobiliaria-grande.md/.pdf** — report source and PDF (Pandoc + Typst, consulting-proposal template)
- **docs/audit/evidence.md**, **docs/audit/\*.json, \*.png** — Lighthouse results and screenshots of the current site

Regenerate the PDF with `generar-pdf docs/informe/informe-inmobiliaria-grande.md` (requires the `generar-pdf` skill).

This prototype's own verification (Lighthouse on the redesign, screenshots of every page) is in `docs/audit/redesign/`.

## Data provenance and privacy

All property listings were scraped (read-only) from https://www.inmobiliariagrande.com/ on 2026-09-03 with `scripts/scrape-listings.py`, and their photos with `scripts/fetch-photos.py`. Each entry includes its `source_url` for verification. This prototype ships 23 of the listings on the live site (which had ~276 on that date; the site copy says "+250" so the claim does not go stale), with 10 photos each; the rest is a re-run of those two scripts, not a design task. Phone numbers on the site are the office landline and 622 350 918 only — no personal staff mobiles (see docs/PENDIENTES.md).

This data and the brand materials belong to Inmobiliaria Grande and are protected. Do not republish, redistribute, or deploy the site publicly without explicit authorization from the owner.

## Known placeholders

`docs/PENDIENTES.md` lists every `[DATO A CONFIRMAR]` / `[FOTO A CONFIRMAR]` marker in the site — invented figures from the design mockup (300 properties, 17 languages, 3 generations, 48-hour valuation), team photos, legal entity data, and the office hours (sourced from a directory, not the client). Verify all of them before deployment approval; `grep -rn "A CONFIRMAR" src/ templates/` finds every instance in the sources.
