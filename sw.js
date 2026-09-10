/*
 * Service worker du Quiz Maçonnique.
 *
 * Celui de la V1.9 etait enregistre depuis une URL blob:, ce que la specification
 * interdit : l'enregistrement echouait toujours et un .catch() vide masquait l'erreur.
 * Le mode hors connexion n'a donc jamais fonctionne, alors que le manifeste PWA
 * proposait l'installation. Ce fichier-ci est servi normalement, depuis la meme
 * origine que la page.
 *
 * Deux strategies, et le choix compte :
 *
 *   - La PAGE passe par le reseau d'abord, le cache ne servant que de filet. Le depot
 *     est deploye plusieurs fois par jour ; un cache prioritaire figerait l'application
 *     sur une vieille version et il faudrait vider le cache du navigateur a chaque fois.
 *   - Les RESSOURCES FIGEES (jsPDF) passent par le cache d'abord. Elles ne changent
 *     qu'avec leur nom de version, donc rien a rafraichir.
 */

const CACHE = 'quiz-maconnique-v2.3.0';
const ESSENTIELS = ['./', './index.html', './jspdf.umd.min.js'];

self.addEventListener('install', (e) => {
    // skipWaiting : sans lui, un nouveau service worker attend la fermeture de tous les
    // onglets pour prendre la main. Sur une application ouverte en permanence sur un
    // telephone, la mise a jour n'arriverait jamais.
    e.waitUntil(caches.open(CACHE).then(c => c.addAll(ESSENTIELS)).then(() => self.skipWaiting()));
});

self.addEventListener('activate', (e) => {
    e.waitUntil(
        caches.keys()
            .then(noms => Promise.all(noms.filter(n => n !== CACHE).map(n => caches.delete(n))))
            .then(() => self.clients.claim())
    );
});

self.addEventListener('fetch', (e) => {
    const req = e.request;
    // On ne se mele ni des autres origines ni des requetes non-GET : le webhook
    // d'analytique doit partir sur le reseau ou echouer, jamais etre servi depuis un cache.
    if (req.method !== 'GET') return;
    if (new URL(req.url).origin !== self.location.origin) return;

    const estLaPage = req.mode === 'navigate' || new URL(req.url).pathname.endsWith('/index.html');

    if (estLaPage) {
        e.respondWith(
            fetch(req)
                .then(rep => {
                    const copie = rep.clone();
                    caches.open(CACHE).then(c => c.put(req, copie));
                    return rep;
                })
                .catch(() => caches.match(req).then(r => r || caches.match('./index.html')))
        );
        return;
    }

    e.respondWith(
        caches.match(req).then(r => r || fetch(req).then(rep => {
            if (rep && rep.status === 200 && rep.type === 'basic') {
                const copie = rep.clone();
                caches.open(CACHE).then(c => c.put(req, copie));
            }
            return rep;
        }))
    );
});
