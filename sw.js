const addResourcesToCache = async (resources) => {
  const cache = await caches.open("v1")
  await cache.addAll(resources)
}

const putInCache = async (request, response) => {
  const cache = await caches.open("v1")
  await cache.put(request, response)
}

const networkFirst = async (request) => {
  try {
    const response = await fetch(request)
    putInCache(request, response.clone())
    return fetch(request)
  } catch (err) {
    return caches.match(request)
  }
}

self.addEventListener("fetch", (event) => {
  event.respondWith(networkFirst(event.request))
})

self.addEventListener("install", (event) => {
  event.waitUntil(
    addResourcesToCache([
      // Root route and scripts
      "/",
      "/js/script.js",
      "/js/resize.js",
      // Hymns
      "/hymns/1/",
      "/hymns/10/",
      "/hymns/110/",
      "/hymns/151/",
      "/hymns/155/",
      "/hymns/159/",
      "/hymns/16/",
      "/hymns/161/",
      "/hymns/163/",
      "/hymns/164/",
      "/hymns/173/",
      "/hymns/175/",
      "/hymns/194/",
      "/hymns/200/",
      "/hymns/202/",
      "/hymns/223/",
      "/hymns/24/",
      "/hymns/245/",
      "/hymns/246/",
      "/hymns/253/",
      "/hymns/255/",
      "/hymns/256/",
      "/hymns/264/",
      "/hymns/265/",
      "/hymns/268/",
      "/hymns/269/",
      "/hymns/274/",
      "/hymns/276/",
      "/hymns/278/",
      "/hymns/281/",
      "/hymns/282/",
      "/hymns/285/",
      "/hymns/296/",
      "/hymns/297/",
      "/hymns/298/",
      "/hymns/3/",
      "/hymns/301/",
      "/hymns/304/",
      "/hymns/305/",
      "/hymns/309/",
      "/hymns/31/",
      "/hymns/311/",
      "/hymns/312/",
      "/hymns/32/",
      "/hymns/39/",
      "/hymns/41/",
      "/hymns/43/",
      "/hymns/48/",
      "/hymns/53/",
      "/hymns/55/",
      "/hymns/58/",
      "/hymns/61/",
      "/hymns/66/",
      "/hymns/69/",
      "/hymns/7/",
      "/hymns/72/",
      "/hymns/75/",
      "/hymns/81/",
      "/hymns/82/",
      "/hymns/83/",
      "/hymns/87/",
      "/hymns/90/",
      "/hymns/99/",
    ])
  )
})
