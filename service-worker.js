const CACHE_NAME = "ludochaos-v6.2";

// =========================
// ARQUIVOS ESSENCIAIS
// =========================
const FILES = [
  "./",
  "./index.html",
  "./manifest.json",

  // ICONS
  "./assets/imagem/logo192.png",
  "./assets/imagem/logo512.png",
  "./assets/imagem/logo.png",

  // SCREENSHOTS
  "./assets/imagem/screen1.png",
  "./assets/imagem/screen2.png",
  "./assets/imagem/screen3.png",
  "./assets/imagem/screen4.png",
  "./assets/imagem/screen5.png",

  // FONT AWESOME
  "./assets/fontawesome/css/all.min.css",
  "./assets/fontawesome/webfonts/fa-solid-900.woff2",
  "./assets/fontawesome/webfonts/fa-regular-400.woff2",
  "./assets/fontawesome/webfonts/fa-brands-400.woff2",

  // FONTES
  "./assets/fontes/DMSerifDisplay-Regular.ttf",
  "./assets/fontes/Inter-Bold.ttf",
  "./assets/fontes/Inter-Medium.ttf",
  "./assets/fontes/Inter-Regular.ttf",
  "./assets/fontes/Inter-SemiBold.ttf",

  // SONS
  "./assets/musicas/fundo.mp3",
  "./assets/musicas/fundo1.mp3",
  "./assets/musicas/vitoria.mp3"
];

// =========================
// INSTALL
// =========================
self.addEventListener("install", (event) => {
  self.skipWaiting();

  event.waitUntil(
    caches.open(CACHE_NAME).then(async (cache) => {
      console.log("📦 Cache LudoChaos v6.2");

      for (const file of FILES) {
        try {
          await cache.add(file);
        } catch (err) {
          console.warn("⚠️ Falhou cache:", file);
        }
      }
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
          if (key !== CACHE_NAME) return caches.delete(key);
        })
      )
    )
  );

  self.clients.claim();
});

// =========================
// FETCH (offline first)
// =========================
self.addEventListener("fetch", (event) => {
  const req = event.request;

  if (req.mode === "navigate") {
    event.respondWith(
      fetch(req).catch(() => caches.match("./index.html"))
    );
    return;
  }

  event.respondWith(
    caches.match(req).then((cached) => {
      return cached || fetch(req).catch(() => cached);
    })
  );
});

// =========================
// BACKGROUND SYNC
// =========================
self.addEventListener("sync", (event) => {
  if (event.tag === "sync-game-data") {
    event.waitUntil(syncGameData());
  }
});

async function syncGameData() {
  console.log("🔄 Sync manual LudoChaos executado");
}

// =========================
// PERIODIC BACKGROUND SYNC
// =========================
self.addEventListener("periodicsync", (event) => {
  if (event.tag === "sync-ludochaos-periodic") {
    event.waitUntil(syncPeriodicData());
  }
});

async function syncPeriodicData() {
  console.log("⏳ Sync periódica LudoChaos executada");
}

// =========================
// PUSH NOTIFICATIONS
// =========================
self.addEventListener("push", (event) => {
  const data = event.data ? event.data.text() : "Atualização no LudoChaos";

  event.waitUntil(
    self.registration.showNotification("LudoChaos", {
      body: data,
      icon: "./assets/imagem/logo192.png"
    })
  );
});
