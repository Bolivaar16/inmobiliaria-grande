/* Inmobiliaria Grande — main.js
   Five independent initialisers; each returns early if its nodes are absent.
   No dependencies, no innerHTML from user data, no eval. ES2019. */
(function () {
  "use strict";

  /* ---------- Mobile nav ---------- */
  function initNav() {
    var toggle = document.querySelector(".nav-toggle");
    if (!toggle) return;
    document.documentElement.classList.add("js");
    var nav = document.getElementById(toggle.getAttribute("aria-controls"));
    var label = toggle.querySelector("[data-nav-label]");
    if (!nav) return;

    function setMenu(open) {
      toggle.setAttribute("aria-expanded", open ? "true" : "false");
      nav.classList.toggle("is-open", open);
      if (label) label.textContent = open ? "Cerrar menú" : "Abrir menú";
    }

    toggle.addEventListener("click", function () {
      setMenu(toggle.getAttribute("aria-expanded") !== "true");
    });

    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && toggle.getAttribute("aria-expanded") === "true") {
        setMenu(false);
        toggle.focus();
      }
    });
  }

  /* ---------- Listing filters (inmuebles.html) ---------- */
  function initFilters() {
    var grid = document.getElementById("results");
    if (!grid) return;
    var form = document.querySelector(".filterbar");
    var empty = document.getElementById("no-results");
    var countEl = document.getElementById("results-count");
    var total = grid.querySelectorAll(".card").length;
    var cards = Array.prototype.slice.call(grid.querySelectorAll(".card"));

    var selectType = document.getElementById("f-type");
    var selectZone = document.getElementById("f-zone");
    var selectPrice = document.getElementById("f-price");
    var selectRooms = document.getElementById("f-rooms");
    var selectSort = document.getElementById("f-sort");

    function zoneMatches(card, value) {
      if (!value) return true;
      if (value === "Granada capital") return card.dataset.city === "Granada";
      return card.dataset.zone === value || card.dataset.city === value;
    }

    function visible(card) {
      var type = selectType ? selectType.value : "";
      var zone = selectZone ? selectZone.value : "";
      var pmax = selectPrice ? parseInt(selectPrice.value, 10) || 0 : 0;
      var rooms = selectRooms ? parseInt(selectRooms.value, 10) || 0 : 0;
      if (type && card.dataset.type !== type) return false;
      if (!zoneMatches(card, zone)) return false;
      if (pmax && parseInt(card.dataset.price, 10) > pmax) return false;
      if (rooms && parseInt(card.dataset.rooms, 10) < rooms) return false;
      return true;
    }

    function order() {
      if (!selectSort || !selectSort.value) return cards.slice();
      var sorted = cards.slice();
      if (selectSort.value === "price-asc") {
        sorted.sort(function (a, b) {
          return parseInt(a.dataset.price, 10) - parseInt(b.dataset.price, 10);
        });
      } else if (selectSort.value === "price-desc") {
        sorted.sort(function (a, b) {
          return parseInt(b.dataset.price, 10) - parseInt(a.dataset.price, 10);
        });
      }
      return sorted;
    }

    var details = form ? form.querySelector(".filterbar__wrap") : null;
    function syncDetails() {
      if (!details) return;
      var wide = window.matchMedia && window.matchMedia("(min-width: 960px)").matches;
      if (wide) details.open = true;
    }
    syncDetails();
    if (window.addEventListener) {
      window.addEventListener("resize", syncDetails);
    }

    function apply() {
      var shown = order().filter(visible);
      grid.querySelectorAll(".card").forEach(function (card) {
        card.hidden = true;
      });
      shown.forEach(function (card) {
        card.hidden = false;
      });
      var n = shown.length;
      if (countEl) {
        var word = n === 1 ? "vivienda" : "viviendas";
        countEl.textContent = "Mostrando " + n + " de " + total + " " + word;
      }
      var none = n === 0;
      if (empty) empty.hidden = !none;
      grid.hidden = none;
    }

    function readQuery() {
      var params = new URLSearchParams(window.location.search);
      if (selectType) selectType.value = params.get("type") || "";
      if (selectZone) selectZone.value = params.get("zone") || "";
      if (selectPrice) selectPrice.value = params.get("pmax") || "";
    }

    if (form) {
      form.addEventListener("submit", function (e) {
        e.preventDefault();
        apply();
      });
    }
    if (form) {
      form.addEventListener("reset", function () {
        window.setTimeout(apply, 0);
      });
    }
    [selectType, selectZone, selectPrice, selectRooms, selectSort].forEach(function (s) {
      if (s) s.addEventListener("change", apply);
    });

    readQuery();
    apply();
  }

  /* ---------- Cookie banner ---------- */
  function initCookieBanner() {
    var banner = document.getElementById("cookie-banner");
    if (!banner) return;
    if (window.localStorage.getItem("cookie-choice")) return;

    banner.hidden = false;
    document.body.classList.add("cookie-visible");

    function choose(value) {
      window.localStorage.setItem("cookie-choice", value);
      banner.hidden = true;
      document.body.classList.remove("cookie-visible");
    }
    var accept = document.getElementById("cookie-accept");
    var essential = document.getElementById("cookie-essential");
    if (accept) accept.addEventListener("click", function () { choose("all"); });
    if (essential) essential.addEventListener("click", function () { choose("essential"); });
  }

  /* ---------- Forms: validation ---------- */
  function initForms() {
    var forms = document.querySelectorAll("form[data-netlify='true']");
    if (!forms.length) return;

    Array.prototype.forEach.call(forms, function (form) {
      form.setAttribute("novalidate", "novalidate");
      var alertBox = form.querySelector(".form-alert");

      function errorFor(control) {
        if (!control) return null;
        var described = (control.getAttribute("aria-describedby") || "").split(" ");
        for (var i = 0; i < described.length; i++) {
          var node = document.getElementById(described[i]);
          if (node && node.classList.contains("field__error")) return node;
        }
        return null;
      }

      function setState(control, message) {
        var el = errorFor(control);
        if (message) {
          control.setAttribute("aria-invalid", "true");
          if (el) {
            el.textContent = message;
            el.hidden = false;
          }
        } else {
          control.removeAttribute("aria-invalid");
          if (el) {
            el.textContent = "";
            el.hidden = true;
          }
        }
        return !message;
      }

      function check(control) {
        var message = null;
        if (control.type === "checkbox") {
          if (control.hasAttribute("required") && !control.checked) {
            message = control.getAttribute("data-error") || "Marca la casilla para que podamos tratar tus datos y responderte.";
          }
        } else {
          var value = control.value.trim();
          var invalid = control.getAttribute("data-error-invalid");
          var empty = control.getAttribute("data-error");
          if (control.hasAttribute("required") && !value) {
            message = empty;
          } else if (value) {
            if (control.type === "tel") {
              var digits = value.replace(/[\s.\-]/g, "");
              if (!/^[0-9]{9}$/.test(digits)) message = invalid;
            } else if (control.type === "email") {
              if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(value)) message = invalid;
            } else if (control.type === "number") {
              if (!/^[0-9]+$/.test(value)) message = invalid;
            }
          }
        }
        return setState(control, message);
      }

      function focusFirstInvalid(controls) {
        for (var i = 0; i < controls.length; i++) {
          if (controls[i].getAttribute("aria-invalid") === "true") {
            controls[i].focus();
            return;
          }
        }
      }

      var fields = form.querySelectorAll("input, select, textarea");
      Array.prototype.forEach.call(fields, function (control) {
        if (control.type === "hidden") return;
        control.addEventListener("input", function () {
          if (control.getAttribute("aria-invalid") === "true") setState(control, null);
        });
        control.addEventListener("change", function () {
          if (control.getAttribute("aria-invalid") === "true") check(control);
        });
      });

      form.addEventListener("submit", function (e) {
        var invalid = false;
        Array.prototype.forEach.call(fields, function (control) {
          if (control.type === "hidden") return;
          if (control.disabled) return;
          if (!check(control)) invalid = true;
        });
        if (invalid) {
          e.preventDefault();
          if (alertBox) {
            alertBox.hidden = false;
            alertBox.textContent = "Revisa los campos marcados: faltan datos o hay algo mal escrito.";
          }
          focusFirstInvalid(Array.prototype.slice.call(fields));
        }
      });
    });
  }

  /* ---------- Gallery (listing pages) ---------- */
  function initGallery() {
    var gallery = document.querySelector(".gallery");
    if (!gallery) return;
    var main = gallery.querySelector(".gallery__main");
    var thumbs = Array.prototype.slice.call(gallery.querySelectorAll(".gallery__thumbs a"));
    if (!main || !thumbs.length) return;

    function activate(thumb, moveFocus) {
      var img = thumb.querySelector("img");
      main.src = thumb.getAttribute("href");
      if (img) main.alt = img.getAttribute("alt") || main.alt;
      thumbs.forEach(function (t) {
        if (t === thumb) t.setAttribute("aria-current", "true");
        else t.removeAttribute("aria-current");
      });
      if (moveFocus) thumb.focus();
    }

    thumbs.forEach(function (thumb, index) {
      thumb.addEventListener("click", function (e) {
        e.preventDefault();
        activate(thumb, false);
      });
      thumb.addEventListener("keydown", function (e) {
        if (e.key === "ArrowLeft" || e.key === "ArrowRight") {
          e.preventDefault();
          var step = e.key === "ArrowRight" ? 1 : -1;
          var next = thumbs[(index + step + thumbs.length) % thumbs.length];
          activate(next, true);
        }
      });
    });
  }

  initNav();
  initFilters();
  initCookieBanner();
  initForms();
  initGallery();
})();
