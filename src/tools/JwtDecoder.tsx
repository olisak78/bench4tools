import { useState } from 'react'
import { CopyButton } from './CopyButton'

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface DecodedJwt {
  header: Record<string, unknown>
  payload: Record<string, unknown>
  rawSignature: string
  headerJson: string
  payloadJson: string
}

// ---------------------------------------------------------------------------
// Example JWT (generated at module load — no external calls)
// ---------------------------------------------------------------------------

function makeExampleJwt(): string {
  const b64url = (obj: object) =>
    btoa(JSON.stringify(obj)).replace(/=/g, '').replace(/\+/g, '-').replace(/\//g, '_')
  const header = { alg: 'HS256', typ: 'JWT' }
  const payload = {
    iss: 'bench4tools.com',
    sub: 'demo-user',
    name: 'Ada Lovelace',
    admin: false,
    iat: 1704067200,   // 2024-01-01
    exp: 1893456000,   // 2029-12-31 — well in the future
  }
  return `${b64url(header)}.${b64url(payload)}.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c`
}

const EXAMPLE_JWT = makeExampleJwt()

// ---------------------------------------------------------------------------
// Pure helpers
// ---------------------------------------------------------------------------

function base64UrlDecode(str: string): string {
  const base64 = str.replace(/-/g, '+').replace(/_/g, '/')
  const padded = base64.padEnd(base64.length + ((4 - (base64.length % 4)) % 4), '=')
  return atob(padded)
}

function decodeJwt(token: string): DecodedJwt | string {
  const parts = token.trim().split('.')
  if (parts.length !== 3) {
    return `A JWT must have exactly three dot-separated parts. This token has ${parts.length}.`
  }
  const [rawHeader, rawPayload, rawSig] = parts
  let header: Record<string, unknown>
  let payload: Record<string, unknown>
  try {
    header = JSON.parse(base64UrlDecode(rawHeader)) as Record<string, unknown>
  } catch {
    return 'Could not decode the header segment. It may be malformed Base64URL or invalid JSON.'
  }
  try {
    payload = JSON.parse(base64UrlDecode(rawPayload)) as Record<string, unknown>
  } catch {
    return 'Could not decode the payload segment. It may be malformed Base64URL or invalid JSON.'
  }
  return {
    header,
    payload,
    rawSignature: rawSig,
    headerJson: JSON.stringify(header, null, 2),
    payloadJson: JSON.stringify(payload, null, 2),
  }
}

function formatUnixTime(ts: unknown): string | null {
  if (typeof ts !== 'number' || !isFinite(ts)) return null
  return new Date(ts * 1000).toUTCString()
}

function isExpired(ts: unknown): boolean | null {
  if (typeof ts !== 'number' || !isFinite(ts)) return null
  return Date.now() > ts * 1000
}

function isNotYetValid(ts: unknown): boolean | null {
  if (typeof ts !== 'number' || !isFinite(ts)) return null
  return Date.now() < ts * 1000
}

// ---------------------------------------------------------------------------
// Sub-components
// ---------------------------------------------------------------------------

function JsonBlock({ label, json, onCopy }: { label: string; json: string; onCopy: string }) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white dark:border-slate-700 dark:bg-slate-900">
      <div className="flex items-center justify-between border-b border-slate-200 px-4 py-2.5 dark:border-slate-700">
        <span className="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
          {label}
        </span>
        <CopyButton text={onCopy} label={label} />
      </div>
      <pre className="overflow-x-auto p-4 font-mono text-xs leading-relaxed text-slate-800 dark:text-slate-200">
        <code>{json}</code>
      </pre>
    </div>
  )
}

interface ClaimsProps {
  payload: Record<string, unknown>
}

function ClaimsSummary({ payload }: ClaimsProps) {
  const exp = payload.exp
  const iat = payload.iat
  const nbf = payload.nbf

  const expDate = formatUnixTime(exp)
  const iatDate = formatUnixTime(iat)
  const nbfDate = formatUnixTime(nbf)
  const expired = isExpired(exp)
  const notYetValid = isNotYetValid(nbf)

  if (!expDate && !iatDate && !nbfDate) return null

  return (
    <div className="rounded-xl border border-slate-200 bg-white dark:border-slate-700 dark:bg-slate-900">
      <div className="border-b border-slate-200 px-4 py-2.5 dark:border-slate-700">
        <span className="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
          Token times
        </span>
      </div>
      <dl className="divide-y divide-slate-100 dark:divide-slate-800">
        {iatDate && (
          <div className="grid grid-cols-[7rem_1fr] gap-x-3 px-4 py-2.5 text-sm">
            <dt className="font-mono text-xs font-medium text-slate-500 dark:text-slate-400 pt-0.5">iat</dt>
            <dd className="text-slate-700 dark:text-slate-300">{iatDate}</dd>
          </div>
        )}
        {nbfDate && (
          <div className="grid grid-cols-[7rem_1fr] gap-x-3 px-4 py-2.5 text-sm">
            <dt className="font-mono text-xs font-medium text-slate-500 dark:text-slate-400 pt-0.5">nbf</dt>
            <dd className="text-slate-700 dark:text-slate-300">
              {nbfDate}
              {notYetValid && (
                <span className="ml-2 inline-flex items-center rounded-full bg-amber-100 px-2 py-0.5 text-xs font-medium text-amber-700 dark:bg-amber-900/30 dark:text-amber-400">
                  Not yet valid
                </span>
              )}
            </dd>
          </div>
        )}
        {expDate && (
          <div className="grid grid-cols-[7rem_1fr] gap-x-3 px-4 py-2.5 text-sm">
            <dt className="font-mono text-xs font-medium text-slate-500 dark:text-slate-400 pt-0.5">exp</dt>
            <dd className="text-slate-700 dark:text-slate-300">
              {expDate}
              {expired === true && (
                <span className="ml-2 inline-flex items-center rounded-full bg-red-100 px-2 py-0.5 text-xs font-medium text-red-700 dark:bg-red-900/30 dark:text-red-400">
                  Expired
                </span>
              )}
              {expired === false && (
                <span className="ml-2 inline-flex items-center rounded-full bg-emerald-100 px-2 py-0.5 text-xs font-medium text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400">
                  Not expired
                </span>
              )}
            </dd>
          </div>
        )}
      </dl>
    </div>
  )
}

// ---------------------------------------------------------------------------
// Main component
// ---------------------------------------------------------------------------

const inputCls =
  'w-full rounded-xl border border-slate-200 bg-white px-4 py-3 font-mono text-sm text-slate-900 placeholder-slate-400 focus:border-transparent focus:outline-none focus:ring-2 focus:ring-brand-500 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 dark:placeholder-slate-500'

export function JwtDecoder() {
  const [input, setInput] = useState('')
  const [decoded, setDecoded] = useState<DecodedJwt | null>(null)
  const [error, setError] = useState<string | null>(null)

  function handleDecode(token: string) {
    const result = decodeJwt(token)
    if (typeof result === 'string') {
      setError(result)
      setDecoded(null)
    } else {
      setError(null)
      setDecoded(result)
    }
  }

  function handleInputChange(value: string) {
    setInput(value)
    if (!value.trim()) {
      setDecoded(null)
      setError(null)
      return
    }
    handleDecode(value)
  }

  function loadExample() {
    setInput(EXAMPLE_JWT)
    handleDecode(EXAMPLE_JWT)
  }

  function handleClear() {
    setInput('')
    setDecoded(null)
    setError(null)
  }

  return (
    <div className="space-y-4 rounded-2xl border border-slate-200 bg-slate-50 p-4 sm:p-6 dark:border-slate-800 dark:bg-slate-900/50">
      {/* Token input */}
      <div>
        <div className="mb-1.5 flex items-center justify-between">
          <label htmlFor="jwt-input" className="text-xs font-medium text-slate-500 dark:text-slate-400">
            Token
          </label>
          <div className="flex items-center gap-2">
            {!input && (
              <button
                type="button"
                onClick={loadExample}
                className="text-xs text-brand-600 hover:text-brand-500 dark:text-brand-400 dark:hover:text-brand-300"
              >
                Load example
              </button>
            )}
            {input && (
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
          id="jwt-input"
          value={input}
          onChange={(e) => handleInputChange(e.target.value)}
          rows={4}
          spellCheck={false}
          autoComplete="off"
          className={inputCls}
          placeholder="Paste a JWT here to decode it…"
          aria-label="JWT input"
        />
      </div>

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

      {/* Decoded output */}
      {decoded && (
        <div className="space-y-3">
          <JsonBlock
            label="Header"
            json={decoded.headerJson}
            onCopy={decoded.headerJson}
          />
          <JsonBlock
            label="Payload"
            json={decoded.payloadJson}
            onCopy={decoded.payloadJson}
          />
          <ClaimsSummary payload={decoded.payload} />

          {/* Signature — displayed but never verified */}
          <div className="rounded-xl border border-slate-200 bg-white dark:border-slate-700 dark:bg-slate-900">
            <div className="flex items-center justify-between border-b border-slate-200 px-4 py-2.5 dark:border-slate-700">
              <span className="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
                Signature
              </span>
            </div>
            <div className="break-all p-4 font-mono text-xs text-slate-500 dark:text-slate-400">
              {decoded.rawSignature}
            </div>
          </div>

          {/* Security disclaimer */}
          <div className="flex items-start gap-2.5 rounded-xl border border-amber-200 bg-amber-50/70 p-4 dark:border-amber-700/40 dark:bg-amber-900/10">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.75} strokeLinecap="round" strokeLinejoin="round" className="mt-0.5 size-4 shrink-0 text-amber-600 dark:text-amber-400" aria-hidden="true">
              <path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
              <path d="M12 9v4M12 17h.01" />
            </svg>
            <p className="text-xs leading-relaxed text-amber-800 dark:text-amber-300">
              <span className="font-semibold">Decoder only — not a verifier.</span> Decoding reveals
              the header and payload, but does not confirm that the signature is valid or that the
              token is authentic. A non-expired <code className="font-mono">exp</code> claim does not
              prove a token is trusted. Always verify signatures server-side using the signing key.
            </p>
          </div>
        </div>
      )}
    </div>
  )
}
