# Datos pendientes de confirmar con el cliente

Todo lo que el prototipo afirma y no está verificado lleva la marca `[DATO A CONFIRMAR]` (o
`[FOTO A CONFIRMAR]`) en el HTML, bien visible o en un comentario junto a la cifra. Antes de
publicar hay que cerrar esta lista. Buscar en el código: `grep -rn "A CONFIRMAR" src/ templates/`.

## Cifras del mockup (home, vender, sobre-nosotros)

| Cifra | Dónde aparece | Estado |
|---|---|---|
| 300 propiedades en cartera / activas | héroe, bloque familia, bloque vender | La web actual publica 276 anuncios (2026-09-03). Confirmar o cambiar a 276 |
| 17 idiomas atendidos | bloque familia, sobre-nosotros | La web actual muestra 15 banderas de traducción automática; ¿se atiende de verdad en 17? |
| 3 generaciones | bloque familia, vender, sobre-nosotros | La web actual presenta a José Antonio Grande y José Grande Jr.; falta confirmar la tercera |
| 48 h para la valoración | home, vender | Compromiso de servicio propuesto; el cliente debe aceptarlo |
| 55 años en Granada / en Recogidas 13 | varios | 1970 está en la tarjeta; el año del traslado a Recogidas 13 no |
| Horario L–V 9:30–20:00 | pie, contacto | Tomado de un directorio (oopiniones.com), no del cliente |

## Equipo

Nombres y cargos tomados de la web actual (José Antonio Grande, José Grande Jr., Mónica, Javier
Corpas). Faltan apellidos de Mónica, cargos exactos y cuatro retratos (260 px de alto en la
tarjeta, formato 3:4, JPEG < 80 KB cada uno).

## Fotografías

- Héroe de la home: fachada del Albaicín o vistas a Sierra Nevada, 2400×1350, JPEG < 250 KB.
  Sustituir el patrón por `<img class="hero__photo" …>` según el comentario en `src/es/index.html`.
- Foto del equipo en la oficina (opcional, sección «La casa»).
- Logo vectorial (emblema y wordmark). El PNG actual es un recorte de la tarjeta fotografiada.

## Textos legales

- Razón social, CIF y datos registrales (aviso legal, privacidad).
- Acuerdo de encargado de tratamiento con Netlify (formularios) si se despliega allí.
- Política de honorarios («pactados por escrito y con factura» en vende-tu-casa): confirmar.

## Funciones que dependen del cliente

- Alquileres y traspasos: el menú y los filtros ya los contemplan, pero no hay ningún anuncio de
  alquiler ni de traspaso en `data/listings.json`. Añadir cuando el cliente los facilite.
- Cartera completa: el prototipo lleva 8 de los 276 anuncios. Importar el resto es un trabajo de
  datos (`data/listings.json` + fotos) independiente del diseño.
- Versión inglesa: interfaz y titulares traducidos; las descripciones largas de cada inmueble
  siguen en español con `lang="es"`. Traducirlas es tarea de contenido.
