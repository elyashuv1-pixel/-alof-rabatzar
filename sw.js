// גרסת מטמון: שינוי המספר מאלץ הורדה מחדש של הדף והאייקונים
const CACHE = 'rabatzar-v3';
const ASSETS = ['./', './index.html', './manifest.webmanifest?v=3', './icons/icon-192.png?v=3', './icons/icon-512.png?v=3', './icons/maskable-192.png?v=3', './icons/maskable-512.png?v=3', './icons/apple-touch-icon.png?v=3', './icons/favicon-32.png?v=3', './icons/favicon-64.png?v=3'];
self.addEventListener('install', (e) => { e.waitUntil(caches.open(CACHE).then((c) => c.addAll(ASSETS)).then(() => self.skipWaiting())); });
self.addEventListener('activate', (e) => { e.waitUntil(caches.keys().then((ks) => Promise.all(ks.filter((k) => k !== CACHE).map((k) => caches.delete(k)))).then(() => self.clients.claim())); });
self.addEventListener('fetch', (e) => {
  const req = e.request; if (req.method !== 'GET' || new URL(req.url).origin !== location.origin) return;
  // הדף: קודם מהרשת (כדי לקבל עדכונים), ובלי רשת מהמטמון. אייקונים: מהמטמון.
  if (req.mode === 'navigate') { e.respondWith(fetch(req).then((r) => { const cp = r.clone(); caches.open(CACHE).then((c) => c.put('./index.html', cp)); return r; }).catch(() => caches.match('./index.html'))); return; }
  e.respondWith(caches.match(req).then((m) => m || fetch(req)));
});
