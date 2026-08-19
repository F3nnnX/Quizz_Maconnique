# Kata — La Descente

Fiction interactive à choix multiples dans les carrières souterraines de Paris.
Un fichier, aucune dépendance, aucun build : on ouvre `index.html`, ça marche.

> Visite l’intérieur de la terre, et en rectifiant tu trouveras la pierre cachée.

Trois cents kilomètres de galeries fermées au public depuis 1955. Le joueur y descend
une nuit. **Une seule suite de choix le ramène au jour** ; toutes les autres se terminent
sous terre — éboulement, fumigène, galerie noyée, chatière, rixe, hypothermie, crue, ou
simplement une pile morte à trente mètres sous une ville de deux millions d’habitants.

## Comment ça se joue

À chaque scène, deux à quatre choix. Pas de score, pas de sauvegarde à mi-chemin : on
redescend depuis le seuil. Les touches `1` à `4` choisissent, `Tab` circule, `Entrée` valide.

Trois mécaniques portent tout le jeu :

**La frontale.** Ressource unique, affichée en haut de l’écran. Chaque choix la consomme,
les détours la vident plus vite. À zéro, c’est le noir absolu, et le noir absolu tue —
c’est la mort la plus banale des carrières et la plus fréquente ici. Un seul moment du
jeu la fait remonter : changer les piles, à condition d’en avoir emporté.

**Le sac.** Ce qu’on prend à la première scène ne se rattrape pas. Deux des trois sacs
contiennent leur propre mort, très loin en aval : le sac *léger* ne peut pas changer ses
piles, le sac *chargé* ne passe pas la chatière. Le joueur ne fait le lien qu’en mourant.
C’est voulu — c’est même le cœur du jeu.

**Les épitaphes.** Chaque dénouement grave sa dalle sur un mur qui se garde d’une partie
à l’autre. Mourir n’est pas perdre : c’est compléter la collection. Il y a **16 dénouements**
— 13 morts, 2 échecs sans gravité, 1 sortie.

## Ce qu’il y a dans le fichier

`index.html`, environ 60 Ko, tout compris : CSS écrite à la main (pas de framework),
moteur en JavaScript sans dépendance, texte narratif en données.

Le moteur est un graphe de 48 nœuds. Un nœud, c’est un lieu, un titre, deux ou trois
paragraphes et des choix :

```js
chatiere: {
  lieu: "Salle des Quatre-Vents",
  titre: "La chatière",
  texte: [ "…", "…" ],
  choix: [
    { t: "S’engager pieds devant…", vers: (e) => e.sac === "lourd" ? "mort_coince" : "salle_fumigene", cout: 6 },
    { t: "S’engager tête la première…", vers: "mort_coince", cout: 6 }
  ]
}
```

- `vers` — la destination, ou une fonction de l’état quand elle dépend du sac ou du chemin.
- `cout` — la dépense de frontale. `recharge` la remet à niveau (une seule fois dans le jeu).
- `pose` — un jalon mémorisé ; `si` masque un choix selon l’état.
- Un nœud portant `fin` achève la partie : `type` (`mort`, `echec`, `victoire`), `cause`, `epitaphe`.

La progression est en `localStorage` : `kata.epitaphes`, `kata.stats`, `kata.partie`.

## Mettre en ligne

GitHub Pages, branche `main`, dossier racine. Rien à construire, rien à installer.

## Avertissement

La descente dans les carrières souterraines de Paris est interdite par l’arrêté du
2 novembre 1955 et sanctionnée d’une amende. Les dangers décrits ici sont réels — fontis,
galeries noyées, atmosphères viciées, désorientation — et bien davantage que ne le raconte
un texte. Ce jeu est une fiction : il n’enseigne aucun itinéraire, ne donne aucune entrée,
et n’invite personne à descendre.
