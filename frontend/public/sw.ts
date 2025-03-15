/// <reference lib="webworker" />

self.addEventListener("install", (event) => {
  console.log("!!!", event);
  console.log("Service Worker installed");
});

self.addEventListener("activate", (event) => {
  console.log("!!!", event);
  console.log("Service Worker activated");
});

self.addEventListener("fetch", (event: FetchEvent) => {
  console.log("Fetching:", event.request.url);
});
