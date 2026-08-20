# Kata — La Descente : mémoire du projet

Fiche de reprise. À lire avant de toucher au code.

## Ce que c’est

Fiction interactive à choix multiples dans les carrières souterraines de Paris. Auteur :
Félix Casellato. Un seul fichier, `index.html`, environ 85 Ko : CSS écrite à la main,
moteur JavaScript sans dépendance, décors SVG procéduraux, ambiance sonore synthétisée,
texte narratif en données. Aucun build, aucun test
automatisé, aucune CI. On ouvre le fichier, ça marche.

Destiné à vivre dans son propre dépôt GitHub, servi par Pages depuis `main`. Il est né
dans un dossier du dépôt `Quizz_Maconnique` faute de droit de création de dépôt.

## Architecture d’index.html

**En-tête** — un commentaire de changelog. Version courante : **V0.2**. Le tenir à jour à
chaque changement, dans le même style que le Quiz Maçonnique : le fait, sa cause technique,
sa conséquence pour le joueur.

**Écrans** — cinq `<div id="...-screen">`, navigation par `switchScreen(showId)` qui masque,
affiche, remonte en haut et pose le focus sur le premier `h1`/`h2`/`h3`. **Un écran sans
titre de niveau h1-h3 casse ce focus** : toujours en mettre un.

**Données** — deux constantes, `UI` (les textes d’interface) et `HISTOIRE` (le graphe de
48 nœuds), toutes deux **entre les balises `DÉBUT TEXTE` et `FIN TEXTE`**. Rien d’autre ne
doit vivre dans cette zone : c’est la seule que traite le script de normalisation
typographique, et il ne traite que les chaînes littérales qui s’y trouvent.

**Décors** — sous `FIN TEXTE`, avant le moteur. `DECORS` contient dix-sept fonctions qui
rendent une chaîne SVG à partir d’un générateur pseudo-aléatoire ensemencé par
l’identifiant du nœud — d’où un dessin stable d’une partie à l’autre. `dessiner(nom, clé)`
pose le cadre commun : fond, décor, halo de frontale **par-dessus**, vignette. Le halo
au-dessus du décor est ce qui donne l’impression de regarder à travers un faisceau ; en
dessous, la scène a l’air éclairée par le jour. Un aplat noir sur fond noir ne se voit
pas : toute silhouette a besoin d’un liseré.

**Le son** — module `Son`, entièrement synthétisé, aucun fichier. Le contexte audio ne
peut naître que d’un geste de l’utilisateur : il est créé au clic sur « Descendre », et
tout appel antérieur est un no-op silencieux. Chaque décor a une entrée dans `AMBIANCES`
(fréquence de coupure du grondement, intervalle moyen entre deux gouttes) ; un décor
absent de la table retombe sur la galerie sèche.

**Moteur** — sous le son. `jouerChoix()` applique le coût, puis le rechargement, puis
teste la pile : **une pile à zéro l’emporte sur la destination prévue** et route vers
`mort_obscurite`. C’est ce qui rend les détours coûteux mortels, et c’est volontaire.

## Le graphe

Un nœud : `image` (le décor), `lieu`, `titre`, `texte` (tableau de paragraphes), `choix`.
Un choix : `t` (le texte), `vers` (identifiant ou fonction de l’état), `cout` (dépense de
frontale), et facultativement `recharge`, `pose` (jalon), `si` (condition d’affichage),
`sac` (fixe le sac à la première scène).
Un nœud de fin porte `fin: { type, cause, epitaphe }` — `type` vaut `mort`, `echec` ou
`victoire`. La cause sert de clé de collection : **ne jamais la renommer** sans savoir
qu’on efface la dalle correspondante chez tous les joueurs.

**Équilibre de la pile.** Le chemin gagnant dépense 61 % avant le changement de piles, qui
remet à 100 %, puis 33 % jusqu’à la sortie. Les 39 % de marge avant le rechargement sont le
budget des détours : un gros détour passe, deux passent à peine, trois tuent. Toute
modification de coût sur le chemin gagnant doit être revérifiée par le test ci-dessous —
c’est exactement le bug de la première version, où le chemin gagnant dépassait 100 %.

## Conventions

**Typographie française.** Apostrophes courbes `’`, guillemets `« »`, **espace fine
insécable U+202F** avant `? ! ; :` et à l’intérieur des guillemets.

Ne pas les saisir à la main : écrire le texte avec des apostrophes droites et des espaces
normales, puis passer le script de normalisation. Il borne sur la **dernière** occurrence
des marqueurs (ils sont cités dans le commentaire d’en-tête), et ne modifie que l’intérieur
des chaînes entre guillemets doubles — le code JS, ses ternaires `? :` et ses clés `titre:`
ne sont jamais touchés. Le script est `outils/typographie.py` ; il est idempotent, on peut
le repasser autant de fois qu’on veut.

**Longueur des scènes.** Deux paragraphes, environ 220 caractères en tout. L’image porte
le décor ; le texte ne garde que l’enjeu et le détail qui fait peur. Au-delà, sur un écran
de 390 px, il faut dérouler avant de voir le premier choix — et l’attention tombe avant la
décision. C’est la mesure que rapporte le vérificateur sous `narrationMoyenne`.

**Commentaires en français**, et ils expliquent *pourquoi*, pas *quoi*.

## Tester une modification

Chromium et Playwright sont disponibles dans l’environnement.

```js
const { chromium } = require('/opt/node22/lib/node_modules/playwright');
const b = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome' });
const page = await b.newPage({ viewport: { width: 390, height: 900 } });
await page.goto('file:///…/kata-la-descente/index.html');
await page.click('#btn-descendre');
```

Trois vérifications à faire avant de pousser :

1. **Intégrité du graphe** — en page, parcourir `HISTOIRE` et vérifier que chaque `vers`
   résout vers un nœud existant (y compris les `vers` fonctions, testées avec les trois
   sacs), qu’aucun nœud sans `fin` n’est sans choix visible quel que soit le sac, et
   qu’aucun nœud n’est orphelin.
2. **Le chemin gagnant** — la suite d’indices `1,1,0,2,0,2,0,1,0,0,2,0,1,1,0,2,2,2,2`
   depuis l’écran-titre doit aboutir à « Retour au jour », avec 67 % de pile restante.
3. **Décors** — chaque nœud porte une `image` qui existe dans `DECORS`, et l’écran de
   fin en affiche une lui aussi.
4. **Vibration et son** — la mort vibre plus que la sortie, qui vibre plus que le choix ;
   un contexte audio est créé et les rampes de fréquence suivent bien les décors traversés.
5. **Rendu et console** — zéro erreur console, aucun débordement horizontal à 390 px ni
   à 1100 px, et les choix visibles sans défiler sur un écran de 390 × 900.

Tout cela est automatisé : `node outils/verifier.mjs` depuis la racine du projet. Pour
revoir les dix-sept décors d’un coup, les rendre côte à côte dans une page jetable —
c’est ainsi qu’on a vu que la galerie faisait une tente et que les silhouettes étaient
invisibles.

## Git

Développement sur une branche, jamais directement sur `main`. Messages de commit en
français, à l’impératif, avec le *pourquoi* dans le corps.
