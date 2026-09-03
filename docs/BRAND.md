# Brand and visual system (revision 2026-09-03, direction "1b Galería")

The site follows direction **1b "Galería"** from the Claude Design canvas
(`Rebranding Inmobiliaria Grande.dc.html`, project `5556b49e-…`) for layout, palette and
components, combined with the **typography of direction 1a** (serif display). The earlier
indigo/red system (Montserrat + Source Sans + Courgette, 4–6 px radii, single red accent) is
superseded; `docs/DESIGN-PLAN.md` keeps the old plan for reference with a note at the top.

## Palette (`css/styles.css` `:root`)

| Token | Hex | Use |
|---|---|---|
| `--deep` | `#0F0B1E` | header, footer, page heads, hero veil |
| `--ink` | `#231A45` | headings, body text, primary dark button, active pills |
| `--ink-2` / `--ink-3` | `#241C4F` / `#2A1F52` | dark bands (family block, CTA band), hero base |
| `--violet` | `#7B4FD1` | primary accent: phone pill, main CTA buttons, badges, eyebrows |
| `--violet-hover` | `#6A40BD` | hover of the above |
| `--violet-soft` | `#8E6BC8` | diamonds ornament, eyebrows on dark |
| `--lilac` / `--lilac-light` / `--lilac-pale` | `#A99BD0` / `#C6BCE0` / `#DDD6EE` | text on dark, kickers, image placeholders |
| `--paper` | `#FAF8FC` | page background |
| `--white` | `#FFFFFF` | cards, panels, search bar |
| `--text-muted` / `--text-soft` | `#5B5273` / `#8A81A3` | secondary text, labels |
| `--line` / `--line-soft` | `#DED7EA` / `#EDE9F4` | borders, dividers |
| `--danger` / `--ok` | `#B3261E` / `#1E7A4D` | form errors / rent badge |

The rooster red of the business card is **not** used in the UI (direction 1b); it survives only
inside the rosette emblem. WhatsApp keeps its own green (`#25D366`) on the floating button.

Contrast (WCAG AA): white on `--violet` 5.5:1; `--ink` on `--paper` 13.6:1; `--text-muted` on
`--paper` 6.9:1; `--lilac-light` on `--deep` 11.2:1.

## Typography (self-hosted variable fonts in `assets/fonts/`)

- **Playfair Display** (`--font-display`, wght 400–900): every heading, prices, big numbers,
  key figures. Weight 600 for headings, 700 for prices.
- **Libre Franklin** (`--font-body`, wght 100–900): body, navigation, buttons, forms.
- **JetBrains Mono** (`--font-mono`, wght 400–800): eyebrows, kickers, references, labels,
  breadcrumbs — always uppercase with 0.1–0.24 em tracking, 0.68–0.75 rem.

Files: `playfair-display-var.woff2` (38 KB), `libre-franklin-var.woff2` (29 KB),
`jetbrains-mono-var.woff2` (31 KB), latin subset, `font-display: swap`, the first two preloaded.

## Shapes and components

- Cards and panels: 8 px radius, white, `--shadow-card`. Buttons: 4 px radius. Filters, tabs,
  language toggle, phone and badges: pills (999 px).
- Header: dark (`--deep`), transparent over the home hero (`site-header--overlay`), emblem +
  "GRANDE / DESDE 1970" text wordmark, nav, ES/EN pill toggle, phone pill in `--violet`.
- Hero: 720 px, full-bleed photo (`assets/hero-granada.*`, an AI-generated placeholder until the
  client supplies one), serif h1 up to 4.75 rem, floating white search bar overlapping the next
  section by 50 %. Photo treatment: `saturate(0.9) brightness(0.78)`, `object-position: 58% center`
  (keeps the Alhambra clear of the text column). Veil: vertical only below 900 px; from 900 px a
  second 100deg gradient darkens the left column. Both were measured against the worst-case
  (brightest) background pixel under each text band and pass WCAG AA: kicker 6.6:1 desktop /
  6.8:1 mobile, lead 9.2:1 / 6.3:1, h1 11:1+. Re-measure if the photo is replaced — the earlier
  `blur(6px) brightness(0.55)` treatment existed only to flatten the old office-wall photo.
- Showcase: 1.6fr feature card with gradient veil + two horizontal side cards, then a row of four.
- Family block (from direction 1a): dark `--ink-2` band, serif heading "Una inmobiliaria de
  familia, no una franquicia", 2×2 stats separated by 1 px lines.
- Ornament: three rotated squares (diamonds) in `--violet-soft`, footer only. No tiled wallpaper.

## Logo

`assets/brand/rosette.png` (254×258, cleaned crop of the business card) is the emblem. The
wordmark is set in text (Libre Franklin 700, 0.16 em tracking + JetBrains Mono "DESDE 1970").
The vector emblem and wordmark from the Claude Design project (`assets/emblem.png`,
`assets/wordmark.png`) could not be exported (256 KiB API cap); production needs the client's
vector file.

## Contact data (business card + current website)

- Inmobiliaria Grande, Calle Recogidas 13, 1.º A, 18005 Granada
- Tel. 958 25 24 61 (office landline) · 622 350 918 (mobile and WhatsApp, the number the
  agency's live site already publishes). No personal staff mobiles on the site: the client
  asked for the landline and this one only.
- info@inmobiliariagrande.com · Mon–Fri 9:30–20:00 (source: oopiniones.com listing, unverified)
- Founder José Antonio Grande, 1970. Team on the current site: José Antonio Grande, José Grande
  Jr., Mónica, Javier Corpas.
