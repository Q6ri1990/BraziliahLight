self.addEventListener('install', function (event) {
    console.log('new SW Installed');
    event.waitUntil(
      caches.open('static')
        .then(function (cache) {
          // cache.add('/');
          // cache.add('/index.html');
          // cache.add('/src/js/app.js');
          cache.addAll([
            '/',
            '/index.html',
            '/css/style.css',
            '/js/script.js'
          ]);
        })
    );
  });
  
  self.addEventListener('activate', function () {
    console.log('new SW Activated');
  });
  
  self.addEventListener('fetch', function(event) {
    event.respondWith(
      caches.match(event.request)
        .then(function(res) {
          if (res) {
            return res;
          } else {
            return fetch(event.request);
          }
        })
    );
  });