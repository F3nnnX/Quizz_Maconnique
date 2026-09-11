# En faire un produit — feuille de route de commercialisation

Ouvert le 11 septembre 2026, en prolongement de `PROTECTION.md`. Ce document répond à une
question précise : comment vendre l'application, légalement et sans se tirer une balle dans le
pied. Il ne remplace pas `PROTECTION.md` (qui traite de *protéger* l'oeuvre) — il enchaîne
dessus.

> **Avertissement, le même que dans `PROTECTION.md`.** Ceci rassemble des éléments pratiques et
> vérifiables, pas une consultation. Deux professionnels sont incontournables ici, et leur
> première consultation est souvent gratuite ou peu coûteuse : un **conseil INPI** pour la
> marque, et un **avocat spécialisé données personnelles / e-commerce** pour le point 4, qui
> est particulier à ce projet.

---

## L'idée directrice, si on ne retient qu'elle

**La technique (APK, application iOS) est le problème le plus facile, et le dernier.**
L'application est déjà une PWA installable qui fonctionne hors connexion : l'emballer en
application native ne demande aucune réécriture. Ce n'est pas là qu'est le travail.

Le vrai travail est, dans l'ordre : **(1) purger les droits sur le contenu**, **(2) choisir un
modèle de vente**, **(3) se donner un cadre légal pour encaisser**, **(4) éviter le piège des
données sensibles**. Les apps viennent en dernier, si la demande les justifie.

---

## 1. Le verrou absolu — les droits sur le contenu

C'est le point 2 de `PROTECTION.md`, et il commande tout : **on ne vend pas un produit qui
contient le travail d'autrui.** Tant que c'est gratuit, le risque dort ; la vente le réveille.

| Contenu | État (au 11 sept. 2026) | Ce qu'il faut avant de vendre |
|---|---|---|
| **Images** | la majorité **trouvées sur internet** (`IMAGES.md`) | les remplacer par des images créées, libres de droits, ou refaites en SVG — c'est le chantier déjà envisagé |
| **Rituel du 1er degré** | accord GLDF **en attente** (mail du 11 sept.) | autorisation écrite, ou retrait/réécriture |
| **Rituels humoristiques** | auteur inconnu | retrouver l'auteur, ou retirer |
| **Corpus de questions** | *a priori* sain | contrôle par sondage |

**Rien ne se vend tant que cette colonne n'est pas verte.** C'est ce point, et non la
technique, qui fixe la date de lancement.

---

## 2. Le modèle de distribution — web d'abord, stores plus tard

### La recommandation

**Vendre depuis le web (`lecherchant.fr`), pas depuis les app stores, du moins pour commencer.**

| Critère | App stores (Apple + Google) | Web + licence sur le site |
|---|---|---|
| Mise en place | compte Apple ~99 $/an, compte Google ~25 $, revue humaine à chaque version | le site existe déjà |
| Commission par vente | **15 à 30 %** | ~1,5 % + 0,25 € (Stripe) |
| Moyen de paiement | imposé par la boutique (iOS surtout) | libre |
| Infrastructure de licence | à créer | **la porte à code d'accès existe déjà** (`ACCES.md`) |
| Dépendance à un tiers | forte (règles, retraits, revues) | aucune |

Le système de code d'accès conçu dans `ACCES.md` **est déjà un système de licence**. Vendre un
code via Stripe sur le site, c'est réutiliser ce qui est en place : le serveur ne livre le
contenu qu'au porteur d'un code valide, et le code se paie en ligne.

### Les apps natives, ensuite

Quand le produit a fait ses preuves et qu'une présence en boutique est demandée, l'emballage
natif se fait avec **Capacitor** (ou une Trusted Web Activity côté Android) sans réécrire le
code. À ce moment-là seulement on assume les 99 $/an d'Apple, la revue, et la commission — parce
qu'alors ils se justifient par le volume.

### Le modèle de prix — pistes, à trancher

- **La voie « service » de `PROTECTION.md` § 4.2** reste la plus sûre : garder le Quiz de base
  gratuit et vendre ce qui ne se copie pas — usage institutionnel par une loge ou une obédience,
  version enrichie, accompagnement. Elle ne dépend d'aucune protection technique.
- **Le déverrouillage par degré** est déjà préparé dans le code (`DEGRE_ACTIF`,
  `questionsDuDegre`) : 1er degré accessible, 2e et 3e en supplément. Mais ces degrés
  **restent à créer et à purger de droits** — voir point 1.
- **L'achat unique** (un prix, une fois) convient à un public de niche qui n'aime pas les
  abonnements.

---

## 3. Le cadre légal pour encaisser

Vendre suppose un véhicule. Du plus simple au plus lourd :

- **Micro-entreprise (auto-entrepreneur)** : le point de départ raisonnable. Immatriculation
  gratuite, comptabilité allégée, TVA non facturée sous les seuils (franchise en base). Suffit
  très largement pour lancer.
- **Société (EURL, SASU)** : seulement si le projet grandit au point de le justifier.

Dans tous les cas, obligations minimales dès la première vente :

- **Mentions légales** et **conditions générales de vente (CGV)** sur le site ;
- **Droit de rétractation** : 14 jours en principe, mais le contenu numérique fourni
  immédiatement y échappe **si l'acheteur y renonce expressément** — la case à cocher au moment
  de l'achat est donc à prévoir dès le départ ;
- **Facturation** conforme et déclarations.

> Note reprise d'`ACCES.md` : rester **titulaire du domaine en nom propre** préserve la
> confidentialité WHOIS accordée aux personnes physiques en `.fr`. Vérifier l'effet d'une
> immatriculation sur ce point.

---

## 4. Le piège propre à ce projet — les données sensibles

**C'est le point le plus important de ce document, et le plus mal connu.**

Le RGPD (article 9) range parmi les **données sensibles** celles qui révèlent l'appartenance à
une organisation de ce type. `ACCES.md` § 2 l'avait déjà relevé pour l'accès gratuit. **La vente
aggrave le problème** : le jour où Félix facture des frères nommément, il détient une liste
associant une identité à la qualité maçonnique — précisément la donnée la plus protégée, dont
le traitement est en principe interdit sauf conditions strictes.

Ce n'est pas un détail de conformité : c'est un risque réel, et il se règle **par la
conception**, pas après coup :

- **Vendre des codes d'accès anonymes** : l'acheteur paie, reçoit un code, s'en sert — sans que
  le serveur lie jamais son identité à sa qualité de frère.
- **Laisser le prestataire de paiement porter les données de paiement** (Stripe), plutôt que de
  constituer soi-même un fichier clients.
- **Ne stocker que le strict nécessaire** : le serveur a besoin de savoir si un code est valide,
  rien de plus. Pas d'adresse, pas de journal nominatif (déjà la règle posée dans `ACCES.md`).
- **Envisager la vente par les loges** plutôt qu'aux individus : la loge achète des accès pour
  ses membres, et c'est elle, non Félix, qui connaît les noms.

**C'est le point à porter à un avocat spécialisé** avant toute vente. Il conditionne
l'architecture, donc il vient tôt.

---

## 5. La marque, avant les flyers

`PROTECTION.md` § 3 le pose : **« Le Cherchant »** est le nom arrêté, à déposer à l'INPI en
classes **9** (logiciels, applications) et **41** (formation, édition), après recherche
d'antériorité sur `data.inpi.fr`. Ordre de grandeur : ~190 € la première classe.

**Pourquoi avant les flyers, et pas après :** un flyer portant « Le Cherchant » distribué au
château est un **usage commercial public du nom**. On sécurise la marque *avant* de l'afficher à
1 500 personnes, pas après — sinon on s'expose à découvrir un tiers qui l'utilise déjà, comme
cela a failli arriver avec « Le Tuileur ».

---

## 6. La mise sur le marché — le château Saint-Antoine

Le canal est excellent : **1 500 frères passent à l'entrée**, c'est un ciblage rêvé pour un
produit de niche qu'on ne peut pas vendre par la publicité de masse. Un flyer avec un **QR code
vers `lecherchant.fr`** transforme ce passage en visites.

Trois précautions, cependant :

1. **La marque d'abord** (point 5).
2. **La relation à l'obédience.** Démarcher commercialement des frères dans un lieu maçonnique
   peut heurter la sensibilité de certains, et la GLDF — dont l'accord sur le rituel est déjà
   attendu — pourrait voir d'un oeil particulier une exploitation commerciale de contenu
   d'instruction. Mieux vaut s'assurer que la démarche est bienvenue, et idéalement adossée à un
   accord, plutôt que subie.
3. **Le contenu doit être purgé de droits** (point 1) avant qu'un seul flyer ne sorte : un
   flyer, c'est le lancement, et le lancement, c'est le réveil du risque du point 1.

---

## 7. L'ordre concret

Il prolonge le point 5 de `PROTECTION.md`, qui s'arrête à « ouvrir le chantier du service
payant ». Voici ce chantier, séquencé :

1. **Purger les droits sur le contenu** (images, rituel GLDF, rituels humoristiques) — le verrou.
2. **Déposer à l'e-Soleau** l'oeuvre purgée (point 6 de `PROTECTION.md`).
3. **Déposer la marque « Le Cherchant »** (classes 9 et 41).
4. **Consulter un avocat** sur le point 4 (données sensibles) et faire rédiger CGV + mentions
   légales + clause de rétractation.
5. **S'immatriculer** en micro-entreprise.
6. **Brancher le paiement** : Stripe sur `lecherchant.fr`, adossé au système de code d'accès
   existant. Vente de codes anonymes.
7. **Lancer, en douceur**, par les flyers au château — marque déposée, contenu purgé, cadre
   légal en place.
8. **Emballer en apps natives** seulement si la demande le réclame.

**Rien avant l'étape 1.** C'est la règle que tout le reste sert.
