/* service worker — تخزين مؤقت للعمل بدون إنترنت */
var CACHE = "ks-calc-v37";
var ASSETS = [
  "./", "./index.html", "./privacy.html", "./app.js", "./data.js", "./data2.js", "./data3.js", "./data4.js", "./data5.js", "./styles.css",
  "./manifest.webmanifest", "./icon.svg", "./icon-192.png", "./icon-512.png"
];
self.addEventListener("install", function (e) {
  e.waitUntil(caches.open(CACHE).then(function (c) { return c.addAll(ASSETS); }).then(function () { return self.skipWaiting(); }));
});
self.addEventListener("activate", function (e) {
  e.waitUntil(caches.keys().then(function (keys) {
    return Promise.all(keys.map(function (k) { if (k !== CACHE) return caches.delete(k); }));
  }).then(function () { return self.clients.claim(); }));
});
self.addEventListener("fetch", function (e) {
  if (e.request.method !== "GET") return;
  // لا تتدخّل في طلبات الطرف الثالث (إعلانات/تحليلات) — تمر مباشرة للشبكة
  if (new URL(e.request.url).origin !== self.location.origin) return;
  e.respondWith(
    caches.match(e.request).then(function (cached) {
      return cached || fetch(e.request).then(function (res) {
        var copy = res.clone();
        caches.open(CACHE).then(function (c) { c.put(e.request, copy); });
        return res;
      }).catch(function () { return cached; });
    })
  );
});
