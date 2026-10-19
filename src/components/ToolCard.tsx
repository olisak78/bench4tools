import { Link } from 'react-router-dom'
import type { Tool } from '../data/tools'
import { StatusBadge } from './StatusBadge'
import { ToolIcon } from './ToolIcon'

/** Directory card linking to a single tool. Used on the homepage and in the
 *  related-tools section. */
export function ToolCard({ tool, source }: { tool: Tool; source?: string }) {
  return (
    <Link
      to={tool.path}
      aria-label={`Open ${tool.name}`}
      data-umami-event="tool-card-click"
      data-umami-event-tool={tool.slug}
      data-umami-event-source={source}
      className="group relative flex flex-col rounded-2xl border border-slate-200 bg-white p-6 transition-all hover:-translate-y-0.5 hover:border-brand-300 hover:shadow-lg hover:shadow-brand-500/5 dark:border-slate-800 dark:bg-slate-900 dark:hover:border-brand-500/40"
    >
      <div className="flex items-start justify-between gap-3">
        <span className="grid size-12 place-items-center rounded-xl bg-brand-50 text-brand-600 transition-colors group-hover:bg-brand-100 dark:bg-brand-500/10 dark:text-brand-400">
          <ToolIcon id={tool.icon} className="size-6" />
        </span>
        <StatusBadge status={tool.status} />
      </div>

      <h3 className="mt-5 text-lg font-semibold text-slate-900 dark:text-white">
        {tool.name}
      </h3>
      <p className="mt-2 flex-1 text-sm leading-relaxed text-slate-500 dark:text-slate-400">
        {tool.summary}
      </p>

      <span className="mt-5 inline-flex items-center gap-1.5 text-sm font-medium text-brand-600 dark:text-brand-400">
        Open tool
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth={2}
          strokeLinecap="round"
          strokeLinejoin="round"
          className="size-4 transition-transform group-hover:translate-x-0.5"
          aria-hidden="true"
        >
          <path d="M5 12h14M13 6l6 6-6 6" />
        </svg>
      </span>
    </Link>
  )
}
