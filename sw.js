/* Offline-Unterstützung: App-Dateien werden zwischengespeichert, Lernstände laufen nie über den Cache. */
const CACHE = 'japan-trainer-v0.6';
const SHELL = ['./', 'index.html', 'supabase.js', 'manifest.webmanifest',
  'icons/icon-192.png', 'icons/icon-512.png', 'icons/apple-touch-icon.png'];

self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(SHELL)).then(() => self.skipWaiting()));
});
self.addEventListener('activate', e => {
  e.waitUntil(caches.keys()
    .then(keys => Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k))))
    .then(() => self.clients.claim()));
});
self.addEventListener('fetch', e => {
  const req = e.request;
  if (req.method !== 'GET') return;
  const url = new URL(req.url);
  if (url.hostname.endsWith('supabase.co')) return;          // Datenbank nie cachen
  if (req.mode === 'navigate' || url.pathname.endsWith('/audio/index.json')) {   // immer die neueste Version, offline aus dem Cache                              // App-Seite: online immer die neueste Version
    const slot = req.mode === 'navigate' ? 'index.html' : req;
    e.respondWith(fetch(req).then(res => {
      const copy = res.clone(); caches.open(CACHE).then(c => c.put(slot, copy)); return res;
    }).catch(() => caches.match(slot)));
    return;
  }
  e.respondWith(caches.match(req).then(hit => {               // Rest: aus dem Cache, im Hintergrund aktualisieren
    const net = fetch(req).then(res => {
      if (res.ok || res.type === 'opaque') { const copy = res.clone(); caches.open(CACHE).then(c => c.put(req, copy)); }
      return res;
    }).catch(() => hit);
    return hit || net;
  }));
});
