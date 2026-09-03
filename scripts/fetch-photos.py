#!/usr/bin/env python3
"""Download listing photos and build the derivative set the site serves.

Per photo N: N.jpg 1400x933 q80, N-s.jpg 640x427 q80, N.webp q78, N-s.webp q78,
N-m.webp 1024w q72, N-t.webp 240w q68 — matching assets/photos/30002664/.
"""
import json, os, pathlib, subprocess, sys, urllib.request, time

REPO = pathlib.Path(__file__).resolve().parent.parent
TMP = pathlib.Path(os.environ.get("PHOTO_CACHE", "/tmp/grande-photos"))
TMP.mkdir(exist_ok=True)
UA = "Mozilla/5.0 (X11; Linux x86_64) inmobiliaria-grande-prototype/1.0"
MAX_PHOTOS = 10

def run(args):
    r = subprocess.run(args, capture_output=True)
    if r.returncode != 0:
        raise RuntimeError(" ".join(map(str, args[:3])) + " -> " + r.stderr.decode()[:200])

def fetch(url, dest, tries=3):
    for k in range(tries):
        try:
            req = urllib.request.Request(url, headers={"User-Agent": UA})
            with urllib.request.urlopen(req, timeout=90) as r:
                data = r.read()
            if len(data) < 3000:
                raise RuntimeError("too small")
            dest.write_bytes(data); return True
        except Exception as e:
            if k == tries - 1:
                print(f"    fallo {url}: {e}", flush=True); return False
            time.sleep(2 * (k + 1))

def derive(src, out_dir, n):
    o = out_dir
    run(["convert", str(src), "-auto-orient", "-strip", "-resize", "1400x933^",
         "-gravity", "center", "-extent", "1400x933", "-quality", "80", str(o / f"{n}.jpg")])
    run(["convert", str(o / f"{n}.jpg"), "-resize", "640x427!", "-quality", "80", str(o / f"{n}-s.jpg")])
    run(["convert", str(o / f"{n}.jpg"), "-quality", "78", str(o / f"{n}.webp")])
    run(["convert", str(o / f"{n}-s.jpg"), "-quality", "78", str(o / f"{n}-s.webp")])
    run(["convert", str(o / f"{n}.jpg"), "-resize", "1024x", "-quality", "72", str(o / f"{n}-m.webp")])
    run(["convert", str(o / f"{n}.jpg"), "-resize", "240x", "-quality", "68", str(o / f"{n}-t.webp")])

def main():
    listings = json.load(open(sys.argv[1]))
    total = 0
    for e in listings:
        pid = e["id"]
        urls = e["photo_urls"][:MAX_PHOTOS]
        out = REPO / "assets" / "photos" / pid
        out.mkdir(parents=True, exist_ok=True)
        ok = 0
        for i, u in enumerate(urls, 1):
            raw = TMP / f"{pid}-{i}.jpg"
            if not raw.exists() and not fetch(u, raw):
                continue
            try:
                derive(raw, out, ok + 1); ok += 1
            except Exception as ex:
                print(f"    derive fallo {pid}/{i}: {ex}", flush=True)
            time.sleep(0.2)
        e["photos_downloaded"] = ok
        total += ok
        print(f"{pid}: {ok}/{len(urls)} fotos -> assets/photos/{pid}/", flush=True)
    json.dump(listings, open(sys.argv[1], "w"), ensure_ascii=False, indent=1)
    print(f"\nTOTAL {total} fotos, {total*6} ficheros", flush=True)

main()
