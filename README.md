<div align="center">

<img src="public/favicon.svg" width="88" alt="마스코트 몽글이" />

# JUMIN WHO?

AI 연구자이자 전북대학교 컴퓨터공학 박사과정생 **조주민(Jumin Cho)**의 한 페이지 개인 사이트

**<https://jumincho.github.io/juminwho/>**

</div>

<picture>
  <source media="(prefers-color-scheme: dark)" srcset="docs/preview-dark.jpg" />
  <img src="docs/preview-light.jpg" alt="사이트 첫 화면: 크림색 배경에 이름, 소개 카드, 벚꽃 아래 사진과 복숭아 마스코트" />
</picture>

## 특징

- **몽글몽글 코지 디자인.** 라이트는 "크림 모닝", 다크는 "코코아 나이트"입니다. 파스텔 쿠션 패널, 천천히 떠다니는
  블롭, 구름 모양 푸터로 꾸몄습니다.
- **JUMIN WHO?** 이름에 마우스를 올리거나 스크롤하면 이름이 말랑하게 튀면서 "JUMIN WHO?"로 바뀝니다.
- **실시간 나이.** 1998-07-10부터 센 나이를 소수점 8자리까지 보여 줍니다.
- **마스코트 몽글이.** 복숭아 모찌 하나로 파비콘, 앱 아이콘, 링크 미리보기(OG) 이미지를 모두 만듭니다.
- **편의 기능.** 테마 토글(기본은 OS 설정), 이메일 복사 버튼, 인쇄용 스타일이 있습니다.
- **접근성.** 모션 줄이기, 스크린리더, 키보드 탐색을 지원하고 글자 대비는 WCAG AA 이상입니다.
- **콘텐츠는 한 파일.** 모든 글은 `src/data/profile.ts`에 있습니다.

## 기술 스택

Vite 7 · React 19 · TypeScript · CSS Modules와 디자인 토큰 · Fontsource(Fredoka, Nunito, Jua) · lucide-react

라우터, CMS, 백엔드는 없습니다. GitHub Actions가 빌드해서 GitHub Pages에 배포합니다.

## 폴더 구조

```text
.
├── .github/workflows/deploy.yml  main에 push하면 lint → build → GitHub Pages 배포
├── docs/
│   ├── DESIGN.md                 디자인 규칙 (색, 타이포, 모션, 금지 사항)
│   └── preview-*.jpg             README 미리보기 (npm run snapshots -- --readme)
├── public/                       빌드 때 그대로 복사되는 파일
│   ├── favicon.svg               마스코트 원본, 모든 아이콘의 출발점
│   ├── favicon.ico, apple-touch-icon.png, icon-*.png, og-image.png   npm run icons로 생성
│   ├── manifest.webmanifest
│   ├── jumin-cho.jpg
│   └── 404.html                  옛 주소(/blog 등)를 홈으로 돌려보냄
├── scripts/
│   ├── icons.mjs                 아이콘과 OG 이미지 렌더링
│   ├── snapshots.mjs             빌드 결과의 화면·동작 검사
│   └── lib/browser.mjs
├── src/
│   ├── data/                     profile.ts(모든 콘텐츠), types.ts
│   ├── sections/                 Hero, Publications, Experience, Education, Honors
│   ├── components/               NameFlip, LiveAge, Panel, Timeline, CopyEmail, ThemeToggle 등
│   ├── layout/                   Header, Footer, Backdrop(배경 블롭)
│   ├── hooks/                    useScrolled, useActiveSection, useTheme
│   ├── lib/                      cx, theme
│   ├── styles/                   tokens.css(디자인 토큰), global.css, fonts.css
│   ├── App.tsx
│   └── main.tsx
├── vite-plugins/                 siteMeta(<head> 메타 태그), hangulFont(한글 폰트 서브셋)
├── index.html
└── vite.config.ts
```

## 시작하기

Node.js 20.19 이상 또는 22.12 이상이 필요합니다.

```bash
npm ci
npm run dev        # http://localhost:5173
```

| 명령 | 하는 일 |
| --- | --- |
| `npm run dev` | 개발 서버 |
| `npm run build` | 타입 검사 후 `dist/`로 빌드 |
| `npm run preview` | 빌드 결과 미리보기 |
| `npm run lint` | ESLint |
| `npm run snapshots` | 빌드 결과를 375/1280px, 라이트/다크에서 검사하고 스크린샷을 `snapshots/`에 저장 |
| `npm run icons` | `favicon.svg`에서 파비콘, 앱 아이콘, OG 이미지를 다시 생성 |

`snapshots`와 `icons`는 Playwright의 Chromium을 씁니다. 처음 한 번 `npx playwright install chromium`을
실행하거나, 이미 설치된 브라우저를 `PLAYWRIGHT_CHROMIUM=/path/to/chrome`로 지정하세요.

## 콘텐츠 수정

`src/data/profile.ts`만 고치면 됩니다. 컴포넌트에는 사실 정보나 문구를 쓰지 않습니다.

| 이름 | 내용 |
| --- | --- |
| `site` | 페이지 제목, 설명, 주소, 마지막 수정일. `<head>` 메타 태그도 여기서 만듭니다 |
| `profile` | 이름, 별칭, 한글 이름, 한 줄 소개, 소속, 생년월일시, 이메일, 사진, 링크 |
| `sections` | 섹션 순서, 제목, 내비게이션 라벨 |
| `publications`, `selfNames` | 논문, 강조할 본인 이름 표기 |
| `experience`, `education` | 타임라인 항목. 기간은 `{ from, to?, expected? }` |
| `honors`, `certifications` | 수상, 자격 |
| `labels` | 인사말, 라벨, 버튼 이름, 스크린리더 문장 |

- 한글을 새로 넣어도 됩니다. 빌드할 때 쓰인 글자만 골라 한글 폰트(Jua)를 자동으로 서브셋합니다.
- 이름, 소개, 소속, 사진을 바꿨다면 `npm run icons`로 OG 이미지도 새로 만드세요.

## 디자인

규칙은 [`docs/DESIGN.md`](docs/DESIGN.md)에, 색·크기·반경·모션 값은 `src/styles/tokens.css`에 있습니다. 새 값을
하드코딩하지 말고 토큰을 쓰거나 늘려 주세요.

## 배포

`main`에 push하면 `.github/workflows/deploy.yml`이 lint와 build를 거쳐 GitHub Pages에 배포합니다. 저장소 설정의
**Settings → Pages → Build and deployment → Source**가 **GitHub Actions**로 되어 있어야 합니다. 브랜치는 `main`
하나만 씁니다.
