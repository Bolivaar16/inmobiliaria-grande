/* Inmobiliaria Grande — main.js
   Independent initialisers; each returns early when its nodes are absent.
   No dependencies, no innerHTML from user data. Progressive: every form and
   link works without JS. Lists (favourites, dismissed, viewed) and the cookie
   choice live in localStorage under the "ig:" prefix. */
(function () {
  "use strict";
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };

  /* ---------- storage ---------- */
  function load(key, fallback) {
    try { var v = window.localStorage.getItem("ig:" + key); return v ? JSON.parse(v) : fallback; }
    catch (e) { return fallback; }
  }
  function save(key, value) {
    try { window.localStorage.setItem("ig:" + key, JSON.stringify(value)); } catch (e) { /* private mode */ }
  }
  var lists = { fav: load("fav", []), dismissed: load("dismissed", []), viewed: load("viewed", []) };
  function has(list, id) { return lists[list].indexOf(id) !== -1; }
  function toggle(list, id) {
    var i = lists[list].indexOf(id);
    if (i === -1) lists[list].push(id); else lists[list].splice(i, 1);
    save(list, lists[list]);
    return i === -1;
  }

  /* ---------- mobile nav ---------- */
  function initNav() {
    var t = $(".nav-toggle");
    if (!t) return;
    var nav = document.getElementById(t.getAttribute("aria-controls"));
    var label = $("[data-nav-label]", t);
    function set(open) {
      t.setAttribute("aria-expanded", open ? "true" : "false");
      nav.classList.toggle("is-open", open);
      if (label) label.textContent = label.getAttribute(open ? "data-close" : "data-open");
    }
    t.addEventListener("click", function () { set(t.getAttribute("aria-expanded") !== "true"); });
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && t.getAttribute("aria-expanded") === "true") { set(false); t.focus(); }
    });
  }

  /* ---------- favourites / dismissed buttons (cards and detail page) ---------- */
  function paintButtons() {
    $$("[data-fav]").forEach(function (b) { b.setAttribute("aria-pressed", has("fav", b.getAttribute("data-fav")) ? "true" : "false"); });
    $$("[data-dismiss]").forEach(function (b) { b.setAttribute("aria-pressed", has("dismissed", b.getAttribute("data-dismiss")) ? "true" : "false"); });
    $$("[data-count]").forEach(function (c) { c.textContent = String(lists[c.getAttribute("data-count")].length); });
  }
  function initLists() {
    document.addEventListener("click", function (e) {
      var b = e.target.closest("[data-fav],[data-dismiss]");
      if (!b) return;
      e.preventDefault();
      if (b.hasAttribute("data-fav")) toggle("fav", b.getAttribute("data-fav"));
      else toggle("dismissed", b.getAttribute("data-dismiss"));
      paintButtons();
      if (typeof window.__applyFilters === "function") window.__applyFilters();
    });
    var page = $("main[data-listing]");
    if (page) {
      var id = page.getAttribute("data-listing");
      if (!has("viewed", id)) { lists.viewed.push(id); save("viewed", lists.viewed); }
    }
    paintButtons();
  }

  /* ---------- home: venta / alquiler pills ---------- */
  function initHomeFilter() {
    var pills = $$("[data-home-filter]");
    if (!pills.length) return;
    var wrap = document.getElementById("home-showcase");
    var empty = document.getElementById("home-empty");
    pills.forEach(function (p) {
      p.addEventListener("click", function () {
        var op = p.getAttribute("data-home-filter");
        pills.forEach(function (q) { q.setAttribute("aria-pressed", q === p ? "true" : "false"); });
        var shown = 0;
        $$("[data-op]", wrap).forEach(function (c) {
          var ok = !op || c.getAttribute("data-op") === op;
          c.hidden = !ok;
          if (ok) shown++;
        });
        if (empty) empty.hidden = shown > 0;
      });
    });
  }

  /* ---------- listing page: filters, tabs, sort, query string ---------- */
  function initFilters() {
    var grid = document.getElementById("results");
    var form = document.getElementById("filter-form");
    if (!grid || !form) return;
    var cards = $$(".card", grid);
    var empty = document.getElementById("no-results");
    var count = document.getElementById("results-count");
    var sort = document.getElementById("f-sort");
    var tabs = $$("[data-tab]");
    var tab = "all";
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
      var shown = 0;
      ordered().forEach(function (c) {
        var ok = visible(c);
        c.hidden = !ok;
        if (ok) shown++;
        grid.appendChild(c);
      });
      if (count) count.textContent = tpl.replace(/^(\D*)\d+/, "$1" + shown);
      if (empty) empty.hidden = shown > 0;
      grid.hidden = shown === 0;
      writeQuery();
    }
    window.__applyFilters = apply;
    function writeQuery() {
      var p = new URLSearchParams();
      ["op", "zona", "tipo", "pmin", "pmax", "rooms", "baths", "m2"].forEach(function (k) { if (val(k)) p.set(k, val(k)); });
      feats().forEach(function (f) { p.append("f", f); });
      if (sort && sort.value) p.set("sort", sort.value);
      if (tab !== "all") p.set("tab", tab);
      var q = p.toString();
      if (window.history.replaceState) window.history.replaceState(null, "", q ? "?" + q : window.location.pathname);
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
      tabs.forEach(function (t) { t.setAttribute("aria-selected", t.getAttribute("data-tab") === tab ? "true" : "false"); });
    }
    function syncDetails() {
      var d = document.getElementById("filters");
      if (d && window.matchMedia("(min-width: 961px)").matches) d.open = true;
    }
    form.addEventListener("submit", function (e) { e.preventDefault(); apply(); });
    form.addEventListener("reset", function () { window.setTimeout(apply, 0); });
    form.addEventListener("change", apply);
    if (sort) sort.addEventListener("change", apply);
    tabs.forEach(function (t) {
      t.addEventListener("click", function () {
        tab = t.getAttribute("data-tab");
        tabs.forEach(function (u) { u.setAttribute("aria-selected", u === t ? "true" : "false"); });
        apply();
      });
    });
    var clear = document.getElementById("clear-filters");
    if (clear) clear.addEventListener("click", function () { form.reset(); tab = "all"; tabs.forEach(function (u) { u.setAttribute("aria-selected", u.getAttribute("data-tab") === "all" ? "true" : "false"); }); window.setTimeout(apply, 0); });
    window.addEventListener("resize", syncDetails);
    syncDetails();
    readQuery();
    apply();
  }

  /* ---------- cookie consent + map loader ---------- */
  function initCookies() {
    var banner = document.getElementById("cookie-banner");
    var consent = load("consent", null);
    function loadMaps() {
      $$("[data-map-src]").forEach(function (box) {
        if ($("iframe", box)) return;
        var f = document.createElement("iframe");
        f.src = box.getAttribute("data-map-src");
        f.title = box.getAttribute("data-map-title") || "Google Maps";
        f.loading = "lazy";
        f.setAttribute("allowfullscreen", "");
        f.referrerPolicy = "no-referrer-when-downgrade";
        var ph = $(".map-box__placeholder", box);
        if (ph) ph.hidden = true;
        box.appendChild(f);
      });
    }
    function choose(maps) {
      consent = { necessary: true, maps: !!maps, at: new Date().toISOString() };
      save("consent", consent);
      if (banner) { banner.hidden = true; document.body.classList.remove("cookie-visible"); }
      if (maps) loadMaps();
    }
    $$("[data-map-accept]").forEach(function (b) { b.addEventListener("click", function () { choose(true); }); });
    if (consent && consent.maps) loadMaps();
    if (!banner || consent) return;
    banner.hidden = false;
    document.body.classList.add("cookie-visible");
    var prefs = document.getElementById("cookie-prefs");
    var mapsBox = document.getElementById("cookie-pref-maps");
    var accept = document.getElementById("cookie-accept");
    var manage = document.getElementById("cookie-manage");
    var reject = document.getElementById("cookie-reject");
    if (accept) accept.addEventListener("click", function () { choose(!prefs || prefs.hidden ? true : mapsBox && mapsBox.checked); });
    if (reject) reject.addEventListener("click", function () { choose(false); });
    if (manage) manage.addEventListener("click", function () {
      prefs.hidden = !prefs.hidden;
      accept.textContent = prefs.hidden ? accept.getAttribute("data-all") || accept.textContent : (document.documentElement.lang === "en" ? "Save choice" : "Guardar elección");
    });
    if (accept) accept.setAttribute("data-all", accept.textContent);
  }

  /* ---------- forms: client-side validation with visible errors ---------- */
  function initForms() {
    $$("form[data-netlify='true']").forEach(function (form) {
      form.setAttribute("novalidate", "novalidate");
      var alertBox = $(".form-alert", form);
      var fields = $$("input, select, textarea", form).filter(function (c) { return c.type !== "hidden" && c.name !== "bot-field"; });
      function errorEl(c) {
        var ids = (c.getAttribute("aria-describedby") || "").split(" ");
        for (var i = 0; i < ids.length; i++) { var n = document.getElementById(ids[i]); if (n && n.classList.contains("field__error")) return n; }
        return null;
      }
      function setState(c, msg) {
        var el = errorEl(c);
        if (msg) { c.setAttribute("aria-invalid", "true"); if (el) { el.textContent = msg; el.hidden = false; } }
        else { c.removeAttribute("aria-invalid"); if (el) { el.textContent = ""; el.hidden = true; } }
        return !msg;
      }
      function check(c) {
        var msg = null, v = (c.value || "").trim(), inv = c.getAttribute("data-error-invalid"), req = c.getAttribute("data-error");
        if (c.type === "checkbox") { if (c.required && !c.checked) msg = req; }
        else if (c.required && !v) msg = req;
        else if (v) {
          if (c.type === "tel" && !/^\+?[0-9]{9,12}$/.test(v.replace(/[\s.\-]/g, ""))) msg = inv;
          else if (c.type === "email" && !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v)) msg = inv;
          else if (c.type === "number" && !/^[0-9]+([.,][0-9]+)?$/.test(v)) msg = inv;
        }
        return setState(c, msg);
      }
      fields.forEach(function (c) {
        c.addEventListener("input", function () { if (c.getAttribute("aria-invalid") === "true") setState(c, null); });
        c.addEventListener("change", function () { if (c.getAttribute("aria-invalid") === "true") check(c); });
      });
      form.addEventListener("submit", function (e) {
        var bad = fields.filter(function (c) { return !c.disabled && !check(c); });
        if (!bad.length) return;
        e.preventDefault();
        if (alertBox) { alertBox.hidden = false; alertBox.textContent = alertBox.getAttribute("data-msg") || (document.documentElement.lang === "en" ? "Please check the highlighted fields." : "Revise los campos marcados: faltan datos o hay algo mal escrito."); }
        bad[0].focus();
      });
    });
  }

  /* ---------- gallery ---------- */
  function initGallery() {
    var g = $(".gallery");
    if (!g) return;
    var main = $(".gallery__main", g), thumbs = $$(".gallery__thumbs a", g);
    if (!main || !thumbs.length) return;
    var mainSource = main.parentElement && main.parentElement.tagName === "PICTURE" ? $("source", main.parentElement) : null;
    function activate(t, focus) {
      var img = $("img", t);
      var href = t.getAttribute("href");
      main.src = href;
      main.removeAttribute("srcset");
      if (mainSource) {
        var thumbSrc = img ? img.getAttribute("src") : null;
        var parts = [];
        if (thumbSrc) parts.push(thumbSrc.replace(/\.jpe?g$/i, ".webp") + " 640w");
        parts.push(href.replace(/\.jpe?g$/i, "-m.webp") + " 1024w");
        parts.push(href.replace(/\.jpe?g$/i, ".webp") + " 1400w");
        mainSource.srcset = parts.join(", ");
      }
      if (img) main.alt = img.getAttribute("alt") || main.alt;
      thumbs.forEach(function (x) { if (x === t) x.setAttribute("aria-current", "true"); else x.removeAttribute("aria-current"); });
      if (focus) t.focus();
    }
    thumbs.forEach(function (t, i) {
      t.addEventListener("click", function (e) { e.preventDefault(); activate(t, false); });
      t.addEventListener("keydown", function (e) {
        if (e.key !== "ArrowLeft" && e.key !== "ArrowRight") return;
        e.preventDefault();
        activate(thumbs[(i + (e.key === "ArrowRight" ? 1 : -1) + thumbs.length) % thumbs.length], true);
      });
    });
  }

  /* ---------- share ---------- */
  function initShare() {
    $$("[data-share]").forEach(function (b) {
      var status = $("[data-share-status]");
      var en = document.documentElement.lang === "en";
      b.addEventListener("click", function () {
        var url = b.getAttribute("data-share"), title = b.getAttribute("data-share-title") || document.title;
        if (navigator.share) { navigator.share({ title: title, url: url }).catch(function () {}); return; }
        if (navigator.clipboard) {
          navigator.clipboard.writeText(url).then(function () {
            if (status) status.textContent = en ? "Link copied" : "Enlace copiado";
            b.textContent = en ? "Link copied" : "Enlace copiado";
          }, function () { window.prompt(en ? "Copy the link:" : "Copie el enlace:", url); });
        } else window.prompt(en ? "Copy the link:" : "Copie el enlace:", url);
      });
    });
  }

  /* ---------- mortgage simulator (French amortisation) ---------- */
  function initMortgage() {
    var f = $("form[data-mortgage]");
    if (!f) return;
    var out = $("[data-mortgage-out]", f);
    var fmt = new Intl.NumberFormat(document.documentElement.lang === "en" ? "en-GB" : "es-ES", { style: "currency", currency: "EUR" });
    function calc() {
      var price = +f.elements.precio.value || 0, down = +f.elements.entrada.value || 0;
      var years = +f.elements.anios.value || 0, rate = +f.elements.tipo.value || 0;
      var P = price * (1 - down / 100), n = years * 12, r = rate / 100 / 12;
      if (P <= 0 || n <= 0) { out.textContent = "—"; return; }
      var m = r === 0 ? P / n : (P * r) / (1 - Math.pow(1 + r, -n));
      out.textContent = fmt.format(m) + (document.documentElement.lang === "en" ? " / month" : " al mes");
    }
    f.addEventListener("input", calc);
    f.addEventListener("submit", function (e) { e.preventDefault(); calc(); });
    calc();
  }

  initNav();
  initLists();
  initHomeFilter();
  initFilters();
  initCookies();
  initForms();
  initGallery();
  initShare();
  initMortgage();
})();
