# Suivi de développement

Journal des travaux et liste de ce qui reste à faire. Tenu à jour à chaque session.

---

## Journal

### 11 septembre 2026 — Le site est sur le VPS, et le VPS n'était pas ce qu'on croyait

La migration est faite, à une étape près : le DNS. Le site tourne sur le VPS, servi par
Traefik, vérifié octet pour octet identique au dépôt.

**Ce qui n'était écrit nulle part et qui a tout réorienté : le VPS n'est pas une machine
vierge.** Il fait tourner **Coolify** avec **Traefik v3.6** en proxy, et il héberge déjà deux
sites en production qui ne sont pas ceux de Félix — `fransktradgard.se` (statique) et
`sohamnathayoga.fr` (WordPress + MariaDB). Les ports 80 et 443 étaient déjà pris, par des
`docker-proxy`, alors qu'aucun serveur web n'était installé sur l'hôte.

Le plan de départ — installer Caddy — aurait donc échoué, et pire : au redémarrage suivant,
Caddy aurait pu prendre les ports et **éteindre les deux sites du frère de Félix**. La bonne
méthode sur cette machine est l'inverse d'une installation : **un conteneur de plus, avec des
labels Traefik**, que le proxy découvre seul.

Le montage est dans `deploiement/`, copie exacte de `/data/sites/lecherchant/` sur le serveur :
un conteneur `nginx:1.27-alpine` qui monte en lecture seule un clone git du dépôt. Il n'y a
rien à construire — l'application est un fichier statique, le clone *est* le site, et
`deploie.sh` se réduit à un `git pull`. Le conteneur n'est pas géré par Coolify : poser un site
statique ne valait pas de demander un accès au tableau de bord d'un tiers.

**Une découverte a servi de guide.** Le proxy porte déjà un `securite.yaml` écrit à la main, en
français, longuement commenté : en-têtes de sécurité communs posés à l'entrypoint https, et
l'explication de pourquoi la CSP en a été retirée — un middleware d'entrypoint écrase celui de
la route, on ne peut donc pas l'affiner par site, et une CSP stricte casse l'administration
d'un WordPress en silence. Ces en-têtes s'appliquent déjà à `lecherchant.fr` : HSTS deux ans,
`nosniff`, `SAMEORIGIN`. **Rien à ajouter, et surtout rien à redoubler.**

Restait ce qu'aucun middleware d'entrypoint ne sait faire, parce qu'il ne distingue pas les
chemins : **la politique de cache**. `index.html` et `sw.js` en `no-cache`, jsPDF en
`immutable` un an. Le premier n'est pas un détail — le service worker sert la page en réseau
d'abord, et sans `no-cache` le cache HTTP du navigateur réintroduirait en amont exactement le
figement que le service worker évite, en répondant avant lui.

Deux points qu'il aurait coûté cher de rater :

- **La racine web est un clone git**, donc `/.git/` était téléchargeable et livrait tout
  l'historique. `nginx.conf` le refuse, avec `travaux/`, `outils/` et la documentation.
  Le dépôt est public aujourd'hui, il ne le sera pas toujours.
- **`${1}` dans un fichier compose est substitué par docker compose** avant que Traefik ne voie
  le label. Écrit tel quel dans la redirection `www` → apex, le groupe capturé disparaissait et
  toute page profonde serait retombée sur la racine, sans erreur. Il faut `$${1}`.

Mesures : la page est servie en 0,2 s, **2 395 995 → 1 339 007 octets** compressée (44 %), et
son empreinte est identique à celle du dépôt. Les deux sites voisins ont été recontrôlés après
coup — 200, certificats valides, aucun conteneur redémarré.

**Un piège trouvé en chemin, et qui ne concerne pas la migration.** `CLAUDE.md` demande de
régénérer `EMPREINTE.txt` après toute modification du dépôt. Fait depuis Windows, cela produit
une pièce fausse : `core.autocrlf=true` met des CRLF sur tous les fichiers texte du disque, et
`empreinte.py` hache les fichiers du disque. Tous les SHA-256 divergent, `index.html` y pèse
2 400 511 octets au lieu de 2 395 995 — les 4 516 retours chariot ajoutés — et la sortie part
en cp1252 au lieu d'UTF-8. Pour une pièce destinée à l'INPI, la chaîne probatoire serait
cassée, sans le moindre signe. L'empreinte de ce lot a donc été générée sur le VPS, dans un
clone jetable, et vérifiée : les fichiers inchangés y portent exactement les empreintes de la
version précédente. C'est consigné dans `PASSATION.md` § 3.

**Il manque le DNS.** `lecherchant.fr` pointe encore sur `213.186.33.5`, le parking OVH. Tant
qu'il n'est pas changé, Let's Encrypt ne peut pas émettre le certificat. C'est la seule étape
de la migration que Claude ne peut pas faire : elle est dans l'espace client OVH.

### 11 septembre 2026 — Passation : le travail se poursuit à deux endroits

Félix ouvre une session Claude Code dans Visual Studio Code, sur sa machine, pour conduire la
migration : sortir de GitHub Pages, poser le site sur le VPS de son frère, brancher un nom de
domaine. La session distante garde le nom commercial, le domaine, la protection de l'œuvre et
le contenu de l'application.

Deux sessions qui ne se voient pas, c'est deux mémoires qui divergent. D'où **`PASSATION.md`**,
à lire avant `CLAUDE.md` : la répartition, la discipline git qui tient lieu de lien entre les
deux, l'état du projet, et ce que la session VS Code doit savoir avant de migrer — le service
worker exige HTTPS, le cache est lié au domaine, les frères qui ont installé l'application
depuis `github.io` garderont l'ancienne.

Une chose à ne pas rater au passage : le dossier de travail de Félix doit être **un clone du
dépôt**, pas une copie de fichiers. Sans l'historique git, la session perd la mémoire du projet
et Félix perd sa meilleure preuve de paternité.

La refonte du Tableau de Loge en SVG est rangée dans `travaux/tableau-svg/` — Félix ne la juge
pas satisfaisante, et elle n'est pas urgente. Le travail fastidieux sur les 22 points chauds est
acquis et documenté, il n'aura pas à être refait. Les seize symboles et les onze bijoux sont
repoussés explicitement : « la priorité c'est migration ».

### 11 septembre 2026 — V2.3.2 : la cérémonie du heurtoir ne se joue plus qu'une fois

Félix : « le fait de devoir cliquer 3x c'est rigolo mais usant à la longue ». Le code lui
donnait raison — `DELAI_MIN_COUP` impose 700 ms entre deux coups et `ouvrirLeTemple` est
appelé 3 secondes après le troisième, soit **cinq secondes au bas mot à chaque lancement**,
sur une application qu'on ouvre pour réviser deux minutes.

`SETTINGS.dejaFrappe` retient le franchissement. Les lancements suivants passent par
`entrerSansCeremonie()`. Un bouton des Réglages remet le drapeau à `false` : **un rejeu unique,
pas un réglage permanent** — le besoin réel est de remontrer la porte à un frère, pas de la
subir tous les jours.

Le piège était le dédoublement du chemin d'entrée : `ouvrirLeTemple()` préparait l'accueil en
quatre appels (`logVisit`, `renderThemeStats`, `displayMasonicDateToday`, `refreshResumeBanner`),
et une entrée directe qui les oublierait afficherait un parvis sans statistiques ni date
maçonnique. D'où `preparerAccueil()`, appelée par les deux — et vérifiée sous Chromium : les
deux chemins produisent un accueil **identique**, date maçonnique et compteurs compris.

Les quatre états ont été joués : première visite (cérémonie), trois coups (`dejaFrappe` passe à
`true`), rechargement (entrée directe, la porte n'est même plus dans le DOM), et rejeu (la
cérémonie revient). Aucune erreur JavaScript.

### 11 septembre 2026 — Les images, et un service tiers découvert au passage

Les 33 images de l'application sont inventoriées dans `IMAGES.md`, et Félix a répondu pour
toutes : **29 sur 33 viennent d'internet**, de qualité médiocre. Le sceau vient de sa loge et
partira le jour du payant. Restent deux cases mineures, l'icône iOS et le dos des cartes.

Rien d'urgent tant que l'outil est gratuit. Tout devient bloquant le jour de la vente — c'est
donc ce point qui fixera le calendrier de la commercialisation, et pas l'inverse. Seule
exception : la photo de la porte du Temple, sur le premier écran, à retirer avant. Elle partira
sans doute d'elle-même avec l'écran.

La refonte en SVG, proposée par Félix avec l'aide de Claude Design, est la bonne réponse pour
trois raisons cumulées : ces images font 46 à 112 px de large et sont floues sur un écran
moderne ; elles pèsent 774 Ko ; et vingt-sept images glanées à vingt-sept endroits n'ont aucune
unité de trait. Le jeu des carrières a déjà fait la démonstration — dix-sept décors SVG, aucun
fichier image, 87 Ko en tout.

**Découverte imprévue** en instrumentant le navigateur : l'application appelle
`script.google.com` à chaque visite et à chaque quiz terminé, pour le tableur de statistiques.
C'est une seconde dépendance externe, après les polices Google. La collecte elle-même est
irréprochable — aucun identifiant de personne, un jeton partagé par tous, rien qui permette de
reconstituer qui a fait quoi — et c'est une position de départ enviable pour un futur produit
commercial. Le point à corriger un jour : ce jeton est écrit en clair dans un dépôt public, il
ne protège donc rien, et n'importe qui peut polluer les statistiques. À faire passer par le VPS
quand il existera.

### 11 septembre 2026 — Protéger l'oeuvre avant d'en faire un produit

Félix a partagé le dépôt. Un frère l'a appelé pour l'alerter : il fallait protéger ce travail
avant qu'on ne le lui prenne, le déposer à l'INPI, en faire une application payante protégée
par mot de passe.

Le conseil part d'une intention juste et repose sur trois idées reçues qu'il valait mieux
lever tout de suite :

- **Le code est déjà protégé.** En droit français le logiciel est une œuvre de l'esprit et la
  protection naît de la création, sans formalité. Un dépôt n'apporte pas le droit, il apporte
  la preuve — de contenu et de date.
- **Un logiciel ne se brevette pas** en France ni en Europe.
- **Un mot de passe sur une application web ne protège rien.** Tout s'exécute dans le
  navigateur du visiteur : ce qu'il affiche, il l'a déjà téléchargé. Faire payer suppose un
  serveur qui ne livre pas le contenu avant paiement — un autre projet, pas un réglage.

Et un risque que personne n'avait signalé, au moins aussi probable que le vol dès qu'il y a de
l'argent : **la réclamation d'un tiers dont l'application contient le travail**. Le rituel du
1er degré (28 Ko), les quatre rituels humoristiques d'auteur inconnu, et surtout les 36 images
encodées dans le fichier (1,34 Mo, origine non documentée). Tant que l'outil est gratuit ce
risque dort ; le jour où il est vendu, il se réveille.

Quatre livrables :

| Fichier | Ce qu'il fait |
|---|---|
| `LICENSE` | Réserve tous les droits. Un dépôt public sans licence est ambigu — beaucoup lisent « public » comme « libre ». |
| `TIERS.md` | Inventaire de ce qui n'est pas de Félix, et de ce que chaque licence exige. jsPDF et Tailwind (MIT) et les trois polices (OFL) sont clairs ; les contenus sont à vérifier. |
| `PROTECTION.md` | La feuille de route, par ordre d'urgence réelle, jusqu'aux applications mobiles. |
| `outils/empreinte.py` | Produit `EMPREINTE.txt` : commit, date, SHA-256 de chaque fichier, et une empreinte globale unique. C'est la pièce à joindre à un dépôt e-Soleau ou APP. |

Constat utile au passage : le dépôt est public depuis le 27 juillet 2026, **0 fork et
0 étoile**. Personne ne l'a copié sur GitHub à ce jour.

Une chose a été écrite noir sur blanc dans `TIERS.md` parce que la taire fragiliserait tout :
**une part substantielle du code a été écrite par Claude**, sur la direction de Félix. Ce n'est
pas un problème de licence, c'en est un de qualification — le droit d'auteur suppose une
personne humaine — et cela doit être signalé spontanément au conseil consulté et à l'organisme
de dépôt.

Deux décisions attendent Félix : **le dépôt reste-t-il public** (le passer en privé éteint le
site GitHub Pages sur un compte gratuit), et **la question du rituel**, seul point qui peut
obliger à modifier le produit.

### 10 septembre 2026 — V2.3.1 : la Boîte à Outils rangée en trois rayons

Neuf boutons en liste plate, sans titre ni séparation. La convention d'alors voulait que
chaque variante humoristique soit rangée juste sous son pendant sérieux — Lexique
Humoristique sous Lexique Maçonnique, Rituels Humoristiques sous Rituel 1er Degré. Bonne
pour la découverte, elle avait un effet de bord : elle poussait **les deux jeux en 2e et 4e
position**, avant même le rituel. Un frère qui ouvrait la boîte pour réviser tombait sur
« Cordons & Officiers » avant le texte souche, et l'humour arrivait dispersé au milieu du
sérieux.

Trois rayons désormais, du grave au léger :

| Rayon | Boutons |
|---|---|
| **Pour étudier** | Rituel 1er Degré, Mémento Tuilage, Tableau de Loge, Les Officiers, Lexique Maçonnique |
| **Pour sourire** | Rituels Humoristiques, Lexique Maçonnique Humoristique |
| **Pour jouer** | Cordons & Officiers, Mémoire des Symboles |

L'ordre à l'intérieur du premier rayon suit l'usage : le rituel d'abord parce que c'est le
texte souche, le mémento ensuite parce qu'il en découle, les deux supports visuels, et le
lexique en dernier — un dictionnaire se consulte quand on bute, il ne se lit pas en premier.
**Mémoire des Symboles ferme la marche**, décision de Félix.

Deux détails d'exécution qui méritent d'être connus avant d'ajouter un rayon ou un bouton :
les titres de rayon sont des `h3` **stylés en ligne**, parce que la feuille Tailwind du
fichier est compilée et ne contient que les classes déjà utilisées ailleurs — une classe
neuve n'y existerait pas ; et ils sont posés **après** le `h2` de l'écran, qui reste donc la
cible du focus de `switchScreen()`.

Vérifié sous Chromium à 390 et 1100 px : pas de débordement horizontal, focus toujours sur
« Boîte à outils », aucune erreur console autre que celle décrite au point 8 ci-dessous.

### 10 septembre 2026 — V2.3.0 : le mode hors connexion, enfin réel

**Le symptôme.** Le manifeste PWA proposait l'installation depuis la V1.9, mais l'application
affichait une page blanche sans réseau.

**Deux causes, traitées dans cet ordre** — l'inverse aurait figé dans le cache une version
dépendant encore du réseau, ce qui était déjà noté dans le TODO :

1. **jsPDF venait de cdnjs.** Seule dépendance externe de l'application, elle rendait les
   trois exports PDF impossibles hors connexion. Elle est désormais dans le dépôt
   (`jspdf.umd.min.js`, 2.5.1, MIT, 364 Ko), en chemin relatif — donc elle marche aussi en
   `file://`, ce que le CDN ne permettait pas non plus.
2. **Le service worker de la V1.9 était enregistré depuis une URL `blob:`**, ce que la
   spécification interdit. L'enregistrement échouait systématiquement et un `.catch()` vide
   masquait l'erreur. Un vrai `sw.js` le remplace.

**Le choix de stratégie qui compte.** La page passe par le **réseau d'abord**, le cache ne
servant que de filet. Un cache prioritaire aurait figé l'application sur une vieille version,
et il aurait fallu vider le cache du navigateur à chaque déploiement — sur un dépôt qu'on
déploie plusieurs fois par jour, c'était le remède pire que le mal. Les ressources figées
(jsPDF) passent, elles, par le cache d'abord.

`skipWaiting()` et `clients.claim()` : sans eux, un nouveau service worker attend la fermeture
de tous les onglets pour prendre la main, ce qui n'arrive jamais sur une application ouverte en
permanence sur un téléphone.

L'échec d'enregistrement est journalisé au lieu d'être avalé. C'est le silence d'un `.catch()`
vide qui avait laissé le bug de la V1.9 passer inaperçu pendant des mois.

**Vérifications.** Playwright contre un vrai serveur HTTP, réseau coupé par
`context.setOffline(true)` :

| Étape | Résultat |
|---|---|
| Première visite en ligne | Service worker actif, cache contenant `/`, `/index.html`, `/jspdf.umd.min.js` |
| Export PDF en ligne | `Rituels_humoristiques.pdf` |
| Rechargement complet réseau coupé | Page chargée, 531 questions, jsPDF disponible |
| **Export PDF hors connexion** | `Rituels_humoristiques.pdf` |

C'était le but : réviser en tenue, dans un local où le réseau passe mal, exports compris.

---

### 10 septembre 2026 — Ménage : 9 Mo de fichiers morts supprimés

`index-4.html` (V1.4 figée, 1,1 Mo) et `IMG20260814110022.jpg` (7,9 Mo) ne servaient plus.
Vérifié avant de toucher à quoi que ce soit : aucun des deux n'était référencé, ni dans
`index.html`, ni ailleurs dans le dépôt. Seuls les fichiers de documentation les mentionnaient,
et ils sont mis à jour.

Le dépôt passe de 11,4 à 2,4 Mo — un clone, et chaque déploiement Pages, transportaient 9 Mo
pour rien. Les deux fichiers restent dans l'historique git si l'envie de les retrouver vient.

**Le seul effet de bord** : `.../index-4.html` renvoie une 404. Aucune page du site n'y
menait ; en revanche un lien partagé à la main dans une conversation ne se voit pas depuis le
dépôt, et celui-là cassera. C'était le risque signalé dans le TODO, et il est assumé.

---

### 10 septembre 2026 — V2.2.3 : le bouton Précédent d'Android fermait Chrome

**Le symptôme.** Appuyer sur Précédent pour sortir d'un écran fermait l'onglet.

**La cause.** L'application est une page unique où toute la navigation passe par
`switchScreen()`, qui ne touche pas à l'historique du navigateur. Il n'y avait donc qu'une
seule entrée, celle du chargement. Précédent remontait avant elle, c'est-à-dire hors de
l'application.

**Le correctif.** Une entrée sentinelle par niveau ouvert, dépilée par l'application au lieu
du navigateur. Trois points ont demandé de l'attention :

1. **Fermer par la croix** laissait une entrée orpheline : le Précédent suivant aurait été
   avalé sans rien fermer. `syncHistorique()` rend l'entrée devenue inutile.
2. **Sept écrans n'ont pas de croix** mais un bouton « Retour au parvis » — Boîte à Outils,
   écrans de grade, écran de résultats. Sans marquage, Précédent aurait continué à quitter la
   page depuis eux. Leur bouton porte désormais `data-retour`.
3. **Le quiz est inclus**, contrairement au bouton flottant : l'en écarter aurait laissé
   Précédent fermer Chrome en pleine série. `quitQuiz()` demande confirmation, et si l'on
   refuse la sentinelle est reposée.

**Vérifications.** Playwright sur un vrai serveur HTTP — `pushState` est refusé sur `file://`,
un test en local n'aurait rien prouvé. Descente sur trois niveaux puis remontée par Précédent
jusqu'au parvis sans quitter la page ; modale fermée seule sans sortir de l'écran ; fermeture
par la croix suivie d'un Précédent qui sort bien de la Boîte à Outils ; refus de la
confirmation du quiz qui laisse la série intacte. Profondeur mesurée et historique alignés à
chaque étape. Zéro erreur console.

---

### 10 septembre 2026 — V2.2.1 et V2.2.2 : deux correctifs d'ergonomie mobile

**En-tête du Tableau de Loge écrasé (V2.2.1).** La barre alignait croix, titre et trois boutons
de zoom sur une seule ligne flex. Les commandes occupent 184 px fixes : sur un écran de 320 px
il ne restait que 56 px au titre, qui se pliait en huit lignes. Le titre passe sous les
commandes, sur toute la largeur. Une ligne à partir de 360 px, deux à 320 px.

**Sortir d'un écran de lecture obligeait à tout remonter (V2.2.2).** La croix reste en haut de
page, et ces écrans sont longs : 41 000 px pour le Lexique, 20 000 pour le Rituel, 18 000 pour
les Rituels Humoristiques, 15 000 pour le Mémento en lecture. Un bouton « Retour » flottant
apparaît en bas à gauche dès que la croix a défilé hors de vue.

Le choix de conception qui compte : le bouton **ne connaît aucun écran**. Il cherche la
`.modal-close-btn` de l'écran affiché et lui délègue le clic. Six écrans en ont bénéficié sans
une ligne de code par écran, et les prochains en hériteront de la même façon. Son seuil
d'apparition n'est pas un nombre de pixels mais la position réelle de la croix : rien à
re-régler si un en-tête change de hauteur.

**Vérifications.** Playwright à 390 px sur les six écrans concernés : bouton masqué en haut de
page, visible après défilement, retour effectif vers la Boîte à Outils dans les six cas. Écarté
sur l'écran de quiz. Non atteignable au clavier tant qu'il est masqué. Absent de l'accueil, qui
n'a pas de croix. Mesures de l'en-tête du tableau à 320, 360, 390, 430 et 1100 px, zoom et
hotspots inchangés, zéro erreur console.

---

### 10 septembre 2026 — V2.2 : application des points de la relecture

**Demande.** Trancher et appliquer les points laissés en suspens par `RELECTURE-V2.1.md`.

**57 corrections, toutes de contenu, aucune de code.** Le détail figure dans le changelog
en tête d'`index.html`. Les plus lourdes de conséquence :

1. **Sept contradictions internes** résolues. Deux questions se déclaraient mutuellement
   fausses sur les Trois Petites Lumières ; trois autres donnaient la « Chambre de Justice »
   pour une instance de la GLDF quand une quatrième rappelait, Constitution à l'appui, que
   c'est le vocabulaire d'une autre obédience ; sym_085 servait la doctrine Émulation des
   outils de l'Apprenti contre le REAA de tout le reste du corpus.
2. **Jakin et Boaz étaient inversés** par rapport à 1 Rois 7,21 que les questions citaient
   elles-mêmes. Corrigé dans sym_007, sym_008 et voc_038.
3. **Deux questions se donnaient mutuellement la réponse** : fmc_013 nommait Jules Ferry,
   réponse de fmc_008 ; l'explication de fmc_048 nommait Oscar Wilde à Oxford, réponse
   de fmc_053.
4. **Dix distracteurs** étaient aussi défendables que la bonne réponse, l'explication en
   validant parfois un mot pour mot. Réécrits.
5. **Neuf appartenances** de francs-maçons célèbres, données pour établies, ramenées à ce
   que disent les sources. fmc_032 affirmait « Pinochet n'a jamais été franc-maçon » alors
   que sa propre source s'intitule « Allende et Pinochet francs-maçons ».

**Une convention typographique découverte au passage.** `CLAUDE.md` annonçait l'apostrophe
courbe partout. C'est faux : les blocs de données JS (questions, glossaire, lexiques, fiches)
n'emploient que l'apostrophe droite — 3 019 contre zéro dans le corpus — seule la prose HTML
du rituel emploie la courbe. Mon texte neuf avait introduit 88 courbes dans le corpus, elles
ont été ramenées en droites et `CLAUDE.md` est corrigé.

**Non fait, volontairement.** Les deux fiches du Mémento en lecture signalées par la relecture
ne sont pas retouchées : c'est un texte de référence pour le tuilage, on ne le corrige pas au
jugé. La graphie « Franc-Maçonnerie » / « franc-maçonnerie » reste mêlée, l'harmoniser
toucherait ce même Mémento. Les lacs d'amour « souvent douze » et mem_015 restent ouverts.

**Vérifications.** Syntaxe JS, intégrité des 531 questions (quatre options, une seule bonne
réponse, aucune option dupliquée), Playwright sur Chromium à 400 px : trois quiz complets
menés jusqu'aux résultats sur les thèmes les plus touchés, les six écrans annexes ouverts et
refermés, contrôles ponctuels sur le cordon, la Lune, la capitation, « Houzzé » et le bijou
du Maître des Cérémonies. Zéro erreur console.

---

### 10 septembre 2026 — V2.1 : relecture complète et choix du nombre de questions

**Contexte.** Présentation du quiz en tenue le soir même. Travail mené dans une session Cowork
séparée, à partir de la V1.9 déposée le 17 août, puis reporté sur `main` (qui contenait déjà la
V1.9.1 et les rituels humoristiques). Les correctifs communs aux deux branches — toast fantôme,
retour en haut à chaque question, sources d'alchimie — ont été fusionnés en gardant la version
de `main` pour le code et la version la plus précise pour chaque source.

**Ce qui a été fait.**

1. **Choix du nombre de questions** avant chaque quiz : 10 · 15 · 20 · 25 · 30 · 40 · 50 · 75 ·
   100 · Toutes, borné à ce que le thème contient. Remplace la boîte `confirm()` OK/Annuler du
   mémento, et s'applique à tous les thèmes et à « Tous les thèmes ». Dernier choix mémorisé
   (`SETTINGS.nbQuestions`) ; « Rejouer ce thème » reprend le même format. Modale `#nb-modal`
   enregistrée dans `MODALES` (Échap, focus).
2. **Relecture complète** par onze relecteurs en parallèle (un par thème, deux pour glossaire,
   lexiques, officiers, tableau, rituel, interface), puis filet automatique. Environ 390
   corrections objectives : coquilles (« démonter » → « démontrer », « cognissable »,
   « immatrialisme », « Nepthtali », « crucible », « II est midi » issu d'un OCR dans le rituel),
   accents sur majuscules, guillemets droits → « », ligatures œ, espaces fines insécables,
   « veuillez-nous assister » ×4, Keystone n° 235 → 243 et Glenn 1998 → 1978 (la source du
   fichier disait déjà la bonne valeur).
3. **Deux réponses corrigées d'après le Mémento GLDF** : sym_051 (le Premier Surveillant siège
   à l'Occident, non au Midi — cf. mem_053) et rit_036 (les travaux d'Apprenti s'ouvrent à
   midi, non à minuit — cf. mem_057).
4. Quatre doublons non étiquetés rattachés à un `dupGroup` (voc_044, voc_020, voc_048/voc_025,
   sym_062/sym_006). Pool servi : 502 → 499.
5. Sources d'alchimie : 8 liens de plus que la V1.9.1 rendus précis (pélican → Princeton
   University Library, Decknamen → glossaire du projet Chymistry of Isaac Newton, Solve et
   coagula → Princeton, théorie soufre-mercure → ancre de section, Waidan/Neidan → pages
   dédiées). Les 50 URL vérifiées en HTTP (200 + ancre présente).
6. Le lien « En savoir plus » affiche le nom du site (`nomDuSite()`), plus le champ `source`,
   qui contient des notes de travail.
7. `README.md` de présentation ; `RELECTURE-V2.1.md` avec les points à trancher.

**Non fait, volontairement.** Tout ce qui relève d'un choix doctrinal ou d'un fait historique
contesté est consigné dans `RELECTURE-V2.1.md` et laissé à Félix : Trois Petites Lumières
(sym_084 et rit_009 se contredisent), Chambre de Justice (drt_002/009/020 contre drt_015),
outils de l'Apprenti (sym_085), Jakin/Boaz, port du cordon, place de la Lune sur le tableau,
et une douzaine de faits sur les francs-maçons célèbres.

**Vérifications.** Syntaxe JS, Playwright sur Chromium à 400 px : scénario du toast fantôme,
retour en haut sur six questions, sélecteur sur trois thèmes (bornes, mémorisation, Échap,
« Toutes », rejouer), quiz complet de 20 questions jusqu'aux résultats, les six écrans annexes,
les trois mini-jeux, les rituels humoristiques, zéro erreur console. Intégrité des 531
questions (une seule bonne réponse, quatre options).

---

### 18 août 2026 — Rituels humoristiques

**Demande.** Ajouter quatre rituels de banquet fournis en PDF (Ouverture du Bar, Rituel des
Voyous, Francs-Gloutons, Rituel du confinement), à côté du rituel classique.

**Ce qui a été fait.**

1. Transcription des quatre PDF en données structurées `rituelsHumorData` : 224 blocs au total
   (61 pour le Bar, 33 pour les Voyous, 71 pour les Francs-Gloutons, 59 pour le Confinement).
   Trois types de bloc — `h` pour un intertitre, `d` pour une didascalie, `r`+`t` pour une
   réplique. Texte intégral, seuls les artefacts d'extraction ont été corrigés (`qu¹il`,
   `V Grand Poivrot` → `Vénérable Grand Poivrot`, espaces avant ponctuation). Un chapeau de
   deux lignes a été ajouté en tête de chaque rituel pour situer les rôles.
2. Rendu en `<details>` repliés, un par rituel. Avertissement en tête : aucune valeur rituelle.
3. Export PDF dédié `Rituels_humoristiques.pdf` — 11 pages, accents et pagination corrects.
4. Espace fine insécable posée sur les 112 ponctuations doubles du nouveau texte, conformément
   à ce qui avait été fait sur le corpus de questions en V1.9.

**Deux allers-retours sur l'emplacement.**

D'abord posée en bas de l'écran Rituel, comme demandé littéralement. Mauvais choix à l'usage :
il fallait dérouler tout le rituel classique — une dizaine de pages — pour tomber dessus.
Déplacée dans son propre écran, avec une entrée dans la Boîte à Outils juste sous
« Rituel 1er Degré », sur le modèle du Lexique Humoristique rangé sous le Lexique Maçonnique.

L'icône du menu a elle aussi été refaite : la première reprenait le parchemin du rituel
classique et en était indiscernable à 24 px. La seconde le déroule à la verticale et lui met
un visage rieur — le lien de famille reste lisible, la confusion disparaît.

**Vérifications.** Playwright sur Chromium, en 390 px et 1100 px : ordre du menu, navigation
aller-retour, focus posé sur le titre à l'ouverture, ouverture des cartes au clavier, absence
de double rendu à la réouverture, export PDF fonctionnel, zéro erreur console. Vérifié aussi
que le PDF du rituel classique ne contient aucun des textes humoristiques — la section est
frère de `#rituel-lecture-content`, pas fils, précisément pour ça.

**État git.** PR #1 fusionnée dans `main` (commit `f97b2de`) : c'était la version « en bas de
l'écran Rituel », elle est en ligne. Le déplacement dans un écran dédié est sur
`claude/mise-a-jour-en1lj2` (commit `bb70933`), **pas encore fusionné**.

---

## À faire

### 1. Supprimer les branches fusionnées — *fait par Félix le 10 septembre 2026*

`claude/mise-a-jour-en1lj2`, `claude/v2.1-relecture-choix-questions` et
`claude/v2.2-corrections-relecture` sont fusionnées dans `main` et bonnes à supprimer.
La commande avait été refusée par le contrôle de permissions de l'environnement, puis le
proxy git avait rejeté quatre tentatives de `push --delete` ; le serveur GitHub ne propose
aucun outil de suppression de branche. Félix les a supprimées à la main depuis l'onglet
*Branches* du dépôt. **À retenir pour la prochaine fois : ce ménage-là ne peut pas être fait
depuis ici, il faut le demander.**

**Ne pas toucher à `claude/kata-catacombes-game-t7cddr`** : elle n'est pas fusionnée et porte
le projet Kata (fiction interactive), 2 173 lignes en attente.

### 2. Mode hors connexion et jsPDF — *faits le 10 septembre 2026 (V2.3.0)*

Les deux points sont réglés, dans l'ordre qui était prescrit ici. Une chose reste à vérifier
sur un vrai téléphone, que Playwright ne sait pas simuler : **installer l'application sur
l'écran d'accueil, couper les données, et l'ouvrir.** Le test automatisé couvre le rechargement
hors connexion dans l'onglet, pas le lancement depuis l'icône.

### 4. Ménage dans le dépôt — *fait le 10 septembre 2026*

`index-4.html` et `IMG20260814110022.jpg` sont supprimés. Le dépôt passe de 11,4 à 2,4 Mo.
Tous deux restent récupérables dans l'historique git.

Une conséquence à connaître : `https://f3nnnx.github.io/Quizz_Maconnique/index-4.html` renvoie
désormais une 404. Aucune page ne pointait dessus, mais un lien partagé à la main dans une
conversation, lui, ne se voit pas depuis le dépôt.

### 5. Les titres du rituel n'ont pas de taille — *cosmétique*

Tailwind preflight remet `h1`-`h6` à `font-size: inherit; font-weight: inherit`. Les `h2`,
`h3` et `h4` de `#rituel-lecture-content` n'ont donc aucune taille propre : la hiérarchie du
rituel classique est invisible en vue normale. Seule la vue compacte leur en donne une, ce qui
produit ce paradoxe d'une vue « compacte » où les titres ressortent mieux.

Correctif : quelques règles `#rituel-lecture-content h2/h3/h4` alignées sur celles de la vue
compacte, en un cran au-dessus.

### 6. Poids de la page — *de fond*

2,3 Mo en un seul fichier, retéléchargés à chaque visite dès que le cache est vidé, sur une
application destinée au mobile. L'essentiel du poids vient des images en base64.

Piste : sortir les plus grosses images en fichiers séparés dans un dossier `img/`, ce qui les
rend cachables indépendamment et permet au HTML de s'afficher avant qu'elles n'arrivent. C'est
un chantier, à ne lancer que si le temps de chargement gêne réellement à l'usage.

### 7. Numéro de version — *fait en V2.1*

Le titre, l'écran Réglages et le changelog sont passés en V2.1 le 10 septembre 2026.

### 8. Une dépendance externe subsiste — *à trancher*

Le changelog de la V2.3.0 affirme que jsPDF était « la seule dépendance externe ». C'est
inexact : un `<link>` vers `fonts.googleapis.com` reste en tête de page, pour Inter, Cinzel et
EB Garamond. Rien ne casse sans lui — les polices de repli prennent le relais — mais
l'application n'est pas autonome au sens strict, et le premier affichage attend le réseau.

Deux issues possibles : intégrer les trois polices en base64 comme le reste des ressources,
au prix d'environ 200 à 400 Ko de plus sur une page qui en fait déjà 2,3 (voir le point 6) ;
ou assumer le CDN et retirer la promesse d'autonomie du changelog. La seconde est honnête et
gratuite, la première est la seule qui tienne vraiment hors connexion.

À noter pour les sessions futures : **`ERR_CONNECTION_RESET` sur `fonts.googleapis.com` dans
la console de développement n'est pas une régression**, c'est la politique réseau de
l'environnement qui bloque ce domaine.

---

## Feuille de route — les intentions de Félix

Ce que Félix veut faire de l'application, noté ici pour ne pas se perdre entre deux sessions.
Rien n'est engagé : ce sont des directions, pas des tâches prêtes.

### A. Une base de données de tableaux de loge

Aujourd'hui l'écran *Tableau de Loge* en présente un seul. Félix veut en rassembler
**beaucoup**, récupérés sur internet et dans ses propres documents, et en faire une collection
consultable.

Trois questions à trancher avant d'écrire la moindre ligne :

- **Le poids.** La page fait déjà 2,3 Mo à cause des images en base64. Une collection de
  tableaux ne peut pas suivre le même chemin : c'est ce chantier qui rendra le point 6
  obligatoire — un dossier `img/`, des fichiers séparés, un chargement à la demande.
- **Les droits.** Un tableau trouvé sur internet appartient à quelqu'un. Il faudra tenir pour
  chacun sa provenance et son statut, et écarter ce qui ne peut pas être republié. Le champ
  `source` des questions existe déjà comme précédent, mais il n'est jamais affiché : ici il
  devra l'être.
- **Le rangement.** Par rite, par degré, par époque, par obédience ? C'est ce choix qui
  décidera de la forme de l'écran, pas l'inverse.

### B. Étoffer les Rituels Humoristiques

Le rayon POUR SOURIRE ne contient que les quatre rituels récupérés en août. Félix veut
l'agrandir, et **en écrire de nouveaux avec Claude**. Le format est déjà là : `rituelsHumorData`,
des blocs `{h}` pour un titre, `{d}` pour une didascalie, `{r,t}` pour une réplique attribuée.
Ajouter un rituel, c'est ajouter une entrée à cette constante — l'écran, l'export PDF et le
bouton de retour flottant suivent tout seuls.

Deux garde-fous : l'apostrophe **droite** est de rigueur dans ce bloc de données comme dans
tous les autres (voir CLAUDE.md), et l'humour maçonnique se moque des travers, jamais du
rituel lui-même — c'est ce qui sépare la plaisanterie entre frères de la moquerie.

### C. Le jeu des carrières — *en réflexion, voir `JEU-PISTES.md`*

**Ce chantier n'est pas prêt à démarrer et ne doit pas l'être.** Félix prend le temps
d'élaborer le jeu avant toute intégration. Toutes les pistes envisagées — les cinq voies
possibles, les titres, la mécanique des questions, les combinaisons qui tiennent debout — sont
rassemblées dans **`JEU-PISTES.md`**. Rien n'y est décidé, et rien n'y est à coder.

Ce qui suit ne résume que l'état des lieux, pas un plan.

La fiction interactive `kata-la-descente/`, sur la branche non fusionnée
`claude/kata-catacombes-game-t7cddr`, a vocation à devenir un bouton du rayon POUR JOUER —
**au-dessus de Mémoire des Symboles**, qui reste le dernier.

État au 10 septembre 2026 : le jeu est fini et fiable. 48 nœuds, 16 dénouements tous
atteignables, zéro erreur console, son propre vérificateur passe intégralement. Ce qui reste :

- **Le renommer** autour du V.·.I.·.T.·.R.·.I.·.O.·.L.·. — l'épigraphe est déjà celle du jeu,
  le titre doit la rejoindre. Six propositions dans `JEU-PISTES.md`, aucune retenue : le titre
  se choisit **après** la mécanique, sinon il promet ce que le jeu ne tient pas.
- **Refondre les choix et les dénouements** pour qu'ils parlent à un franc-maçon. Félix
  envisage notamment de faire dépendre la progression de bonnes réponses — l'idée est
  développée, avec ses trois branchements possibles et son piège principal, dans la section 5
  de `JEU-PISTES.md`. C'est ce travail-là qui justifiera sa présence dans un outil
  d'instruction — sans lui, le jeu reste un corps étranger.
- **L'intégrer par `<iframe>`**, en `kata.html` à la racine, et non en fusionnant les deux
  fichiers : la CSS du Kata style `html`, `body`, `*`, `button`, `h1`-`h3` et `p`, elle
  repeindrait tout le Quiz ; et ses fonctions `switchScreen(showId)` et `vibrer(motif)` ont
  des signatures incompatibles avec celles du Quiz. Un `<iframe>` est un document séparé :
  les deux collisions disparaissent d'elles-mêmes.
- Corriger au passage les défauts relevés dans son propre dépôt : le `README.md` nie une
  reprise de partie qui existe, les contrastes du texte secondaire sont à mesurer, et
  l'abandon de partie ouvre un `window.confirm()` natif au milieu du noir et or.

### D. L'écran de la porte est en sursis

Félix, le 11 septembre 2026 : « le fait de devoir cliquer 3x c'est rigolo mais usant à la
longue. Je le garde pour le fun mais ça va tendre à disparaître, c'est certain. »

Le chiffre lui donne raison. `DELAI_MIN_COUP` impose 700 ms entre deux coups, et
`ouvrirLeTemple` est appelé 3 secondes après le troisième : **il faut au minimum cinq secondes
pour entrer, à chaque lancement**, sur une application qu'on ouvre pour réviser deux minutes
dans le métro.

S'y ajoute que cet écran porte l'image 04, la photographie trouvée sur internet (voir
`IMAGES.md`) : **le supprimer réglerait le problème de droits le plus urgent par la même
occasion.**

Avant de le supprimer, considérer ce qu'on perdrait. La porte est la première impression du
produit, et c'est elle qu'on montre à un frère à qui l'on fait découvrir l'outil. Sa valeur est
réelle — elle est simplement **entièrement concentrée sur la première visite**.

D'où une voie moyenne qui coûte peu : **mémoriser dans `localStorage` qu'on a déjà frappé**.
Cérémonie complète la première fois, entrée directe ensuite, avec peut-être un moyen discret de
la rejouer pour qui veut la montrer. On garde le charme là où il sert et on retire le péage.
Cela laisse aussi le temps de trouver une image dont Félix ait les droits, au lieu de devoir
choisir entre garder une photo d'autrui et supprimer l'écran.

Rien n'est décidé : c'est une intention de Félix, notée pour ne pas se perdre.

### E. Ce que ces chantiers ont en commun

Les trois premiers font tous grossir la page, et deux d'entre eux la font grossir beaucoup.
**Le point 6 — sortir les images du fichier — cesse d'être un chantier de fond le jour où l'un
d'eux démarre.** À traiter avant, pas après.

Le quatrième va dans l'autre sens : supprimer ou alléger l'écran de la porte rendrait 158 Ko,
la plus grosse image de l'application.
