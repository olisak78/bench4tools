import { useState } from 'react'

function App() {
  const [count, setCount] = useState(0)

  return (
    <div className="min-h-svh flex flex-col items-center justify-center gap-8 bg-slate-50 text-slate-900 dark:bg-slate-950 dark:text-slate-100">
      <div className="text-center">
        <h1 className="text-5xl font-bold tracking-tight">bench4tools</h1>
        <p className="mt-3 text-slate-500 dark:text-slate-400">
          Vite + React + TypeScript + Tailwind
        </p>
      </div>

      <button
        type="button"
        onClick={() => setCount((c) => c + 1)}
        className="rounded-lg bg-indigo-600 px-5 py-2.5 font-medium text-white shadow-sm transition-colors hover:bg-indigo-500 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400"
      >
        count is {count}
      </button>

      <p className="text-sm text-slate-500 dark:text-slate-400">
        Edit{' '}
        <code className="rounded bg-slate-200 px-1.5 py-0.5 font-mono dark:bg-slate-800">
          src/App.tsx
        </code>{' '}
        and save to test HMR
      </p>
    </div>
  )
}

export default App
