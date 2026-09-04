/* Inmobiliaria Grande — storage.js
   localStorage under the "ig:" prefix: favourites, dismissed, viewed and the cookie choice.
   Reads fall back silently (private mode, blocked storage) so the page still works. */

function load(key, fallback) {
  try { var v = window.localStorage.getItem("ig:" + key); return v ? JSON.parse(v) : fallback; }
  catch (e) { return fallback; }
}
function save(key, value) {
  try { window.localStorage.setItem("ig:" + key, JSON.stringify(value)); } catch (e) { /* private mode */ }
}
var lists = { fav: load("fav", []), dismissed: load("dismissed", []), viewed: load("viewed", []) };
function has(list, id) { return lists[list].indexOf(id) !== -1; }
function toggle(list, id) {
  var i = lists[list].indexOf(id);
  if (i === -1) lists[list].push(id); else lists[list].splice(i, 1);
  save(list, lists[list]);
  return i === -1;
}

export { load, save, lists, has, toggle };
