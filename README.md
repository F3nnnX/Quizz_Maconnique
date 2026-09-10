# Le Quiz Maçonnique

Application web d'instruction maçonnique au 1er degré du Rite Écossais Ancien et Accepté, conçue pour la R∴L∴ Philadelphia n° 1604, Orient de Marseille (Grande Loge de France).

**En ligne : https://f3nnnx.github.io/Quizz_Maconnique/**

Un seul fichier, `index.html`, sans installation ni dépendance : on l'ouvre, ça marche, sur téléphone comme sur ordinateur. Pensé d'abord pour un Apprenti qui révise, il sert aussi bien à un Compagnon ou à un Maître qui veut se remettre en mémoire ce qu'il croyait savoir.

## Ce qu'on y trouve

**Le quiz.** Une question, quatre réponses, l'explication de la bonne réponse et une source à chaque fois. Un peu plus de 500 questions au 1er degré, réparties en huit thèmes : symbolisme, rituel et temple, histoire, vocabulaire, droit et règlement, francs-maçons célèbres, philosophie, alchimie. On choisit son thème et le nombre de questions — de 10 jusqu'à la totalité du thème — ou on mélange tout.

**Le Mémento du tuilage.** Les 71 questions-réponses du Mémento de l'Apprenti, en quiz (dans l'ordre du mémento) ou en lecture, avec export PDF.

**La Boîte à outils.** Le tableau de loge zoomable, où chaque symbole ouvre sa fiche ; le jeu des Officiers, pour associer chaque office à son bijou et à sa place dans le Temple ; le jeu de mémoire des symboles ; le rituel du 1er degré en lecture ; un lexique maçonnique de 269 entrées ; un lexique humoristique ; et quatre rituels de banquet, pour rire un peu.

**La progression.** Tout est mémorisé dans le navigateur, sans compte ni serveur. Une question ratée revient à J+1, puis J+3, J+7, J+15 tant qu'elle est réussie ; elle n'est tenue pour maîtrisée qu'après deux succès consécutifs. Un quiz interrompu est proposé à la reprise. La banque d'erreurs peut être rejouée à part.

## Révision par les frères

En sciences on parle de révision par les pairs. Ici, si une question vous semble mal posée, une réponse discutable, ou si une idée vous vient, écrivez à l'auteur. Le fichier [`RELECTURE-V2.1.md`](RELECTURE-V2.1.md) liste les points de doctrine ou d'histoire qui restent à trancher.

## Pour les développeurs

Lire [`CLAUDE.md`](CLAUDE.md) avant de toucher au code : architecture du fichier unique, conventions typographiques, pièges connus, façon de tester avec Playwright. Le journal de développement est dans [`SUIVI.md`](SUIVI.md).

Le site est servi par GitHub Pages depuis la branche `main` ; chaque fusion dans `main` déploie.

---

Développé par Félix Casellato — Tous droits réservés.
