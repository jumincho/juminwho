/**
 * Every word on the page lives in this file; components only arrange it.
 *
 * Facts come from the LinkedIn profile (exported 2026-09) and the cited
 * publication records. Nothing is invented: when a fact changes, change it here.
 * `vite.config.ts` also reads `site` to fill the <head> tags, so keep this file
 * free of browser-only code.
 *
 * Text is `Localized`: one entry per language, in the order en, zh-CN, zh-HK,
 * ja, ko. Proper names stay as they are: paper titles, authors and venues as
 * published, and the lab, LinkedIn and GitHub.
 */
import type {
  Honor,
  Language,
  Link,
  Localized,
  Place,
  Publication,
  Routine,
  RoutineState,
  SectionMeta,
  TimelineEntry,
} from './types'

/** Menu order. English is the default; `?lang=ko` (etc.) opens the page in another language. */
export const languages: Language[] = [
  { code: 'en', region: 'US', name: 'English', locale: 'en-US' },
  { code: 'zh-CN', region: 'CN', name: '简体中文', locale: 'zh-CN' },
  { code: 'zh-HK', region: 'HK', name: '繁體中文', locale: 'zh-HK' },
  { code: 'ja', region: 'JP', name: '日本語', locale: 'ja-JP' },
  { code: 'ko', region: 'KR', name: '한국어', locale: 'ko-KR' },
]

export const site = {
  title: 'JUMIN WHO?',
  description:
    'Jumin Cho, AI researcher and Ph.D. student in Computer Science at Jeonbuk National University.',
  url: 'https://jumincho.github.io/juminwho/',
  source: 'https://github.com/jumincho/juminwho',
  lastUpdated: '2026-09',
}

const university: Localized = {
  en: 'Jeonbuk National University',
  'zh-CN': '全北大学',
  'zh-HK': '全北大學',
  ja: '全北大学校',
  ko: '전북대학교',
}

export const profile = {
  name: 'JUMIN CHO',
  /** Shown on hover and once the page is scrolled. */
  alias: 'JUMIN WHO?',
  nameKo: '조주민',
  tagline: {
    en: 'A Dreamer of an Artificial Intelligence Expert',
    'zh-CN': '梦想成为人工智能专家的追梦人',
    'zh-HK': '夢想成為人工智能專家的追夢人',
    ja: '人工知能の専門家を夢見る人',
    ko: '인공지능 전문가를 꿈꾸는 사람',
  } satisfies Localized,
  role: {
    en: 'AI Researcher · Ph.D. Student',
    'zh-CN': 'AI 研究员 · 博士生',
    'zh-HK': 'AI 研究員 · 博士生',
    ja: 'AI 研究者・博士課程学生',
    ko: 'AI 연구자 · 박사과정생',
  } satisfies Localized,
  location: {
    city: { en: 'Jeonju', 'zh-CN': '全州', 'zh-HK': '全州', ja: '全州', ko: '전주' },
    country: { en: 'Republic of Korea', 'zh-CN': '韩国', 'zh-HK': '韓國', ja: '韓国', ko: '대한민국' },
    countryCode: 'KR',
  } satisfies Place,
  /** Birth instant (KST) for the live age counter. */
  birth: '1998-07-10T00:00:00+09:00',
  email: 'properly59@gmail.com',
  photo: {
    src: 'jumin-cho.jpg',
    alt: {
      en: 'Jumin Cho standing under cherry blossoms by a pond',
      'zh-CN': 'Jumin Cho 站在池塘边的樱花树下',
      'zh-HK': 'Jumin Cho 站在池塘邊的櫻花樹下',
      ja: '池のほとりの桜の下に立つ Jumin Cho',
      ko: '연못가 벚꽃 아래에 선 조주민',
    } satisfies Localized,
  },
  department: {
    label: {
      en: 'Computer Science',
      'zh-CN': '计算机科学',
      'zh-HK': '計算機科學',
      ja: 'コンピュータサイエンス',
      ko: '컴퓨터공학',
    },
    // "index..do" with two dots is not a typo: it is the address JBNU's CMS gives this site's home page.
    href: 'https://top.jbnu.ac.kr/csaieng/index..do',
  } satisfies Link<Localized>,
  university: { label: university, href: 'https://www.jbnu.ac.kr/en/index.do' } satisfies Link<Localized>,
  lab: { label: 'Natural Language Learning Lab', href: 'https://sites.google.com/view/nlllab/main' },
  linkedin: { label: 'LinkedIn', href: 'https://www.linkedin.com/in/jumin-cho-42b126338/' },
  github: { label: 'GitHub', href: 'https://github.com/jumincho' },
}

/** Page sections in reading order; the header navigation follows this order. */
export const sections = {
  publications: {
    id: 'publications',
    title: { en: 'Publications', 'zh-CN': '论文', 'zh-HK': '論文', ja: '論文', ko: '논문' },
    nav: { en: 'Publications', 'zh-CN': '论文', 'zh-HK': '論文', ja: '論文', ko: '논문' },
  },
  experience: {
    id: 'experience',
    title: { en: 'Experience', 'zh-CN': '经历', 'zh-HK': '經歷', ja: '経歴', ko: '경력' },
    nav: { en: 'Experience', 'zh-CN': '经历', 'zh-HK': '經歷', ja: '経歴', ko: '경력' },
  },
  education: {
    id: 'education',
    title: { en: 'Education', 'zh-CN': '教育背景', 'zh-HK': '教育背景', ja: '学歴', ko: '학력' },
    nav: { en: 'Education', 'zh-CN': '教育', 'zh-HK': '教育', ja: '学歴', ko: '학력' },
  },
  honors: {
    id: 'honors',
    title: {
      en: 'Honors & certifications',
      'zh-CN': '荣誉与证书',
      'zh-HK': '榮譽與證書',
      ja: '受賞・資格',
      ko: '수상 및 자격',
    },
    nav: { en: 'Honors', 'zh-CN': '荣誉', 'zh-HK': '榮譽', ja: '受賞', ko: '수상' },
  },
} satisfies Record<string, SectionMeta>

export type SectionKey = keyof typeof sections

const advisors = {
  song: {
    label: {
      en: 'Prof. Hyun-Je Song',
      'zh-CN': 'Hyun-Je Song 教授',
      'zh-HK': 'Hyun-Je Song 教授',
      ja: 'Hyun-Je Song 教授',
      ko: '송현제 교수',
    },
    href: 'https://sites.google.com/site/songhyunje/Home',
  },
  na: {
    label: {
      en: 'Prof. Seung-Hoon Na (now at UNIST)',
      'zh-CN': 'Seung-Hoon Na 教授（现任职于 UNIST）',
      'zh-HK': 'Seung-Hoon Na 教授（現任職於 UNIST）',
      ja: 'Seung-Hoon Na 教授（現在は UNIST 所属）',
      ko: '나승훈 교수 (현 UNIST)',
    },
    href: 'https://nlp.unist.ac.kr/faculty.html',
  },
} satisfies Record<string, Link<Localized>>

export const publications: Publication[] = [
  {
    title: 'Forward-Looking Guidance for Iterative RAG in Multi-Hop Question Answering',
    authors: ['Jumin Cho', 'Chanjun Park', 'Seung-Hoon Na', 'Hyun-Je Song'],
    venue: 'CIKM 2026',
    year: 2026,
    place: {
      city: { en: 'Rome', 'zh-CN': '罗马', 'zh-HK': '羅馬', ja: 'ローマ', ko: '로마' },
      country: { en: 'Italy', 'zh-CN': '意大利', 'zh-HK': '意大利', ja: 'イタリア', ko: '이탈리아' },
      countryCode: 'IT',
    },
  },
  {
    title:
      'Optimizing Causality-Based Radiology Reporting with Retrieval-Augmented and Structured Reasoning Approaches for the NTCIR-18 HIDDEN-RAD Task',
    authors: ['Ju-Min Cho', 'Ho-Jin Yi', 'Myung-Kyu Kim', 'Se-Jin Jeong', 'Seung-Hoon Na'],
    venue: 'NTCIR-18',
    year: 2025,
    place: {
      city: { en: 'Tokyo', 'zh-CN': '东京', 'zh-HK': '東京', ja: '東京', ko: '도쿄' },
      country: { en: 'Japan', 'zh-CN': '日本', 'zh-HK': '日本', ja: '日本', ko: '일본' },
      countryCode: 'JP',
    },
    href: 'https://research.nii.ac.jp/ntcir/workshop/OnlineProceedings18/pdf/ntcir/04-NTCIR18-HIDDEN-RAD-ChoJ.pdf',
  },
]

/** Spellings of Jumin's name that are emphasised in author lists. */
export const selfNames = ['Jumin Cho', 'Ju-Min Cho']

const researcher: Localized = { en: 'Researcher', 'zh-CN': '研究员', 'zh-HK': '研究員', ja: '研究員', ko: '연구원' }

export const experience: TimelineEntry[] = [
  {
    period: { from: '2026.03' },
    title: researcher,
    org: university,
    advisor: advisors.song,
  },
  {
    period: { from: '2024.03', to: '2026.02' },
    title: researcher,
    org: university,
    advisor: advisors.na,
  },
  {
    period: { from: '2025.03', to: '2025.08' },
    title: { en: 'Teaching Assistant', 'zh-CN': '助教', 'zh-HK': '助教', ja: 'ティーチング・アシスタント', ko: '수업 조교' },
    org: university,
  },
  {
    period: { from: '2024.03', to: '2024.08' },
    title: {
      en: 'Research Assistant',
      'zh-CN': '研究助理',
      'zh-HK': '研究助理',
      ja: 'リサーチ・アシスタント',
      ko: '연구 조교',
    },
    org: university,
  },
  {
    period: { from: '2020.12', to: '2021.11' },
    title: {
      en: 'Vice Student Council President',
      'zh-CN': '学生会副主席',
      'zh-HK': '學生會副主席',
      ja: '学生会副会長',
      ko: '학생회 부회장',
    },
    org: {
      en: 'Department of Computer Science, Jeonbuk National University',
      'zh-CN': '全北大学计算机科学系',
      'zh-HK': '全北大學計算機科學系',
      ja: '全北大学校 コンピュータサイエンス学科',
      ko: '전북대학교 컴퓨터공학과',
    },
  },
  {
    period: { from: '2019.04', to: '2021.02' },
    title: {
      en: 'Air Defense Artillery Sergeant (Patriot System) & Squad Leader',
      'zh-CN': '防空炮兵中士（爱国者导弹系统）兼班长',
      'zh-HK': '防空炮兵中士（愛國者導彈系統）兼班長',
      ja: '防空砲兵 兵長（パトリオット・システム）・分隊長',
      ko: '방공포병 병장 (패트리어트 체계) · 분대장',
    },
    org: {
      en: 'Republic of Korea Air Force',
      'zh-CN': '大韩民国空军',
      'zh-HK': '大韓民國空軍',
      ja: '大韓民国空軍',
      ko: '대한민국 공군',
    },
  },
]

export const education: TimelineEntry[] = [
  {
    period: { from: '2026.03', to: '2029.02', expected: true },
    title: {
      en: 'Ph.D. Student, Computer Science',
      'zh-CN': '计算机科学博士研究生',
      'zh-HK': '計算機科學博士研究生',
      ja: '博士課程（コンピュータサイエンス）',
      ko: '컴퓨터공학 박사과정',
    },
    org: university,
  },
  {
    period: { from: '2024.03', to: '2026.02' },
    title: {
      en: 'M.S., Computer Science',
      'zh-CN': '计算机科学硕士',
      'zh-HK': '計算機科學碩士',
      ja: '修士（コンピュータサイエンス）',
      ko: '컴퓨터공학 석사',
    },
    org: university,
  },
  {
    period: { from: '2018.03', to: '2024.02' },
    title: {
      en: 'B.S., Computer Science',
      'zh-CN': '计算机科学学士',
      'zh-HK': '計算機科學學士',
      ja: '学士（コンピュータサイエンス）',
      ko: '컴퓨터공학 학사',
    },
    org: university,
  },
]

export const honors: Honor[] = [
  {
    title: { en: 'Excellence Award', 'zh-CN': '优秀奖', 'zh-HK': '優秀獎', ja: '優秀賞', ko: '우수상' },
    org: {
      en: 'AI-JBNU Program',
      'zh-CN': 'AI-JBNU 项目',
      'zh-HK': 'AI-JBNU 計劃',
      ja: 'AI-JBNU プログラム',
      ko: 'AI-JBNU 프로그램',
    },
  },
  {
    title: { en: 'Silver Award', 'zh-CN': '银奖', 'zh-HK': '銀獎', ja: '銀賞', ko: '은상' },
    org: {
      en: 'Department of Computer Science Project Competition',
      'zh-CN': '计算机科学系项目竞赛',
      'zh-HK': '計算機科學系項目比賽',
      ja: 'コンピュータサイエンス学科 プロジェクトコンテスト',
      ko: '컴퓨터공학과 프로젝트 경진대회',
    },
  },
]

export const certifications: Localized[] = [
  {
    en: 'Unmanned Multi-Copter Pilot License (Class 2)',
    'zh-CN': '无人多旋翼飞行器驾驶员执照（2 类）',
    'zh-HK': '無人多旋翼飛行器駕駛員執照（2 類）',
    ja: '無人マルチコプター操縦者資格（2種）',
    ko: '무인멀티콥터 조종자 자격 (2종)',
  },
]

/**
 * "What time is it for Jumin?", the clock card under the hero: Jumin's time
 * or the visitor's, and what Jumin is maybe doing right now. The card works
 * the state out from `routine` but never shows the routine itself, and every
 * state is hedged with `maybe`.
 */
export const juminTime = {
  id: 'jumin-time',
  title: {
    en: 'What time is it for Jumin?',
    'zh-CN': 'Jumin 那边现在几点？',
    'zh-HK': 'Jumin 那邊現在幾點？',
    ja: 'ジュミンは今、何時？',
    ko: '지금 주민은 몇 시일까요?',
  } satisfies Localized,
  timeZone: 'Asia/Seoul',
  zoneName: 'KST',
  routine: {
    weekday: [
      { from: '09:00', to: '21:00', state: 'working' },
      { from: '21:00', to: '01:00', state: 'superposition' },
      { from: '01:00', to: '08:00', state: 'asleep' },
      { from: '08:00', to: '09:00', state: 'ready' },
    ],
    weekend: [
      { from: '08:00', to: '01:00', state: 'superposition' },
      { from: '01:00', to: '08:00', state: 'asleep' },
    ],
  } satisfies Routine,
  maybe: { en: 'maybe…', 'zh-CN': '也许……', 'zh-HK': '也許……', ja: 'たぶん…', ko: '아마도…' } satisfies Localized,
  states: {
    asleep: {
      label: { en: 'asleep', 'zh-CN': '在睡觉', 'zh-HK': '在睡覺', ja: 'おやすみ中', ko: '자는 중' },
      hint: {
        en: 'Sweet dreams. Your message will be waiting in the morning.',
        'zh-CN': '晚安。你的消息明早再看。',
        'zh-HK': '晚安。你的訊息明早再看。',
        ja: 'おやすみなさい。メッセージは朝に読みますね。',
        ko: '좋은 꿈 꾸는 중이에요. 메시지는 아침에 읽을게요.',
      },
    },
    ready: {
      label: {
        en: 'getting ready for work',
        'zh-CN': '在准备上班',
        'zh-HK': '在準備上班',
        ja: '出勤準備中',
        ko: '출근 준비 중',
      },
      hint: {
        en: 'Morning routine: the workday is about to begin.',
        'zh-CN': '早晨准备中，一天的工作马上开始。',
        'zh-HK': '早晨準備中，一天的工作馬上開始。',
        ja: '朝の支度中。もうすぐ仕事が始まります。',
        ko: '아침 준비 중이에요. 곧 하루 일과가 시작돼요.',
      },
    },
    working: {
      label: { en: 'working', 'zh-CN': '在工作', 'zh-HK': '在工作', ja: '仕事中', ko: '일하는 중' },
      hint: {
        en: 'Working hours in Korea, a good time to say hello.',
        'zh-CN': '韩国正值工作时间，正是打招呼的好时候。',
        'zh-HK': '韓國正值工作時間，正是打招呼的好時候。',
        ja: '韓国は勤務時間。あいさつにぴったりです。',
        ko: '한국은 근무 시간이에요. 인사하기 좋은 때예요.',
      },
    },
    superposition: {
      label: {
        en: 'in superposition',
        'zh-CN': '处于量子叠加态',
        'zh-HK': '處於量子疊加態',
        ja: '量子の重ね合わせ中',
        ko: '양자 중첩 중',
      },
      hint: {
        en: 'Every possible state at once, until observed. An email counts as an observation.',
        'zh-CN': '在被观测之前，所有状态同时存在。发一封邮件也算观测。',
        'zh-HK': '在被觀測之前，所有狀態同時存在。發一封電郵也算觀測。',
        ja: '観測されるまで、あらゆる状態が重なり合っています。メールも観測のうちです。',
        ko: '관측되기 전까지는 모든 상태가 한꺼번에. 이메일도 관측으로 칩니다.',
      },
    },
  } satisfies Record<RoutineState, { label: Localized; hint: Localized }>,
  modesLabel: {
    en: 'Show the time in',
    'zh-CN': '显示时间',
    'zh-HK': '顯示時間',
    ja: '表示する時間',
    ko: '시간 기준',
  } satisfies Localized,
  modes: {
    local: { en: 'Local', 'zh-CN': '本地', 'zh-HK': '本地', ja: 'ローカル', ko: '내 시간' },
    jumin: { en: 'Jumin', 'zh-CN': 'Jumin', 'zh-HK': 'Jumin', ja: 'ジュミン', ko: '주민 시간' },
  } satisfies Record<'local' | 'jumin', Localized>,
  using: {
    local: {
      en: 'Using your local time',
      'zh-CN': '你的本地时间',
      'zh-HK': '你的本地時間',
      ja: 'あなたの現地時間',
      ko: '내 시간 기준',
    },
    jumin: {
      en: 'Using Jumin’s time (KST)',
      'zh-CN': 'Jumin 的时间（KST）',
      'zh-HK': 'Jumin 的時間（KST）',
      ja: 'ジュミンの時間（KST）',
      ko: '주민 시간 기준 (KST)',
    },
  } satisfies Record<'local' | 'jumin', Localized>,
  days: {
    weekday: { en: 'Weekday', 'zh-CN': '工作日', 'zh-HK': '工作日', ja: '平日', ko: '평일' },
    weekend: { en: 'Weekend', 'zh-CN': '周末', 'zh-HK': '週末', ja: '週末', ko: '주말' },
  } satisfies Record<'weekday' | 'weekend', Localized>,
}

/** Interface wording: labels, greetings and screen-reader text. */
export const labels = {
  skipToContent: { en: 'Skip to content', 'zh-CN': '跳到正文', 'zh-HK': '跳至正文', ja: '本文へスキップ', ko: '본문으로 건너뛰기' },
  greeting: { en: 'Hello there, I’m', 'zh-CN': '你好，我是', 'zh-HK': '你好，我是', ja: 'こんにちは、私は', ko: '안녕하세요, 저는' },
  role: { en: 'Role', 'zh-CN': '身份', 'zh-HK': '身份', ja: '肩書き', ko: '직함' },
  affiliation: { en: 'Affiliation', 'zh-CN': '所属机构', 'zh-HK': '所屬機構', ja: '所属', ko: '소속' },
  location: { en: 'Location', 'zh-CN': '所在地', 'zh-HK': '所在地', ja: '拠点', ko: '위치' },
  age: { en: 'Age', 'zh-CN': '年龄', 'zh-HK': '年齡', ja: '年齢', ko: '나이' },
  ageUnit: { en: 'years', 'zh-CN': '岁', 'zh-HK': '歲', ja: '歳', ko: '세' },
  ageSpoken: {
    en: (years: number) => `${years} years old`,
    'zh-CN': (years: number) => `${years} 岁`,
    'zh-HK': (years: number) => `${years} 歲`,
    ja: (years: number) => `${years}歳`,
    ko: (years: number) => `${years}세`,
  },
  /** "Computer Science, Jeonbuk National University" in English; the university comes first elsewhere. */
  affiliationOrder: {
    en: <T>(department: T, university: T) => [department, ', ', university],
    'zh-CN': <T>(department: T, university: T) => [university, ' ', department],
    'zh-HK': <T>(department: T, university: T) => [university, ' ', department],
    ja: <T>(department: T, university: T) => [university, ' ', department],
    ko: <T>(department: T, university: T) => [university, ' ', department],
  },
  /** "Rome, Italy" in English; country first elsewhere. */
  place: {
    en: (city: string, country: string) => `${city}, ${country}`,
    'zh-CN': (city: string, country: string) => `${country}${city}`,
    'zh-HK': (city: string, country: string) => `${country}${city}`,
    ja: (city: string, country: string) => `${country}・${city}`,
    ko: (city: string, country: string) => `${country} ${city}`,
  },
  advisor: { en: 'Advisor', 'zh-CN': '导师', 'zh-HK': '導師', ja: '指導教員', ko: '지도교수' },
  present: { en: 'present', 'zh-CN': '至今', 'zh-HK': '至今', ja: '現在', ko: '현재' },
  expected: { en: 'expected', 'zh-CN': '预计', 'zh-HK': '預計', ja: '予定', ko: '예정' },
  certification: { en: 'Certification', 'zh-CN': '证书', 'zh-HK': '證書', ja: '資格', ko: '자격증' },
  copyEmail: {
    en: 'Copy email address',
    'zh-CN': '复制邮箱地址',
    'zh-HK': '複製電郵地址',
    ja: 'メールアドレスをコピー',
    ko: '이메일 주소 복사',
  },
  copied: { en: 'Copied!', 'zh-CN': '已复制！', 'zh-HK': '已複製！', ja: 'コピーしました！', ko: '복사했어요!' },
  copiedSpoken: {
    en: 'Email address copied',
    'zh-CN': '已复制邮箱地址',
    'zh-HK': '已複製電郵地址',
    ja: 'メールアドレスをコピーしました',
    ko: '이메일 주소를 복사했어요',
  },
  themeToDark: {
    en: 'Switch to dark theme',
    'zh-CN': '切换到深色主题',
    'zh-HK': '切換至深色主題',
    ja: 'ダークテーマに切り替える',
    ko: '어두운 테마로 바꾸기',
  },
  themeToLight: {
    en: 'Switch to light theme',
    'zh-CN': '切换到浅色主题',
    'zh-HK': '切換至淺色主題',
    ja: 'ライトテーマに切り替える',
    ko: '밝은 테마로 바꾸기',
  },
  language: { en: 'Language', 'zh-CN': '语言', 'zh-HK': '語言', ja: '言語', ko: '언어' },
  navigation: { en: 'Sections', 'zh-CN': '栏目', 'zh-HK': '欄目', ja: 'セクション', ko: '섹션' },
  backToTop: { en: 'Back to top', 'zh-CN': '返回顶部', 'zh-HK': '返回頂部', ja: 'ページの先頭へ', ko: '맨 위로' },
  thanks: {
    en: 'Thanks for stopping by.',
    'zh-CN': '感谢你的来访。',
    'zh-HK': '感謝你的到訪。',
    ja: '立ち寄ってくれてありがとう。',
    ko: '들러 주셔서 고마워요.',
  },
  signOff: {
    en: 'May every day be a good day!',
    'zh-CN': '愿你天天都是好日子！',
    'zh-HK': '願你天天都是好日子！',
    ja: '毎日がいい日になりますように！',
    ko: '날마다 좋은 날 되세요!',
  },
  lastUpdated: { en: 'Last updated', 'zh-CN': '最后更新', 'zh-HK': '最後更新', ja: '最終更新', ko: '마지막 업데이트' },
  source: { en: 'Source', 'zh-CN': '源代码', 'zh-HK': '源代碼', ja: 'ソースコード', ko: '소스 코드' },
} satisfies Record<string, Localized<unknown>>

/** Wording and addresses used only by the GitHub profile README (scripts/github-profile.mjs). */
export const githubProfile = {
  /** Shows README.md; the other languages open as files in the repository. */
  profile: 'https://github.com/jumincho',
  repository: 'https://github.com/jumincho/jumincho',
  glance: { en: 'At a glance', 'zh-CN': '概览', 'zh-HK': '概覽', ja: 'プロフィール', ko: '한눈에 보기' } satisfies Localized,
  portfolio: { en: 'Portfolio', 'zh-CN': '作品集', 'zh-HK': '作品集', ja: 'ポートフォリオ', ko: '포트폴리오' } satisfies Localized,
  lab: 'NLL Lab',
}
