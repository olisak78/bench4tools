import { track } from '../lib/umami'
import type { FaqItem } from '../data/tools'

/**
 * Frequently asked questions, rendered as native <details> so it is
 * accessible and works without JavaScript. Emits FAQPage JSON-LD via the
 * caller's <Seo structuredData>.
 */
export function Faq({ items, tool }: { items: FaqItem[]; tool: string }) {
  if (items.length === 0) return null

  return (
    <section aria-labelledby="faq-heading">
      <h2
        id="faq-heading"
        className="text-xl font-bold tracking-tight text-slate-900 dark:text-white"
      >
        Frequently asked questions
      </h2>
      <div className="mt-5 divide-y divide-slate-200 rounded-xl border border-slate-200 dark:divide-slate-800 dark:border-slate-800">
        {items.map((item, i) => (
          <details
            key={item.question}
            className="group px-5"
            onToggle={(e) => {
              if (e.currentTarget.open) track('faq-expand', { tool, index: i })
            }}
          >
            <summary className="flex cursor-pointer list-none items-center justify-between gap-4 py-4 text-sm font-medium text-slate-900 marker:content-none dark:text-white">
              {item.question}
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth={2}
                strokeLinecap="round"
                strokeLinejoin="round"
                className="size-4 shrink-0 text-slate-400 transition-transform group-open:rotate-180"
                aria-hidden="true"
              >
                <path d="M6 9l6 6 6-6" />
              </svg>
            </summary>
            <p className="pb-4 text-sm leading-relaxed text-slate-500 dark:text-slate-400">
              {item.answer}
            </p>
          </details>
        ))}
      </div>
    </section>
  )
}
