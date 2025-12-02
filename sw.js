// sw.js - Service Worker PWA limpio y básico

const CACHE_NAME = 'v1_cache_JosuePWA';
const urlsToCache = [
    './',
    './index.html',
    './css/styles.css',
    './img/favicon_16.png',
    './img/favicon_32.png',
    './img/favicon_64.png',
    './img/favicon_96.png',
    './img/favicon_128.png',
    './img/favicon_192.png',
    './img/favicon_256.png',
    './img/favicon_512.png',
    './img/clases.png',
    './img/Monstruos.jpg',
    './img/Hechizos.png'
];

self.addEventListener('install', event => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(cache => cache.addAll(urlsToCache))
            .then(() => self.skipWaiting())
            .catch(err => console.warn('Error al cachear durante install:', err))
    );
});

self.addEventListener('activate', event => {
    const cacheWhitelist = [CACHE_NAME];
    event.waitUntil(
        caches.keys().then(keyList =>
            Promise.all(keyList.map(key => {
                if (!cacheWhitelist.includes(key)) return caches.delete(key);
            }))
        ).then(() => self.clients.claim())
    );
});

self.addEventListener('fetch', event => {
    event.respondWith(
        caches.match(event.request)
        .then(response => {
            return response || fetch(event.request).catch(() => {
                // fallback si quieres: return caches.match('/offline.html')
            });
        })
    );
});
