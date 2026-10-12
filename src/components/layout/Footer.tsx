import { Link } from 'react-router-dom'
import { site } from '../../data/site'
import { tools } from '../../data/tools'
import { Container } from '../Container'
import { Logo } from '../Logo'

export function Footer() {
  const year = 2026

  return (
    <footer className="mt-24 border-t border-slate-200 bg-slate-50 dark:border-slate-800 dark:bg-slate-900/40">
      <Container className="py-12">
        <div className="grid gap-10 md:grid-cols-[1.5fr_1fr_1fr]">
          <div className="max-w-sm">
            <Logo />
            <p className="mt-4 text-sm leading-relaxed text-slate-500 dark:text-slate-400">
              {site.description}
            </p>
          </div>

          <nav aria-label="Tools">
            <h2 className="text-sm font-semibold text-slate-900 dark:text-white">
              Tools
            </h2>
            <ul className="mt-4 space-y-2.5">
              {tools.map((tool) => (
                <li key={tool.slug}>
                  <Link
                    to={tool.path}
                    className="text-sm text-slate-500 transition-colors hover:text-brand-600 dark:text-slate-400 dark:hover:text-brand-400"
                  >
                    {tool.name}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <nav aria-label="Site">
            <h2 className="text-sm font-semibold text-slate-900 dark:text-white">
              Bench4Tools
            </h2>
            <ul className="mt-4 space-y-2.5">
              <li>
                <Link
                  to="/"
                  className="text-sm text-slate-500 transition-colors hover:text-brand-600 dark:text-slate-400 dark:hover:text-brand-400"
                >
                  Home
                </Link>
              </li>
              <li>
                <Link
                  to="/#about"
                  className="text-sm text-slate-500 transition-colors hover:text-brand-600 dark:text-slate-400 dark:hover:text-brand-400"
                >
                  About
                </Link>
              </li>
              <li>
                <Link
                  to="/#privacy"
                  className="text-sm text-slate-500 transition-colors hover:text-brand-600 dark:text-slate-400 dark:hover:text-brand-400"
                >
                  Privacy
                </Link>
              </li>
            </ul>
          </nav>
        </div>

        <div className="mt-10 flex flex-col items-start justify-between gap-4 border-t border-slate-200 pt-6 sm:flex-row sm:items-center dark:border-slate-800">
          <p className="text-sm text-slate-500 dark:text-slate-400">
            © {year} {site.name}. Free developer tools that run in your browser.
          </p>
          <p className="inline-flex items-center gap-1.5 text-sm font-medium text-slate-600 dark:text-slate-300">
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth={1.75}
              strokeLinecap="round"
              strokeLinejoin="round"
              className="size-4 text-brand-600 dark:text-brand-400"
              aria-hidden="true"
            >
              <path d="M12 2l7 4v6c0 5-3.5 8-7 10-3.5-2-7-5-7-10V6z" />
            </svg>
            Private by design
          </p>
        </div>
      </Container>
    </footer>
  )
}
