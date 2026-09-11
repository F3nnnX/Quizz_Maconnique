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

# En HTTP le proxy redirige vers HTTPS : interroger le port 80 renvoie 301, ce
# qui n'apprend rien sur l'état du site. On passe donc par HTTPS, en forçant la
# résolution sur la boucle locale — le certificat reste valide, c'est bien le
# nom qui est présenté en SNI.
code=$(curl -s -o /dev/null -w '%{http_code}' --resolve lecherchant.fr:443:127.0.0.1        https://lecherchant.fr/ --max-time 15 || echo 000)
echo "  https://lecherchant.fr -> $code"
[ "$code" = "200" ] || echo "  ATTENTION : 200 attendu."
