# Suivi de développement

Journal des travaux et liste de ce qui reste à faire. Tenu à jour à chaque session.

---

## Journal

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

### 1. Fusionner l'écran Rituels Humoristiques — *immédiat*

Le commit `bb70933` attend sur `claude/mise-a-jour-en1lj2`. Tant qu'il n'est pas dans `main`,
le site en ligne montre encore la version enterrée en bas du rituel. Ouvrir la PR, relire,
fusionner.

### 2. Le mode hors connexion ne marche pas — *important*

Le service worker a été retiré en V1.9 : il était enregistré depuis une URL `blob:`, ce que la
spécification interdit, donc il n'a jamais fonctionné. Mais le manifeste PWA est resté. Résultat :
l'application se propose à l'installation sur l'écran d'accueil, puis affiche une page blanche
sans réseau.

C'est gênant pour l'usage visé — réviser en tenue, dans un local où le réseau passe mal.

Correctif : un vrai fichier `sw.js` à la racine du dépôt, enregistré normalement
(`navigator.serviceWorker.register('sw.js')`), qui met en cache `index.html` et jsPDF. Servi
par Pages en HTTPS, donc éligible. À faire **après** le point 3, sinon le cache figera une
version qui dépend encore du CDN.

### 3. jsPDF vient d'un CDN — *important*

`index.html` charge jsPDF depuis `cdnjs.cloudflare.com`. C'est la seule dépendance externe de
l'application. Sans réseau, les trois exports PDF (Mémento, Rituel, Rituels humoristiques)
échouent avec une alerte.

Correctif : héberger jsPDF dans le dépôt (`jspdf.umd.min.js`, environ 350 Ko) ou l'inliner
dans `index.html`. L'héberger à côté est préférable — cela évite de gonfler un fichier déjà
à 2,3 Mo, et le navigateur peut le mettre en cache séparément.

### 4. Ménage dans le dépôt — *facile*

`index-4.html` (V1.4, 1,1 Mo) et `IMG20260814110022.jpg` (7,9 Mo, référencée nulle part)
représentent 9 Mo inutiles, clonés et déployés sur Pages à chaque fois. Les supprimer ; git
garde l'historique si on veut les retrouver.

Attention avant de supprimer `index-4.html` : vérifier que personne n'a partagé de lien direct
vers `.../index-4.html`.

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

### 7. Numéro de version

Le titre annonce toujours V1.9. Les rituels humoristiques sont un ajout fonctionnel visible :
un passage en V2.0 se défend, avec une section de changelog propre. À décider par Félix.
