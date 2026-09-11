# Tableau de Loge en SVG — travail mis de côté

Première tentative de remplacement du fond JPEG de l'écran Tableau de Loge (image 05 de
`IMAGES.md`, trouvée sur internet).

**Verdict de Félix, 11 septembre 2026 : « ça ne va pas spécialement, mais on verra cela dans un
second temps, c'est pas urgent ».** Le travail est donc rangé ici plutôt que jeté, et
**il n'est pas intégré à `index.html`** — l'application sert toujours le JPEG.

## Ce qu'il y a

| Fichier | Rôle |
|---|---|
| `modele.svg` | Le dessin, avec `__HOUPPE__` et `__PAVE__` en attente |
| `generer.py` | Remplit les deux et écrit `tableau.svg` |
| `tableau.svg` | Le résultat, 14 046 octets |
| `tableau-500.png` | Rendu à la taille réelle du canevas |
| `tableau-reperes.png` | Le même, avec les 22 points chauds en cadres rouges |

## Ce qui est acquis et qu'il ne faut pas refaire

**La contrainte des points chauds.** Le canevas fait 500 × 719 et `#tb-hotspots` pose 22 boutons
à des coordonnées fixes. Tout remplacement du fond doit placer chaque symbole sous le sien,
sinon on touche la lune et on ouvre le soleil. `tableau-reperes.png` prouve que cette version-ci
tombe juste — c'est la partie fastidieuse du travail, et elle est faite.

**Les trois partis pris tenus :**

1. Le fronton repose sur les colonnes. Sur le JPEG d'origine il flotte au-dessus du vide.
2. La houppe dentelée est une corde à lacs d'amour, dont chaque boucle se croise. C'est le
   croisement qui fait lire « cordage » plutôt que « guirlande de festons » — d'où le
   générateur, qui calcule le pas pour qu'il tombe juste dans chaque côté.
3. Le soleil et la lune n'ont pas de visage. Avec, ça faisait dessin animé.

**Les chiffres.** Le JPEG pèse 13 071 octets, soit 17 428 une fois encodé en base64 dans
`index.html`. Le SVG s'écrit tel quel : 3 382 octets de moins, et net à tous les niveaux de
zoom — ce qui compte, l'écran ayant des boutons +/−.

## Ce qui n'allait pas, et les pistes

Félix n'a pas détaillé. Ce que je voyais moi-même :

- **la corde du bas traverse le pavé mosaïque.** Dessinée derrière, ses boucles disparaissaient
  à moitié et il n'en dépassait que les pointes — on lisait une frange. Devant, c'est lisible
  mais chargé à cet endroit. Piste : remonter le pavé, ou interrompre la corde sous lui ;
- **les éclats de la pierre brute** sont arbitraires ;
- **le milieu gauche est vide** — l'original l'est aussi, mais on pourrait y descendre un outil.

Piste de fond, si on reprend : ce dessin imite l'original. On pourrait plutôt **repartir de
l'iconographie et composer librement**, puisque les points chauds sont les seules contraintes
réelles et qu'ils laissent de la marge.

## Pour reprendre

```
python3 generer.py     # depuis ce dossier, réécrit tableau.svg
```

Rendu et vérification des points chauds : ouvrir `tableau.svg` dans un navigateur, ou reprendre
le script de rendu décrit dans le journal de `SUIVI.md` au 11 septembre 2026.
