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
      "/english/1/",
      "/english/10/",
      "/english/100/",
      "/english/101/",
      "/english/102/",
      "/english/103/",
      "/english/104/",
      "/english/105/",
      "/english/106/",
      "/english/107/",
      "/english/108/",
      "/english/109/",
      "/english/11/",
      "/english/110/",
      "/english/111/",
      "/english/112/",
      "/english/113/",
      "/english/114/",
      "/english/115/",
      "/english/116/",
      "/english/117/",
      "/english/118/",
      "/english/119/",
      "/english/12/",
      "/english/120/",
      "/english/121/",
      "/english/122/",
      "/english/123/",
      "/english/124/",
      "/english/13/",
      "/english/14/",
      "/english/15/",
      "/english/16/",
      "/english/17/",
      "/english/18/",
      "/english/19/",
      "/english/2/",
      "/english/20/",
      "/english/21/",
      "/english/22/",
      "/english/23/",
      "/english/24/",
      "/english/25/",
      "/english/26/",
      "/english/27/",
      "/english/28/",
      "/english/29/",
      "/english/3/",
      "/english/30/",
      "/english/31/",
      "/english/32/",
      "/english/33/",
      "/english/34/",
      "/english/35/",
      "/english/36/",
      "/english/37/",
      "/english/38/",
      "/english/39/",
      "/english/4/",
      "/english/40/",
      "/english/41/",
      "/english/42/",
      "/english/43/",
      "/english/44/",
      "/english/45/",
      "/english/46/",
      "/english/47/",
      "/english/48/",
      "/english/49/",
      "/english/5/",
      "/english/50/",
      "/english/51/",
      "/english/52/",
      "/english/53/",
      "/english/54/",
      "/english/55/",
      "/english/56/",
      "/english/57/",
      "/english/58/",
      "/english/59/",
      "/english/6/",
      "/english/60/",
      "/english/61/",
      "/english/62/",
      "/english/63/",
      "/english/64/",
      "/english/65/",
      "/english/66/",
      "/english/67/",
      "/english/68/",
      "/english/69/",
      "/english/7/",
      "/english/70/",
      "/english/71/",
      "/english/72/",
      "/english/73/",
      "/english/74/",
      "/english/75/",
      "/english/76/",
      "/english/77/",
      "/english/78/",
      "/english/79/",
      "/english/8/",
      "/english/80/",
      "/english/81/",
      "/english/82/",
      "/english/83/",
      "/english/84/",
      "/english/85/",
      "/english/86/",
      "/english/87/",
      "/english/88/",
      "/english/89/",
      "/english/9/",
      "/english/90/",
      "/english/91/",
      "/english/92/",
      "/english/93/",
      "/english/94/",
      "/english/95/",
      "/english/96/",
      "/english/97/",
      "/english/98/",
      "/english/99/",
    ])
  );
});
