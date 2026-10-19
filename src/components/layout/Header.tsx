import { useState } from 'react'
import { NavLink } from 'react-router-dom'
import { tools } from '../../data/tools'
import { Container } from '../Container'
import { Logo } from '../Logo'
import { ThemeToggle } from '../ThemeToggle'

const navLinkBase =
  'rounded-lg px-3 py-2 text-sm font-medium transition-colors'

function navLinkClass({ isActive }: { isActive: boolean }) {
  return isActive
    ? `${navLinkBase} bg-brand-50 text-brand-700 dark:bg-brand-500/10 dark:text-brand-300`
    : `${navLinkBase} text-slate-600 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-white`
}

export function Header() {
  const [open, setOpen] = useState(false)

  return (
    <header className="sticky top-0 z-40 border-b border-slate-200 bg-white/80 backdrop-blur-md dark:border-slate-800 dark:bg-slate-950/80">
      <Container>
        <div className="flex h-16 items-center justify-between gap-4">
          <Logo />

          {/* Desktop navigation */}
          <nav
            className="hidden items-center gap-1 md:flex"
            aria-label="Primary"
          >
            <NavLink to="/" end className={navLinkClass} data-umami-event="nav-click" data-umami-event-page="home">
              Home
            </NavLink>
            {tools.map((tool) => (
              <NavLink key={tool.slug} to={tool.path} className={navLinkClass} data-umami-event="nav-click" data-umami-event-page={tool.slug}>
                {tool.name}
              </NavLink>
            ))}
          </nav>

          <div className="flex items-center gap-2">
            <ThemeToggle />
            {/* Mobile menu button */}
            <button
              type="button"
              onClick={() => setOpen((v) => !v)}
              data-umami-event={open ? undefined : 'mobile-menu-open'}
              className="grid size-9 place-items-center rounded-lg border border-slate-200 text-slate-600 transition-colors hover:bg-slate-100 md:hidden dark:border-slate-800 dark:text-slate-400 dark:hover:bg-slate-800"
              aria-expanded={open}
              aria-controls="mobile-nav"
              aria-label="Toggle navigation menu"
            >
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth={1.75}
                strokeLinecap="round"
                className="size-5"
                aria-hidden="true"
              >
                {open ? (
                  <path d="M6 6l12 12M18 6L6 18" />
                ) : (
                  <path d="M4 7h16M4 12h16M4 17h16" />
                )}
              </svg>
            </button>
          </div>
        </div>
      </Container>

      {/* Mobile navigation */}
      {open && (
        <nav
          id="mobile-nav"
          className="border-t border-slate-200 md:hidden dark:border-slate-800"
          aria-label="Primary"
        >
          <Container>
            <div className="flex flex-col gap-1 py-3">
              <NavLink
                to="/"
                end
                className={navLinkClass}
                onClick={() => setOpen(false)}
                data-umami-event="nav-click"
                data-umami-event-page="home"
              >
                Home
              </NavLink>
              {tools.map((tool) => (
                <NavLink
                  key={tool.slug}
                  to={tool.path}
                  className={navLinkClass}
                  onClick={() => setOpen(false)}
                  data-umami-event="nav-click"
                  data-umami-event-page={tool.slug}
                >
                  {tool.name}
                </NavLink>
              ))}
            </div>
          </Container>
        </nav>
      )}
    </header>
  )
}
