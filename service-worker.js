const CACHE_NAME = 'moon-lander-pwa-widepads-v1';
const ASSETS = [
  './','./index.html','./manifest.webmanifest','./service-worker.js',
  './icons/icon-192.png','./icons/icon-512.png','./apple-touch-icon.png'
];

self.addEventListener('install', e=>{
  e.waitUntil(caches.open(CACHE_NAME).then(c=>c.addAll(ASSETS)));
  self.skipWaiting();
});

self.addEventListener('activate', e=>{
  e.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k=>k!==CACHE_NAME).map(k=>caches.delete(k)))
    )
  );
  self.clients.claim();
});

self.addEventListener('fetch', e=>{
  const req=e.request;
  if (req.mode==='navigate'){
    e.respondWith(
      fetch(req).then(res=>{
        caches.open(CACHE_NAME).then(c=>c.put(req,res.clone()));
        return res;
      }).catch(()=>caches.match('./index.html'))
    );
  } else {
    e.respondWith(
      caches.match(req).then(cached => cached || fetch(req).then(res=>{
        caches.open(CACHE_NAME).then(c=>c.put(req,res.clone()));
        return res;
      }))
    );
  }
});
