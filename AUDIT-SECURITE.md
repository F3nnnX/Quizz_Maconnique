# Audit de sécurité — 11 septembre 2026

Conduit après la migration sur le VPS et la pose de l'accès réservé, avec le skill
[`agamm/claude-code-owasp`](https://github.com/agamm/claude-code-owasp) (MIT), installé **hors
du dépôt**, dans `~/.claude/skills/` — il outille la machine, il n'est pas un composant du
produit et n'a donc pas à entrer dans `TIERS.md`.

**La règle suivie, et elle explique la forme de ce document :** un motif trouvé n'est pas une
faille. Avant d'inscrire quoi que ce soit ici, trois questions — l'entrée est-elle réellement
contrôlable par un attaquant, le point vulnérable est-il atteignable, et que gagne-t-il s'il y
parvient. Les CVE présentes mais inatteignables sont signalées **comme telles**, plutôt que de
gonfler un décompte.

---

## Ce qui demande une action

### 1. La clé SSH n'a pas de phrase de passe — *grave*

`~/.ssh/fts_ed25519`, sur la machine de Félix, est stockée **en clair**. Le compte `ubuntu`
qu'elle ouvre a `sudo` **sans mot de passe**.

Qui obtient une copie du profil Windows de Félix — logiciel malveillant, portable volé,
sauvegarde synchronisée vers un service tiers — obtient **root immédiatement** sur le VPS.

C'est le point le plus grave de cet audit, et pas seulement pour Félix : **le dommage traverse
une frontière de confiance**, le serveur hébergeant aussi la production d'un tiers.

Correctif, dix secondes : `ssh-keygen -p -f ~/.ssh/fts_ed25519`. Puis `ssh-add` pour ne pas
avoir à la ressaisir à chaque connexion.

### 2. Le jeton d'analytique ne protège rien — *moyen*

`ANALYTICS_TOKEN` (32 caractères) est écrit dans `index.html`, **donc servi à chaque
visiteur**, et il est dans l'historique git d'un dépôt public. N'importe qui peut forger des
requêtes vers le point de collecte Apps Script.

**Portée réelle, vérifiée :** une lecture simple du point de collecte ne renvoie qu'une page
Google — pas de fuite de données. L'atteinte se limite à **l'écriture** : polluer le tableur de
statistiques de Félix. Aucune donnée personnelle n'est en jeu, la collecte étant anonyme
(voir `TIERS.md`).

**Changer le jeton ne corrigerait rien** : le nouveau serait servi dans la page comme l'ancien.
Le seul correctif est celui qu'anticipait `PASSATION.md` § 5 — faire passer l'appel par le VPS,
qui garde le secret et relaie. Cela touche `index.html` : à coordonner avec la session Desktop.

### 3. Onze mises à jour de sécurité en attente — *moyen*

`unattended-upgrades` est actif et aucun redémarrage n'est requis, mais onze paquets de
sécurité restent à appliquer. À passer en revue avec le propriétaire du serveur — ce n'est pas
une machine dont Félix est seul maître.

### 4. L'accès réservé : partagé, devinable, non révocable — *connu, tranché*

Rien de neuf : c'est la décision de Félix, documentée en tête d'`ACCES.md` avec ses limites.
Deux précisions qu'apporte ASVS 5.0 :

- **L'authentification Basic n'a pas de déconnexion.** Le navigateur garde le code jusqu'à sa
  fermeture ; l'exigence « session inutilisable après déconnexion » (7.4.1) est hors d'atteinte
  avec ce mécanisme. Un cookie de session la satisferait.
- L'exigence d'anti-automatisation (6.3.1) est **couverte** par la limitation de débit posée en
  même temps que la porte.

### 5. Ce dépôt public décrit l'infrastructure d'un tiers — *faible*

`deploiement/LISEZ-MOI.md` nomme les deux sites voisins et décrit le montage qui les sert.
L'hébergement lui-même se déduit du DNS, ce n'est donc pas un secret ; la disposition interne,
elle, ne s'en déduit pas. Le passage du dépôt en privé, déjà prévu, referme le sujet — mais il
valait d'être noté plutôt que découvert.

---

## Ce qui est vérifié sain

### L'application n'a aucun vecteur d'injection

C'est le résultat le plus net de l'audit, et il tient à une mesure :

| Source d'entrée contrôlable par un attaquant | Occurrences |
|---|---|
| `location.search`, `location.hash`, `URLSearchParams` | **0** |
| `postMessage`, `document.referrer`, `window.name` | **0** |

Il y a 35 `innerHTML` dans `index.html`, mais **aucune donnée extérieure ne peut les
atteindre** : ils ne sont alimentés que par les constantes du fichier et par `localStorage`,
que seule l'application écrit. Il n'y a ni `eval`, ni `new Function`, ni `document.write`, ni
`insertAdjacentHTML`.

Les quatre appels réseau sont en `mode: 'no-cors'`, sans lecture de la réponse et avec un
`.catch()` vide : **il n'existe pas de chemin du réseau vers le DOM.**

### Les CVE de jsPDF 2.5.1 ne sont pas atteignables

La version embarquée est concernée par CVE-2025-29907 (déni de service par expression
régulière) et CVE-2025-68428 (lecture de fichiers arbitraires).

**Ni l'une ni l'autre ne s'applique ici**, et c'est vérifiable en une mesure : les méthodes
vulnérables sont `addImage`, `addSvgAsImage`, `addMetadata` et `html()` ; l'application les
appelle **zéro fois**. Elle n'utilise que `setFont` et `text()`. Quant à CVE-2025-68428, elle
vise les déploiements Node — jsPDF ne s'exécute ici que dans le navigateur.

Mettre à jour reste de bonne hygiène et supprimerait la question, mais **ce n'est pas urgent**,
et cela obligerait à mettre `TIERS.md` à jour.

### L'infrastructure est sérieusement durcie

Rien de ceci n'est le fait de la migration : c'était déjà en place.

| Contrôle | État |
|---|---|
| `ufw` | seuls 22, 80 et 443 ouverts ; `INPUT` en `DROP` par défaut |
| Chaîne `DOCKER-USER` | **câblée sur ufw** — le piège classique où Docker court-circuite le pare-feu est traité |
| Coolify (8000), API Traefik (8080), temps réel (6001-6002) | écoutent sur `0.0.0.0` mais **injoignables depuis Internet**, vérifié depuis l'extérieur |
| SSH | clé publique seule, mot de passe refusé, root interdit, `fail2ban` actif |
| TLS | **1.2 et 1.3 uniquement** ; 1.0 et 1.1 refusés |
| Socket Docker sur Traefik | monté **en lecture seule** |
| Base de données du voisin | aucun port publié, réseau séparé |

### Le cloisonnement protège Félix de son voisin

Question qui méritait d'être posée : que coûterait à Félix la compromission du site voisin ?

Les deux ne partagent **aucun réseau Docker**. Le WordPress et sa base vivent sur un réseau
dédié, que seul le proxy traverse. Une compromission de ce site **n'atteint pas directement**
le conteneur de Félix : il faudrait d'abord pivoter par Traefik.

En revanche, le conteneur de Félix est sur le réseau `coolify`, avec la base de Coolify. C'est
la contrepartie, et elle est acceptable : ce conteneur ne sert que des fichiers statiques, en
lecture seule, sans code exécuté côté serveur — la surface est minuscule.

### Le montage du site tient ce qu'il promet

- La racine web est **réellement en lecture seule** depuis le conteneur — vérifié en tentant
  d'y écrire.
- Les processus de travail de nginx tournent en utilisateur `nginx`, pas en root.
- Le conteneur **ne publie aucun port** sur l'hôte : il n'est joignable que par le proxy.
- **Aucun contournement de la porte** : un seul routeur sert du contenu, et il porte la
  limitation de débit puis l'authentification. Les deux autres ne font que rediriger.

---

## Un faux positif, gardé ici exprès

Le premier test TLS annonçait TLS 1.1 accepté. C'était faux : `no protocols available` est le
client openssl qui **refuse d'offrir** les vieilles versions, pas le serveur qui les accepte.
Un test strict, lisant le protocole réellement négocié, a rétabli les faits.

Noté parce que c'est exactement l'erreur contre laquelle le skill met en garde — et qu'un audit
qui ne dit pas ce qu'il a cru à tort n'est pas vérifiable.

---

## Ce qui n'a pas été audité, et pourquoi

**Le site `sohamnathayoga.fr` et son WordPress n'ont pas été examinés.** Félix a les droits
techniques pour le faire — `sudo` sans mot de passe sur l'hôte — mais **l'accès n'est pas
l'autorisation**. Ce site appartient à un tiers, et un WordPress d'activité commerciale
contient selon toute vraisemblance des données personnelles de clients.

L'audit s'est donc arrêté à la couche que Félix co-administre légitimement : l'hôte, le réseau,
le proxy, et son propre conteneur. Le cloisonnement vis-à-vis du voisin a été mesuré — c'est
une question sur la sécurité **de Félix** — sans rien sonder du site lui-même.

Pour aller plus loin, il faut l'accord du propriétaire. C'est un message à envoyer, pas un
obstacle technique.
