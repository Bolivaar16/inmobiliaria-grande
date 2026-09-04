/* Inmobiliaria Grande — lists.js
   Favourite / dismiss buttons on cards and the detail page, and the "viewed" list. */
import { $, $$ } from "./dom.js";
import { lists, has, toggle, save } from "./storage.js";

function paintButtons() {
  $$("[data-fav]").forEach(function (b) { b.setAttribute("aria-pressed", has("fav", b.getAttribute("data-fav")) ? "true" : "false"); });
  $$("[data-dismiss]").forEach(function (b) { b.setAttribute("aria-pressed", has("dismissed", b.getAttribute("data-dismiss")) ? "true" : "false"); });
  $$("[data-count]").forEach(function (c) { c.textContent = String(lists[c.getAttribute("data-count")].length); });
}
/* onChange runs after a list changes so the listing page can re-filter. */
function initLists(onChange) {
  document.addEventListener("click", function (e) {
    var b = e.target.closest("[data-fav],[data-dismiss]");
    if (!b) return;
    e.preventDefault();
    if (b.hasAttribute("data-fav")) toggle("fav", b.getAttribute("data-fav"));
    else toggle("dismissed", b.getAttribute("data-dismiss"));
    paintButtons();
    if (typeof onChange === "function") onChange();
  });
  var page = $("main[data-listing]");
  if (page) {
    var id = page.getAttribute("data-listing");
    if (!has("viewed", id)) { lists.viewed.push(id); save("viewed", lists.viewed); }
  }
  paintButtons();
}

export { initLists, paintButtons };
