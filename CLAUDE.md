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
| `sw.js` | Service worker : mode hors connexion (V2.3.0) |
| `jspdf.umd.min.js` | jsPDF 2.5.1 (MIT), servie depuis le dépôt et non plus d'un CDN |
| `README.md` | Présentation de l'outil pour un visiteur du dépôt |
| `RELECTURE-V2.1.md` | Points de doctrine et d'histoire relevés par la relecture de septembre 2026, à trancher par Félix |
| `SUIVI.md` | Journal de développement et TODO priorisé |
| `PROMPT-SUITE.md` | Prompt prêt à coller pour reprendre le travail |

Tout est dans `index.html` : Tailwind compilé en ligne, JS en ligne, images et polices en
base64. Pas de dépendance à installer, pas d'étape de build. On ouvre le fichier, ça marche.

Le dépôt ne contient plus que ces sept fichiers, pour 2,8 Mo. `index-4.html` (V1.4) et
`IMG20260814110022.jpg` en pesaient 9 à eux deux sans servir à rien ; ils ont été supprimés
le 10 septembre 2026 et restent récupérables dans l'historique git.

## Architecture d'index.html

**En-tête** — un long commentaire de changelog, une section par thème (BUGS CORRIGÉS,
SÉCURITÉ, PÉDAGOGIE, CONFORT, ACCESSIBILITÉ, DONNÉES, BONUS). Version courante : **V2.2**,
répétée dans le `<title>`. Ce changelog est la mémoire du projet côté code : **le tenir à jour
à chaque changement**, dans le même style — le bug, sa cause technique, sa conséquence pour
l'utilisateur.

**Écrans** — chaque écran est un `<div id="...-screen" class="hidden">`. On navigue avec
`switchScreen(hideIds, showId)`, qui masque, affiche, remonte en haut de page et pose le focus
sur le premier `h1`/`h2`/`h3` de l'écran affiché. **Un écran sans titre de niveau h1-h3 casse
ce focus** : toujours en mettre un.

**Bouton Précédent d'Android (V2.2.3)** — l'application empile une entrée d'historique par
niveau ouvert et la dépile elle-même, sinon Précédent quitte l'onglet. `profondeurUI()` mesure
la profondeur réelle (écran de second niveau + modale), `syncHistorique()` aligne l'historique
dessus, et l'écouteur `popstate` ferme un niveau. Deux conséquences pour qui ajoute un écran :
il lui faut **une sortie repérable** — une `.modal-close-btn` ou un bouton `data-retour` —
sinon Précédent quittera la page depuis cet écran ; et **toute fermeture doit passer par cette
sortie**, car c'est elle que le mécanisme actionne. `syncHistorique()` est appelée depuis
`switchScreen()` et depuis l'observateur des modales : rien à câbler de plus.

**Bouton de retour flottant (V2.2.2)** — `#retour-flottant` apparaît en bas à gauche dès que la
croix de fermeture de l'écran affiché a quitté le haut de l'écran, et lui délègue le clic. Il ne
connaît aucun écran en particulier : il cherche la première `.modal-close-btn` d'un
`[id$="-screen"]` non masqué. **Un nouvel écran de lecture en hérite gratuitement, à la seule
condition de porter une `.modal-close-btn`** — inutile de câbler quoi que ce soit. Pour l'en
priver, ajouter son id à `RETOUR_ECRANS_EXCLUS` (l'écran de quiz y est, un clic malencontreux
y perdrait la série).

Le motif de couplage est constant : une paire `openXxx()` / `quitXxx()`, et un bouton dans la
grille de `#hiver-screen` (la Boîte à Outils).

**La Boîte à Outils est rangée en trois rayons** depuis la V2.3.1 — POUR ÉTUDIER, POUR SOURIRE,
POUR JOUER — et le registre y descend du grave au léger. Un bouton neuf se range dans le rayon
qui correspond à son intention, pas à côté de son cousin thématique : c'est cette ancienne
convention (« l'humoristique sous son pendant sérieux ») qui plaçait les jeux avant le rituel.
Les titres de rayon sont des `h3` **stylés en ligne** : la feuille Tailwind du fichier est
compilée, elle ne contient que les classes déjà employées ailleurs, et une classe neuve n'y
existerait pas. Ils viennent après le `h2` de l'écran, qui reste la cible du focus.
Dans le rayon POUR JOUER, **Mémoire des Symboles reste le dernier bouton** : c'est une décision
de Félix, pas un hasard d'ordre.

**Données** — des constantes JS en tête de `<script>`, une par domaine :
`allQuestions` (531 questions, 499 servies au 1er degré après dédoublonnage), `glossaryData`,
`humorLexiqueData`, `lectureData`,
`rituelsHumorData`, `OG_OFFICIERS`, `OG_JEWEL_IMAGES`, `MEM_ICON_IMAGES`.
`DEGRE_ACTIF = 1` filtre les questions servies ; `questionsDuDegre(n)` est prête pour ouvrir
un autre grade.

**Écran d'entrée** — `#door-screen` recouvre tout au chargement ; il faut frapper trois fois
au heurtoir pour entrer. À connaître pour les tests automatisés (voir plus bas).

**Progression** — stockée en `localStorage` : répétition espacée (J+1, J+3, J+7, J+15),
maîtrise acquise à deux succès consécutifs, banque d'erreurs, reprise de session.

**Lancement d'un quiz (V2.1)** — les boutons du parvis appellent `startQuiz(theme)`, qui n'ouvre
plus le quiz mais la modale `#nb-modal` (choix du nombre de questions, borné à `poolDuTheme(theme)`).
Le choix est mémorisé dans `SETTINGS.nbQuestions` (`'all'` = tout le thème) et c'est
`lancerQuiz(theme, nb)` qui lance réellement. Pour un test automatisé, appeler `lancerQuiz`
directement.

**Champ `source` des questions** — il contient des notes de travail (« valide par F3n »,
« code 7006 », « reclassee »). Il n'est jamais affiché : le lien « En savoir plus » montre le
nom du site déduit de l'URL par `nomDuSite()`. Ne pas le brancher tel quel dans l'interface.

## Conventions

**Typographie française.** Guillemets `« »` et **espace fine insécable U+202F** avant
`? ! ; :` et à l'intérieur des guillemets. Pas d'espace normale : elle laisse la ponctuation
tomber orpheline en début de ligne sur mobile.

**L'apostrophe suit le bloc, pas une règle globale.** Les blocs de données JS — `allQuestions`,
`glossaryData`, `humorLexiqueData`, `TABLEAU_SYMBOLS`, `OG_OFFICIERS` — n'emploient que
l'apostrophe **droite** `'`, sans exception : 3 029 dans le seul corpus de questions, zéro
courbe. La prose HTML (rituel, interface) emploie la **courbe** `’`. Écrire du texte neuf dans
la mauvaise convention passe les tests sans rien casser et salit le fichier en silence :
vérifier le voisinage avant d'écrire, et recompter après.

**Commentaires en français**, et ils expliquent *pourquoi*, pas *quoi*. Les commentaires
existants documentent des pièges réels — les lire avant de modifier le code qu'ils entourent.

**Modifier le fichier avec un script Python ancré sur des chaînes exactes.** Certaines lignes
font plusieurs centaines de milliers de caractères (les blocs de données, la CSS Tailwind
compilée) : `sed` et les outils d'édition ligne à ligne s'y étranglent. Vérifier que l'ancre
est unique (`s.count(ancre) == 1`) avant de remplacer.

## Pièges connus

**jsPDF est servie depuis le dépôt** en chemin relatif depuis la V2.3.0. Ne pas la remettre
sur un CDN — cela recasserait les exports PDF hors connexion, et le service worker mettrait
cette version en cache.

Il reste **une dépendance externe**, contrairement à ce qu'affirmait le changelog de la
V2.3.0 : un `<link>` vers `fonts.googleapis.com` en tête de page (Inter, Cinzel, EB Garamond).
Elle se dégrade proprement — les polices de repli prennent le relais, rien ne casse — mais
l'application n'est pas autonome au sens strict, et la politique réseau de l'environnement de
développement bloque ce domaine : **une console qui signale `ERR_CONNECTION_RESET` sur
fonts.googleapis.com n'est pas une régression**, c'est l'état normal ici.

**Les polices standard de jsPDF sont en WinAnsi** : elles ne connaissent pas l'espace fine
insécable. Toute fonction d'export doit la repasser en espace normale
(`String(t).replace(/\u202F/g, ' ')`), sinon le PDF affiche un caractère parasite.

**`downloadRituelPDF()` parcourt les enfants directs de `#rituel-lecture-content`.** Tout ce
qu'on ajoute dans ce bloc atterrit dans le PDF du rituel classique. Pour ajouter du contenu à
cet écran sans polluer l'export, le poser en frère du bloc, pas en fils.

**Tailwind preflight remet les titres à `font-size: inherit; font-weight: inherit`.** Les
`h2`/`h3`/`h4` n'ont donc aucune taille propre : il faut les styler explicitement, sinon la
hiérarchie est invisible.

**Le service worker sert la page en RÉSEAU D'ABORD** (`sw.js`, V2.3.0), le cache ne servant
que de filet. C'est délibéré : le dépôt est déployé plusieurs fois par jour, et une stratégie
cache-first figerait l'application sur une vieille version. **Ne pas inverser ces priorités**
sans mesurer ce que ça coûte en fraîcheur. Les ressources figées (jsPDF) passent, elles, par le
cache d'abord.

**Le nom du cache porte la version** (`quiz-maconnique-v2.3.0`) et l'ancien est supprimé à
l'activation. Si un jour on ajoute une ressource à `ESSENTIELS`, **bumper ce nom**, sinon les
navigateurs qui ont déjà le cache ne la précacheront jamais.

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
- **Les exports PDF se testent directement** depuis la V2.3.0 : jsPDF est dans le dépôt, plus
  rien à injecter.
- **Le service worker exige un vrai serveur HTTP.** Il ne s'enregistre pas en `file://`, et
  `pushState` y est refusé aussi — donc le mode hors connexion ET le bouton Précédent se
  testent avec `python3 -m http.server` puis `ctx.setOffline(true)`, jamais en local.
- **On ne peut pas vérifier le déploiement en visitant le site** : `github.io` est bloqué par
  la politique réseau de l'environnement. Seul le workflow Pages fait foi.

Avant de pousser, vérifier au minimum : la syntaxe JS (extraire le dernier bloc `<script>` et
`node --check`), l'absence d'erreur console, et le rendu à 390 px et 1100 px de large.

## Git

Développement sur une branche `claude/...` dédiée, jamais directement sur `main`.
Une pull request par lot de travail ; Félix relit et fusionne. Si la PR précédente est déjà
fusionnée, repartir de `origin/main` en gardant le même nom de branche.

Messages de commit en français, à l'impératif, avec le *pourquoi* dans le corps.
