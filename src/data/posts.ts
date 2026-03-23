import { supabase } from '../lib/supabase'

export type Category = '전체' | 'AI/개발' | '연구노트' | '알고리즘' | '인사이트' | '여행' | '일상'

export const categories: Category[] = ['전체', 'AI/개발', '연구노트', '알고리즘', '인사이트', '여행', '일상']

export type PostLanguage = 'ko' | 'en'

export interface Post {
  slug: string
  title: string
  date: string
  summary: string
  tags: string[]
  category: Category
  content: string
  language: PostLanguage
  source?: 'remote' | 'local'
}

interface PostRow {
  slug: string
  title: string
  date: string
  summary: string
  tags: string[]
  category: string
  content: string
  published: boolean
  language: string
}

function isPostLanguage(value: string): value is PostLanguage {
  return value === 'ko' || value === 'en'
}

function isCategory(value: string): value is Category {
  return categories.includes(value as Category)
}

function rowToPost(row: PostRow): Post {
  return {
    slug: row.slug,
    title: row.title,
    date: row.date,
    summary: row.summary,
    tags: row.tags ?? [],
    category: isCategory(row.category) ? row.category : '일상',
    content: row.content,
    language: isPostLanguage(row.language) ? row.language : 'ko',
    source: 'remote',
  }
}

const localPosts: Post[] = [
  {
    slug: 'blog-coming-soon',
    title: '블로그 오픈 준비 중',
    date: '2026-03-23',
    summary: '사이트 기본 구조만 먼저 정리했고, 실제 글과 기록은 추후 작성 예정입니다.',
    tags: ['placeholder', 'setup'],
    category: 'AI/개발',
    content: `이 블로그는 현재 템플릿 상태입니다.

실제 글, 정리 노트, 링크 모음은 추후 작성 예정입니다.

- 첫 글 주제 정리
- 카테고리 구성
- 발행 주기 설정

위 항목들은 모두 나중에 업데이트할 예정입니다.`,
    language: 'ko',
    source: 'local',
  },
  {
    slug: 'research-note-coming-soon',
    title: '연구 노트 준비 중',
    date: '2026-03-23',
    summary: '논문 정리, 실험 회고, 읽은 자료 메모는 추후 작성 예정입니다.',
    tags: ['research-note', 'coming-soon'],
    category: '연구노트',
    content: `연구 노트 섹션은 아직 비어 있습니다.

다음과 같은 내용이 추후 추가될 예정입니다.

- 읽은 논문 요약
- 실험 설계와 실패 기록
- 구현 과정 메모
- 다음 액션 아이템`,
    language: 'ko',
    source: 'local',
  },
  {
    slug: 'research-note-coming-soon-en',
    title: 'Research Notes Coming Soon',
    date: '2026-03-23',
    summary: 'Paper summaries, experiment logs, and implementation notes will be added later.',
    tags: ['research-note', 'coming-soon'],
    category: '연구노트',
    content: `This blog is currently in template mode.

The research notes section will be filled in later with:

- paper summaries
- experiment retrospectives
- implementation notes
- next steps`,
    language: 'en',
    source: 'local',
  },
  {
    slug: 'insight-coming-soon',
    title: '인사이트 메모 준비 중',
    date: '2026-03-23',
    summary: '짧은 생각, 배운 점, 작업 메모는 추후 작성 예정입니다.',
    tags: ['insight', 'placeholder'],
    category: '인사이트',
    content: `짧은 메모와 회고를 담을 공간입니다.

현재는 사이트 구조만 남겨두었고,
실제 내용은 추후 작성 예정입니다.`,
    language: 'ko',
    source: 'local',
  },
]

function sortPosts(posts: Post[]) {
  return [...posts].sort((left, right) => right.date.localeCompare(left.date))
}

function mergePosts(remotePosts: Post[], language?: PostLanguage) {
  const filteredLocal = language ? localPosts.filter((post) => post.language === language) : localPosts
  const mergedPosts = new Map(filteredLocal.map((post) => [post.slug, post]))
  remotePosts.forEach((post) => {
    mergedPosts.set(post.slug, post)
  })
  return sortPosts([...mergedPosts.values()])
}

function getLocalPost(slug: string) {
  return localPosts.find((post) => post.slug === slug) ?? null
}

let postsCache: { key: string; data: Post[]; ts: number } | null = null
const CACHE_TTL = 60_000

export async function getPosts(language?: PostLanguage): Promise<Post[]> {
  const cacheKey = language ?? '__all__'
  if (postsCache && postsCache.key === cacheKey && Date.now() - postsCache.ts < CACHE_TTL) {
    return postsCache.data
  }

  const filterByLang = (posts: Post[]) =>
    language ? posts.filter((post) => post.language === language) : posts

  if (!supabase) {
    const result = sortPosts(filterByLang(localPosts))
    postsCache = { key: cacheKey, data: result, ts: Date.now() }
    return result
  }

  let query = supabase
    .from('posts')
    .select('*')
    .eq('published', true)
    .order('date', { ascending: false })

  if (language) {
    query = query.eq('language', language)
  }

  const { data, error } = await query

  if (error) {
    console.error('Failed to fetch posts:', error)
    const result = sortPosts(filterByLang(localPosts))
    postsCache = { key: cacheKey, data: result, ts: Date.now() }
    return result
  }

  const result = mergePosts((data as PostRow[]).map(rowToPost), language)
  postsCache = { key: cacheKey, data: result, ts: Date.now() }
  return result
}

export async function getPost(slug: string): Promise<Post | null> {
  const localPost = getLocalPost(slug)

  if (!supabase) {
    return localPost
  }

  const { data, error } = await supabase
    .from('posts')
    .select('*')
    .eq('slug', slug)
    .eq('published', true)
    .single()

  if (error) {
    if (localPost) return localPost
    console.error('Failed to fetch post:', error)
    return null
  }

  return rowToPost(data as PostRow)
}

export async function createPost(post: Post): Promise<boolean> {
  if (!supabase) {
    console.error('Failed to create post: Supabase is not configured')
    return false
  }

  const { error } = await supabase
    .from('posts')
    .insert({
      slug: post.slug,
      title: post.title,
      date: post.date,
      summary: post.summary,
      tags: post.tags,
      category: post.category,
      content: post.content,
      published: true,
      language: post.language || 'ko',
    })

  if (error) {
    console.error('Failed to create post:', error)
    return false
  }

  postsCache = null
  return true
}

export function getAlternateSlug(slug: string, currentLang: PostLanguage): string {
  if (currentLang === 'en') {
    return slug.replace(/-en$/, '')
  }
  return `${slug}-en`
}

export async function deletePost(slug: string): Promise<boolean> {
  if (!supabase) {
    console.error('Failed to delete post: Supabase is not configured')
    return false
  }

  const { error } = await supabase
    .from('posts')
    .delete()
    .eq('slug', slug)

  if (error) {
    console.error('Failed to delete post:', error)
    return false
  }

  postsCache = null
  return true
}
