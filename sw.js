//const { cache } = require("react");

const CACHE_NAME = 'v1_cache_JosuePWA';

var urlToCache = [
    './',
    './css/styles.css',
    './img/favicon.png',
    './img/clases.jpg',
    './img/Hechizos.png',
    './img/Monstruos.jpg',
    './img/twitter.png',
    './img/instagram.png',
    './img/facebook.png',
    './img/favicon_16.png',
    './img/favicon_32.png',
    './img/favicon_64.png',
    './img/favicon_96.png',
    './img/favicon_128.png',
    './img/favicon_192.png',
    './img/favicon_256.png',
    './img/favicon_385.png',
    './img/favicon_512.png',
    './img/favicon_1024.png'
];

self.addEventListener('install',e =>{
    e.waitUntil(
        caches.open(CACHE_NAME)
        .then(cache =>{
            return cache.addAll(urlToCache)
            .then(()=>{
                self.skipWainting();
            });
        })
        .catch(err => console.log('No se a registrado el cache',err))
    );
});

self.registration.showNotification("Prueba desde SW", {
    body: "El service worker sí funciona.",
    icon: "./img/favicon_192.png"
});


self.addEventListener('activate',e =>{
    const cacheWhitelist = [CACHE_NAME];
    e.waitUntil(
        caches.keys()
        .then(cacheNames => {
    return Promise.all(
        cacheNames.map(cacheName => {
                    if(cacheWhitelist.indexOf(cacheName) === -1){
                        return caches.delete(cacheName);
                    }
                })
            );

        })
        .then(() =>{
            self.clients.claim();
        })
    );
});

self.addEventListener('fetch', e => {
    e.respondWith(
        caches.match(e.request)
        .then(res =>{
            if(res){
                return res;
            }
            return fetch(e.request);
        })
    )

});
