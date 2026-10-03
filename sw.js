// 스왑핏 오프라인 캐시 — 파일을 고치면 VERSION 숫자를 올려주세요
const VERSION="swapfit-v1";
const SHELL=["/","/index.html","/manifest.json","/icons/icon-192.png","/icons/icon-512.png","/icons/favicon.svg"];
self.addEventListener("install",e=>{e.waitUntil(caches.open(VERSION).then(c=>c.addAll(SHELL)).then(()=>self.skipWaiting()))});
self.addEventListener("activate",e=>{e.waitUntil(caches.keys().then(ks=>Promise.all(ks.filter(k=>k!==VERSION).map(k=>caches.delete(k)))).then(()=>self.clients.claim()))});
self.addEventListener("fetch",e=>{
  if(e.request.method!=="GET")return;
  const url=new URL(e.request.url);
  if(url.origin!==location.origin)return;
  // 페이지는 네트워크 우선(최신 버전), 실패하면 캐시
  if(e.request.mode==="navigate"){e.respondWith(fetch(e.request).then(r=>{const cp=r.clone();caches.open(VERSION).then(c=>c.put("/",cp));return r}).catch(()=>caches.match("/")));return}
  e.respondWith(caches.match(e.request).then(m=>m||fetch(e.request)));
});
