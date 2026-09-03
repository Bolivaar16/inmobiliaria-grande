#!/usr/bin/env node
/* build-listings.mjs — dev tool (Node >= 18, no deps).
   Reads data/listings.json + templates/listing.html and writes one static
   page per listing under inmuebles/<slug>.html, plus sitemap.xml at the root.
   Output is committed; deployment serves the files as-is. */

import { readFileSync, writeFileSync, existsSync, mkdirSync } from "node:fs";
import path from "node:path";

const ROOT = process.cwd();
const SITE = "https://www.inmobiliariagrande.com";

/* ------------------------------------------------------------------ utils */
const esc = (s) =>
  String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
const escAttr = (s) => esc(s).replace(/"/g, "&quot;");

const nfInt = new Intl.NumberFormat("es-ES", { maximumFractionDigits: 0 });
const nfDec = new Intl.NumberFormat("es-ES", { maximumFractionDigits: 2 });
const fmtInt = (n) => nfInt.format(n);
const fmtDec = (n) => nfDec.format(n);
const fmtPrice = (n) => nfInt.format(n);

const EMOJI = /\p{Extended_Pictographic}/gu;

function cleanText(s) {
  return String(s)
    .replace(EMOJI, "")
    .replace(/!(\p{L})/gu, "¡$1")
    .replace(/\s+/g, " ")
    .trim();
}

/* Paragraphs that are boilerplate/legal, moved into the <details> note. */
const LEGAL_PREFIXES = [
  "AVISO IMPORTANTE",
  "De conformidad",
  "IMPUESTOS A CARGO",
  "NOTARIA Y REGISTRO",
  "HONORARIOS PROFESIONALES",
  "EN EL CASO DE PRECISAR",
  "PARA EL CÁLCULO",
  "El precio indicado no incluye",
];

function splitDescription(listing) {
  const main = [];
  const legal = [];
  for (const raw of listing.description || []) {
    const p = cleanText(raw);
    if (!p) continue;
    const isLegal = LEGAL_PREFIXES.some((prefix) => p.startsWith(prefix));
    (isLegal ? legal : main).push(p);
  }
  return { main, legal };
}

function roomsWord(n) {
  return n === 1 ? "1 dormitorio" : `${n} dormitorios`;
}
function bathsWord(n) {
  return n === 1 ? "1 baño" : `${n} baños`;
}

/* ------------------------------------------------------------ fragments */
function galleryHtml(listing) {
  const photos = listing.photos;
  const total = photos.length;
  const main = photos[0];
  const thumbs = photos
    .map(
      (p, i) =>
        `<li><a href="../${escAttr(p.src)}"${i === 0 ? ' aria-current="true"' : ""} aria-label="Ver fotografía ${i + 1} de ${total}"><img src="../${escAttr(p.thumb)}" alt="${escAttr(p.alt)}" width="447" height="300" loading="lazy" decoding="async"></a></li>`
    )
    .join("\n        ");
  return `<figure class="gallery">
      <img class="gallery__main" src="../${escAttr(main.src)}" alt="${escAttr(main.alt)}" width="1920" height="1280">
      <ul class="gallery__thumbs">
        ${thumbs}
      </ul>
      <p class="gallery__note">Fotografías de la vivienda. En la oficina tenemos el reportaje completo (${esc(listing.photo_count_on_source)} fotos).</p>
    </figure>`;
}

function figureItem(label, value) {
  return `<div class="figures__item"><span class="figures__label">${label}</span><span class="figures__value">${value}</span></div>`;
}

function figuresHtml(listing) {
  const out = [];
  out.push(figureItem("Superficie construida", `${fmtInt(listing.surface_built_m2)} m²`));
  if (listing.surface_useful_m2 != null) {
    out.push(figureItem("Superficie útil", `${fmtInt(listing.surface_useful_m2)} m²`));
  }
  out.push(figureItem("Dormitorios", String(listing.rooms)));
  out.push(figureItem("Baños", String(listing.baths)));
  out.push(figureItem("Estado", esc(listing.condition)));
  if (listing.plot_m2 != null) {
    out.push(figureItem("Parcela", `${fmtInt(listing.plot_m2)} m²`));
  }
  if (listing.year_built != null) {
    out.push(figureItem("Año", String(listing.year_built)));
  }
  return out.join("\n        ");
}

function energyHtml(listing) {
  const energy = listing.energy;
  if (!energy) return "";
  if (energy.consumption_kwh_m2_year == null || energy.emissions_kg_co2_m2_year == null) {
    return "";
  }
  return `<section>
            <h2>Certificado energético</h2>
            <div class="energy__grid">
              <div class="energy__box">
                <p class="energy__label">Consumo</p>
                <p class="energy__value">${fmtDec(energy.consumption_kwh_m2_year)} kWh/m² año</p>
              </div>
              <div class="energy__box">
                <p class="energy__label">Emisiones</p>
                <p class="energy__value">${fmtDec(energy.emissions_kg_co2_m2_year)} kg CO₂/m² año</p>
              </div>
            </div>
          </section>`;
}

function descriptionHtml(listing) {
  const { main, legal } = splitDescription(listing);
  const body = main.map((p) => `<p>${esc(p)}</p>`).join("\n            ");
  let note = "";
  if (legal.length) {
    const ps = legal.map((p) => `<p>${esc(p)}</p>`).join("\n            ");
    note = `<details class="legal-note">
              <summary>Gastos e impuestos no incluidos en el precio</summary>
              ${ps}
            </details>`;
  }
  return { body, note, firstParagraph: main[0] || "" };
}

function featuresHtml(listing) {
  return (listing.features || [])
    .map((f) => `<li><span>${esc(f)}</span></li>`)
    .join("\n              ");
}

function badgeHtml(listing) {
  return listing.status === "reservado" ? `<span class="badge--reserved">Reservado</span>` : "";
}

function agentJsonLd() {
  return {
    "@type": "RealEstateAgent",
    name: "Inmobiliaria Grande",
    url: `${SITE}/index.html`,
    telephone: "+34958252461",
    email: "info@inmobiliariagrande.com",
    address: {
      "@type": "PostalAddress",
      streetAddress: "Calle Recogidas 13, 1.º A",
      addressLocality: "Granada",
      postalCode: "18005",
      addressCountry: "ES",
    },
  };
}

function jsonLd(listing, desc, pageUrl) {
  const images = listing.photos.map((p) => `${SITE}/${p.src}`);
  const availability =
    listing.status === "reservado"
      ? "https://schema.org/LimitedAvailability"
      : "https://schema.org/InStock";
  const data = {
    "@context": "https://schema.org",
    "@type": "RealEstateListing",
    name: listing.title,
    url: pageUrl,
    description: desc,
    image: images,
    numberOfRooms: listing.rooms,
    numberOfBathroomsTotal: listing.baths,
    floorSize: {
      "@type": "QuantitativeValue",
      value: listing.surface_built_m2,
      unitCode: "MTK",
    },
    address: {
      "@type": "PostalAddress",
      addressLocality: listing.city,
      addressRegion: "Granada",
      addressCountry: "ES",
    },
    offers: {
      "@type": "Offer",
      price: listing.price,
      priceCurrency: "EUR",
      availability,
      seller: agentJsonLd(),
    },
  };
  return `<script type="application/ld+json">
${JSON.stringify(data, null, 2)}
</script>`;
}

/* ----------------------------------------------------------- page build */
function buildListing(listing) {
  const slug = listing.slug;
  const pageUrl = `${SITE}/inmuebles/${slug}.html`;
  const { body: descBody, note: legalNote, firstParagraph } = descriptionHtml(listing);

  const metaDesc = `${listing.type} en ${listing.zone}, ${listing.city}. ${roomsWord(listing.rooms)}, ${bathsWord(listing.baths)} y ${fmtInt(listing.surface_built_m2)} m² construidos por ${fmtPrice(listing.price)} €. Ref. ${listing.ref}. Concierta tu visita.`;

  const title = `${listing.type} en ${listing.zone}, ${listing.city} · ${fmtPrice(listing.price)} € | Inmobiliaria Grande, Granada`;

  const tokens = {
    TITLE: esc(title),
    META_DESC: escAttr(metaDesc),
    CANONICAL: pageUrl,
    OG_IMAGE: `${SITE}/${listing.photos[0].src}`,
    JSONLD: jsonLd(listing, cleanText(firstParagraph), pageUrl),
    H1: esc(listing.title),
    ZONE: esc(listing.zone),
    CITY: esc(listing.city),
    PROVINCE: esc(listing.province),
    PRICE_FMT: fmtPrice(listing.price),
    PRICE_RAW: String(listing.price),
    REF: escAttr(listing.ref),
    BADGE: badgeHtml(listing),
    GALLERY: galleryHtml(listing),
    FIGURES: figuresHtml(listing),
    DESCRIPTION: descBody,
    LEGAL_NOTE: legalNote,
    FEATURES: featuresHtml(listing),
    ENERGY: energyHtml(listing),
    PHOTO_COUNT: String(listing.photos.length),
  };

  let html = readFileSync(path.join(ROOT, "templates", "listing.html"), "utf8");
  for (const [key, value] of Object.entries(tokens)) {
    html = html.split(`{{${key}}}`).join(value);
  }
  return html;
}

function sitemapXml(listingSlugs) {
  const rootPages = [
    "index.html",
    "inmuebles.html",
    "contacto.html",
    "vende-tu-casa.html",
    "sobre-nosotros.html",
    "aviso-legal.html",
    "privacidad.html",
    "cookies.html",
    "404.html",
    "gracias.html",
  ];
  const urls = [...rootPages, ...listingSlugs.map((s) => `inmuebles/${s}.html`)];
  const body = urls.map((u) => `  <url><loc>${SITE}/${u}</loc></url>`).join("\n");
  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${body}
</urlset>
`;
}

/* ---------------------------------------------------------------- main */
function main() {
  const raw = readFileSync(path.join(ROOT, "data", "listings.json"), "utf8");
  const listings = JSON.parse(raw);
  if (!Array.isArray(listings)) {
    fail("data/listings.json must contain an array of listings.");
  }

  mkdirSync(path.join(ROOT, "inmuebles"), { recursive: true });
  const slugs = [];

  for (const listing of listings) {
    const required = ["slug", "title", "price", "ref", "photos"];
    for (const key of required) {
      if (listing[key] == null) fail(`Listing missing required field "${key}" (${listing.id || "unknown"}).`);
    }
    if (!Array.isArray(listing.photos) || !listing.photos.length) {
      fail(`Listing ${listing.id} has no photos.`);
    }
    for (const photo of listing.photos) {
      for (const file of [photo.src, photo.thumb]) {
        if (!existsSync(path.join(ROOT, file))) {
          fail(`Missing photo on disk for ${listing.id}: ${file}`);
        }
      }
      if (!photo.alt) fail(`Listing ${listing.id} photo "${photo.src}" has empty alt.`);
    }

    const html = buildListing(listing);
    writeFileSync(path.join(ROOT, "inmuebles", `${listing.slug}.html`), html);
    slugs.push(listing.slug);
    console.log(`wrote inmuebles/${listing.slug}.html`);
  }

  writeFileSync(path.join(ROOT, "sitemap.xml"), sitemapXml(slugs));
  console.log(`wrote sitemap.xml (${slugs.length + 10} URLs)`);
}

function fail(message) {
  console.error(`build-listings: ${message}`);
  process.exit(1);
}

main();
