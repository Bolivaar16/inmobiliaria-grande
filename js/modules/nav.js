/* Inmobiliaria Grande — nav.js
   Mobile menu toggle and the home header that turns solid once the page scrolls. */
import { $ } from "./dom.js";

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

function initStickyHeader() {
  var header = document.querySelector(".site-header");
  if (!header) return;
  // Only the transparent overlay header needs the swap; the solid one already has it.
  var overlay = header.classList.contains("site-header--overlay");
  function update() {
    var solid = window.scrollY > 8;
    header.classList.toggle("site-header--stuck", overlay ? solid : false);
  }
  update();
  window.addEventListener("scroll", update, { passive: true });
}

export { initNav, initStickyHeader };
