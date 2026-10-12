import { Link } from 'react-router-dom'
import { site } from '../data/site'

interface LogoProps {
  className?: string
}

/** Brand mark + wordmark, links back to the homepage. */
export function Logo({ className = '' }: LogoProps) {
  return (
    <Link
      to="/"
      className={`group inline-flex items-center gap-2.5 ${className}`}
      aria-label={`${site.name} home`}
    >
      <span className="grid size-9 place-items-center rounded-xl bg-brand-600 text-white shadow-sm transition-colors group-hover:bg-brand-500">
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth={2}
          strokeLinecap="round"
          strokeLinejoin="round"
          className="size-5"
          aria-hidden="true"
        >
          <path d="M8 6l-5 6 5 6" />
          <path d="M16 6l5 6-5 6" />
        </svg>
      </span>
      <span className="text-lg font-extrabold tracking-tight text-slate-900 dark:text-white">
        Bench<span className="text-brand-600 dark:text-brand-400">4</span>Tools
      </span>
    </Link>
  )
}
