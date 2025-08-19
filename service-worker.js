// JNTU Digital Labs Service Worker
// Version: 2.0
// Purpose: Offline functionality, caching, and performance optimization

const CACHE_NAME = 'jntu-digital-labs-v2.0';
const STATIC_CACHE = 'jntu-static-v2.0';
const DYNAMIC_CACHE = 'jntu-dynamic-v2.0';

// Files to cache immediately
const STATIC_FILES = [
  './',
  './index.html',
  './style.css',
  './style-lab.css',
  './script.js',
  './manifest.json',
  './physics-lab.html',
  './chemistry-lab.html',
  './bee-lab.html',
  './pps-lab.html',
  './python-lab.html',
  './it-workshop.html',
  './elcs-lab.html'
];

// External resources to cache
const EXTERNAL_RESOURCES = [
  'https://vlab.co.in',
  'https://fonts.googleapis.com',
  'https://fonts.gstatic.com',
  'https://cdnjs.cloudflare.com',
  'https://cdn.jsdelivr.net'
];

// Install event - cache static files
self.addEventListener('install', (event) => {
  console.log('🔧 Service Worker: Installing...');
  
  event.waitUntil(
    caches.open(STATIC_CACHE)
      .then((cache) => {
        console.log('📦 Service Worker: Caching static files');
        return cache.addAll(STATIC_FILES);
      })
      .then(() => {
        console.log('✅ Service Worker: Static files cached successfully');
        return self.skipWaiting();
      })
      .catch((error) => {
        console.error('❌ Service Worker: Failed to cache static files:', error);
      })
  );
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  console.log('🚀 Service Worker: Activating...');
  
  event.waitUntil(
    caches.keys()
      .then((cacheNames) => {
        return Promise.all(
          cacheNames.map((cacheName) => {
            if (cacheName !== STATIC_CACHE && cacheName !== DYNAMIC_CACHE) {
              console.log('🗑️ Service Worker: Deleting old cache:', cacheName);
              return caches.delete(cacheName);
            }
          })
        );
      })
      .then(() => {
        console.log('✅ Service Worker: Old caches cleaned up');
        return self.clients.claim();
      })
  );
});

// Fetch event - serve from cache or network
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);
  
  // Skip non-GET requests
  if (request.method !== 'GET') {
    return;
  }
  
  // Handle different types of requests
  if (isStaticFile(request.url)) {
    // Static files - cache first strategy
    event.respondWith(cacheFirst(request, STATIC_CACHE));
  } else if (isExternalResource(request.url)) {
    // External resources - network first with cache fallback
    event.respondWith(networkFirst(request, DYNAMIC_CACHE));
  } else {
    // Other requests - network first
    event.respondWith(networkFirst(request, DYNAMIC_CACHE));
  }
});

// Cache first strategy
async function cacheFirst(request, cacheName) {
  try {
    const cachedResponse = await caches.match(request);
    if (cachedResponse) {
      return cachedResponse;
    }
    
    const networkResponse = await fetch(request);
    if (networkResponse.ok) {
      const cache = await caches.open(cacheName);
      cache.put(request, networkResponse.clone());
    }
    return networkResponse;
  } catch (error) {
    console.error('❌ Cache first strategy failed:', error);
    return new Response('Offline content not available', {
      status: 503,
      statusText: 'Service Unavailable',
      headers: { 'Content-Type': 'text/plain' }
    });
  }
}

// Network first strategy
async function networkFirst(request, cacheName) {
  try {
    const networkResponse = await fetch(request);
    if (networkResponse.ok) {
      const cache = await caches.open(cacheName);
      cache.put(request, networkResponse.clone());
    }
    return networkResponse;
  } catch (error) {
    console.log('🌐 Network failed, trying cache:', error);
    const cachedResponse = await caches.match(request);
    if (cachedResponse) {
      return cachedResponse;
    }
    
    // Return offline page for HTML requests
    if (request.headers.get('accept') && request.headers.get('accept').includes('text/html')) {
      return caches.match('./index.html');
    }
    
    return new Response('Offline content not available', {
      status: 503,
      statusText: 'Service Unavailable',
      headers: { 'Content-Type': 'text/plain' }
    });
  }
}

// Check if request is for a static file
function isStaticFile(url) {
  const staticExtensions = ['.html', '.css', '.js', '.json', '.svg', '.png', '.jpg', '.jpeg', '.gif', '.ico'];
  return staticExtensions.some(ext => url.includes(ext)) || url.endsWith('/');
}

// Check if request is for an external resource
function isExternalResource(url) {
  return EXTERNAL_RESOURCES.some(domain => url.includes(domain));
}

// Background sync for offline actions
self.addEventListener('sync', (event) => {
  console.log('🔄 Service Worker: Background sync triggered:', event.tag);
  
  if (event.tag === 'background-sync') {
    event.waitUntil(doBackgroundSync());
  }
});

// Background sync function
async function doBackgroundSync() {
  try {
    console.log('🔄 Service Worker: Performing background sync...');
    // Add any background sync logic here
    // For example, syncing user preferences, analytics data, etc.
  } catch (error) {
    console.error('❌ Service Worker: Background sync failed:', error);
  }
}

// Push notification handling
self.addEventListener('push', (event) => {
  console.log('📱 Service Worker: Push notification received');
  
  const options = {
    body: event.data ? event.data.text() : 'New content available in JNTU Digital Labs!',
    icon: 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><text y=".9em" font-size="90">🔬</text></svg>',
    badge: 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><text y=".9em" font-size="90">🔬</text></svg>',
    vibrate: [200, 100, 200],
    data: {
      dateOfArrival: Date.now(),
      primaryKey: 1
    },
    actions: [
      {
        action: 'explore',
        title: 'Explore Labs',
        icon: 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg>'
      },
      {
        action: 'close',
        title: 'Close',
        icon: 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>'
      }
    ]
  };
  
  event.waitUntil(
    self.registration.showNotification('JNTU Digital Labs', options)
  );
});

// Notification click handling
self.addEventListener('notificationclick', (event) => {
  console.log('👆 Service Worker: Notification clicked:', event.action);
  
  event.notification.close();
  
  if (event.action === 'explore') {
    event.waitUntil(
      clients.openWindow('/')
    );
  } else if (event.action === 'close') {
    // Just close the notification
    return;
  } else {
    // Default action - open the app
    event.waitUntil(
      clients.openWindow('/')
    );
  }
});

// Message handling for communication with main thread
self.addEventListener('message', (event) => {
  console.log('💬 Service Worker: Message received:', event.data);
  
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
  
  if (event.data && event.data.type === 'GET_VERSION') {
    event.ports[0].postMessage({ version: '2.0' });
  }
  
  if (event.data && event.data.type === 'CACHE_STATUS') {
    caches.keys().then(cacheNames => {
      event.ports[0].postMessage({ cacheNames });
    });
  }
});

// Error handling
self.addEventListener('error', (event) => {
  console.error('❌ Service Worker: Error occurred:', event.error);
});

// Unhandled rejection handling
self.addEventListener('unhandledrejection', (event) => {
  console.error('❌ Service Worker: Unhandled rejection:', event.reason);
});

console.log('🔧 Service Worker: Loaded successfully!');


