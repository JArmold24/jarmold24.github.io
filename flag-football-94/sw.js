// Retires the old offline copy of the web game. Browsers that opened the game before still have its service
// worker, which keeps serving the cached game. When they next visit, they fetch this file, which replaces that
// worker: it deletes the game's caches, unregisters itself and reloads the open page, so it shows the current
// page from the site. The site registers no service worker any more.
self.addEventListener('install', () => self.skipWaiting());
self.addEventListener('activate', e => {
  e.waitUntil((async () => {
    const keys = await caches.keys();
    await Promise.all(keys.filter(k => k.indexOf('ff94-') === 0).map(k => caches.delete(k)));
    await self.registration.unregister();
    const open = await self.clients.matchAll({ type: 'window' });
    for (const c of open) { try { await c.navigate(c.url); } catch (err) {} }
  })());
});
