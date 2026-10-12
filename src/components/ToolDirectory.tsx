import { tools } from '../data/tools'
import { ToolCard } from './ToolCard'

interface ToolDirectoryProps {
  /** Optional heading + description; omit for a bare grid. */
  heading?: string
  description?: string
}

/** The grid of tool cards. Reused on the homepage as the primary directory. */
export function ToolDirectory({ heading, description }: ToolDirectoryProps) {
  return (
    <section aria-label="Available tools">
      {heading && (
        <div className="mb-8 max-w-2xl">
          <h2 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl dark:text-white">
            {heading}
          </h2>
          {description && (
            <p className="mt-3 text-slate-500 dark:text-slate-400">
              {description}
            </p>
          )}
        </div>
      )}
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {tools.map((tool) => (
          <ToolCard key={tool.slug} tool={tool} />
        ))}
      </div>
    </section>
  )
}
