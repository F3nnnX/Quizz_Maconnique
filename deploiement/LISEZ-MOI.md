# Le Cherchant sur le VPS — mode d'emploi

Ce dossier contient la configuration qui sert **https://lecherchant.fr** depuis le VPS
`51.195.223.56`. Les trois fichiers sont la copie exacte de ce qui tourne sur le serveur,
dans `/data/sites/lecherchant/`.

## Ce qu'il fallait savoir avant de commencer, et qui n'était écrit nulle part

Le VPS **n'est pas une machine vierge**. Il fait tourner **Coolify** (un PaaS auto-hébergé)
avec **Traefik v3.6** en proxy, et il héberge déjà deux sites en production qui ne sont pas
ceux de Félix :

| Site | Nature |
|---|---|
| `fransktradgard.se` | site statique, géré par Coolify |
| `sohamnathayoga.fr` | WordPress + MariaDB, géré par Coolify |

**Conséquence directe : on n'installe pas de serveur web sur cet hôte.** Les ports 80 et 443
appartiennent à Traefik, qui gère aussi les certificats Let's Encrypt. Installer Caddy ou
nginx sur la machine échouerait à démarrer — ou, pire, prendrait les ports au redémarrage et
éteindrait les deux sites du frère de Félix.

La bonne méthode est celle-ci : **un conteneur de plus, avec des labels Traefik.** Le proxy
découvre les conteneurs tout seul.

## Comment c'est monté

```
/data/sites/lecherchant/
├── docker-compose.yml   ← le conteneur et ses labels Traefik
├── nginx.conf           ← la politique de cache
├── deploie.sh           ← met à jour depuis GitHub
└── depot/               ← clone git du dépôt, c'est la racine web
```

Le conteneur `lecherchant` (nginx:1.27-alpine) monte `depot/` en **lecture seule** et le sert.
Il n'y a **rien à construire** : l'application est un fichier statique, le clone git *est* le
site. Mettre à jour, c'est faire un `git pull`.

**Ce conteneur n'est pas géré par Coolify** et n'apparaîtra pas dans son tableau de bord.
C'était le choix le moins intrusif : poser un site statique ne valait pas de demander un accès
au tableau de bord d'un tiers. Il redémarre seul (`restart: unless-stopped`) et survit aux
reboots.

## Mettre le site à jour

```sh
ssh fts
/data/sites/lecherchant/deploie.sh
```

Le script refuse de fusionner (`git merge --ff-only`) : si quelqu'un a modifié le clone sur le
serveur, le déploiement **échoue bruyamment** au lieu de fabriquer un commit de fusion sur une
machine que personne ne relit.

## Les décisions prises, et pourquoi

**Les en-têtes de sécurité ne sont pas ici.** Ils sont posés par Traefik à l'entrypoint https,
par la chaîne `securite` de `/data/coolify/proxy/dynamic/securite.yaml` — un fichier écrit
pour le site voisin, longuement commenté, et qui s'applique à tous les sites de la machine.
HSTS deux ans, `nosniff`, `X-Frame-Options: SAMEORIGIN`, `Referrer-Policy`. **Les redoubler
dans nginx les ferait apparaître deux fois dans la réponse.**

**Il n'y a pas de CSP, et il ne peut pas y en avoir** sans toucher à `index.html` : la feuille
Tailwind et tout le JavaScript sont *en ligne* dans la page, et le manifeste PWA est une
`data:` URI. Une CSP stricte casserait l'application. Le fichier `securite.yaml` du voisin
explique d'ailleurs pourquoi la CSP a été retirée de l'entrypoint : elle ne peut pas être
affinée par site.

**La politique de cache est dans nginx, parce qu'elle ne peut être nulle part ailleurs** — un
middleware d'entrypoint ne distingue pas les chemins.

| Fichier | Cache | Motif |
|---|---|---|
| `index.html` | `no-cache` | le service worker sert la page en *réseau d'abord* ; sans cela le cache HTTP réintroduirait en amont le figement qu'il évite, et il gagnerait |
| `sw.js` | `no-cache` | un service worker en cache ne se met **jamais** à jour, et rien ne permet de le déloger à distance |
| `jspdf.umd.min.js` | 1 an, `immutable` | ne change qu'avec son numéro de version |

**La racine web est un clone git**, donc `/.git/` serait téléchargeable et livrerait tout
l'historique. `nginx.conf` le refuse, ainsi que `travaux/`, `outils/`, `deploiement/` et les
fichiers `.md`, `.py`, `.yml`. Le dépôt est public aujourd'hui ; il ne le sera pas toujours
(`PASSATION.md` § 5), et cette règle doit tenir ce jour-là.

**L'apex est canonique**, `www` redirige vers lui en 301. Le domaine a été choisi pour dire le
nom de la marque, article compris. Le site voisin fait l'inverse : ce n'est pas une
incohérence, c'est un autre propriétaire.

**La compression est faite par nginx**, pas par un middleware Traefik, pour que la politique de
ce site ne dépende pas d'un middleware déclaré par le conteneur d'un autre site. Gain mesuré :
2 395 995 → 1 339 007 octets, soit 44 %.

## Le piège qui a failli passer

Dans un fichier compose, `${1}` est **substitué par docker compose** avant que Traefik ne voie
le label. Écrit tel quel dans la redirection `www` → apex, le groupe capturé disparaît et
`www.lecherchant.fr/une-page` redirige vers la racine — **en silence, sans erreur**. Il faut
écrire `$${1}`. C'est vérifié : `docker inspect` montre bien `${1}` sur le conteneur, et la
redirection conserve le chemin *et* la requête.

## Adresse de secours

`http://lecherchant.51.195.223.56.sslip.io` sert le site en clair, sans dépendre du DNS ni du
certificat. Utile pour distinguer « le site est cassé » de « le DNS est cassé ».

## Ce qui reste à faire

- **Le DNS**, dans l'espace client OVH — c'est la seule étape que Claude ne peut pas faire.
- **La redirection depuis GitHub Pages**, une fois `lecherchant.fr` en service. Elle ne peut
  pas se faire en modifiant `index.html` : la méthode est une branche `gh-pages` ne contenant
  qu'une page de redirection, et Pages pointé dessus. `main` n'est pas touché.
- **Faire passer `script.google.com` par le VPS**, pour que le jeton de statistiques cesse
  d'être écrit en clair dans un dépôt public (`TIERS.md`, `PASSATION.md` § 5).
