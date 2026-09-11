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

### 3.3 Les rituels humoristiques — *provenance à établir*

Quatre rituels, environ 38 Ko, intégrés en août 2026 depuis des PDF fournis. **Leur auteur
n'est pas identifié dans le dépôt.** Un texte humoristique qui circule entre loges reste
l'œuvre de quelqu'un, et le fait qu'il circule librement n'emporte pas le droit de le vendre.

À faire : retrouver l'origine de chacun des quatre, et, à défaut d'auteur identifiable,
décider s'ils restent dans une version gratuite et sortent de la version payante.

### 3.4 Les images — *36 fichiers, 1,34 Mo, origine non documentée*

24 PNG et 12 JPEG encodés en base64 dans `index.html` — plus de la moitié du poids du fichier.
Le dépôt ne dit nulle part d'où elles viennent.

À faire : pour chacune, établir si elle a été **créée par Félix**, **générée**, ou **trouvée**.
Une image trouvée sur internet est le cas le plus fréquent et le plus dangereux : c'est le
motif de réclamation le plus simple à détecter automatiquement et le plus couramment poursuivi.

---

## 4. Ce que ce document ne couvre pas

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
