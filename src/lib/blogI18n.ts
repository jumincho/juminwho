import { useEffect, useState } from 'react'
import type { PostLanguage } from '../data/posts'

const BLOG_LOCALE_STORAGE_KEY = 'blog-locale'
const DEFAULT_BLOG_LOCALE: PostLanguage = 'ko'

const blogPageText = {
  ko: {
    title: 'Blog',
    subtitle: '블로그와 연구 노트는 추후 작성 예정입니다.',
    empty: '이 카테고리 콘텐츠는 추후 작성 예정입니다.',
    loading: '로딩중...',
    notFound: '글을 찾을 수 없습니다',
    backToList: '블로그로 돌아가기',
    write: '글쓰기',
    darkMode: '다크 모드로 전환',
    lightMode: '라이트 모드로 전환',
    globeLoading: '로딩중...',
    deleteConfirm: (title: string) => `"${title}" 글을 삭제하시겠습니까?`,
    deleted: (title: string) => `"${title}" 삭제됨`,
    deleteFailed: '삭제에 실패했어요.',
  },
  en: {
    title: 'Blog',
    subtitle: 'Blog posts and research notes will be added later.',
    empty: 'Content for this category will be added later.',
    loading: 'Loading...',
    notFound: 'Post not found',
    backToList: 'Back to blog',
    write: 'Write',
    darkMode: 'Switch to dark mode',
    lightMode: 'Switch to light mode',
    globeLoading: 'Loading...',
    deleteConfirm: (title: string) => `Delete "${title}"?`,
    deleted: (title: string) => `"${title}" deleted`,
    deleteFailed: 'Failed to delete.',
  },
}

function getStoredBlogLocale(): PostLanguage {
  if (typeof window === 'undefined') return DEFAULT_BLOG_LOCALE

  const stored = window.localStorage.getItem(BLOG_LOCALE_STORAGE_KEY)
  return stored === 'ko' || stored === 'en' ? stored : DEFAULT_BLOG_LOCALE
}

export function useBlogLocale() {
  const [locale, setLocale] = useState<PostLanguage>(() => getStoredBlogLocale())

  useEffect(() => {
    if (typeof window === 'undefined') return
    window.localStorage.setItem(BLOG_LOCALE_STORAGE_KEY, locale)
  }, [locale])

  return [locale, setLocale] as const
}

export function getBlogPageText(locale: PostLanguage) {
  return blogPageText[locale]
}
