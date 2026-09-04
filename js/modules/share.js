/* Inmobiliaria Grande — share.js
   Share button: native share sheet, clipboard fallback, prompt as last resort. */
import { $, $$ } from "./dom.js";

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

export { initShare };
