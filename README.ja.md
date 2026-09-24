<div align="center">

<img src="public/favicon.svg" width="88" alt="サイトのマスコット、Mongle" />

# JUMIN WHO?

全北大学校コンピュータサイエンス博士課程に在籍する AI 研究者、Jumin Cho の 1 ページの個人サイトです。

<https://jumincho.github.io/juminwho/?lang=ja>

[English](README.md) · [简体中文](README.zh-CN.md) · [繁體中文](README.zh-HK.md) · 日本語 · [한국어](README.ko.md)

</div>

<picture>
  <source media="(prefers-color-scheme: dark)" srcset="docs/preview-dark.jpg" />
  <img src="docs/preview-light.jpg" alt="最初の画面：クリーム色の背景に名前とプロフィールカード、その横に桜の下で撮った写真と桃のマスコット" />
</picture>

## 特徴

- やわらかく、ほっこりした雰囲気。ライトモードは「クリームの朝」、ダークモードは「ココアの夜」です。パステルカラーのクッションのようなパネル、ゆっくり漂うブロブ、雲の形のフッターがあります。
- JUMIN WHO? 名前にカーソルを合わせるか、ページをスクロールすると、名前がぽよんと跳ねて「JUMIN WHO?」に変わります。
- 1998-07-10 から小数点以下 8 桁までリアルタイムで数える年齢カウンター。
- ジュミンは今、何時？ 「ローカル | ジュミン」の切り替えスイッチが付いた時計カードが、ジュミンの時間（KST）か訪問者の時間を表示し、画面には出さない平日・週末の日課表から、ジュミンが今たぶん何をしているかを教えてくれます。たぶん… 仕事中、出勤準備中、おやすみ中、または観測されるまであらゆる状態が重なり合った、量子の重ね合わせ中。
- 5 つの言語：English（既定）、简体中文、繁體中文、日本語、한국어。ヘッダーのメニューで選ぶと選択を覚えておき、`?lang=ja` のようなリンクでその言語のページを直接開けます。
- 桃のお餅のマスコット、Mongle。ファビコン、アプリアイコン、リンクプレビュー（Open Graph）画像はすべてこの絵から作られます。
- 地名の前の丸い国旗ステッカー：ジュミンが拠点にしている場所と、各論文を発表した場所。
- OS の設定に従い、自分で選ぶとそれを覚えるテーマ切り替え、メールアドレスのコピーボタン、印刷用スタイル。
- モーション軽減の設定、スクリーンリーダー、キーボード操作に配慮し、すべての文字が WCAG AA 以上のコントラストを持ちます。
- コンテンツのファイルは 1 つだけです。すべての言語のすべての文言が `src/data/profile.ts` にあります。
- 同じデータとデザインから `npm run github-profile` が描き出す、5 言語の GitHub プロフィール README。

## 技術スタック

Vite 7、React 19、TypeScript、デザイントークンを使う CSS Modules、Fontsource（Fredoka、Nunito、Jua）、lucide-react。中国語と日本語は訪問者のデバイスのシステムフォントを使います。ルーター、CMS、バックエンドはありません。GitHub Actions がサイトをビルドして GitHub Pages に公開します。

## プロジェクト構成

```text
.
├── .github/workflows/deploy.yml  main へのプッシュ → リント → ビルド → GitHub Pages へデプロイ
├── docs/
│   ├── DESIGN.md                 デザインのルール：色、書体、形、モーション、言語、してはいけないこと
│   └── preview-*.jpg             README のプレビュー（npm run snapshots -- --readme）
├── public/                       そのままビルドにコピーされるファイル
│   ├── favicon.svg               マスコット。ほかのアイコンはすべてここから作ります
│   ├── favicon.ico, apple-touch-icon.png, icon-*.png, og-image.png   npm run icons で生成
│   ├── manifest.webmanifest
│   ├── jumin-cho.jpg
│   └── 404.html                  古いリンク（/blog など）をトップページへ戻す
├── scripts/
│   ├── icons.mjs                 アイコンとリンクプレビュー画像を描く
│   ├── snapshots.mjs             すべての言語でビルドの見た目と動作をチェック
│   ├── github-profile.mjs        GitHub プロフィール README（jumincho/jumincho）を生成
│   ├── github-profile/           カード、アニメーション、README のテンプレート、毎日の年齢更新スクリプト
│   └── lib/                      Chromium の起動、フォント、文字をアウトライン化した HTML → SVG 書き出し
├── src/
│   ├── data/                     profile.ts（5 言語のすべてのコンテンツ）と types.ts
│   ├── sections/                 Hero、JuminTime（時計カード）、Publications、Experience、Education、Honors
│   ├── components/               NameFlip、LiveAge、Panel、Timeline、Flag、PlaceName、LanguageMenu など
│   ├── layout/                   Header、Footer、Backdrop（漂うブロブ）
│   ├── hooks/                    useLanguage、useScrolled、useActiveSection、useTheme、useNow、useClockMode
│   ├── lib/                      i18n、theme、clock（タイムゾーンとジュミンの日課表）、cx
│   ├── styles/                   tokens.css（デザイントークン）、tones.css、global.css、fonts.css
│   ├── App.tsx
│   └── main.tsx
├── vite-plugins/                 siteMeta（<head> タグ）、hangulFont（ハングルフォントのサブセット）
├── index.html
└── vite.config.ts
```

## はじめに

Node.js 20.19 以上、または 22.12 以上が必要です。

```bash
npm ci
npm run dev        # http://localhost:5173
```

| コマンド | 内容 |
| --- | --- |
| `npm run dev` | 開発サーバーを起動します |
| `npm run build` | 型チェックのあと、`dist/` にビルドします |
| `npm run preview` | ビルド結果をローカルで配信します |
| `npm run lint` | ESLint を実行します |
| `npm run snapshots` | 375px と 1280px、ライトとダーク、すべての言語でビルドをチェックし、スクリーンショットを `snapshots/` に保存します |
| `npm run icons` | `favicon.svg` からファビコン、アプリアイコン、リンクプレビュー画像を描き直します |
| `npm run github-profile` | `../jumincho` に GitHub プロフィールの README と画像を作り直します（下記参照） |

`snapshots`、`icons`、`github-profile` は Playwright で Chromium を動かします。一度 `npx playwright install chromium` を実行するか、`PLAYWRIGHT_CHROMIUM=/path/to/chrome` で手元のブラウザーを指定してください。

## コンテンツの編集

編集するのは `src/data/profile.ts` だけです。コンポーネントは事実も文言も持ちません。

| エクスポート | 中身 |
| --- | --- |
| `languages` | メニュー順の言語と、それぞれの地域コード、その言語で書いた名前、日付のロケール |
| `site` | ページのタイトル、説明、アドレス、最終更新月。`<head>` タグはここから作られます |
| `profile` | 名前、別名、韓国語の名前、キャッチフレーズ、所属、拠点、生まれた時刻、メール、写真、リンク |
| `sections` | セクションの順序、見出し、ナビゲーションのラベル |
| `publications`、`selfNames` | 学会と開催地つきの論文と、強調する本人の名前の表記 |
| `experience`、`education` | タイムラインの項目。期間は `{ from, to?, expected? }` |
| `honors`、`certifications` | 受賞と資格 |
| `juminTime` | 時計カード：ジュミンのタイムゾーン、平日・週末の日課表、文言 |
| `labels` | あいさつ、ラベル、ボタン名、スクリーンリーダー向けの文 |
| `githubProfile` | GitHub プロフィール README だけで使う、いくつかの文言とアドレス |

- 文言は `Localized` です。言語ごとに 1 つずつ `{ en, 'zh-CN', 'zh-HK', ja, ko }` と書き、翻訳が 1 つでも欠けると TypeScript が通しません。固有名詞はそのままにします。論文のタイトル、著者、学会名は発表されたとおり、研究室と LinkedIn、GitHub もそのままです。
- 韓国語はどこに書いても大丈夫です。ビルド時に韓国語の見出し用フォント（Jua）を、実際に使われている文字だけに絞ります。조주민の 3 文字はすべてのページで、それ以外はページが韓国語のときだけ読み込みます。
- 場所（`profile.location` と各論文の `place`）は、都市、国、ISO 国コードで書きます。韓国、イタリア、日本は `src/components/Flag.tsx` に国旗の絵があり、ほかのコードは絵を追加するまで地図のピンで表示されます。
- 日課表（`juminTime.routine`）は、KST での 1 日の区間を `{ from, to, state }` で並べます。`to` が `from` より前の区間は日付をまたぎ、始まった日に属します。区間が重なるときは、あとに始まった区間が優先されます。カードは日課表そのものは見せず、今の状態だけを、いつも「maybe…」（日本語のページでは「たぶん…」）のあとに表示します。
- 名前、キャッチフレーズ、所属、写真を変えたら、`npm run icons` でリンクプレビュー画像も合わせてください。
- コンテンツを変えたら `npm run github-profile` を実行してプロフィールのリポジトリにプッシュし、GitHub プロフィールがサイトと同じ内容を伝えるようにしてください。

## デザイン

ルールは [docs/DESIGN.md](docs/DESIGN.md)（韓国語）に、すべての色、サイズ、角の丸み、時間の値は `src/styles/tokens.css` にあります。値を直接書かず、トークンを使うか新しく追加してください。

## デプロイ

`main` にプッシュするたびに `.github/workflows/deploy.yml` が、リントとビルドを経てサイトを GitHub Pages に公開します。リポジトリ設定の Settings → Pages → Build and deployment → Source は GitHub Actions にしておく必要があります。ブランチは `main` だけです。

## GitHub プロフィール README

github.com/jumincho の README は jumincho/jumincho リポジトリにあり、このリポジトリがそれを生成します。そのリポジトリをこのリポジトリの隣にクローンしてから：

```bash
npm run github-profile                  # ../jumincho に書き出します
npm run github-profile -- path/to/repo  # 別のチェックアウトにも書き出せます
```

そのあと、プロフィールのリポジトリでコミットしてプッシュしてください。そのリポジトリの README と画像は手で編集しません。

- 言語ごとに README が 1 つずつあります。プロフィールページに表示される英語の `README.md` と、ほかの言語の `README.<code>.md` です。いちばん上に並ぶ言語のピルがそれぞれをつなぎます。
- 画像はすべて、サイトのトークン、トーン、フォント、国旗、マスコットを使って Chromium でレイアウトしたカード（`scripts/github-profile/cards.css`）を、ライトとダークの 2 種類の SVG に書き出したものです。README は `<picture>` で、閲覧者の GitHub のテーマに合うほうを選びます。
- 文字は HarfBuzz でアウトライン化するので、画像にフォントは要らず、どのブラウザーでも同じに見えます。中国語、日本語、韓国語の本文は開発用の依存パッケージとしてインストールした Noto Sans で描き、ブラウザーと同じように、フォントの並びの中でその文字を持つ最初のフォントを使います。
- 広い画面ではカードが同じ高さで 2 枚ずつ並び、スマートフォンでは 1 枚ずつ縦に積まれます。
- ヒーロー、プロフィール（At a glance）、フッターのカードはゆっくり動き（名前が 9 秒周期で「JUMIN WHO?」に変わり、ブロブが漂い、Mongle がふわふわ揺れます）、モーション軽減を設定している人には静止して見えます。
- 生成スクリプトは、プロフィールのリポジトリに `scripts/update-age.mjs` と `.github/workflows/age.yml` も書き出します。このワークフローが毎日 00:05（KST）に、すべての言語のプロフィールカードの年齢を、依存パッケージなしで描き直します。
