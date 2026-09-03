# Inmobiliaria Grande — Website Prototype

Commercial prototype of a new website for Inmobiliaria Grande, a real-estate agency in Granada, Spain, founded 1970. Includes a visual design mockup, fully functional property listings (HTML + CSS), and an audit report for the agency owner.

**Status**: prototype only, not yet approved by the client. Contains real property listings and brand materials belonging to a third party. This repository must remain private; nothing may be deployed or published publicly without explicit written approval from the owner.

## Design canvas

Visual design (artboards for homepage, listings, property details, contact form, mobile variants) lives in a private Claude Design canvas:
https://claude.ai/code/artifact/7077f4a1-cb5d-43d2-b0ac-b8e29bd5f0ec

Artboard sources (exported as `.dc.html`) are in `design/artboards/`.

## Repository layout

- **index.html, inmuebles.html, contacto.html, sobre-nosotros.html, vende-tu-casa.html, aviso-legal.html, privacidad.html, cookies.html** — page templates
- **inmuebles/** — generated property detail pages (one `.html` file per listing)
- **sitemap.xml** — generated XML sitemap
- **css/styles.css** — single CSS file (color tokens, typography, layout, responsive)
- **js/main.js** — minimal JS: mobile menu, listing filters, cookie banner and form validation (forms still submit without JS)
- **scripts/build-listings.mjs** — Node.js script that generates `inmuebles/*.html` and `sitemap.xml` from `data/listings.json` and `templates/listing.html`
- **templates/listing.html** — plain HTML template with `{{TOKEN}}` placeholders for the property pages (no template engine)
- **data/listings.json** — all property data, the single source for the generated pages
- **assets/photos/<id>/N.jpg, N-s.jpg** — full-size and thumbnail photos for each listing
- **assets/brand/logo.png** — brand logo (cleaned crop from photographed business card, not a vector)
- **docs/BRAND.md** — color palette, typography system, contact data
- **docs/informe/informe-inmobiliaria-grande.md/.pdf** — audit report (Spanish, client-facing)
- **docs/audit/** — evidence: Lighthouse JSON, screenshots, audit notes
- **design/** — design mockups and artboard sources

## Run locally

Start any static HTTP server in the project root:

```bash
python3 -m http.server 8000
```

Then open http://localhost:8000/ in your browser. All pages and listings are pre-generated and ready to serve.

## Deploy

The site is ready for static hosting:

- **Netlify**: publish directory is `.` (project root); `netlify.toml` is configured with `pretty_urls = false` so `inmuebles.html` and the `inmuebles/` directory do not collide. Forms use Netlify Forms backend.
- **Vercel**: static site, no build command needed; deploy the folder as-is.

**Important**: deployment has not been done. It requires the client's explicit written approval and access to their domain. Do not deploy without authorization.

## Editing listings

All property data lives in `data/listings.json`. To add or update a listing:

1. Add or modify an entry in the JSON array with these fields:
   - `id` (unique identifier), `ref` (internal reference code), `slug` (URL-safe slug)
   - `title`, `headline` (short marketing text)
   - `type` (e.g. "Piso", "Ático Dúplex", "Pareado")
   - `operation` ("venta" or "alquiler")
   - `zone`, `city`, `province`
   - `price` (in EUR)
   - `surface_built_m2`, `surface_useful_m2`, `plot_m2` (nullable)
   - `rooms`, `baths`
   - `condition` (e.g. "Seminuevo", "Entrar a vivir")
   - `year_built`
   - `status` ("disponible", "reservado", etc.)
   - `features` (array of strings: "Balcón", "Terraza", "Ascensor", etc.)
   - `description` (array of paragraphs for detailed text)
   - `energy` (object with `consumption_kwh_m2_year` and `emissions_kg_co2_m2_year`, nullable)
   - `photos` (array of objects: `src`, `thumb`, `alt`)
   - `photo_count_on_source` (info only, for the audit)
   - `source_url` (original listing URL)
   - `source_fetched_at` (YYYY-MM-DD)

2. Upload photos to `assets/photos/<id>/`:
   - Full-size: `1.jpg`, `2.jpg`, etc.
   - Thumbnails: `1-s.jpg`, `2-s.jpg`, etc. (e.g. ~300px width, JPEG 75% quality)

3. Regenerate the listing pages and sitemap:
   ```bash
   node scripts/build-listings.mjs
   ```

4. Commit both the JSON and the generated HTML files.

## Brand

The brand logo (`assets/brand/logo.png`) is a white-balanced crop of a photographed business card. It is not a vector; production use requires the original vector file from the client.

Brand identity (color palette, typography, contact data) is documented in `docs/BRAND.md`.

## Audit report

A comprehensive audit report (Spanish: *informe-inmobiliaria-grande*) is prepared for the client, including:
- Visual design review and usability assessment
- Performance metrics (Lighthouse scores on desktop and mobile)
- Accessibility compliance (WCAG 2.1 AA)
- SEO and technical recommendations

Files:
- **docs/informe/informe-inmobiliaria-grande.md** — report source (Markdown)
- **docs/informe/informe-inmobiliaria-grande.pdf** — final report (PDF via Pandoc + Typst, template: consulting-proposal)
- **docs/audit/evidence.md** — detailed audit notes and findings
- **docs/audit/*.json, *.png** — Lighthouse results and screenshots

To regenerate the PDF:
```bash
generar-pdf docs/informe/informe-inmobiliaria-grande.md
```
(requires the `generar-pdf` skill: Pandoc + Typst with consulting-proposal template)

## Data provenance and privacy

All property listings were scraped (read-only) from https://www.inmobiliariagrande.com/ on 2026-09-03. Each entry includes its `source_url` for verification. The agent's name and contact details come from his business card.

This data and the brand materials belong to Inmobiliaria Grande and are protected. Do not republish, redistribute, or deploy the site publicly without explicit authorization from the owner.

## Known placeholders

The following pages contain `[DATO A CONFIRMAR]` markers for data that must be filled in by the owner before any public release:

- **sobre-nosotros.html** — company history, founding facts
- **aviso-legal.html** — CIF (tax ID), legal entity name, office hours
- **contacto.html** — address confirmation, phone/email verification

Verify all placeholders are completed before deployment approval.
