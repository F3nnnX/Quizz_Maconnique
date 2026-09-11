# Composants de tiers

Inventaire de tout ce qui, dans l'application, n'a pas été écrit par Félix Casellato.
**À tenir à jour** : c'est ce document qu'on présente à un conseil, à un dépôt probatoire ou
à une boutique d'applications quand on doit prouver qu'on a le droit de distribuer.

Trois colonnes comptent : d'où ça vient, sous quelle licence, et **ce que cette licence exige
de nous**.

---

## 1. Logiciels — situation claire

| Composant | Version | Licence | Ce qu'elle exige |
|---|---|---|---|
| **jsPDF** | 2.5.1 | MIT | Conserver la notice de copyright et le texte de la licence. **Faite** : l'en-tête `@license` est intact en tête de `jspdf.umd.min.js`. |
| **Tailwind CSS** | compilé en ligne | MIT | Rien pour du CSS compilé. Une mention est de bon ton. |

La licence MIT autorise l'usage commercial, la modification et la distribution, y compris dans
une application payante. **Rien à faire de plus que de ne pas retirer les notices.**

## 2. Polices — situation claire, mais à rapatrier

| Composant | Licence | Ce qu'elle exige |
|---|---|---|
| **Inter** | SIL Open Font License 1.1 | Usage commercial autorisé. Ne pas vendre la police seule ; conserver la notice si on redistribue le fichier. |
| **Cinzel** | SIL Open Font License 1.1 | Idem. |
| **EB Garamond** | SIL Open Font License 1.1 | Idem. |

Elles sont aujourd'hui chargées depuis `fonts.googleapis.com` (voir le point 8 de SUIVI.md).
Le jour où on les intègre au fichier, **il faudra joindre le texte de l'OFL** — c'est la seule
obligation que la redistribution déclenche.

## 3. Contenus — à vérifier, et c'est ici que se trouve le risque

Cette section n'est pas une liste de problèmes constatés : c'est la liste de ce qui **n'a pas
encore été vérifié** et qui doit l'être avant toute commercialisation. Un composant logiciel
mal licencié se remplace en une journée ; un contenu mal licencié se retire, et il emporte
parfois l'intérêt du produit avec lui.

### 3.1 Le corpus de questions — *a priori sain, à confirmer*

531 questions, environ 520 Ko. Les formulations relevées sont des rédactions originales, et
les sites cités (`ledifice.net` 271 fois, Wikipédia 137 fois, `gldf1474.fr` 33 fois,
`jepense.org` 25 fois, `cairn.info` 4 fois) le sont en **liens de référence**, pas en citations.

- **Un lien ne pose aucun problème** : il n'y a pas de reproduction.
- **Ce qui reste à confirmer** : qu'aucune explication ne reprend mot pour mot un paragraphe
  d'un de ces sites. Une reprise ponctuelle et courte, citée, relève de la courte citation ;
  une reprise longue, non. **À contrôler avant de vendre**, pas avant de publier.

### 3.2 Le rituel du 1er degré — *le point le plus sensible*

Environ 28 Ko de texte rituel REAA dans l'écran de lecture.

Les rituels maçonniques posent deux questions distinctes, et il faut les traiter séparément :

- **La question du droit d'auteur.** Un rituel ancien, tombé dans le domaine public, est libre
  de droits. Mais **une édition moderne — celle d'une obédience, avec sa mise en forme, ses
  notes, ses choix de rédaction — est une œuvre protégée.** Si le texte a été transcrit depuis
  un rituel imprimé par la GLDF, il faut l'autorisation de la GLDF pour le diffuser, et à plus
  forte raison pour le vendre.
- **La question maçonnique.** Elle est distincte et elle appartient à Félix : diffuser un
  rituel, même gratuitement, même entre frères, relève d'un usage que l'obédience encadre.
  Le vendre est une autre affaire encore.

**C'est le premier point à trancher**, avant même l'INPI — parce qu'il peut obliger à refaire
l'écran autrement (par exemple en résumé rédigé plutôt qu'en texte intégral).

**Félix a écrit à la GLDF le 11 septembre 2026 et attend la réponse.**

Une remarque faite à cette occasion mérite d'être consignée, parce qu'elle revient toujours :
*le rituel est disponible gratuitement sur plusieurs sites*. C'est exact, et cela ne change
rien au droit. **Être librement accessible n'est pas être libre de droits** : un texte mis en
ligne sans autorisation reste protégé, et le reproduire à son tour ne devient pas licite parce
que d'autres l'ont fait avant. Le seul effet réel de cette large diffusion est pratique — elle
rend une réclamation moins probable — et il ne se transforme pas en droit le jour où l'on
vend. D'où la démarche auprès de la GLDF, qui reste la bonne.

### 3.3 Les rituels humoristiques — *provenance à établir*

Quatre rituels, environ 38 Ko, intégrés en août 2026 depuis des PDF fournis. **Leur auteur
n'est pas identifié dans le dépôt.** Un texte humoristique qui circule entre loges reste
l'œuvre de quelqu'un, et le fait qu'il circule librement n'emporte pas le droit de le vendre.

À faire : retrouver l'origine de chacun des quatre, et, à défaut d'auteur identifiable,
décider s'ils restent dans une version gratuite et sortent de la version payante.

### 3.4 Les images — *inventaire dressé le 11 septembre 2026, origines à renseigner*

36 occurrences pour **33 images distinctes**, 1,01 Mo de données brutes, environ 1,34 Mo une
fois encodées en base64 — plus de la moitié du poids du fichier.

**L'inventaire complet est dans `IMAGES.md`** : chaque image y est identifiée, mesurée et
rattachée à son écran. Elles se répartissent en trois séries, ce qui simplifie beaucoup le
travail — les 11 bijoux d'officiers et les 16 symboles du tableau forment chacun un ensemble
homogène, et **une seule réponse réglera vraisemblablement chaque série**.

Reste à établir, pour chacune, si elle a été **créée par Félix**, **générée**, ou **trouvée**.
Seul Félix peut le faire : l'origine ne se déduit pas du fichier.

**Trois réponses obtenues le 11 septembre 2026, et elles changent le tableau :**

- **La porte du Temple** (image 04, écran d'entrée) a été **trouvée sur internet**. C'est une
  photographie moderne, donc l'œuvre d'un photographe, et c'est **le premier écran que voit
  tout visiteur**. Une photographie se retrouve en quelques secondes par recherche d'image
  inversée. **À remplacer en priorité** — et le remplacement existe peut-être déjà, Félix ayant
  un dossier « Photo porte Temple » dans son Drive.
- **Le tableau de loge** (image 05) a lui aussi été **trouvé sur internet**. Son sort dépend de
  son âge : la reproduction fidèle d'une planche ancienne suit le domaine public, un redessin
  moderne est protégé. À vérifier. C'est du dessin au trait, donc la plus facile à refaire.
- **Le sceau de la loge** (image 02) vient de Philadelphia n°1604. Ici le problème n'est pas le
  droit d'auteur mais **l'identité** : un sceau de loge sur un produit vendu laisse entendre
  que la loge est derrière. Félix l'a vu de lui-même et prévoit de le retirer le jour venu.

**Les 27 images des deux séries viennent d'internet elles aussi** (réponse du 11 septembre
2026), et leur qualité est médiocre. **Vingt-neuf images sur trente-trois sont donc à
remplacer avant toute commercialisation.**

Ce n'est pas un blocage immédiat : rien ne presse tant que l'outil est gratuit et
confidentiel. Mais c'est le point qui, le jour de la vente, peut coûter plus cher que ce que
la vente rapporte — et c'est donc lui qui fixe le calendrier, pas l'inverse.

Félix propose de les redessiner avec l'aide de Claude Design. C'est la bonne réponse, et pas
seulement pour le droit : ces images font 46 à 112 pixels de large et sont floues sur un écran
moderne, elles pèsent 774 Ko à elles seules, et vingt-sept images glanées à vingt-sept endroits
n'ont aucune unité de trait. Redessinées en SVG, elles seraient plus légères, nettes à tous les
zooms, et donneraient au produit une identité graphique qu'il n'a pas encore.

Le détail, image par image, est dans `IMAGES.md`.

---

## 4. Un service tiers appelé à chaque visite

Découvert le 11 septembre 2026 en instrumentant le navigateur : l'application **envoie une
requête à `script.google.com` à chaque ouverture** et à chaque quiz terminé. C'est le Google
Apps Script qui alimente le tableur « Stats Quizz Maçonnique » de Félix.

C'est donc une **seconde dépendance externe**, après `fonts.googleapis.com` — et il vaut mieux
l'avoir écrite ici que la redécouvrir le jour d'un audit.

**La bonne nouvelle : la collecte est irréprochable telle qu'elle est.** Ce qui part, c'est
`{ type: 'visite', date, token }` et le score par thème. Aucun identifiant de personne, aucun
cookie, aucun traceur — le jeton est **le même pour tout le monde**, il ne distingue pas les
visiteurs. Impossible de reconstituer qui a fait quoi. Pour un futur produit commercial, c'est
une position de départ enviable : un comptage réellement anonyme, à conserver tel quel.

**Le point à corriger un jour :** ce jeton partagé est écrit en clair dans un dépôt public, et
l'adresse du script aussi. Il ne protège donc rien — n'importe qui peut lire le code et envoyer
ce qu'il veut à l'adresse. Le risque n'est pas une fuite, puisqu'il n'y a rien de personnel à
fuir : c'est la pollution des statistiques de Félix. À traiter quand le VPS existera, en
faisant passer l'appel par lui.

Un dernier détail à connaître : cet appel échoue silencieusement hors connexion
(`mode: 'no-cors'`, `.catch(() => {})`). Rien ne casse, mais les visites hors connexion ne sont
pas comptées.

## 5. Ce que ce document ne couvre pas

**Le concours d'un assistant d'intelligence artificielle.** Une part substantielle du code de
cette application a été écrite par Claude (Anthropic), sur la direction de Félix Casellato :
c'est lui qui a défini le produit, fourni et validé le corpus, arbitré la doctrine, relevé les
défauts et décidé de chaque version.

Ce n'est pas un problème de licence — les conditions d'Anthropic n'opposent aucune revendication
sur le code produit — mais c'en est un de **qualification**. Le droit d'auteur français protège
les œuvres portant « l'empreinte de la personnalité » de leur auteur, laquelle suppose une
personne humaine. La question de savoir ce qui, dans un fichier écrit à deux mains de cette
manière, est protégeable et au nom de qui, n'a pas de réponse établie à ce jour.

**À signaler spontanément** au conseil en propriété industrielle ou à l'avocat consulté, et à
l'organisme de dépôt. Le taire ne protège de rien et fragilise tout.
