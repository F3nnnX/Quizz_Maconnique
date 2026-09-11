# Prompt de reprise

À copier-coller au début d'une prochaine session pour repartir sans avoir à tout réexpliquer.

---

## Prompt pour la session VS Code — reprendre le projet sur la machine de Félix

À coller au tout début d'une session Claude Code ouverte dans
`C:\Users\Utilisateur\Desktop\dev\Quizz_Maconnique`.

```
Lis PASSATION.md, puis CLAUDE.md, puis SUIVI.md, dans cet ordre, avant de toucher à
quoi que ce soit.

Contexte : deux sessions Claude travaillent sur ce dépôt et ne se voient pas. Le
dépôt git est leur seule mémoire commune. PASSATION.md dit qui fait quoi et dans
quel état est le projet.

Tu as la migration en charge : sortir de GitHub Pages, poser le site sur le VPS,
brancher le nom de domaine. Le nom n'est pas encore arrêté — l'autre session s'en
occupe, ne le choisis pas à sa place.

Avant de commencer, dis-moi ce que tu as compris de l'état du projet et ce que tu
proposes de faire en premier. Ne code rien avant que j'aie validé.
```

---

## Prompt court — reprendre là où on s'est arrêté

```
Lis CLAUDE.md et SUIVI.md, puis dis-moi où en est le projet et ce que tu proposes
de faire ensuite. Ne code rien avant que j'aie validé.
```

---

## Prompt long — enchaîner sur les corrections en attente

```
Lis CLAUDE.md et SUIVI.md avant toute chose.

Contexte : Le Quiz Maçonnique est une application web d'un seul fichier (index.html),
hébergée par GitHub Pages depuis main. Tout est décrit dans CLAUDE.md — architecture,
conventions typographiques, pièges connus, façon de tester avec Playwright.

Travail demandé, dans cet ordre :

1. Fusionner ou faire fusionner le commit bb70933 de la branche
   claude/mise-a-jour-en1lj2 (écran Rituels Humoristiques), s'il ne l'est pas déjà.

2. Héberger jsPDF dans le dépôt au lieu de le charger depuis cdnjs, pour que les
   trois exports PDF fonctionnent sans réseau (point 3 de SUIVI.md).

3. Remettre un vrai service worker, dans un fichier sw.js à la racine, qui met en
   cache index.html et jsPDF, pour que le mode hors connexion promis par le
   manifeste PWA fonctionne enfin (point 2 de SUIVI.md).

Contraintes :
- Développe sur la branche claude/mise-a-jour-en1lj2, jamais directement sur main.
- Teste chaque étape dans Chromium avec Playwright avant de pousser, et montre-moi
  des captures.
- Tiens à jour le changelog en tête d'index.html et le journal de SUIVI.md.
- Ne fusionne pas dans main sans me demander.
```

---

## Prompt de correction — quand un frère remonte un défaut

```
Lis CLAUDE.md et SUIVI.md.

Voici ce qu'on me remonte : <décris le symptôme, l'appareil et l'écran concerné>.

Reproduis-le d'abord sous Playwright avant de corriger quoi que ce soit, et
dis-moi la cause exacte. Développe sur une branche claude/... dédiée, tiens à
jour le changelog en tête d'index.html et le journal de SUIVI.md, ouvre la PR
et demande-moi avant de fusionner.
```

---

## À me redonner si le sujet revient

- L'adresse du site : **https://f3nnnx.github.io/Quizz_Maconnique/**
- Le déploiement se vérifie par le workflow « pages build and deployment » sur `main` :
  l'environnement de développement ne peut pas visiter le site, l'accès à `github.io` y est
  bloqué. Un déploiement au vert sur le bon commit est la seule preuve disponible.
- Si le site semble ne pas s'être mis à jour : c'est le cache du navigateur, pas le
  déploiement. `Ctrl+Maj+R`, ou fermer complètement l'application installée sur mobile.
