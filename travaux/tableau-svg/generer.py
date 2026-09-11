#!/usr/bin/env python3
"""Genere le fond SVG du Tableau de Loge, 500 x 719.

Le canevas et les 22 points chauds de #tb-hotspots sont figes : chaque symbole
doit tomber sous le sien, sinon on touche la lune et on ouvre le soleil.
"""
import math

D = "./"


def lacs(x0, y0, x1, y1, n):
    """Chaine de boucles enlacees de (x0,y0) a (x1,y1).

    Le croisement fait tout : sans lui on obtient une guirlande de festons, avec lui
    une corde. On l'obtient en tirant le premier point de controle EN ARRIERE du
    depart et le second EN AVANT de l'arrivee — la courbe se replie sur elle-meme.
    """
    dx, dy = (x1 - x0) / n, (y1 - y0) / n
    L = math.hypot(dx, dy)
    ux, uy = dx / L, dy / L
    nx, ny = -uy, ux
    h, k = L * 1.30, L * 0.78
    out = []
    for i in range(n):
        ax, ay = x0 + dx * i, y0 + dy * i
        bx, by = ax + dx, ay + dy
        c1x, c1y = ax - ux * k + nx * h, ay - uy * k + ny * h
        c2x, c2y = bx + ux * k + nx * h, by + uy * k + ny * h
        out.append("M%.1f %.1f C%.1f %.1f %.1f %.1f %.1f %.1f"
                   % (ax, ay, c1x, c1y, c2x, c2y, bx, by))
    return " ".join(out)


L, R, T, B = 40, 460, 40, 679
houppe = "\n".join(
    '    <path class="cord" d="%s"/>' % lacs(*a)
    for a in [(L, T, R, T, 16), (R, T, R, B, 24), (R, B, L, B, 16), (L, B, L, T, 24)])

pave = []
for r in range(4):
    y = 606 + r * 18
    x = 60 + (0 if r % 2 == 0 else 26)
    while x < 444:
        pave.append('        <rect x="%d" y="%d" width="26" height="18"/>' % (x, y))
        x += 52
pave = "\n".join(pave)

SVG = open(D + "modele.svg", encoding="utf-8").read()
open(D + "tableau.svg", "w", encoding="utf-8").write(
    SVG.replace("__HOUPPE__", houppe).replace("__PAVE__", pave))
print("tableau.svg regenere")
