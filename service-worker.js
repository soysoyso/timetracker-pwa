const CACHE_NAME = 'tracking-app-cache-v3';
// 앱이 필요로 하는 파일들을 보물 상자에 넣을 목록입니다.
const urlsToCache = [
  '/index.html',
  '/manifest.json',
  'https://unpkg.com/react@18/umd/react.production.min.js',
  'https://unpkg.com/react-dom@18/umd/react-dom.production.min.js',
  'https://unpkg.com/@babel/standalone/babel.min.js',
  'https://cdn.tailwindcss.com',
  'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2',
  '/icons/192192.jpg',
  '/icons/512512.jpg'
];
// 이 코드가 보물 상자를 열고 파일을 넣는 역할을 합니다. (복사해서 그대로 쓰세요!)
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('Opened cache and adding files');
        return cache.addAll(urlsToCache);
      })
  );
});

// 이 코드가 인터넷 대신 보물 상자에서 파일을 찾아주는 역할을 합니다.
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request)
      .then((response) => {
        if (response) {
          return response;
        }
        return fetch(event.request);
      })
  );
});

// 이 코드는 아주 오래된 보물 상자는 치워주는 역할을 합니다.
self.addEventListener('activate', (event) => {
  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );

});


