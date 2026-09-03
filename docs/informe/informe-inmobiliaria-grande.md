---
title: "Inmobiliaria Grande: auditoría de la web actual y propuesta de web nueva"
subtitle: "Preparado para José Antonio Grande, Inmobiliaria Grande (Granada)"
author: "Alejandro Bolívar"
recipient: "José Antonio Grande, Inmobiliaria Grande"
footer-label: "INMOBILIARIA GRANDE · AUDITORÍA Y PROPUESTA WEB"
date: "3 de septiembre de 2026"
accent: "2B2350"
accent-bg: "EEE9F5"
tags:
  - "Auditoría"
  - "Prototipo"
  - "Presupuesto cerrado"
---


## Resumen para el dueño

He medido la velocidad, la presencia en Google y los formularios de su web actual, www.inmobiliariagrande.com. La web pierde clientes por cuatro motivos. Primero, es lenta y se ve desordenada en el móvil. Segundo, Google no la entiende bien: el título sale cortado, las descripciones están repetidas y los 55 años de historia no aparecen. Tercero, los caminos de contacto fallan: el menú lleva a páginas de error y los formularios muestran un aviso de privacidad sin terminar. Cuarto, los textos legales obligatorios están vacíos o hablan de otra empresa. Propongo una web nueva, ligera y ordenada, construida sobre su marca de 1970, de la que ya he preparado un prototipo que acompaña a este informe. El precio es cerrado: 1.200 euros más IVA, con un mantenimiento opcional de 40 euros al mes si quiere que yo me ocupe de ella, y puede ver el prototipo y decidir en las próximas semanas.

## 1. Móvil y rendimiento

Medido el 3 de septiembre de 2026 con Lighthouse 12.8.2 (la herramienta de Google) en emulación de móvil con conexión 4G lenta:

| Indicador | Portada | Ficha de un piso | Referencia de Google |
|---|---|---|---|
| Nota de rendimiento (sobre 100) | 41 | 26 | 90 o más |
| Contenido principal visible (LCP) | 6,5 s | 12,0 s | menos de 2,5 s |
| Responde al tacto (TTI) | 11,7 s | 18,5 s | menos de 3,8 s |
| Datos descargados | 1,4 MB en 115 peticiones | 3,7 MB en 184 peticiones | |


### 1.1 La portada tarda demasiado en abrirse en el móvil

- **Qué pasa:** En un móvil con conexión normal, lo principal de la portada tarda unos 6,5 segundos en verse y la página no responde al tacto hasta pasados casi 12 segundos.
- **Evidencia medida:** Lighthouse 12.8.2 en emulación móvil (4G lenta) sobre https://www.inmobiliariagrande.com/: rendimiento 41 sobre 100, LCP (Largest Contentful Paint, cuando se ve el contenido principal) 6,5 s, TTI (Time to Interactive, cuando responde al toque) 11,7 s, respuesta del servidor 710 ms. Comando: `npx -y lighthouse@12 https://www.inmobiliariagrande.com/ --preset=perf --form-factor=mobile`. Datos en docs/audit/home-mobile.json.
- **Qué le cuesta:** Quien busca piso compara varias agencias a la vez. Si su página no está lista, ese contacto se va a la siguiente pestaña.
- **Solución en la web nueva:** Portada ligera, con fotos comprimidas y pocos elementos, con el objetivo de mostrar lo principal en menos de 2,5 segundos; la cifra real se medirá tras el despliegue y se la entregaré por escrito.

### 1.2 La página de cada piso es aún más lenta

- **Qué pasa:** Cuando alguien abre la página de un inmueble (la ficha), la espera se hace mayor. El motivo principal es el peso de las fotos.
- **Evidencia medida:** Sobre la ficha del piso RGC-0091 (https://www.inmobiliariagrande.com/ficha/piso/granada/alcampo/8081/29899079/es/), Lighthouse en móvil da 26 sobre 100, LCP 12,0 s y TTI 18,5 s; la página mueve 3 743 KiB en 184 peticiones. Esa ficha tiene 42 fotos de 1920 por 1280 píxeles que suman 8 924 283 bytes (unos 8,5 MB), medidas con un bucle de `curl -w %{size_download}`. Resultado en docs/audit/ficha-mobile.json.
- **Qué le cuesta:** La ficha es donde el cliente decide llamar. Si la página no responde hasta los 18 segundos, la decisión se toma en otra web.
- **Solución en la web nueva:** Fichas ligeras en las que las fotos se cargan solo cuando el visitante las va viendo.

### 1.3 La portada se ve desordenada en el móvil

- **Qué pasa:** En pantalla estrecha, banderas amontonadas, buscador sobre las fotos y primeros pisos muy abajo.
- **Evidencia medida:** Captura con el móvil a 375 píxeles (docs/audit/current-home-375.png), tomada con `google-chrome --headless=new --window-size=375,2400 --screenshot`: 15 banderas en fila, buscador superpuesto a las fotos y primer inmueble bajo unos 1 300 píxeles de scroll.
- **Qué le cuesta:** Una primera impresión caótica resta credibilidad a quien busca una agencia seria para la compra de su casa.
- **Solución en la web nueva:** Diseño pensado para el móvil desde el principio, sin elementos que se pisen.

### 1.4 Tecnología antigua y carga innecesaria

- **Qué pasa:** La web usa un programa de servidor sin soporte desde hace años y carga muchos componentes que no necesita.
- **Evidencia medida:** `curl -sSI https://www.inmobiliariagrande.com/` devuelve `x-powered-by: PHP/5.6.40`; esa versión dejó de actualizarse el 31 de diciembre de 2018 (php.net/eol.php). El HTML de la portada tiene 23 hojas de estilo y 19 programas (comandos `grep -c '<link rel="stylesheet"'` y `grep -o '<script[^>]*src=' | wc -l`), incluido un reCAPTCHA de Google de 354 KB que se descarga en la portada antes de que nadie envíe nada, y 3 013 elementos según Lighthouse.
- **Qué le cuesta:** Las piezas sin soporte son un riesgo de seguridad, y el peso sobrante hace cada carga más lenta y difícil de mantener.
- **Solución en la web nueva:** Web construida desde cero, sin componentes de sobra y al día en seguridad.

## 2. SEO local y captación de clientes

### 2.1 En Google su marca sale cortada y la descripción se repite

- **Qué pasa:** En los resultados de Google, el título de su página aparece partido en el nombre de la empresa, y todas las páginas muestran la misma descripción genérica.
- **Evidencia medida:** El título de la portada, del listado y de la página de error es literalmente `Pisos en Granada | Inmobiliarias Granada | Inmobiliaria G...`, cortado en el propio código (comando `grep -o '<title>[^<]*'`). La descripción se repite en todas las páginas: "Inmobiliaria Grande con multitud de propiedades, pisos , chalet , casas, villas en todas las zonas…".
- **Qué le cuesta:** En la búsqueda no se entiende quién es ni qué ofrece; la marca aparece cortada en su propio nombre y no hay motivo para entrar.
- **Solución en la web nueva:** Un título y una descripción propios y completos para cada página.

### 2.2 Google no distingue lo importante de cada página

- **Qué pasa:** Cada página debe tener un titular principal claro (el llamado H1), pero la portada tiene 43 y los anuncios usan frases de cartel sin zona ni precio.
- **Evidencia medida:** La portada tiene 43 titulares principales (`grep -c '<h1'`). Los títulos de los anuncios son frases del agente como "!!GRAN PAREADO EN LA MALAHA!!!" o "…junto al metro en la zon..." (cortado). No hay datos estructurados JSON-LD (`grep -c 'application/ld+json'` da 0).
- **Qué le cuesta:** Google no puede mostrar sus anuncios con el detalle (precio, zona, metros) que permiten los datos estructurados, y un título como "!!GRAN PAREADO!!!" no coincide con lo que escribe quien busca "pareado en La Malahá".
- **Solución en la web nueva:** Un titular por página y anuncios con título uniforme (tipo, zona, ciudad y precio), con datos estructurados.

### 2.3 Sus 55 años de historia no aparecen en ninguna parte

- **Qué pasa:** Su mejor argumento, que están desde 1970, no se ve en la web, que incluso se describe como joven y sigue con el logotipo antiguo.
- **Evidencia medida:** La página de empresa dice "equipo profesional Joven y Dinámico… Una agencia joven". La palabra "1970" no aparece en la portada ni en la página de empresa (`grep -c 1970`, resultado 0). El logotipo antiguo se ve en docs/audit/current-home-375.png.
- **Qué le cuesta:** "Desde 1970" es lo que transmite confianza y arraigo en Granada. Sin ello, la agencia compite solo por anuncios y no por su reputación, que es su mayor ventaja.
- **Solución en la web nueva:** La historia de los 55 años será protagonista en "Sobre nosotros" y acompañará a la marca renovada por toda la web.

### 2.4 No hay página por zona y Google recibe una versión en inglés

- **Qué pasa:** Quien busca "piso en el Realejo" o "inmobiliaria en el Zaidín" no encuentra una página preparada, porque los pisos están detrás de un buscador. Además, Google recibe una versión en inglés si no se le indica el idioma.
- **Evidencia medida:** Los 276 anuncios están tras el buscador y no hay página propia de Centro, Zaidín ni Realejo. `curl -sSL https://www.inmobiliariagrande.com/` sin indicación de idioma devuelve `<html lang="en">` con dirección canónica en /en. Hay 15 banderas de idioma sin descripción.
- **Qué le cuesta:** Las búsquedas por barrio traen compradores reales y no hay página para ganarlas; la versión inglesa de una agencia granadina confunde a quien busca en español.
- **Solución en la web nueva:** Páginas en español para Granada y sus barrios, con los anuncios visibles sin necesidad de buscar.

**Nota sobre lo no medido:** Su ficha de Google Business Profile, las visitas y las llamadas requieren sus cuentas; lo revisaremos juntos. El coste del contrato con Inmovilla lo conoce usted.

## 3. Conversión y contacto

### 3.1 El menú lleva a páginas que no existen

- **Qué pasa:** En el menú, "Contacto" y "Locales" apuntan a una página de error que muestra la portada completa, sin formulario ni teléfono.
- **Evidencia medida:** /contacto/ y /locales/, opciones del menú de la empresa, devuelven el error HTTP 404 con la plantilla de la portada (147 KB) y su mismo título (`curl -sSI`).
- **Qué le cuesta:** El cliente que pulsa "Contacto", la acción que más le interesa, se encuentra con una página inexistente.
- **Solución en la web nueva:** Página de contacto real con teléfono, dirección (Calle Recogidas 13, 1.º A) y formulario, más una página 404 amable.

### 3.2 Los formularios no dicen quién recibe los datos

- **Qué pasa:** Los formularios muestran un aviso de privacidad sin terminar, sin el nombre ni el correo del responsable.
- **Evidencia medida:** Todos llevan el texto "Responsable: XXXXX … dirección de correo electrónico XXXXXX@XXXXXXX.es" (bloque `mytextoprivacidadFooter`). Hay cinco formularios en la portada (`grep -o '<form[^>]*>'`).
- **Qué le cuesta:** Dejar el teléfono en un formulario que no dice a quién va dirigido ni para qué se usará frena a cualquier persona prudente.
- **Solución en la web nueva:** Avisos claros con los datos reales de la empresa y mensaje de confirmación al enviar.

### 3.3 La invitación al propietario que quiere vender está escondida

- **Qué pasa:** La invitación a vender no está en la cabecera ni en la primera pantalla del móvil, y se llama "Publica tu inmueble", en un botón gris.
- **Evidencia medida:** Solo existe como botón gris "Publica tu inmueble" y como formulario "Valoramos tu piso" cerca del pie (revisado en docs/audit/current-home-375.png).
- **Qué le cuesta:** El propietario que quiere vender no encuentra motivo para dejar sus datos, y ahí empieza la exclusiva.
- **Solución en la web nueva:** Botón rojo "Vende tu casa" en la cabecera de todas las páginas, visible en la primera pantalla del móvil, y página propia con formulario de valoración.

## 4. Legal y accesibilidad

### 4.1 La web no identifica a la empresa en los textos legales obligatorios

- **Qué pasa:** La normativa de protección de datos exige que la web diga quién es el responsable. El aviso legal está vacío y las políticas de privacidad y de cookies hablan de otra empresa.
- **Evidencia medida:** El aviso legal (bloque `mytextolegal`) solo dice "Si necesitas ayuda profesional para poder introducir este apartado puedes usar estos gestores". La política de cookies menciona "los sitios web de PORTAL", un texto de plantilla. No aparece el CIF ni el nombre registrado de la empresa en ningún punto.
- **Qué le cuesta:** Además del riesgo de sanción, transmite dejadez: quien no cuida su propia documentación difícilmente cuidará la compra de un piso.
- **Solución en la web nueva:** Aviso legal, política de privacidad y de cookies redactados con los datos reales de Inmobiliaria Grande.

### 4.2 Dificultades para personas con discapacidad visual

- **Qué pasa:** Muchas imágenes no tienen descripción alternativa (el texto "alt" que leen los buscadores y los programas de voz) y hay textos con poco contraste.
- **Evidencia medida:** Lighthouse da a la ficha 49 sobre 100 en accesibilidad: 15 imágenes sin "alt", 8 campos sin etiqueta y 2 textos con contraste insuficiente. En la portada, 21 de 27 imágenes no tienen "alt" (comando `grep -oE '<img[^>]+>' | grep -vc 'alt="[^"]+"'`).
- **Qué le cuesta:** Excluye a personas con baja visión y a quienes navegan por voz, y el texto alternativo de las fotos es además lo que Google lee para entender qué enseña cada imagen.
- **Solución en la web nueva:** Imágenes descritas, botones con nombre y colores con contraste suficiente, revisado antes de publicar.

### 4.3 En el móvil no se puede ampliar la página con los dedos

- **Qué pasa:** La web está configurada para impedir el zoom táctil, una función que muchas personas necesitan para leer.
- **Evidencia medida:** La ficha incluye `<meta name="viewport" content="width=device-width, user-scalable=no, maximum-scale=1.0">`, que desactiva el zoom; Lighthouse lo marca como problema en 2 elementos.
- **Qué le cuesta:** Quien no pueda agrandar la letra de un anuncio buscará la misma casa en otra web donde sí pueda.
- **Solución en la web nueva:** El zoom quedará activado y la accesibilidad se comprobará antes de publicar.

## 5. Lo que ya está bien

La web nueva debe conservar lo que ya hace bien:

- La conexión es segura (HTTPS) y redirige bien la versión sin cifrar.
- El aviso de cookies permite rechazarlas, algo que muchas webs del sector no hacen.
- Cada inmueble tiene muchas fotos, entre 24 y 60 en las fichas revisadas.
- El teléfono es clicable desde el móvil y hay botón de WhatsApp.

## 6. Propuesta: la web nueva

### Qué incluye (alcance)

- **Seis páginas:** inicio con buscador, listado con filtros, ficha de inmueble, contacto, "Vende tu casa" con formulario de valoración y "Sobre nosotros" con los 55 años de historia.
- **Diseño propio:** sobre su marca renovada de 2026 (la roseta, el gallo y los violetas), aplicado a logotipo, colores y tipografía.
- **Inmuebles:** hasta 30 en el lanzamiento, con fotos optimizadas. El prototipo ya muestra ocho inmuebles reales, como el ático dúplex del Centro o el pareado de Monachil.
- **Formularios:** de contacto y de valoración con avisos claros, y botón de WhatsApp.
- **Textos legales:** aviso legal, política de privacidad y de cookies con los datos reales de la empresa, más página 404 amable y favicon.
- **Google:** títulos y descripciones propios por página para aparecer mejor en los resultados.
- **Puesta en marcha:** alta guiada en Google Business Profile y despliegue en su dominio actual.
- **Medición:** velocidad de la web actual y de la nueva, entregada por escrito.

### Qué NO incluye (fase 2, presupuesto aparte)

- **Sincronización:** automática con Inmovilla, Idealista o Fotocasa.
- **Gestor de contenidos:** para que usted edite la web sin ayuda.
- **Fotografía:** profesional de los inmuebles.
- **Páginas por barrio:** textos propios de cada zona más allá de las seis páginas.
- **Publicidad:** campañas de anuncios en Google o redes.

Su web actual está montada sobre el CRM Inmovilla, como indica el pie de página, y allí viven sus 276 anuncios. La web nueva es independiente y no toca ese programa: publica los inmuebles que usted elija. Antes de la fase 2 hay que confirmar cómo publica hoy en los portales, porque eso se gestiona desde Inmovilla.

### Plazo

El plazo es de 4 semanas desde que me entregue los materiales: logotipo en archivo vectorial, textos de la historia, listado de inmuebles a publicar y datos fiscales.

1. **Semana 1:** diseño sobre la marca nueva y revisión del prototipo con usted.
2. **Semana 2:** construcción de las seis páginas con su contenido real.
3. **Semana 3:** textos legales, formularios y pruebas en móvil y ordenador.
4. **Semana 4:** despliegue en su dominio, alta guiada en Google y medición de velocidad.

### Precio cerrado: 1.200 € (IVA no incluido)

El precio es cerrado e incluye todo el alcance. Desglose orientativo del trabajo:

| Bloque | Horas | Importe |
|---|---|---|
| Diseño de las seis páginas sobre la marca nueva | 25 | 500 € |
| Maquetación y desarrollo (estructura, estilos, formularios, WhatsApp) | 20 | 400 € |
| Textos legales, página 404 y favicon | 8 | 160 € |
| Despliegue, dominio, alta en Google, pruebas y medición | 7 | 140 € |
| **Total** | **60** | **1.200 €** |

Pago: 40 % al empezar (480 €) y 60 % a la entrega (720 €).

### Mantenimiento: 40 €/mes

Por 40 € al mes me ocupo de que la web esté viva y al día. Incluye:

- **Hosting y dominio:** alojamiento del sitio y dominio, con su renovación anual.
- **Inmuebles:** altas y bajas, hasta 10 movimientos al mes, en un plazo de 48 horas laborables.
- **Copias de seguridad:** semanales, guardadas fuera del servidor.
- **Actualizaciones:** de seguridad y cambios menores de contenido (teléfono, horario, textos cortos).
- **Informe:** trimestral de visitas.

Sin permanencia: si no quiere seguir, basta con avisar con 30 días de antelación.

### Qué necesito de usted para empezar

- **Logotipo:** el original en vectorial; la marca de 2026 solo existe como fotografía de la tarjeta impresa, y su web sigue con el logotipo antiguo.
- **Datos fiscales:** nombre registrado y CIF para el aviso legal.
- **Historia:** la de la empresa, para contar bien esos 55 años.
- **Dominio:** acceso para publicar la web nueva en su dirección actual.

> Nota sobre el prototipo: el logotipo que aparece en él es un recorte limpiado de la fotografía de la tarjeta, no el original. Para la web de producción hace falta el archivo vectorial del rebranding; no se ha redibujado ni reinterpretado la marca. Todas las cifras de este informe se midieron el 3 de septiembre de 2026 con los comandos indicados y quedan guardadas junto al prototipo (carpeta docs/audit) para que cualquiera pueda repetirlas.

## 7. Próximo paso

Le propongo ver juntos el prototipo que acompaña a este informe, para que toque el diseño con sus propios inmuebles. Si le convence, me entrega los materiales y en cuatro semanas su web nueva estará publicada por 1.200 euros más IVA. Esta propuesta es válida durante 30 días.

Alejandro Bolívar, profesional independiente. Estudiante de último curso de Ingeniería Informática, Granada.
