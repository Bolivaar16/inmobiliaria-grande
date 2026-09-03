# Audit evidence — www.inmobiliariagrande.com (fetched 2026-09-03, 10:24–10:30 UTC)

All measurements are read-only fetches from this machine (Granada, residential fibre).
Raw Lighthouse JSON: `docs/audit/home-mobile.json`, `docs/audit/ficha-mobile.json`.
Mobile screenshot of the current home at 375 px: `docs/audit/current-home-375.png`.

## Platform

- Built on Inmovilla CRM ("Diseñado por CRM Inmovilla" in footer; `<meta name="author" content="www.inmovilla.com">`).
  Listing photos are served from `fotos15.apinmo.com` (Inmovilla CDN). The 276 listings live in that CRM.
- `curl -sSI https://www.inmobiliariagrande.com/` → `x-powered-by: PHP/5.6.40`, `server: nginx`, `x-powered-by: PleskLin`,
  `cache-control: no-store, no-cache, must-revalidate`. PHP 5.6 reached end of life on 2018-12-31 (php.net/eol.php).
- HTTP → HTTPS redirect works (301 on http://inmobiliariagrande.com/).
- Language negotiation: `curl -sSL https://www.inmobiliariagrande.com/` with no Accept-Language header returns
  `<html lang="en">`, canonical `https://www.inmobiliariagrande.com/en`, English headings ("Recommended", "Properties").
  With `-H "Accept-Language: es-ES"` it returns `lang="es"`, canonical `/es`. Crawlers without the header see the English site.
- 15 language flags in the header (`img/header/bandera_01.png` … `bandera_17.png`), all `<img>` without `alt`.
- The current site still shows the OLD logo (blue box, "GRANDE" wordmark) — see `current-home-375.png`. The 2026 rebranding is not on the web.

## Mobile & performance

### Home, Lighthouse 12.8.2, mobile emulation (Moto G Power, slow 4G throttling)
Command: `npx -y lighthouse@12 https://www.inmobiliariagrande.com/ --chrome-path=/usr/bin/google-chrome --chrome-flags="--headless=new --no-sandbox" --preset=perf --form-factor=mobile --output=json --locale=es`
Fetch time 2026-09-03T10:27:09Z.

| Metric | Value | Score |
|---|---|---|
| Performance | — | **41/100** |
| First Contentful Paint | 2,5 s | 0.66 |
| Largest Contentful Paint | **6,5 s** | 0.08 |
| Total Blocking Time | 470 ms | 0.60 |
| Cumulative Layout Shift | **0,373** | 0.28 |
| Time to Interactive | **11,7 s** | 0.17 |
| Speed Index | 4,2 s | 0.77 |
| Server response time (TTFB) | 710 ms | 0 |
| DOM size | **3 013 elements** | 0 |
| Render-blocking resources | est. saving 1 410 ms | 0 |
| Main-thread work | 5,0 s | 0 |
| JS bootup time | 1,7 s | 0 |
| Total transfer | 1 469 KiB, **115 requests** | |

Transfer by type (bytes): Script 555 537 · Image 419 270 · Font 274 511 · Stylesheet 123 326 · Document 72 443 · XHR 48 476.
Largest single asset: Google reCAPTCHA script 354 KB (loaded on the home although no form is submitted there).
Assets counted in raw HTML (`grep -c '<link rel="stylesheet"'`, `grep -o '<script[^>]*src=' | wc -l`): **23 stylesheets, 19 scripts**
(jQuery 3.5.1 + jQuery UI 255 KB + Revolution Slider 149 KB + carouFredSel + FontAwesome loaded twice, v5.4.2 and v5.15.0).
Raw HTML of the home: 406 477 bytes (`curl -w %{size_download}`), i.e. ~400 KB before any asset.

### Listing page (ficha RGC-0091), Lighthouse 12.8.2, mobile, all categories
Command: `npx -y lighthouse@12 "https://www.inmobiliariagrande.com/ficha/piso/granada/alcampo/8081/29899079/es/" --chrome-path=/usr/bin/google-chrome --chrome-flags="--headless=new --no-sandbox" --form-factor=mobile --screenEmulation.mobile --only-categories=performance,accessibility,seo,best-practices --output=json --locale=es`
Fetch time 2026-09-03T10:28:24Z.

| Category | Score |
|---|---|
| Performance | **26/100** |
| Accessibility | **49/100** |
| SEO | 77/100 |
| Best practices | 96/100 |

| Metric | Value |
|---|---|
| Largest Contentful Paint | **12,0 s** |
| Time to Interactive | **18,5 s** |
| Total Blocking Time | 1 340 ms |
| Cumulative Layout Shift | 0,416 |
| Total transfer | **3 743 KiB, 184 requests** (Script 1,71 MB · Image 1,13 MB · CSS 591 KB · Font 274 KB) |
| DOM size | 1 738 elements |
| Offscreen images loaded eagerly | 41 images, est. saving 628 KiB |
| Modern image formats (WebP/AVIF) | est. saving 177 KiB |
| Render-blocking resources | est. saving 720 ms |

### Photo weight
Listing RGC-0091 has 42 photos at 1920×1280 (`identify`). First 8 full-size photos: 115 727 + 105 632 + 116 108 + 122 694 + 230 413 + 202 132 + 369 716 + 556 213 = **1 818 635 bytes**.
Sum of all 42 full-size photos (`curl -w %{size_download}` loop): **8 924 283 bytes (8,5 MB)**. Thumbnails (`-Ns.jpg`) are 447×300, ~11 KB each. JPEG only; no WebP/AVIF, no `srcset`.

### Responsive behaviour
Screenshot: `google-chrome --headless=new --window-size=375,2400 --screenshot` (`docs/audit/current-home-375.png`).
Observed at 375 px: 15 flag icons in a row at the top; search box overlays the hero slider; the "Alertas" / "Publica tu inmueble"
grey buttons and the "Filtrar por: Vistas / Favoritas / Descartadas" block push the first property below ~1 300 px of scroll.
Lighthouse `meta-viewport` audit FAILS on the ficha: `<meta name="viewport" content="width=device-width, user-scalable=no, maximum-scale=1.0">`
disables pinch-zoom (2 elements flagged). `content-width` audit: not flagged (no horizontal overflow detected by Lighthouse).
Lighthouse `tap-targets`/`target-size`: 1 element flagged too small.

## Local SEO & acquisition

- `<title>` on home, listing index AND 404: `Pisos en Granada | Inmobiliarias Granada | Inmobiliaria G...` — literally truncated with "G..." in the source (`grep -o '<title>[^<]*' home.html`).
- Meta description identical on every page checked (home, /venta/, 404): "Inmobiliaria Grande con multitud de propiedades, pisos , chalet , casas, villas en todas las zonas…".
- Meta keywords tag present (ignored by Google since 2009) with "inmobilien", "real state", "costa".
- Home has **43 `<h1>` elements** (`grep -c '<h1'`): slogan, every carousel card, every listing card.
- Listing `<title>` = the agent's headline verbatim, e.g. `!!GRAN PAREADO EN LA MALAHA!!!`, `4D junto a Camino de Ronda`,
  `Amplia vivienda de 3 dormitorios junto al metro en la zon...` (truncated). No zone/city/price pattern.
- Listing pages carry duplicate `<h1>` ("Te regalamos tu tranquilidad", "Finca rústica orgiva" from the header widget, then the real title, then 1–4 empty "en la localidad de" h1s).
- No JSON-LD / structured data on listings (`grep -c 'application/ld+json'` = 0). No `RealEstateListing`/`Offer` markup, no `LocalBusiness`.
- `robots.txt` present (allows all, crawl-delay 6). `sitemap.xml` present: **1 744 990 bytes**, one URL per listing × 15 languages; sample `lastmod` 2021-12-10.
- Lighthouse SEO (ficha): `crawlable-anchors` fails on 25 anchors (`href="#"` / JS onclick); home has **108 `href="#"`** (`grep -c 'href="#"'`). `link-text` fails on 5 links ("+ INFO").
- Company page (`/seccion/empresa/empresa/es`) text: "equipo profesional Joven y Dinámico… Una agencia joven". The word "1970" does not appear anywhere on the site (`grep -c 1970 home_es.html empresa.html` = 0 outside the property "Antigüedad" field). 55 years of history are invisible.
- No page per zone of Granada (Centro, Zaidín, Chana, Realejo, Albaicín, Ronda…): all listings sit behind the search form; `/venta/` is a paginated list of 276 items with the same title/description as the home.
- Google Business Profile: not measured from this machine (requires a signed-in Google account; to be checked with the owner).
- 404 page: `/contacto/` and `/locales/` return HTTP 404 with the full home template (147 KB) and the same home `<title>`; the "Contacto" and "Locales" items in the header menu of the company page point there.

## Conversion & contact

- Five forms on the home (`grep -o '<form[^>]*>'`): valoramos-tu-piso, contacto, "nosotros te llamamos", two modal contact forms with `method="get" enctype="text/plain"`.
- Every form carries the privacy notice: **"Responsable: XXXXX … dirección de correo electrónico XXXXXX@XXXXXXX.es"** — the CRM template placeholders were never filled (`mytextoprivacidadFooter` block, home_es.html).
- Legal-text modal (`mytextolegal`) contains only: "Si necesitas ayuda profesional para poder introducir este apartado puedes usar estos gestores" — the Aviso legal is EMPTY.
- Cookie policy text refers to "los sitios web de PORTAL" (template placeholder, `mytextocookies`).
- Cookie banner: present, with "Aceptar todas / Gestionar Cookies / Rechazar" buttons (ids `aceptarCookies_boton`, `rechazarCookies_boton`) — compliant shape.
- WhatsApp: floating widget (`plugin-whatsapp`) with a fake chat bubble UI and a 107 KB background PNG (`img/Whatsapp/fondoWhatsapp.png`); `whatsapp.com/send?phone=` link present.
- Phone links: `tel:958252461` OK; `tel:622 350 918` contains spaces (works in most browsers but is malformed).
- "Vende tu casa" CTA: exists as "Publica tu inmueble" (grey button) and "Valoramos tu piso" form near the footer; not in the header, not above the fold on mobile.
- Search: mobile search form with 5 stacked selects + "Ver mapa" over the slider; 60+ property types in the type dropdown (Casa Rústica… Olivar), 26 region options in the mortgage simulator (Andorra, Ceuta…) on a Granada agency site.
- Listing photo count on source pages: 24–60 per listing; ficha shows "Reservado" badge on 5 of the 12 featured listings.

## Legal & accessibility

- RGPD: Aviso legal empty; privacy notice with placeholder controller "XXXXX" and placeholder e-mail; cookie policy names "PORTAL". No identification of the company (CIF, registered name) anywhere on the site.
- Lighthouse Accessibility (ficha) **49/100**. Failing audits: `image-alt` (15 images without alt), `label` (8 form controls without label),
  `link-name` (4), `button-name` (1), `select-name` (1), `color-contrast` (2: white on #cd5c5c = 3.97:1 on "Proponer un precio"; #428bca on #ebebeb = 3.04:1 in footer), `frame-title` (2 iframes), `meta-viewport` (zoom disabled), `definition-list` (6), `td-has-header` (1), `target-size` (1).
- Home raw HTML: 27 `<img>`, **21 without a non-empty `alt`** (`grep -oE '<img[^>]+>' | grep -vc 'alt="[^"]+"'`).
- Keyboard navigation: 108 `href="#"` anchors and `onclick` divs (e.g. `div.fichapropiedad-proponerprecio onclick=`) are not reachable/actionable by keyboard. Not measured by hand beyond the Lighthouse audits.
- `user-scalable=no` on the viewport blocks zoom for low-vision users (WCAG 1.4.4).

## Not measured (say so in the report)

- Real-user field data (CrUX) — no data available for this origin in the Lighthouse run.
- Google Business Profile state, Search Console impressions, current traffic and lead volume — need the owner's accounts.
- Server hosting cost / contract with Inmovilla — ask the owner.
- Portal synchronisation (Idealista, Fotocasa) — Inmovilla CRM normally feeds portals; leaving the CRM web module does not necessarily mean leaving the CRM. To be confirmed with the owner before phase 2.
