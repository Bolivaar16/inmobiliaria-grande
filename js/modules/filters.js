/* Inmobiliaria Grande — filters.js
   Listing page: filters, tabs (all / favourites / viewed / dismissed), sort, pagination
   and the query string that mirrors them. */
import { $, $$ } from "./dom.js";
import { has } from "./storage.js";

/* Returns the apply() function so other modules can re-run the filter, or null
   on pages without the results grid. */
function initFilters() {
  var grid = document.getElementById("results");
  var form = document.getElementById("filter-form");
  if (!grid || !form) return null;
  var cards = $$(".card", grid);
  var empty = document.getElementById("no-results");
  var count = document.getElementById("results-count");
  var sort = document.getElementById("f-sort");
  var tabs = $$("[data-tab]");
  var tab = "all";
  var pager = document.getElementById("pagination");
  var perPage = pager ? +pager.getAttribute("data-per-page") || 0 : 0;
  var page = 1;
  var tpl = count ? count.textContent : "";

  function val(name) { var el = form.elements[name]; return el ? (el.value || "").trim() : ""; }
  function feats() { return $$("input[name=f]:checked", form).map(function (i) { return i.value; }); }
  function zoneOk(c, z) {
    if (!z) return true;
    if (z === "Granada capital") return c.getAttribute("data-city") === "Granada";
    return c.getAttribute("data-zone") === z || c.getAttribute("data-city") === z;
  }
  function visible(c) {
    var id = c.getAttribute("data-id");
    if (tab === "fav" && !has("fav", id)) return false;
    if (tab === "viewed" && !has("viewed", id)) return false;
    if (tab === "dismissed") return has("dismissed", id);
    if (has("dismissed", id)) return false;
    var op = val("op"), tipo = val("tipo"), zona = val("zona");
    var pmin = +val("pmin") || 0, pmax = +val("pmax") || 0, rooms = +val("rooms") || 0, baths = +val("baths") || 0, m2 = +val("m2") || 0;
    var price = +c.getAttribute("data-price");
    if (op && c.getAttribute("data-op") !== op) return false;
    if (tipo && c.getAttribute("data-type") !== tipo) return false;
    if (!zoneOk(c, zona)) return false;
    if (pmin && price < pmin) return false;
    if (pmax && price > pmax) return false;
    if (rooms && +c.getAttribute("data-rooms") < rooms) return false;
    if (baths && +c.getAttribute("data-baths") < baths) return false;
    if (m2 && +c.getAttribute("data-m2") < m2) return false;
    var f = feats(), have = c.getAttribute("data-features").split("|");
    for (var i = 0; i < f.length; i++) if (have.indexOf(f[i]) === -1) return false;
    return true;
  }
  function ordered() {
    var s = sort ? sort.value : "", out = cards.slice();
    var num = function (a) { return +a.getAttribute("data-price"); };
    if (s === "price-asc") out.sort(function (a, b) { return num(a) - num(b); });
    else if (s === "price-desc") out.sort(function (a, b) { return num(b) - num(a); });
    else if (s === "m2-desc") out.sort(function (a, b) { return +b.getAttribute("data-m2") - +a.getAttribute("data-m2"); });
    else out.sort(function (a, b) { return (b.getAttribute("data-date") || "").localeCompare(a.getAttribute("data-date") || ""); });
    return out;
  }
  function apply() {
    var matches = [];
    ordered().forEach(function (c) {
      if (visible(c)) matches.push(c);
      c.hidden = true;
      grid.appendChild(c);
    });
    /* Without a pager (or with one page's worth of results) everything stays on screen. */
    var pages = perPage ? Math.max(1, Math.ceil(matches.length / perPage)) : 1;
    if (page > pages) page = pages;
    var slice = perPage ? matches.slice((page - 1) * perPage, page * perPage) : matches;
    slice.forEach(function (c) { c.hidden = false; });
    if (count) count.textContent = tpl.replace(/^(\D*)\d+/, "$1" + slice.length);
    if (empty) empty.hidden = matches.length > 0;
    grid.hidden = matches.length === 0;
    renderPager(pages);
    writeQuery();
  }
  /* Filtering, sorting or switching tab changes the result set, so the reader is sent
     back to its first page instead of one that may no longer exist. */
  function applyFromStart() { page = 1; apply(); }
  function goTo(n, pages) {
    if (n < 1 || n > pages || n === page) return;
    page = n;
    apply();
    grid.scrollIntoView();
  }
  function renderPager(pages) {
    if (!pager) return;
    pager.hidden = pages < 2;
    if (pages < 2) { pager.innerHTML = ""; return; }
    var frag = document.createDocumentFragment();
    var button = function (label, target, opts) {
      var b = document.createElement("button");
      b.type = "button";
      b.textContent = label;
      if (opts.disabled) b.disabled = true;
      if (opts.label) b.setAttribute("aria-label", opts.label);
      b.addEventListener("click", function () { goTo(target, pages); });
      var li = document.createElement("li");
      li.appendChild(b);
      return li;
    };
    frag.appendChild(button(pager.getAttribute("data-prev"), page - 1, { disabled: page === 1 }));
    for (var n = 1; n <= pages; n++) {
      if (n === page) {
        var li = document.createElement("li");
        var cur = document.createElement("span");
        cur.setAttribute("aria-current", "page");
        cur.textContent = String(n);
        li.appendChild(cur);
        frag.appendChild(li);
      } else {
        frag.appendChild(button(String(n), n, { label: pager.getAttribute("data-goto") + " " + n }));
      }
    }
    frag.appendChild(button(pager.getAttribute("data-next"), page + 1, { disabled: page === pages }));
    pager.innerHTML = "";
    pager.appendChild(frag);
  }
  function writeQuery() {
    var p = new URLSearchParams();
    ["op", "zona", "tipo", "pmin", "pmax", "rooms", "baths", "m2"].forEach(function (k) { if (val(k)) p.set(k, val(k)); });
    feats().forEach(function (f) { p.append("f", f); });
    if (sort && sort.value) p.set("sort", sort.value);
    if (tab !== "all") p.set("tab", tab);
    if (page > 1) p.set("p", String(page));
    var q = p.toString();
    // Keep the hash: this runs on load, and dropping it broke deep links like #alertas.
    if (window.history.replaceState) window.history.replaceState(null, "", (q ? "?" + q : window.location.pathname) + window.location.hash);
  }
  function readQuery() {
    var p = new URLSearchParams(window.location.search);
    ["op", "zona", "tipo", "pmin", "pmax", "rooms", "baths", "m2"].forEach(function (k) {
      var el = form.elements[k];
      if (el && p.get(k) != null) el.value = p.get(k);
    });
    p.getAll("f").forEach(function (f) { var i = $("input[name=f][value=\"" + f + "\"]", form); if (i) i.checked = true; });
    if (sort && p.get("sort")) sort.value = p.get("sort");
    if (p.get("tab")) tab = p.get("tab");
    if (+p.get("p") > 1) page = +p.get("p");
    tabs.forEach(function (t) { t.setAttribute("aria-selected", t.getAttribute("data-tab") === tab ? "true" : "false"); });
  }
  function syncDetails() {
    var d = document.getElementById("filters");
    if (d && window.matchMedia("(min-width: 961px)").matches) d.open = true;
  }
  form.addEventListener("submit", function (e) { e.preventDefault(); apply(); });
  form.addEventListener("reset", function () { window.setTimeout(applyFromStart, 0); });
  form.addEventListener("change", applyFromStart);
  if (sort) sort.addEventListener("change", applyFromStart);
  tabs.forEach(function (t) {
    t.addEventListener("click", function () {
      tab = t.getAttribute("data-tab");
      tabs.forEach(function (u) { u.setAttribute("aria-selected", u === t ? "true" : "false"); });
      applyFromStart();
    });
  });
  var clear = document.getElementById("clear-filters");
  if (clear) clear.addEventListener("click", function () { form.reset(); tab = "all"; tabs.forEach(function (u) { u.setAttribute("aria-selected", u.getAttribute("data-tab") === "all" ? "true" : "false"); }); window.setTimeout(applyFromStart, 0); });
  window.addEventListener("resize", syncDetails);
  syncDetails();
  readQuery();
  apply();
  // apply() reorders and shows/hides cards, so the browser's initial jump to a hash
  // lands on the pre-filter layout. Re-scroll once the final layout exists.
  if (window.location.hash) {
    var target = document.getElementById(window.location.hash.slice(1));
    if (target) window.requestAnimationFrame(function () { target.scrollIntoView(); });
  }
  return apply;
}

export { initFilters };
