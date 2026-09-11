#!/usr/bin/env python3
"""Produit l'empreinte horodatee du depot, destinee a un depot probatoire
(e-Soleau de l'INPI, Agence pour la Protection des Programmes, constat d'huissier).

Ce que ce fichier prouve : qu'a une date donnee, ces fichiers-la, avec ce
contenu-la exactement, existaient. Il ne prouve pas la paternite — c'est
l'historique git qui la documente, commit par commit, depuis le 27 juillet 2026.

Usage : python3 outils/empreinte.py > EMPREINTE.txt
"""

import hashlib
import subprocess
import sys
from datetime import datetime, timezone
from pathlib import Path

RACINE = Path(__file__).resolve().parent.parent


def sha256(chemin):
    h = hashlib.sha256()
    with open(chemin, "rb") as f:
        for bloc in iter(lambda: f.read(1 << 20), b""):
            h.update(bloc)
    return h.hexdigest()


def git(*args):
    try:
        return subprocess.run(["git", "-C", str(RACINE), *args],
                              capture_output=True, check=True).stdout.decode().strip()
    except Exception:
        return "(indisponible)"


def main():
    # On ne prend que ce qui est suivi par git : le reste n'est pas le produit.
    # EMPREINTE.txt est exclu — il ne peut pas contenir sa propre empreinte, et
    # l'exclure rend le calcul reproductible une fois le fichier commite.
    suivis = sorted(f for f in git("ls-files").splitlines() if f and f != "EMPREINTE.txt")

    lignes = []
    total = 0
    for rel in suivis:
        p = RACINE / rel
        if not p.is_file():
            continue
        taille = p.stat().st_size
        total += taille
        lignes.append((sha256(p), taille, rel))

    # L'empreinte globale porte sur le manifeste lui-meme : un seul chiffre a
    # retenir, qui change des qu'un octet change dans n'importe quel fichier.
    manifeste = "\n".join("%s  %12d  %s" % l for l in lignes)
    globale = hashlib.sha256(manifeste.encode("utf-8")).hexdigest()

    out = sys.stdout
    out.write("EMPREINTE DU DEPOT — Le Quiz Maconnique\n")
    out.write("=" * 72 + "\n\n")
    out.write("Auteur declare      : Felix Casellato\n")
    out.write("Oeuvre              : Le Quiz Maconnique, application web d'instruction\n")
    out.write("                      maconnique au 1er degre (REAA)\n")
    out.write("Date de l'empreinte : %s\n" % datetime.now(timezone.utc).strftime("%Y-%m-%d %H:%M:%S UTC"))
    out.write("Commit git          : %s\n" % git("rev-parse", "HEAD"))
    out.write("Date du commit      : %s\n" % git("log", "-1", "--format=%cI"))
    out.write("Premier commit      : %s\n" % git("log", "--reverse", "--format=%cI %H", "--max-parents=0"))
    out.write("Nombre de commits   : %s\n" % git("rev-list", "--count", "HEAD"))
    out.write("Fichiers            : %d\n" % len(lignes))
    out.write("Poids total         : %d octets (%.2f Mo)\n\n" % (total, total / 1048576))
    out.write("EMPREINTE GLOBALE (SHA-256 du manifeste ci-dessous) :\n")
    out.write("  %s\n\n" % globale)
    out.write("MANIFESTE — SHA-256, taille en octets, chemin\n")
    out.write("-" * 72 + "\n")
    out.write(manifeste + "\n")


if __name__ == "__main__":
    main()
