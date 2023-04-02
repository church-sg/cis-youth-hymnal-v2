const addResourcesToCache = async (resources) => {
  const cache = await caches.open("v1");
  await cache.addAll(resources);
};

const putInCache = async (request, response) => {
  const cache = await caches.open("v1");
  await cache.put(request, response);
};

const networkFirst = async (request) => {
  try {
    const response = await fetch(request);
    putInCache(request, response.clone());
    return fetch(request);
  } catch (err) {
    return caches.match(request);
  }
};

self.addEventListener("fetch", (event) => {
  event.respondWith(networkFirst(event.request));
});

self.addEventListener("install", (event) => {
  event.waitUntil(
    addResourcesToCache([
      // Root route and scripts
      "/",
      "/js/script.js",
      "/js/resize.js",
      // Hymns
      "/chinese/46/",
      "/chinese/49/",
      "/chinese/50/",
      "/chinese/52/",
      "/chinese/71/",
      "/english/1/",
      "/english/10/",
      "/english/110/",
      "/english/151/",
      "/english/155/",
      "/english/159/",
      "/english/16/",
      "/english/161/",
      "/english/163/",
      "/english/164/",
      "/english/173/",
      "/english/175/",
      "/english/194/",
      "/english/200/",
      "/english/202/",
      "/english/223/",
      "/english/24/",
      "/english/245/",
      "/english/246/",
      "/english/253/",
      "/english/255/",
      "/english/256/",
      "/english/262/",
      "/english/264/",
      "/english/265/",
      "/english/268/",
      "/english/269/",
      "/english/274/",
      "/english/276/",
      "/english/278/",
      "/english/281/",
      "/english/282/",
      "/english/285/",
      "/english/296/",
      "/english/297/",
      "/english/298/",
      "/english/3/",
      "/english/301/",
      "/english/304/",
      "/english/305/",
      "/english/309/",
      "/english/31/",
      "/english/311/",
      "/english/312/",
      "/english/32/",
      "/english/39/",
      "/english/40/",
      "/english/41/",
      "/english/43/",
      "/english/48/",
      "/english/53/",
      "/english/55/",
      "/english/58/",
      "/english/61/",
      "/english/66/",
      "/english/69/",
      "/english/7/",
      "/english/72/",
      "/english/75/",
      "/english/81/",
      "/english/82/",
      "/english/83/",
      "/english/87/",
      "/english/90/",
      "/english/99/",
    ])
  );
});
