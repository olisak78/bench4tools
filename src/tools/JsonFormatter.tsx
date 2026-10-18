import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react'
import { CopyButton } from './CopyButton'
import {
  formatJson,
  minifyJson,
  parseWithError,
  type IndentOption,
  type JsonArray,
  type JsonObject,
  type JsonPrimitive,
  type JsonValue,
  type ParseError,
} from './jsonLib'

// ---------------------------------------------------------------------------
// Types (UI-only)
// ---------------------------------------------------------------------------

type OutputTab = 'formatted' | 'tree' | 'minified'

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

const DEFAULT_INPUT = `{
  "name": "Ada Lovelace",
  "born": 1815,
  "active": true,
  "notes": null,
  "languages": ["mathematics", "computing"],
  "address": {
    "city": "London",
    "country": "UK"
  }
}`

const MAX_ITEMS_PER_NODE = 100

// ---------------------------------------------------------------------------
// JSON Tree Viewer
// ---------------------------------------------------------------------------

interface TreeCtx {
  cmdId: number
  cmdType: 'none' | 'expand' | 'collapse'
}

const TreeContext = createContext<TreeCtx>({ cmdId: 0, cmdType: 'none' })

function primitiveColor(value: JsonPrimitive): string {
  if (value === null) return 'text-orange-500 dark:text-orange-400'
  switch (typeof value) {
    case 'string': return 'text-green-600 dark:text-green-400'
    case 'number': return 'text-blue-600 dark:text-blue-400'
    case 'boolean': return 'text-amber-600 dark:text-amber-400'
    default: return 'text-slate-600 dark:text-slate-300'
  }
}

function renderPrimitive(value: JsonPrimitive): string {
  if (value === null) return 'null'
  if (typeof value === 'string') return JSON.stringify(value)
  return String(value)
}

interface TreeNodeProps {
  value: JsonValue
  keyName: string | null
  depth: number
  isLast: boolean
}

function TreeNode({ value, keyName, depth, isLast }: TreeNodeProps) {
  const { cmdId, cmdType } = useContext(TreeContext)
  const [open, setOpen] = useState(depth < 2)
  // Derive expand/collapse commands during render (avoids setState-in-effect)
  const [seenCmdId, setSeenCmdId] = useState(cmdId)

  if (cmdId !== seenCmdId) {
    setSeenCmdId(cmdId)
    if (cmdType === 'expand') setOpen(true)
    else if (cmdType === 'collapse') setOpen(depth < 1)
  }

  const isArr = Array.isArray(value)
  const isObj = !isArr && typeof value === 'object' && value !== null
  const isContainer = isArr || isObj

  const keyEl = keyName !== null ? (
    <span className="text-brand-600 dark:text-brand-400">
      {JSON.stringify(keyName)}
      <span className="text-slate-500 dark:text-slate-400">: </span>
    </span>
  ) : null

  if (!isContainer) {
    const prim = value as JsonPrimitive
    return (
      <div className="flex items-start px-1 py-px font-mono text-xs leading-5">
        {keyEl}
        <span className={primitiveColor(prim)}>{renderPrimitive(prim)}</span>
        {!isLast && <span className="text-slate-400">,</span>}
      </div>
    )
  }

  const openBracket = isArr ? '[' : '{'
  const closeBracket = isArr ? ']' : '}'
  const entries: { k: string | null; v: JsonValue }[] = isArr
    ? (value as JsonArray).map((v) => ({ k: null, v }))
    : Object.entries(value as JsonObject).map(([k, v]) => ({ k, v }))
  const total = entries.length
  const shown = entries.slice(0, MAX_ITEMS_PER_NODE)

  if (total === 0) {
    return (
      <div className="flex items-start px-1 py-px font-mono text-xs leading-5">
        {keyEl}
        <span className="text-slate-500 dark:text-slate-400">{openBracket}{closeBracket}</span>
        {!isLast && <span className="text-slate-400">,</span>}
      </div>
    )
  }

  const summary = isArr
    ? `${total} ${total === 1 ? 'item' : 'items'}`
    : `${total} ${total === 1 ? 'key' : 'keys'}`

  return (
    <div>
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="flex w-full items-center gap-1 rounded px-1 py-px text-left hover:bg-slate-100 dark:hover:bg-slate-800"
        aria-expanded={open}
      >
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth={2.5}
          strokeLinecap="round"
          strokeLinejoin="round"
          className={`size-3 shrink-0 text-slate-400 transition-transform duration-100 ${open ? 'rotate-0' : '-rotate-90'}`}
          aria-hidden="true"
        >
          <path d="M6 9l6 6 6-6" />
        </svg>
        <span className="font-mono text-xs leading-5">
          {keyEl}
          <span className="text-slate-500 dark:text-slate-400">{openBracket}</span>
          {!open && (
            <span className="ml-1 text-slate-400 dark:text-slate-500">
              {summary}
              <span className="text-slate-500 dark:text-slate-400"> {closeBracket}</span>
              {!isLast && <span className="text-slate-400">,</span>}
            </span>
          )}
        </span>
      </button>

      {open && (
        <div className="ml-3 border-l border-slate-200 pl-3 dark:border-slate-700">
          {shown.map(({ k, v }, idx) => (
            <TreeNode
              key={k ?? idx}
              value={v}
              keyName={k}
              depth={depth + 1}
              isLast={idx === shown.length - 1 && total <= MAX_ITEMS_PER_NODE}
            />
          ))}
          {total > MAX_ITEMS_PER_NODE && (
            <div className="px-1 py-px font-mono text-xs text-slate-400 dark:text-slate-500">
              … {total - MAX_ITEMS_PER_NODE} more {isArr ? 'items' : 'keys'} not shown
            </div>
          )}
          <div className="px-1 py-px font-mono text-xs leading-5 text-slate-500 dark:text-slate-400">
            {closeBracket}{!isLast && <span className="text-slate-400">,</span>}
          </div>
        </div>
      )}
    </div>
  )
}

interface TreeViewerProps {
  value: JsonValue
}

function TreeViewer({ value }: TreeViewerProps) {
  const [cmd, setCmd] = useState<TreeCtx>({ cmdId: 0, cmdType: 'none' })

  return (
    <TreeContext.Provider value={cmd}>
      <div>
        <div className="mb-2 flex items-center gap-2">
          <button
            type="button"
            onClick={() => setCmd((c) => ({ cmdId: c.cmdId + 1, cmdType: 'expand' }))}
            className="text-xs text-brand-600 hover:text-brand-500 dark:text-brand-400 dark:hover:text-brand-300"
          >
            Expand all
          </button>
          <span className="text-slate-300 dark:text-slate-600">·</span>
          <button
            type="button"
            onClick={() => setCmd((c) => ({ cmdId: c.cmdId + 1, cmdType: 'collapse' }))}
            className="text-xs text-brand-600 hover:text-brand-500 dark:text-brand-400 dark:hover:text-brand-300"
          >
            Collapse all
          </button>
        </div>
        <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white p-4 dark:border-slate-700 dark:bg-slate-900">
          <TreeNode value={value} keyName={null} depth={0} isLast={true} />
        </div>
      </div>
    </TreeContext.Provider>
  )
}

// ---------------------------------------------------------------------------
// Main component
// ---------------------------------------------------------------------------

const inputCls =
  'w-full resize-y rounded-xl border border-slate-200 bg-white px-4 py-3 font-mono text-sm text-slate-900 placeholder-slate-400 focus:border-transparent focus:outline-none focus:ring-2 focus:ring-brand-500 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 dark:placeholder-slate-500'

const btnPrimary =
  'inline-flex items-center rounded-lg bg-brand-600 px-3.5 py-2 text-sm font-medium text-white transition-colors hover:bg-brand-500 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-500'

const btnSecondary =
  'inline-flex items-center rounded-lg border border-slate-200 bg-white px-3.5 py-2 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300 dark:hover:bg-slate-800'

const tabCls = (active: boolean) =>
  `rounded-lg px-3 py-1.5 text-sm font-medium transition-colors ${
    active
      ? 'bg-brand-50 text-brand-700 dark:bg-brand-500/15 dark:text-brand-300'
      : 'text-slate-600 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800'
  }`

export function JsonFormatter() {
  const [input, setInput] = useState(DEFAULT_INPUT)
  const [outputTab, setOutputTab] = useState<OutputTab>('formatted')
  const [formattedOutput, setFormattedOutput] = useState('')
  const [minifiedOutput, setMinifiedOutput] = useState('')
  const [parsedValue, setParsedValue] = useState<JsonValue | null>(null)
  const [error, setError] = useState<ParseError | null>(null)
  const [indent, setIndent] = useState<IndentOption>('2')
  const [sortKeys, setSortKeys] = useState(false)
  const [hasOutput, setHasOutput] = useState(false)
  const firstRender = useRef(true)

  // Live validation indicator (no output produced)
  // Live validation indicator. Memoized on input so we only re-parse when the
  // text actually changes, not on every unrelated re-render (indent toggles,
  // tab switches) — this keeps typing responsive for large documents.
  const liveValid = useMemo(
    () => (input.trim() ? parseWithError(input).error === null : null),
    [input],
  )

  // Define before useEffect so the effect captures the initialized function
  const runFormat = useCallback(() => {
    const result = parseWithError(input)
    if (result.error) {
      setError(result.error)
      setHasOutput(false)
      setParsedValue(null)
      return
    }
    setError(null)
    setParsedValue(result.value)
    const fmt = formatJson(result.value, indent, sortKeys)
    const min = minifyJson(result.value, sortKeys)
    setFormattedOutput(fmt)
    setMinifiedOutput(min)
    setHasOutput(true)
    setOutputTab('formatted')
  }, [input, indent, sortKeys])

  const runMinify = useCallback(() => {
    const result = parseWithError(input)
    if (result.error) {
      setError(result.error)
      setHasOutput(false)
      setParsedValue(null)
      return
    }
    setError(null)
    setParsedValue(result.value)
    const fmt = formatJson(result.value, indent, sortKeys)
    const min = minifyJson(result.value, sortKeys)
    setFormattedOutput(fmt)
    setMinifiedOutput(min)
    setHasOutput(true)
    setOutputTab('minified')
  }, [input, indent, sortKeys])

  // Auto-format the default example on first render
  useEffect(() => {
    if (!firstRender.current) return
    firstRender.current = false
    runFormat()
  })

  function handleClear() {
    setInput('')
    setFormattedOutput('')
    setMinifiedOutput('')
    setParsedValue(null)
    setError(null)
    setHasOutput(false)
  }

  const activeOutputText =
    outputTab === 'minified' ? minifiedOutput : formattedOutput

  const validDotCls =
    liveValid === true
      ? 'bg-green-500'
      : liveValid === false
        ? 'bg-red-500'
        : 'bg-slate-300 dark:bg-slate-600'

  return (
    <div className="space-y-4 rounded-2xl border border-slate-200 bg-slate-50 p-4 sm:p-6 dark:border-slate-800 dark:bg-slate-900/50">
      {/* Options toolbar */}
      <div className="flex flex-wrap items-center gap-3">
        <div className="flex items-center gap-2">
          <span className="text-xs font-medium text-slate-500 dark:text-slate-400">
            Indent
          </span>
          {(['2', '4', 'tab'] as IndentOption[]).map((opt) => (
            <button
              key={opt}
              type="button"
              onClick={() => setIndent(opt)}
              className={`rounded px-2.5 py-1 text-xs font-medium transition-colors ${
                indent === opt
                  ? 'bg-brand-600 text-white'
                  : 'border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300 dark:hover:bg-slate-800'
              }`}
            >
              {opt === 'tab' ? 'Tab' : `${opt} spaces`}
            </button>
          ))}
        </div>
        <label className="flex cursor-pointer items-center gap-1.5">
          <input
            type="checkbox"
            checked={sortKeys}
            onChange={(e) => setSortKeys(e.target.checked)}
            className="size-3.5 rounded accent-brand-600"
          />
          <span className="text-xs font-medium text-slate-500 dark:text-slate-400">
            Sort keys
          </span>
        </label>
      </div>

      {/* Input */}
      <div>
        <div className="mb-1.5 flex items-center justify-between">
          <label
            htmlFor="json-input"
            className="text-xs font-medium text-slate-500 dark:text-slate-400"
          >
            Input
          </label>
          <span className="flex items-center gap-1.5 text-xs">
            <span className={`size-2 rounded-full ${validDotCls}`} aria-hidden="true" />
            <span className="text-slate-500 dark:text-slate-400">
              {liveValid === true
                ? 'Valid JSON'
                : liveValid === false
                  ? 'Invalid JSON'
                  : 'Enter JSON'}
            </span>
          </span>
        </div>
        <textarea
          id="json-input"
          value={input}
          onChange={(e) => {
            setInput(e.target.value)
            setError(null)
          }}
          rows={10}
          spellCheck={false}
          autoComplete="off"
          className={inputCls}
          placeholder="Paste JSON here…"
          aria-label="JSON input"
          aria-describedby={error ? 'json-error' : undefined}
        />
      </div>

      {/* Action bar */}
      <div className="flex flex-wrap items-center gap-2">
        <button type="button" onClick={runFormat} className={btnPrimary}>
          Format
        </button>
        <button type="button" onClick={runMinify} className={btnSecondary}>
          Minify
        </button>
        <button
          type="button"
          onClick={handleClear}
          className="inline-flex items-center rounded-lg border border-slate-200 bg-white px-3.5 py-2 text-sm font-medium text-slate-500 transition-colors hover:border-red-200 hover:bg-red-50 hover:text-red-600 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-400 dark:hover:border-red-900 dark:hover:bg-red-950/20 dark:hover:text-red-400"
        >
          Clear
        </button>
      </div>

      {/* Error */}
      {error && (
        <div
          id="json-error"
          role="alert"
          className="flex items-start gap-2.5 rounded-xl border border-red-200 bg-red-50 p-3 text-sm dark:border-red-900 dark:bg-red-950/20"
        >
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth={1.75}
            strokeLinecap="round"
            className="mt-0.5 size-4 shrink-0 text-red-500"
            aria-hidden="true"
          >
            <circle cx="12" cy="12" r="9" />
            <path d="M12 8v4M12 16h.01" />
          </svg>
          <div className="text-red-700 dark:text-red-300">
            <span className="font-medium">
              {error.line ? `Line ${error.line}${error.col ? `, col ${error.col}` : ''}: ` : ''}
            </span>
            {error.message}
          </div>
        </div>
      )}

      {/* Output */}
      {hasOutput && (
        <div>
          <div className="mb-3 flex items-center justify-between gap-3">
            <div className="flex items-center gap-1">
              {(['formatted', 'tree', 'minified'] as OutputTab[]).map((tab) => (
                <button
                  key={tab}
                  type="button"
                  onClick={() => setOutputTab(tab)}
                  className={tabCls(outputTab === tab)}
                >
                  {tab.charAt(0).toUpperCase() + tab.slice(1)}
                </button>
              ))}
            </div>
            {outputTab !== 'tree' && (
              <CopyButton text={activeOutputText} label="output" />
            )}
          </div>

          {outputTab === 'tree' ? (
            <TreeViewer value={parsedValue!} />
          ) : (
            <textarea
              readOnly
              value={activeOutputText}
              rows={Math.min(Math.max(activeOutputText.split('\n').length, 6), 30)}
              spellCheck={false}
              className={`${inputCls} cursor-default bg-slate-50 dark:bg-slate-800/50`}
              aria-label={`${outputTab} JSON output`}
            />
          )}
        </div>
      )}
    </div>
  )
}
