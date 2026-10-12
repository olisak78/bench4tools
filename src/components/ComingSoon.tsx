import type { Tool } from '../data/tools'

/**
 * Placeholder for the interactive tool interface. Phase 1 establishes the
 * shared page structure; the actual tool logic lands in a later phase. This
 * is deliberately non-interactive and clearly labelled so it is never
 * mistaken for a working tool.
 */
export function ComingSoon({ tool }: { tool: Tool }) {
  return (
    <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-8 text-center dark:border-slate-700 dark:bg-slate-900/50">
      <span className="inline-grid size-12 place-items-center rounded-full bg-amber-100 text-amber-700 dark:bg-amber-500/15 dark:text-amber-400">
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
          <circle cx="12" cy="12" r="9" />
          <path d="M12 7v5l3 2" />
        </svg>
      </span>
      <h2 className="mt-4 text-lg font-semibold text-slate-900 dark:text-white">
        The {tool.name} is coming soon
      </h2>
      <p className="mx-auto mt-2 max-w-md text-sm leading-relaxed text-slate-500 dark:text-slate-400">
        The interface for this tool is being built. When it ships, it will run
        entirely in your browser — the privacy guarantee and page below already
        describe how it will work.
      </p>

      {/* Non-functional preview of the eventual input/output layout. */}
      <div
        className="mt-6 grid gap-3 text-left sm:grid-cols-2"
        aria-hidden="true"
      >
        <div className="rounded-lg border border-slate-200 bg-white p-3 dark:border-slate-800 dark:bg-slate-950">
          <div className="text-xs font-medium text-slate-400">Input</div>
          <div className="mt-2 space-y-1.5">
            <div className="h-2 w-5/6 rounded bg-slate-200 dark:bg-slate-800" />
            <div className="h-2 w-2/3 rounded bg-slate-200 dark:bg-slate-800" />
            <div className="h-2 w-3/4 rounded bg-slate-200 dark:bg-slate-800" />
          </div>
        </div>
        <div className="rounded-lg border border-slate-200 bg-white p-3 dark:border-slate-800 dark:bg-slate-950">
          <div className="text-xs font-medium text-slate-400">Output</div>
          <div className="mt-2 space-y-1.5">
            <div className="h-2 w-2/3 rounded bg-brand-100 dark:bg-brand-500/20" />
            <div className="h-2 w-5/6 rounded bg-brand-100 dark:bg-brand-500/20" />
            <div className="h-2 w-1/2 rounded bg-brand-100 dark:bg-brand-500/20" />
          </div>
        </div>
      </div>
    </div>
  )
}
