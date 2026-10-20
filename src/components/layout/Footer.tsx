import { Link } from 'react-router-dom'
import { site } from '../../data/site'
import { tools } from '../../data/tools'
import { Container } from '../Container'
import { Logo } from '../Logo'

export function Footer() {
  const year = 2026

  return (
    <footer className="mt-24 border-t border-slate-200 bg-slate-50 dark:border-slate-800 dark:bg-slate-900/40">
      <Container className="pb-12 pt-4">
        <div className="grid gap-10 md:grid-cols-[1.5fr_1fr_1fr]">
          <div className="max-w-sm">
            <Logo small />
            <p className="mt-4 text-sm leading-relaxed text-slate-500 dark:text-slate-400">
              {site.description}
            </p>
            <div className="mt-6">
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-600 dark:text-slate-300">
                Support this project
              </p>
              <div className="mt-3 flex items-center gap-4">
                <img
                  src="/qr-code.png"
                  alt="Buy Me a Coffee QR code"
                  className="size-20 shrink-0 rounded-lg border border-slate-200 bg-white p-1 dark:border-slate-700"
                />
                <p className="text-base leading-relaxed text-slate-500 dark:text-slate-400">
                  If this saved you time, scan to buy me a coffee ☕
                </p>
              </div>
            </div>
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
                    data-umami-event="footer-nav-click"
                    data-umami-event-page={tool.slug}
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
                  data-umami-event="footer-nav-click"
                  data-umami-event-page="home"
                  className="text-sm text-slate-500 transition-colors hover:text-brand-600 dark:text-slate-400 dark:hover:text-brand-400"
                >
                  Home
                </Link>
              </li>
              <li>
                <Link
                  to="/#about"
                  data-umami-event="footer-nav-click"
                  data-umami-event-page="about"
                  className="text-sm text-slate-500 transition-colors hover:text-brand-600 dark:text-slate-400 dark:hover:text-brand-400"
                >
                  About
                </Link>
              </li>
              <li>
                <Link
                  to="/#privacy"
                  data-umami-event="footer-nav-click"
                  data-umami-event-page="privacy"
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
