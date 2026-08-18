# Prompt de reprise

À copier-coller au début d'une prochaine session pour repartir sans avoir à tout réexpliquer.

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

## Prompt de ménage — si on veut juste alléger le dépôt

```
Lis CLAUDE.md et SUIVI.md.

Applique le point 4 de SUIVI.md : supprime index-4.html et IMG20260814110022.jpg,
qui pèsent 9 Mo pour rien. Vérifie d'abord qu'aucun des deux n'est référencé nulle
part dans index.html. Commit sur claude/mise-a-jour-en1lj2, et demande-moi avant
de fusionner.
```

---

## À me redonner si le sujet revient

- L'adresse du site : **https://f3nnnx.github.io/Quizz_Maconnique/**
- Le déploiement se vérifie par le workflow « pages build and deployment » sur `main` :
  l'environnement de développement ne peut pas visiter le site, l'accès à `github.io` y est
  bloqué. Un déploiement au vert sur le bon commit est la seule preuve disponible.
- Si le site semble ne pas s'être mis à jour : c'est le cache du navigateur, pas le
  déploiement. `Ctrl+Maj+R`, ou fermer complètement l'application installée sur mobile.
