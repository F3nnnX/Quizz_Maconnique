# Le Quiz Maçonnique — mémoire du projet

Fiche de reprise pour toute session de développement. À lire avant de toucher au code.

## Ce que c'est

Application web d'instruction maçonnique au 1er degré (REAA), pour la R.·.L.·. Philadelphia
n°1604, Orient de Marseille — GLDF. Auteur : Félix Casellato.

En ligne sur **https://f3nnnx.github.io/Quizz_Maconnique/**, servie par GitHub Pages depuis
`main`. Chaque push sur `main` déclenche le workflow « pages build and deployment » ; le site
est à jour dès qu'il passe au vert. Il n'y a aucune autre CI, aucun test automatisé, aucun
build : le dépôt contient le produit fini.

## Structure du dépôt

| Fichier | Rôle |
|---|---|
| `index.html` | **Toute l'application**, 2,3 Mo, un seul fichier | 
| `index-4.html` | V1.4, ancienne version figée, plus maintenue (1,1 Mo) |
| `IMG20260814110022.jpg` | 7,9 Mo, référencée par aucun des deux HTML |
| `SUIVI.md` | Journal de développement et TODO priorisé |
| `PROMPT-SUITE.md` | Prompt prêt à coller pour reprendre le travail |

Tout est dans `index.html` : Tailwind compilé en ligne, JS en ligne, images et polices en
base64. Pas de dépendance à installer, pas d'étape de build. On ouvre le fichier, ça marche.

## Architecture d'index.html

**En-tête** — un long commentaire de changelog, une section par thème (BUGS CORRIGÉS,
SÉCURITÉ, PÉDAGOGIE, CONFORT, ACCESSIBILITÉ, DONNÉES, BONUS). Version courante : **V1.9**,
répétée dans le `<title>`. Ce changelog est la mémoire du projet côté code : **le tenir à jour
à chaque changement**, dans le même style — le bug, sa cause technique, sa conséquence pour
l'utilisateur.

**Écrans** — chaque écran est un `<div id="...-screen" class="hidden">`. On navigue avec
`switchScreen(hideIds, showId)`, qui masque, affiche, remonte en haut de page et pose le focus
sur le premier `h1`/`h2`/`h3` de l'écran affiché. **Un écran sans titre de niveau h1-h3 casse
ce focus** : toujours en mettre un.

Le motif de couplage est constant : une paire `openXxx()` / `quitXxx()`, et un bouton dans la
grille de `#hiver-screen` (la Boîte à Outils). Les variantes humoristiques sont rangées juste
sous leur pendant sérieux : Lexique Humoristique sous Lexique Maçonnique, Rituels Humoristiques
sous Rituel 1er Degré.

**Données** — des constantes JS en tête de `<script>`, une par domaine :
`allQuestions` (531 questions, 502 servies au 1er degré), `glossaryData`, `humorLexiqueData`,
`rituelsHumorData`, `OG_OFFICIERS`, `OG_JEWEL_IMAGES`, `MEM_ICON_IMAGES`.
`DEGRE_ACTIF = 1` filtre les questions servies ; `questionsDuDegre(n)` est prête pour ouvrir
un autre grade.

**Écran d'entrée** — `#door-screen` recouvre tout au chargement ; il faut frapper trois fois
au heurtoir pour entrer. À connaître pour les tests automatisés (voir plus bas).

**Progression** — stockée en `localStorage` : répétition espacée (J+1, J+3, J+7, J+15),
maîtrise acquise à deux succès consécutifs, banque d'erreurs, reprise de session.

## Conventions

**Typographie française.** Apostrophes courbes `’`, guillemets `« »`, et **espace fine
insécable U+202F** avant `? ! ; :` et à l'intérieur des guillemets. Pas d'espace normale : elle
laisse la ponctuation tomber orpheline en début de ligne sur mobile.

**Commentaires en français**, et ils expliquent *pourquoi*, pas *quoi*. Les commentaires
existants documentent des pièges réels — les lire avant de modifier le code qu'ils entourent.

**Modifier le fichier avec un script Python ancré sur des chaînes exactes.** Certaines lignes
font plusieurs centaines de milliers de caractères (les blocs de données, la CSS Tailwind
compilée) : `sed` et les outils d'édition ligne à ligne s'y étranglent. Vérifier que l'ancre
est unique (`s.count(ancre) == 1`) avant de remplacer.

## Pièges connus

**jsPDF vient d'un CDN** (`cdnjs.cloudflare.com`, chargé en `defer`). Sans réseau, tous les
exports PDF échouent — `ensureJsPDFAvailable()` affiche une alerte. C'est la seule dépendance
externe de l'application, et elle contredit son ambition hors ligne (voir SUIVI.md).

**Les polices standard de jsPDF sont en WinAnsi** : elles ne connaissent pas l'espace fine
insécable. Toute fonction d'export doit la repasser en espace normale
(`String(t).replace(/\u202F/g, ' ')`), sinon le PDF affiche un caractère parasite.

**`downloadRituelPDF()` parcourt les enfants directs de `#rituel-lecture-content`.** Tout ce
qu'on ajoute dans ce bloc atterrit dans le PDF du rituel classique. Pour ajouter du contenu à
cet écran sans polluer l'export, le poser en frère du bloc, pas en fils.

**Tailwind preflight remet les titres à `font-size: inherit; font-weight: inherit`.** Les
`h2`/`h3`/`h4` n'ont donc aucune taille propre : il faut les styler explicitement, sinon la
hiérarchie est invisible.

**Le service worker a été retiré en V1.9** (il était enregistré depuis une URL `blob:`, que la
spécification interdit — l'enregistrement échouait toujours). Le manifeste PWA est resté :
l'application se déclare installable mais ne fonctionne pas hors connexion.

## Tester une modification

Chromium et Playwright sont disponibles dans l'environnement.

```js
const { chromium } = require('playwright');
const b = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome' });
const page = await b.newPage({ viewport: { width: 390, height: 900 } });
await page.goto('file:///home/user/Quizz_Maconnique/index.html');
// Franchir la porte du Temple sans jouer l'animation :
await page.evaluate(() => { document.getElementById('door-screen')?.remove(); openHiver(); });
```

Deux points à connaître :

- **`page.click()` échoue tant que `#door-screen` est là** : il recouvre toute la fenêtre.
  Le retirer, ou appeler `frapperPorte()` trois fois en laissant passer l'animation.
- **Pour tester un export PDF**, injecter jsPDF localement : `npm install jspdf@2.5.1` puis
  `await page.addScriptTag({ path: 'node_modules/jspdf/dist/jspdf.umd.min.js' })`. Le CDN est
  bloqué par la politique réseau de l'environnement, et le site en ligne l'est aussi — on ne
  peut pas vérifier le déploiement en le visitant, seulement via le workflow Pages.

Avant de pousser, vérifier au minimum : la syntaxe JS (extraire le dernier bloc `<script>` et
`node --check`), l'absence d'erreur console, et le rendu à 390 px et 1100 px de large.

## Git

Développement sur la branche `claude/mise-a-jour-en1lj2`, jamais directement sur `main`.
Une pull request par lot de travail ; Félix relit et fusionne. Si la PR précédente est déjà
fusionnée, repartir de `origin/main` en gardant le même nom de branche.

Messages de commit en français, à l'impératif, avec le *pourquoi* dans le corps.
