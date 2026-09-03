> **Revisión 2026-09-03 — plan superado en lo visual.** El sitio construido sigue la dirección
> **1b «Galería»** del canvas de Claude Design (paleta morada `#7B4FD1` sobre `#0F0B1E`/`#231A45`,
> tarjetas de 8 px, pills, héroe a sangre con buscador flotante) con la **tipografía de 1a**
> (Playfair Display + Libre Franklin + JetBrains Mono, autoalojadas). Quedan **anuladas** las reglas de
> este documento sobre color (índigo/rojo del gallo), tipografía (Montserrat/Source Sans/Courgette),
> radios 4–6 px y la prohibición de pills. El sistema vigente está en `docs/BRAND.md`.
> Siguen vigentes: los criterios de aceptación de la sección 0 (un `<h1>`, `<title>` únicos, copy por
> zona, lazy-loading, sin frameworks, viewport sin `user-scalable=no`, legales redactados), las reglas de
> accesibilidad de la sección 6 y la estrategia de pruebas de la sección 8. La estructura de ficheros
> de la sección 4 ha cambiado: las páginas se generan desde `src/<lang>/` con `scripts/build.mjs`
> (ver `README.md`).

# Inmobiliaria Grande — nuevo sitio estático: plan de diseño y construcción

Repo: `/home/alejandro/02_PROYECTOS/inmobiliaria-grande`
Ejecutores: **A) artboards** (6 mockups HTML, desktop 1440) y **B) sitio de producción** (HTML + CSS + JS mínimo).
Fuentes de verdad: `docs/BRAND.md`, `data/listings.json`, `docs/audit/evidence.md`, `assets/brand/logo.png`.

## 0. Problema y criterios de aceptación

El sitio actual (Inmovilla CRM, PHP 5.6) tiene: 43 `<h1>` en la home, `<title>` y meta description idénticos y truncados en todas las páginas, textos genéricos sin zonas de Granada, la CTA de captación ("Publica tu inmueble") escondida en gris a mitad de página, 41 imágenes cargadas eager en una ficha, jQuery + Revolution Slider + reCAPTCHA (1,7 MB de JS en la ficha), accesibilidad 49/100, `user-scalable=no`, avisos legales con marcadores `XXXXX`, y el logo viejo. Los 55 años de historia no aparecen: la palabra "1970" no está en el sitio.

El nuevo sitio debe cumplir, página a página:

1. Un solo `<h1>` por página.
2. `<title>` y meta description únicos y descriptivos en las 10+8 páginas.
3. Copy orientado a zona y municipio reales (Centro, El Serrallo, Villarejo, Alcampo, Monachil, Pulianas, La Malahá, Cogollos de la Vega).
4. CTA "Vende tu casa" visible sobre el pliegue en móvil (375 px), en rojo, en la cabecera.
5. Todas las fotos salvo la del héroe con `loading="lazy"` + `width`/`height` para CLS 0.
6. Cero jQuery, cero frameworks, cero embeds externos. JS propio < 6 KB sin minificar.
7. `<meta name="viewport" content="width=device-width, initial-scale=1">` sin `user-scalable=no`.
8. Textos legales redactados (con `[DATO A CONFIRMAR]` donde falte información societaria), nunca marcadores tipo `XXXXX`.

**Marca, no plantilla.** Prohibido: tarjetas pill (radios ≥ 12 px), degradados de stock, cajas con borde izquierdo de color, iconos de casita genéricos, sombras difusas grandes. Obligatorio: geometría de la roseta nazarí, índigo/violeta, **un solo** acento rojo por pantalla (CTA de venta y precio), esquinas de 4–6 px.

---

## 1. Design tokens (`css/styles.css`, bloque `:root` listo para pegar)

Hex copiados literalmente de `docs/BRAND.md`. No inventar tonos nuevos; para estados usar `color-mix()` o las variantes ya definidas.

```css
:root {
  /* ---- Color (docs/BRAND.md) ---- */
  --indigo-900: #2B2350;   /* h1–h3, nav, fondo del footer */
  --indigo-700: #34305C;   /* botón primario, enlaces */
  --violet-600: #593A83;   /* acentos secundarios, laurel, foco */
  --violet-400: #8F76B8;   /* hover, chips */
  --violet-100: #EEE9F5;   /* fondos de sección */
  --rooster-red: #C8102E;  /* ÚNICO acento: "Vende tu casa", WhatsApp, precio */
  --gold-400: #E8B84A;     /* solo iconos diminutos, nunca texto */
  --paper: #FAF8F5;        /* fondo de página */
  --ink: #1F1B2E;          /* texto */
  --ink-muted: #5C5870;    /* texto secundario */
  --line: #E3DEE9;         /* bordes y separadores */
  --white: #FFFFFF;

  /* Estados derivados (no son colores nuevos, son mezclas) */
  --indigo-700-hover: color-mix(in srgb, var(--indigo-700) 88%, black);
  --red-hover: color-mix(in srgb, var(--rooster-red) 88%, black);
  --violet-100-hover: color-mix(in srgb, var(--violet-100) 70%, var(--violet-400));

  /* ---- Tipografía ---- */
  --font-display: "Montserrat", system-ui, -apple-system, "Segoe UI", sans-serif;
  --font-body: "Source Sans 3", system-ui, -apple-system, "Segoe UI", sans-serif;
  --font-script: "Courgette", cursive;   /* SOLO "Desde 1970" */

  --fs-xs:   0.8125rem;  /* 13px — pie de foto, notas legales */
  --fs-sm:   0.875rem;   /* 14px — chips, etiquetas, breadcrumb */
  --fs-base: 1rem;       /* 16px — cuerpo móvil */
  --fs-md:   1.125rem;   /* 18px — cuerpo desktop, entradillas */
  --fs-lg:   1.375rem;   /* 22px — h3, precio en tarjeta */
  --fs-xl:   clamp(1.5rem, 2.4vw, 2rem);      /* 24→32 — h2 */
  --fs-2xl:  clamp(1.875rem, 4vw, 2.5rem);    /* 30→40 — h1 interior, precio ficha */
  --fs-3xl:  clamp(2.125rem, 5.2vw, 3.25rem); /* 34→52 — h1 del héroe */

  --lh-tight: 1.15;   /* display */
  --lh-snug:  1.35;   /* h3, precios */
  --lh-body:  1.6;    /* párrafos */
  --ls-caps:  0.04em; /* tracking del wordmark, BRAND.md */

  /* ---- Espaciado (base 4) ---- */
  --s-1: 4px;  --s-2: 8px;  --s-3: 12px; --s-4: 16px; --s-5: 24px;
  --s-6: 32px; --s-7: 48px; --s-8: 64px; --s-9: 96px; --s-10: 128px;
  --section-y: clamp(48px, 7vw, 96px);   /* padding vertical de sección */

  /* ---- Radios (geométrico, no burbuja) ---- */
  --r-sm: 4px;   /* inputs, chips, badges */
  --r-md: 6px;   /* tarjetas, imágenes, botones */
  --r-0: 0;      /* bandas a ancho completo, franja del footer */

  /* ---- Sombra: una sola, sutil ---- */
  --shadow: 0 1px 2px rgba(31, 27, 46, .06), 0 10px 24px -14px rgba(43, 35, 80, .30);

  /* ---- Contenedores ---- */
  --container: 1200px;        /* rejilla principal */
  --container-narrow: 760px;  /* texto legal, descripción de ficha */
  --gutter: 20px;             /* móvil */

  /* ---- Foco y motion ---- */
  --focus: 3px solid var(--violet-600);
  --focus-on-dark: 3px solid var(--violet-400);
  --focus-offset: 2px;
  --dur: 160ms;
}
@media (min-width: 960px) { :root { --gutter: 32px; } }
```

**Breakpoints (mobile first, solo `min-width`):** `0` base · `640px` (2 columnas de tarjetas, formulario del héroe en 2×2) · `960px` (nav horizontal, 3 columnas, ficha a 2 columnas) · `1200px` (rejilla de 4 columnas, contenedor a tope).

**Carga de fuentes** (una sola petición, en cada `<head>`):

```html
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Montserrat:wght@600;800&family=Source+Sans+3:wght@400;600&family=Courgette&display=swap">
```

**Reglas tipográficas:** `h1`–`h3` en `--font-display`, 800 para `h1`/`h2`, 600 para `h3`, `text-transform: uppercase` y `letter-spacing: var(--ls-caps)` **solo** en `h1`, `h2` y etiquetas de sección; `h3` (títulos de tarjeta y de ficha) en caja normal para no perder legibilidad en nombres largos ("Casa de campo en Sierra de Huétor, Cogollos de la Vega"). Cuerpo en Source Sans 3 400, `--lh-body`, ancho máximo 68 caracteres. Courgette únicamente en el elemento `.since` con el texto "Desde 1970".

---

## 2. Inventario de componentes (anatomía exacta)

Convención de clases: BEM plano en inglés (`.site-header`, `.card`, `.card__price`). Nombres de fichero y código en inglés; todo el texto visible en español.

### 2.1 `.site-header`
Orden en el DOM: `a.skip-link` (fuera del header, primer hijo de `body`) → `header.site-header` con `.header__inner` (contenedor 1200, `display:flex`, `align-items:center`, `gap: var(--s-5)`):
1. `a.logo` → `<img src="assets/brand/logo.png" alt="Inmobiliaria Grande, desde 1970" width="220" height="52">` (móvil: 168×40).
2. `nav.nav` con `<ul>`: Inicio · Inmuebles · Vende tu casa · Sobre nosotros · Contacto.
3. `a.header__phone` → `tel:+34958252461`, texto "958 25 24 61" precedido de un rombo violeta de 8 px (pseudo-elemento rotado 45°, no icono externo). **Sin espacios dentro del `href`** (el sitio actual tiene `tel:622 350 918` malformado).
4. `a.btn.btn--red` "Vende tu casa" → `vende-tu-casa.html`.
5. `button.nav-toggle` (solo < 960 px), `aria-expanded="false"`, `aria-controls="nav-menu"`, texto accesible "Abrir menú" / "Cerrar menú"; icono de tres barras dibujado en CSS.

Altura 76 px desktop / 60 px móvil, fondo `--paper`, `border-bottom: 1px solid var(--line)`, `position: sticky; top:0; z-index:50`. Enlace activo: `aria-current="page"` + subrayado de 3 px en `--violet-600` (nunca cambio de color solo).
Móvil: logo a la izquierda, botón rojo "Vende tu casa" compacto (solo texto, 44 px de alto, padding 0 12px) y `nav-toggle` a la derecha. El menú desplegado es un panel a ancho completo por debajo del header, con enlaces de 52 px de alto y el teléfono al final. Cierra con `Esc` y devuelve el foco al botón.

### 2.2 `.hero` (solo `index.html`)
Estructura: `section.hero` > figura de fondo (`img.hero__bg` = `assets/photos/30002664/1.jpg`, `loading="eager"`, `fetchpriority="high"`, `width="1920" height="1280"`, `object-fit:cover`) + capa `.hero__veil` (`linear-gradient(90deg, rgba(43,35,80,.92) 0%, rgba(43,35,80,.78) 46%, rgba(43,35,80,.35) 100%)`) + `.hero__content`.
`.hero__content`: `p.eyebrow` ("Granada y provincia") → `h1` (blanco, `--fs-3xl`) → `p.hero__lead` (`--fs-md`, `--violet-100`) → `form.search`.
`form.search`: fondo `--paper`, `--r-md`, `--shadow`, padding `var(--s-5)`, `method="get" action="inmuebles.html"`. Cuatro campos con `<label>` visible en `--fs-sm` mayúscula:
- `select#op name="op"`: Comprar (`venta`) · Alquilar (`alquiler`, `disabled` con texto "Alquiler (próximamente)" — hoy no hay obra en alquiler en `listings.json`).
- `select#type name="type"`: Todos los tipos · Piso · Ático Dúplex · Pareado · Casa de campo (valores exactos del campo `type`).
- `select#zone name="zone"`: Toda la provincia · Granada capital · Centro · El Serrallo · Villarejo · Alcampo · Monachil · Pulianas · La Malahá · Cogollos de la Vega.
- `select#price name="pmax"`: Sin límite · Hasta 175.000 € · Hasta 250.000 € · Hasta 300.000 € · Hasta 350.000 €.
- `button.btn.btn--indigo` "Ver inmuebles" (ancho completo en móvil).
Rejilla: 1 columna < 640 · 2×2 en 640 · 4 + botón en línea en 1200. Altura del héroe: `min-height: 560px` desktop, `auto` en móvil (imagen 200 px arriba, contenido debajo sobre índigo sólido, para no pagar un fondo ilegible ni empujar la CTA).

### 2.3 `.card` (tarjeta de inmueble)
`<article class="card">` → `<a class="card__link">` que envuelve todo (un solo enlace por tarjeta, `href="inmuebles/<slug>.html"`):
1. `.card__media` — ratio 4:3 forzado (`aspect-ratio:4/3; overflow:hidden`), `img` = `photos[0].thumb`, `alt` = `photos[0].alt` del JSON, `loading="lazy" decoding="async" width="447" height="300"`, `object-fit:cover`. `transform: scale(1.03)` en hover (desactivado con `prefers-reduced-motion`).
2. `.badge.badge--reserved` "Reservado" — solo si `status === "reservado"`: arriba a la izquierda, fondo `--indigo-900`, texto blanco, `--fs-sm` 600 mayúscula, `--r-sm`, padding 6×10. La tarjeta reservada además baja la foto a `filter: saturate(.75)`.
3. `.card__body` (padding `var(--s-4)`):
   - `p.card__price` — `--font-display` 800, `--fs-lg`, color `--rooster-red`, formato `339.900 €` (punto de millar, espacio fino antes del €).
   - `h3.card__title` — `title` del JSON, 2 líneas máx (`-webkit-line-clamp:2`).
   - `p.card__place` — `zone` + separador rombo `◆` en `--violet-400` + `city`, `--fs-sm`, `--ink-muted`.
   - `ul.chips` — tres chips: `146 m²` · `2 dorm.` · `1 baño` (singular/plural correcto; omitir chip si el dato es `null`).
Borde `1px solid var(--line)`, radio `--r-md`, fondo blanco, sombra solo en hover/focus-within. **Sin** borde izquierdo de color. Foco: anillo violeta sobre toda la tarjeta.

### 2.4 `.filterbar` (solo `inmuebles.html`)
`<form class="filterbar" role="search" aria-label="Filtrar inmuebles">` sticky bajo el header en desktop, con 5 controles etiquetados: Tipo, Zona o municipio, Precio máximo, Dormitorios (mín.), Ordenar por (Más recientes / Precio: de menor a mayor / Precio: de mayor a menor). Botón secundario "Limpiar filtros" (`type="reset"`).
Debajo: `p.results-count` con `aria-live="polite"`: "Mostrando 8 de 8 viviendas". Sin resultados: bloque `.empty` con "No hay viviendas con esos criterios. Prueba a subir el precio máximo o a quitar la zona." + botón "Ver todas".
Móvil: los 5 controles apilados dentro de un `<details class="filterbar__wrap">` con `<summary>` "Filtrar y ordenar" de 48 px; cerrado por defecto para que la primera tarjeta entre en pantalla.
Sin JS: la barra se muestra igual, las 8 tarjetas quedan visibles y un `<noscript>` avisa: "El filtro necesita JavaScript. Abajo tienes todas las viviendas."

### 2.5 `.gallery` (ficha)
`figure.gallery`: `img.gallery__main` (ratio 3:2, `photos[0].src`, `loading="eager"`, `width="1920" height="1280"`) + `ul.gallery__thumbs` con 6 `button` (uno por foto), cada uno con `img` del `thumb` (`loading="lazy"`, 447×300) y `aria-label="Ver fotografía N de 6"`. El botón activo lleva `aria-current="true"` y borde de 3 px `--violet-600`.
Desktop ≥ 960: principal 4/5 del ancho a la izquierda, tira vertical de miniaturas a la derecha (6 × 96 px). Móvil: principal a ancho completo y miniaturas en fila con scroll horizontal (`overflow-x:auto`, `scroll-snap-type: x mandatory`), 88 px cada una.
JS: cambiar `src`/`alt` de la principal al pulsar; flechas ←/→ mueven entre miniaturas. Sin JS, cada miniatura es un `<a href="assets/photos/ID/N.jpg">` que abre la foto. Nota bajo la galería: "Fotografías de la vivienda. En la oficina tenemos el reportaje completo ([N] fotos)." usando `photo_count_on_source`.

### 2.6 `.chips` y `.features`
Chip: `display:inline-flex`, alto 28 px, padding 0 10px, `--r-sm`, fondo `--violet-100`, texto `--indigo-900` `--fs-sm` 600. Sin borde. Los chips de datos (m², dorm., baños) no son interactivos: son `<li>`, no botones.
Lista de características de la ficha (`features` del JSON): `ul.features` en 2 columnas (1 en móvil, 3 en ≥1200), cada `li` con un rombo violeta de 8 px como viñeta (`::marker` sustituido por pseudo-elemento rotado 45° en `--violet-600`). Nunca iconos de librería.

### 2.7 Formularios y estados de error
Un solo patrón para los tres formularios (contacto, valoración, contacto de ficha).
Anatomía de campo: `<div class="field">` → `<label for>` (`--fs-sm`, 600, `--indigo-900`; obligatorio marcado con "(obligatorio)" en texto, no con asterisco suelto) → `<input>`/`<select>`/`<textarea>` (alto 48 px, borde `1px solid var(--line)`, `--r-sm`, fondo blanco, `--fs-base`) → `<p class="field__error" id="x-error" hidden>`.
Estados: reposo (borde `--line`) · hover (borde `--violet-400`) · foco (`outline: var(--focus); outline-offset: var(--focus-offset)`) · error (borde 2 px `--rooster-red`, `aria-invalid="true"`, `aria-describedby` al `field__error`, mensaje en rojo con rombo delante) · deshabilitado (fondo `--violet-100`, texto `--ink-muted`).
Consentimiento: `<input type="checkbox" id="consent" required>` de 24×24 con área de toque de 44 px + label enlazando a `privacidad.html`.
Mensajes de error (texto exacto, en el orden en que los escribe el validador):
- Nombre vacío: "Escribe tu nombre para saber con quién hablamos."
- Teléfono vacío: "Necesitamos un teléfono para poder llamarte."
- Teléfono inválido: "El teléfono debe tener 9 dígitos. Ejemplo: 958 25 24 61."
- Email vacío: "Escribe tu correo electrónico."
- Email inválido: "Ese correo no parece correcto. Revisa que tenga la forma nombre@dominio.com."
- Mensaje vacío: "Cuéntanos brevemente qué necesitas."
- Dirección vacía (valoración): "Indica al menos la calle y el municipio."
- Metros vacíos o no numéricos: "Escribe los metros construidos en números. Ejemplo: 110."
- Consentimiento sin marcar: "Marca la casilla para que podamos tratar tus datos y responderte."
Resumen de errores: al enviar con errores, `div.form-alert[role="alert"]` sobre el formulario: "Revisa los campos marcados: faltan datos o hay algo mal escrito." y el foco va al primer campo inválido.
Éxito: `div.form-success[role="status"]` verde no, violeta: fondo `--violet-100`, borde 1 px `--violet-600`, título "Mensaje enviado" y texto "Gracias. Nos ponemos en contacto contigo lo antes posible. Si prefieres no esperar, llámanos al 958 25 24 61."
Netlify Forms (sin backend, funciona sin JS): en cada `<form>` → `name="contacto" | "valoracion" | "contacto-ficha"`, `method="POST"`, `data-netlify="true"`, `data-netlify-honeypot="bot-field"`, `action="gracias.html"`, más `<input type="hidden" name="form-name" value="...">` y el honeypot `<p class="hp"><label>No rellenes esto: <input name="bot-field"></label></p>` con `.hp{position:absolute;left:-9999px}`. En la ficha, campo oculto `<input type="hidden" name="referencia" value="RGC-0091">`.
El JS de validación solo bloquea el envío si hay errores; si todo es válido, deja que el navegador envíe (nada de `fetch`).

### 2.8 `.whatsapp-fab`
Enlace fijo abajo a la derecha (`bottom: 20px; right: 20px`, 56×56, `--r-md` no círculo, fondo `--rooster-red`, glifo de WhatsApp en SVG inline blanco de 26 px), `aria-label="Escribir por WhatsApp al 622 350 918"`, `href="https://wa.me/34622350918?text=Hola%2C%20os%20escribo%20desde%20la%20web"`, `rel="noopener"`. Sin burbuja falsa de chat ni PNG de fondo (el actual pesa 107 KB). Se aparta 76 px hacia arriba mientras el banner de cookies esté visible.

### 2.9 `.site-footer`
Fondo `--indigo-900`, texto blanco / `--violet-100` para secundario, 4 columnas ≥960 y 1 columna apilada en móvil:
1. Logo en versión clara (`assets/brand/logo.png` sobre chip blanco de 8 px de padding, `--r-sm`) + `p.since` "Desde 1970" en Courgette `--fs-lg` con la guirnalda: dos ramas SVG inline en `--violet-400` a izquierda y derecha del texto.
2. Dirección: "Inmobiliaria Grande" / "Calle Recogidas 13, 1.º A" / "18005 Granada".
3. Contacto: `tel:+34958252461` "958 25 24 61 (oficina)", `tel:+34622350918` "622 350 918", `mailto:info@inmobiliariagrande.com`.
4. Enlaces: Inmuebles · Vende tu casa · Sobre nosotros · Contacto · Aviso legal · Política de privacidad · Política de cookies.
Franja inferior separada por `1px solid rgba(255,255,255,.16)`: "© 2026 Inmobiliaria Grande. Todos los derechos reservados." Enlaces del footer con subrayado permanente (contraste AA sobre índigo).

### 2.10 `.cookie-banner`
`<div class="cookie-banner" role="dialog" aria-modal="false" aria-labelledby="cookie-title" hidden>` anclado abajo, a ancho completo, fondo `--paper`, `border-top: 3px solid var(--violet-600)`, sombra. Contenido: `h2#cookie-title` (visualmente `--fs-md`) "Cookies" + texto:
"Usamos solo cookies propias necesarias para que la web funcione y para recordar esta elección. No hay cookies de publicidad ni de terceros. Puedes leer la [política de cookies](cookies.html)."
Botones (44 px, en este orden): `button.btn.btn--indigo` "Aceptar" · `button.btn.btn--ghost` "Solo las necesarias". No hay opción oscura ni botón preseleccionado. Se muestra si `localStorage.cookie-choice` no existe; al pulsar guarda `"all"` o `"essential"` y oculta. Se muestra vía JS al cargar (nunca bloquea el render ni la lectura del contenido).

### 2.11 Roseta como ornamento
La roseta se dibuja **en SVG inline** (cuatro rombos alrededor de un cuadrado, escalones nazaríes), no con `assets/brand/rosette.png`: ese PNG es un recorte que arrastra parte del wordmark a la derecha y no es usable como ornamento. Paleta del SVG: rombos exteriores `--violet-600`, interiores `--indigo-700`, hueco central `--paper`. Usos permitidos, uno por sección como máximo:
- Separador de sección: roseta de 28 px centrada entre dos filetes de 1 px `--line`.
- Marca de agua del `hero` en desktop: roseta de 420 px, `opacity:.10`, blanca, en la esquina inferior derecha, `aria-hidden="true"`.
- Viñeta de listas (rombo de 8 px, un solo tile de la roseta).
- Favicon (ya generado en `assets/brand/`).
Prohibido: usarla como patrón repetido de fondo o detrás de texto.

### 2.12 Botones
`.btn` base: `--font-display` 600, `--fs-base`, mayúsculas con `--ls-caps`, alto 48 px (44 px mínimo en móvil), padding 0 24px, `--r-sm`, `transition: background var(--dur)`.
- `.btn--red` (fondo `--rooster-red`, texto blanco): **solo** "Vende tu casa" y "Solicitar valoración". Hover `--red-hover`.
- `.btn--indigo` (fondo `--indigo-700`, texto blanco): acción principal de cada formulario y "Ver inmuebles".
- `.btn--ghost` (transparente, borde 1 px `--indigo-700`, texto `--indigo-700`): secundarios, "Limpiar filtros", "Solo las necesarias".
- `.btn--link` (texto `--indigo-700` subrayado): "Volver a inmuebles".
Máximo un `.btn--red` visible por pantalla, salvo la banda de captación de la home (donde el rojo va sobre índigo y el del header queda fuera de ese bloque visual).

---

## 3. Composición página a página (orden de secciones, copy real, comportamiento móvil)

Tuteo en páginas de marketing; usted en las tres páginas legales.

### 3.1 `index.html`
1. **Header** (§2.1).
2. **Héroe + buscador** (§2.2).
   - eyebrow: "Granada y provincia"
   - `h1`: "Tu próxima casa en Granada, con quien lleva aquí desde 1970"
   - lead: "Pisos, áticos y casas en el centro, en la vega y en la sierra. Te enseñamos solo lo que encaja contigo."
   - Móvil: foto de 200 px, luego bloque índigo con h1 (`--fs-3xl` recortado a 34 px), lead a 2 líneas y el buscador; la CTA roja "Vende tu casa" del header ya está sobre el pliegue.
3. **Destacados** (`section#destacados`, fondo `--paper`).
   - `h2`: "Una selección de lo que tenemos ahora mismo"
   - entradilla: "Cuatro viviendas de nuestra cartera en venta. Puedes ver todas en la página de inmuebles."
   - 4 tarjetas: `30002664` (Ático Dúplex, Centro), `30020091` (Piso, El Serrallo), `29868382` (Piso, Villarejo), `29965705` (Casa de campo, Cogollos de la Vega). Rejilla 1 / 2 / 4 columnas según breakpoint.
   - Cierre: `a.btn--ghost` "Ver los 8 inmuebles" → `inmuebles.html`.
   - Móvil: una tarjeta por fila (nada de carrusel: sin JS que se atragante).
4. **Banda "Vende tu casa"** (fondo `--indigo-900`, a ancho completo, roseta de agua a la derecha).
   - `h2` (blanco): "¿Vas a vender? Primero, sepamos cuánto vale"
   - texto: "Valoramos tu vivienda con precios reales de cierre en tu zona, no con estimaciones de portal. Sin coste y sin compromiso de exclusiva."
   - `a.btn--red` "Solicitar valoración gratuita" → `vende-tu-casa.html`.
   - Móvil: texto centrado, botón a ancho completo, padding vertical 48 px.
5. **Franja "55 años en Granada"** (fondo `--violet-100`, tres columnas separadas por filete vertical de 1 px `--line`; en móvil apiladas con separador horizontal).
   - `h2`: "55 años en Granada"
   - Dato 1 — cifra `1970` (`--fs-2xl`, display 800, `--indigo-900`) + "El año en que abrimos. Seguimos siendo la misma casa."
   - Dato 2 — cifra `Recogidas 13` + "Oficina a pie de calle en el centro de Granada, con la puerta abierta."
   - Dato 3 — cifra `9 municipios` → **sustituir por** `Capital y vega` + "Vendemos en Granada capital, Monachil, Pulianas, La Malahá y Cogollos de la Vega." (evita inventar una cifra de cobertura).
   - Enlace: "Nuestra historia" → `sobre-nosotros.html`.
6. **Franja de contacto** (fondo `--paper`, dos columnas 60/40).
   - `h2`: "¿Hablamos?"
   - texto: "Cuéntanos qué buscas o qué quieres vender y te contestamos con nombres, calles y precios, no con formularios automáticos."
   - Bloque de acciones: `a.btn--indigo` "Llamar al 958 25 24 61" (`tel:`), `a.btn--ghost` "Escribir por WhatsApp", dirección y horario `[DATO A CONFIRMAR: horario de oficina]`.
   - Móvil: botones a ancho completo, 12 px de separación.
7. **Footer**, **WhatsApp FAB**, **banner de cookies**.

### 3.2 `inmuebles.html`
1. Header.
2. `nav.breadcrumb`: Inicio ◆ Inmuebles.
3. Cabecera de página (fondo `--violet-100`, 2 líneas):
   - `h1`: "Viviendas en venta en Granada y provincia"
   - entradilla: "Todo lo que tenemos publicado a día de hoy: 8 viviendas entre la capital, la vega y la sierra. Si no ves lo tuyo, dínoslo y lo buscamos."
4. `.filterbar` (§2.4) + contador de resultados.
5. Rejilla de las 8 tarjetas (1 / 2 / 3 / 4 columnas). Orden por defecto: el del JSON. Cada tarjeta lleva `data-type`, `data-zone`, `data-city`, `data-price`, `data-rooms`, `data-status` para el filtro cliente.
6. Bloque final `.cta-strip` (fondo `--indigo-900`): `h2` "¿No encuentras lo que buscas?" + "Tenemos viviendas que aún no están publicadas. Cuéntanos qué necesitas y te avisamos cuando entre algo que encaje." + `a.btn--red` "Vende tu casa" y `a.btn--ghost` "Contactar".
7. Footer + FAB + cookies.
Móvil: filtro plegado en `<details>`, tarjetas a una columna, contador siempre visible sobre la rejilla.

### 3.3 Plantilla de ficha → `inmuebles/<slug>.html` (8 páginas)
Orden:
1. Header. 2. `nav.breadcrumb`: Inicio ◆ Inmuebles ◆ `{title}`.
3. **Encabezado de ficha**: `h1` = `{title}` · debajo `p.place` `{zone} ◆ {city}, {province}` · a la derecha (desktop) bloque `.price-box`: precio `--fs-2xl` display 800 en `--rooster-red`, debajo `p.ref` "Ref. {ref}" en `--fs-sm` `--ink-muted`, y `span.badge--reserved` si procede.
4. **Galería** (§2.5).
5. **Cifras clave**: fila de 5 datos con etiqueta arriba (`--fs-sm` `--ink-muted` mayúscula) y valor abajo (`--fs-lg` display): Superficie construida `{surface_built_m2} m²` · Superficie útil (omitir si `null`) · Dormitorios · Baños · Estado `{condition}`. Añadir Parcela `{plot_m2} m²` cuando exista (V1028: 9.766 m²) y Año `{year_built}` cuando no sea `null`.
6. **Descripción**: `h2` "La vivienda", párrafos de `description[]` en `--container-narrow`. El generador debe **filtrar** los párrafos legales de coletilla (los que empiezan por "AVISO IMPORTANTE", "De conformidad", "IMPUESTOS A CARGO", "NOTARIA Y REGISTRO", "HONORARIOS PROFESIONALES", "EN EL CASO DE PRECISAR", "PARA EL CÁLCULO", "El precio indicado no incluye") y moverlos a un `<details class="legal-note">` al final con `<summary>` "Gastos e impuestos no incluidos en el precio". También debe eliminar emojis del texto (los hay en 28722775 y 29868382) y normalizar "!No lo dude" → "¡No lo dude".
7. **Características**: `h2` "Características" + `ul.features` (§2.6).
8. **Certificado energético**: `h2` "Certificado energético". Con datos: dos cifras, "Consumo {consumption} kWh/m² año" y "Emisiones {emissions} kg CO₂/m² año", en cajas `--violet-100`. Sin datos (`null`): texto "Certificado energético en trámite. Consúltanos el estado antes de la visita." Nunca inventar la letra de calificación.
9. **Aside de contacto** (columna derecha sticky ≥960, tras las cifras clave en móvil):
   - `h2` "¿Quieres verlo?"
   - "Javier Corpas, agente inmobiliario" + `a` `tel:+34622350918` "622 350 918" + `a.btn--red` "Escribir por WhatsApp".
   - Formulario `contacto-ficha`: Nombre, Teléfono, Email, Mensaje (prellenado: "Me interesa la referencia {ref}. ¿Cuándo podría visitarla?"), checkbox de consentimiento, `button.btn--indigo` "Solicitar visita". Campo oculto `referencia`.
10. **Volver**: `a.btn--link` "← Volver a todos los inmuebles".
11. Footer + FAB + cookies.
Móvil: precio y referencia justo bajo el `h1` (antes de la galería), aside después de la descripción, y barra fija inferior de 60 px con "Llamar" y "WhatsApp" (no tapa el footer: `padding-bottom` compensado en `body`).

### 3.4 `contacto.html`
1. Header. 2. Breadcrumb.
3. `h1`: "Contacto" · entradilla: "Estamos en Recogidas 13, en pleno centro. Puedes venir sin cita, llamarnos o escribirnos por aquí."
4. Dos columnas (60/40 desktop, apiladas en móvil, formulario primero en el DOM):
   - **Formulario** `name="contacto"`: Nombre y apellidos (obligatorio) · Teléfono (obligatorio) · Correo electrónico · ¿En qué podemos ayudarte? (`select`: Comprar una vivienda / Vender mi vivienda / Alquilar / Otra consulta) · Mensaje · consentimiento ("He leído y acepto la política de privacidad.") · `button` "Enviar mensaje".
   - **Datos**: dirección completa, teléfonos, correo, y `.map-box`: caja de 4:3 con borde 1 px `--line`, fondo `--violet-100`, roseta central al 12 % de opacidad, dirección en grande y `a.btn--ghost` "Abrir en Google Maps" → `https://www.google.com/maps/search/?api=1&query=Calle+Recogidas+13,+18005+Granada` (`target="_blank" rel="noopener"`). **Ningún iframe.** Nota para el ejecutor: si más adelante se sustituye por una imagen estática, va en `assets/brand/map-recogidas.png` con `alt="Plano de la zona de Calle Recogidas 13, Granada"`; hoy no existe, se queda la caja.
   - Horario: `[DATO A CONFIRMAR: horario de atención]`.
5. Footer + FAB + cookies.

### 3.5 `vende-tu-casa.html`
1. Header. 2. Breadcrumb.
3. Héroe corto (índigo, sin foto): `h1` "Vende tu casa en Granada sin sorpresas" + lead "Llevamos vendiendo en esta ciudad desde 1970. Sabemos lo que se paga de verdad en tu calle, no lo que dice un portal." + `a.btn--red` "Pedir valoración" (ancla a `#valoracion`).
4. **Los tres pasos** (`h2` "Cómo trabajamos"), tres bloques numerados con cifra display en `--violet-600`:
   1. "Valoramos" — "Vemos la vivienda, la comparamos con ventas cerradas en tu zona y te damos un precio realista por escrito."
   2. "Preparamos y publicamos" — "Fotos, documentación y publicación. Filtramos las visitas para que solo entre gente que puede comprar."
   3. "Cerramos" — "Negociamos la oferta y te acompañamos hasta la notaría, con los gastos claros desde el primer día."
5. **Formulario de valoración** (`section#valoracion`, `name="valoracion"`, fondo `--violet-100`, contenedor estrecho):
   - `h2` "Cuéntanos cómo es tu vivienda"
   - Campos: Dirección o zona (obligatorio) · Tipo de vivienda (`select`: Piso / Ático / Casa o chalet / Pareado / Casa de campo / Local / Otro) · Metros construidos (`type="number" inputmode="numeric"`, obligatorio) · Dormitorios (`select` 1–5+) · Estado (`select`: A reformar / Buen estado / Reformado / Entrar a vivir) · Nombre y apellidos (obligatorio) · Teléfono (obligatorio) · Correo electrónico (obligatorio) · consentimiento · `button.btn--red` "Solicitar valoración gratuita".
   - Bajo el botón, `--fs-xs`: "Sin coste y sin compromiso. Usamos tus datos solo para responderte a esta solicitud."
6. **Cierre de confianza**: "55 años vendiendo en Granada" + enlace a `sobre-nosotros.html`.
7. Footer + FAB + cookies.
Móvil: los tres pasos apilados; el formulario a una columna con campos de 48 px; el botón rojo se mantiene a ancho completo.

### 3.6 `sobre-nosotros.html`
1. Header. 2. Breadcrumb.
3. `h1`: "Una inmobiliaria de Granada desde 1970" · entradilla: "Cambiamos la imagen en 2026. La dirección, el teléfono y la forma de trabajar siguen siendo los mismos."
4. **Línea de tiempo** (`h2` "Nuestra historia"), lista vertical con rombo violeta por hito; solo hechos verificados:
   - **1970** — "Abre Inmobiliaria Grande en Granada. Desde entonces no hemos dejado de trabajar en la ciudad y su provincia."
   - **Calle Recogidas 13** — "Oficina en el primero A, en el centro comercial de Granada." `[DATO A CONFIRMAR: año en que la oficina se traslada a Recogidas 13]`
   - **2026** — "Renovamos la marca: la roseta nazarí, el gallo y la firma 'Desde 1970' recogen lo que somos."
   - `[DATO A CONFIRMAR: relevo generacional, número de operaciones cerradas, tamaño del equipo, premios o colegiación]` — un bloque visible en la maqueta, con estilo de nota, para que el cliente lo rellene.
5. **La marca** (`h2` "Qué significa nuestro logo"): roseta SVG grande + texto "La roseta es un guiño a la tracería nazarí de la Alhambra: cuatro rombos alrededor de un centro, como cuatro paredes alrededor de una casa. El gallo es el carácter, y el laurel acompaña a 'Desde 1970'."
6. **Equipo**: ficha de Javier Corpas (agente inmobiliario, 622 350 918) y José Antonio Grande (propietario). `[DATO A CONFIRMAR: cargos, fotografías y resto del equipo]`. Sin fotos inventadas: hueco con roseta al 12 %.
7. Franja CTA: "¿Quieres que valoremos tu casa?" + `a.btn--red`.
8. Footer + FAB + cookies.

### 3.7 `404.html`
`h1` "Esta página no existe" · texto "Puede que la vivienda ya se haya vendido o que la dirección esté mal escrita. Desde aquí sigues teniendo todo a mano." · dos botones: `a.btn--indigo` "Ver viviendas en venta" (`inmuebles.html`) y `a.btn--ghost` "Ir a la portada" · línea final "Si venías de un anuncio, llámanos al 958 25 24 61 y te decimos qué pasó con esa vivienda." Header y footer completos, roseta grande al 8 % de fondo. `<meta name="robots" content="noindex">`.

### 3.8 `gracias.html`
Página de destino de los tres formularios (Netlify `action`). `h1` "Hemos recibido tu mensaje" + "Gracias por escribirnos. Nos ponemos en contacto contigo lo antes posible. Si tienes prisa, llámanos al 958 25 24 61." + botones "Volver a la portada" / "Ver viviendas". `noindex`.

### 3.9 Páginas legales (usted, `--container-narrow`, `h1` único y `h2` por apartado)
- **`aviso-legal.html`** — `h1` "Aviso legal". Apartados: Datos identificativos del titular (razón social `[DATO A CONFIRMAR]`, CIF `[DATO A CONFIRMAR]`, domicilio Calle Recogidas 13, 1.º A, 18005 Granada, teléfono 958 25 24 61, correo info@inmobiliariagrande.com, datos registrales `[DATO A CONFIRMAR]`) · Objeto y ámbito · Condiciones de uso ("El acceso a este sitio web implica que usted acepta las presentes condiciones.") · Propiedad intelectual e industrial · Exención de responsabilidad sobre la información de los inmuebles ("Los datos de superficie, año de construcción y precio son orientativos y no tienen carácter contractual; se facilitan a título informativo y deben verificarse antes de cualquier operación.") · Enlaces a terceros · Legislación aplicable y jurisdicción (Granada).
- **`privacidad.html`** — `h1` "Política de privacidad". Tabla RGPD: Responsable `[DATO A CONFIRMAR: razón social y CIF]`, Calle Recogidas 13, 1.º A, 18005 Granada, info@inmobiliariagrande.com · Finalidad: "Atender su solicitud de información, gestionar la visita a un inmueble o elaborar la valoración de su vivienda." · Legitimación: consentimiento del interesado (art. 6.1.a RGPD) y aplicación de medidas precontractuales (art. 6.1.b) · Destinatarios: "No se ceden datos a terceros salvo obligación legal. Los formularios se procesan a través de Netlify, Inc., proveedor de alojamiento web `[DATO A CONFIRMAR: acuerdo de encargado de tratamiento]`." · Conservación: "Mientras dure la relación y, después, durante los plazos legales de prescripción." · Derechos: "Puede usted ejercer los derechos de acceso, rectificación, supresión, oposición, limitación y portabilidad escribiendo a info@inmobiliariagrande.com, adjuntando copia de un documento identificativo. Asimismo, puede reclamar ante la Agencia Española de Protección de Datos (www.aepd.es)."
- **`cookies.html`** — `h1` "Política de cookies". Qué son · Cookies que utiliza este sitio: tabla con una fila real, `cookie-choice` (almacenamiento local, técnica, finalidad "recordar su elección sobre cookies", duración "hasta que borre los datos del navegador") · "Este sitio no utiliza cookies de analítica, publicidad ni redes sociales." · Cómo desactivarlas en Chrome, Firefox, Safari y Edge (texto, sin enlaces rotos) · "Si en el futuro se incorporan cookies de terceros, se solicitará de nuevo su consentimiento." Nunca la palabra "PORTAL".

---

## 4. Estructura de ficheros

```
inmobiliaria-grande/
├── index.html
├── inmuebles.html
├── contacto.html
├── vende-tu-casa.html
├── sobre-nosotros.html
├── gracias.html
├── 404.html
├── aviso-legal.html
├── privacidad.html
├── cookies.html
├── robots.txt                 # Allow: /  + Sitemap:
├── sitemap.xml                # 18 URLs, generado por el script
├── netlify.toml               # publish = "."  + [build.processing.html] pretty_urls = false
├── css/
│   └── styles.css             # único CSS, ~900 líneas, orden: tokens → reset → base → layout → componentes → utilidades → media queries
├── js/
│   └── main.js                # único JS, ES2019, sin módulos, cargado con <script defer src="js/main.js">
├── data/
│   └── listings.json          # ya existe, NO se modifica
├── templates/
│   └── listing.html           # plantilla con marcadores {{TOKEN}}
├── scripts/
│   └── build-listings.mjs     # dev tool: node scripts/build-listings.mjs
├── inmuebles/                 # salida del script, COMMITEADA
│   ├── atico-duplex-centro-granada-rafael-original.html
│   ├── piso-el-serrallo-granada-fh03130.html
│   ├── pareado-calle-madrid-monachil-rgc-0093.html
│   ├── piso-villarejo-granada-rpa-ronda202.html
│   ├── piso-pulianillas-pulianas-gr26-09.html
│   ├── casa-de-campo-sierra-de-huetor-cogollos-de-la-vega-v1028.html
│   ├── pareado-centro-la-malaha-rpa-lamalaha.html
│   └── piso-alcampo-granada-rgc-0091.html
├── assets/                    # ya existe
│   ├── brand/{logo,rosette,favicon-32,icon-192,icon-512,apple-touch-icon}.png
│   └── photos/<id>/{1..6}.jpg + {1..6}-s.jpg
├── design/
│   └── artboards/             # entregable del ejecutor A, no forma parte del sitio
│       ├── 01-home-desktop.html
│       ├── 02-home-mobile.html
│       ├── 03-listing-index.html
│       ├── 04-listing-detail.html
│       ├── 05-forms.html
│       └── 06-components.html
└── docs/                      # ya existe (BRAND.md, audit/)
```

Todos los enlaces son **relativos y con extensión `.html`** (`inmuebles.html`, `inmuebles/<slug>.html`, `../index.html` desde las fichas). `pretty_urls = false` en `netlify.toml` evita el conflicto entre `inmuebles.html` y el directorio `inmuebles/`.

**`scripts/build-listings.mjs`** (Node ≥18, sin dependencias): lee `data/listings.json` y `templates/listing.html`, y por cada inmueble sustituye los marcadores `{{TITLE}} {{META_DESC}} {{CANONICAL}} {{OG_IMAGE}} {{H1}} {{ZONE}} {{CITY}} {{PROVINCE}} {{PRICE_FMT}} {{PRICE_RAW}} {{REF}} {{BADGE}} {{GALLERY}} {{FIGURES}} {{DESCRIPTION}} {{LEGAL_NOTE}} {{FEATURES}} {{ENERGY}} {{JSONLD}} {{PHOTO_COUNT}}`. Reglas: escapar HTML de todo campo de texto; formatear precios con `Intl.NumberFormat('es-ES')`; omitir bloques cuyo dato sea `null` (no imprimir "null" ni "0"); separar los párrafos legales según §3.3-6; eliminar emojis con `/\p{Extended_Pictographic}/gu`. Escribe también `sitemap.xml`. Falla ruidosamente (`process.exit(1)` con mensaje) si falta una foto en disco o un campo obligatorio (`slug`, `title`, `price`, `photos[0]`). El script es herramienta de desarrollo: el HTML generado se commitea y el despliegue no ejecuta nada.

**`js/main.js`** — cuatro funciones independientes, cada una salta si su nodo no existe (`initNav`, `initFilters`, `initCookieBanner`, `initForms`), más `initGallery` en las fichas. Sin dependencias, sin `innerHTML` con datos de usuario, sin `eval`. Los parámetros de la URL (`?op&type&zone&pmax`) del buscador del héroe se leen en `initFilters` para preseleccionar los `select` de `inmuebles.html` y aplicar el filtro al cargar.

---

## 5. Checklist de `<head>` por página

Común a todas: `<!doctype html>`, `<html lang="es">`, `<meta charset="utf-8">`, `<meta name="viewport" content="width=device-width, initial-scale=1">` (**sin** `user-scalable=no`), `<link rel="canonical" href="https://www.inmobiliariagrande.com/<ruta>">`, las tres etiquetas de fuentes (§1), `<link rel="stylesheet" href="css/styles.css">`, `<script defer src="js/main.js"></script>`, y:

```html
<link rel="icon" href="assets/brand/favicon-32.png" sizes="32x32">
<link rel="icon" href="assets/brand/icon-192.png" sizes="192x192">
<link rel="apple-touch-icon" href="assets/brand/apple-touch-icon.png">
<meta name="theme-color" content="#2B2350">
<meta property="og:type" content="website">
<meta property="og:site_name" content="Inmobiliaria Grande">
<meta property="og:locale" content="es_ES">
<meta property="og:title" content="…"><meta property="og:description" content="…">
<meta property="og:url" content="…"><meta property="og:image" content="https://www.inmobiliariagrande.com/assets/brand/icon-512.png">
<meta name="twitter:card" content="summary_large_image">
```
(en fichas, `og:type` = `article` y `og:image` = la foto 1 del inmueble en URL absoluta).
**Nunca** `<meta name="keywords">`, ni `<meta name="author" content="www.inmovilla.com">`.

| Página | `<title>` | `<meta name="description">` |
|---|---|---|
| `index.html` | Inmobiliaria en Granada desde 1970 \| Inmobiliaria Grande, Granada | Pisos, áticos y casas en venta en Granada y su provincia. Inmobiliaria de barrio desde 1970, en Calle Recogidas 13. Valoramos tu vivienda sin compromiso. |
| `inmuebles.html` | Viviendas en venta \| Inmobiliaria Grande, Granada | Todas nuestras viviendas en venta en Granada capital, Monachil, Pulianas, La Malahá y Cogollos de la Vega. Filtra por tipo, zona, precio y dormitorios. |
| ficha | {type} en {zone}, {city} · {price} € \| Inmobiliaria Grande, Granada | {type} en {zone}, {city}. {rooms} dormitorios, {baths} baños y {surface_built_m2} m² construidos por {price} €. Ref. {ref}. Concierta tu visita. |
| `contacto.html` | Contacto \| Inmobiliaria Grande, Granada | Oficina en Calle Recogidas 13, 1.º A, 18005 Granada. Teléfono 958 25 24 61 y WhatsApp. Escríbenos y te contestamos lo antes posible. |
| `vende-tu-casa.html` | Vende tu casa \| Inmobiliaria Grande, Granada | Valoramos tu piso o tu casa en Granada gratis y sin compromiso. 55 años vendiendo en la capital y en la vega. Cuéntanos cómo es tu vivienda. |
| `sobre-nosotros.html` | Sobre nosotros \| Inmobiliaria Grande, Granada | Inmobiliaria Grande abrió en Granada en 1970 y sigue en Calle Recogidas 13. En 2026 renovamos la marca con la roseta nazarí y el gallo. |
| `aviso-legal.html` | Aviso legal \| Inmobiliaria Grande, Granada | Aviso legal y condiciones de uso del sitio web de Inmobiliaria Grande, Calle Recogidas 13, 1.º A, 18005 Granada. |
| `privacidad.html` | Política de privacidad \| Inmobiliaria Grande, Granada | Cómo tratamos sus datos personales cuando nos escribe o solicita la valoración de su vivienda, y cómo ejercer sus derechos. |
| `cookies.html` | Política de cookies \| Inmobiliaria Grande, Granada | Este sitio solo usa una cookie técnica para recordar su elección. No hay cookies de publicidad ni de terceros. |
| `404.html` (`noindex`) | Página no encontrada \| Inmobiliaria Grande, Granada | La página que buscas no existe. Vuelve a la portada o consulta las viviendas en venta en Granada y provincia. |
| `gracias.html` (`noindex`) | Mensaje enviado \| Inmobiliaria Grande, Granada | Hemos recibido tu mensaje y nos pondremos en contacto contigo lo antes posible. |

**JSON-LD.** En `index.html`, un `RealEstateAgent`: `name`, `url`, `image` (logo absoluto), `telephone: "+34958252461"`, `email`, `address` (`PostalAddress`: `Calle Recogidas 13, 1.º A` / `Granada` / `18005` / `ES`), `foundingDate: "1970"`, `areaServed: {"@type":"AdministrativeArea","name":"Granada"}`. **Sin** `openingHours` ni `aggregateRating` (no hay dato).
En cada ficha, `RealEstateListing` con `name`, `url`, `description` (primer párrafo limpio), `image` (array absoluto de las 6 fotos), `numberOfRooms`, `numberOfBathroomsTotal`, `floorSize` (`QuantitativeValue`, `unitCode: "MTK"`), `address` (`PostalAddress` con `addressLocality: {city}`, `addressRegion: "Granada"`), y `offers` (`Offer`: `price` numérico sin separadores, `priceCurrency: "EUR"`, `availability` = `https://schema.org/InStock` o `https://schema.org/LimitedAvailability` si `status === "reservado"`, `seller` → referencia al `RealEstateAgent`).

---

## 6. Reglas de accesibilidad (bloqueantes)

1. `a.skip-link` como primer elemento del `body`: "Saltar al contenido", oculto fuera de pantalla y visible al recibir foco, apunta a `#main`. Cada página tiene `<main id="main">`.
2. Un solo `h1` por página; jerarquía `h1 → h2 → h3` sin saltos. Nada de `h1` en tarjetas.
3. Anillo de foco visible siempre: `:focus-visible { outline: var(--focus); outline-offset: var(--focus-offset); }`, y `--focus-on-dark` sobre índigo. Prohibido `outline: none` sin sustituto.
4. Todas las `img` con `alt`: las de inmuebles usan literalmente el campo `alt` del JSON; logo "Inmobiliaria Grande, desde 1970"; ornamentos decorativos como SVG con `aria-hidden="true"` y `focusable="false"`.
5. Toda `img` con `width` y `height` explícitos y `loading="lazy"` salvo la del héroe y la principal de la galería.
6. Todo control de formulario con `<label for>` asociado (nunca solo `placeholder`); los `select` del filtro también. `fieldset` + `legend` en los grupos del formulario de valoración.
7. Objetivos táctiles ≥ 44×44 px (botones, enlaces del menú, miniaturas de galería, checkbox con área ampliada).
8. Contraste AA verificado con los valores de BRAND.md: índigo-900 sobre paper 12,9:1 · ink-muted sobre paper 6,1:1 · blanco sobre rooster-red 5,9:1 · blanco sobre indigo-700 10,3:1. `--violet-400` y `--gold-400` **nunca** como color de texto sobre `--paper`.
9. Menú operable con teclado: el `nav-toggle` es un `<button>` real con `aria-expanded`; `Esc` cierra y devuelve el foco; el foco no queda atrapado; sin `href="#"` en ningún sitio.
10. Errores anunciados: `aria-invalid`, `aria-describedby`, resumen con `role="alert"`, éxito con `role="status"`, contador de resultados con `aria-live="polite"`.
11. `@media (prefers-reduced-motion: reduce) { *, *::before, *::after { animation-duration:.01ms !important; transition-duration:.01ms !important; scroll-behavior:auto !important; } }` y sin `scale` en hover de tarjeta.
12. Galería: cada miniatura es un `button` con `aria-label` propio y `aria-current` en la activa; cambio de foto anunciado por el `alt` actualizado.
13. Objetivo medible: Lighthouse móvil ≥ 95 en Accesibilidad y SEO, y 0 errores en axe DevTools, en las cinco páginas de plantilla distinta.

---

## 7. Pasos de implementación (orden para el ejecutor B)

1. `css/styles.css`: tokens, reset, base tipográfica, contenedores, utilidades (`.container`, `.section`, `.visually-hidden`, `.stack`).
2. Componentes globales en CSS + HTML de referencia: header, footer, botones, banner de cookies, FAB.
3. `index.html` completa (héroe, buscador, 4 tarjetas escritas a mano copiando datos del JSON, banda de captación, franja de 55 años, franja de contacto).
4. `js/main.js`: `initNav`, `initCookieBanner`.
5. `inmuebles.html` con las 8 tarjetas y la `filterbar`; luego `initFilters` (incluye lectura de query params).
6. `templates/listing.html` + `scripts/build-listings.mjs`; generar las 8 fichas y `sitemap.xml`; revisar a mano las 8 salidas (acentos, emojis eliminados, párrafos legales movidos, energía nula).
7. `initGallery`, `initForms` (validación) sobre la ficha ya generada.
8. `vende-tu-casa.html`, `contacto.html`, `gracias.html`.
9. `sobre-nosotros.html`, `404.html`.
10. `aviso-legal.html`, `privacidad.html`, `cookies.html`.
11. `robots.txt`, `netlify.toml`, JSON-LD, OG y canónicas de todas las páginas.
12. Pasada final: Lighthouse móvil, axe, teclado, y verificación de los 8 criterios de la §0.

**Ejecutor A (artboards)** usa los mismos tokens en un `<style>` embebido por artboard (no enlaza `css/styles.css`, para que las maquetas sean autocontenidas), lienzo de 1440 px salvo `02-home-mobile.html` que es de 375 px, fotos reales de `assets/photos/` con rutas relativas `../../assets/...`, y texto real de este plan. `06-components.html` muestra la paleta con sus hex, la escala tipográfica, los botones en sus cuatro estados, la tarjeta normal y la "Reservado", los campos en reposo/foco/error, el banner de cookies, el footer y la roseta en sus cuatro usos.

---

## 8. Estrategia de pruebas

- **Estructura**: por cada página, `grep -c '<h1'` = 1; títulos y descripciones únicos (`grep -h '<title>' *.html inmuebles/*.html | sort | uniq -d` sin salida); `grep -c 'href="#"'` = 0.
- **Generador**: ejecutar `node scripts/build-listings.mjs` dos veces seguidas y comprobar que `git status` queda limpio la segunda (salida determinista); comprobar que la ficha de `29965705` no imprime bloque de energía, que la de `30002664` mueve 7 párrafos al `<details>` legal, y que la de `29899079` muestra el badge "Reservado" y `LimitedAvailability` en el JSON-LD.
- **Filtro cliente**: con JS activo, "Piso" + "Hasta 175.000 €" deja 2 resultados (Pulianillas 155.000 y Alcampo 169.900); "Casa de campo" deja 1; combinación imposible muestra el bloque vacío. Con JS desactivado, se ven las 8.
- **Formularios**: enviar vacío (3+ errores, foco en el primero), email `hola@`, teléfono `123`, consentimiento sin marcar; verificar `aria-invalid` y el mensaje exacto; con todo correcto, el navegador hace POST a Netlify (comprobable en el panel de Forms tras el despliegue) y aterriza en `gracias.html`.
- **Rendimiento**: Lighthouse móvil en home y ficha con el mismo comando del audit; objetivo Performance ≥ 90, LCP < 2,5 s, CLS < 0,05, y transferencia total de la ficha < 900 KiB (hoy 3 743 KiB). Verificar `loading="lazy"` en todas las imágenes menos dos por página.
- **Accesibilidad**: axe DevTools sin errores; recorrido completo con teclado en home, listado y ficha (menú, filtro, galería, formulario); zoom al 200 % sin desbordamiento horizontal a 375 px.
- **Enlaces**: `npx -y linkinator . --recurse --skip 'fonts.googleapis|wa.me|google.com/maps'` sin roturas.
- **Despliegue**: `netlify deploy --dir=.` o arrastrar la carpeta; comprobar que `/inmuebles.html` y `/inmuebles/piso-alcampo-granada-rgc-0091.html` responden 200 y que `/no-existe` sirve `404.html`.

---

## 9. Preguntas abiertas (bloquean solo lo indicado)

1. **Teléfono principal**: BRAND.md lista 958 25 24 61 (oficina), 622 350 918 y 622 350 918 (web actual). *Recomendación: 958 25 24 61 en header y footer, 622 350 918 en fichas y WhatsApp, y descartar el 622 hasta que el cliente lo confirme.*
2. **Datos societarios** (razón social, CIF, datos registrales, DPO) para aviso legal y privacidad. *Recomendación: publicar con `[DATO A CONFIRMAR]` visible y pedirlos antes de apuntar el dominio.*
3. **`gracias.html`** no estaba en la lista de páginas, pero Netlify Forms necesita un destino propio para que el envío funcione sin JS. *Recomendación: incluirla (ya está en el plan).*
4. **Horario de oficina** para la home, contacto y el JSON-LD `openingHours`. *Recomendación: omitir el campo hasta tenerlo; nunca inventarlo.*
5. **Alquiler**: `listings.json` solo tiene `operation: "venta"`. *Recomendación: dejar la opción "Alquiler" deshabilitada en el buscador con la etiqueta "(próximamente)".*
6. **Dominio final** para canónicas y OG: se asume `https://www.inmobiliariagrande.com/`. *Recomendación: mantenerlo; si el despliegue de fase 1 va a un subdominio de Netlify, el script debe recibir la base por variable de entorno `SITE_URL`.*

---

## 10. Reparto entre ejecutores

- **A — Artboards.** Objetivo: 6 mockups HTML autocontenidos en `design/artboards/` según §1, §2 y §3. Ficheros: solo dentro de `design/artboards/`. Hecho cuando: los 6 abren en el navegador a 1440 (y 375 el segundo) usando fotos reales y el copy literal de este plan, sin CSS externo salvo Google Fonts.
- **B — Sitio de producción.** Objetivo: §4 completo siguiendo el orden de §7. Ficheros: raíz, `css/`, `js/`, `templates/`, `scripts/`, `inmuebles/`. No tocar: `data/listings.json`, `assets/`, `docs/`. Hecho cuando: pasan todas las comprobaciones de §8 y los 8 criterios de §0.
