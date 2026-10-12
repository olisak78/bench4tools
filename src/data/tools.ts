/**
 * The tool catalog. This is the single source of truth that drives the
 * homepage directory, header/footer navigation, related-tool links, SEO
 * metadata, and the content of each tool page.
 *
 * Adding a new tool later means adding one entry here plus a route — the
 * shared layout and SEO wiring come for free.
 */

export type ToolIconId = 'json' | 'jwt' | 'base64'

export interface FaqItem {
  question: string
  answer: string
}

export interface ToolExample {
  label: string
  input: string
  output: string
}

export interface Tool {
  /** URL-safe identifier, also the last path segment. */
  slug: string
  /** Permanent route, e.g. "/tools/json-formatter". */
  path: string
  /** Short product name shown in nav, cards, and breadcrumbs. */
  name: string
  /** One-line summary for directory cards. */
  summary: string
  /** Icon key resolved by <ToolIcon />. */
  icon: ToolIconId
  /** Launch status. Phase 1 ships the shared experience, not the tool logic. */
  status: 'available' | 'in-development'

  /* ---- SEO ---- */
  /** <title> for this page (brand suffix is appended by <Seo />). */
  seoTitle: string
  /** <meta name="description"> for this page. */
  seoDescription: string
  keywords: string[]

  /* ---- Page content ---- */
  /** H1 for the tool page. */
  heading: string
  /** Short intro paragraph under the H1. */
  intro: string
  /** Whether this tool runs entirely in the browser (drives the privacy note). */
  localProcessing: boolean
  /** Tool-specific privacy statement. */
  privacyNote: string
  /** Educational "what is / why" section. */
  about: {
    heading: string
    paragraphs: string[]
  }
  /** Step-by-step usage instructions. */
  howToUse: string[]
  /** Worked examples. */
  examples: ToolExample[]
  faqs: FaqItem[]
  /** Slugs of related tools shown in the related-tools section. */
  related: string[]
}

export const tools: Tool[] = [
  {
    slug: 'json-formatter',
    path: '/tools/json-formatter',
    name: 'JSON Formatter',
    summary:
      'Format, validate, and inspect JSON with pretty-printing and clear error messages.',
    icon: 'json',
    status: 'in-development',
    seoTitle: 'JSON Formatter, Validator & Viewer',
    seoDescription:
      'Format, validate, and view JSON online. Pretty-print messy JSON, catch syntax errors, and explore nested data — processed privately in your browser.',
    keywords: [
      'json formatter',
      'json validator',
      'json viewer',
      'json beautifier',
      'format json online',
    ],
    heading: 'JSON Formatter, Validator & Viewer',
    intro:
      'Paste JSON to pretty-print it, validate its structure, and explore nested values. Everything runs locally in your browser.',
    localProcessing: true,
    privacyNote:
      'Your JSON never leaves your device. Formatting and validation happen entirely in your browser — nothing is uploaded or stored.',
    about: {
      heading: 'What is a JSON formatter?',
      paragraphs: [
        'JSON (JavaScript Object Notation) is the most common format for exchanging structured data between services, APIs, and configuration files. In its raw form it is often minified onto a single line, which makes it hard to read and debug.',
        'A JSON formatter re-indents that data into a consistent, human-readable structure, highlights where values are nested, and reports exactly where invalid syntax breaks parsing — so you can fix a malformed payload in seconds instead of hunting for a misplaced comma.',
        'Because JSON frequently contains API responses, tokens, or personal data, formatting it in a tool that keeps everything in your browser avoids sending sensitive content to a third-party server.',
      ],
    },
    howToUse: [
      'Paste or type your JSON into the input area.',
      'The tool validates the structure as you type and reports any syntax errors with their location.',
      'Choose an indentation style to pretty-print, or minify to collapse it onto a single line.',
      'Copy the formatted result, or expand and collapse nodes to explore large documents.',
    ],
    examples: [
      {
        label: 'Minified input',
        input: '{"name":"Ada","roles":["admin","dev"],"active":true}',
        output:
          '{\n  "name": "Ada",\n  "roles": [\n    "admin",\n    "dev"\n  ],\n  "active": true\n}',
      },
    ],
    faqs: [
      {
        question: 'Is my JSON uploaded to a server?',
        answer:
          'No. The formatter is designed to run entirely in your browser, so your data stays on your device.',
      },
      {
        question: 'What does "invalid JSON" mean?',
        answer:
          'It means the text cannot be parsed as JSON — usually a missing quote, trailing comma, or unbalanced bracket. The tool points to where parsing failed so you can correct it.',
      },
      {
        question: 'Can it handle large files?',
        answer:
          'Yes, within the limits of your browser. Very large documents may format more slowly because all processing happens locally.',
      },
    ],
    related: ['jwt-decoder', 'base64'],
  },
  {
    slug: 'jwt-decoder',
    path: '/tools/jwt-decoder',
    name: 'JWT Decoder',
    summary:
      'Decode and inspect the header and payload of a JSON Web Token without exposing it.',
    icon: 'jwt',
    status: 'in-development',
    seoTitle: 'JWT Decoder',
    seoDescription:
      'Decode JSON Web Tokens (JWT) online. Inspect the header, payload, and claims of any token — decoded locally in your browser, never uploaded.',
    keywords: [
      'jwt decoder',
      'decode jwt',
      'json web token',
      'jwt viewer',
      'jwt parser',
    ],
    heading: 'JWT Decoder',
    intro:
      'Paste a JSON Web Token to decode its header and payload and read its claims. Decoding happens locally in your browser.',
    localProcessing: true,
    privacyNote:
      'Tokens often grant access to real accounts. This decoder works entirely in your browser — your token is never sent to or logged by any server.',
    about: {
      heading: 'What is a JWT?',
      paragraphs: [
        'A JSON Web Token (JWT) is a compact, URL-safe way to represent claims between two parties. It is widely used for authentication and authorization: after you log in, a server issues a token that your client sends with each subsequent request.',
        'A JWT has three Base64URL-encoded parts separated by dots: a header describing the signing algorithm, a payload containing the claims (such as the user id and expiry), and a signature that lets the server verify the token has not been tampered with.',
        'Decoding a JWT reveals the header and payload so you can see exactly what claims it carries. Decoding is not the same as verifying — a decoder reads the contents but does not confirm the signature is valid.',
      ],
    },
    howToUse: [
      'Paste your JWT into the input field.',
      'The decoder splits the token and Base64URL-decodes the header and payload.',
      'Review the decoded claims, including standard fields like issuer, subject, and expiry.',
      'Use the output to debug authentication issues or confirm what a token contains.',
    ],
    examples: [
      {
        label: 'Encoded header segment',
        input: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9',
        output: '{\n  "alg": "HS256",\n  "typ": "JWT"\n}',
      },
    ],
    faqs: [
      {
        question: 'Does this verify the token signature?',
        answer:
          'No. This tool decodes the readable header and payload. Verifying a signature requires the signing secret or public key, which should stay on your server.',
      },
      {
        question: 'Is it safe to paste a real token here?',
        answer:
          'The decoder is designed to run entirely in your browser, so the token is not transmitted anywhere. Even so, treat production tokens with care and revoke any you expose.',
      },
      {
        question: 'Why can I read the payload without a secret?',
        answer:
          'JWT payloads are only Base64URL-encoded, not encrypted. Anyone can decode them — which is why sensitive secrets should never be stored in a token.',
      },
    ],
    related: ['base64', 'json-formatter'],
  },
  {
    slug: 'base64',
    path: '/tools/base64',
    name: 'Base64 Encoder / Decoder',
    summary:
      'Convert text and data to and from Base64, with support for URL-safe output.',
    icon: 'base64',
    status: 'in-development',
    seoTitle: 'Base64 Encoder & Decoder',
    seoDescription:
      'Encode and decode Base64 online. Convert text and data to and from Base64, including URL-safe variants — all processed locally in your browser.',
    keywords: [
      'base64 encode',
      'base64 decode',
      'base64 encoder',
      'base64 decoder',
      'base64 converter',
    ],
    heading: 'Base64 Encoder & Decoder',
    intro:
      'Convert text to Base64 and back again. Encoding and decoding run locally in your browser — nothing is uploaded.',
    localProcessing: true,
    privacyNote:
      'All encoding and decoding happens in your browser. Your input — which may include credentials or binary data — is never sent to a server.',
    about: {
      heading: 'What is Base64?',
      paragraphs: [
        'Base64 is an encoding scheme that represents binary data using a set of 64 printable ASCII characters. It is used wherever binary content needs to travel through systems that only reliably handle text — email attachments, data URIs, HTTP headers, and tokens.',
        'Encoding to Base64 makes data larger (roughly a third bigger) but safe to embed in text-based formats. Decoding reverses the process to recover the original bytes.',
        'A URL-safe variant replaces the "+" and "/" characters with "-" and "_" so the result can be used in URLs and filenames without further escaping. Note that Base64 is encoding, not encryption — it provides no security on its own.',
      ],
    },
    howToUse: [
      'Choose whether you want to encode or decode.',
      'Paste or type your input into the field.',
      'Optionally switch to the URL-safe variant for use in links and filenames.',
      'Copy the converted output.',
    ],
    examples: [
      {
        label: 'Encoding text',
        input: 'Bench4Tools',
        output: 'QmVuY2g0VG9vbHM=',
      },
    ],
    faqs: [
      {
        question: 'Is Base64 a form of encryption?',
        answer:
          'No. Base64 is reversible encoding with no secret key, so it offers no confidentiality. Never rely on it to protect sensitive data.',
      },
      {
        question: 'What is URL-safe Base64?',
        answer:
          'A variant that swaps the "+" and "/" characters for "-" and "_" so the encoded string can be placed in URLs and filenames without escaping.',
      },
      {
        question: 'Does my data get uploaded?',
        answer:
          'No. The converter runs in your browser, so your input never leaves your device.',
      },
    ],
    related: ['json-formatter', 'jwt-decoder'],
  },
]

/** Look up a single tool by its slug. */
export function getTool(slug: string): Tool | undefined {
  return tools.find((tool) => tool.slug === slug)
}

/** Resolve a list of related tools from their slugs, preserving order. */
export function getRelatedTools(slugs: string[]): Tool[] {
  return slugs
    .map((slug) => getTool(slug))
    .filter((tool): tool is Tool => tool !== undefined)
}
