/**
 * Pure JWT decoding logic, extracted from the component for unit testing.
 * This module only ever DECODES a token for inspection — it never verifies a
 * signature and must never be presented as establishing authenticity.
 * No React or DOM-document dependencies.
 */

export interface DecodedJwt {
  header: Record<string, unknown>
  payload: Record<string, unknown>
  rawSignature: string
  headerJson: string
  payloadJson: string
}

/**
 * Decode a Base64URL segment to a UTF-8 string. JWT segments are UTF-8 encoded,
 * so we decode to bytes and run them through TextDecoder rather than using
 * atob() directly, which would corrupt any non-ASCII claim values.
 */
export function base64UrlDecode(str: string): string {
  const base64 = str.replace(/-/g, '+').replace(/_/g, '/')
  const padded = base64.padEnd(
    base64.length + ((4 - (base64.length % 4)) % 4),
    '=',
  )
  const binary = atob(padded)
  const bytes = Uint8Array.from(binary, (c) => c.charCodeAt(0))
  return new TextDecoder('utf-8', { fatal: false }).decode(bytes)
}

/**
 * Decode a JWT into its header, payload, and raw signature. Returns a
 * human-readable error string (never throws) when the token is malformed, a
 * segment is not valid Base64URL, or a segment is not valid JSON.
 */
export function decodeJwt(token: string): DecodedJwt | string {
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

/** Format a Unix-seconds timestamp as a UTC string, or null if not numeric. */
export function formatUnixTime(ts: unknown): string | null {
  if (typeof ts !== 'number' || !isFinite(ts)) return null
  return new Date(ts * 1000).toUTCString()
}

/** True if the given exp timestamp is in the past (expired). */
export function isExpired(ts: unknown, now: number = Date.now()): boolean | null {
  if (typeof ts !== 'number' || !isFinite(ts)) return null
  return now > ts * 1000
}

/** True if the given nbf timestamp is still in the future (not yet valid). */
export function isNotYetValid(
  ts: unknown,
  now: number = Date.now(),
): boolean | null {
  if (typeof ts !== 'number' || !isFinite(ts)) return null
  return now < ts * 1000
}

/** Build an illustrative example token at module load (no network, no secret
 *  of value — the signature is a well-known sample string). */
export function makeExampleJwt(): string {
  const b64url = (obj: object) =>
    btoa(JSON.stringify(obj))
      .replace(/=/g, '')
      .replace(/\+/g, '-')
      .replace(/\//g, '_')
  const header = { alg: 'HS256', typ: 'JWT' }
  const payload = {
    iss: 'bench4tools.com',
    sub: 'demo-user',
    name: 'Ada Lovelace',
    admin: false,
    iat: 1704067200, // 2024-01-01
    exp: 1893456000, // 2029-12-31 — well in the future
  }
  return `${b64url(header)}.${b64url(payload)}.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c`
}
