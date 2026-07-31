#!/usr/bin/env python3
"""
figs/work/ 안의 원본 그림을 웹용으로 정리한다.

  python3 optimize-figs.py

- 가로 1600px 로 축소 (이미 작으면 그대로)
- PNG 는 팔레트 최적화, JPG 는 quality 86
- 200KB 를 넘으면 한 번 더 줄여서 알려준다
원본을 덮어쓰지 않고 figs/work/ 안에서 같은 이름으로 정리하므로,
원본을 보관하려면 figs/work/original/ 같은 폴더에 따로 두세요.
"""
import os
import sys

try:
    from PIL import Image
except ImportError:
    sys.exit("Pillow 가 필요합니다:  pip install pillow")

SRC = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'figs', 'work')
MAX_W = 1600
WARN_KB = 250

if not os.path.isdir(SRC):
    sys.exit(f"{SRC} 폴더가 없습니다.")

files = [f for f in sorted(os.listdir(SRC))
         if f.lower().endswith(('.png', '.jpg', '.jpeg')) and not f.startswith('.')]

if not files:
    sys.exit(f"{SRC} 에 이미지가 없습니다.")

for name in files:
    path = os.path.join(SRC, name)
    before = os.path.getsize(path) / 1024
    im = Image.open(path)
    w, h = im.size

    if w > MAX_W:
        im = im.resize((MAX_W, round(h * MAX_W / w)), Image.LANCZOS)

    if name.lower().endswith('.png'):
        im.convert('RGBA').save(path, 'PNG', optimize=True)
    else:
        im.convert('RGB').save(path, 'JPEG', quality=86,
                               optimize=True, progressive=True)

    after = os.path.getsize(path) / 1024
    flag = '  ← 아직 큽니다' if after > WARN_KB else ''
    print(f"  {name:34s} {w}x{h} → {im.size[0]}x{im.size[1]}   "
          f"{before:6.0f}KB → {after:6.0f}KB{flag}")

print("\n완료. 브라우저를 새로고침하세요.")
