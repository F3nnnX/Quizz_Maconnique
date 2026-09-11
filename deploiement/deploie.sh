#!/bin/sh
# Le Cherchant — met le site à jour depuis GitHub.
#
# À lancer sur le VPS : /data/sites/lecherchant/deploie.sh
#
# Le conteneur nginx sert directement le clone git, monté en lecture seule. Il
# n'y a donc rien à reconstruire ni à redémarrer : un « git pull » suffit, et le
# fichier suivant servi est le nouveau. C'est tout le bénéfice d'une application
# qui tient dans un fichier statique.

set -eu

RACINE=/data/sites/lecherchant
DEPOT="$RACINE/depot"

cd "$DEPOT"

avant=$(git rev-parse --short HEAD)

# --ff-only : si quelqu'un a modifié le clone sur le serveur, on veut que le
# déploiement ÉCHOUE bruyamment plutôt qu'il ne fabrique un commit de fusion sur
# une machine que personne ne relit.
git fetch origin main
git merge --ff-only origin/main

apres=$(git rev-parse --short HEAD)

if [ "$avant" = "$apres" ]; then
    echo "Déjà à jour ($apres). Rien à faire."
    exit 0
fi

echo "Déployé : $avant -> $apres"
git --no-pager log --oneline "$avant..$apres" | sed 's/^/  /'

# Le service worker sert la page en réseau d'abord et nginx la marque
# « no-cache » : les visiteurs auront la nouvelle version à leur prochaine
# navigation, sans rien vider.
echo ""
echo "Vérification : le site répond-il ?"

# On interroge nginx DIRECTEMENT dans le conteneur, pas l'URL publique : celle-ci
# passe par la porte d'accès (basicauth) et renverrait 401 sans le code, ce qui
# ferait crier le script à chaque déploiement alors que tout va bien. Sonder
# nginx en interne prouve que le contenu est servi, sans dépendre de la porte.
if sudo docker exec lecherchant wget -q -O /dev/null http://127.0.0.1/ 2>/dev/null; then
    echo "  nginx interne -> 200, le contenu est servi."
else
    echo "  ATTENTION : nginx interne ne répond pas 200."
fi
