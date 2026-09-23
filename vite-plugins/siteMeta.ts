import type { HtmlTagDescriptor, Plugin } from 'vite'

interface SiteInfo {
  title: string
  description: string
  /** Canonical absolute URL of the deployed page, ending in `/`. */
  url: string
}

/** Writes <title>, the description, the canonical link and link-preview tags into index.html. */
export function siteMeta(site: SiteInfo): Plugin {
  const image = new URL('og-image.png', site.url).href
  const meta = (attrs: Record<string, string>): HtmlTagDescriptor => ({ tag: 'meta', attrs, injectTo: 'head' })

  return {
    name: 'site-meta',
    transformIndexHtml: () => [
      { tag: 'title', children: site.title, injectTo: 'head' },
      meta({ name: 'description', content: site.description }),
      { tag: 'link', attrs: { rel: 'canonical', href: site.url }, injectTo: 'head' },
      meta({ property: 'og:type', content: 'profile' }),
      meta({ property: 'og:url', content: site.url }),
      meta({ property: 'og:title', content: site.title }),
      meta({ property: 'og:description', content: site.description }),
      meta({ property: 'og:image', content: image }),
      meta({ property: 'og:image:width', content: '1200' }),
      meta({ property: 'og:image:height', content: '630' }),
      meta({ name: 'twitter:card', content: 'summary_large_image' }),
    ],
  }
}
