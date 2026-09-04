/* Inmobiliaria Grande — mortgage.js
   Mortgage simulator (French amortisation), computed locally. */
import { $ } from "./dom.js";

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

export { initMortgage };
