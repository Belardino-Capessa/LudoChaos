const CACHE_NAME = "ludochaos-v5";

// arquivos essenciais do jogo
const FILES = [
  "./",
  "./index.html",
  "./manifest.json",

  "./assets/imagem/logo192.png",
  "./assets/imagem/logo512.png"
];

// =========================
// INSTALL
// =========================
self.addEventListener("install", (event) => {
  self.skipWaiting();

  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(FILES);
    })
  );
});

// =========================
// ACTIVATE
// =========================
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys.map((key) => {
          if (key !== CACHE_NAME) {
            return caches.delete(key);
          }
        })
      )
    )
  );
});

// =========================
// FETCH (offline first inteligente)
// =========================
self.addEventListener("fetch", (event) => {
  const req = event.request;

  // navegação (HTML)
  if (req.mode === "navigate") {
    event.respondWith(
      fetch(req).catch(() => caches.match("./index.html"))
    );
    return;
  }

  // cache-first para assets
  event.respondWith(
    caches.match(req).then((cached) => {
      return cached || fetch(req).catch(() => cached);
    })
  );
});

// =========================
// BACKGROUND SYNC (base)
// =========================
self.addEventListener("sync", (event) => {
  if (event.tag === "sync-game-data") {
    event.waitUntil(syncGameData());
  }
});

async function syncGameData() {
  console.log("🔄 Sync LudoChaos executado");
}

// =========================
// PUSH NOTIFICATIONS (base)
// =========================
self.addEventListener("push", (event) => {
  const data = event.data ? event.data.text() : "Nova atualização no LudoChaos";

  event.waitUntil(
    self.registration.showNotification("LudoChaos", {
      body: data,
      icon: "./assets/imagem/logo192.png"
    })
  );
});
