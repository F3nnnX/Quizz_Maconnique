# Passation — deux sessions sur le même dépôt

Ouvert le 11 septembre 2026, quand Félix a décidé de travailler depuis Visual Studio Code en
parallèle de la session Claude Desktop.

**À lire en premier, avant `CLAUDE.md`**, par toute session qui reprend le projet.

---

## 1. Qui fait quoi

Deux sessions travaillent sur ce dépôt. Elles ne se voient pas et ne se parlent pas : **le
dépôt git est leur seule mémoire commune.** D'où ce fichier.

| Session | Où | En charge de |
|---|---|---|
| **VS Code** | `C:\Users\Utilisateur\Desktop\dev\Quizz_Maconnique` | **La migration.** Sortir de GitHub Pages, mettre le site sur le VPS, brancher le nom de domaine. |
| **Claude Desktop** | environnement distant | Le nom commercial, le nom de domaine, la protection de l'œuvre, le contenu de l'application. |

**Règle de non-collision : la session VS Code ne touche pas au contenu de `index.html`, la
session Desktop ne touche pas à l'infrastructure.** Les deux peuvent écrire dans les fichiers
`.md`, mais jamais dans le même au cours de la même journée sans se relire.

## 2. Comment les deux restent à jour

Il n'existe aucun lien direct entre deux sessions Claude. **Le lien, c'est git**, et il ne
fonctionne que si les deux respectent la même discipline :

1. **Avant de commencer** : `git fetch origin && git checkout -B <branche> origin/main`.
   Jamais de travail sur une branche vieille d'un jour.
2. **Lire `PASSATION.md` puis `SUIVI.md`** — ce que l'autre a fait depuis est écrit là.
3. **Travailler sur une branche `claude/...` dédiée**, une pull request par lot.
4. **Avant de finir** : ajouter une entrée au journal de `SUIVI.md`, mettre à jour la section 4
   de ce fichier, régénérer l'empreinte (`python3 outils/empreinte.py > EMPREINTE.txt`),
   pousser.
5. **Ne jamais fusionner sans l'accord de Félix.**

Si une session trouve le dépôt dans un état qu'elle ne comprend pas, la réponse est toujours la
même : lire le journal de `SUIVI.md`, du plus récent au plus ancien. Il est tenu à jour à
chaque lot depuis le 18 août 2026.

## 3. Pour démarrer depuis VS Code

Le dossier `C:\Users\Utilisateur\Desktop\dev\Quizz_Maconnique` doit être **un clone du dépôt**,
pas une copie de fichiers — sans l'historique git, la session perd la mémoire du projet et la
meilleure preuve de paternité de Félix.

```
cd C:\Users\Utilisateur\Desktop\dev
git clone https://github.com/F3nnnX/Quizz_Maconnique.git
cd Quizz_Maconnique
```

Puis, dans Claude Code : demander de lire `PASSATION.md`, `CLAUDE.md` et `SUIVI.md` avant de
toucher à quoi que ce soit.

**Trois différences d'environnement à connaître, parce qu'elles font échouer ce qui marchait ici :**

- Les chemins de ce dépôt sont écrits pour Linux. Sur Windows, `python3` s'appelle souvent
  `python`, et Playwright n'est pas installé au même endroit — le chemin
  `/opt/pw-browsers/chromium-1194/chrome-linux/chrome` cité dans `CLAUDE.md` n'existe pas.
- L'environnement distant bloque `github.io`, `fonts.googleapis.com` et la plupart des
  domaines externes. **Sur la machine de Félix, ces blocages n'existent pas** : la session
  VS Code peut visiter le site déployé, ce que celle-ci n'a jamais pu faire.
- **Ne jamais régénérer `EMPREINTE.txt` depuis Windows.** Le dépôt y est cloné avec
  `core.autocrlf=true` : tous les fichiers texte ont des CRLF sur le disque, et
  `outils/empreinte.py` hache les fichiers du disque. Les SHA-256 produits ne
  correspondraient à rien de reproductible — `index.html` y pèse 2 400 511 octets au lieu de
  2 395 995, soit exactement les 4 516 retours chariot ajoutés — et la sortie serait en plus
  écrite en cp1252 au lieu d'UTF-8. Pour une pièce destinée à l'INPI, **cela casserait la
  chaîne probatoire en silence**. La régénérer sur une machine Linux : un clone jetable sur le
  VPS suffit (`git clone --branch <branche> ... /tmp/x && python3 outils/empreinte.py`).

## 4. Où en est le projet — au 11 septembre 2026

### L'application

**V2.3.2**, en ligne sur https://f3nnnx.github.io/Quizz_Maconnique/, déployée depuis `main`.
Tout fonctionne. Rien n'est en chantier dans `index.html`.

Les six versions du 10 et 11 septembre : relecture du corpus et choix du nombre de questions
(V2.1), arbitrages de doctrine (V2.2), trois correctifs d'ergonomie mobile (V2.2.1 à V2.2.3),
mode hors connexion réel (V2.3.0), Boîte à Outils en trois rayons (V2.3.1), cérémonie du
heurtoir jouée une seule fois (V2.3.2).

### La protection de l'œuvre

Faite : `LICENSE` (tous droits réservés), `TIERS.md` (inventaire des composants qui ne sont pas
de Félix), `IMAGES.md` (les 33 images, origines établies), `EMPREINTE.txt` (empreintes SHA-256
horodatées), `PROTECTION.md` (la marche à suivre). Une archive complète de l'historique git est
sur le Drive de Félix.

**Le fait qui commande tout le reste : 29 des 33 images viennent d'internet.** Rien d'urgent
tant que l'application est gratuite ; tout devient bloquant le jour de la vente. C'est donc ce
point qui fixe le calendrier de la commercialisation.

### En attente d'un tiers

- **La GLDF**, sur le droit de diffuser le texte du rituel du 1er degré. Mail parti le
  11 septembre. C'est le seul point qui puisse obliger à modifier le produit.
- **Le dépôt e-Soleau** à l'INPI, à faire une fois la GLDF revenue.

### Mis de côté, à ne pas reprendre sans demander

- `travaux/tableau-svg/` — refonte du Tableau de Loge en SVG, jugée insuffisante par Félix le
  11 septembre. Le travail sur les points chauds est acquis et documenté.
- **Les 16 symboles et les 11 bijoux** : refonte explicitement repoussée par Félix,
  « la priorité c'est migration ».
- `JEU-PISTES.md` — le jeu des carrières, en réflexion.
- `ACCES.md` — l'accès par code, archivé, non engagé.

### Ce qui est ouvert, et pour qui

| Sujet | Session | État |
|---|---|---|
| Choix du nom commercial | Desktop | **« Le Cherchant » arrêté** le 11 septembre, vérifications INPI et RNE faites |
| Achat du nom de domaine | Desktop | **FAIT** — `lecherchant.fr`, OVH, 3 ans + 1 an offert, domaine seul, titulaire particulier. Aucun DNS configuré : le domaine attend le VPS |
| Sortie de GitHub Pages vers le VPS | **VS Code** | **FAIT le 11 septembre** — le site tourne sur le VPS, servi par Traefik. Voir `deploiement/LISEZ-MOI.md` |
| Branchement du domaine sur le VPS | **Félix** | **SEULE ÉTAPE RESTANTE** — le DNS pointe encore sur le parking OVH `213.186.33.5`. Il faut un `A` et un `AAAA` vers `51.195.223.56` / `2001:41d0:801:2000::86fb`, depuis l'espace client OVH. Sans cela, pas de certificat |
| Redirection de GitHub Pages | **VS Code** | À faire **après** la bascule DNS, par une branche `gh-pages` ne contenant qu'une page de redirection — `main` et `index.html` ne sont pas touchés |

## 4 bis. Le nom de domaine — critères arrêtés le 11 septembre 2026

Félix pose deux exigences : **confidentialité du WHOIS** et **maîtrise des enregistrements
A, AAAA, CNAME**. Ce qui a été vérifié, pour que la session VS Code n'ait pas à le refaire :

- **En `.fr`, la confidentialité est acquise d'office.** L'AFNIC applique la « diffusion
  restreinte » aux **personnes physiques** : nom, adresse, téléphone et courriel sont masqués
  par défaut, gratuitement, chez n'importe quel registrar. Ce n'est ni une option ni un
  service. **Condition unique : rester titulaire en nom propre** — une immatriculation en
  micro-entreprise ferait de Félix une personne morale, et les données redeviendraient
  publiques.
- **En `.com`, cela dépend du registrar.** Vérifié comme gratuit chez Porkbun, Namecheap, et
  inclus chez Cloudflare.
- **A, AAAA et CNAME ne trient personne** : tous les registrars sérieux les donnent. La vraie
  distinction est ailleurs — **gérer les enregistrements** (tout le monde) contre **déléguer
  les serveurs de noms à un tiers** (la plupart, mais **pas Cloudflare**, qui impose les
  siens). Pour pointer vers le VPS, un `A` et un `AAAA` suffisent.
- **Le piège à surveiller est le prix de renouvellement**, souvent bien supérieur à celui de
  la première année.

Recommandation faite à Félix : un `.fr` chez un registrar français (OVH, Gandi, Infomaniak) —
confidentialité garantie par l'AFNIC, support en français, facture en euros, délégation libre.
Le `.com` chez Porkbun si le nom retenu n'est libre que là.

### Le nom retenu : **Le Cherchant**

Décidé par Félix le 11 septembre 2026, **après vérification** :

| Contrôle | Résultat |
|---|---|
| Marque « cherchant » à l'INPI | **aucune** |
| Société active du même nom | **aucune** — « Au Parvis du Cherchant », librairie du Var, radiée le 10/12/2018 |
| Site concurrent | **aucun** — trois domaines testés, zéro résolution |
| `lecherchant.fr` | **acheté chez OVH le 11 septembre 2026**, 3 ans + 1 an offert |

Une société radiée ne détient plus rien : la protection d'une dénomination sociale suppose un
usage effectif dans le commerce, et il a cessé il y a huit ans. Aucun des quatre obstacles qui
ont fait tomber « Le Tuileur » ne se présente ici.

Le cherchant, c'est celui qui frappe à la porte du Temple et demande la lumière. Le mot est
déjà dans l'application, au premier coup de heurtoir : « C'est un peu timide pour un
cherchant ! ». Il dit le public — celui qui cherche, pas celui qui sait — et il est
**distinctif et non descriptif**, donc déposable comme marque, contrairement aux deux
candidats écartés.

**Le domaine retenu est `lecherchant.fr`**, l'article compris. `cherchant.fr` était plus court,
mais l'adresse doit dire le nom de la marque — « Le Cherchant » — et non un mot amputé.

**Deux noms ont été écartés, et il faut savoir pourquoi pour ne pas y revenir :**

- **« Quiz Maçonnique »** décrit purement le produit. L'INPI refuse les marques qui se
  contentent de décrire, donc Félix ne pourrait empêcher personne de l'employer.
- **« Le Tuileur »**, un moment retenu, a été abandonné le jour même : `letuileur.fr` est
  **une boutique maçonnique active** — « Le Portail Maçonnique », décors et produits de tous
  rites. Antériorité, activité commerciale réelle, public identique, et deux noms qui ne
  diffèrent que par un article. Le problème est d'abord de produit — les frères
  confondraient — et accessoirement de concurrence déloyale le jour de la vente. La base
  INPI donne par ailleurs une SCI « Le Tuileur de Lutèce » (immobilier, sans rapport) et une
  marque restant à examiner.

**Ce que le nom touchera, le jour où il sera adopté** — rien n'est fait, tout est à décider :
le nom de domaine, le titre de l'application et son `<title>`, le manifeste PWA, le sceau de
la loge à remplacer par une marque propre (voir `IMAGES.md`), et le dépôt de marque à l'INPI.
**L'application s'appelle toujours « Le Quiz Maçonnique » et rien n'a été renommé.**

## 5. Ce que la session VS Code doit savoir avant de migrer

Ces points ont été établis ici et il serait coûteux de les redécouvrir :

- **Le VPS n'est pas une machine vierge, et c'est le fait qui commande tout le reste.** Il fait
  tourner **Coolify** avec **Traefik v3.6** en proxy, et il héberge déjà deux sites en
  production qui ne sont pas ceux de Félix : `fransktradgard.se` et `sohamnathayoga.fr`
  (WordPress). **Les ports 80 et 443 appartiennent à Traefik.** N'installer aucun serveur web
  sur l'hôte : au redémarrage suivant, il pourrait prendre les ports et éteindre les deux
  sites du frère de Félix. La méthode est un conteneur de plus, avec des labels Traefik.
- **Les en-têtes de sécurité sont déjà posés**, pour tous les sites de la machine, par
  `/data/coolify/proxy/dynamic/securite.yaml` — un fichier écrit à la main, en français,
  longuement commenté. Le lire avant d'y toucher. Ne pas redoubler ses en-têtes.
- **L'application est un fichier unique et statique.** N'importe quel serveur web la sert.
  Il n'y a rien à construire, rien à installer, pas de dépendance à résoudre.
- **Le service worker impose HTTPS** (ou `localhost`). Sans certificat, le mode hors connexion
  cesse de fonctionner et l'installation sur l'écran d'accueil aussi.
- **Le nom du cache porte la version** (`quiz-maconnique-v2.3.0` dans `sw.js`). Il est lié au
  domaine : changer de domaine repart d'un cache vide, ce qui est sans gravité, mais **les
  frères qui ont installé l'application depuis `github.io` garderont l'ancienne** — elle
  continuera de fonctionner et de se mettre à jour depuis GitHub Pages. Prévoir soit de
  maintenir les deux, soit de prévenir les frères, soit de laisser une redirection.
- **Deux appels réseau externes subsistent**, décrits dans `TIERS.md` : les polices Google, et
  `script.google.com` pour les statistiques. Le second contient un jeton écrit en clair dans un
  dépôt public — le faire passer par le VPS est justement une des raisons d'avoir un VPS.
- **Le dépôt réserve tous les droits.** S'il devient privé, GitHub Pages s'éteint sur un compte
  gratuit : ce n'est plus un problème une fois le site sur le VPS, et c'est même un des gains
  de la migration.

## 6. Conventions à ne pas enfreindre

Elles sont détaillées dans `CLAUDE.md`, mais voici celles qu'on oublie :

- **L'apostrophe suit le bloc** : droite dans les données JS, courbe dans la prose HTML.
  Écrire dans la mauvaise convention passe tous les tests et salit le fichier en silence.
- **Espace fine insécable U+202F** avant `? ! ; :` et dans les guillemets `« »`.
- **Modifier `index.html` par script Python ancré sur des chaînes exactes**, en vérifiant que
  l'ancre est unique. Certaines lignes font des centaines de milliers de caractères.
- **Tenir le changelog en tête d'`index.html`** à chaque changement : le fait, sa cause
  technique, sa conséquence pour l'utilisateur.
- **Toute ressource ajoutée entre dans `TIERS.md`.** C'est la leçon des 29 images.
