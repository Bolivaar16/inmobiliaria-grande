# Datos pendientes de confirmar con el cliente

Todo lo que el prototipo afirma y no está verificado lleva la marca `[DATO A CONFIRMAR]` en el
HTML, **siempre como comentario junto al dato** (desde el 2026-09-04 ninguna marca es visible
para el usuario; el texto se redactó sin el dato que falta). Buscar en el código:
`grep -rn "A CONFIRMAR" src/ templates/`.

## Resuelto el 2026-09-03 (revisión con Alex)

| Cifra | Decisión |
|---|---|
| 300 propiedades | Cambiada a **276**, el dato real de la web actual (2026-09-03), y de ahí a **«+250»** en el texto visible: una cifra exacta envejece en cuanto entra o sale un anuncio |
| 17 idiomas | Sustituida por **«ES · EN, atención en español e inglés»**, lo único verificable |
| 3 generaciones | **Se mantiene**; confirmado por Alex |
| 48 h para la valoración | **Se mantiene** como compromiso de servicio propuesto (no es un dato histórico) |
| Equipo | Fotos, cargos y frases **tomados de la web actual**: José Antonio Grande (Gerente), José Grande Jr., Mónica y Javier Corpas (agentes) |
| Héroe de la home | **Imagen generada con IA** (Higgsfield, Nano Banana Pro, 2026-09-03): vista del Albaicín con la Alhambra al atardecer. Placeholder de prototipo, no es una foto real. La foto de la oficina sigue en `assets/hero-oficina.*` |
| Banner Grupo Inmobiliario de Granada | Recuperado de la web actual, sin enlace (la web actual tampoco lo tiene) |
| Horario | **Resuelto**: la ficha de Google del negocio da jornada partida, **lunes a viernes 9:30–14:00 y 17:00–20:30**, sábado y domingo cerrado. Sustituye al horario corrido que venía de oopiniones.com. Actualizados pie, contacto, `gracias`, `vende-tu-casa`, el `openingHours` del JSON-LD y la franja de tarde de los formularios de «nosotros le llamamos» (16:00–20:00 → 17:00–20:30) |
| Código postal | **18008**, el que da la misma ficha de Google; el anterior venía del mismo directorio de terceros y era incorrecto. Corregido en pie, contacto, aviso legal, privacidad, cookies, `llms.txt`, el JSON-LD y las URLs del mapa |
| Reseñas de Google | **4,3 sobre 5 con 65 reseñas** (ficha de Google, 2026-09-03). Publicadas dos citas literales en el index, firmadas con nombre + inicial. No se reproduce la reseña negativa ni la respuesta del propietario |
| Menú principal | De 7 a **5 elementos**: «Comprar», «Alquilar» y «Locales» se funden en **«Buscar inmueble»** sin preset. Los filtros siguen en la página de inmuebles y el pie conserva los accesos directos con `?op=` |
| Filtros del index | Retiradas las píldoras «Todas / Venta / Alquiler» de «Recién incorporadas»: la selección es curada, no una rejilla filtrable. Con ellas se fue el estado vacío que activaban y el `initHomeFilter()` de `js/main.js` |
| Paginación | La página de inmuebles muestra **9 por página** (`data-per-page` en el `<ol class="pagination">`); el número de página viaja en la query como `p` y cualquier cambio de filtro vuelve a la primera |

## Sigue pendiente

- **Apellidos de Mónica** y confirmación de los cargos exactos.
- **Año del traslado a Recogidas 13** (timeline de sobre-nosotros / about-us).
- **Enlace directo a las reseñas de Google**: el bloque del index enlaza a la búsqueda de la
  ficha (`maps/search/?api=1&query=…`) porque no tenemos el `place_id`. Con él, el enlace puede
  apuntar directamente a la pestaña de reseñas.
- **Foto del héroe definitiva** (2400×1350). La actual (`assets/hero-granada.*`) está **generada con IA**
  y es un placeholder: no puede publicarse como si fuera una fotografía de la agencia. Antes de
  desplegar hay que sustituirla por una foto real (fachada, vistas u oficina) o, si el cliente acepta
  una imagen generada, dejarlo por escrito y etiquetarla como ilustración.
- **Coordenadas de los 15 inmuebles nuevos**: aproximadas al centro del barrio o del municipio,
  igual que las anteriores (`data/geo.json`). Cuatro llevan la del municipio porque la web original
  no da zona o la da inservible («South of spain»).
- **Rebajas**: solo dos inmuebles las tienen, y son las que marca la web original (ático dúplex
  360.000 → 339.900, El Serrallo 295.000 → 275.000). No se ha inventado ninguna otra. Si el cliente
  quiere más, tiene que darlas él.
- **Peso de las fotos**: 23 inmuebles × 10 fotos = ~88 MB en `assets/photos/`. El fallback JPEG a
  1400 px (150 KB de media) es la mayor parte y casi ningún navegador lo usa, porque `<picture>`
  sirve WebP primero. Se puede bajar mucho si el peso del repo molesta.
- **Logo vectorial** (emblema y wordmark). El PNG actual es un recorte de la tarjeta fotografiada.
- **Textos legales**: razón social, CIF y datos registrales; acuerdo de encargado de tratamiento con
  Netlify si se despliega allí; política de honorarios («pactados por escrito y con factura»).
- **Coordenadas del mapa**: aproximadas al centro del barrio/municipio (`data/geo.json`); la web
  actual no publica posiciones exactas. Si el cliente quiere pines exactos, hay que pedírselas.
- **Enlace del Grupo Inmobiliario de Granada**, si la asociación tiene web.

## Funciones que dependen del cliente

- Alquileres y traspasos: el menú y los filtros ya los contemplan, pero no hay ningún anuncio de
  alquiler ni de traspaso en `data/listings.json`.
- Cartera completa: el prototipo lleva 8 de los 276 anuncios. Importar el resto es un trabajo de
  datos (`data/listings.json`, `data/geo.json` y fotos) independiente del diseño.
- Versión inglesa: interfaz, titulares y páginas de marca traducidos; las descripciones largas de
  cada inmueble siguen en español con `lang="es"`, y los textos legales también.
