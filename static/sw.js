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
    putInCache(response.clone())
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
      "/cis-youth-hymnal-v2/",
      "/cis-youth-hymnal-v2/js/script.js",
      "/cis-youth-hymnal-v2/js/resize.js",
      // Hymns
      "/cis-youth-hymnal-v2/hymns/1/",
      "/cis-youth-hymnal-v2/hymns/10/",
      "/cis-youth-hymnal-v2/hymns/110/",
      "/cis-youth-hymnal-v2/hymns/151/",
      "/cis-youth-hymnal-v2/hymns/155/",
      "/cis-youth-hymnal-v2/hymns/161/",
      "/cis-youth-hymnal-v2/hymns/163/",
      "/cis-youth-hymnal-v2/hymns/164/",
      "/cis-youth-hymnal-v2/hymns/173/",
      "/cis-youth-hymnal-v2/hymns/175/",
      "/cis-youth-hymnal-v2/hymns/200/",
      "/cis-youth-hymnal-v2/hymns/202/",
      "/cis-youth-hymnal-v2/hymns/223/",
      "/cis-youth-hymnal-v2/hymns/24/",
      "/cis-youth-hymnal-v2/hymns/245/",
      "/cis-youth-hymnal-v2/hymns/246/",
      "/cis-youth-hymnal-v2/hymns/255/",
      "/cis-youth-hymnal-v2/hymns/256/",
      "/cis-youth-hymnal-v2/hymns/264/",
      "/cis-youth-hymnal-v2/hymns/265/",
      "/cis-youth-hymnal-v2/hymns/268/",
      "/cis-youth-hymnal-v2/hymns/269/",
      "/cis-youth-hymnal-v2/hymns/274/",
      "/cis-youth-hymnal-v2/hymns/276/",
      "/cis-youth-hymnal-v2/hymns/278/",
      "/cis-youth-hymnal-v2/hymns/281/",
      "/cis-youth-hymnal-v2/hymns/282/",
      "/cis-youth-hymnal-v2/hymns/285/",
      "/cis-youth-hymnal-v2/hymns/296/",
      "/cis-youth-hymnal-v2/hymns/297/",
      "/cis-youth-hymnal-v2/hymns/298/",
      "/cis-youth-hymnal-v2/hymns/3/",
      "/cis-youth-hymnal-v2/hymns/301/",
      "/cis-youth-hymnal-v2/hymns/305/",
      "/cis-youth-hymnal-v2/hymns/309/",
      "/cis-youth-hymnal-v2/hymns/31/",
      "/cis-youth-hymnal-v2/hymns/311/",
      "/cis-youth-hymnal-v2/hymns/32/",
      "/cis-youth-hymnal-v2/hymns/41/",
      "/cis-youth-hymnal-v2/hymns/48/",
      "/cis-youth-hymnal-v2/hymns/53/",
      "/cis-youth-hymnal-v2/hymns/55/",
      "/cis-youth-hymnal-v2/hymns/58/",
      "/cis-youth-hymnal-v2/hymns/66/",
      "/cis-youth-hymnal-v2/hymns/69/",
      "/cis-youth-hymnal-v2/hymns/7/",
      "/cis-youth-hymnal-v2/hymns/72/",
      "/cis-youth-hymnal-v2/hymns/81/",
      "/cis-youth-hymnal-v2/hymns/90/",
      "/cis-youth-hymnal-v2/hymns/99/",
    ])
  )
})
