interface PrivacyNoteProps {
  /** The tool-specific privacy message. */
  message: string
  /** Whether the tool genuinely processes everything locally. */
  localProcessing: boolean
}

/**
 * Shared privacy/trust callout shown on each tool page. The copy is supplied
 * per-tool so we never make an unverified claim about a tool that does not
 * actually run locally.
 */
export function PrivacyNote({ message, localProcessing }: PrivacyNoteProps) {
  return (
    <aside
      className="flex items-start gap-3 rounded-xl border border-emerald-200 bg-emerald-50/60 p-4 dark:border-emerald-500/20 dark:bg-emerald-500/5"
      aria-label="Privacy information"
    >
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth={1.75}
        strokeLinecap="round"
        strokeLinejoin="round"
        className="mt-0.5 size-5 shrink-0 text-emerald-600 dark:text-emerald-400"
        aria-hidden="true"
      >
        <path d="M12 2l7 4v6c0 5-3.5 8-7 10-3.5-2-7-5-7-10V6z" />
        <path d="M9 12l2 2 4-4" />
      </svg>
      <div className="text-sm leading-relaxed text-emerald-900 dark:text-emerald-200">
        <span className="font-semibold">
          {localProcessing ? 'Runs in your browser. ' : 'Privacy note. '}
        </span>
        {message}
      </div>
    </aside>
  )
}
