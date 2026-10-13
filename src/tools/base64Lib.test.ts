import { describe, expect, it } from 'vitest'
import {
  applyUrlSafe,
  base64ToBytes,
  Base64Error,
  bufferToBase64,
  decodeToText,
  encodeText,
  formatBytes,
  normalizeB64,
} from './base64Lib'

describe('encodeText / decodeToText', () => {
  it('encodes ASCII text to the expected Base64', () => {
    expect(encodeText('Bench4Tools')).toBe('QmVuY2g0VG9vbHM=')
  })

  it('round-trips ASCII text', () => {
    expect(decodeToText(encodeText('Hello, world!'))).toBe('Hello, world!')
  })

  it('round-trips Unicode, accents, CJK, and emoji without corruption', () => {
    const samples = ['José', 'façade', '日本語', '😀🎉', 'Ωμέγα', 'café ☕']
    for (const s of samples) {
      expect(decodeToText(encodeText(s))).toBe(s)
    }
  })

  it('handles empty input', () => {
    expect(encodeText('')).toBe('')
    expect(decodeToText('')).toBe('')
  })

  it('tolerates whitespace inside encoded input', () => {
    expect(decodeToText('QmVu Y2g0\nVG9v bHM=')).toBe('Bench4Tools')
  })

  it('throws a user-facing Base64Error on invalid input', () => {
    expect(() => decodeToText('!!!not base64!!!')).toThrow(Base64Error)
    try {
      decodeToText('@@@@')
    } catch (e) {
      expect((e as Error).message).toMatch(/invalid base64/i)
      expect((e as Error).message).not.toMatch(/stack|at Object|TypeError/i)
    }
  })

  it('throws a binary-content Base64Error when bytes are not UTF-8', () => {
    // 0xFF 0xFE 0xFD is valid Base64 but not valid UTF-8 text
    const b64 = bufferToBase64(new Uint8Array([0xff, 0xfe, 0xfd]).buffer)
    expect(() => decodeToText(b64)).toThrow(Base64Error)
    try {
      decodeToText(b64)
    } catch (e) {
      expect((e as Error).message).toMatch(/binary content/i)
    }
  })
})

describe('URL-safe variant', () => {
  it('removes +, /, and = from standard Base64', () => {
    const std = bufferToBase64(new Uint8Array([0xfb, 0xff, 0xfe]).buffer)
    expect(std).toMatch(/[+/]/)
    const safe = applyUrlSafe(std)
    expect(safe).not.toMatch(/[+/=]/)
  })

  it('decoder accepts URL-safe input (round-trips through decode)', () => {
    const text = 'subjects?a=1&b=2/ok+fine~~~'
    const safe = applyUrlSafe(encodeText(text))
    expect(decodeToText(safe)).toBe(text)
  })

  it('decoder accepts standard and URL-safe forms of the same bytes', () => {
    const bytes = new Uint8Array([0xfb, 0xff, 0xfe])
    const std = bufferToBase64(bytes.buffer)
    const safe = applyUrlSafe(std)
    expect([...base64ToBytes(std)]).toEqual([...bytes])
    expect([...base64ToBytes(safe)]).toEqual([...bytes])
  })
})

describe('normalizeB64', () => {
  it('restores padding and normalizes the alphabet', () => {
    expect(normalizeB64('QmVuY2g0VG9vbHM')).toBe('QmVuY2g0VG9vbHM=')
    expect(normalizeB64('a-b_')).toBe('a+b/')
  })
})

describe('bufferToBase64 / base64ToBytes', () => {
  it('round-trips arbitrary binary bytes', () => {
    const bytes = new Uint8Array([0, 1, 2, 127, 128, 254, 255])
    const b64 = bufferToBase64(bytes.buffer)
    expect([...base64ToBytes(b64)]).toEqual([...bytes])
  })

  it('handles large inputs without stack overflow (chunking)', () => {
    const big = new Uint8Array(500_000).map((_, i) => i % 256)
    const b64 = bufferToBase64(big.buffer)
    expect(base64ToBytes(b64).length).toBe(500_000)
  })
})

describe('formatBytes', () => {
  it('formats byte counts into human-readable sizes', () => {
    expect(formatBytes(512)).toBe('512 B')
    expect(formatBytes(1536)).toBe('1.5 KB')
    expect(formatBytes(5 * 1024 * 1024)).toBe('5.0 MB')
  })
})
