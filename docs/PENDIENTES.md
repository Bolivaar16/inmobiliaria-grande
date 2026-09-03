# Datos pendientes de confirmar con el cliente

Todo lo que el prototipo afirma y no está verificado lleva la marca `[DATO A CONFIRMAR]` en el
HTML, bien visible o en un comentario junto a la cifra. Buscar en el código:
`grep -rn "A CONFIRMAR" src/ templates/`.

## Resuelto el 2026-09-03 (revisión con Alex)

| Cifra | Decisión |
|---|---|
| 300 propiedades | Cambiada a **276**, el dato real de la web actual (2026-09-03) |
| 17 idiomas | Sustituida por **«ES · EN, atención en español e inglés»**, lo único verificable |
| 3 generaciones | **Se mantiene**; confirmado por Alex |
| 48 h para la valoración | **Se mantiene** como compromiso de servicio propuesto (no es un dato histórico) |
| Equipo | Fotos, cargos y frases **tomados de la web actual**: José Antonio Grande (Gerente), José Grande Jr., Mónica y Javier Corpas (agentes) |
| Héroe de la home | **Imagen generada con IA** (Higgsfield, Nano Banana Pro, 2026-09-03): vista del Albaicín con la Alhambra al atardecer. Placeholder de prototipo, no es una foto real. La foto de la oficina sigue en `assets/hero-oficina.*` |
| Banner Grupo Inmobiliario de Granada | Recuperado de la web actual, sin enlace (la web actual tampoco lo tiene) |

## Sigue pendiente

- **Apellidos de Mónica** y confirmación de los cargos exactos.
- **Año del traslado a Recogidas 13** (timeline de sobre-nosotros / about-us).
- **Horario L–V 9:30–20:00**: tomado de un directorio (oopiniones.com), no del cliente.
- **Foto del héroe definitiva** (2400×1350). La actual (`assets/hero-granada.*`) está **generada con IA**
  y es un placeholder: no puede publicarse como si fuera una fotografía de la agencia. Antes de
  desplegar hay que sustituirla por una foto real (fachada, vistas u oficina) o, si el cliente acepta
  una imagen generada, dejarlo por escrito y etiquetarla como ilustración.
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
