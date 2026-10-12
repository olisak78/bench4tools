import { useEffect } from 'react'
import { site } from '../data/site'

interface SeoProps {
  /** Page title; the brand name is appended automatically. */
  title: string
  description: string
  /** Route path, e.g. "/tools/json-formatter", used for the canonical URL. */
  path: string
  keywords?: string[]
  /** Optional JSON-LD structured data object(s). */
  structuredData?: Record<string, unknown> | Record<string, unknown>[]
}

/** Create or update a single <meta>/<link> element identified by an
 *  attribute selector, so navigating never leaves duplicate tags behind. */
function upsert(
  selector: string,
  tag: 'meta' | 'link',
  attrs: Record<string, string>,
) {
  let el = document.head.querySelector<HTMLElement>(selector)
  if (!el) {
    el = document.createElement(tag)
    document.head.appendChild(el)
  }
  for (const [key, value] of Object.entries(attrs)) {
    el.setAttribute(key, value)
  }
}

function removeIfPresent(selector: string) {
  document.head.querySelector(selector)?.remove()
}

/**
 * Per-page SEO metadata. index.html carries sensible static defaults for
 * crawlers that do not execute JavaScript; this component updates the live
 * document on each route change. Because the app is client-rendered, true
 * pre-rendering (SSG) is the recommended next step for full crawl coverage.
 */
export function Seo({
  title,
  description,
  path,
  keywords,
  structuredData,
}: SeoProps) {
  const fullTitle =
    path === '/' ? `${site.name} — ${site.tagline}` : `${title} — ${site.name}`
  const canonical = `${site.url}${path}`

  useEffect(() => {
    document.title = fullTitle

    upsert('meta[name="description"]', 'meta', {
      name: 'description',
      content: description,
    })

    if (keywords && keywords.length > 0) {
      upsert('meta[name="keywords"]', 'meta', {
        name: 'keywords',
        content: keywords.join(', '),
      })
    } else {
      removeIfPresent('meta[name="keywords"]')
    }

    upsert('link[rel="canonical"]', 'link', {
      rel: 'canonical',
      href: canonical,
    })

    // Open Graph / social
    upsert('meta[property="og:type"]', 'meta', {
      property: 'og:type',
      content: 'website',
    })
    upsert('meta[property="og:site_name"]', 'meta', {
      property: 'og:site_name',
      content: site.name,
    })
    upsert('meta[property="og:title"]', 'meta', {
      property: 'og:title',
      content: fullTitle,
    })
    upsert('meta[property="og:description"]', 'meta', {
      property: 'og:description',
      content: description,
    })
    upsert('meta[property="og:url"]', 'meta', {
      property: 'og:url',
      content: canonical,
    })
    upsert('meta[name="twitter:card"]', 'meta', {
      name: 'twitter:card',
      content: 'summary',
    })
    upsert('meta[name="twitter:title"]', 'meta', {
      name: 'twitter:title',
      content: fullTitle,
    })
    upsert('meta[name="twitter:description"]', 'meta', {
      name: 'twitter:description',
      content: description,
    })
  }, [fullTitle, description, canonical, keywords])

  useEffect(() => {
    if (!structuredData) return
    const script = document.createElement('script')
    script.type = 'application/ld+json'
    script.textContent = JSON.stringify(structuredData)
    document.head.appendChild(script)
    return () => {
      script.remove()
    }
  }, [structuredData])

  return null
}
