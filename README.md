# Encuesta QB54

Encuesta rápida (menos de 30 segundos) para la prueba de mercado de QB54 en México.
Funciona en cualquier celular, se puede instalar como app, abre aunque no haya señal
y manda las respuestas a tu hoja de Google Sheets.

---

## Qué hay en esta carpeta

| Archivo | Para qué sirve |
|---|---|
| `index.html` | La encuesta completa (diseño y funcionamiento). |
| `logo.png` | El logo de QB54. |
| `og-imagen.jpg` | La imagen que aparece al mandar el link por WhatsApp. |
| `manifest.webmanifest` y `sw.js` | Permiten instalar la encuesta en el celular y abrirla sin señal. |
| `iconos/` | Los íconos de la app. |
| `apps-script/Codigo.gs` | El código que se pega en tu hoja de Google Sheets. |
| `README.md` | Estas instrucciones. |

**No subas a GitHub:** `PROGRESO.md`, `PROMPT_ENCUESTA_QB54.md` ni la carpeta `_trabajo` (son notas y herramientas de prueba).

---

## 1. Publicar la página en GitHub Pages

GitHub está en inglés; abajo van los nombres exactos de los botones.

1. Entra a [github.com](https://github.com) e inicia sesión (o crea una cuenta gratis).
2. Arriba a la derecha toca **+** → **New repository**.
3. En **Repository name** escribe `qb54`. Elige **Public**. **No** marques "Add a README file". Toca **Create repository**.
4. En la página que aparece, toca el link **uploading an existing file**.
5. Arrastra a la ventana: `index.html`, `logo.png`, `og-imagen.jpg`, `manifest.webmanifest`, `sw.js`, `README.md` y las carpetas `iconos` y `apps-script`.
6. Cuando terminen de subir, toca el botón verde **Commit changes**.
7. Arriba toca **Settings** y luego, en el menú de la izquierda, **Pages**.
8. En **Build and deployment**: Source = **Deploy from a branch**; Branch = **main** y carpeta **/ (root)**. Toca **Save**.
9. Espera 1 o 2 minutos y recarga la página. Arriba aparecerá **"Your site is live at …"**.

**Tu link será:**

```
https://TU-USUARIO.github.io/qb54/
```

Cambia `TU-USUARIO` por tu nombre de usuario de GitHub (en minúsculas). Si le pusiste otro nombre al repositorio, cambia también `qb54`. Usa siempre la diagonal `/` del final.

---

## 2. Conectar tu hoja de Google Sheets

1. Abre tu hoja de Google Sheets → menú **Extensiones** → **Apps Script**.
2. Borra todo lo que aparece en el editor y pega **todo** el contenido de `apps-script/Codigo.gs`.
   Tip: en GitHub abre `apps-script/Codigo.gs` y usa el botón **Copy raw file** (el de dos cuadritos).
   Toca el ícono de **guardar** (el disquete).
3. Arriba a la derecha: **Implementar** → **Nueva implementación**. Junto a "Seleccionar tipo", toca el engrane ⚙️ → **Aplicación web**.
4. Llena así:
   - Descripción: `Encuesta QB54`
   - **Ejecutar como: Yo** (tu correo)
   - **Quién tiene acceso: Cualquier usuario**

   Toca **Implementar**.
5. Google pide permisos: toca **Autorizar acceso** y elige tu cuenta.
   - Si aparece **"Google no ha verificado esta app"**, es normal: el script lo creaste tú y no está publicado en ninguna tienda. Toca **Configuración avanzada** → **Ir a … (no seguro)** → **Permitir**.
   - El script solo pide permiso para usar **esta** hoja; no puede ver tus otros archivos.
6. Copia la **URL de la aplicación web** (la que termina en `/exec`) y toca **Listo**.
7. Para comprobarla, pega esa URL en el navegador: debe decir **"Encuesta QB54 funcionando"**.

**Revisa la zona horaria de la hoja:** **Archivo** → **Configuración** → **Zona horaria** = *(GMT-06:00) Hora central - Ciudad de México*. Así la columna `recibido` muestra la hora correcta.

---

## 3. Pegar la URL en `index.html`

1. En GitHub abre `index.html` y toca el ícono del **lápiz** (Edit this file).
2. Casi al principio (línea 24), debajo del aviso **PEGA AQUÍ LA URL DE TU APPS SCRIPT**, está esta línea:
   ```
   const APPS_SCRIPT_URL = '';
   ```
3. Pega tu URL **entre las dos comillas**, sin borrarlas:
   ```
   const APPS_SCRIPT_URL = 'https://script.google.com/macros/s/AKfy.../exec';
   ```
4. Toca **Commit changes…** y luego **Commit changes**. Espera 1 o 2 minutos.

**Recomendado, en la misma edición:** para que el logo aparezca en la vista previa de WhatsApp, cambia
`og-imagen.jpg` por el link completo en las líneas 44 y 51:

```
https://TU-USUARIO.github.io/qb54/og-imagen.jpg
```

---

## 4. Probar

1. Abre tu link en el celular, contesta la encuesta y toca **Enviar**.
2. En tu hoja aparecerá una pestaña nueva llamada **Respuestas** con la fila (tarda unos segundos).
3. Borra la fila de prueba: clic derecho en el número de la fila → **Borrar fila**. **No borres la fila 1** (los encabezados).

- Si contestaste pruebas antes de pegar la URL, esas también van a llegar; bórralas igual.
- Si la fila no llega, toca el logo 5 veces: el panel dice qué está pasando (ver "Problemas comunes").

---

## 5. Los links que vas a usar

| Para | Link |
|---|---|
| **Parque Naucalli** (tu celular) | `https://TU-USUARIO.github.io/qb54/?lugar=naucalli` |
| **Video tutorial** (lo mandas a la gente) | `https://TU-USUARIO.github.io/qb54/?origen=video` |

- **Otro parque:** cambia `naucalli` por un nombre corto sin espacios, por ejemplo `?lugar=chapultepec`.
- **Modo parque:** al enviar aparece "¡Gracias!" y a los 3 segundos la encuesta se limpia sola para la siguiente persona. Si alguien la deja a medias, se limpia sola a los 90 segundos. La pantalla no se apaga mientras la página está abierta.
- **Modo video:** la pregunta 4 ya viene marcada en "Vi el video". Después de enviar se queda la pantalla de gracias con "Ya puedes cerrar esta página", y si la misma persona vuelve a abrir el link, ve que ya contestó.

---

## 6. Preparar el celular para el parque

1. **Con internet**, abre en Chrome el link del parque (el que lleva `?lugar=naucalli`).
2. Toca el menú **⋮** → **Agregar a la pantalla principal** (o **Instalar app**) → **Instalar**.
3. Abre la app desde el ícono **QB54** al menos una vez **con internet**. Así se guarda todo para funcionar sin señal.
4. Toca el logo 5 veces y revisa que el panel diga **Lugar: naucalli**. Toca **Cerrar**.

- La app recuerda el último lugar. Cuando vayas a **otro parque**, abre primero en Chrome el link con el lugar nuevo y luego la app; revisa el lugar en el panel.
- En **iPhone** se instala desde Safari: **Compartir** → **Agregar a inicio**. Revisa el lugar en el panel; si dice "sin lugar", usa el link directamente en Safari en vez del ícono.

---

## 7. Descargar los resultados

1. En tu hoja, abre la pestaña **Respuestas**.
2. **Archivo** → **Descargar** → **Microsoft Excel (.xlsx)** o **Valores separados por comas (.csv)** (el CSV descarga solo la pestaña que estás viendo).

Cómo leer la columna `precio`:

- `500` significa "$500 o menos" y `4000` significa "$4,000 o más".
- Vacío significa que eligió **"A ningún precio"** (en esa fila `a_ningun_precio` dice `Sí`).

Tip para decidir el precio: **Insertar** → **Tabla dinámica**. En Filas pon `edad`, `genero` o `experiencia`; en Valores pon `precio` con **Promedio** y también **Mediana** (la mediana no se deja engañar por los extremos).

---

## 8. Cerrar la encuesta

En Apps Script: **Implementar** → **Administrar implementaciones** → elige la implementación → **Archivar**.
Desde ese momento ya no entran respuestas. Si algún celular tenía respuestas pendientes, se quedan guardadas en ese celular y puedes sacarlas con el respaldo CSV del panel.

---

## 9. Si cambias el script después

1. Pega el código nuevo en Apps Script y guarda.
2. **Implementar** → **Administrar implementaciones** → toca el **lápiz** (Editar).
3. En **Versión** elige **Nueva versión** → **Implementar**.

Así la URL `/exec` **no cambia** y no tienes que tocar `index.html`.
(No uses "Nueva implementación": eso crea una URL distinta.)

---

## Panel oculto

Toca el logo **5 veces seguidas** para abrirlo. Muestra:

- Cuántas respuestas se **enviaron** desde ese celular y cuántas están **pendientes**.
- El modo, el lugar y el estado del último envío.
- **Reintentar envío**: manda las pendientes en ese momento.
- **Descargar respaldo CSV**: todas las respuestas guardadas en ese celular (enviadas o no). Abre bien en Excel, con acentos. La última columna, `enviada`, dice si ya llegó a la hoja.
- **Cerrar**.

## Si no hay señal

Las respuestas se guardan primero en el celular y la pantalla de "¡Gracias!" sale al instante.
Se envían solas cuando vuelve la señal: al abrir la página, al recuperar conexión y cada 30 segundos.
**Nunca se duplican**: cada respuesta tiene un identificador único y la hoja ignora las repetidas.
No borres los datos de Chrome del celular mientras haya respuestas pendientes.

## Probar el modo video otra vez desde tu celular

Después de contestar con el link de video, ese celular queda marcado como "ya contestó".
Para volver a probar, abre el link en una **ventana de incógnito**.

## Si cambias el logo o los íconos

En `sw.js` cambia `qb54-v1` por `qb54-v2` (y así sucesivamente), para que los celulares descarguen los nuevos.
Los cambios en `index.html` llegan solos la siguiente vez que se abre la página con internet.

## Problemas comunes

| Lo que ves en el panel | Qué hacer |
|---|---|
| "Falta pegar la URL del Apps Script" | Haz el paso 3. |
| "La línea APPS_SCRIPT_URL tiene un error" | Revisa que la URL esté entre comillas `'...'` y que termine en `;`. |
| "No se pudo enviar: no hay conexión o la URL no es correcta" | Si hay señal: revisa que la URL termine en `/exec` y que el acceso sea "Cualquier usuario" (paso 2). |
| "La URL del Apps Script debe terminar en /exec" | Copiaste otra URL; usa la de la aplicación web (paso 2, punto 6). |

- **Cambié `index.html` y el celular sigue igual:** espera 2 minutos y abre la página con internet. A veces hay que abrirla dos veces.

## Columnas de la hoja

`fecha_hora` (hora del celular), `id`, `origen` (parque o video), `lugar`, `nombre`, `genero`, `edad`,
`experiencia`, `calificacion` (1 a 5), `jugaria_seguido`, `compraria`, `precio`, `a_ningun_precio`
y `recibido` (hora en que llegó a la hoja).
