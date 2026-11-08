"""Junta início e fim de cada demonstração numa imagem só (para o álbum das 5h no Telegram).

    python3 scripts/juntar-demos.py   (precisa de Pillow: pip install pillow)

Gera public/img/exercicios/<id>.jpg a partir de <id>-0.jpg e <id>-1.jpg.
"""
import glob
import os

from PIL import Image, ImageDraw

DIR = os.path.join(os.path.dirname(__file__), "..", "public", "img", "exercicios")
GAP = 8

for first in sorted(glob.glob(os.path.join(DIR, "*-0.jpg"))):
    base = first[: -len("-0.jpg")]
    a, b = Image.open(first).convert("RGB"), Image.open(base + "-1.jpg").convert("RGB")
    h = min(a.height, b.height)
    a, b = (im.resize((int(im.width * h / im.height), h)) for im in (a, b))
    out = Image.new("RGB", (a.width + b.width + GAP, h), "white")
    out.paste(a, (0, 0))
    out.paste(b, (a.width + GAP, 0))
    draw = ImageDraw.Draw(out)
    for x, label in ((8, "1 início"), (a.width + GAP + 8, "2 fim")):
        draw.rounded_rectangle((x, h - 34, x + 78, h - 8), radius=12, fill=(0, 0, 0))
        draw.text((x + 10, h - 29), label, fill="white")
    out.save(base + ".jpg", quality=80, optimize=True)
print("ok")
