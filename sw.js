const C="aegis-v2";
const TILE="aegis-tiles-v1";
const A=["./","./index.html","./leaflet.js","./manifest.webmanifest","./icon-192.png","./icon-512.png","./apple-touch-icon.png"];
self.addEventListener("install",e=>{e.waitUntil(caches.open(C).then(c=>c.addAll(A)).then(()=>self.skipWaiting()));});
self.addEventListener("activate",e=>{e.waitUntil(caches.keys().then(k=>Promise.all(k.filter(x=>x!==C&&x!==TILE).map(x=>caches.delete(x)))).then(()=>self.clients.claim()));});
self.addEventListener("fetch",e=>{
  if(e.request.method!=="GET")return;
  const u=e.request.url;
  // map tiles: cache-first so viewed areas work offline
  if(u.indexOf("basemaps.cartocdn.com")>-1){
    e.respondWith(caches.open(TILE).then(c=>c.match(e.request).then(r=>r||fetch(e.request).then(resp=>{c.put(e.request,resp.clone());return resp;}).catch(()=>r))));
    return;
  }
  e.respondWith(caches.match(e.request).then(r=>r||fetch(e.request).then(resp=>{
    const cp=resp.clone();caches.open(C).then(c=>c.put(e.request,cp));return resp;
  }).catch(()=>caches.match("./index.html"))));
});