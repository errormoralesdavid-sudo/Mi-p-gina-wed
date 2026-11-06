const CACHE_NAME = "kalon-saas-v3";
const STATIC_ASSETS = [
  "./",
  "./index.html",
  "./style.css",
  "./manifest.json"
];

self.addEventListener("install", (event) => {
  self.skipWaiting();
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(STATIC_ASSETS)).catch(() => {})
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys.map((key) => {
          if (key !== CACHE_NAME) return caches.delete(key);
        })
      )
    )
  );
  self.clients.claim();
});

self.addEventListener("fetch", (event) => {
  const url = event.request.url;

  // NUNCA cachear Firebase, DolarApi, admin.html ni app.js para que los cambios se vean al instante
  if (
    event.request.method !== "GET" ||
    url.includes("firebaseio.com") ||
    url.includes("googleapis.com") ||
    url.includes("dolarapi.com") ||
    url.includes("admin.html") ||
    url.includes("app.js")
  ) {
    event.respondWith(fetch(event.request));
    return;
  }

  // Estrategia Network-First (primero busca la versión más reciente en internet y si no hay señal usa caché)
  event.respondWith(
    fetch(event.request)
      .then((networkResponse) => {
        const clone = networkResponse.clone();
        caches.open(CACHE_NAME).then((cache) => cache.put(event.request, clone));
        return networkResponse;
      })
      .catch(() => caches.match(event.request))
  );
});
