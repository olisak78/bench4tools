/**
 * Pure JSON parsing/formatting logic for the JSON Formatter tool, extracted
 * from the component so it can be unit-tested in isolation. No React or DOM
 * dependencies — safe to import from tests.
 */

export type IndentOption = '2' | '4' | 'tab'

export interface ParseError {
  message: string
  line?: number
  col?: number
}

export type JsonPrimitive = string | number | boolean | null
export type JsonObject = { [key: string]: JsonValue }
export type JsonArray = JsonValue[]
export type JsonValue = JsonPrimitive | JsonObject | JsonArray

export type ParseResult =
  | { value: JsonValue; error: null }
  | { value: null; error: ParseError }

export function getIndentValue(opt: IndentOption): string | number {
  if (opt === 'tab') return '\t'
  return parseInt(opt, 10)
}

/** Recursively sort object keys so output is deterministic when requested. */
export function sortDeep(value: unknown): unknown {
  if (Array.isArray(value)) return value.map(sortDeep)
  if (value !== null && typeof value === 'object') {
    const sorted: Record<string, unknown> = {}
    for (const key of Object.keys(value as object).sort()) {
      sorted[key] = sortDeep((value as Record<string, unknown>)[key])
    }
    return sorted
  }
  return value
}

/**
 * Parse JSON, returning either the value or a structured error. When the
 * browser reports a character position (V8) or a line/column (Firefox), the
 * location is surfaced so the UI can point the user at the problem. The
 * message is the browser's own description of the syntax error; it is shown
 * only locally and never transmitted.
 */
export function parseWithError(input: string): ParseResult {
  const trimmed = input.trim()
  if (!trimmed) return { value: null, error: { message: 'Input is empty.' } }
  try {
    const value = JSON.parse(trimmed) as JsonValue
    return { value, error: null }
  } catch (e) {
    const raw = e instanceof Error ? e.message : String(e)
    // V8 / Chrome / Node: "... at position 12" (optionally "(line 2 column 3)")
    const posMatch = raw.match(/position\s+(\d+)/i)
    if (posMatch) {
      const pos = parseInt(posMatch[1], 10)
      const before = trimmed.slice(0, pos)
      const line = (before.match(/\n/g) ?? []).length + 1
      const col = pos - before.lastIndexOf('\n')
      return { value: null, error: { message: raw, line, col } }
    }
    // Firefox: "... at line 2 column 3 of the JSON data"
    const lineColMatch = raw.match(/line\s+(\d+)\s+column\s+(\d+)/i)
    if (lineColMatch) {
      return {
        value: null,
        error: {
          message: raw,
          line: parseInt(lineColMatch[1], 10),
          col: parseInt(lineColMatch[2], 10),
        },
      }
    }
    return { value: null, error: { message: raw } }
  }
}

export function formatJson(
  value: JsonValue,
  indent: IndentOption,
  sortKeys: boolean,
): string {
  const data = sortKeys ? (sortDeep(value) as JsonValue) : value
  return JSON.stringify(data, null, getIndentValue(indent))
}

export function minifyJson(value: JsonValue, sortKeys: boolean): string {
  const data = sortKeys ? (sortDeep(value) as JsonValue) : value
  return JSON.stringify(data)
}
