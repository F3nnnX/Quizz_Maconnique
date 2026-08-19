/* Verification avant de pousser : integrite du graphe, chemin gagnant, morts
   temoins, rendu a 390 et 1100 px, erreurs console. Lancer depuis la racine
   du projet : node outils/verifier.mjs */
import { chromium } from '/opt/node22/lib/node_modules/playwright/index.mjs';
import { pathToFileURL } from 'node:url';
import { resolve } from 'node:path';

const URL = pathToFileURL(resolve('index.html')).href;
const b = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome' });
const page = await b.newPage({ viewport: { width: 390, height: 900 } });

const erreurs = [];
page.on('console', m => { if (m.type() === 'error') erreurs.push(m.text()); });
page.on('pageerror', e => erreurs.push('pageerror: ' + e.message));

await page.goto(URL);

// ——— 1. Intégrité du graphe ———————————————————————————————————————
const audit = await page.evaluate(() => {
  const ids = Object.keys(HISTOIRE);
  const casses = [], sansChoix = [], cibles = new Set(['preparation']);
  const sacs = ['leger', 'mesure', 'lourd'];
  for (const id of ids) {
    const n = HISTOIRE[id];
    if (n.fin) continue;
    if (!n.choix || !n.choix.length) { sansChoix.push(id); continue; }
    for (const c of n.choix) {
      const dests = typeof c.vers === 'function'
        ? sacs.map(s => c.vers({ sac: s, marques: [] }))
        : [c.vers];
      for (const d of dests) {
        if (!HISTOIRE[d]) casses.push(id + ' -> ' + d);
        cibles.add(d);
      }
    }
    // au moins un choix visible quel que soit le sac
    for (const s of sacs) {
      const vis = n.choix.filter(c => typeof c.si !== 'function' || c.si({ sac: s, marques: [] }));
      if (!vis.length) sansChoix.push(id + ' (sac ' + s + ')');
    }
  }
  return {
    noeuds: ids.length,
    fins: ids.filter(i => HISTOIRE[i].fin).length,
    morts: ids.filter(i => HISTOIRE[i].fin && HISTOIRE[i].fin.type === 'mort').length,
    victoires: ids.filter(i => HISTOIRE[i].fin && HISTOIRE[i].fin.type === 'victoire').length,
    casses, sansChoix,
    orphelins: ids.filter(i => !cibles.has(i)),
    sansTitre: ids.filter(i => !HISTOIRE[i].titre || !HISTOIRE[i].texte)
  };
});
console.log('GRAPHE', JSON.stringify(audit, null, 1));

// ——— 2. Le chemin gagnant ————————————————————————————————————————
async function choisir(i) {
  const boutons = page.locator('#choix-liste .choix');
  await boutons.nth(i).click();
}
const CHEMIN = [1,1,0,2,0,2,0,1,0,0,2,0,1,1,0,2,2,2,2];
await page.click('#btn-descendre');
const trace = [];
for (const i of CHEMIN) {
  const t = await page.locator('#noeud-titre').textContent();
  const p = await page.locator('#jauge-valeur').textContent();
  trace.push(t + ' [' + p + ']');
  await choisir(i);
}
const genre = await page.locator('#fin-genre').textContent();
const titreFin = await page.locator('#fin-titre').textContent();
console.log('\nCHEMIN GAGNANT');
trace.forEach(t => console.log('  ' + t));
console.log('  => ' + genre + ' / ' + titreFin);

// ——— 3. Quelques morts ————————————————————————————————————————————
const MORTS = [
  ['sac chargé + chatière', [2,1,0,2,0,2,0,1,0,0]],
  ['sac léger + piles',     [0,1,0,2,0,2,0,1,0,0,2,0,1,1,1]],
  ['fumigène',              [1,1,0,2,0,2,0,1,0,0,0]],
  ['tête la première',      [1,1,0,2,0,2,0,1,0,1]],
  ['descendre vite',        [1,1,1]],
  ['approche silencieuse',  [1,1,0,2,0,2,1]],
];
for (const [nom, chemin] of MORTS) {
  await page.click('#btn-redescendre').catch(() => {});
  for (const i of chemin) await choisir(i);
  const g = await page.locator('#fin-genre').textContent();
  const t = await page.locator('#fin-titre').textContent();
  const e = await page.locator('#dalle-texte').textContent();
  console.log('\n' + nom + ' -> ' + g + ' : ' + t + '\n    « ' + e + ' »');
}

// ——— 4. Épitaphes et rendu ————————————————————————————————————————
await page.click('#btn-epitaphes-fin');
const cartes = await page.locator('.epitaphe-carte').count();
const connues = await page.locator('.epitaphe-carte:not(.inconnue)').count();
console.log('\nÉPITAPHES : ' + connues + ' gravées sur ' + cartes);

await page.click('#btn-retour-epitaphes');
await page.click('#btn-titre-fin');
await page.click('#btn-aide-titre');
await page.screenshot({ path: '/tmp/kata-aide-390.png', fullPage: true });

// débordement horizontal ?
for (const [w, h] of [[390, 900], [1100, 900]]) {
  await page.setViewportSize({ width: w, height: h });
  await page.click('#btn-retour-aide').catch(() => {});
  await page.click('#btn-descendre');
  await choisir(1); await choisir(1); await choisir(0);
  const deborde = await page.evaluate(() => document.documentElement.scrollWidth > window.innerWidth + 1);
  await page.screenshot({ path: `/tmp/kata-jeu-${w}.png`, fullPage: true });
  console.log(`rendu ${w}px : débordement horizontal = ${deborde}`);
  page.once('dialog', d => d.accept());
  await page.click('#btn-abandonner').catch(() => {});
  await page.waitForTimeout(200);
}

console.log('\nERREURS CONSOLE : ' + (erreurs.length ? erreurs.join(' | ') : 'aucune'));
await b.close();
