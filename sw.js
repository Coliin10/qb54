/* =====================================================================
   Service worker de la encuesta QB54
   Guarda la página, el logo y la fuente en el celular para que la
   encuesta abra aunque no haya señal.

   - Si cambias el logo o los íconos, sube el número de VERSION.
   - Los cambios en index.html (por ejemplo la URL del Apps Script)
     llegan solos la siguiente vez que se abra la página con internet.
   ===================================================================== */
var VERSION = 'qb54-v1';
var CACHE_APP = VERSION;
var CACHE_FUENTES = 'qb54-fuentes-v1';

// Debe ser idéntica a la dirección de la fuente en index.html.
var FUENTES_CSS = 'https://fonts.googleapis.com/css2?family=Saira+Condensed:wght@700;800&display=swap';

// El logo va incrustado dentro de index.html, por eso no está en esta lista.
var ARCHIVOS = [
  './',
  'manifest.webmanifest',
  'iconos/icono-192.png',
  'iconos/apple-touch-icon.png',
  'iconos/favicon-48.png'
];

var ESPERA_RED_PAGINA = 3500;  // ms: si la red tarda más, se usa la copia guardada
var ESPERA_RED_FUENTE = 4000;

function conLimite(promesa, ms) {
  return new Promise(function (resolver, rechazar) {
    var t = setTimeout(function () { rechazar(new Error('tiempo agotado')); }, ms);
    promesa.then(
      function (v) { clearTimeout(t); resolver(v); },
      function (e) { clearTimeout(t); rechazar(e); }
    );
  });
}

// Descarga el CSS de Google Fonts y los archivos de fuente que menciona.
function guardarFuentes() {
  return caches.open(CACHE_FUENTES).then(function (cache) {
    return conLimite(fetch(FUENTES_CSS, { mode: 'cors', credentials: 'omit' }), 8000).then(function (res) {
      if (!res || !res.ok) return;
      return res.clone().text().then(function (css) {
        var urls = [];
        css.replace(/url\((https:\/\/fonts\.gstatic\.com\/[^)'"\s]+)\)/g, function (todo, url) {
          urls.push(url);
          return todo;
        });
        return Promise.all(urls.map(function (url) {
          return conLimite(fetch(url, { mode: 'cors', credentials: 'omit' }), 8000)
            .then(function (r) { if (r && r.ok) return cache.put(url, r); })
            .catch(function () { /* se intentará en otra ocasión */ });
        })).then(function () { return cache.put(FUENTES_CSS, res); });
      });
    });
  });
}

self.addEventListener('install', function (event) {
  event.waitUntil(
    caches.open(CACHE_APP)
      .then(function (cache) {
        return cache.addAll(ARCHIVOS.map(function (u) { return new Request(u, { cache: 'reload' }); }));
      })
      .then(function () { return guardarFuentes().catch(function () { /* sin fuente: se usa la del sistema */ }); })
      .then(function () { return self.skipWaiting(); })
  );
});

self.addEventListener('activate', function (event) {
  event.waitUntil(
    caches.keys()
      .then(function (llaves) {
        // Solo se borran cachés viejas de esta encuesta (otras páginas de tu
        // github.io comparten el mismo almacenamiento).
        return Promise.all(llaves.filter(function (k) {
          return k.indexOf('qb54-') === 0 && k !== CACHE_APP && k !== CACHE_FUENTES;
        }).map(function (k) { return caches.delete(k); }));
      })
      .then(function () { return self.clients.claim(); })
  );
});

// La página: primero la red (para recibir cambios), con la copia guardada como respaldo.
// Guarda una copia de la respuesta y la devuelve cuando la copia ya quedó guardada.
function guardarCopia(nombreCache, clave, res) {
  var copia = res.clone();
  return caches.open(nombreCache)
    .then(function (c) { return c.put(clave, copia); })
    .then(function () { return res; }, function () { return res; });
}

function pagina(event) {
  var clave = self.registration.scope;
  var red = fetch(new Request(event.request.url, { cache: 'no-cache', credentials: 'same-origin', redirect: 'manual' }))
    .then(function (res) {
      return res && res.ok && res.type === 'basic' ? guardarCopia(CACHE_APP, clave, res) : res;
    });
  event.waitUntil(red.then(function () {}, function () {}));

  return caches.open(CACHE_APP)
    .then(function (c) { return c.match(clave); })
    .then(function (guardada) {
      if (!guardada) return red;
      return conLimite(red, ESPERA_RED_PAGINA).then(
        function (res) { return res && (res.ok || res.type === 'opaqueredirect') ? res : guardada; },
        function () { return guardada; }
      );
    });
}

// Archivos propios (logo, íconos, manifest): primero lo guardado.
function primeroCache(req) {
  return caches.open(CACHE_APP).then(function (cache) {
    return cache.match(req, { ignoreSearch: true }).then(function (guardada) {
      if (guardada) return guardada;
      return fetch(req).then(function (res) {
        return res && res.ok && res.type === 'basic' ? guardarCopia(CACHE_APP, req, res) : res;
      });
    });
  });
}

// Google Fonts: primero lo guardado; el CSS se actualiza en segundo plano.
function fuentes(event) {
  var req = event.request;
  var esCSS = new URL(req.url).hostname === 'fonts.googleapis.com';
  return caches.open(CACHE_FUENTES).then(function (cache) {
    return cache.match(req, { ignoreVary: true }).then(function (guardada) {
      if (guardada) {
        if (esCSS) event.waitUntil(guardarFuentes().catch(function () {}));
        return guardada;
      }
      var red = fetch(req).then(function (res) {
        return res && (res.ok || res.type === 'opaque') ? guardarCopia(CACHE_FUENTES, req, res) : res;
      });
      if (!esCSS) return red;
      // Si la fuente no llega a tiempo, la página sigue con la fuente del sistema.
      return conLimite(red, ESPERA_RED_FUENTE).catch(function () {
        return new Response('/* sin conexión: fuente del sistema */', {
          headers: { 'Content-Type': 'text/css; charset=utf-8' }
        });
      });
    });
  });
}

self.addEventListener('fetch', function (event) {
  var req = event.request;
  if (req.method !== 'GET') return; // el envío al Apps Script (POST) nunca se toca
  var url = new URL(req.url);

  if (req.mode === 'navigate') {
    if (url.origin === self.location.origin) event.respondWith(pagina(event));
    return;
  }
  if (url.origin === self.location.origin) {
    event.respondWith(primeroCache(req));
    return;
  }
  if (url.hostname === 'fonts.googleapis.com' || url.hostname === 'fonts.gstatic.com') {
    event.respondWith(fuentes(event));
  }
  // Todo lo demás (por ejemplo script.google.com) pasa directo a internet.
});
