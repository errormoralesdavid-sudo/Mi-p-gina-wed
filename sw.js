/**
 * ============================================================================
 * ARCHIVO 5: sw.js - SERVICE WORKER PARA CACHÉ RÁPIDA Y MODO OFFLINE EN GITHUB
 * ============================================================================
 */

"use strict";

// Cambia "v1" a "v2", "v3", etc. cada vez que actualices precios o diseño en GitHub
const CACHE_NAME = "kalon-store-cache-v2";

// Archivos locales y librerías principales que se guardarán para carga instantánea
const INITIAL_ASSETS = [
  "./",
  "./index.html",
  "./style.css",
  "./app.js",
  "./manifest.json",
  "https://cdnjs.cloudflare.com/ajax/libs/jquery/3.7.1/jquery.min.js",
  "https://cdnjs.cloudflare.com/ajax/libs/lodash.js/4.17.21/lodash.min.js",
  "https://cdnjs.cloudflare.com/ajax/libs/animejs/3.2.1/anime.min.js",
  "https://cdnjs.cloudflare.com/ajax/libs/d3/7.8.5/d3.min.js",
  "https://cdn.jsdelivr.net/npm/remixicon@3.5.0/fonts/remixicon.css"
];

// 1. INSTALACIÓN: Guarda los archivos principales en la memoria del dispositivo
self.addEventListener("install", (event) => {
  self.skipWaiting();
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(INITIAL_ASSETS);
    })
  );
});

// 2. ACTIVACIÓN: Borra cachés antiguas cuando subes una nueva versión a GitHub
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keyList) => {
      return Promise.all(
        keyList.map((key) => {
          if (key !== CACHE_NAME) {
            return caches.delete(key);
          }
        })
      );
    })
  );
  self.clients.claim();
});

// 3. INTERCEPTOR SEGURO DE RED (Regla 5 y 6): Sirve rápido desde caché y actualiza en segundo plano
self.addEventListener("fetch", (event) => {
  const request = event.request;

  // Seguridad: Solo procesar peticiones GET seguras (http/https)
  if (request.method !== "GET" || !request.url.startsWith("http")) {
    return;
  }

  event.respondWith(
    caches.match(request).then((cachedResponse) => {
      const networkFetch = fetch(request)
        .then((networkResponse) => {
          // Solo guardamos en caché respuestas válidas y seguras
          if (
            networkResponse &&
            networkResponse.status === 200 &&
            (networkResponse.type === "basic" || networkResponse.type === "cors")
          ) {
            const responseClone = networkResponse.clone();
            caches.open(CACHE_NAME).then((cache) => {
              cache.put(request, responseClone);
            });
          }
          return networkResponse;
        })
        .catch(() => {
          // Si el usuario se queda sin internet navegando, muestra el index guardado
          if (request.mode === "navigate") {
            return caches.match("./index.html");
          }
        });

      // Devuelve la copia rápida en caché si existe; si no, espera la red
      return cachedResponse || networkFetch;
    })
  );
});
