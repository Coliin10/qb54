/**
 * ENCUESTA QB54 — recibe las respuestas de la página y las guarda en la
 * pestaña "Respuestas" de esta hoja de cálculo.
 *
 * Cómo instalarlo (los pasos completos están en README.md):
 *   1. En tu hoja: Extensiones → Apps Script. Borra lo que haya y pega este código. Guarda.
 *   2. Implementar → Nueva implementación → tipo "Aplicación web".
 *      Ejecutar como: "Yo".  Quién tiene acceso: "Cualquier usuario".
 *   3. Copia la URL que termina en /exec y pégala en index.html (APPS_SCRIPT_URL).
 *
 * Para probar que funciona, abre esa URL en el navegador: debe decir
 * "Encuesta QB54 funcionando".
 *
 * @OnlyCurrentDoc  (solo pide permiso para usar ESTA hoja)
 */

var NOMBRE_HOJA = 'Respuestas';

// Orden de las columnas en la hoja. "recibido" la llena este script.
var COLUMNAS = [
  'fecha_hora', 'id', 'origen', 'lugar', 'nombre', 'genero', 'edad', 'experiencia',
  'calificacion', 'jugaria_seguido', 'compraria', 'precio', 'a_ningun_precio', 'recibido'
];

var MAX_POR_ENVIO = 2000;
var FORMATO_FECHA = 'yyyy-mm-dd hh:mm:ss';


/** Al abrir la URL en el navegador: sirve para comprobar que está bien publicada. */
function doGet() {
  return ContentService.createTextOutput('Encuesta QB54 funcionando');
}


/**
 * Recibe una respuesta o una lista de respuestas (JSON enviado como texto).
 * Contesta con JSON, por ejemplo { "ok": true, "guardadas": 3, "duplicadas": 0, "invalidas": 0 }.
 */
function doPost(e) {
  var candado = LockService.getScriptLock();
  var conCandado = false;
  try {
    var respuestas = leerRespuestas_(e);

    // Si llegan dos envíos al mismo tiempo, el segundo espera a que termine el primero.
    candado.waitLock(30000);
    conCandado = true;

    var hoja = obtenerHoja_();
    var zona = hoja.getParent().getSpreadsheetTimeZone();
    var existentes = leerIds_(hoja);
    var ahora = new Date();
    var filas = [];
    var duplicadas = 0;
    var invalidas = 0;

    respuestas.forEach(function (r) {
      if (!r || typeof r !== 'object' || Array.isArray(r)) { invalidas++; return; }
      var id = limpio_(r.id, 64);
      if (!/^[A-Za-z0-9-]{8,64}$/.test(id)) { invalidas++; return; }
      // Si el id ya está en la hoja (por ejemplo, un reintento), no se repite.
      if (existentes[id]) { duplicadas++; return; }
      existentes[id] = true;
      filas.push(armarFila_(r, id, zona, ahora));
    });

    if (filas.length) {
      var inicio = hoja.getLastRow() + 1;
      hoja.getRange(inicio, 1, filas.length, COLUMNAS.length).setValues(filas);
      formatoColumna_(hoja, 'fecha_hora', inicio, filas.length, FORMATO_FECHA);
      formatoColumna_(hoja, 'recibido', inicio, filas.length, FORMATO_FECHA);
      formatoColumna_(hoja, 'calificacion', inicio, filas.length, '0');
      formatoColumna_(hoja, 'precio', inicio, filas.length, '0');
      SpreadsheetApp.flush();
    }

    return responder_({ ok: true, guardadas: filas.length, duplicadas: duplicadas, invalidas: invalidas });
  } catch (err) {
    return responder_({ ok: false, error: String(err && err.message ? err.message : err) });
  } finally {
    if (conCandado) candado.releaseLock();
  }
}


// ---------------------------------------------------------------- Ayudantes

function leerRespuestas_(e) {
  var texto = e && e.postData && e.postData.contents;
  if (!texto) throw new Error('No llegaron datos');
  var datos = JSON.parse(texto);
  if (datos && !Array.isArray(datos) && Array.isArray(datos.respuestas)) datos = datos.respuestas;
  var lista = Array.isArray(datos) ? datos : [datos];
  if (lista.length > MAX_POR_ENVIO) throw new Error('Demasiadas respuestas en un solo envío');
  return lista;
}

/** Devuelve la pestaña "Respuestas". Si no existe, la crea con los encabezados. */
function obtenerHoja_() {
  var libro = SpreadsheetApp.getActiveSpreadsheet();
  var hoja = libro.getSheetByName(NOMBRE_HOJA);
  if (!hoja) hoja = libro.insertSheet(NOMBRE_HOJA);
  if (hoja.getLastRow() === 0) {
    hoja.getRange(1, 1, 1, COLUMNAS.length).setValues([COLUMNAS]).setFontWeight('bold');
    hoja.setFrozenRows(1);
  }
  return hoja;
}

/** Junta los id que ya están en la hoja, para no duplicar. */
function leerIds_(hoja) {
  var ids = {};
  var ultima = hoja.getLastRow();
  if (ultima < 2) return ids;
  var columna = COLUMNAS.indexOf('id') + 1;
  hoja.getRange(2, columna, ultima - 1, 1).getValues().forEach(function (fila) {
    var id = String(fila[0]).replace(/^'/, '').trim();
    if (id) ids[id] = true;
  });
  return ids;
}

function armarFila_(r, id, zona, ahora) {
  var ningunPrecio = limpio_(r.a_ningun_precio, 5) === 'Sí';
  return [
    fecha_(r.fecha_hora, zona),
    texto_(id, 64),
    texto_(r.origen, 20),
    texto_(r.lugar, 60),
    texto_(r.nombre, 60),
    texto_(r.genero, 20),
    texto_(r.edad, 20),
    texto_(r.experiencia, 30),
    numero_(r.calificacion, 1, 5),
    texto_(r.jugaria_seguido, 20),
    texto_(r.compraria, 10),
    ningunPrecio ? '' : numero_(r.precio, 0, 1000000), // número, para poder sacar promedios
    ningunPrecio ? 'Sí' : 'No',
    ahora                                             // recibido
  ];
}

/** Quita caracteres raros y recorta el largo. */
function limpio_(valor, max) {
  if (valor === null || valor === undefined) return '';
  return String(valor)
    .replace(/[\u0000-\u001F\u007F]+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
    .slice(0, max || 100);
}

/**
 * Texto seguro para la hoja: si empieza como fórmula, número o fecha,
 * se antepone ' para que Google Sheets lo guarde tal cual, como texto.
 */
function texto_(valor, max) {
  var s = limpio_(valor, max);
  if (/^[=+\-@'$(.,0-9]/.test(s) || /^(true|false|verdadero|falso)$/i.test(s)) s = "'" + s;
  return s;
}

function numero_(valor, min, max) {
  if (valor === null || valor === undefined || valor === '') return '';
  var n = Number(valor);
  if (!isFinite(n)) return '';
  n = Math.round(n);
  if (n < min || n > max) return '';
  return n;
}

/** La fecha llega como "2026-11-20 14:32:05" (hora del celular) y se guarda tal cual. */
function fecha_(valor, zona) {
  var s = limpio_(valor, 40);
  if (/^\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}$/.test(s)) {
    try {
      return Utilities.parseDate(s, zona, 'yyyy-MM-dd HH:mm:ss');
    } catch (err) {
      // si no se puede leer, se guarda como texto
    }
  }
  return texto_(s, 40);
}

function formatoColumna_(hoja, nombre, inicio, cuantas, formato) {
  hoja.getRange(inicio, COLUMNAS.indexOf(nombre) + 1, cuantas, 1).setNumberFormat(formato);
}

function responder_(objeto) {
  return ContentService
    .createTextOutput(JSON.stringify(objeto))
    .setMimeType(ContentService.MimeType.JSON);
}
