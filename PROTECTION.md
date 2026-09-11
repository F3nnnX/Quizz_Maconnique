# Protéger le Quiz, et en faire un produit

Feuille de route ouverte le 11 septembre 2026, après qu'un frère eut alerté Félix sur le risque
de se faire déposséder de son travail.

Ce document sépare volontairement **ce qui est déjà acquis**, **ce qui est urgent**, et **ce qui
attendra**. L'urgence réelle n'est pas celle qu'on croit, et une des idées reçues les plus
répandues sur ce sujet coûte de l'argent pour rien.

> **Avertissement.** Ce qui suit rassemble des éléments pratiques et vérifiables, pas une
> consultation juridique. Pour le dépôt lui-même et pour tout ce qui touche à la
> commercialisation, un conseil en propriété industrielle ou un avocat spécialisé doit
> confirmer — la première consultation est souvent gratuite à l'INPI.

---

## 0. Ce qui est déjà vrai, et qu'il faut savoir avant tout le reste

**Le code est protégé depuis le jour où il a été écrit.** En droit français, le logiciel est une
œuvre de l'esprit (art. L112-2 13° du code de la propriété intellectuelle) et la protection
naît **de la création, sans aucune formalité**. Il n'y a pas de registre à alimenter pour
devenir titulaire de ses droits : Félix l'est déjà.

**Ce qu'un dépôt apporte n'est donc pas le droit, c'est la preuve.** Preuve de contenu et
preuve de date. C'est utile — c'est même ce qui fait gagner un procès — mais ce n'est pas la
même chose, et la nuance change l'ordre des priorités.

**Un logiciel ne se brevette pas** en France ni en Europe (art. L611-10 CPI). Si quelqu'un
propose de « breveter l'application », c'est une erreur.

**L'historique git est déjà une preuve sérieuse.** 54 commits depuis le 27 juillet 2026,
horodatés par GitHub, montrant la construction progressive de l'œuvre. C'est plus convaincant
qu'un dépôt isolé, parce qu'un voleur ne peut pas fabriquer un historique de deux mois. **Il
faut le conserver précieusement** — une archive complète, `.git` compris, hors de GitHub.

---

## 1. URGENT — cette semaine

### 1.1 Décider si le dépôt reste public

C'est **la décision la plus lourde et la seule qui soit vraiment urgente**, parce que chaque
jour de publication augmente la diffusion.

État constaté le 11 septembre 2026 : le dépôt est **public**, avec **0 fork et 0 étoile**.
Personne ne l'a copié sur GitHub à ce jour. C'est une bonne nouvelle, et elle ne durera pas
forcément maintenant que le lien circule.

Le passage en privé a **un coût technique qu'il faut connaître** : GitHub Pages ne publie pas
de site depuis un dépôt privé sur un compte gratuit. Passer le dépôt en privé **éteint le
site**, sauf à prendre un abonnement GitHub Pro (environ 4 $ par mois) ou à héberger ailleurs.

| Option | Effet | Coût |
|---|---|---|
| Laisser public | Le site vit. Le code source est lisible et clonable par tous. | 0 |
| Privé + GitHub Pro | Le site vit, le code n'est plus lisible. | ~4 $/mois |
| Privé sans Pro | Le code n'est plus lisible, **le site s'éteint**. | 0 |

**À savoir avant de choisir : le passage en privé ne cache pas l'application.** Elle est
entièrement en HTML et JavaScript exécutés dans le navigateur du visiteur. Tout ce que le site
sert est, par construction, lisible par qui le visite : un clic droit, « afficher le code
source », et les 2,3 Mo sont là. **Fermer le dépôt ferme la porte, pas la fenêtre.** Voir le
point 4.

### 1.2 Poser la réserve de droits — *fait le 11 septembre 2026*

Un dépôt public sans fichier de licence est ambigu pour qui le lit : beaucoup croient, à tort,
que « public sur GitHub » veut dire « libre de droits ». Un fichier `LICENSE` explicite lève
l'ambiguïté et rend toute reprise indéfendable de bonne foi.

C'est fait : `LICENSE` réserve tous les droits, nomme ce qui est interdit, et renvoie à
`TIERS.md` pour les composants qui ne sont pas de Félix.

### 1.3 Constituer le dossier de dépôt — *outil livré le 11 septembre 2026*

`outils/empreinte.py` produit `EMPREINTE.txt` : la date, le commit, le nombre de commits, et
l'empreinte SHA-256 de chaque fichier, résumées en **une empreinte globale unique**. Ce fichier
est ce qu'on joint à un dépôt probatoire, et il permet à n'importe qui, plus tard, de vérifier
qu'une copie retrouvée dans la nature est bien celle-là.

Pour le régénérer après une modification :

```
python3 outils/empreinte.py > EMPREINTE.txt
```

**Une limite à connaître, et elle est dans la nature des choses** : `EMPREINTE.txt` ne peut pas
contenir l'empreinte du commit qui le contient, puisque celle-ci dépend de son propre contenu.
La ligne « État décrit » désigne donc l'état mesuré, et le commit qui enregistre le fichier en
est l'enfant immédiat. **Le manifeste, lui, reste exact dans les deux** — c'est lui qui compte,
et il se vérifie fichier par fichier.

Pour un dépôt probatoire, la pièce de référence n'est d'ailleurs pas le fichier dans le dépôt
mais **l'archive ZIP et son propre SHA-256** : elle fige tout d'un coup, fichier d'empreinte
compris, et ne souffre pas de cette circularité.

### 1.4 Choisir la voie du dépôt probatoire

Trois voies, par ordre de coût croissant. **Elles ne donnent aucun droit supplémentaire** : elles
donnent une date opposable.

| Voie | Ce que c'est | Ordre de grandeur | Pour qui |
|---|---|---|---|
| **e-Soleau (INPI)** | Enveloppe numérique horodatée, conservée par l'INPI. On y dépose l'archive et `EMPREINTE.txt`. | quelques dizaines d'euros, pour 5 ans renouvelables | Le meilleur rapport simplicité/prix pour commencer. **C'est ce que je recommande de faire en premier.** |
| **APP** (Agence pour la Protection des Programmes) | L'organisme de référence pour le logiciel en France. Dépôt avec numéro d'inscription au registre IDDN. | nettement plus cher, cotisation annuelle | Quand le produit devient commercial et qu'on veut la référence reconnue du secteur. |
| **Huissier / notaire** | Constat ou dépôt de l'archive sous scellé. | variable, généralement le plus cher | Si un litige est déjà en vue. |

Vérifier les tarifs en vigueur sur `inpi.fr` et `app.asso.fr` : ils changent.

**Ne pas déposer avant d'avoir lu le point 2.** Déposer un contenu dont on n'a pas les droits
n'a aucun intérêt, et déclarer une paternité qu'on n'a pas est un problème en soi.

---

## 2. URGENT AUSSI, et personne ne l'a signalé — ce que contient le fichier

Le conseil reçu portait sur le vol. Le risque symétrique, au moins aussi probable dès qu'il y
a de l'argent, c'est **la réclamation d'un tiers dont l'application contient le travail**.

Tant que l'outil est gratuit et confidentiel, ce risque dort. **Le jour où il devient payant,
il se réveille**, et il peut coûter beaucoup plus cher que le vol redouté.

L'inventaire complet est dans **`TIERS.md`**. En résumé, quatre points à vérifier, du plus
sensible au moins :

1. **Le rituel du 1er degré** (28 Ko de texte). Une édition moderne de rituel, publiée par une
   obédience, est une œuvre protégée. S'il a été transcrit depuis un rituel imprimé de la GLDF,
   sa diffusion relève de l'autorisation de la GLDF — et sa vente, à plus forte raison.
   S'y ajoute une question proprement maçonnique, qui n'est pas juridique et qui appartient à
   Félix.
2. **Les quatre rituels humoristiques** : auteur inconnu. Un texte qui circule entre loges reste
   l'œuvre de quelqu'un.
3. **Les 36 images** encodées dans le fichier, 1,34 Mo : origine non documentée. C'est le motif
   de réclamation le plus facile à détecter automatiquement et le plus couramment poursuivi.
4. **Le corpus de questions** : *a priori* sain — les formulations sont originales et les sites
   cités le sont en liens, pas en citations. À contrôler par sondage avant de vendre.

**Rien de tout cela n'empêche de déposer le code à l'INPI.** Mais tout cela empêche de vendre
avant vérification.

---

## 3. La marque — quand le produit aura un nom définitif

C'est le seul dépôt INPI qui crée réellement un droit nouveau : le monopole sur un nom dans un
domaine donné.

- Vérifier d'abord la disponibilité dans la base des marques de l'INPI, et vérifier aussi le
  nom de domaine.
- Déposer en classes 9 (logiciels, applications) et 41 (formation, édition) selon l'usage visé.
- Ordre de grandeur : environ 190 € pour une classe, une centaine d'euros par classe
  supplémentaire, protection dix ans renouvelable.

**À faire au moment où le nom est arrêté**, pas avant : déposer « Le Quiz Maçonnique » puis
lancer le produit sous un autre nom, c'est payer deux fois.

**Le nom est arrêté depuis le 11 septembre 2026 : « Le Cherchant »**, sous réserve de la
recherche d'antériorité sur `data.inpi.fr`. Le raisonnement et les deux noms écartés sont dans
`PASSATION.md`. Une leçon en est tirée et vaut pour tout nom futur : **vérifier la
disponibilité du domaine et la base des marques avant de s'attacher à un nom**, et non après.
« Le Tuileur » a été retenu une demi-heure avant qu'on ne découvre une boutique maçonnique
active sous ce nom.

---

## 4. Le mot de passe et l'application payante — ce qui marche et ce qui n'y fait rien

### 4.1 Un mot de passe sur le site actuel ne protège rien

Le conseil de « protéger par mot de passe » part d'une intuition juste mais se heurte à la
nature de l'application : **tout est exécuté dans le navigateur du visiteur**. Un mot de passe
écrit dans la page est lisible dans la page. Le contenu qu'il est censé garder est déjà dans le
fichier que le navigateur a téléchargé.

Ce n'est pas une question de savoir-faire : **aucune protection du côté du navigateur ne résiste
à quelqu'un qui sait ouvrir les outils de développement.** C'est vrai de toutes les applications
web du monde.

### 4.2 Ce qui protège réellement, et ce que ça implique

Faire payer suppose que **le contenu vendu ne soit pas livré tant qu'il n'est pas payé**. Cela
suppose un serveur : le contenu y reste, l'application le demande, le serveur vérifie le compte
avant de répondre.

C'est un vrai changement de nature du projet. L'application d'un seul fichier, qu'on ouvre et
qui marche, devient un service avec des comptes, un hébergement, une base de données, des
sauvegardes, et les obligations qui vont avec — RGPD, conditions générales, mentions légales.
Ce n'est pas hors de portée, mais ce n'est plus le même travail.

**Une voie intermédiaire honnête** mérite d'être considérée : garder le Quiz gratuit et ouvert,
et **vendre ce qui ne se copie pas** — l'accompagnement, une version enrichie destinée aux
loges, les mises à jour, un usage institutionnel par une obédience. Beaucoup de projets
d'instruction vivent ainsi, et cette voie a l'avantage de ne pas dépendre d'une protection
technique qui, de toute façon, n'existe pas.

### 4.3 Le passage en application Android et iOS

Techniquement, ce n'est pas le plus dur : une application web d'un seul fichier s'emballe en
application native sans réécriture (Capacitor, ou une Trusted Web Activity côté Android). Le
code actuel est prêt — il est déjà installable et fonctionne hors connexion depuis la V2.3.0.

Ce qui coûte, ce n'est pas l'emballage, c'est le reste :

- **compte développeur Apple** : environ 99 $ par an, obligatoire, et un examen humain à chaque
  publication ;
- **compte développeur Google** : environ 25 $ une fois ;
- **la commission des boutiques** sur chaque vente (de l'ordre de 15 à 30 % selon le chiffre) ;
- **le paiement obligatoirement passé par la boutique** pour du contenu numérique, sur iOS en
  particulier ;
- **le statut** : vendre suppose d'être immatriculé — micro-entreprise au minimum — de facturer,
  de déclarer, et de tenir des conditions générales de vente.

Rien d'insurmontable. Mais c'est un projet d'entreprise, pas une étape de développement, et il
vient **après** les points 1 et 2, pas avant.

---

## 5. Dans quel ordre, concrètement

1. **Décider public ou privé** — arbitrage de Félix, aucune action possible sans lui.
2. ~~Poser `LICENSE` et `TIERS.md`~~ — fait le 11 septembre 2026.
3. ~~Livrer l'outil d'empreinte~~ — fait le 11 septembre 2026.
4. **Archiver l'historique git complet hors GitHub** — une copie du dépôt avec son `.git`, sur
   un disque et dans un stockage distant. C'est la meilleure preuve disponible et elle
   disparaîtrait avec le compte GitHub.
5. ~~Trancher la question du rituel~~ — **mail envoyé à la GLDF le 11 septembre 2026**,
   réponse en attente. C'est le seul point qui peut obliger à modifier le produit.
6. **Déposer à l'e-Soleau** une fois le point 5 tranché.
7. Documenter l'origine des images — **l'inventaire est dressé (`IMAGES.md`), il ne reste
   qu'une colonne à remplir** — et retrouver les auteurs des rituels humoristiques.
8. Consulter l'INPI — rendez-vous gratuit — en apportant `EMPREINTE.txt`, `TIERS.md` et ce
   document. **Signaler spontanément le concours de l'IA** (voir la section 4 de `TIERS.md`) :
   le taire ne protège de rien.
9. Choisir le nom définitif, puis déposer la marque.
10. Alors seulement, ouvrir le chantier du service payant et des applications.

---

## 6. Ce qu'il faut retenir si on ne retient qu'une chose

Le travail est **déjà** protégé, et l'historique git en est **déjà** la preuve. Il n'y a donc
pas d'urgence à dépenser de l'argent — il y a une urgence à décider si le code reste lisible
par tous, et à savoir exactement ce que le fichier contient avant d'en faire commerce.
