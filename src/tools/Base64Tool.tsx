import { useRef, useState } from 'react'
import { CopyButton } from './CopyButton'

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

type Mode = 'encode' | 'decode'
type InputType = 'text' | 'file'

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

const FILE_SIZE_LIMIT = 5 * 1024 * 1024 // 5 MB

const EXAMPLE_TEXT = 'Hello from Bench4Tools!'

// ---------------------------------------------------------------------------
// Pure helpers
// ---------------------------------------------------------------------------

/** Encode arbitrary text (including Unicode) to standard Base64. */
function encodeText(text: string): string {
  const bytes = new TextEncoder().encode(text)
  let binary = ''
  const chunk = 8192
  for (let i = 0; i < bytes.length; i += chunk) {
    binary += String.fromCharCode(...bytes.slice(i, i + chunk))
  }
  return btoa(binary)
}

/**
 * Decode Base64 to text. Returns the decoded string, or throws if the input
 * is not valid Base64 or the bytes are not valid UTF-8.
 */
function decodeToText(b64: string): string {
  const cleaned = b64.trim().replace(/\s+/g, '')
  let binary: string
  try {
    binary = atob(cleaned)
  } catch {
    throw new Error(
      'Invalid Base64 input. Check for missing padding ("="), characters outside the Base64 alphabet, or whitespace inside the string.',
    )
  }
  const bytes = Uint8Array.from(binary, (c) => c.charCodeAt(0))
  const decoder = new TextDecoder('utf-8', { fatal: true })
  try {
    return decoder.decode(bytes)
  } catch {
    throw new Error(
      'The decoded bytes are not valid UTF-8 text. The encoded data may be binary content (an image, archive, or other file). ' +
      'Use the file workflow to download binary data.',
    )
  }
}

/** Convert an ArrayBuffer to Base64, chunked to avoid stack overflow. */
function bufferToBase64(buffer: ArrayBuffer): string {
  const bytes = new Uint8Array(buffer)
  let binary = ''
  const chunk = 8192
  for (let i = 0; i < bytes.length; i += chunk) {
    binary += String.fromCharCode(...bytes.slice(i, i + chunk))
  }
  return btoa(binary)
}

function readFileAsBuffer(file: File): Promise<ArrayBuffer> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = (e) => resolve(e.target!.result as ArrayBuffer)
    reader.onerror = () => reject(new Error('Failed to read the file.'))
    reader.readAsArrayBuffer(file)
  })
}

function downloadBlob(bytes: Uint8Array<ArrayBuffer>, filename: string) {
  const blob = new Blob([bytes])
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  URL.revokeObjectURL(url)
}

function base64ToBytes(b64: string): Uint8Array<ArrayBuffer> {
  const cleaned = b64.trim().replace(/\s+/g, '')
  const binary = atob(cleaned)
  return Uint8Array.from(binary, (c) => c.charCodeAt(0)) as Uint8Array<ArrayBuffer>
}

function formatBytes(n: number): string {
  if (n < 1024) return `${n} B`
  if (n < 1024 * 1024) return `${(n / 1024).toFixed(1)} KB`
  return `${(n / (1024 * 1024)).toFixed(1)} MB`
}

// ---------------------------------------------------------------------------
// Styling constants
// ---------------------------------------------------------------------------

const inputCls =
  'w-full resize-y rounded-xl border border-slate-200 bg-white px-4 py-3 font-mono text-sm text-slate-900 placeholder-slate-400 focus:border-transparent focus:outline-none focus:ring-2 focus:ring-brand-500 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 dark:placeholder-slate-500'

const tabActive =
  'rounded-lg bg-brand-600 px-4 py-2 text-sm font-semibold text-white shadow-sm'
const tabInactive =
  'rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300 dark:hover:bg-slate-800'

// ---------------------------------------------------------------------------
// Main component
// ---------------------------------------------------------------------------

export function Base64Tool() {
  const [mode, setMode] = useState<Mode>('encode')
  const [inputType, setInputType] = useState<InputType>('text')
  const [textInput, setTextInput] = useState('')
  const [output, setOutput] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [fileName, setFileName] = useState<string | null>(null)
  const [fileSize, setFileSize] = useState<number | null>(null)
  const [isBinary, setIsBinary] = useState(false)
  const [binaryBytes, setBinaryBytes] = useState<Uint8Array<ArrayBuffer> | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  // -------- mode/type switches --------

  function switchMode(next: Mode) {
    setMode(next)
    setOutput('')
    setError(null)
    setTextInput('')
    setFileName(null)
    setFileSize(null)
    setIsBinary(false)
    setBinaryBytes(null)
    setInputType('text')
  }

  function switchInputType(next: InputType) {
    setInputType(next)
    setOutput('')
    setError(null)
    setTextInput('')
    setFileName(null)
    setFileSize(null)
    setIsBinary(false)
    setBinaryBytes(null)
  }

  function handleClear() {
    setTextInput('')
    setOutput('')
    setError(null)
    setFileName(null)
    setFileSize(null)
    setIsBinary(false)
    setBinaryBytes(null)
    if (fileInputRef.current) fileInputRef.current.value = ''
  }

  // -------- text encode/decode --------

  function handleTextChange(value: string) {
    setTextInput(value)
    setError(null)
    if (!value) { setOutput(''); return }

    if (mode === 'encode') {
      try { setOutput(encodeText(value)) }
      catch (e) { setError(String(e)) }
    } else {
      try {
        setOutput(decodeToText(value))
        setIsBinary(false)
        setBinaryBytes(null)
      } catch (e) {
        // Check if it's the "binary data" error to show the download button
        const msg = e instanceof Error ? e.message : String(e)
        if (msg.includes('binary content')) {
          try {
            const bytes = base64ToBytes(value)
            setBinaryBytes(bytes)
            setIsBinary(true)
            setOutput('')
            setError(null)
          } catch {
            setError(msg)
            setIsBinary(false)
            setBinaryBytes(null)
          }
        } else {
          setError(msg)
          setIsBinary(false)
          setBinaryBytes(null)
        }
      }
    }
  }

  // -------- file encode --------

  async function handleFileSelect(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return

    setError(null)
    setOutput('')
    setFileName(file.name)
    setFileSize(file.size)
    setIsBinary(false)
    setBinaryBytes(null)

    if (file.size > FILE_SIZE_LIMIT) {
      setError(`File is too large (${formatBytes(file.size)}). The limit is ${formatBytes(FILE_SIZE_LIMIT)} to avoid freezing the browser.`)
      return
    }

    try {
      const buffer = await readFileAsBuffer(file)
      setOutput(bufferToBase64(buffer))
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not read the file.')
    }
  }

  // -------- file decode (decode Base64 → download) --------

  function handleDownload() {
    const raw = textInput.trim().replace(/\s+/g, '')
    if (!raw) return
    try {
      const bytes = base64ToBytes(raw)
      downloadBlob(bytes, 'decoded-file')
    } catch {
      setError('Could not decode the Base64 input for download. Check that the string is valid Base64.')
    }
  }

  // -------- example --------

  function loadExample() {
    if (mode === 'encode' && inputType === 'text') {
      handleTextChange(EXAMPLE_TEXT)
    } else if (mode === 'decode' && inputType === 'text') {
      handleTextChange(encodeText(EXAMPLE_TEXT))
    }
  }

  const showExample = inputType === 'text' && !textInput

  return (
    <div className="space-y-4 rounded-2xl border border-slate-200 bg-slate-50 p-4 sm:p-6 dark:border-slate-800 dark:bg-slate-900/50">
      {/* Mode toggle */}
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={() => switchMode('encode')}
          className={mode === 'encode' ? tabActive : tabInactive}
        >
          Encode
        </button>
        <button
          type="button"
          onClick={() => switchMode('decode')}
          className={mode === 'decode' ? tabActive : tabInactive}
        >
          Decode
        </button>
        <div className="ml-auto flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
          <span>Input:</span>
          {(['text', 'file'] as InputType[]).map((t) => (
            <button
              key={t}
              type="button"
              onClick={() => switchInputType(t)}
              className={`rounded px-2.5 py-1 font-medium transition-colors ${
                inputType === t
                  ? 'bg-brand-600 text-white'
                  : 'border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300 dark:hover:bg-slate-800'
              }`}
            >
              {t.charAt(0).toUpperCase() + t.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Input area */}
      {inputType === 'text' ? (
        <div>
          <div className="mb-1.5 flex items-center justify-between">
            <label htmlFor="b64-input" className="text-xs font-medium text-slate-500 dark:text-slate-400">
              {mode === 'encode' ? 'Text to encode' : 'Base64 to decode'}
            </label>
            <div className="flex items-center gap-2">
              {showExample && (
                <button
                  type="button"
                  onClick={loadExample}
                  className="text-xs text-brand-600 hover:text-brand-500 dark:text-brand-400 dark:hover:text-brand-300"
                >
                  Load example
                </button>
              )}
              {textInput && (
                <button
                  type="button"
                  onClick={handleClear}
                  className="text-xs text-slate-500 hover:text-red-600 dark:text-slate-400 dark:hover:text-red-400"
                >
                  Clear
                </button>
              )}
            </div>
          </div>
          <textarea
            id="b64-input"
            value={textInput}
            onChange={(e) => handleTextChange(e.target.value)}
            rows={5}
            spellCheck={false}
            autoComplete="off"
            className={inputCls}
            placeholder={
              mode === 'encode'
                ? 'Paste or type text here to encode…'
                : 'Paste a Base64 string here to decode…'
            }
            aria-label={mode === 'encode' ? 'Text to encode' : 'Base64 string to decode'}
          />
        </div>
      ) : (
        <div>
          <label className="text-xs font-medium text-slate-500 dark:text-slate-400">
            {mode === 'encode' ? 'File to encode' : 'Base64 to decode and download'}
          </label>
          {mode === 'encode' ? (
            <div className="mt-1.5">
              <label
                htmlFor="b64-file"
                className="flex cursor-pointer flex-col items-center gap-2 rounded-xl border-2 border-dashed border-slate-300 bg-white px-6 py-8 text-center transition-colors hover:border-brand-400 dark:border-slate-700 dark:bg-slate-900 dark:hover:border-brand-500"
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" className="size-8 text-slate-400" aria-hidden="true">
                  <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4" />
                  <polyline points="17 8 12 3 7 8" />
                  <line x1="12" y1="3" x2="12" y2="15" />
                </svg>
                <span className="text-sm text-slate-500 dark:text-slate-400">
                  Click to select a file <span className="text-slate-400">(max 5 MB)</span>
                </span>
                <input
                  id="b64-file"
                  ref={fileInputRef}
                  type="file"
                  onChange={handleFileSelect}
                  className="sr-only"
                  aria-label="Select file to encode"
                />
              </label>
              {fileName && (
                <div className="mt-2 flex items-center justify-between rounded-lg border border-slate-200 bg-white px-3 py-2 dark:border-slate-700 dark:bg-slate-900">
                  <div className="flex items-center gap-2 text-sm">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.75} strokeLinecap="round" strokeLinejoin="round" className="size-4 text-slate-400" aria-hidden="true">
                      <path d="M13 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V9z" />
                      <polyline points="13 2 13 9 20 9" />
                    </svg>
                    <span className="font-medium text-slate-700 dark:text-slate-300">{fileName}</span>
                    {fileSize !== null && (
                      <span className="text-slate-400">{formatBytes(fileSize)}</span>
                    )}
                  </div>
                  <button
                    type="button"
                    onClick={handleClear}
                    className="text-xs text-slate-400 hover:text-red-500 dark:hover:text-red-400"
                  >
                    Remove
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="mt-1.5 space-y-3">
              <div className="mb-1.5 flex items-center justify-between">
                <span className="text-xs text-slate-500 dark:text-slate-400">Paste the Base64 string and click Download</span>
                {textInput && (
                  <button type="button" onClick={handleClear} className="text-xs text-slate-500 hover:text-red-600 dark:text-slate-400 dark:hover:text-red-400">Clear</button>
                )}
              </div>
              <textarea
                value={textInput}
                onChange={(e) => setTextInput(e.target.value)}
                rows={5}
                spellCheck={false}
                autoComplete="off"
                className={inputCls}
                placeholder="Paste a Base64 string here…"
                aria-label="Base64 input for file download"
              />
              <button
                type="button"
                onClick={handleDownload}
                disabled={!textInput.trim()}
                className="inline-flex items-center gap-2 rounded-lg bg-brand-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-brand-500 disabled:pointer-events-none disabled:opacity-40"
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="size-4" aria-hidden="true">
                  <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4" />
                  <polyline points="7 10 12 15 17 10" />
                  <line x1="12" y1="15" x2="12" y2="3" />
                </svg>
                Download decoded file
              </button>
            </div>
          )}
        </div>
      )}

      {/* Error */}
      {error && (
        <div
          role="alert"
          className="flex items-start gap-2.5 rounded-xl border border-red-200 bg-red-50 p-3 text-sm dark:border-red-900 dark:bg-red-950/20"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.75} strokeLinecap="round" className="mt-0.5 size-4 shrink-0 text-red-500" aria-hidden="true">
            <circle cx="12" cy="12" r="9" />
            <path d="M12 8v4M12 16h.01" />
          </svg>
          <span className="text-red-700 dark:text-red-300">{error}</span>
        </div>
      )}

      {/* Binary data notice */}
      {isBinary && binaryBytes && (
        <div className="space-y-3">
          <div className="flex items-start gap-2.5 rounded-xl border border-blue-200 bg-blue-50 p-3 text-sm dark:border-blue-800 dark:bg-blue-950/20">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.75} strokeLinecap="round" className="mt-0.5 size-4 shrink-0 text-blue-500" aria-hidden="true">
              <circle cx="12" cy="12" r="9" />
              <path d="M12 8v4M12 16h.01" />
            </svg>
            <div className="text-blue-800 dark:text-blue-300">
              The decoded bytes are binary data ({formatBytes(binaryBytes.length)}) and cannot be displayed as text.
              {' '}Download it as a file instead.
            </div>
          </div>
          <button
            type="button"
            onClick={() => downloadBlob(binaryBytes, 'decoded-file')}
            className="inline-flex items-center gap-2 rounded-lg bg-brand-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-brand-500"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="size-4" aria-hidden="true">
              <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4" />
              <polyline points="7 10 12 15 17 10" />
              <line x1="12" y1="15" x2="12" y2="3" />
            </svg>
            Download decoded file
          </button>
        </div>
      )}

      {/* Text output */}
      {output && !isBinary && (
        <div>
          <div className="mb-1.5 flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500 dark:text-slate-400">
              {mode === 'encode' ? 'Base64 output' : 'Decoded text'}
            </span>
            <CopyButton text={output} label="output" />
          </div>
          <textarea
            readOnly
            value={output}
            rows={Math.min(Math.max(output.split('\n').length, 3), 12)}
            className={`${inputCls} cursor-default bg-slate-50 dark:bg-slate-800/50`}
            aria-label={mode === 'encode' ? 'Encoded Base64 output' : 'Decoded text output'}
            spellCheck={false}
          />
        </div>
      )}

      {/* Encoding note */}
      <p className="text-xs text-slate-400 dark:text-slate-500">
        Base64 is encoding, not encryption. Encoding data does not make it private or secret.
      </p>
    </div>
  )
}
