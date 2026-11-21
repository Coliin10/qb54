# Encuesta QB54

Encuesta rápida (menos de 30 segundos) para la prueba de mercado de QB54 en México.
Funciona en cualquier celular, se puede instalar como app, abre aunque no haya señal
y manda las respuestas a tu hoja de Google Sheets.

---

## Ya está funcionando

| Qué | Dónde |
|---|---|
| **La encuesta** | <https://coliin10.github.io/qb54/> |
| **Link para el parque Naucalli** | <https://coliin10.github.io/qb54/?lugar=naucalli> |
| **Link para el video tutorial** | <https://coliin10.github.io/qb54/?origen=video> |
| **Las respuestas** | Tu hoja de Google **"Respuestas Prueba Piloto"**, pestaña **"Respuestas"** |
| **Los archivos** | <https://github.com/Coliin10/qb54> (repositorio público) |

- **Otro parque:** cambia `naucalli` por un nombre corto sin espacios, por ejemplo `?lugar=chapultepec`.
- **Modo parque:** al enviar aparece "¡Gracias!" y a los 3 segundos la encuesta se limpia sola para la siguiente persona. Si alguien la deja a medias, se limpia sola a los 90 segundos. La pantalla no se apaga mientras la página está abierta.
- **Modo video:** la pregunta 4 ya viene marcada en "Vi el video". Después de enviar se queda la pantalla de gracias con "Ya puedes cerrar esta página", y si la misma persona vuelve a abrir el link, ve que ya contestó.

---

## Qué hay en esta carpeta

| Archivo | Para qué sirve |
|---|---|
| `index.html` | La encuesta completa (diseño y funcionamiento). El logo va incrustado adentro. |
| `logo.png` | El logo original de QB54. |
| `og-imagen.jpg` | La imagen que aparece al mandar el link por WhatsApp. |
| `manifest.webmanifest` y `sw.js` | Permiten instalar la encuesta en el celular y abrirla sin señal. |
| `iconos/` | Los íconos de la app. |
| `apps-script/Codigo.gs` | El código que está pegado en tu hoja de Google Sheets. |
| `README.md` | Estas instrucciones. |

---

## 1. Preparar el celular para el parque

1. **Con internet**, abre en Chrome el link del parque: <https://coliin10.github.io/qb54/?lugar=naucalli>
2. Toca el menú **⋮** → **Agregar a la pantalla principal** (o **Instalar app**) → **Instalar**.
3. Abre la app desde el ícono **QB54** al menos una vez **con internet**. Así se guarda todo para funcionar sin señal.
4. Toca el logo 5 veces y revisa que el panel diga **Lugar: naucalli**. Toca **Cerrar**.

- La app recuerda el último lugar. Cuando vayas a **otro parque**, abre primero en Chrome el link con el lugar nuevo y luego la app; revisa el lugar en el panel.
- En **iPhone** se instala desde Safari: **Compartir** → **Agregar a inicio**. Revisa el lugar en el panel; si dice "sin lugar", usa el link directamente en Safari en vez del ícono.

---

## 2. Descargar los resultados

1. En tu hoja, abre la pestaña **Respuestas**.
2. **Archivo** → **Descargar** → **Microsoft Excel (.xlsx)** o **Valores separados por comas (.csv)** (el CSV descarga solo la pestaña que estás viendo).

Cómo leer la columna `precio`:

- `500` significa "$500 o menos" y `4000` significa "$4,000 o más".
- Vacío significa que eligió **"A ningún precio"** (en esa fila `a_ningun_precio` dice `Sí`).

Tip para decidir el precio: **Insertar** → **Tabla dinámica**. En Filas pon `edad`, `genero` o `experiencia`; en Valores pon `precio` con **Promedio** y también **Mediana** (la mediana no se deja engañar por los extremos).

---

## 3. Cerrar la encuesta

En tu hoja: **Extensiones** → **Apps Script** → **Implementar** → **Administrar implementaciones** → elige la implementación → **Archivar**.
Desde ese momento ya no entran respuestas. Si algún celular tenía respuestas pendientes, se quedan guardadas en ese celular y puedes sacarlas con el respaldo CSV del panel.

---

## 4. Si cambias el código de la hoja (Apps Script)

1. Pega el código nuevo en Apps Script y guarda.
2. **Implementar** → **Administrar implementaciones** → toca el **lápiz** (Editar).
3. En **Versión** elige **Nueva versión** → **Implementar**.

Así la URL `/exec` **no cambia** y la encuesta sigue funcionando sin tocar `index.html`.
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

## Si cambias la página, el logo o los íconos

- Los cambios en `index.html` llegan solos a los celulares la siguiente vez que se abre la página con internet.
- El logo va incrustado dentro de `index.html`: si cambias `logo.png`, hay que volver a incrustarlo.
- Si cambias los íconos, en `sw.js` cambia `qb54-v1` por `qb54-v2` (y así sucesivamente).

## Problemas comunes

| Lo que ves en el panel | Qué hacer |
|---|---|
| "No se pudo enviar: no hay conexión o la URL no es correcta" | Si hay señal, abre la URL del script en el navegador: debe decir "Encuesta QB54 funcionando". Revisa también que la implementación no esté archivada. |
| "Falta pegar la URL del Apps Script" | La línea `APPS_SCRIPT_URL` (línea 24 de `index.html`) quedó vacía. |
| "La línea APPS_SCRIPT_URL tiene un error" | Revisa que la URL esté entre comillas `'...'` y que termine en `;`. |

- **Cambié algo y el celular sigue igual:** espera 2 minutos y abre la página con internet. A veces hay que abrirla dos veces.

## Columnas de la hoja

`fecha_hora` (hora del celular), `id`, `origen` (parque o video), `lugar`, `nombre`, `genero`, `edad`,
`experiencia`, `calificacion` (1 a 5), `jugaria_seguido`, `compraria`, `precio`, `a_ningun_precio`
y `recibido` (hora en que llegó a la hoja).

---

## Cómo se publicó (por si hay que repetirlo)

1. **GitHub Pages:** repositorio público `qb54` en la cuenta `Coliin10` → **Settings** → **Pages** → **Deploy from a branch** → `main` y `/ (root)`.
2. **Google Sheets:** en la hoja, **Extensiones** → **Apps Script** → pegar `apps-script/Codigo.gs` → guardar → **Implementar** → **Nueva implementación** → engrane ⚙️ → **App web** → Ejecutar como: **Yo** · Usuarios con acceso: **Cualquiera** → **Implementar** → **Autorizar acceso**.
   Si aparece "Google no verificó esta app", es normal (el código es tuyo): **Configuración avanzada** → **Ir a Encuesta QB54 (no seguro)** → **Permitir**.
3. **Conectar:** la URL que termina en `/exec` va en la línea 24 de `index.html` (`APPS_SCRIPT_URL`).
4. **Zona horaria:** en la hoja, **Archivo** → **Configuración** → *(GMT-06:00) Hora central - Ciudad de México*, para que la columna `recibido` muestre la hora correcta.
