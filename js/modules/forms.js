/* Inmobiliaria Grande — forms.js
   Client-side validation with visible, per-field errors for every Netlify form. */
import { $, $$ } from "./dom.js";

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

export { initForms };
