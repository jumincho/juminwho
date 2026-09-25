<div align="center">

<img src="public/favicon.svg" width="88" alt="网站吉祥物 Mongle" />

# JUMIN WHO?

全北大学计算机科学博士生、AI 研究员 Jumin Cho 的单页个人网站。

<https://jumincho.github.io/juminwho/?lang=zh-CN>

[English](README.md) · 简体中文 · [繁體中文](README.zh-HK.md) · [日本語](README.ja.md) · [한국어](README.ko.md)

</div>

<picture>
  <source media="(prefers-color-scheme: dark)" srcset="docs/preview-dark.jpg" />
  <img src="docs/preview-light.jpg" alt="首屏：奶油色背景上的名字和信息卡片，旁边是在樱花树下拍的照片和桃子吉祥物" />
</picture>

## 特点

- 柔软、温馨的氛围。浅色模式是“奶油早晨”，深色模式是“可可夜晚”：粉彩色的软垫面板、缓缓飘动的色块和云朵形状的页脚。
- JUMIN WHO? 把鼠标悬停在名字上，或者滚动页面，名字就会弹一下，变成“JUMIN WHO?”。
- 从 1998-07-10 起实时计算、精确到小数点后 8 位的年龄计数器。
- Jumin 那边现在几点？带有“本地 | Jumin”开关的时钟卡片会显示 Jumin 的时间（KST）或访客的时间，并根据不在页面上显示的工作日与周末作息表，告诉你 Jumin 现在也许在做什么：也许……在工作、在准备上班、在睡觉，或者处于量子叠加态——在被观测之前，所有状态同时存在。
- 五种语言：English（默认）、简体中文、繁體中文、日本語和한국어，可在页头的菜单中选择。选择会被记住，`?lang=zh-CN` 这样的链接可以直接用该语言打开页面。
- 桃子麻糬吉祥物 Mongle。网站图标（favicon）、应用图标和链接预览（Open Graph）图片都出自这幅画。
- 地名前的圆形国旗贴纸：Jumin 所在的地方，以及每篇论文发表的地方。
- 跟随操作系统设置、手动选择后会记住的主题切换，复制邮箱按钮，以及打印样式。
- 尊重“减弱动态效果”设置、屏幕阅读器和键盘导航，所有文字的对比度都达到 WCAG AA 或更高。
- 只有一个内容文件：所有语言的所有文字都在 `src/data/profile.ts` 中。
- 用同一份数据和设计，由 `npm run github-profile` 生成的五种语言的 GitHub 个人主页 README。

## 技术栈

Vite 7、React 19、TypeScript、使用设计令牌（design tokens）的 CSS Modules、Fontsource（Fredoka、Nunito 和 Jua）以及 lucide-react。中文和日文使用访客设备上的系统字体。没有路由、CMS 或后端。GitHub Actions 负责构建网站并发布到 GitHub Pages。

## 项目结构

```text
.
├── .github/workflows/deploy.yml  推送到 main → 代码检查 → 构建 → 部署到 GitHub Pages
├── docs/
│   ├── DESIGN.md                 设计规则：颜色、字体、形状、动效、语言、禁忌
│   └── preview-*.jpg             README 预览图（npm run snapshots -- --readme）
├── public/                       原样复制到构建产物中
│   ├── favicon.svg               吉祥物；其他图标都由它生成
│   ├── favicon.ico, apple-touch-icon.png, icon-*.png, og-image.png   由 npm run icons 生成
│   ├── manifest.webmanifest
│   ├── jumin-cho.jpg
│   └── 404.html                  把旧链接（/blog 等）送回首页
├── scripts/
│   ├── icons.mjs                 绘制图标和链接预览图
│   ├── snapshots.mjs             在每种语言下检查构建的外观和行为
│   ├── github-profile.mjs        生成 GitHub 个人主页 README（jumincho/jumincho）
│   ├── github-profile/           卡片、动画、README 模板和每天运行的年龄更新脚本
│   └── lib/                      Chromium 启动器、字体、把文字转为轮廓的 HTML → SVG 导出
├── src/
│   ├── data/                     profile.ts（五种语言的全部内容）和 types.ts
│   ├── sections/                 Hero、JuminTime（时钟卡片）、Publications、Experience、Education、Honors
│   ├── components/               NameFlip、LiveAge、Panel、Timeline、Flag、PlaceName、LanguageMenu 等
│   ├── layout/                   Header、Footer、Backdrop（飘动的色块）
│   ├── hooks/                    useLanguage、useScrolled、useActiveSection、useTheme、useNow、useClockMode
│   ├── lib/                      i18n、theme、clock（时区和 Jumin 的作息表）、cx
│   ├── styles/                   tokens.css（设计令牌）、tones.css、global.css、fonts.css
│   ├── App.tsx
│   └── main.tsx
├── vite-plugins/                 siteMeta（<head> 标签）、hangulFont（韩文字体子集）
├── index.html
└── vite.config.ts
```

## 快速开始

需要 Node.js 20.19 或更高版本，或 22.12 或更高版本。

```bash
npm ci
npm run dev        # http://localhost:5173
```

| 命令 | 作用 |
| --- | --- |
| `npm run dev` | 启动开发服务器 |
| `npm run build` | 先做类型检查，再构建到 `dist/` |
| `npm run preview` | 在本地预览构建结果 |
| `npm run lint` | 运行 ESLint |
| `npm run snapshots` | 在 375px 和 1280px、浅色和深色、每种语言下检查构建，并把截图保存到 `snapshots/` |
| `npm run icons` | 根据 `favicon.svg` 重新绘制网站图标、应用图标和链接预览图 |
| `npm run github-profile` | 在 `../jumincho` 中重新生成 GitHub 个人主页 README 及其图片（见下文） |

`snapshots`、`icons` 和 `github-profile` 通过 Playwright 驱动 Chromium。请先运行一次 `npx playwright install chromium`，或者用 `PLAYWRIGHT_CHROMIUM=/path/to/chrome` 指向已有的浏览器。

## 修改内容

只需修改 `src/data/profile.ts`；组件里不含任何事实信息或文字。

| 导出 | 内容 |
| --- | --- |
| `languages` | 按菜单顺序排列的语言，以及各自的地区代码、用该语言书写的名称和日期区域设置 |
| `site` | 页面标题、描述、网址和最后更新月份；`<head>` 标签由此生成 |
| `profile` | 姓名、别名、韩文姓名、简介、所属机构、所在地、出生时刻、邮箱、照片和链接 |
| `sections` | 栏目顺序、标题和导航标签 |
| `publications`、`selfNames` | 论文（含会议和举办地），以及要高亮的本人姓名写法 |
| `experience`、`education` | 时间线条目；时间段写作 `{ from, to?, expected? }` |
| `honors`、`certifications` | 奖项和证书 |
| `juminTime` | 时钟卡片：Jumin 的时区、工作日与周末作息表及其文字 |
| `labels` | 问候语、标签、按钮名称和屏幕阅读器文字 |
| `githubProfile` | 只在 GitHub 个人主页 README 中使用的几段文字和网址 |

- 文字采用 `Localized` 格式：每种语言一条，写作 `{ en, 'zh-CN', 'zh-HK', ja, ko }`，缺少任何一种翻译，TypeScript 都会报错。专有名词保持原样：论文标题、作者和会议名称按发表时的写法，实验室、LinkedIn 和 GitHub 也保持不变。
- 韩文可以写在任何地方。构建时会把韩文标题字体（Jua）精简到实际用到的字符：조주민 这三个字在每个页面都会加载，其余的只在页面语言为韩语时加载。
- 地点（`profile.location` 和每篇论文的 `place`）由城市、国家和 ISO 国家代码组成。韩国、意大利和日本在 `src/components/Flag.tsx` 中有国旗图案；其他代码在添加图案之前显示为地图图钉。
- 作息表（`juminTime.routine`）按 KST 列出一天中的时段，写作 `{ from, to, state }`。`to` 早于 `from` 的时段会跨过午夜，属于它开始的那一天。时段重叠时，较晚开始的时段优先。卡片从不显示作息表本身，只显示当前状态，并且总是放在“maybe…”（简体中文页面上为“也许……”）之后。
- 修改姓名、简介、所属机构或照片后，请运行 `npm run icons`，让链接预览图保持一致。
- 修改任何内容后，请运行 `npm run github-profile` 并推送个人主页仓库，让 GitHub 个人主页与网站内容一致。

## 设计

规则写在 [docs/DESIGN.md](docs/DESIGN.md)（韩文）中，所有颜色、尺寸、圆角和时长都在 `src/styles/tokens.css` 中。请使用现有的令牌或新增令牌，不要直接写死数值。

## 部署

每次推送到 `main` 都会运行 `.github/workflows/deploy.yml`，经过代码检查和构建后把网站发布到 GitHub Pages。仓库设置中的 Settings → Pages → Build and deployment → Source 必须设为 GitHub Actions。`main` 是唯一的分支。

## GitHub 个人主页 README

github.com/jumincho 上的 README 位于 jumincho/jumincho 仓库，由本仓库生成。把那个仓库克隆到本仓库旁边，然后：

```bash
npm run github-profile                  # 写入 ../jumincho
npm run github-profile -- path/to/repo  # 或写入其他检出目录
```

之后在个人主页仓库中提交并推送。不要手动修改那个仓库里的 README 和图片。

- 每种语言各有一个 README：个人主页上显示的英文 `README.md`，以及其他语言的 `README.<code>.md`。顶部的一排语言胶囊把它们连在一起。
- 每张图片都是用网站的令牌、色调、字体、国旗和吉祥物在 Chromium 中排版的卡片（`scripts/github-profile/cards.css`），再导出为浅色和深色两个版本的 SVG。README 用 `<picture>` 按访客的 GitHub 主题选择其中一个。
- 文字由 HarfBuzz 转为轮廓，因此图片不需要字体，在任何浏览器中看起来都一样。中文、日文和韩文正文使用作为开发依赖安装的 Noto Sans 绘制；和浏览器一样，每个字符都由字体列表中第一个包含它的字体绘制。
- 在宽屏上，卡片两张一排、高度相同；在手机上则依次堆叠。
- 开头的主卡片、概览（At a glance）和页脚卡片会缓缓地动（名字以 9 秒为周期变成“JUMIN WHO?”，色块飘动，Mongle 上下浮动），对偏好减弱动态效果的访客则保持静止。
- 生成器还会把 `scripts/update-age.mjs` 和 `.github/workflows/age.yml` 写入个人主页仓库。这个工作流每天 00:05（KST）重新绘制每种语言概览卡片中的年龄，不需要任何依赖。
