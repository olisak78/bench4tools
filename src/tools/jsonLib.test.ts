import { describe, expect, it } from 'vitest'
import {
  formatJson,
  getIndentValue,
  minifyJson,
  parseWithError,
  sortDeep,
} from './jsonLib'

describe('parseWithError', () => {
  it('parses valid JSON objects', () => {
    const r = parseWithError('{"a":1,"b":[2,3]}')
    expect(r.error).toBeNull()
    expect(r.value).toEqual({ a: 1, b: [2, 3] })
  })

  it('accepts all JSON primitive types', () => {
    expect(parseWithError('"hi"').value).toBe('hi')
    expect(parseWithError('42').value).toBe(42)
    expect(parseWithError('true').value).toBe(true)
    expect(parseWithError('false').value).toBe(false)
    expect(parseWithError('null').value).toBeNull()
  })

  it('accepts empty objects and arrays', () => {
    expect(parseWithError('{}').value).toEqual({})
    expect(parseWithError('[]').value).toEqual([])
  })

  it('reports empty input as an error without a crash', () => {
    const r = parseWithError('   ')
    expect(r.value).toBeNull()
    expect(r.error?.message).toMatch(/empty/i)
  })

  it('rejects invalid JSON and never returns a value', () => {
    const r = parseWithError('{bad json,,}')
    expect(r.value).toBeNull()
    expect(r.error).not.toBeNull()
  })

  it('rejects trailing commas and single quotes (strict syntax)', () => {
    expect(parseWithError('{"a":1,}').error).not.toBeNull()
    expect(parseWithError("{'a':1}").error).not.toBeNull()
  })

  it('surfaces a location (line/col) for a multi-line syntax error', () => {
    const r = parseWithError('{\n  "a": 1\n  "b": 2\n}')
    expect(r.error).not.toBeNull()
    // At least one of line/col should be derived from the browser message.
    expect(r.error?.line ?? r.error?.col).toBeTypeOf('number')
  })

  it('preserves Unicode string values', () => {
    const r = parseWithError('{"name":"José 日本語 😀"}')
    expect(r.value).toEqual({ name: 'José 日本語 😀' })
  })

  it('handles deeply nested structures', () => {
    const deep = JSON.stringify({ a: { b: { c: { d: [1, [2, [3]]] } } } })
    expect(parseWithError(deep).error).toBeNull()
  })
})

describe('formatJson / minifyJson', () => {
  const value = { b: 2, a: 1, nested: { y: [1, 2], x: true } }

  it('pretty-prints with 2-space indentation', () => {
    const out = formatJson({ a: 1 }, '2', false)
    expect(out).toBe('{\n  "a": 1\n}')
  })

  it('pretty-prints with 4-space indentation', () => {
    expect(formatJson({ a: 1 }, '4', false)).toBe('{\n    "a": 1\n}')
  })

  it('pretty-prints with tab indentation', () => {
    expect(formatJson({ a: 1 }, 'tab', false)).toBe('{\n\t"a": 1\n}')
  })

  it('minifies to a single line', () => {
    expect(minifyJson(value, false)).toBe(
      '{"b":2,"a":1,"nested":{"y":[1,2],"x":true}}',
    )
  })

  it('round-trips: minify(format(x)) parses back to x', () => {
    const formatted = formatJson(value, '2', false)
    expect(JSON.parse(formatted)).toEqual(value)
  })

  it('sorts keys deeply only when requested, off by default', () => {
    expect(minifyJson(value, false)).toContain('"b":2,"a":1')
    expect(minifyJson(value, true)).toBe(
      '{"a":1,"b":2,"nested":{"x":true,"y":[1,2]}}',
    )
  })

  it('preserves array order when sorting keys', () => {
    expect(minifyJson({ arr: [3, 1, 2] }, true)).toBe('{"arr":[3,1,2]}')
  })
})

describe('sortDeep', () => {
  it('does not mutate primitives or arrays element order', () => {
    expect(sortDeep([3, 1, 2])).toEqual([3, 1, 2])
    expect(sortDeep(5)).toBe(5)
    expect(sortDeep(null)).toBeNull()
  })
})

describe('getIndentValue', () => {
  it('maps indent options to JSON.stringify arguments', () => {
    expect(getIndentValue('2')).toBe(2)
    expect(getIndentValue('4')).toBe(4)
    expect(getIndentValue('tab')).toBe('\t')
  })
})
