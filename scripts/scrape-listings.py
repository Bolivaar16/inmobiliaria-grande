#!/usr/bin/env python3
"""Scrape listings from the client's live site (read-only) into the prototype schema.

Everything is parsed from the page's own <section id="modulo-fichapropiedad">: the
rest of the page carries carousels of OTHER properties, so page-wide regexes pick up
the wrong prices. Gallery URLs are <group>-<n>s.jpg (thumb) / <group>-<n>.jpg (full).
"""
import re, json, sys, time, html, unicodedata, urllib.request

UA = "Mozilla/5.0 (X11; Linux x86_64) inmobiliaria-grande-prototype/1.0"

def get(url, binary=False, tries=3):
    for k in range(tries):
        try:
            req = urllib.request.Request(url, headers={"User-Agent": UA})
            with urllib.request.urlopen(req, timeout=60) as r:
                data = r.read()
            return data if binary else data.decode("utf-8", "replace")
        except Exception:
            if k == tries - 1: raise
            time.sleep(2 * (k + 1))

def txt(x):
    return re.sub(r"\s+", " ", html.unescape(re.sub(r"<[^>]+>", " ", x or ""))).strip()

def slugify(s):
    s = unicodedata.normalize("NFKD", s).encode("ascii", "ignore").decode()
    return re.sub(r"-+", "-", re.sub(r"[^a-z0-9]+", "-", s.lower())).strip("-")

def num(s):
    if s is None: return None
    m = re.search(r"\d[\d.]*", s)
    return float(m.group().replace(".", "")) if m else None

def scrape(url):
    s = get(url)
    pid = re.search(r"/(\d+)/(?:es|en)/?$", url).group(1)
    a = s.find('id="modulo-fichapropiedad"')
    b = s.find("similares", a)
    sec = s[a:b] if a >= 0 and b > a else s

    title = txt(re.search(r"<h1[^>]*>(.*?)</h1>", sec, re.S).group(1)) if re.search(r"<h1", sec) else ""

    # key/value table
    flat = re.sub(r"\s+", " ", re.sub(r"<[^>]+>", "\x01", sec))
    cells = [c.strip() for c in flat.split("\x01") if c.strip() and c.strip() != "&nbsp;"]
    cells = [html.unescape(c) for c in cells]
    kv = {}
    keys = ("Referencia","Tipo Operación","Tipo de Propiedad","Zona / Ciudad","Superficie Útil",
            "Superficie Construida","Superficie Parcela","Conservación","Antigüedad","Habitaciones",
            "Baños","Dormitorios","Tipo Exterior","Fachada","Vistas","Regimen","Planta")
    for i, c in enumerate(cells):
        if c in keys and i + 1 < len(cells):
            v = cells[i + 1]
            if v not in keys:
                kv.setdefault(c, v)

    price = num(re.search(r"([\d.]+)\s*(?:&euro;|€)", sec).group(1)) if re.search(r"[\d.]+\s*(?:&euro;|€)", sec) else None
    m_prev = re.search(r'precioanterior[^>]*>\s*([\d.]+)', s)
    m_pct  = re.search(r'precioporcentaje[^>]*>\s*-?\s*(\d+)', s)

    # description: paragraphs before the "Características" table
    dtop = sec.find("bloquedescripcion")
    dend = sec.find("Características y calidades")
    desc_html = sec[dtop:dend] if 0 <= dtop < dend else ""
    desc = [txt(p) for p in re.split(r"</p>|<br\s*/?>", desc_html)]
    desc = [d for d in desc if len(d) > 40]

    # amenity chips come after the table
    feats = []
    if dend > 0:
        tail = cells[cells.index("Características y calidades"):] if "Características y calidades" in cells else []
        feats = [c for c in tail if 2 < len(c) < 32 and c not in keys and not re.search(r"\d{3}", c)]
        feats = [f for f in dict.fromkeys(feats) if f not in ("Características y calidades", "m", "2")]

    thumbs = re.findall(r"https://fotos\d+\.apinmo\.com/(\d+)/%s/(\d+)-(\d+)s\.jpg" % pid, s)
    photos = []
    if thumbs:
        agency, group = thumbs[0][0], thumbs[0][1]
        host = re.search(r"https://(fotos\d+)\.apinmo\.com/\d+/%s/" % pid, s).group(1)
        idxs = sorted({int(n) for _, _, n in thumbs})
        photos = [f"https://{host}.apinmo.com/{agency}/{pid}/{group}-{n}.jpg" for n in idxs]

    canon = re.search(r'<link rel="canonical" href="(.*?)"', s)
    canon = canon.group(1) if canon else url
    p = canon.rstrip("/").split("/")
    kind = p[-6].replace("-", " ") if len(p) >= 7 else ""

    zona_ciudad = kv.get("Zona / Ciudad", "")
    zone, _, city = [x.strip() for x in zona_ciudad.partition("/")] if "/" in zona_ciudad else (zona_ciudad, "", "Granada")

    return dict(
        id=pid, ref=kv.get("Referencia"), source_url=url, canonical=canon,
        title=title, slug=slugify(title)[:70] or f"inmueble-{pid}",
        type=kv.get("Tipo de Propiedad") or kind,
        operation="venta" if (kv.get("Tipo Operación") or "").lower().startswith("vend") else "alquiler",
        zone=zone or None, city=city or "Granada", province="Granada",
        price=price, previous_price=num(m_prev.group(1)) if m_prev else None,
        discount_pct=int(m_pct.group(1)) if m_pct else None,
        surface_built_m2=num(kv.get("Superficie Construida")),
        surface_useful_m2=num(kv.get("Superficie Útil")),
        plot_m2=num(kv.get("Superficie Parcela")),
        rooms=int(num(kv.get("Habitaciones") or kv.get("Dormitorios")) or 0) or None,
        baths=int(num(kv.get("Baños")) or 0) or None,
        condition=kv.get("Conservación"), year_built=int(num(kv.get("Antigüedad")) or 0) or None,
        features=feats[:18], description=desc[:10],
        photo_urls=photos, photo_count=len(photos),
    )

if __name__ == "__main__":
    out = []
    for u in sys.argv[1:]:
        try:
            r = scrape(u)
            out.append(r)
            print(f"OK {r['id']} ref={r['ref']} fotos={r['photo_count']:>2} "
                  f"{r['price']}€ antes={r['previous_price']} -{r['discount_pct']}% "
                  f"{r['type']} {r['rooms']}h/{r['baths']}b {r['title'][:38]}", file=sys.stderr)
        except Exception as e:
            print(f"ERR {u}: {type(e).__name__} {e}", file=sys.stderr)
        time.sleep(1.5)
    print(json.dumps(out, ensure_ascii=False, indent=1))
