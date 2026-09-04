/* Inmobiliaria Grande — dom.js
   querySelector shorthands shared by every module. */

var $ = function (s, r) { return (r || document).querySelector(s); };
var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };

export { $, $$ };
