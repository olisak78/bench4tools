import { Link } from 'react-router-dom'
import { Container } from '../components/Container'
import { Seo } from '../components/Seo'

export function NotFoundPage() {
  return (
    <>
      <Seo
        title="Page not found"
        description="The page you were looking for could not be found."
        path="/404"
      />
      <Container className="py-28 text-center">
        <p className="text-6xl font-extrabold tracking-tight text-brand-600 dark:text-brand-400">
          404
        </p>
        <h1 className="mt-4 text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
          Page not found
        </h1>
        <p className="mx-auto mt-3 max-w-md text-slate-500 dark:text-slate-400">
          The page you were looking for doesn't exist or may have moved. Head
          back to the toolbox to find what you need.
        </p>
        <Link
          to="/"
          data-umami-event="404-back-home"
          className="mt-8 inline-flex items-center gap-2 rounded-xl bg-brand-600 px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-brand-500"
        >
          Back to home
        </Link>
      </Container>
    </>
  )
}
