/* Inmobiliaria Grande — map.js (home page only)
   Renders the listings map with Leaflet (self-hosted) and OpenStreetMap tiles.
   Leaflet is only fetched once the map scrolls near the viewport, so the home
   page's first paint does not pay for it. Positions come from data/geo.json
   via the inline JSON block and are approximate (neighbourhood centre). */
(function () {
  "use strict";
  var box = document.getElementById("listing-map");
  if (!box) return;
  var dataEl = document.getElementById(box.getAttribute("data-map-json"));
  if (!dataEl) return;
  var points;
  try { points = JSON.parse(dataEl.textContent); } catch (e) { return; }
  if (!points.length) return;
  var root = box.getAttribute("data-root") || "";
  var started = false;

  function loadLeaflet(cb) {
    var css = document.createElement("link");
    css.rel = "stylesheet";
    css.href = root + "assets/vendor/leaflet/leaflet.css";
    document.head.appendChild(css);
    var s = document.createElement("script");
    s.src = root + "assets/vendor/leaflet/leaflet.js";
    s.defer = true;
    s.onload = cb;
    s.onerror = function () { box.classList.add("map--failed"); };
    document.head.appendChild(s);
  }

  function init() {
    if (started) return;
    started = true;
    loadLeaflet(function () {
      var L = window.L;
      var map = L.map(box, { scrollWheelZoom: false, attributionControl: true });
      L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
        maxZoom: 18,
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright" rel="noopener">OpenStreetMap</a>'
      }).addTo(map);
      var bounds = [];
      points.forEach(function (p) {
        var icon = L.divIcon({
          className: "map-price" + (p.reserved ? " map-price--reserved" : ""),
          html: '<a href="' + p.url + '">' + p.price + "</a>",
          iconSize: null
        });
        var m = L.marker([p.lat, p.lng], { icon: icon, title: p.title, alt: p.title }).addTo(map);
        m.on("click", function () { window.location.href = p.url; });
        bounds.push([p.lat, p.lng]);
      });
      map.fitBounds(bounds, { padding: [40, 40], maxZoom: 13 });
      /* Zoomed out, the city listings overlap: show dots, and reveal the price
         labels from zoom 12 (roughly the metropolitan area) onwards. */
      function labels() { box.classList.toggle("map--labels", map.getZoom() >= 12); }
      map.on("zoomend", labels);
      labels();
      var fb = box.querySelector(".map__fallback");
      if (fb) fb.hidden = true;
    });
  }

  if ("IntersectionObserver" in window) {
    var io = new IntersectionObserver(function (entries) {
      if (entries.some(function (e) { return e.isIntersecting; })) { io.disconnect(); init(); }
    }, { rootMargin: "400px 0px" });
    io.observe(box);
  } else {
    init();
  }
})();
