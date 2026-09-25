<div align="center">

<img src="public/favicon.svg" width="88" alt="사이트 마스코트 몽글이" />

# JUMIN WHO?

전북대학교 컴퓨터공학 박사과정생이자 AI 연구자인 조주민의 한 페이지 개인 사이트입니다.

<https://jumincho.github.io/juminwho/?lang=ko>

[English](README.md) · [简体中文](README.zh-CN.md) · [繁體中文](README.zh-HK.md) · [日本語](README.ja.md) · 한국어

</div>

<picture>
  <source media="(prefers-color-scheme: dark)" srcset="docs/preview-dark.jpg" />
  <img src="docs/preview-light.jpg" alt="첫 화면: 크림색 배경 위의 이름과 정보 카드, 그 옆에 벚꽃 아래에서 찍은 사진과 판다 마스코트" />
</picture>

## 기능

- 말랑하고 포근한 분위기. 라이트 모드는 "크림 모닝", 다크 모드는 "코코아 나이트"입니다. 파스텔 쿠션 패널,
  천천히 떠다니는 블롭, 구름 모양 푸터가 있습니다.
- JUMIN WHO? 이름에 마우스를 올리거나 페이지를 스크롤하면 이름이 통통 튀며 "JUMIN WHO?"로 바뀝니다.
- 1998-07-10부터 소수점 8자리까지 실시간으로 세는 나이 카운터.
- 지금 주민은 몇 시일까요? 내 시간 | 주민 시간 스위치가 달린 시계 카드가 주민의 시간(KST)이나 방문자의 시간을
  보여 주고, 화면에는 드러나지 않는 평일·주말 일과표에 따라 지금 주민의 상태를 알려 줍니다: 아마도… 일하는
  중, 출근 준비 중, 자는 중, 또는 관측되기 전까지 모든 상태가 겹쳐 있는 양자 중첩 중.
- 다섯 가지 언어: English(기본), 简体中文, 繁體中文, 日本語, 한국어. 헤더의 메뉴에서 고르면 그 선택을
  기억하고, `?lang=ko` 같은 링크로 원하는 언어의 페이지를 바로 열 수 있습니다.
- 통나무에 앞발을 걸친 복슬복슬한 아기 판다 마스코트 몽글이. 파비콘, 앱 아이콘, 링크 미리보기(Open Graph)
  이미지가 모두 이 그림에서 나옵니다.
- 장소 앞의 동그란 국기 스티커: 주민의 위치와 각 논문을 발표한 곳.
- 운영체제 설정을 따르다가 직접 고르면 그 값을 기억하는 테마 토글, 이메일 복사 버튼, 인쇄용 스타일.
- 모션 줄이기, 스크린리더, 키보드 탐색을 존중하고, 모든 글자가 WCAG AA 이상의 대비를 갖습니다.
- 콘텐츠 파일은 하나뿐입니다. 모든 언어의 모든 문구가 `src/data/profile.ts`에 있습니다.
- 같은 데이터와 디자인으로 `npm run github-profile`이 그려 내는, 다섯 언어의 GitHub 프로필 README.

## 기술 스택

Vite 7, React 19, TypeScript, 디자인 토큰을 쓰는 CSS Modules, Fontsource(Fredoka, Nunito, Jua),
lucide-react. 중국어와 일본어는 방문자 기기의 시스템 글꼴을 씁니다. 라우터, CMS, 백엔드는 없습니다.
GitHub Actions가 사이트를 빌드해 GitHub Pages에 올립니다.

## 프로젝트 구조

```text
.
├── .github/workflows/deploy.yml  main에 푸시 → 린트 → 빌드 → GitHub Pages에 배포
├── docs/
│   ├── DESIGN.md                 디자인 규칙: 색, 글꼴, 모양, 모션, 언어, 하지 말 것
│   └── preview-*.jpg             README 미리보기 (npm run snapshots -- --readme)
├── public/                       빌드에 그대로 복사되는 파일
│   ├── favicon.svg               마스코트. 다른 아이콘은 모두 여기서 만듭니다
│   ├── favicon.ico, apple-touch-icon.png, icon-*.png, og-image.png   npm run icons로 만듦
│   ├── manifest.webmanifest
│   ├── jumin-cho.jpg
│   └── 404.html                  예전 링크(/blog 등)를 첫 화면으로 돌려보냄
├── scripts/
│   ├── icons.mjs                 아이콘과 링크 미리보기 이미지를 그림
│   ├── snapshots.mjs             모든 언어에서 빌드의 화면과 동작을 점검
│   ├── github-profile.mjs        GitHub 프로필 README(jumincho/jumincho)를 만듦
│   ├── github-profile/           카드, 애니메이션, README 틀, 매일 도는 나이 갱신 스크립트
│   └── lib/                      Chromium 실행, 글꼴, 윤곽선 글자로 HTML → SVG 내보내기
├── src/
│   ├── data/                     profile.ts(다섯 언어로 된 모든 콘텐츠)와 types.ts
│   ├── sections/                 Hero, JuminTime(시계 카드), Publications, Experience, Education, Honors
│   ├── components/               NameFlip, LiveAge, Panel, Timeline, Flag, PlaceName, LanguageMenu 등
│   ├── layout/                   Header, Footer, Backdrop(떠다니는 블롭)
│   ├── hooks/                    useLanguage, useScrolled, useActiveSection, useTheme, useNow, useClockMode
│   ├── lib/                      i18n, theme, clock(시간대와 주민의 일과표), cx
│   ├── styles/                   tokens.css(디자인 토큰), tones.css, global.css, fonts.css
│   ├── App.tsx
│   └── main.tsx
├── vite-plugins/                 siteMeta(<head> 태그), hangulFont(한글 글꼴 서브셋)
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
| `npm run dev` | 개발 서버를 켭니다 |
| `npm run build` | 타입을 검사한 뒤 `dist/`에 빌드합니다 |
| `npm run preview` | 빌드 결과를 로컬에서 띄웁니다 |
| `npm run lint` | ESLint를 실행합니다 |
| `npm run snapshots` | 375px와 1280px, 라이트와 다크, 모든 언어에서 빌드를 점검하고 스크린샷을 `snapshots/`에 남깁니다 |
| `npm run icons` | `favicon.svg`로 파비콘, 앱 아이콘, 링크 미리보기 이미지를 다시 그립니다 |
| `npm run github-profile` | `../jumincho`에 GitHub 프로필 README와 이미지를 다시 만듭니다(아래 참고) |

`snapshots`, `icons`, `github-profile`은 Playwright로 Chromium을 움직입니다. `npx playwright install
chromium`을 한 번 실행하거나, `PLAYWRIGHT_CHROMIUM=/path/to/chrome`으로 이미 있는 브라우저를 지정하세요.

## 콘텐츠 고치기

`src/data/profile.ts`만 고치면 됩니다. 컴포넌트에는 사실 정보나 문구가 없습니다.

| 내보내는 값 | 담고 있는 것 |
| --- | --- |
| `languages` | 메뉴 순서대로 적은 언어, 각 언어의 지역 표시, 그 언어로 쓴 이름, 날짜 로캘 |
| `site` | 페이지 제목, 설명, 주소, 마지막 업데이트 달. `<head>` 태그를 여기서 만듭니다 |
| `profile` | 이름, 별명, 한글 이름, 소개, 소속, 위치, 태어난 시각, 이메일, 사진, 링크 |
| `sections` | 섹션 순서, 제목, 내비게이션 라벨 |
| `publications`, `selfNames` | 학회와 개최지를 포함한 논문, 강조할 본인 이름 표기 |
| `experience`, `education` | 타임라인 항목. 기간은 `{ from, to?, expected? }` |
| `honors`, `certifications` | 수상과 자격 |
| `juminTime` | 시계 카드: 주민의 시간대, 평일·주말 일과표, 문구 |
| `labels` | 인사말, 라벨, 버튼 이름, 스크린리더용 문장 |
| `githubProfile` | GitHub 프로필 README에서만 쓰는 몇 가지 문구와 주소 |

- 문구는 `Localized` 형식입니다. 언어마다 하나씩 `{ en, 'zh-CN', 'zh-HK', ja, ko }`로 적고, 번역이
  하나라도 빠지면 TypeScript가 막습니다. 고유 명사는 그대로 둡니다. 논문 제목, 저자, 학회명은 발표된
  그대로, 연구실과 LinkedIn, GitHub도 그대로입니다.
- 한국어는 어디에 써도 됩니다. 빌드할 때 한글 디스플레이 글꼴(Jua)을 실제로 쓰인 글자만 남기고 줄입니다.
  조주민 세 글자는 모든 페이지에서, 나머지는 페이지가 한국어일 때만 불러옵니다.
- 장소(`profile.location`과 각 논문의 `place`)는 도시, 나라, ISO 국가 코드로 적습니다. 한국, 이탈리아,
  일본은 `src/components/Flag.tsx`에 국기 그림이 있고, 다른 코드는 그림을 추가하기 전까지 지도 핀으로
  보입니다.
- 일과표(`juminTime.routine`)는 KST 기준 하루의 구간을 `{ from, to, state }`로 적습니다. `to`가 `from`보다
  앞선 구간은 자정을 넘기며, 시작한 날에 속합니다. 구간이 겹치면 나중에 시작한 구간이 이깁니다. 카드는
  일과표 자체는 보여 주지 않고 지금 상태만, 언제나 "maybe…"(한국어 페이지에서는 "아마도…") 뒤에
  보여 줍니다.
- 이름, 소개, 소속, 사진을 바꿨다면 `npm run icons`로 링크 미리보기 이미지도 맞추세요.
- 콘텐츠를 바꿨다면 `npm run github-profile`을 실행하고 프로필 저장소에 올려서, GitHub 프로필이 사이트와
  같은 내용을 말하게 하세요.

## 디자인

규칙은 [docs/DESIGN.md](docs/DESIGN.md)에, 모든 색·크기·반경·시간 값은 `src/styles/tokens.css`에
있습니다. 값을 직접 적지 말고 토큰을 쓰거나 새로 추가하세요.

## 배포

`main`에 푸시할 때마다 `.github/workflows/deploy.yml`이 린트와 빌드를 거쳐 사이트를 GitHub Pages에
올립니다. 저장소 설정의 Settings → Pages → Build and deployment → Source는 GitHub Actions로 되어 있어야
합니다. 브랜치는 `main` 하나뿐입니다.

## GitHub 프로필 README

github.com/jumincho의 README는 jumincho/jumincho 저장소에 있고, 이 저장소가 그것을 만듭니다. 그 저장소를
이 저장소 옆에 클론한 다음:

```bash
npm run github-profile                  # ../jumincho에 씁니다
npm run github-profile -- path/to/repo  # 다른 체크아웃에 쓸 수도 있습니다
```

그런 뒤 프로필 저장소에서 커밋하고 푸시하세요. 그 저장소의 README와 이미지는 직접 고치지 않습니다.

- 언어마다 README가 하나씩 있습니다. 프로필 페이지에 보이는 영어 `README.md`와, 나머지 언어의
  `README.<code>.md`입니다. 맨 위의 언어 알약 줄이 서로를 이어 줍니다.
- 모든 이미지는 사이트의 토큰, 톤, 글꼴, 국기, 마스코트로 Chromium에서 배치한
  카드(`scripts/github-profile/cards.css`)를 라이트와 다크 두 가지 SVG로 내보낸 것입니다. README는
  `<picture>`로 보는 사람의 GitHub 테마에 맞는 쪽을 고릅니다.
- 글자는 HarfBuzz로 윤곽선으로 바꾸므로, 이미지에 글꼴이 필요 없고 어느 브라우저에서나 똑같이 보입니다.
  중국어, 일본어, 한국어 본문은 개발 의존성으로 설치한 Noto Sans로 그리며, 브라우저처럼 글꼴 목록에서
  그 글자를 가진 첫 글꼴을 씁니다.
- 넓은 화면에서는 카드가 같은 높이로 두 장씩 나란히 놓이고, 휴대폰에서는 한 장씩 쌓입니다.
- 히어로, 한눈에 보기(At a glance), 푸터 카드는 천천히 움직이고(이름이 9초 주기로 "JUMIN WHO?"로
  바뀌고, 블롭이 떠다니고, 몽글이가 둥실거립니다), 모션 줄이기를 켠 사람에게는 가만히 있습니다.
- 생성기는 프로필 저장소에 `scripts/update-age.mjs`와 `.github/workflows/age.yml`도 씁니다. 이
  워크플로가 매일 00:05(KST)에 모든 언어의 한눈에 보기 카드 속 나이를 의존성 없이 다시 그립니다.
