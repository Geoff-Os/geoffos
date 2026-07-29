/* GeoffOS service worker — app shell cache only.
 * Sheet data is never cached here; that lives in localStorage so it stays
 * consistent with the offline write queue. Bump VERSION to force an update. */

var VERSION = 'geoffos-v6';
var SHELL = ['./', './index.html', './manifest.webmanifest', './icon-192.png', './icon-512.png'];

self.addEventListener('install', function (e) {
  e.waitUntil(
    caches.open(VERSION)
      .then(function (c) { return c.addAll(SHELL); })
      .then(function () { return self.skipWaiting(); })
  );
});

self.addEventListener('activate', function (e) {
  e.waitUntil(
    caches.keys().then(function (keys) {
      return Promise.all(keys.map(function (k) {
        return k === VERSION ? null : caches.delete(k);
      }));
    }).then(function () { return self.clients.claim(); })
  );
});

self.addEventListener('fetch', function (e) {
  var url = new URL(e.request.url);

  // Never touch backend calls — they must fail loudly so the queue engages.
  if (url.hostname.indexOf('script.google') !== -1) return;
  if (e.request.method !== 'GET') return;

  // Fonts: cache-first and keep forever. They never change, and going to the
  // network for them causes a visible reflow on every cold start.
  if (url.hostname.indexOf('fonts.g') !== -1) {
    e.respondWith(
      caches.match(e.request).then(function (hit) {
        return hit || fetch(e.request).then(function (res) {
          var copy = res.clone();
          caches.open(VERSION).then(function (c) { c.put(e.request, copy); });
          return res;
        });
      })
    );
    return;
  }

  // Network first, fall back to cache, so you get fresh code when online.
  e.respondWith(
    fetch(e.request).then(function (res) {
      var copy = res.clone();
      caches.open(VERSION).then(function (c) { c.put(e.request, copy); });
      return res;
    }).catch(function () {
      return caches.match(e.request).then(function (hit) {
        return hit || caches.match('./index.html');
      });
    })
  );
});
