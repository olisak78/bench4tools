import { getRelatedTools } from '../data/tools'
import { ToolCard } from './ToolCard'

/** Internal-linking block connecting a tool to its siblings. Grows naturally
 *  as the catalog expands. */
export function RelatedTools({ slugs }: { slugs: string[] }) {
  const related = getRelatedTools(slugs)
  if (related.length === 0) return null

  return (
    <section aria-labelledby="related-heading">
      <h2
        id="related-heading"
        className="text-xl font-bold tracking-tight text-slate-900 dark:text-white"
      >
        Related tools
      </h2>
      <div className="mt-5 grid gap-5 sm:grid-cols-2">
        {related.map((tool) => (
          <ToolCard key={tool.slug} tool={tool} source="related" />
        ))}
      </div>
    </section>
  )
}
