# -*- coding: utf-8 -*-
"""Pose l'espace fine insecable (U+202F) dans les seules chaines litterales
de la zone DEBUT TEXTE / FIN TEXTE. Le code JS n'est jamais touche : les
ternaires (? :) et les cles d'objet (titre:) vivent hors des chaines.
Les marqueurs sont cites dans le commentaire d'en-tete : on borne donc sur
la DERNIERE occurrence de chacun, pas la premiere."""
import re

CHEMIN = "index.html"
FINE   = " "
NBSP   = " "
GO, GF = "«", "»"
ESPACES = "[ " + NBSP + FINE + "]*"

src = open(CHEMIN, encoding="utf-8").read()
d = src.rindex("BUT TEXTE")
f = src.rindex("FIN TEXTE")
assert d < f, "marqueurs inverses"
avant, zone, apres = src[:d], src[d:f], src[f:]

CHAINE = re.compile(r'"(?:[^"\\\n]|\\.)*"')

def corrige(m):
    s = m.group(0)
    s = re.sub(r'([^\s])' + ESPACES + r'([?!;:])', lambda x: x.group(1) + FINE + x.group(2), s)
    s = s.replace("'", "\u2019")   # apostrophe droite -> courbe
    s = re.sub(GO + ESPACES, GO + FINE, s)
    s = re.sub(ESPACES + GF, FINE + GF, s)
    return s

zone2 = CHAINE.sub(corrige, zone)
out = avant + zone2 + apres
open(CHEMIN, "w", encoding="utf-8").write(out)

print("taille zone         :", len(zone), "caracteres")
print("guillemets          :", zone2.count(GO), "ouvrants,", zone2.count(GF), "fermants")
print("fines posees        :", out.count(FINE))
print("hors zone (doit 0)  :", (avant + apres).count(FINE))
