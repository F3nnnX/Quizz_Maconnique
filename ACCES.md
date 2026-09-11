# Restreindre l'accès — l'idée retenue

Décision de Félix, 11 septembre 2026. **Rien n'est engagé** : cette page archive le principe
pour qu'il ne se perde pas, et signale ce qu'il faudra regarder le jour où on le mettra en
œuvre. À relire avant d'écrire la moindre ligne.

## Le principe

Un mot de passe à l'entrée du site, avec **un code par frère** plutôt qu'un code commun.
Forme retenue : `prenom_Quizz_Maconnique`. Félix en génère autant qu'il y a de frères dans sa
loge et les distribue lui-même.

Durée d'usage à définir : à vie, ou quelques mois renouvelables.

## Pourquoi ça ne marche que sur un serveur

Sur GitHub Pages, une porte de ce genre ne protège rien : tout est exécuté dans le navigateur
du visiteur, donc tout lui a déjà été livré avant qu'il ne tape quoi que ce soit. Un mot de
passe écrit dans la page est lisible dans la page.

**Cette idée suppose donc le VPS**, qui est justement l'étape suivante du plan de Félix : le
contenu reste sur le serveur, l'application le demande, le serveur vérifie le code avant de
répondre. C'est le seul montage où la porte est une vraie porte.

## Trois points à regarder le jour venu

### 1. Le format du code est devinable

`prenom_Quizz_Maconnique` suit une règle publique. Qui connaît un seul code connaît la règle,
et il suffit alors d'une liste de prénoms pour en forger d'autres — et les prénoms des frères
d'une loge ne sont pas un secret bien gardé.

Ce n'est pas rédhibitoire pour un usage entre frères, où l'on cherche une porte, pas un
coffre-fort. Mais il y a moins cher que de renoncer : **ajouter quelques caractères
imprévisibles** à la fin — `felix_Quizz_Maconnique_7K2P` — garde le code lisible, reconnaissable
par son porteur, et le rend impossible à deviner. Même effort de distribution, même confort,
un cran de sérieux en plus.

### 2. Le code porte le prénom, donc l'identité

C'était le point soulevé le 11 septembre : constituer une liste nominative de francs-maçons
n'est pas anodin. Le RGPD range les données révélant l'appartenance à ce type d'organisation
parmi les **données sensibles**, avec des obligations plus lourdes ; et l'histoire, en France,
contient des épisodes où de telles listes ont servi contre ceux qu'elles nommaient.

Le format choisi met le prénom **dans le code lui-même**. Le serveur qui les vérifie détiendra
donc, de fait, une liste de prénoms de frères de la loge.

Félix a tranché en connaissance de cause, et c'est son appel : une liste de prénoms seuls,
sans nom de famille ni adresse, pour une loge qu'il connaît, ne présente pas le même risque
qu'un fichier d'adresses mail. **Le noter ici pour que la décision reste consciente si le
projet grandit** — le jour où il y aura mille frères de dix loges, la question se reposera
autrement.

Le garde-fou minimal, quelle que soit la forme : **ne rien stocker d'autre**. Pas d'adresse
mail à côté, pas de journal de connexion nominatif, pas de statistiques par personne. Le
serveur a besoin de savoir si un code est valide — rien de plus.

### 3. Ce qu'il faut prévoir dès la première version

- **Pouvoir révoquer un code** qui aurait circulé, sans toucher aux autres.
- **Limiter les tentatives** : sans quoi on essaie tous les prénoms du calendrier en une nuit.
- **Une date d'expiration par code**, même si elle est lointaine. L'ajouter après coup oblige
  à tout redistribuer.
- **Ne pas mélanger** ce fichier de codes avec quoi que ce soit d'autre.

## Ce qui a été écarté, et pourquoi le noter

Le plan initial prévoyait une inscription par mail, chaque frère recevant son code en échange
de son adresse. Écarté : cela revenait à constituer un fichier associant une adresse mail
nominative à une qualité maçonnique, c'est-à-dire précisément la donnée sensible décrite
plus haut.

La distribution de la main à la main obtient le même résultat sans créer ce fichier. **Si
l'idée du mail revient un jour** — pour prévenir d'une mise à jour, par exemple — la garder
strictement séparée : deux fichiers qui ne se parlent pas, et une adresse donnée volontairement,
sans lien avec le code.
