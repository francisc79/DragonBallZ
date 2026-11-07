const CACHE_NAME = 'dbz-memory-v3';

// Arquivos essenciais para o jogo iniciar
// (Não precisamos listar todas as imagens aqui, vamos cachear elas dinamicamente)
const urlsToCache = [
  './',
  './index.html',
  './style.css',
  './script.js',
  './img/DBZ.png'
];

// 1. Instalação: Cacheia os arquivos estáticos iniciais
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('Cache aberto');
        return cache.addAll(urlsToCache);
      })
  );
});

// 2. Requisição (Fetch): Serve arquivos do cache ou busca na rede
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request)
      .then((response) => {
        // Se encontrou no cache, retorna o arquivo cacheado
        if (response) {
          return response;
        }

        // Se não encontrou, busca na internet
        return fetch(event.request).then(
          (response) => {
            // Verifica se a resposta é válida
            if(!response || response.status !== 200 || response.type !== 'basic') {
              return response;
            }

            // IMPORTANTE: Clona a resposta. 
            // Uma vai para o navegador e a outra vai para o cache (para a próxima vez)
            const responseToCache = response.clone();

            caches.open(CACHE_NAME)
              .then((cache) => {
                cache.put(event.request, responseToCache);
              });

            return response;
          }
        );
      })
  );
});

// 3. Ativação: Limpa caches antigos se você mudar a versão (v1 para v2)
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