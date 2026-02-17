// Service Worker pour JeuTaime
const CACHE_NAME = 'jeutaime-v2.0.1';
const urlsToCache = [
  '/',
  '/index.html',
  '/heart.svg'
];

// Installation du Service Worker
self.addEventListener('install', (event) => {
  console.log('[SW] Installation...');
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('[SW] Cache ouvert');
        return cache.addAll(urlsToCache);
      })
      .catch((error) => {
        console.log('[SW] Erreur lors du cache:', error);
      })
  );
  // Activer immédiatement le nouveau SW
  self.skipWaiting();
});

// Activation du Service Worker
self.addEventListener('activate', (event) => {
  console.log('[SW] Activation...');
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            console.log('[SW] Suppression ancien cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
  // Prendre le contrôle de tous les clients immédiatement
  self.clients.claim();
});

// Stratégie de cache: Network First, fallback to Cache
self.addEventListener('fetch', (event) => {
  // Ignorer les requêtes non-GET
  if (event.request.method !== 'GET') {
    return;
  }

  // Ignorer les requêtes vers des domaines externes
  if (!event.request.url.startsWith(self.location.origin)) {
    return;
  }

  event.respondWith(
    fetch(event.request)
      .then((response) => {
        // Cloner la réponse car elle ne peut être consommée qu'une fois
        const responseToCache = response.clone();

        // Mettre en cache les réponses valides
        if (response.status === 200) {
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, responseToCache);
          });
        }

        return response;
      })
      .catch(() => {
        // Si le réseau échoue, utiliser le cache
        return caches.match(event.request)
          .then((cachedResponse) => {
            if (cachedResponse) {
              return cachedResponse;
            }

            // Si pas de cache et réseau down, retourner une page offline
            if (event.request.destination === 'document') {
              return caches.match('/');
            }
          });
      })
  );
});

// Gérer les messages du client
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});
