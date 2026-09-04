/* Inmobiliaria Grande — main.js (ES module entry point)
   Each module is an independent initialiser that returns early when its nodes
   are absent. No dependencies, no innerHTML from user data. Progressive: every
   form and link works without JS. Lists (favourites, dismissed, viewed) and the
   cookie choice live in localStorage under the "ig:" prefix (modules/storage.js). */
import { initNav, initStickyHeader } from "./modules/nav.js";
import { initLists } from "./modules/lists.js";
import { initFilters } from "./modules/filters.js";
import { initCookies } from "./modules/cookies.js";
import { initForms } from "./modules/forms.js";
import { initGallery } from "./modules/gallery.js";
import { initShare } from "./modules/share.js";
import { initMortgage } from "./modules/mortgage.js";

let applyFilters = null;
initNav();
initStickyHeader();
/* Saving or dismissing a card changes which results should show, so the listing
   page re-filters; applyFilters is null everywhere else. */
initLists(function () { if (applyFilters) applyFilters(); });
applyFilters = initFilters();
initCookies();
initForms();
initGallery();
initShare();
initMortgage();
