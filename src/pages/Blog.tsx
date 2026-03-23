import { useState, useEffect, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import InteractiveBackground from '../components/InteractiveBackground'
import BlogCard from '../components/BlogCard'
import LocaleToggle from '../components/LocaleToggle'
import { useAdminAuth } from '../context/AdminAuthContext'
import { useBlogTheme } from '../context/BlogThemeContext'
import { getPosts, deletePost, categories } from '../data/posts'
import type { Post, Category } from '../data/posts'
import { useBlogLocale, getBlogPageText } from '../lib/blogI18n'
import type { ProjectLocale } from '../data/projectTranslations'
import styles from './Blog.module.css'

type ViewMode = 'grid' | 'list'
const BLOG_HERO_URL = '/blog-hero-placeholder.jpg'

export default function Blog() {
  const navigate = useNavigate()
  const { isAdmin } = useAdminAuth()
  const { isBlogLight, toggleBlogTheme } = useBlogTheme()
  const [blogLocale, setBlogLocale] = useBlogLocale()
  const t = getBlogPageText(blogLocale)
  const [activeCategory, setActiveCategory] = useState<Category>('전체')
  const [viewMode, setViewMode] = useState<ViewMode>('grid')
  const [posts, setPosts] = useState<Post[]>([])
  const [toast, setToast] = useState('')
  const [searchQuery, setSearchQuery] = useState('')

  useEffect(() => {
    window.scrollTo(0, 0)
    getPosts().then(setPosts)
  }, [])

  const handleDelete = async (slug: string, title: string) => {
    if (!confirm(t.deleteConfirm(title))) return
    const ok = await deletePost(slug)
    if (ok) {
      setPosts((prev) => prev.filter((post) => post.slug !== slug))
      setToast(t.deleted(title))
      setTimeout(() => setToast(''), 3000)
    } else {
      alert(t.deleteFailed)
    }
  }

  const filteredPosts = useMemo(() => {
    const q = searchQuery.toLowerCase().trim()
    return (activeCategory === '전체'
      ? posts
      : posts.filter((post) => post.category === activeCategory)
    )
      .filter((post) =>
        (post.category === '연구노트' || post.category === '알고리즘') ? post.language === blogLocale : post.language === 'ko'
      )
      .filter((post) => {
        if (!q) return true
        return (
          post.title.toLowerCase().includes(q) ||
          post.summary.toLowerCase().includes(q) ||
          post.tags.some((tag) => tag.toLowerCase().includes(q)) ||
          post.content.toLowerCase().includes(q)
        )
      })
  }, [posts, activeCategory, blogLocale, searchQuery])

  return (
    <>
      {!isBlogLight && <InteractiveBackground />}
      <main className={`${styles.main} ${isBlogLight ? styles.light : ''}`}>
        <div className={styles.container}>
          <div className={styles.header}>
            <div className={styles.headerTop}>
              <div>
                <h1 className={styles.title}>Blog</h1>
                <p className={styles.subtitle}>
                  {t.subtitle.split('\n').map((line, index) => (
                    <span key={index}>{line}{index === 0 && <br />}</span>
                  ))}
                </p>
              </div>
              <div className={styles.headerActions}>
                {(activeCategory === '연구노트' || activeCategory === '알고리즘') && (
                  <LocaleToggle
                    value={blogLocale as ProjectLocale}
                    onChange={(value) => setBlogLocale(value as 'ko' | 'en')}
                  />
                )}
                <button
                  type="button"
                  className={styles.themeBtn}
                  onClick={toggleBlogTheme}
                  aria-label={isBlogLight ? t.darkMode : t.lightMode}
                  title={isBlogLight ? t.darkMode : t.lightMode}
                >
                  {isBlogLight ? (
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M21 12.79A9 9 0 1 1 11.21 3c0 4.97 4.03 9 9 9 .27 0 .53-.01.79-.21" />
                    </svg>
                  ) : (
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <circle cx="12" cy="12" r="4" />
                      <path d="M12 2v2" /><path d="M12 20v2" />
                      <path d="m4.93 4.93 1.41 1.41" /><path d="m17.66 17.66 1.41 1.41" />
                      <path d="M2 12h2" /><path d="M20 12h2" />
                      <path d="m6.34 17.66-1.41 1.41" /><path d="m19.07 4.93-1.41 1.41" />
                    </svg>
                  )}
                </button>
                {isAdmin && (
                  <button onClick={() => navigate('/blog/write')} className={styles.writeBtn}>
                    {t.write}
                  </button>
                )}
              </div>
            </div>
          </div>

          <div className={styles.heroRow}>
            <div className={styles.heroPhoto}>
              <img
                src={BLOG_HERO_URL}
                alt={blogLocale === 'ko' ? '블로그 대표 이미지 placeholder' : 'Placeholder blog hero image'}
                className={styles.catImg}
                loading="lazy"
              />
              <span className={styles.catCaption}>
                {blogLocale === 'ko' ? '블로그 대표 이미지 placeholder' : 'Placeholder image for the blog hero'}
              </span>
            </div>
            <aside className={styles.heroNote}>
              <span className={styles.heroEyebrow}>Placeholder</span>
              <h2 className={styles.heroNoteTitle}>
                {blogLocale === 'ko' ? '이 공간은 나중에 글 분위기를 보여주는 섹션이 됩니다.' : 'This area will later set the tone for the blog.'}
              </h2>
              <p className={styles.heroNoteText}>
                {blogLocale === 'ko'
                  ? '기존 고양이 섹션 자리는 지금은 대표 이미지 placeholder로 바꿔 두었습니다. 추후 소개 문구, 대표 사진, 추천 글, 짧은 메모 등으로 자유롭게 교체할 수 있습니다.'
                  : 'The old cat section is now a placeholder hero image. You can later replace it with an intro note, featured post, profile image, or any editorial block you want.'}
              </p>
            </aside>
          </div>

          <section className={styles.notice}>
            <h2 className={styles.noticeTitle}>
              {blogLocale === 'ko' ? '작성 예정 상태로 전환된 블로그입니다.' : 'This blog is currently in placeholder mode.'}
            </h2>
            <p className={styles.noticeText}>
              {blogLocale === 'ko'
                ? '기존 글 대신 구조만 남겨두었고, 실제 포스트와 연구 노트는 추후 직접 채워 넣을 수 있도록 비워 두었습니다.'
                : 'The structure is preserved, but detailed posts and research notes have been replaced with placeholders for future updates.'}
            </p>
          </section>

          <div className={styles.postsSection}>
            <div className={styles.searchBar}>
              <svg className={styles.searchIcon} width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="11" cy="11" r="8" />
                <line x1="21" y1="21" x2="16.65" y2="16.65" />
              </svg>
              <input
                type="text"
                className={styles.searchInput}
                placeholder={blogLocale === 'ko' ? '제목, 태그, 내용으로 검색...' : 'Search by title, tags, or content...'}
                value={searchQuery}
                onChange={(event) => setSearchQuery(event.target.value)}
              />
              {searchQuery && (
                <button
                  className={styles.searchClear}
                  onClick={() => setSearchQuery('')}
                  aria-label="Clear search"
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
                  </svg>
                </button>
              )}
            </div>

            <div className={styles.toolbar}>
              <div className={styles.categories}>
                {categories.map((category) => (
                  <button
                    key={category}
                    className={`${styles.catBtn} ${activeCategory === category ? styles.catActive : ''}`}
                    onClick={() => setActiveCategory(category)}
                  >
                    {category}
                  </button>
                ))}
              </div>
              <div className={styles.toolbarActions}>
                <div className={styles.viewToggle}>
                  <button
                    className={`${styles.viewBtn} ${viewMode === 'grid' ? styles.viewActive : ''}`}
                    onClick={() => setViewMode('grid')}
                    aria-label="Grid view"
                  >
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <rect x="3" y="3" width="7" height="7" /><rect x="14" y="3" width="7" height="7" />
                      <rect x="3" y="14" width="7" height="7" /><rect x="14" y="14" width="7" height="7" />
                    </svg>
                  </button>
                  <button
                    className={`${styles.viewBtn} ${viewMode === 'list' ? styles.viewActive : ''}`}
                    onClick={() => setViewMode('list')}
                    aria-label="List view"
                  >
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <line x1="3" y1="6" x2="21" y2="6" /><line x1="3" y1="12" x2="21" y2="12" />
                      <line x1="3" y1="18" x2="21" y2="18" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>

            <div className={viewMode === 'grid' ? styles.grid : styles.list}>
              {filteredPosts.map((post, index) => (
                <BlogCard
                  key={post.slug}
                  post={post}
                  index={index}
                  viewMode={viewMode}
                  onDelete={isAdmin && post.source !== 'local' ? () => handleDelete(post.slug, post.title) : undefined}
                />
              ))}
              {filteredPosts.length === 0 && (
                <p className={styles.empty}>{t.empty}</p>
              )}
            </div>
          </div>
        </div>

        {toast && <div className={styles.toast}>{toast}</div>}
      </main>
    </>
  )
}
