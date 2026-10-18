// Reading List — offline cache
// ファイルを更新したら CACHE の番号を上げてください（v5 → v6）
const CACHE = 'reading-list-v5';
const ASSETS = [
  './',
  './index.html',
  './manifest.json',
  './icon.svg',
  './icon-180.png',
  './icon-192.png',
  './icon-512.png'
];

self.addEventListener('install', (e) => {
  e.waitUntil(
    caches.open(CACHE)
      .then((c) => c.addAll(ASSETS.map((u) => new Request(u, { cache: 'reload' }))))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

// ネットにつながるまで最大 timeout ms 待つ（電波が弱いときはキャッシュに切り替える）
function fetchWithTimeout(req, ms) {
  return new Promise((resolve) => {
    const timer = setTimeout(() => resolve(null), ms);
    fetch(req, { cache: 'no-cache' })
      .then((res) => { clearTimeout(timer); resolve(res && res.ok ? res : null); })
      .catch(() => { clearTimeout(timer); resolve(null); });
  });
}

self.addEventListener('fetch', (e) => {
  const req = e.request;
  const url = new URL(req.url);
  if (req.method !== 'GET' || url.origin !== self.location.origin) return;

  // アプリ本体（画面を開いたとき）：ネットの最新版を優先、つながらなければキャッシュ
  const isPage = req.mode === 'navigate' || url.pathname.endsWith('/index.html') || url.pathname.endsWith('/');
  if (isPage) {
    e.respondWith((async () => {
      const cache = await caches.open(CACHE);
      const res = await fetchWithTimeout(req, 3000);
      if (res) { cache.put('./index.html', res.clone()); return res; }
      return (await cache.match('./index.html')) || (await cache.match('./')) || new Response('Offline', { status: 503 });
    })());
    return;
  }

  // アイコンなど：キャッシュを返し、裏で新しい版に差し替える
  e.respondWith((async () => {
    const cache = await caches.open(CACHE);
    const cached = await cache.match(req, { ignoreSearch: true });
    const network = fetch(req)
      .then((res) => { if (res && res.ok) cache.put(req, res.clone()); return res; })
      .catch(() => null);
    if (cached) { e.waitUntil(network); return cached; }
    return (await network) || new Response('', { status: 504 });
  })());
});
