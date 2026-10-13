import { describe, expect, it } from 'vitest'
import {
  base64UrlDecode,
  decodeJwt,
  formatUnixTime,
  isExpired,
  isNotYetValid,
  makeExampleJwt,
  type DecodedJwt,
} from './jwtLib'

// Build a token from parts for tests (illustrative values only, no secrets).
// Matches how real encoders work: UTF-8 encode the JSON, then Base64URL it.
function b64url(obj: unknown): string {
  const bytes = new TextEncoder().encode(JSON.stringify(obj))
  let bin = ''
  for (const byte of bytes) bin += String.fromCharCode(byte)
  return btoa(bin).replace(/=/g, '').replace(/\+/g, '-').replace(/\//g, '_')
}
function makeToken(header: unknown, payload: unknown, sig = 'sig'): string {
  return `${b64url(header)}.${b64url(payload)}.${sig}`
}

describe('decodeJwt', () => {
  it('decodes the header and payload of a well-formed token', () => {
    const token = makeToken(
      { alg: 'HS256', typ: 'JWT' },
      { sub: '123', name: 'Ada', admin: false },
    )
    const d = decodeJwt(token) as DecodedJwt
    expect(typeof d).not.toBe('string')
    expect(d.header).toEqual({ alg: 'HS256', typ: 'JWT' })
    expect(d.payload).toEqual({ sub: '123', name: 'Ada', admin: false })
    expect(d.rawSignature).toBe('sig')
  })

  it('decodes Unicode claim values without corruption (regression)', () => {
    const token = makeToken(
      { alg: 'HS256', typ: 'JWT' },
      { name: 'José 日本語 😀', role: 'админ' },
    )
    const d = decodeJwt(token) as DecodedJwt
    expect(d.payload.name).toBe('José 日本語 😀')
    expect(d.payload.role).toBe('админ')
  })

  it('returns an error string for a token without three parts', () => {
    expect(decodeJwt('only.two')).toMatch(/three/i)
    expect(decodeJwt('a.b.c.d')).toMatch(/three/i)
  })

  it('returns an error string for an invalid Base64URL / JSON segment', () => {
    const bad = `@@@.${b64url({ a: 1 })}.sig`
    expect(decodeJwt(bad)).toMatch(/header/i)
    const badPayload = `${b64url({ alg: 'HS256' })}.@@@.sig`
    expect(decodeJwt(badPayload)).toMatch(/payload/i)
  })

  it('handles missing optional claims (payload need not contain exp/iat)', () => {
    const token = makeToken({ alg: 'none' }, { sub: 'x' })
    const d = decodeJwt(token) as DecodedJwt
    expect(d.payload).toEqual({ sub: 'x' })
    expect(d.payload.exp).toBeUndefined()
  })

  it('does not throw on an empty payload segment', () => {
    const token = `${b64url({ alg: 'HS256' })}..sig`
    expect(typeof decodeJwt(token)).toBe('string')
  })
})

describe('base64UrlDecode', () => {
  it('decodes UTF-8 bytes correctly', () => {
    expect(base64UrlDecode(b64url({ x: 'ü' }))).toBe('{"x":"ü"}')
  })
})

describe('time claims', () => {
  const now = Date.UTC(2026, 0, 1) // fixed reference instant

  it('formats numeric Unix timestamps and ignores non-numeric values', () => {
    expect(formatUnixTime(1704067200)).toContain('2024')
    expect(formatUnixTime('not-a-number')).toBeNull()
    expect(formatUnixTime(undefined)).toBeNull()
  })

  it('detects expired vs non-expired exp claims', () => {
    expect(isExpired(1704067200, now)).toBe(true) // 2024 < 2026 → expired
    expect(isExpired(4102444800, now)).toBe(false) // 2100 → not expired
    expect(isExpired(undefined, now)).toBeNull()
  })

  it('detects not-yet-valid nbf claims', () => {
    expect(isNotYetValid(4102444800, now)).toBe(true) // 2100 → not yet valid
    expect(isNotYetValid(1704067200, now)).toBe(false) // 2024 → already valid
    expect(isNotYetValid(undefined, now)).toBeNull()
  })
})

describe('makeExampleJwt', () => {
  it('produces a decodable three-part example token', () => {
    const token = makeExampleJwt()
    expect(token.split('.')).toHaveLength(3)
    const d = decodeJwt(token) as DecodedJwt
    expect(d.header.alg).toBe('HS256')
    expect(d.payload.iss).toBe('bench4tools.com')
    // exp is well in the future, so the example never shows as expired
    expect(isExpired(d.payload.exp, Date.UTC(2026, 0, 1))).toBe(false)
  })
})
