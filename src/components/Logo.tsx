import { Link } from 'react-router-dom'
import { site } from '../data/site'

interface LogoProps {
  className?: string
  small?: boolean
}

/** Brand mark + wordmark, links back to the homepage. */
export function Logo({ className = '', small = false }: LogoProps) {
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
        className={`${small ? 'size-6' : 'size-9'} shrink-0 object-contain`}
      />
      <img
        src="/logo-wordmark.png"
        alt=""
        aria-hidden="true"
        className={`h-auto ${small ? 'w-[160px]' : 'w-[260px]'} object-contain`}
      />
    </Link>
  )
}
