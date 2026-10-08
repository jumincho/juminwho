# 작업 안내

이 저장소는 조주민(Jumin Cho)의 한 페이지 개인 사이트 <https://jumincho.github.io/juminwho/>와, 같은 내용으로
만드는 GitHub 프로필 README(jumincho/jumincho)의 원본입니다. Vite + React 19 + TypeScript, CSS Modules로
만듭니다. 무엇을 고치든 아래 규칙을 지킵니다. 디자인의 자세한 기준은 [DESIGN.md](DESIGN.md)에 있습니다.

## 콘텐츠

- 콘텐츠(사실 정보와 화면 문구)는 전부 `src/data/profile.ts`에만 있습니다. JSX에 사실 정보를 직접 쓰지 않습니다.
- 모든 사실은 LinkedIn 프로필이나 인용할 수 있는 기록으로 확인할 수 있어야 합니다. 지어낸 소개글이나 숫자는
  넣지 않습니다.

## 언어

- 사이트와 GitHub 프로필은 다섯 언어(English 기본, 한국어, 简体中文, 繁體中文, 日本語)이고, 메뉴·README·언어
  알약 모두 이 순서입니다(`profile.ts`의 `languages`).
- 문구는 `Localized`(`{ en, ko, 'zh-CN', 'zh-HK', ja }`)로 다섯 언어를 같은 순서로 모두 채웁니다. 논문 제목·저자·
  학회명, 연구실, LinkedIn, GitHub 같은 고유 명사는 번역하지 않습니다.
- 언어는 `?lang=` → `localStorage`의 `juminwho:lang` → 영어 순서로 정합니다. 이 키와 매개변수는
  `src/lib/i18n.ts`와 `index.html`의 인라인 스크립트가 함께 씁니다.
- 저장소 README도 `README.md`(영어)와 `README.<code>.md` 네 개가 있으니, 내용을 바꾸면 다섯 개를 함께 고칩니다.

## 디자인과 모션

- 디자인 규칙은 [DESIGN.md](DESIGN.md), 토큰은 `src/styles/tokens.css`를 따릅니다. 몽글몽글·코지: 크림/코코아
  색, 파스텔 톤, 둥근 쿠션 패널, 느리고 작은 모션.
- 모션은 언제나 모션 줄이기(`prefers-reduced-motion`)를 존중합니다. CSS 애니메이션은
  `prefers-reduced-motion: no-preference` 안에만 두고, 스크립트로 움직이는 것은 `src/lib/motion.ts`를 따릅니다.
- 배경은 `src/lib/mochi-field.ts`의 작은 WebGL 셰이더가 그리고, WebGL을 쓸 수 없으면 CSS 블롭이 대신합니다. 두
  경로가 같은 자리, 같은 색으로 보이게 유지합니다.
- 화면 전체가 움직이는 전환은 테마를 바꿀 때의 원과 언어를 바꿀 때의 교차 페이드뿐입니다. 스크롤에 따라
  나타나는 효과, 패럴랙스, 화면을 밀거나 넘기는 페이지 전환, 자동 재생 캐러셀, 무거운 애니메이션·셰이더
  라이브러리는 쓰지 않습니다.

## 반드시 유지할 아이덴티티 요소

- 이름에 마우스를 올리거나 스크롤하면 바뀌는 "JUMIN WHO?"
- 1998-07-10 기준 실시간 나이 카운터
- 마스코트 몽글이(`public/favicon.svg`). 그림 안의 새싹(`sprout`)과 눈(`eyes`) 그룹은 사이트와 GitHub 프로필의
  애니메이션이 쓰므로 남겨 둡니다.
- Jumin 시계

## Jumin 시계

- `src/sections/JuminTime.tsx`: Local | Jumin 스위치로 방문자 시간과 Jumin 시간(KST)을 보여 주고, KST
  일과표(`profile.ts`의 `juminTime.routine`)로 상태를 정합니다.
- 모든 상태 앞에는 반드시 "maybe…"(다른 언어에서는 `juminTime.maybe`의 같은 뜻의 말)를 붙입니다.
- 일과표 자체와 "until …" 같은 다음 상태 시각은 화면에 보여 주지 않고, 장소 줄·하루 리본·시차 줄도 두지
  않습니다(자리를 줄이기 위해 뺌).
- 일과표를 바꾸면 `scripts/snapshots.mjs`의 `routineCases`도 맞춥니다.

## 확인과 생성

- 고친 뒤에는 `npm run lint`와 `npm run build`가 통과해야 하고, `npm run snapshots`로 375px/1280px,
  라이트/다크, 모든 언어, 모션 줄이기, WebGL이 없는 경우를 확인합니다.
- 첫 화면이 바뀌면 `npm run snapshots -- --readme`로 README 미리보기도 새로 만듭니다.
- 마스코트·팔레트·이름·소개를 바꾸면 `npm run icons`로 아이콘과 OG 이미지를 다시 만듭니다.
- GitHub 프로필 README(jumincho/jumincho)는 `npm run github-profile`로 이 저장소에서 만듭니다
  (`scripts/github-profile/`). `profile.ts`·마스코트·팔레트를 바꾸면 다시 만들어 그 저장소의 `main`에 올리고,
  그 저장소의 README와 이미지는 직접 고치지 않습니다.

## 브랜치와 커밋

- 브랜치는 `main` 하나만 유지합니다(이 저장소와 jumincho/jumincho 모두). 확인을 통과한 변경은 `main`에 바로
  올리고, 작업 브랜치를 원격에 남기지 않습니다.
- 커밋의 작성자와 커미터는 `Jumin Cho <77545063+jumincho@users.noreply.github.com>`로 남기고, 공동 작성자
  꼬리말은 붙이지 않습니다. 프로필 저장소의 매일 나이 갱신 커밋만 `github-actions[bot]`이 남깁니다.

## 하지 말 것

- 블로그·관리자 기능·Supabase·Mapbox는 2026-09 개편에서 제거했습니다. 다시 추가하지 않습니다.

## 논문 블로그 규칙 (블로그 기능을 복원할 경우에만 적용)

1. 논문 글은 한국어와 영어 두 버전으로 씁니다.
2. 논문 내용은 자세히 씁니다. 특히 실험 설정을 어떻게 했는지 빠뜨리지 않습니다.
3. 영어로 쓸 때는 논문의 영어 표현을 주로 씁니다.
4. 피규어는 정확하게 캡처합니다.
5. 실험 결과 테이블은 반드시 넣습니다.
6. 만든 데이터는 반드시 데이터베이스에 넣습니다.
7. 논문 리뷰 결과(accept/reject)가 있으면 리뷰어 코멘트, 점수, 리젝 사유도 자세히 넣습니다.
