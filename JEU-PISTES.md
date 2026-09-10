# Le jeu — carnet de pistes

Tout ce qui a été envisagé pour la fiction interactive des carrières, rassemblé ici pour que
Félix puisse y réfléchir sans que rien ne se perde entre deux sessions.

**Rien n'est décidé. Rien ne doit être codé à partir de ce document.** C'est un carnet, pas un
cahier des charges. Il sera relu, élagué, et une seule voie en sortira — ce jour-là, elle
partira dans SUIVI.md sous forme de tâches, et ce fichier retournera à l'état de brouillon.

---

## 1. Ce qui est acquis

Le jeu existe et il fonctionne. Il s'appelle pour l'instant **Kata — La Descente**, il vit sur
la branche non fusionnée `claude/kata-catacombes-game-t7cddr`, dans `kata-la-descente/`.

- Un seul fichier de 87,5 Ko, aucune dépendance, aucun build.
- 48 nœuds, 16 dénouements — 13 morts, 2 échecs, 1 sortie — **tous atteignables**, vérifié
  par un parcours indépendant du graphe.
- 17 décors SVG dessinés à l'exécution, ambiance sonore synthétisée sans un seul fichier son,
  vibrations graduées, mur d'épitaphes qui se garde d'une partie à l'autre.
- Zéro erreur console, aucun débordement horizontal à 390 ni à 1100 px, son propre
  vérificateur (`outils/verifier.mjs`) passe intégralement.

Autrement dit : **la question n'est pas « est-ce que ça marche », c'est « qu'est-ce que ça
raconte ».**

## 2. Ce qui n'est pas tranché

Quatre questions, dans l'ordre où elles doivent être répondues — chacune ferme des options
pour la suivante.

1. **Qu'est-ce qu'on gagne ?** Aujourd'hui : sortir vivant. C'est un but de survie. Est-ce
   qu'il devient un but de quête (rapporter quelque chose), d'épreuve (prouver qu'on sait),
   ou reste-t-il tel quel ?
2. **Est-ce qu'on répond à des questions ?** L'idée de Félix. Elle change la nature du jeu
   plus que le titre ne le fera jamais — voir la section 5, qui lui est entièrement consacrée.
3. **Comment ça s'appelle ?** Le titre suit la réponse aux deux premières. Choisir le nom en
   premier, c'est se lier les mains.
4. **Est-ce que ça entre dans le Quiz ?** Et si oui, sous quelle forme — un bouton dans le
   rayon POUR JOUER, ou un jeu qui vit chez lui et vers lequel on pointe.

---

## 3. Les voies possibles

Cinq directions, de la plus légère à la plus lourde. Elles ne sont pas exclusives : la 3 et la
4 se combinent bien, la 5 les absorbe toutes.

### Voie A — Le laisser tel quel, juste le renommer

On change le nom, on corrige les défauts connus (section 8), et c'est tout. Le jeu reste une
fiction de survie souterraine avec une épigraphe maçonnique.

- **Coût** : une journée. **Risque** : aucun techniquement.
- **Ce que ça donne** : un très bon jeu, mais un corps étranger dans un outil d'instruction.
  Un frère qui le trouve dans la Boîte à Outils se demandera ce qu'il fait là.
- **Quand la choisir** : si le jeu doit vivre chez lui, dans son propre dépôt, et que le Quiz
  se contente d'un lien.

### Voie B — La Pierre Cachée : un objet à rapporter

On gagne en remontant **avec quelque chose**, pas seulement vivant. La remontée cesse d'être
la fin et devient la seconde moitié du jeu.

- Ce que ça change : le graphe gagne un point de bascule au plus profond, et le chemin du
  retour n'est plus le chemin de l'aller. Les 48 nœuds deviennent peut-être 60.
- Ce que ça donne : *Occultum Lapidem* cesse d'être une citation en exergue et devient la
  mécanique. La descente a un objet.
- Le piège : si la pierre est un simple objet à ramasser, c'est une clé de jeu vidéo et la
  métaphore tombe à plat. Il faut qu'elle coûte quelque chose de la porter — du poids, de la
  lumière, un choix qu'on ne peut plus faire.

### Voie C — Les questions comme épreuves

L'idée de Félix : répondre correctement permet d'avancer. Elle mérite sa propre section —
voir la 5, il y a beaucoup à dire et un vrai piège à éviter.

### Voie D — Rectifier : revenir sur ses pas

*Rectificando.* Aujourd'hui un mauvais choix est définitif : il coûte de la frontale, et trois
détours tuent. Dans cette voie, certains mauvais choix sont **rattrapables** — on peut revenir,
refaire autrement, mais ça coûte.

- Ce que ça change : le graphe cesse d'être un arbre et devient un vrai graphe, avec des
  retours. Le moteur le permet déjà (`vers` accepte une fonction de l'état, `pose` mémorise
  des jalons) — c'est le texte qui manque, pas le code.
- Ce que ça donne : la seule des cinq voies où l'erreur devient un matériau et non une
  sanction. C'est très exactement ce que dit le mot du milieu de la phrase.
- Le piège : si tout est rattrapable, plus rien n'est grave et les 13 morts perdent leur sens.
  Il faut que la rectification soit possible **et coûteuse**, et pas toujours possible.

### Voie E — Le cabinet de réflexion

Le jeu tout entier relu comme le cabinet : on descend seul, dans le noir, on dépose ce qu'on
croyait savoir, et on remonte autre. Les treize morts ne sont plus des punitions mais les
épreuves qu'on ne franchit pas encore ; le sac de la première scène, qu'on ne peut plus
changer, se lit comme le dépouillement des métaux.

- Ce que ça change : presque rien au code, tout au texte. C'est une relecture, pas une
  réécriture.
- Ce que ça donne : la justification la plus forte de sa présence dans le Quiz.
- Le piège : le plus solennel des cinq. Treize façons de mourir dans un cabinet de réflexion,
  ça peut se lire comme une irrévérence. À manier avec le sérieux qu'on met au rituel.

---

## 4. Les titres possibles

À choisir **après** la voie, pas avant. La phrase source :
*Visita Interiora Terrae Rectificando Invenies Occultum Lapidem* — « Visite l'intérieur de la
terre, et en rectifiant tu trouveras la pierre cachée ».

| Titre | Ce qu'il promet | Va avec |
|---|---|---|
| **La Pierre Cachée** | Une quête, un objet au fond | Voie B |
| **En Rectifiant** | Une reprise, une erreur qu'on corrige | Voie D |
| **L'Intérieur de la Terre** | Un lieu, littéral et froid | Voie A |
| **VITRIOL** | Rien de précis — et c'est sa force : un maçon y lit la phrase, un profane y lit un acide | toutes |
| **VITRIOL — La Descente** | Le changement minimal, ton sous-titre conservé | Voie A |
| **Le Cabinet de Réflexion** | Une épreuve initiatique, sans détour | Voie E |

Une remarque de méthode : **un titre qui promet quelque chose que le jeu ne tient pas est pire
qu'un titre neutre.** « La Pierre Cachée » sur un jeu où l'on ne cherche aucune pierre déçoit
à la première partie. C'est pour ça que le titre vient en dernier.

---

## 5. Les questions dans le jeu — la vraie question

L'idée : répondre correctement à certaines questions permet d'avancer, et rend le jeu plus
difficile. Elle est bonne, mais elle cache une décision de fond qu'il faut prendre en
conscience, parce qu'elle décide de qui peut finir le jeu.

### Trois façons de brancher une question, très différentes

**1. La question comme porte.** Bonne réponse, on passe ; mauvaise réponse, on est bloqué ou
on meurt.
- *Pour* : c'est la plus simple à écrire et la plus tendue à jouer.
- *Contre* : dans un outil d'instruction, **un frère qui ne sait pas ne peut pas finir**. Ce
  n'est plus une épreuve, c'est un examen — et échouer devant un jeu est humiliant là où
  échouer devant un quiz est normal, parce qu'un quiz annonce la couleur.

**2. La question comme remise.** Bonne réponse, le passage coûte moins de frontale ; mauvaise
réponse, il coûte le prix fort.
- *Pour* : personne n'est bloqué, mais savoir se paie en marge.
- *Contre* : l'effet est indirect, le joueur peut ne pas faire le lien.

**3. La question comme lumière.** Bonne réponse, la frontale remonte ; mauvaise réponse, elle
ne remonte pas.
- *Pour* : **c'est la plus juste des trois, et de loin.** Le jeu a déjà une ressource unique
  qui est de la lumière, et une seule occasion d'en regagner. La connaissance qui rend la
  lumière, c'est la métaphore du grade tout entier, et elle ne bloque personne : un joueur
  ignorant peut finir, avec beaucoup moins de marge. Il perdra plus souvent, il comprendra
  pourquoi, et il ira réviser — ce qui est exactement le but de l'application.
- *Contre* : demande de rééquilibrer les coûts du chemin gagnant, qui sont aujourd'hui calés
  à 61 % avant le rechargement et 33 % après.

### D'où viennent les questions ?

**Option 1 — puiser dans `allQuestions`** (531 questions, 499 servies au 1er degré).
- *Pour* : rien à écrire. Et surtout : le jeu pourrait **alimenter la répétition espacée** —
  jouer deviendrait réviser, et une partie nourrirait la progression comme un quiz. C'est
  l'argument le plus fort qui existe pour mettre ce jeu dans le Quiz plutôt qu'à côté.
- *Contre* : les questions du corpus sont écrites sur un ton scolaire. « Que représente le
  pavé mosaïque ? » au fond d'une galerie noyée, ça casse la fiction net.

**Option 2 — écrire des questions dédiées**, dans la voix du jeu.
- *Pour* : la fiction tient.
- *Contre* : c'est un corpus de plus à écrire et à maintenir, et il ne nourrit aucune
  progression.

**Option 3 — reformuler des questions du corpus dans la voix du jeu**, en gardant leur
identifiant.
- *Pour* : la fiction tient **et** la progression est nourrie.
- *Contre* : deux formulations pour une même question, à tenir synchronisées. C'est la plus
  ambitieuse, et probablement la bonne.

### Combien, et où ?

Une question à chaque nœud noierait la fiction. Trois ou quatre par partie, posées **aux
moments où l'on hésite déjà** — le carrefour, la chatière, la galerie noyée — suffiraient à
changer la nature du jeu sans en faire un questionnaire déguisé.

### Ce qu'il ne faut pas faire

**Un quiz dans un quiz.** Si le jeu devient une suite de questions habillée d'un décor, il ne
sert à rien : le Quiz fait déjà ça, mieux, et avec la répétition espacée. Ce que le jeu peut
apporter et que le quiz ne peut pas, c'est **la conséquence** — savoir ou ne pas savoir change
ce qui arrive ensuite, pas seulement un score.

---

## 6. Les combinaisons qui tiennent debout

- **A seule** — le jeu chez lui, renommé, lié depuis la Boîte à Outils. Le moins de travail,
  et pas déshonorant.
- **B + C(lumière) + le titre « La Pierre Cachée »** — une quête, la connaissance qui éclaire,
  un objet à rapporter. C'est la version la plus cohérente et la plus coûteuse.
- **D + E + le titre « En Rectifiant »** — l'erreur rattrapable et la lecture initiatique,
  sans questions du tout. Beaucoup de texte, peu de code.
- **C(lumière) seule, sur le jeu existant** — le changement le plus rentable : peu de travail,
  et il suffit à justifier la présence du jeu dans un outil d'instruction.

---

## 7. Contraintes techniques qui ne bougeront pas

Quelle que soit la voie, ceci reste vrai et a été mesuré :

- **L'intégration se fera par `<iframe>`**, en `kata.html` (ou son futur nom) à la racine, et
  jamais en fusionnant les deux fichiers. La CSS du jeu style `html`, `body`, `*`, `button`,
  `h1`-`h3` et `p` : elle repeindrait tout le Quiz en noir et or. Et ses fonctions
  `switchScreen(showId)` et `vibrer(motif)` ont des signatures incompatibles avec celles du
  Quiz — la seconde déclaration écraserait la première et casserait la navigation.
  Un `<iframe>` est un document séparé : les deux collisions disparaissent d'elles-mêmes.
- **Aucune collision d'id DOM, aucune classe commune**, et les clés de stockage du jeu sont
  toutes préfixées `kata.` — la progression du Quiz ne risque rien.
- **Si le jeu puise dans `allQuestions`**, l'`<iframe>` complique les choses : il faudra soit
  dupliquer les questions dans le jeu, soit les lui passer par `postMessage`. À trancher au
  moment venu, mais à savoir dès maintenant.
- **Sa place dans la Boîte à Outils est décidée** : rayon POUR JOUER, au-dessus de Mémoire des
  Symboles qui ferme la marche.

## 8. Défauts à corriger de toute façon

Indépendants de la voie choisie, relevés le 10 septembre 2026 :

- Le `README.md` du jeu affirme qu'il n'y a pas de sauvegarde à mi-chemin. C'est faux : le
  code sauvegarde la partie (`kata.partie`) et affiche un bouton « Reprendre ».
- Les contrastes du texte secondaire (épitaphes, statistiques) sont à mesurer — gris pâle sur
  noir, probablement sous le seuil AA.
- L'abandon de partie ouvre un `window.confirm()` natif, seule rupture de style du jeu.
- `outils/verifier.mjs` importe Playwright par chemin absolu : il ne tourne que dans cet
  environnement-ci.
- Ni manifeste PWA ni service worker, là où le Quiz en a un depuis la V2.3.0.

## 9. La question qui reste ouverte, et qui n'est pas technique

Le Quiz est l'outil que Félix présente en Loge. Le jeu est une fiction se déroulant dans une
activité interdite par l'arrêté du 2 novembre 1955, où l'on meurt de treize façons.

Les voies C, D et E répondent à cette objection — elles font du jeu un support d'instruction,
pas un divertissement toléré à côté. La voie A n'y répond pas, et c'est pour ça qu'elle va de
pair avec un jeu qui vit chez lui.

**C'est le seul point de ce document qu'aucune mesure technique ne tranchera.**
