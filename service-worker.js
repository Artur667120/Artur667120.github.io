const CACHE_NAME = 'inbox-pro-v3';

// Простий Service Worker без складних обробок
self.addEventListener('install', event => {
  console.log('Service Worker installing...');
  self.skipWaiting();
});

self.addEventListener('activate', event => {
  console.log('Service Worker activating...');
  event.waitUntil(clients.claim());
});

self.addEventListener('fetch', event => {
  // Дозволяємо всім зовнішнім запитам проходити без кешування
  if (event.request.url.includes('firebase') || 
      event.request.url.includes('gstatic.com') ||
      event.request.url.includes('googleapis.com')) {
    return fetch(event.request);
  }
  
  // Для локальних файлів пробуємо кеш
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        // Cache hit - return response
        if (response) {
          return response;
        }
        
        // Clone the request
        const fetchRequest = event.request.clone();
        
        return fetch(fetchRequest).then(response => {
          // Check if valid response
          if (!response || response.status !== 200 || response.type !== 'basic') {
            return response;
          }
          
          // Clone the response
          const responseToCache = response.clone();
          
          caches.open(CACHE_NAME)
            .then(cache => {
              cache.put(event.request, responseToCache);
            });
            
          return response;
        }).catch(() => {
          // Fallback for offline
          if (event.request.mode === 'navigate') {
            return caches.match('/index.html');
          }
          return new Response('Offline', { status: 503 });
        });
      })
  );
});

// Push notifications (опціонально)
self.addEventListener('push', event => {
  const options = {
    body: event.data?.text() || 'New email received!',
    icon: '/icon-192.png',
    badge: '/icon-192.png',
    vibrate: [100, 50, 100]
  };
  
  event.waitUntil(
    self.registration.showNotification('Inbox Pro', options)
  );
});
