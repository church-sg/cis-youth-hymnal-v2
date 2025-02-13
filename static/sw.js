const addResourcesToCache = async (resources) => {
  const cache = await caches.open("v1");
  await cache.addAll(resources);
};


// Stale-while-revalidate caching from:
// https://jcs.wtf/service-worker-stale-while-revalidate/
const fetchAndCacheIfOk = async (event) => {
  try {
    const response = await fetch(event.request)

    // don't cache if response not ok
    if (response.ok) {
      const responseClone = response.clone()
      const cache = await caches.open("v1")
      await cache.put(event.request, responseClone)
    }

    return response;
  } catch (e) {
    return e;
  }
}

const fetchWithCache = async (event) => {
  const cache = await caches.open("v1")
  const response = await cache.match(event.request)
  if (!!response) {
    // cached, so update in the background (no await)
    fetchAndCacheIfOk(event);
    // return cached response
    return response
  } else {
    // not cached, so request and cache
    return fetchAndCacheIfOk(event)
  }
}

const fetchHandler = (event) => {
  // only intercept the request if there is no no-cache header
  if (event.request.headers.get("cache-control") !== "no-cache") {
    event.respondWith(fetchWithCache(event))
  }
}

self.addEventListener("fetch", fetchHandler)

self.addEventListener("install", (event) => {
  event.waitUntil(
    addResourcesToCache([
      // Root route and scripts
      "/",
      "/js/script.js",
      "/js/resize.js",
      // Hymns
      "/chinese/1/",
      "/chinese/10/",
      "/chinese/11/",
      "/chinese/12/",
      "/chinese/13/",
      "/chinese/14/",
      "/chinese/15/",
      "/chinese/16/",
      "/chinese/17/",
      "/chinese/18/",
      "/chinese/19/",
      "/chinese/2/",
      "/chinese/20/",
      "/chinese/21/",
      "/chinese/22/",
      "/chinese/23/",
      "/chinese/24/",
      "/chinese/25/",
      "/chinese/26/",
      "/chinese/27/",
      "/chinese/28/",
      "/chinese/29/",
      "/chinese/3/",
      "/chinese/30/",
      "/chinese/31/",
      "/chinese/32/",
      "/chinese/4/",
      "/chinese/5/",
      "/chinese/6/",
      "/chinese/7/",
      "/chinese/8/",
      "/chinese/9/",
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
      "/english/125/",
      "/english/126/",
      "/english/127/",
      "/english/128/",
      "/english/129/",
      "/english/13/",
      "/english/130/",
      "/english/131/",
      "/english/132/",
      "/english/133/",
      "/english/134/",
      "/english/135/",
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
    ]),
  );
});
