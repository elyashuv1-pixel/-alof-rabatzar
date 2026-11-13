// גרסת מטמון: כשמעלים את המספר, הדף והאייקונים נטענים מחדש
const CACHE = 'rabatzar-v5';
const ASSETS = ['./', './index.html', './manifest.webmanifest?v=5', './icon-192.png?v=5', './icon-512.png?v=5', './maskable-192.png?v=5', './maskable-512.png?v=5', './apple-touch-icon.png?v=5', './favicon-32.png?v=5', './favicon-64.png?v=5'];
self.addEventListener('install', (e) => {
  // כל קובץ נשמר בנפרד, כך שקובץ חסר אחד לא מכשיל את כל ההתקנה
  e.waitUntil(caches.open(CACHE).then((c) => Promise.all(ASSETS.map((u) => c.add(u).catch(() => null)))).then(() => self.skipWaiting()));
});
self.addEventListener('activate', (e) => {
  e.waitUntil(caches.keys().then((ks) => Promise.all(ks.filter((k) => k !== CACHE).map((k) => caches.delete(k)))).then(() => self.clients.claim()));
});
self.addEventListener('fetch', (e) => {
  const req = e.request;
  if (req.method !== 'GET' || new URL(req.url).origin !== location.origin) return;
  if (req.mode === 'navigate') {
    e.respondWith(fetch(req).then((r) => { const cp = r.clone(); caches.open(CACHE).then((c) => c.put('./index.html', cp)); return r; }).catch(() => caches.match('./index.html')));
    return;
  }
  e.respondWith(caches.match(req).then((m) => m || fetch(req)));
});
