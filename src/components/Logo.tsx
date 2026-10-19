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
      className={`group inline-flex items-center gap-2 ${className}`}
      aria-label={`${site.name} home`}
      data-umami-event="logo-click"
    >
      <img
        src="/logo-icon.png"
        alt=""
        aria-hidden="true"
        className="size-9 shrink-0 object-contain"
      />
      <img
        src="/logo-wordmark.png"
        alt=""
        aria-hidden="true"
        className="h-auto w-[260px] object-contain"
      />
    </Link>
  )
}
