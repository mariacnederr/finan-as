/* Service worker: funciona offline e mostra lembretes de contas pendentes */
const V = 'gastos-v1';
const ARQ = ['./', 'index.html', 'app.js', 'style.css', 'manifest.webmanifest', 'icons/icon-192.png', 'icons/icon-512.png'];

self.addEventListener('install', e => {
  e.waitUntil(caches.open(V).then(c => c.addAll(ARQ)).then(() => self.skipWaiting()));
});
self.addEventListener('activate', e => {
  e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k !== V && k !== 'gx-dados').map(k => caches.delete(k)))).then(() => self.clients.claim()));
});
// rede primeiro (atualizações aparecem logo); sem internet, usa a cópia salva
self.addEventListener('fetch', e => {
  const req = e.request;
  if (req.method !== 'GET' || new URL(req.url).origin !== location.origin) return;
  e.respondWith(
    fetch(req).then(r => {
      if (r.ok) { const cp = r.clone(); caches.open(V).then(c => c.put(req, cp)); }
      return r;
    }).catch(() => caches.match(req, { ignoreSearch: true }).then(r => r || caches.match('./')))
  );
});

async function lembrar() {
  try {
    const c = await caches.open('gx-dados');
    const r = await c.match(new URL('__lembrete', self.registration.scope).href);
    if (!r) return;
    const d = await r.json();
    const now = new Date(); const mes = now.getFullYear() + '-' + String(now.getMonth() + 1).padStart(2, '0');
    let body = '';
    if (d.mes < mes) body = 'Mês novo! Abra o app para preencher as contas fixas.';
    else if (d.n > 0) body = `${d.n} pendente(s): ${d.itens.join(', ')}`;
    if (body) await self.registration.showNotification('Contas fixas pendentes', { body, icon: 'icons/icon-192.png', badge: 'icons/icon-192.png', tag: 'pendentes' });
  } catch (e) {}
}
self.addEventListener('periodicsync', e => { if (e.tag === 'lembrete') e.waitUntil(lembrar()); });
self.addEventListener('notificationclick', e => {
  e.notification.close();
  e.waitUntil(self.clients.matchAll({ type: 'window', includeUncontrolled: true }).then(cs => {
    for (const c of cs) if ('focus' in c) return c.focus();
    return self.clients.openWindow('./');
  }));
});
