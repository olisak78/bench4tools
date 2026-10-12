import type { ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { site } from '../data/site'
import type { Tool } from '../data/tools'
import { Container } from './Container'
import { Faq } from './Faq'
import { PrivacyNote } from './PrivacyNote'
import { RelatedTools } from './RelatedTools'
import { Seo } from './Seo'
import { StatusBadge } from './StatusBadge'
import { ToolIcon } from './ToolIcon'

interface ToolPageLayoutProps {
  tool: Tool
  /** The interactive tool interface (a placeholder during Phase 1). */
  children: ReactNode
}

/** Build the JSON-LD structured data for a tool page: the app itself, its
 *  FAQ, and a breadcrumb trail. */
function buildStructuredData(tool: Tool) {
  const url = `${site.url}${tool.path}`
  return [
    {
      '@context': 'https://schema.org',
      '@type': 'SoftwareApplication',
      name: `${tool.name} — ${site.name}`,
      applicationCategory: 'DeveloperApplication',
      operatingSystem: 'Any (web browser)',
      url,
      description: tool.seoDescription,
      offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
    },
    {
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: tool.faqs.map((f) => ({
        '@type': 'Question',
        name: f.question,
        acceptedAnswer: { '@type': 'Answer', text: f.answer },
      })),
    },
    {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: [
        {
          '@type': 'ListItem',
          position: 1,
          name: site.name,
          item: site.url,
        },
        {
          '@type': 'ListItem',
          position: 2,
          name: tool.name,
          item: url,
        },
      ],
    },
  ]
}

export function ToolPageLayout({ tool, children }: ToolPageLayoutProps) {
  return (
    <>
      <Seo
        title={tool.seoTitle}
        description={tool.seoDescription}
        path={tool.path}
        keywords={tool.keywords}
        structuredData={buildStructuredData(tool)}
      />

      <Container className="py-8 sm:py-12">
        <div className="mx-auto max-w-3xl">
          {/* Breadcrumb */}
          <nav
            aria-label="Breadcrumb"
            className="flex items-center gap-1.5 text-sm text-slate-500 dark:text-slate-400"
          >
            <Link to="/" className="hover:text-brand-600 dark:hover:text-brand-400">
              Home
            </Link>
            <span aria-hidden="true">/</span>
            <span className="text-slate-700 dark:text-slate-300">{tool.name}</span>
          </nav>

          {/* Header */}
          <header className="mt-6">
            <div className="flex items-center gap-4">
              <span className="grid size-12 shrink-0 place-items-center rounded-xl bg-brand-50 text-brand-600 dark:bg-brand-500/10 dark:text-brand-400">
                <ToolIcon id={tool.icon} className="size-6" />
              </span>
              <StatusBadge status={tool.status} />
            </div>
            <h1 className="mt-5 text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl dark:text-white">
              {tool.heading}
            </h1>
            <p className="mt-3 text-lg leading-relaxed text-slate-500 dark:text-slate-400">
              {tool.intro}
            </p>
          </header>

          {/* Interactive tool (placeholder in Phase 1) */}
          <div className="mt-8">{children}</div>

          {/* Privacy statement */}
          <div className="mt-6">
            <PrivacyNote
              message={tool.privacyNote}
              localProcessing={tool.localProcessing}
            />
          </div>

          {/* SEO / educational content below the tool */}
          <div className="mt-14 space-y-14">
            <section aria-labelledby="about-heading">
              <h2
                id="about-heading"
                className="text-xl font-bold tracking-tight text-slate-900 dark:text-white"
              >
                {tool.about.heading}
              </h2>
              <div className="mt-4 space-y-4 leading-relaxed text-slate-600 dark:text-slate-300">
                {tool.about.paragraphs.map((p, i) => (
                  <p key={i}>{p}</p>
                ))}
              </div>
            </section>

            <section aria-labelledby="howto-heading">
              <h2
                id="howto-heading"
                className="text-xl font-bold tracking-tight text-slate-900 dark:text-white"
              >
                How to use it
              </h2>
              <ol className="mt-4 space-y-3">
                {tool.howToUse.map((step, i) => (
                  <li key={i} className="flex gap-3">
                    <span className="grid size-6 shrink-0 place-items-center rounded-full bg-brand-100 text-xs font-semibold text-brand-700 dark:bg-brand-500/15 dark:text-brand-300">
                      {i + 1}
                    </span>
                    <span className="leading-relaxed text-slate-600 dark:text-slate-300">
                      {step}
                    </span>
                  </li>
                ))}
              </ol>
            </section>

            {tool.examples.length > 0 && (
              <section aria-labelledby="examples-heading">
                <h2
                  id="examples-heading"
                  className="text-xl font-bold tracking-tight text-slate-900 dark:text-white"
                >
                  Examples
                </h2>
                <div className="mt-4 space-y-5">
                  {tool.examples.map((ex) => (
                    <div key={ex.label}>
                      <div className="text-sm font-medium text-slate-700 dark:text-slate-300">
                        {ex.label}
                      </div>
                      <div className="mt-2 grid gap-3 sm:grid-cols-2">
                        <pre className="overflow-x-auto rounded-lg border border-slate-200 bg-slate-50 p-3 font-mono text-xs text-slate-700 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300">
                          <code>{ex.input}</code>
                        </pre>
                        <pre className="overflow-x-auto rounded-lg border border-slate-200 bg-slate-50 p-3 font-mono text-xs text-slate-700 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300">
                          <code>{ex.output}</code>
                        </pre>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            )}

            <Faq items={tool.faqs} />

            <RelatedTools slugs={tool.related} />
          </div>
        </div>
      </Container>
    </>
  )
}
