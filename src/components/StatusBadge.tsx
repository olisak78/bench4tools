import type { Tool } from '../data/tools'

/** Small pill communicating whether a tool is live or still being built. */
export function StatusBadge({ status }: { status: Tool['status'] }) {
  if (status === 'available') {
    return (
      <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-2.5 py-0.5 text-xs font-medium text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400">
        <span className="size-1.5 rounded-full bg-emerald-500" />
        Available
      </span>
    )
  }
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-50 px-2.5 py-0.5 text-xs font-medium text-amber-700 dark:bg-amber-500/10 dark:text-amber-400">
      <span className="size-1.5 rounded-full bg-amber-500" />
      In development
    </span>
  )
}
