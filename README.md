# SEUNGSUKAM.github.io

개인 홈페이지. 오프화이트 캔버스 + 세리프 디스플레이 + 파스텔 그러데이션의 편집 매거진 톤.

## 파일 구조

```
index.html              뼈대와 섹션 순서만 (거의 고칠 일 없음)
assets/data.js          ★ 내용 — 여기만 고치면 됩니다
assets/style.css        디자인 (색·간격은 맨 위 :root 토큰)
assets/app.js           data.js 를 화면에 그리는 코드 + 카드 일러스트 SVG
favicon.ico / favicon-32.png / apple-touch-icon.png   주소창·홈화면 아이콘
figs/profile-web.jpg      웹용 프로필 (900×1092, 73 KB)
figs/informs2025-web.jpg  히어로 배너 (2000×1125, 176 KB)
figs/work/*.webp          Selected work 카드 도표 6장 (각 60~120 KB)
figs/work/original/       도표 원본 PNG (git 제외)
figs/profile.jpg          프로필 원본 (보관용)
figs/iise2025.jpg         발표 사진 원본 (보관용, 2.2 MB)
dev-server.js             로컬 미리보기 서버
optimize-figs.py          figs/work/ 그림 일괄 축소·압축
```

## 로컬에서 실시간으로 보기

```bash
node dev-server.js        # → http://localhost:5173
```

파일을 저장하면 브라우저가 자동으로 새로고침됩니다. 포트가 사용 중이면 다음 번호로 자동 이동합니다.

Remote-SSH로 접속 중이라면 VS Code 하단 **포트(PORTS)** 탭에서 `5173` 을 포워딩한 뒤
🌐 아이콘을 눌러 로컬 브라우저로 여세요.

## 페이지 순서

1. **Hero** — 발표 사진(풀블리드) → 이름 · 한 줄 소개 · 프로필 사진
2. **About** — 기본 정보 · 소개글 · 관심분야
3. **Selected work** — 프로젝트 4개 (카드마다 전용 일러스트)
4. **Papers** — 저널 / 학회 구분
5. **Talks & presentations**
6. **Teaching / Education & awards**
7. **Research collaborations** — 협업 기관
8. **CTA + Footer**

섹션 순서는 `index.html` 의 `<section>` 순서만 바꾸면 됩니다.

## 내용 수정하기 — `assets/data.js`

| 항목 | 키 | 비고 |
|---|---|---|
| 이름·소개·히어로 문구 | `profile` | `heroLine` 에는 `<em class="serif-em">` 로 이탤릭 강조 가능 |
| 히어로 배너 사진 | `profile.heroPhoto` | `src:''` 로 두면 배너가 사라집니다 |
| 프로필 사진 | `profile.photo` | 히어로 오른쪽에 표시 |
| 기본 정보 목록 | `profile.facts` | About 왼쪽 열에 표시 |
| 링크 | `links` | **LinkedIn 은 비어 있습니다** — URL 을 넣어야 표시됩니다 |
| 협업 기관 | `collaborators` | `logo:'figs/logos/xxx.svg'` 를 넣으면 글자 대신 로고 이미지 |
| 프로젝트 | `work` | `art`: `anomaly`/`irregular`/`survival`/`dosing`/`forecast`, `orb`: 파스텔 색, `image`: 사진 경로(있으면 일러스트 대체) |
| 논문 | `publications.journal`, `publications.conference` | |
| 발표 | `talks` | `kind`: `Oral`/`Poster`/`Invited`/`Seminar` |
| 조교 | `teaching` | `term`/`course`/`role`/`org`/`note` |
| 학력·수상 | `education`, `awards` | |
| 맺음말 | `cta` | |

- 항목 추가: `{ ... }` 블록을 복사해 붙여넣고 쉼표로 구분. **연도순 정렬은 자동**이라 아무 위치에나 넣어도 됩니다.
- 저자 목록의 내 이름은 `profile.meName` 기준으로 자동 강조됩니다.
- 개수 배지도 자동 계산됩니다.

### 기관 로고를 실제 이미지로 바꾸려면

1. `figs/logos/` 폴더를 만들고 SVG 또는 PNG 를 넣습니다 (배경 투명, 높이 100px 이상 권장).
2. `data.js` 의 해당 항목에 `logo: 'figs/logos/kaist.svg'` 를 적습니다.
3. 흑백으로 표시되고 마우스를 올리면 원래 색으로 돌아옵니다.

### Selected work 도표를 교체할 때

1. **1600 × 900 (16:9)** 로 만듭니다. 다른 비율이면 여백이 생깁니다.
2. 선은 굵게 — 카드에서 562px로 2.85배 축소되므로 **10px 이상**, 글자는 **34px 이상**이어야 읽힙니다.
3. `figs/work/` 에 넣고 `python3 optimize-figs.py` 실행 (WebP 변환 시 1.3MB → 60KB 수준).
4. `data.js` 의 해당 프로젝트 `image` 경로를 맞춥니다.

파일이 없거나 로드에 실패하면 내장 SVG 일러스트로 자동 대체되므로 중간에 깨지지 않습니다.

### 사진을 새로 넣을 때

큰 사진은 그대로 올리면 무겁습니다. 다음처럼 줄여서 쓰세요.

```bash
python3 -c "
from PIL import Image, ImageOps
im = ImageOps.exif_transpose(Image.open('figs/원본.jpg'))
im.thumbnail((1600, 1600), Image.LANCZOS)
im.convert('RGB').save('figs/새이름-web.jpg', quality=84, optimize=True, progressive=True)
"
```

## 배포

`main` 브랜치에 push 하면 GitHub Pages 가 그대로 서빙합니다. 빌드 단계 없음.
