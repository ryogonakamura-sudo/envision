/* enVision service worker — network-first HTML, cache-first assets */
const CACHE = 'envision-v16';
const SHELL = [
  './',
  './index.html',
  './vocab-data.js',
  './manifest.webmanifest',
  './icon.svg',
  './icon-192.png',
  './icon-512.png',
  './apple-touch-icon.png',
];

self.addEventListener('install', (e) => {
  e.waitUntil(
    caches.open(CACHE)
      // GitHub Pages は index.html に数分の HTTP キャッシュを付ける。素の addAll だと
      // ブラウザのキャッシュから古いシェルを掴んでしまうので、必ず取り直させる。
      .then(c => c.addAll(SHELL.map(u => new Request(u, { cache: 'reload' }))))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys()
      .then(keys => Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

// アプリ本体は index.html にすべて入っている。ここをキャッシュ優先にすると、
// 更新を入れても一度は必ず古い画面が出る（新しい SW が入るのは表示より後のため）。
// 起動のたびにまずネットワークを見て、繋がらないときだけキャッシュに落とす。
const isHtml = (req, url) =>
  req.mode === 'navigate' || url.pathname.endsWith('/') || url.pathname.endsWith('.html');

self.addEventListener('fetch', (e) => {
  const url = new URL(e.request.url);
  // Never intercept Unsplash / external — let them hit network with browser cache.
  if (url.origin !== self.location.origin) return;
  if (e.request.method !== 'GET') return;

  const store = (res) => {
    if (res && res.ok && res.type === 'basic') {
      const copy = res.clone();
      caches.open(CACHE).then(c => c.put(e.request, copy));
    }
    return res;
  };

  if (isHtml(e.request, url)) {
    e.respondWith(
      // GitHub Pages の max-age=600 が効くと、ネットワークを見に行っても 10 分間は
      // ブラウザのキャッシュが古い HTML を返す。スーパーリロードもここは素通しなので、
      // インストール時と同じく必ず取り直させる。
      fetch(new Request(url.href, { cache: 'reload', credentials: 'same-origin' }))
        .then(store)
        .catch(() =>
          caches.match(e.request).then(cached => cached || caches.match('./index.html')))
    );
    return;
  }

  // 画像・アイコン・単語データは滅多に変わらないので、表示を待たせずキャッシュから返す。
  e.respondWith(
    caches.match(e.request).then(cached => {
      const fetched = fetch(e.request).then(store).catch(() => cached);
      return cached || fetched;
    })
  );
});
