# Roadmap — what is worth doing next, and what is not

Verdict on the 40 improvements proposed for the prototype (external review, 2026-09-04), ordered
by expected commercial impact rather than by the order they were proposed in. Four columns:

- **Done (2026-09-04)** — applied in this repository, one commit each (`git log` from `2f93d14`).
- **Worth it, no client needed** — a real improvement we can build from what is already here.
- **Worth it, needs the client** — blocked on photos, data, decisions or access only the agency has.
- **Not worth it** — would not move enquiries, or would make the site worse. The reason is given.

Everything listed under "needs the client" that is a *fact* (not a feature) is also tracked in
`PENDIENTES.md`; this file is about the work, that one is about the data.

## Done (2026-09-04)

| Proposal | What was done |
|---|---|
| Unify the tone as "usted" | Remaining informal copy (group band, footer, cookie banner, generated meta descriptions, prefilled WhatsApp text) rewritten. The two agent quotes stay literal: they are the agents' words. |
| Remove `[DATO A CONFIRMAR]` placeholders and internal notes | No marker is visible any more; each one is an HTML comment next to the sentence, which was rewritten without the missing fact. `PENDIENTES.md` stays the register. |
| "¿Cuánto vale su casa?" block right after the properties | Moved from below the map to directly after the featured listings, white band, question as heading. |
| Make the search bar the visual centre of the home | It already floats over the hero; its button is now violet like every primary action. Larger changes (a second search block, a full-width band) would repeat it. |
| "Solicitar visita" much more visible on each property | Primary button in the listing head, next to the price; heading, button and mobile bar all say "Solicitar visita". |
| Sticky contact panel on desktop, fixed WhatsApp/call bar on mobile | The aside was already sticky. Mobile bar added on listing detail, results and sell pages; it replaces the floating buttons that covered the card controls on phones. |
| Price per m² | On every card and in the listing figures (sales only). |
| Phone and WhatsApp above long forms | Contact page opens with call and WhatsApp buttons; the sell page already led with the call to action. |
| Visible, persistent contact CTAs on high-intent pages | The mobile bar above; on desktop the header phone, the WhatsApp button and the sticky aside already cover it. |
| Mobile contact flow | Bar + `tel:` and `wa.me` links with a prefilled message per page. |
| Structured data of the properties | RealEstateListing → Apartment/House with rooms, surfaces, year, amenities; Offer with URL, availability, sell/lease, price per m²; BreadcrumbList. All 92 blocks parse. |
| Canonical, hreflang, Open Graph and URLs → definitive domain | Every public URL derives from one constant in `scripts/build.mjs`; `check.sh` fails on a second host. Home is `/` and `/en/`, not `/index.html`. The domain itself is still unconfirmed (see below). |
| Split `main.js` into modules | Nine ES modules under `js/modules/`, 26-line entry point, no bundler. 36 functional checks identical before and after. |
| Clean `styles.css` of duplicates and leftovers | 12 dead or duplicated rules removed, hero rules regrouped, media blocks merged. Pixel-identical on 22 screenshots. |
| Review links, forms, filters, galleries, favourites before production | Done for this pass with Playwright (see the commit messages); `scripts/check.sh` covers links, titles, images and secrets. A last pass is still due right before launch, on the final content. |

## Worth it, no client needed

Ordered by impact.

1. **Zone landing pages** (Centro, Zaidín, Albaicín, Realejo, Vega, Monachil…) generated from
   `data/listings.json` by `build.mjs`, each with the listings of that zone, a short local text and
   its own title/description. This is the SEO change with the clearest return: "piso en venta
   Zaidín" is what people type. Needs ~10 short texts per zone, which we can draft and the client
   only reviews. Do it once the full portfolio is imported, so no zone page is empty.
2. **Listing cards: state and freshness.** "Reservado" and price drops already show. "Nuevo"
   needs a real listing date: `source_fetched_at` is the scraping date, the same for all 23, so a
   badge on it would be invented. Add `listed_at` to the data model and show "Nuevo" for < 30 days
   when listings come from the client's CRM, not before.
3. **Hreflang on pages without an English twin.** Legal pages point `hreflang="en"` at the English
   home; the pairs are not reciprocal, so search engines ignore them. Emit only `es` + `x-default`
   there. Half an hour in `build.mjs`.
4. **Mortgage simulator as a visual tool**: a slider for down payment and term, the monthly
   figure large, and the breakdown (interest vs. capital) as a bar. Nice, but a buyer on a listing
   page wants the visit, not the chart; keep it in the aside.
5. **Listing + map view on the results page.** Reuse `js/map.js` (already lazy-loads Leaflet on
   the home) filtered by the current results. Medium effort; positions are approximate (see
   `PENDIENTES.md`), which the map must say.
6. **Compare properties** (2–3 side by side from favourites). Only useful once the portfolio is
   large; with 23 listings the favourites tab already does the job. Later.
7. **Favourites / viewed / dismissed more visible.** They are tabs with counts on the results
   page. A count in the header would add clutter for the ~5 % of visitors who use them. Skip
   unless analytics say otherwise.
8. **Final responsive, accessibility, performance and Core Web Vitals pass.** Run Lighthouse and
   the 375/1440 screenshots again on the final content, right before launch (the last run is in
   `docs/audit/redesign/`). Photos are the weight: see the JPEG fallback note in `PENDIENTES.md`.
9. **Sitemap and indexing.** `sitemap.xml` and `robots.txt` are generated and consistent. What
   remains is Search Console, which needs the domain (below).

## Worth it, needs the client

- **Real photographs** of the office, the team at work and Granada (the home hero is an
  AI-generated placeholder and cannot ship). This is the single biggest visual upgrade and nothing
  in code substitutes for it. Team portraits already come from the current site.
- **Definitive domain.** One line in `scripts/build.mjs`; then Search Console, the sitemap
  submission and a redirect map from the current URLs (`/ficha/...`) to the new ones.
- **Client testimonials**, and specifically **sellers' testimonials** for the sell page. The
  Google score and two quotes are on the home; more requires the client to ask past clients, or
  the Google `place_id` to link straight to the reviews tab.
- **"Grupo Inmobiliario de Granada" as a commercial argument.** The band now explains the shared
  portfolio and buyers; a stronger claim (how many agencies, how many listings the network
  shares, whether it has a website to link) needs the association's numbers.
- **Team section with more warmth.** Copy is ready; what is missing is photography (candid,
  in the office, together) rather than the cropped portraits from the old site.
- **Figures on the sell page** (years, properties sold, valuation time). 55 years and +250 are
  real; "properties sold" and "average days to sell" would be invented today. Ask for them.
- **Useful neighbourhood information per listing** (schools, transport, prices per zone). The
  template has the "Zona" section; filling it honestly needs the agency's local knowledge, or a
  data source we license. Not to be written by an AI from general knowledge.
- **Content section / guides** (buying, selling, prices, investment in Granada). Good for SEO in
  the medium term, only if someone will keep writing; four evergreen guides reviewed by the
  agency is the realistic scope. Not before the zone pages.
- **Full portfolio import** (23 of ~276 listings shipped) and exact coordinates.
- **Legal texts**: legal entity, tax ID, registry data, the Netlify processing agreement.

## Not worth it (or not now)

- **"More premium" look with fewer boxes and more space.** The design direction (1b Galería,
  `docs/BRAND.md`) was chosen on the design canvas and approved; a broad restyle now would reopen
  that decision without new information. Small moves in that direction were taken where they
  coincided with a functional change (the valuation band has no card). Revisit after real
  photography lands, which changes the page more than any CSS.
- **Redesign the listing page to put photo, price and CTA first.** The page already opens with
  price, headline, the visit button and a full-width gallery; description, features and energy
  come after. Nothing to reorder.
- **Sense of urgency on featured listings.** "Reservado" and real price drops are shown; anything
  else (counters, "3 people are viewing") is invented pressure and hurts the "desde 1970" position.
- **Zone SEO per listing beyond what is there.** Titles, descriptions, breadcrumbs and JSON-LD
  already carry type, zone, town and price. More keywords in the copy would read as spam.
- **Long contact forms.** The forms are already short (name, phone, message); the change was to
  put the phone first, not to remove the form, which is what visitors outside opening hours use.

## How the "done" items were verified

`node scripts/build.mjs && bash scripts/check.sh` after each commit, Playwright over HTTP
(`python3 -m http.server 8000`) for 36 functional checks and 22 full-page screenshots at 1440 and
375 px in both languages; refactors were accepted only when the screenshots were pixel-identical.
