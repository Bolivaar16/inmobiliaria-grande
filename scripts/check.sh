#!/usr/bin/env bash
# check.sh — static checks on the generated site (run after `node scripts/build.mjs`).
# Exits non-zero on the first failed check so it can gate a commit.
set -u
cd "$(dirname "$0")/.."
fail=0
pages=$(ls *.html en/*.html inmuebles/*.html en/properties/*.html 2>/dev/null)

echo "== one <h1> per page"
for f in $pages; do
  n=$(grep -c "<h1" "$f")
  [ "$n" -eq 1 ] || { echo "  $f has $n <h1>"; fail=1; }
done

echo "== no href=\"#\""
grep -l 'href="#"' $pages && fail=1 || true

echo "== no user-scalable=no"
grep -l 'user-scalable=no' $pages && fail=1 || true

echo "== unique <title> and meta description"
grep -h -o "<title>[^<]*" $pages | sort | uniq -d | sed 's/^/  dup title: /' | grep . && fail=1 || true
grep -h -o 'name="description" content="[^"]*' $pages | sort | uniq -d | sed 's/^/  dup desc: /' | grep . && fail=1 || true

echo "== every <img> has alt="
for f in $pages; do
  grep -o "<img[^>]*>" "$f" | grep -v ' alt=' | sed "s|^|  $f: |" | grep . && fail=1 || true
done

echo "== every <img> has width/height"
for f in $pages; do
  grep -o "<img[^>]*>" "$f" | grep -Ev ' width=.* height=' | sed "s|^|  $f: |" | grep . && fail=1 || true
done

echo "== non-hero photos are lazy"
for f in $pages; do
  grep -o "<img[^>]*assets/photos[^>]*>" "$f" | grep -v 'loading="lazy"' | grep -v 'fetchpriority="high"' | sed "s|^|  $f: |" | grep . && fail=1 || true
done

echo "== no external scripts / stylesheets"
grep -l -E '(<script[^>]+src="https?://|<link[^>]+rel="stylesheet"[^>]+href="https?://)' $pages && fail=1 || true

echo "== unresolved tokens"
grep -l '{{[A-Z_]*}}' $pages && fail=1 || true

echo "== internal links resolve"
for f in $pages; do
  dir=$(dirname "$f")
  grep -o 'href="[^"#?]*' "$f" | sed 's/href="//' | grep -Ev '^(https?:|mailto:|tel:|$)' | sort -u | while read -r h; do
    [ -e "$dir/$h" ] || { echo "  $f -> $h missing"; }
  done | grep . && fail=1 || true
done

echo "== secrets"
grep -rIl -E 'api_key|apikey|secret|token=|password=|PRIVATE KEY' --include='*.html' --include='*.js' --include='*.css' --include='*.json' --include='*.toml' . 2>/dev/null | grep -v node_modules | grep . && fail=1 || true

echo "== production files"
for f in robots.txt sitemap.xml llms.txt 404.html privacidad.html aviso-legal.html cookies.html assets/brand/favicon-32.png; do
  [ -e "$f" ] || { echo "  missing $f"; fail=1; }
done

echo "== js size"
wc -c js/main.js

[ "$fail" -eq 0 ] && echo "ALL CHECKS PASSED" || echo "CHECKS FAILED"
exit $fail
