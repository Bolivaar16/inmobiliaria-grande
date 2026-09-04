/* Inmobiliaria Grande — gallery.js
   Listing gallery: thumbnails swap the main photo; arrow keys move between them. */
import { $, $$ } from "./dom.js";

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

export { initGallery };
