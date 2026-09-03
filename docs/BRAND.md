# Brand system (derived from the 2026 rebranding assets)

Source: two photographs of the printed business card supplied by the client
(logo face and personal face). The logo only exists as a photo; `assets/brand/logo.png`
is a white-balanced crop, not a vector. Production needs the original vector file.

## Palette (sampled from the cleaned logo crop with ImageMagick `-colors 10` histogram)

| Token            | Hex       | Sampled from                    | Use |
|------------------|-----------|---------------------------------|-----|
| `--indigo-900`   | `#2B2350` | wordmark "INMOBILIARIA GRANDE" (#34305C measured, darkened for text contrast) | headings, nav, footer background |
| `--indigo-700`   | `#34305C` | wordmark, dark tiles of rosette | primary buttons, links |
| `--violet-600`   | `#593A83` | rosette tiles (#593A83 measured) | secondary accents, laurel motif |
| `--violet-400`   | `#8F76B8` | light rosette tiles, lightened   | hover states, chips |
| `--violet-100`   | `#EEE9F5` | tint of violet                   | section backgrounds |
| `--rooster-red`  | `#C8102E` | rooster comb (#F41023 measured, desaturated for print/AA) | single CTA accent (WhatsApp / "Vende tu casa"), price highlight |
| `--gold-400`     | `#E8B84A` | rooster beak                     | tiny accent only (icons), never text |
| `--paper`        | `#FAF8F5` | warm off-white                   | page background |
| `--ink`          | `#1F1B2E` | near-black with indigo cast      | body text |
| `--ink-muted`    | `#5C5870` |                                  | secondary text (AA on paper) |
| `--line`         | `#E3DEE9` |                                  | borders, dividers |

Contrast checked: indigo-900 on paper 12.9:1; ink-muted on paper 6.1:1; white on rooster-red 5.9:1; white on indigo-700 10.3:1.

## Typography

- Wordmark is a bold geometric sans in caps with tight tracking. Closest Google Fonts face:
  **Montserrat** (weights 600/800) for display and headings, uppercase with `letter-spacing: 0.04em`.
- "Desde 1970" is a brush script. Closest: **Courgette** — use ONLY for the "Desde 1970" mark, nowhere else.
- Body: **Source Sans 3** (400/600), fallback `system-ui, -apple-system, "Segoe UI", sans-serif`.

## Motif

The rosette (four diamond tiles around a square, Nasrid/Alhambra tiling reference) is the brand's
geometric signature. Use it as: favicon, section ornaments (single small rosette, never tiled
wallpaper), and a diamond-shaped bullet. The laurel appears only next to "Desde 1970".

## Contact data (from the business card and the current website)

- Inmobiliaria Grande, Calle Recogidas 13, 1.º A, 18005 Granada
- Tel. 958 25 24 61 · Móvil 664 678 249 (Javier Corpas, agente) · 622 350 918 (current website)
- info@inmobiliariagrande.com · www.inmobiliariagrande.com
- Owner: José Antonio Grande. Founded 1970 ("Desde 1970").
