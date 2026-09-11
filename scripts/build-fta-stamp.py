"""Regenerate the FTA stamp artwork with the approved wording.

The shipped asset had "FTA-approved Tax Agency firm" baked into the pixels. The
approved claim is "FTA Registered Tax Agency". Only the two bold lines are
redrawn; the frame, the authority mark and the registration number are the
original artwork and are never resampled twice by accident -- the edit happens
in a 45-degree-flattened space and is rotated back with the same expand/crop.

Run from the repo root: python3 scripts/build-fta-stamp.py

It reads and rewrites the shipped asset in place, and is safe to re-run: the
erased band is fixed geometry, not wording, so changing LINES and running again
re-sets both bold lines. Every constant below was measured off the artwork --
do not adjust one without re-measuring. Regenerating needs Futura, which ships
with macOS; on any other machine the face has to be substituted deliberately.
"""
from PIL import Image, ImageDraw, ImageFont, ImageFilter
import numpy as np

SRC = PNG = "public/fta-stamp.png"
WEBP = "public/fta-stamp.webp"
SCALE = 4                      # 440 -> 1760 working resolution
ANGLE = 45                     # rotation that levels frame and text
FONT = ("/System/Library/Fonts/Futura.ttc", 0)   # Futura Medium
INK = (52, 45, 116)

CAP_H = 91                     # measured from the original 'FTA'
BASELINES = (1278, 1423)       # measured baselines of the two bold lines
CENTER_X = 1245
ERASE = (600, 1165, 1900, 1475)
LINES = ("FTA Registered", "Tax Agency")

DILATE = 5                     # emulates ink spread (Medium -> stamped weight)
TRACK = 3.53                   # the original carries slight letter-spacing
GRAIN_FINE, GRAIN_COARSE = 1.2, 5.5
GRAIN_AMP = 24
GRAIN_LO, GRAIN_HI = 62, 120   # smoothstep window, tuned to the original stats


def font_for_cap_height(path, index, cap_px):
    """Futura's cap height is not the em box; solve for the size that hits it."""
    probe = 200
    f = ImageFont.truetype(path, probe, index=index)
    bb = f.getbbox("F")
    cap = bb[3] - bb[1]
    return ImageFont.truetype(path, max(1, round(probe * cap_px / cap)), index=index)


def grain(size, rng):
    w, h = size
    def octave(sigma):
        n = rng.integers(0, 256, (h, w), dtype=np.uint8)
        return np.asarray(Image.fromarray(n).filter(ImageFilter.GaussianBlur(sigma)), dtype=np.float32)
    f = octave(GRAIN_FINE); c = octave(GRAIN_COARSE)
    def norm(a):
        return (a - a.mean()) / (a.std() + 1e-6)
    g = 0.6 * norm(f) + 0.4 * norm(c)
    g = 128 + GRAIN_AMP * g
    t = np.clip((g - GRAIN_LO) / (GRAIN_HI - GRAIN_LO), 0, 1)
    return t * t * (3 - 2 * t)          # smoothstep


def main():
    src = Image.open(SRC).convert("RGBA")
    w0, h0 = src.size
    big = src.resize((w0 * SCALE, h0 * SCALE), Image.LANCZOS)
    flat = big.rotate(ANGLE, resample=Image.BICUBIC, expand=True, fillcolor=(0, 0, 0, 0))

    # --- erase the two bold lines, leaving frame, mark and reg. number intact
    px = np.array(flat)
    x0, y0, x1, y1 = ERASE
    px[y0:y1, x0:x1, 3] = 0
    flat = Image.fromarray(px)

    # --- render the approved wording on its own layer
    font = font_for_cap_height(*FONT, CAP_H)
    layer = Image.new("L", flat.size, 0)
    d = ImageDraw.Draw(layer)
    top = font.getbbox("F")[3]
    for text, baseline in zip(LINES, BASELINES):
        width = sum(font.getlength(c) for c in text) + TRACK * (len(text) - 1)
        x = CENTER_X - width / 2
        for ch in text:
            d.text((x, baseline - top), ch, font=font, fill=255)
            x += font.getlength(ch) + TRACK

    if DILATE:
        layer = layer.filter(ImageFilter.MaxFilter(DILATE))

    rng = np.random.default_rng(20260911)
    a = np.asarray(layer, dtype=np.float32) * grain(flat.size, rng)
    text_alpha = Image.fromarray(np.clip(a, 0, 255).astype(np.uint8))

    ink = Image.new("RGBA", flat.size, INK + (0,))
    ink.putalpha(text_alpha)
    flat = Image.alpha_composite(flat, ink)

    # --- rotate back; expand+centre-crop restores the original registration
    back = flat.rotate(-ANGLE, resample=Image.BICUBIC, expand=True, fillcolor=(0, 0, 0, 0))
    bw, bh = back.size
    tw, th = w0 * SCALE, h0 * SCALE
    back = back.crop(((bw - tw) // 2, (bh - th) // 2, (bw - tw) // 2 + tw, (bh - th) // 2 + th))
    out = back.resize((w0, h0), Image.LANCZOS)

    out.save(PNG, optimize=True)
    out.save(WEBP, format="WEBP", quality=92, method=6)
    stats = np.asarray(text_alpha, dtype=np.float32)
    inside = stats > 20
    print("wrote %s and %s" % (PNG, WEBP))
    print("grain: mean %.1f  solid %.2f" % (stats[inside].mean(), (stats[inside] > 240).mean()))


main()
