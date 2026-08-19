/* Verification avant de pousser : integrite du graphe, decors, chemin gagnant,
   morts temoins, vibration, son, rendu a 390 et 1100 px, erreurs console.
   Lancer depuis la racine du projet : node outils/verifier.mjs */
import { chromium } from '/opt/node22/lib/node_modules/playwright/index.mjs';
import { pathToFileURL } from 'node:url';
import { resolve } from 'node:path';

const URL = pathToFileURL(resolve('index.html')).href;
const b = await chromium.launch({
  executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome',
  args: ['--mute-audio', '--autoplay-policy=no-user-gesture-required']
});
const page = await b.newPage({ viewport: { width: 390, height: 900 } });

/* navigator.vibrate n'existe pas sur ordinateur : on le pose nous-memes pour
   compter les appels, exactement comme le ferait un telephone. */
await page.addInitScript(() => {
  window.__vibrations = [];
  /* On instrumente le graphe audio : un jeu muet passerait tous les autres
     controles sans qu'on s'en apercoive. */
  window.__audio = { contextes: 0, oscillateurs: 0, filtres: 0, rampes: [] };
  const AC = window.AudioContext;
  window.AudioContext = function () {
    window.__audio.contextes++;
    const c = new AC();
    const osc = c.createOscillator.bind(c), fil = c.createBiquadFilter.bind(c);
    c.createOscillator = () => { window.__audio.oscillateurs++; return osc(); };
    c.createBiquadFilter = () => {
      window.__audio.filtres++;
      const f = fil();
      const r = f.frequency.linearRampToValueAtTime.bind(f.frequency);
      f.frequency.linearRampToValueAtTime = (v, t) => { window.__audio.rampes.push(Math.round(v)); return r(v, t); };
      return f;
    };
    return c;
  };
  Object.defineProperty(navigator, 'vibrate', {
    value: (m) => { window.__vibrations.push(m); return true; }, configurable: true
  });
});

const erreurs = [];
page.on('console', m => { if (m.type() === 'error') erreurs.push(m.text()); });
page.on('pageerror', e => erreurs.push('pageerror: ' + e.message));

await page.goto(URL);

/* ——— 1. Integrite du graphe et des decors ———————————————————————— */
const audit = await page.evaluate(() => {
  const ids = Object.keys(HISTOIRE);
  const casses = [], sansChoix = [], sansImage = [], cibles = new Set(['preparation']);
  const sacs = ['leger', 'mesure', 'lourd'];
  for (const id of ids) {
    const n = HISTOIRE[id];
    if (!n.image || !DECORS[n.image]) sansImage.push(id + ' (' + n.image + ')');
    if (n.fin) continue;
    if (!n.choix || !n.choix.length) { sansChoix.push(id); continue; }
    for (const c of n.choix) {
      const dests = typeof c.vers === 'function'
        ? sacs.map(s => c.vers({ sac: s, marques: [] })) : [c.vers];
      for (const d of dests) { if (!HISTOIRE[d]) casses.push(id + ' -> ' + d); cibles.add(d); }
    }
    for (const s of sacs) {
      const vis = n.choix.filter(c => typeof c.si !== 'function' || c.si({ sac: s, marques: [] }));
      if (!vis.length) sansChoix.push(id + ' (sac ' + s + ')');
    }
  }
  const narration = ids.reduce((t, i) => t + HISTOIRE[i].texte.join(' ').length, 0);
  return {
    noeuds: ids.length, decors: Object.keys(DECORS).length,
    fins: ids.filter(i => HISTOIRE[i].fin).length,
    morts: ids.filter(i => HISTOIRE[i].fin && HISTOIRE[i].fin.type === 'mort').length,
    victoires: ids.filter(i => HISTOIRE[i].fin && HISTOIRE[i].fin.type === 'victoire').length,
    narrationMoyenne: Math.round(narration / ids.length),
    casses, sansChoix, sansImage,
    orphelins: ids.filter(i => !cibles.has(i)),
    sansTitre: ids.filter(i => !HISTOIRE[i].titre || !HISTOIRE[i].texte)
  };
});
console.log('GRAPHE', JSON.stringify(audit, null, 1));

/* ——— 2. Le chemin gagnant ————————————————————————————————————————— */
const choisir = (i) => page.locator('#choix-liste .choix').nth(i).click();
const CHEMIN = [1,1,0,2,0,2,0,1,0,0,2,0,1,1,0,2,2,2,2];

await page.click('#btn-descendre');
let scenesVides = 0;
for (const i of CHEMIN) {
  const svg = await page.locator('#noeud-scene svg').count();
  if (!svg) scenesVides++;
  await choisir(i);
}
const genre = await page.locator('#fin-genre').textContent();
const pile = (await page.locator('#fin-releve b').nth(1).textContent()).trim();
console.log('\nCHEMIN GAGNANT -> ' + genre + ' (' + await page.locator('#fin-titre').textContent() +
            '), frontale ' + pile + ', scenes sans image : ' + scenesVides);
console.log('image sur l ecran de fin : ' + (await page.locator('#fin-scene svg').count() ? 'oui' : 'NON'));

/* ——— 3. Vibration ————————————————————————————————————————————————— */
/* Le choix vibre brievement, la victoire un peu, la mort beaucoup — c'est ce
   rapport qu'on verifie, pas les valeurs absolues. */
const duree = (v) => Array.isArray(v) ? v.reduce((a, x) => a + x, 0) : v;
const vib = await page.evaluate(() => window.__vibrations);
await page.evaluate(() => { window.__vibrations = []; });
await page.click('#btn-redescendre');
for (const i of [1, 1, 1]) await choisir(i);          /* une mort : la chute */
const vibMort = await page.evaluate(() => window.__vibrations);
console.log('\nVIBRATIONS');
console.log('  choix   : ' + JSON.stringify(vib[0]) + ' (' + duree(vib[0]) + ' ms), ' +
            'tous identiques sur le parcours : ' + vib.slice(0, -1).every(v => v === vib[0]));
console.log('  sortie  : ' + JSON.stringify(vib[vib.length - 1]) + ' (' + duree(vib[vib.length - 1]) + ' ms)');
console.log('  mort    : ' + JSON.stringify(vibMort[vibMort.length - 1]) + ' (' + duree(vibMort[vibMort.length - 1]) + ' ms)');
console.log('  la mort vibre plus que la sortie, qui vibre plus que le choix : ' +
  (duree(vibMort[vibMort.length - 1]) > duree(vib[vib.length - 1]) &&
   duree(vib[vib.length - 1]) > duree(vib[0])));

/* ——— 4. Morts temoins ————————————————————————————————————————————— */
const MORTS = [
  ['sac charge + chatiere', [2,1,0,2,0,2,0,1,0,0]],
  ['sac leger + piles',     [0,1,0,2,0,2,0,1,0,0,2,0,1,1,1]],
  ['fumigene',              [1,1,0,2,0,2,0,1,0,0,0]],
  ['tete la premiere',      [1,1,0,2,0,2,0,1,0,1]],
  ['descendre vite',        [1,1,1]],
  ['approche silencieuse',  [1,1,0,2,0,2,1]],
  ['la fete',               [1,1,0,2,0,2,0,0,0]],
  ['noyade',                [1,1,0,2,0,2,0,1,0,0,2,0,0]],
];
for (const [nom, chemin] of MORTS) {
  await page.click('#btn-redescendre').catch(() => {});
  for (const i of chemin) await choisir(i);
  console.log('  ' + nom.padEnd(24) + ' -> ' + (await page.locator('#fin-titre').textContent()));
}

/* ——— 5. Epitaphes, son, rendu ————————————————————————————————————— */
await page.click('#btn-epitaphes-fin');
console.log('\nEPITAPHES : ' + await page.locator('.epitaphe-carte:not(.inconnue)').count() +
            ' gravees sur ' + await page.locator('.epitaphe-carte').count());
await page.click('#btn-retour-epitaphes');
await page.click('#btn-titre-fin');

for (const [w, h] of [[390, 900], [1100, 900]]) {
  await page.setViewportSize({ width: w, height: h });
  await page.click('#btn-descendre');
  await choisir(1); await choisir(1); await choisir(0);
  const etat = await page.evaluate(() => ({
    deborde: document.documentElement.scrollWidth > window.innerWidth + 1,
    hauteur: document.documentElement.scrollHeight,
    son: document.getElementById('btn-son').getAttribute('aria-pressed')
  }));
  await page.screenshot({ path: `/tmp/kata-jeu-${w}.png`, fullPage: true });
  console.log(`rendu ${w}px : debordement=${etat.deborde}, page=${etat.hauteur}px, bouton son=${etat.son}`);
  page.once('dialog', d => d.accept());
  await page.click('#btn-abandonner').catch(() => {});
  await page.waitForTimeout(200);
}

await page.click('#btn-aide-titre');
await page.screenshot({ path: '/tmp/kata-aide.png', fullPage: true });

const audio = await page.evaluate(() => window.__audio);
console.log('\nSON : ' + audio.contextes + ' contexte, ' + audio.oscillateurs + ' oscillateurs, ' +
            audio.filtres + ' filtres, ambiances jouees (Hz) = ' + JSON.stringify(audio.rampes.slice(0, 8)));

console.log('\nERREURS CONSOLE : ' + (erreurs.length ? erreurs.join(' | ') : 'aucune'));
await b.close();
