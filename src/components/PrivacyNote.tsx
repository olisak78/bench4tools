import type { Tool } from '../data/tools'

interface PrivacyNoteProps {
  /** The tool-specific privacy message. */
  message: string
  /** Whether the tool is designed to process everything locally. */
  localProcessing: boolean
  /** Launch status — controls the tense/label so we never claim a tool runs
   *  locally before it actually does. */
  status: Tool['status']
}

/**
 * Shared privacy/trust callout shown on each tool page. The copy is supplied
 * per-tool so we never make an unverified claim about a tool that does not
 * actually run locally — and while a tool is still in development the label
 * reflects that the guarantee is a design goal, not a verified behavior.
 */
export function PrivacyNote({
  message,
  localProcessing,
  status,
}: PrivacyNoteProps) {
  let label: string
  if (!localProcessing) {
    label = 'Privacy note. '
  } else if (status === 'available') {
    label = 'Runs in your browser. '
  } else {
    label = 'Private by design. '
  }

  return (
    <aside
      className="flex items-start gap-3 rounded-xl border border-green-200 bg-green-50/60 p-4 dark:border-green-500/20 dark:bg-green-500/5"
      aria-label="Privacy information"
    >
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth={1.75}
        strokeLinecap="round"
        strokeLinejoin="round"
        className="mt-0.5 size-5 shrink-0 text-green-600 dark:text-green-400"
        aria-hidden="true"
      >
        <path d="M12 2l7 4v6c0 5-3.5 8-7 10-3.5-2-7-5-7-10V6z" />
        <path d="M9 12l2 2 4-4" />
      </svg>
      <div className="text-sm leading-relaxed text-green-900 dark:text-green-200">
        <span className="font-semibold">{label}</span>
        {message}
      </div>
    </aside>
  )
}
