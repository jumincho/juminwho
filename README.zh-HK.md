<div align="center">

<img src="public/favicon.svg" width="88" alt="網站吉祥物 Mongle" />

# JUMIN WHO?

全北大學計算機科學博士生、AI 研究員 Jumin Cho 的單頁個人網站。

<https://jumincho.github.io/juminwho/?lang=zh-HK>

[English](README.md) · [简体中文](README.zh-CN.md) · 繁體中文 · [日本語](README.ja.md) · [한국어](README.ko.md)

</div>

<picture>
  <source media="(prefers-color-scheme: dark)" srcset="docs/preview-dark.jpg" />
  <img src="docs/preview-light.jpg" alt="網站第一個畫面：奶油色背景上的名字和資料卡，旁邊是在櫻花樹下拍的相片和熊貓吉祥物" />
</picture>

## 特色

- 柔軟、溫馨的氛圍。淺色模式是「奶油早晨」，深色模式是「可可夜晚」：粉彩色的軟墊面板、緩緩飄動的色塊和雲朵形狀的頁尾。
- JUMIN WHO? 把滑鼠停在名字上，或者捲動頁面，名字就會彈一下，變成「JUMIN WHO?」。
- 由 1998-07-10 起即時計算、準確至小數點後 8 位的年齡計數器。
- Jumin 那邊現在幾點？附有「本地 | Jumin」開關的時鐘卡會顯示 Jumin 的時間（KST）或訪客的時間，並根據不會在頁面上顯示的平日與週末作息表，告訴你 Jumin 現在也許在做甚麼：也許……在工作、在準備上班、在睡覺，或者處於量子疊加態——在被觀測之前，所有狀態同時存在。
- 五種語言：English（預設）、简体中文、繁體中文、日本語和한국어，可在頁首的選單中選擇。選擇會被記住，`?lang=zh-HK` 這樣的連結可以直接以該語言開啟頁面。
- 把前爪搭在圓木上的毛茸茸熊貓寶寶吉祥物 Mongle。網站圖示（favicon）、應用程式圖示和連結預覽（Open Graph）圖片都出自這幅畫。
- 地名前的圓形國旗貼紙：Jumin 所在的地方，以及每篇論文發表的地方。
- 跟隨操作系統設定、手動選擇後會記住的主題切換，複製電郵按鈕，以及打印樣式。
- 尊重「減少動態效果」設定、屏幕閱讀器和鍵盤導航，所有文字的對比度都達到 WCAG AA 或以上。
- 只有一個內容檔案：所有語言的所有文字都在 `src/data/profile.ts` 裏。
- 以同一份資料和設計，由 `npm run github-profile` 生成的五種語言 GitHub 個人主頁 README。

## 技術棧

Vite 7、React 19、TypeScript、使用設計令牌（design tokens）的 CSS Modules、Fontsource（Fredoka、Nunito 和 Jua）以及 lucide-react。中文和日文使用訪客裝置上的系統字型。沒有路由、CMS 或後端。GitHub Actions 負責建置網站並發佈到 GitHub Pages。

## 專案結構

```text
.
├── .github/workflows/deploy.yml  推送到 main → 程式碼檢查 → 建置 → 部署到 GitHub Pages
├── docs/
│   ├── DESIGN.md                 設計規則：顏色、字型、形狀、動態效果、語言、禁忌
│   └── preview-*.jpg             README 預覽圖（npm run snapshots -- --readme）
├── public/                       原封不動複製到建置結果
│   ├── favicon.svg               吉祥物；其他圖示都由它生成
│   ├── favicon.ico, apple-touch-icon.png, icon-*.png, og-image.png   由 npm run icons 生成
│   ├── manifest.webmanifest
│   ├── jumin-cho.jpg
│   └── 404.html                  把舊連結（/blog 等）帶回首頁
├── scripts/
│   ├── icons.mjs                 繪製圖示和連結預覽圖
│   ├── snapshots.mjs             在每種語言下檢查建置的外觀和行為
│   ├── github-profile.mjs        生成 GitHub 個人主頁 README（jumincho/jumincho）
│   ├── github-profile/           卡片、動畫、README 範本和每日執行的年齡更新腳本
│   └── lib/                      Chromium 啟動器、字型、把文字轉為輪廓的 HTML → SVG 匯出
├── src/
│   ├── data/                     profile.ts（五種語言的全部內容）和 types.ts
│   ├── sections/                 Hero、JuminTime（時鐘卡）、Publications、Experience、Education、Honors
│   ├── components/               NameFlip、LiveAge、Panel、Timeline、Flag、PlaceName、LanguageMenu 等
│   ├── layout/                   Header、Footer、Backdrop（飄動的色塊）
│   ├── hooks/                    useLanguage、useScrolled、useActiveSection、useTheme、useNow、useClockMode
│   ├── lib/                      i18n、theme、clock（時區和 Jumin 的作息表）、cx
│   ├── styles/                   tokens.css（設計令牌）、tones.css、global.css、fonts.css
│   ├── App.tsx
│   └── main.tsx
├── vite-plugins/                 siteMeta（<head> 標籤）、hangulFont（韓文字型子集）
├── index.html
└── vite.config.ts
```

## 快速開始

需要 Node.js 20.19 或以上，或 22.12 或以上。

```bash
npm ci
npm run dev        # http://localhost:5173
```

| 指令 | 作用 |
| --- | --- |
| `npm run dev` | 啟動開發伺服器 |
| `npm run build` | 先檢查類型，再建置到 `dist/` |
| `npm run preview` | 在本機預覽建置結果 |
| `npm run lint` | 執行 ESLint |
| `npm run snapshots` | 在 375px 和 1280px、淺色和深色、每種語言下檢查建置，並把截圖儲存到 `snapshots/` |
| `npm run icons` | 根據 `favicon.svg` 重新繪製網站圖示、應用程式圖示和連結預覽圖 |
| `npm run github-profile` | 在 `../jumincho` 重新生成 GitHub 個人主頁 README 和圖片（見下文） |

`snapshots`、`icons` 和 `github-profile` 透過 Playwright 操作 Chromium。請先執行一次 `npx playwright install chromium`，或用 `PLAYWRIGHT_CHROMIUM=/path/to/chrome` 指向已安裝的瀏覽器。

## 修改內容

只需修改 `src/data/profile.ts`；元件裏沒有任何事實資料或文字。

| 匯出 | 內容 |
| --- | --- |
| `languages` | 按選單順序排列的語言，以及各自的地區代碼、以該語言書寫的名稱和日期地區設定 |
| `site` | 頁面標題、描述、網址和最後更新月份；`<head>` 標籤由此生成 |
| `profile` | 姓名、別名、韓文姓名、簡介、所屬機構、所在地、出生時刻、電郵、相片和連結 |
| `sections` | 欄目順序、標題和導覽標籤 |
| `publications`、`selfNames` | 論文（附會議和舉辦地），以及要突出顯示的本人姓名寫法 |
| `experience`、`education` | 時間線項目；時段寫成 `{ from, to?, expected? }` |
| `honors`、`certifications` | 獎項和證書 |
| `juminTime` | 時鐘卡：Jumin 的時區、平日與週末作息表及其文字 |
| `labels` | 問候語、標籤、按鈕名稱和屏幕閱讀器文字 |
| `githubProfile` | 只在 GitHub 個人主頁 README 使用的幾段文字和網址 |

- 文字採用 `Localized` 格式：每種語言一項，寫成 `{ en, 'zh-CN', 'zh-HK', ja, ko }`，缺少任何一種翻譯，TypeScript 都會報錯。專有名詞保持原樣：論文標題、作者和會議名稱按發表時的寫法，實驗室、LinkedIn 和 GitHub 也保持不變。
- 韓文可以寫在任何地方。建置時會把韓文標題字型（Jua）精簡到實際用到的字元：조주민 這三個字在每個頁面都會載入，其餘的只在頁面語言為韓文時載入。
- 地點（`profile.location` 和每篇論文的 `place`）由城市、國家和 ISO 國家代碼組成。韓國、意大利和日本在 `src/components/Flag.tsx` 裏有國旗圖案；其他代碼在加入圖案之前會顯示為地圖圖釘。
- 作息表（`juminTime.routine`）按 KST 列出一天中的時段，寫成 `{ from, to, state }`。`to` 早於 `from` 的時段會跨越午夜，屬於它開始的那一天。時段重疊時，較晚開始的時段優先。卡片從不顯示作息表本身，只顯示目前狀態，而且總是放在「maybe…」（繁體中文頁面上為「也許……」）之後。
- 修改姓名、簡介、所屬機構或相片後，請執行 `npm run icons`，讓連結預覽圖保持一致。
- 修改任何內容後，請執行 `npm run github-profile` 並推送個人主頁存放庫，讓 GitHub 個人主頁與網站內容一致。

## 設計

規則寫在 [docs/DESIGN.md](docs/DESIGN.md)（韓文）裏，所有顏色、尺寸、圓角和時長都在 `src/styles/tokens.css` 裏。請使用現有的令牌或新增令牌，不要直接寫死數值。

## 部署

每次推送到 `main` 都會執行 `.github/workflows/deploy.yml`，經過程式碼檢查和建置後把網站發佈到 GitHub Pages。存放庫設定中的 Settings → Pages → Build and deployment → Source 必須設為 GitHub Actions。`main` 是唯一的分支。

## GitHub 個人主頁 README

github.com/jumincho 上的 README 位於 jumincho/jumincho 存放庫，由本存放庫生成。把那個存放庫 clone 到本存放庫旁邊，然後：

```bash
npm run github-profile                  # 寫入 ../jumincho
npm run github-profile -- path/to/repo  # 或寫入其他檢出目錄
```

之後在個人主頁存放庫裏提交並推送。不要手動修改那個存放庫裏的 README 和圖片。

- 每種語言各有一個 README：個人主頁上顯示的英文 `README.md`，以及其他語言的 `README.<code>.md`。頂部的一排語言膠囊把它們連在一起。
- 每張圖片都是用網站的令牌、色調、字型、國旗和吉祥物在 Chromium 中排版的卡片（`scripts/github-profile/cards.css`），再匯出為淺色和深色兩個版本的 SVG。README 以 `<picture>` 按訪客的 GitHub 主題選擇其中一個。
- 文字由 HarfBuzz 轉為輪廓，因此圖片不需要字型，在任何瀏覽器看起來都一樣。中文、日文和韓文正文以作為開發依賴安裝的 Noto Sans 繪製；和瀏覽器一樣，每個字元都由字型清單中第一個包含它的字型繪製。
- 在寬屏幕上，卡片兩張一排、高度相同；在手機上則逐張疊起。
- 開頭的主卡片、概覽（At a glance）和頁尾卡片會緩緩移動（名字以 9 秒為週期變成「JUMIN WHO?」，色塊飄動，Mongle 上下浮動），對偏好減少動態效果的訪客則保持靜止。
- 生成器還會把 `scripts/update-age.mjs` 和 `.github/workflows/age.yml` 寫入個人主頁存放庫。這個工作流程每天 00:05（KST）重新繪製每種語言概覽卡中的年齡，不需要任何依賴。
