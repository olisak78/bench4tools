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
  /** The interactive tool interface. */
  children: ReactNode
  /** Use a wider (max-w-5xl) tool slot for tools that benefit from more
   *  horizontal space, such as the JSON formatter with its side-by-side
   *  input/output. The header and educational content remain max-w-3xl. */
  wide?: boolean
}

/** Build the JSON-LD structured data for a tool page. The SoftwareApplication
 *  entry is only emitted once the tool is actually available, so structured
 *  data never describes functionality the page does not yet provide. FAQPage
 *  and BreadcrumbList always mirror visible content. */
function buildStructuredData(tool: Tool) {
  const url = `${site.url}${tool.path}`
  const data: Record<string, unknown>[] = []

  if (tool.status === 'available') {
    data.push({
      '@context': 'https://schema.org',
      '@type': 'SoftwareApplication',
      name: `${tool.name} — ${site.name}`,
      applicationCategory: 'DeveloperApplication',
      operatingSystem: 'Any (web browser)',
      url,
      description: tool.seoDescription,
      offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
    })
  }

  data.push({
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: tool.faqs.map((f) => ({
      '@type': 'Question',
      name: f.question,
      acceptedAnswer: { '@type': 'Answer', text: f.answer },
    })),
  })

  data.push({
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
  })

  return data
}

export function ToolPageLayout({ tool, children, wide = false }: ToolPageLayoutProps) {
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
        {/* Breadcrumb + page header — always narrow */}
        <div className="mx-auto max-w-3xl">
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
            <p className="mt-2 leading-relaxed text-slate-500 dark:text-slate-400">
              {tool.useCases}
            </p>
          </header>
        </div>

        {/* Interactive tool area — can be wider for tools that benefit */}
        <section
          aria-label={`${tool.name} tool`}
          className={`mx-auto mt-8 ${wide ? 'max-w-5xl' : 'max-w-3xl'}`}
        >
          {children}
        </section>

        {/* Privacy note + educational content — always narrow */}
        <div className="mx-auto max-w-3xl">
          <div className="mt-6">
            <PrivacyNote
              message={tool.privacyNote}
              localProcessing={tool.localProcessing}
              status={tool.status}
            />
          </div>

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
                        <div>
                          <div className="mb-1 text-xs font-medium text-slate-400">
                            Input
                          </div>
                          <pre className="overflow-x-auto rounded-lg border border-slate-200 bg-slate-50 p-3 font-mono text-xs text-slate-700 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300">
                            <code>{ex.input}</code>
                          </pre>
                        </div>
                        <div>
                          <div className="mb-1 text-xs font-medium text-slate-400">
                            Output
                          </div>
                          <pre className="overflow-x-auto rounded-lg border border-slate-200 bg-slate-50 p-3 font-mono text-xs text-slate-700 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300">
                            <code>{ex.output}</code>
                          </pre>
                        </div>
                      </div>
                      {ex.note && (
                        <p className="mt-2 text-sm leading-relaxed text-slate-500 dark:text-slate-400">
                          {ex.note}
                        </p>
                      )}
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
