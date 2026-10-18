import { Link } from 'react-router-dom'
import { Container } from '../components/Container'
import { Seo } from '../components/Seo'
import { ToolDirectory } from '../components/ToolDirectory'
import { site } from '../data/site'
import { tools } from '../data/tools'

const structuredData = [
  {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: site.name,
    url: site.url,
    description: site.description,
  },
  {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: `${site.name} tools`,
    itemListElement: tools.map((tool, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: tool.name,
      description: tool.summary,
      url: `${site.url}${tool.path}`,
    })),
  },
]

export function HomePage() {
  return (
    <>
      <Seo title={site.name} description={site.description} path="/" structuredData={structuredData} />

      {/* Hero */}
      <section className="relative overflow-hidden">
        <div
          className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(60%_60%_at_50%_0%,#e0f2fe_0%,transparent_70%)] dark:bg-[radial-gradient(60%_60%_at_50%_0%,rgba(0,115,183,0.12)_0%,transparent_70%)]"
          aria-hidden="true"
        />
        <Container className="pb-10 pt-10 text-center sm:pb-14 sm:pt-14">
          <p className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white/60 px-3 py-1 text-xs font-medium text-slate-600 dark:border-slate-800 dark:bg-slate-900/60 dark:text-slate-400">
            <span className="size-1.5 rounded-full bg-brand-500" />
            Free · No sign-up · Runs in your browser
          </p>
          <h1 className="mx-auto mt-6 max-w-3xl text-4xl font-extrabold tracking-tight text-slate-900 sm:text-6xl dark:text-white">
            Developer tools that respect your{' '}
            <span className="text-brand-600 dark:text-brand-400">privacy</span>
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-slate-500 dark:text-slate-400">
            {site.name} is a growing collection of fast, focused utilities for
            everyday development tasks. Your data is processed locally in your
            browser whenever possible — never uploaded to a server.
          </p>
          <div className="mt-9 flex flex-wrap items-center justify-center gap-3">
            <Link
              to={tools[0].path}
              className="inline-flex items-center gap-2 rounded-xl bg-brand-600 px-5 py-3 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-brand-500"
            >
              Open the {tools[0].name}
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth={2}
                strokeLinecap="round"
                strokeLinejoin="round"
                className="size-4"
                aria-hidden="true"
              >
                <path d="M5 12h14M13 6l6 6-6 6" />
              </svg>
            </Link>
            <a
              href="#tools"
              className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-700 transition-colors hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800"
            >
              Browse all tools
            </a>
          </div>
        </Container>
      </section>

      {/* Tool directory */}
      <Container className="scroll-mt-20 py-2">
        <div id="tools" className="scroll-mt-20" />
        <ToolDirectory
          heading="The toolbox"
          description="Everything we offer today. The catalog is intentionally small and focused — each tool is built to do one job well."
        />
      </Container>

      {/* Principles */}
      <Container className="py-20">
        <div id="about" className="scroll-mt-20" />
        <div className="max-w-2xl">
          <h2 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl dark:text-white">
            Built on a few simple principles
          </h2>
          <p className="mt-3 text-slate-500 dark:text-slate-400">
            {site.name} is designed to be the kind of tool you actually want to
            keep in a browser tab.
          </p>
        </div>
        <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {site.principles.map((principle) => (
            <div
              key={principle.title}
              className="rounded-2xl border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-900"
            >
              <h3 className="font-semibold text-slate-900 dark:text-white">
                {principle.title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-slate-500 dark:text-slate-400">
                {principle.body}
              </p>
            </div>
          ))}
        </div>
      </Container>

      {/* Privacy band */}
      <Container className="pb-20">
        <div id="privacy" className="scroll-mt-20" />
        <div className="relative overflow-hidden rounded-3xl border border-slate-200 bg-slate-900 p-8 text-center sm:p-14 dark:border-slate-800">
          <div
            className="pointer-events-none absolute inset-0 bg-[radial-gradient(50%_80%_at_50%_0%,rgba(0,115,183,0.35)_0%,transparent_70%)]"
            aria-hidden="true"
          />
          <div className="relative">
            <span className="inline-grid size-12 place-items-center rounded-full bg-white/10 text-brand-300">
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth={1.75}
                strokeLinecap="round"
                strokeLinejoin="round"
                className="size-6"
                aria-hidden="true"
              >
                <path d="M12 2l7 4v6c0 5-3.5 8-7 10-3.5-2-7-5-7-10V6z" />
                <path d="M9 12l2 2 4-4" />
              </svg>
            </span>
            <h2 className="mx-auto mt-5 max-w-2xl text-2xl font-bold tracking-tight text-white sm:text-3xl">
              Your data stays with you
            </h2>
            <p className="mx-auto mt-4 max-w-2xl leading-relaxed text-slate-300">
              Where a tool can run entirely in the browser, it does — your
              input is never sent to a server, logged, or stored. Each tool
              page states exactly how it handles your data, so you can paste
              sensitive content with confidence.
            </p>
          </div>
        </div>
      </Container>
    </>
  )
}
