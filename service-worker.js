const CACHE_NAME = 'tracking-app-cache-v8';  // ✅ 버전 업

// 📦 앱이 오프라인에서도 동작하도록 미리 저장할 파일 목록
const urlsToCache = [
  '/timetracker-pwa/',
  '/timetracker-pwa/index.html',
  '/timetracker-pwa/manifest.json',
  '/timetracker-pwa/icons/192192.jpg',
  '/timetracker-pwa/icons/512512.jpg',
  
  // ✅ React & Babel
  'https://unpkg.com/react@18/umd/react.production.min.js',
  'https://unpkg.com/react-dom@18/umd/react-dom.production.min.js',
  'https://unpkg.com/@babel/standalone/babel.min.js',
  
  // ✅ Tailwind CSS
  'https://cdn.tailwindcss.com',
  
  // ✅ Supabase UMD 버전 (HTML과 일치)
  'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2.42.4/dist/umd/supabase.min.js'
];

// 🚀 설치 단계: 캐시 생성 및 파일 저장
self.addEventListener('install', (event) => {
  console.log('📦 Service Worker 설치 중...');
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('✅ 캐시 생성 완료');
      return cache.addAll(urlsToCache);
    })
  );
  // ✅ 즉시 활성화
  self.skipWaiting();
});

// 🌐 네트워크 요청 시 캐시 확인 후 응답
self.addEventListener('fetch', (event) => {
  const requestUrl = event.request.url;
  
  // ✅ Supabase API 요청은 캐시하지 않음 (항상 최신 데이터 유지)
  if (requestUrl.includes('supabase.co')) {
    return;
  }
  
  event.respondWith(
    caches.match(event.request).then((response) => {
      // 캐시가 있으면 캐시에서 응답, 없으면 네트워크로 요청
      return response || fetch(event.request);
    })
  );
});

// 🧹 오래된 캐시 정리 (버전 갱신 시 실행)
self.addEventListener('activate', (event) => {
  console.log('🧹 Service Worker 활성화 중...');
  const cacheWhitelist = [CACHE_NAME];
  
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (!cacheWhitelist.includes(cacheName)) {
            console.log('🧹 오래된 캐시 삭제:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => {
      // ✅ 즉시 제어권 획득
      return self.clients.claim();
    })
  );
});

