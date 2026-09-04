/* Inmobiliaria Grande — cookies.js
   Cookie consent banner and the consent-gated Google Maps embed. */
import { $, $$ } from "./dom.js";
import { load, save } from "./storage.js";

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

export { initCookies };
