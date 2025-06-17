const CACHE_VERSION = "c4h-v1.0.0"
const CACHE_NAMES = {
  static: `c4h-static-${CACHE_VERSION}`,
  dynamic: `c4h-dynamic-${CACHE_VERSION}`,
  offline: `c4h-offline-${CACHE_VERSION}`,
}

// Critical healthcare URLs to cache
const CRITICAL_CACHE_URLS = ["/", "/patients", "/appointments", "/offline.html", "/manifest.json"]

// Install event - cache critical resources
self.addEventListener("install", (event) => {
  event.waitUntil(caches.open(CACHE_NAMES.static).then((cache) => cache.addAll(CRITICAL_CACHE_URLS)))
  self.skipWaiting()
})

// Activate event - clean old caches
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (!Object.values(CACHE_NAMES).includes(cacheName)) {
            return caches.delete(cacheName)
          }
        }),
      )
    }),
  )
  self.clients.claim()
})

// Fetch event - implement caching strategies
self.addEventListener("fetch", (event) => {
  const { request } = event
  const url = new URL(request.url)

  // Healthcare API - Network first with fallback
  if (url.pathname.startsWith("/api/")) {
    event.respondWith(networkFirstStrategy(request))
  }
  // Static assets - Cache first
  else if (request.destination === "script" || request.destination === "style" || request.destination === "image") {
    event.respondWith(cacheFirstStrategy(request))
  }
  // HTML pages - Network first with offline fallback
  else if (request.destination === "document") {
    event.respondWith(networkFirstWithOfflineFallback(request))
  }
  // Default - Network first
  else {
    event.respondWith(networkFirstStrategy(request))
  }
})

// Caching strategies
async function networkFirstStrategy(request) {
  try {
    const response = await fetch(request)
    if (response.ok) {
      const cache = await caches.open(CACHE_NAMES.dynamic)
      cache.put(request, response.clone())
    }
    return response
  } catch (error) {
    const cachedResponse = await caches.match(request)
    return cachedResponse || new Response("Offline", { status: 503 })
  }
}

async function cacheFirstStrategy(request) {
  const cachedResponse = await caches.match(request)
  if (cachedResponse) {
    return cachedResponse
  }

  try {
    const response = await fetch(request)
    if (response.ok) {
      const cache = await caches.open(CACHE_NAMES.static)
      cache.put(request, response.clone())
    }
    return response
  } catch (error) {
    return new Response("Resource not available offline", { status: 503 })
  }
}

async function networkFirstWithOfflineFallback(request) {
  try {
    const response = await fetch(request)
    return response
  } catch (error) {
    const cachedResponse = await caches.match(request)
    if (cachedResponse) {
      return cachedResponse
    }
    return caches.match("/offline.html")
  }
}
