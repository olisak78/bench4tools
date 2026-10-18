import { useState } from 'react'

interface CopyButtonProps {
  text: string
  label?: string
  className?: string
}

type CopyStatus = 'idle' | 'copied' | 'error'

/**
 * Copy text to the clipboard, gracefully degrading when the async Clipboard
 * API is unavailable (insecure context / older browsers) or blocked by
 * permissions. Returns whether the copy succeeded; never throws.
 */
async function copyText(text: string): Promise<boolean> {
  try {
    if (navigator.clipboard?.writeText) {
      await navigator.clipboard.writeText(text)
      return true
    }
  } catch {
    // fall through to the legacy fallback below
  }
  try {
    const ta = document.createElement('textarea')
    ta.value = text
    ta.setAttribute('readonly', '')
    ta.style.position = 'fixed'
    ta.style.top = '0'
    ta.style.left = '0'
    ta.style.opacity = '0'
    document.body.appendChild(ta)
    ta.focus()
    ta.select()
    const ok = document.execCommand('copy')
    document.body.removeChild(ta)
    return ok
  } catch {
    return false
  }
}

export function CopyButton({ text, label = 'Copy', className = '' }: CopyButtonProps) {
  const [status, setStatus] = useState<CopyStatus>('idle')

  async function handleCopy() {
    const ok = await copyText(text)
    setStatus(ok ? 'copied' : 'error')
    setTimeout(() => setStatus('idle'), ok ? 2000 : 3000)
  }

  const copied = status === 'copied'
  const errored = status === 'error'

  const stateClasses = copied
    ? 'border-green-200 bg-green-50 text-green-700 dark:border-green-800 dark:bg-green-950/40 dark:text-green-400'
    : errored
      ? 'border-red-200 bg-red-50 text-red-700 dark:border-red-800 dark:bg-red-950/40 dark:text-red-400'
      : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300 dark:hover:bg-slate-800'

  const announce = copied
    ? `Copied ${label} to clipboard`
    : errored
      ? `Could not copy ${label}. Select the text and copy manually.`
      : ''

  return (
    <>
      <button
        type="button"
        onClick={handleCopy}
        disabled={!text}
        className={`inline-flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-sm font-medium transition-colors disabled:pointer-events-none disabled:opacity-40 ${stateClasses} ${className}`}
        aria-label={
          copied
            ? `Copied ${label}`
            : errored
              ? `Could not copy ${label}`
              : `Copy ${label}`
        }
      >
        {copied ? (
          <>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round" className="size-3.5" aria-hidden="true">
              <path d="M20 6L9 17l-5-5" />
            </svg>
            Copied!
          </>
        ) : errored ? (
          <>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="size-3.5" aria-hidden="true">
              <circle cx="12" cy="12" r="9" />
              <path d="M12 8v4M12 16h.01" />
            </svg>
            Copy failed
          </>
        ) : (
          <>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.75} strokeLinecap="round" strokeLinejoin="round" className="size-3.5" aria-hidden="true">
              <rect x="9" y="9" width="13" height="13" rx="2" />
              <path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1" />
            </svg>
            {label}
          </>
        )}
      </button>
      {/* Announce the result to assistive technology without relying on color. */}
      <span role="status" aria-live="polite" className="sr-only">
        {announce}
      </span>
    </>
  )
}
