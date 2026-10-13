/**
 * Pure Base64 encoding/decoding logic for the Base64 tool, extracted from the
 * component for unit testing. No React or DOM-document dependencies. Relies
 * only on standard platform globals (TextEncoder/TextDecoder, atob/btoa),
 * which exist in browsers and in Node 18+.
 */

/** Thrown for input that cannot be decoded; message is user-facing and safe. */
export class Base64Error extends Error {}

/** Normalize a Base64 string for decoding: strip whitespace, accept the
 *  URL-safe alphabet (-/_), and restore "=" padding so standard and URL-safe
 *  input both decode. */
export function normalizeB64(input: string): string {
  const cleaned = input
    .trim()
    .replace(/\s+/g, '')
    .replace(/-/g, '+')
    .replace(/_/g, '/')
  return cleaned.padEnd(cleaned.length + ((4 - (cleaned.length % 4)) % 4), '=')
}

/** Convert standard Base64 to the URL-safe alphabet: "+" → "-", "/" → "_",
 *  and drop "=" padding, so the result is safe in URLs and filenames. */
export function applyUrlSafe(b64: string): string {
  return b64.replace(/\+/g, '-').replace(/\//g, '_').replace(/=/g, '')
}

function bytesToBase64(bytes: Uint8Array): string {
  let binary = ''
  const chunk = 8192
  for (let i = 0; i < bytes.length; i += chunk) {
    binary += String.fromCharCode(...bytes.slice(i, i + chunk))
  }
  return btoa(binary)
}

/** Encode arbitrary text (including Unicode) to standard Base64. */
export function encodeText(text: string): string {
  return bytesToBase64(new TextEncoder().encode(text))
}

/**
 * Decode Base64 to text. Throws Base64Error with a user-facing message when
 * the input is not valid Base64, or when the decoded bytes are not valid
 * UTF-8 text (i.e. the data is binary and should be downloaded instead).
 */
export function decodeToText(b64: string): string {
  const bytes = base64ToBytes(b64)
  const decoder = new TextDecoder('utf-8', { fatal: true })
  try {
    return decoder.decode(bytes)
  } catch {
    throw new Base64Error(
      'The decoded bytes are not valid UTF-8 text. The encoded data may be binary content (an image, archive, or other file). ' +
        'Use the file workflow to download binary data.',
    )
  }
}

/** Convert an ArrayBuffer to Base64, chunked to avoid stack overflow. */
export function bufferToBase64(buffer: ArrayBuffer): string {
  return bytesToBase64(new Uint8Array(buffer))
}

/** Decode a Base64 string (standard or URL-safe) to raw bytes. Throws
 *  Base64Error on invalid input. */
export function base64ToBytes(b64: string): Uint8Array<ArrayBuffer> {
  let binary: string
  try {
    binary = atob(normalizeB64(b64))
  } catch {
    throw new Base64Error(
      'Invalid Base64 input. Check for characters outside the Base64 alphabet or an incomplete string.',
    )
  }
  return Uint8Array.from(binary, (c) => c.charCodeAt(0)) as Uint8Array<ArrayBuffer>
}

export function formatBytes(n: number): string {
  if (n < 1024) return `${n} B`
  if (n < 1024 * 1024) return `${(n / 1024).toFixed(1)} KB`
  return `${(n / (1024 * 1024)).toFixed(1)} MB`
}
