/**
 * The tool catalog. This is the single source of truth that drives the
 * homepage directory, header/footer navigation, related-tool links, SEO
 * metadata, and the content of each tool page.
 *
 * Adding a new tool later means adding one entry here plus a route — the
 * shared layout and SEO wiring come for free. TypeScript enforces that every
 * SEO field (title, description, keywords, heading, intro, educational
 * content, examples, FAQs, related links) is supplied, so no page ships
 * missing an important SEO element.
 *
 * See docs/seo-content-spec.md for the content specification these entries
 * implement.
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
  /** Optional note explaining what the example demonstrates. */
  note?: string
}

export interface Tool {
  /** URL-safe identifier used for lookups and related-tool references. */
  slug: string
  /** Permanent public route, e.g. "/json-formatter". */
  path: string
  /** Short product name shown in nav, cards, and breadcrumbs. */
  name: string
  /** One-line summary for directory cards. */
  summary: string
  /** Icon key resolved by <ToolIcon />. */
  icon: ToolIconId
  /**
   * Launch status. While 'in-development' the page presents the shared
   * structure and content but clearly marks the tool as not yet functional,
   * and avoids present-tense claims about local processing.
   */
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
  /** Short description of the tool's primary use cases, shown under the intro. */
  useCases: string
  /** Whether this tool is designed to run entirely in the browser. */
  localProcessing: boolean
  /** Tool-specific privacy statement (worded as design intent until shipped). */
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
    path: '/json-formatter',
    name: 'JSON Formatter',
    summary:
      'Format, validate, and inspect JSON with pretty-printing and clear error messages.',
    icon: 'json',
    status: 'in-development',
    seoTitle: 'JSON Formatter, Validator & Viewer',
    seoDescription:
      'Format, validate, and view JSON online. Pretty-print messy JSON, catch syntax errors, minify, and explore nested data in a tree view — in your browser.',
    keywords: [
      'json formatter',
      'json validator',
      'json viewer',
      'json beautifier',
      'json minify',
      'format json online',
    ],
    heading: 'JSON Formatter, Validator & Viewer',
    intro:
      'Pretty-print messy JSON, validate its structure, minify it for transport, and explore nested values in a tree view.',
    useCases:
      'Useful for debugging API responses, cleaning up configuration files, and making minified JSON readable before you work with it.',
    localProcessing: true,
    privacyNote:
      'This formatter is designed to process your JSON entirely in your browser. Once it ships, the data you paste will not be uploaded or stored anywhere.',
    about: {
      heading: 'What is a JSON formatter?',
      paragraphs: [
        'JSON (JavaScript Object Notation) is the most common format for exchanging structured data between services, APIs, and configuration files. In its raw form it is often minified onto a single line, which makes it hard to read and debug.',
        'A JSON formatter re-indents that data into a consistent, human-readable structure, highlights where values are nested, and reports exactly where invalid syntax breaks parsing — so you can fix a malformed payload in seconds instead of hunting for a misplaced comma.',
        'Formatting and minifying are two directions of the same idea: pretty-printing adds whitespace and indentation for people to read, while minifying strips it back out to send the smallest possible payload over the wire. A tree viewer complements both by letting you collapse and expand nested objects and arrays, so you can navigate a large document without scrolling through thousands of lines.',
        'Because JSON frequently contains API responses, tokens, or personal data, working with it in a tool that keeps everything in your browser avoids sending sensitive content to a third-party server.',
      ],
    },
    howToUse: [
      'Paste or type your JSON into the input area.',
      'The tool validates the structure and reports any syntax errors with their location.',
      'Choose an indentation style to pretty-print, or minify to collapse it onto a single line.',
      'Copy the result, or use the tree view to expand and collapse nodes in large documents.',
    ],
    examples: [
      {
        label: 'Pretty-print a minified object',
        input: '{"name":"Ada","roles":["admin","dev"],"active":true}',
        output:
          '{\n  "name": "Ada",\n  "roles": [\n    "admin",\n    "dev"\n  ],\n  "active": true\n}',
        note: 'Indentation reveals the structure, making nested arrays and objects easy to scan.',
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
          'It means the text cannot be parsed as JSON — usually a missing quote, a trailing comma, or an unbalanced bracket. The tool points to where parsing failed so you can correct it.',
      },
      {
        question: 'What is the difference between formatting and minifying?',
        answer:
          'Formatting (pretty-printing) adds indentation and line breaks to make JSON readable. Minifying removes that whitespace to produce the smallest valid payload, which is useful for sending data over a network.',
      },
      {
        question: 'What is the tree view for?',
        answer:
          'The tree view lets you collapse and expand nested objects and arrays so you can explore the shape of a large document without reading it line by line.',
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
    path: '/jwt-decoder',
    name: 'JWT Decoder',
    summary:
      'Decode and inspect the header and payload of a JSON Web Token without exposing it.',
    icon: 'jwt',
    status: 'in-development',
    seoTitle: 'JWT Decoder',
    seoDescription:
      'Decode JSON Web Tokens (JWT) online. Inspect the header, payload, claims, and expiry of any token — decoded in your browser, never uploaded.',
    keywords: [
      'jwt decoder',
      'decode jwt',
      'json web token',
      'jwt viewer',
      'jwt parser',
    ],
    heading: 'JWT Decoder',
    intro:
      'Paste a JSON Web Token to decode its header and payload and read its claims, including when it expires.',
    useCases:
      'Useful for debugging authentication flows, checking what claims a token carries, and confirming whether a token has expired.',
    localProcessing: true,
    privacyNote:
      'Tokens often grant access to real accounts, so this decoder is designed to work entirely in your browser. Once it ships, your token will not be sent to or logged by any server.',
    about: {
      heading: 'What is a JWT?',
      paragraphs: [
        'A JSON Web Token (JWT) is a compact, URL-safe way to represent claims between two parties. It is widely used for authentication and authorization: after you log in, a server issues a token that your client sends with each subsequent request.',
        'A JWT has three Base64URL-encoded parts separated by dots: a header describing the signing algorithm, a payload containing the claims (such as the subject and expiry), and a signature that lets the server verify the token has not been tampered with.',
        'The payload carries standard claims like "iss" (issuer), "sub" (subject), "iat" (issued at), and "exp" (expiration). The "exp" claim is a Unix timestamp — the number of seconds since 1970 — after which the token should no longer be accepted.',
        'Decoding a JWT reveals the header and payload so you can see exactly what claims it carries. Decoding is not the same as verifying: a decoder reads the contents, but it does not confirm the signature is valid, which is what actually proves the token is authentic.',
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
        label: 'Decode the header segment',
        input: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9',
        output: '{\n  "alg": "HS256",\n  "typ": "JWT"\n}',
        note: 'The header is just Base64URL-encoded JSON describing how the token was signed.',
      },
    ],
    faqs: [
      {
        question: 'Does this verify the token signature?',
        answer:
          'No. This tool decodes the readable header and payload. Verifying a signature requires the signing secret or public key, which should stay on your server.',
      },
      {
        question: 'How do I tell when a token expires?',
        answer:
          'Look at the "exp" claim in the payload. It is a Unix timestamp (seconds since 1970); if that time is in the past, the token has expired and should be rejected.',
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
    path: '/base64-encode-decode',
    name: 'Base64 Encoder / Decoder',
    summary:
      'Convert text and data to and from Base64, with support for URL-safe output.',
    icon: 'base64',
    status: 'in-development',
    seoTitle: 'Base64 Encoder & Decoder',
    seoDescription:
      'Encode and decode Base64 online. Convert text and files to and from Base64, including URL-safe variants — all processed in your browser.',
    keywords: [
      'base64 encode',
      'base64 decode',
      'base64 encoder',
      'base64 decoder',
      'base64 converter',
    ],
    heading: 'Base64 Encoder & Decoder',
    intro:
      'Convert text to Base64 and back again, with an optional URL-safe variant for links and filenames.',
    useCases:
      'Useful for embedding images as data URIs, inspecting encoded values in tokens and headers, and moving binary data through text-only systems.',
    localProcessing: true,
    privacyNote:
      'This converter is designed to run entirely in your browser. Once it ships, your input — which may include credentials or binary data — will not be sent to a server.',
    about: {
      heading: 'What is Base64?',
      paragraphs: [
        'Base64 is an encoding scheme that represents binary data using a set of 64 printable ASCII characters. It is used wherever binary content needs to travel through systems that only reliably handle text — email attachments, data URIs, HTTP headers, and tokens.',
        'For text, encoding turns a string into a safe-to-transmit sequence of Base64 characters. For files, the same process lets you embed an image or small asset directly in HTML or CSS as a data URI, avoiding a separate network request. Encoding makes data roughly a third larger, and decoding reverses the process to recover the original bytes.',
        'A URL-safe variant replaces the "+" and "/" characters with "-" and "_" so the result can be used in URLs and filenames without further escaping. A common source of errors is mixing the two variants, or corrupting the "=" padding at the end of a string.',
        'Importantly, Base64 is encoding, not encryption. It has no secret key and anyone can reverse it, so it provides no confidentiality on its own.',
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
        label: 'Encode text to Base64',
        input: 'Bench4Tools',
        output: 'QmVuY2g0VG9vbHM=',
        note: 'The trailing "=" is padding that makes the output length a multiple of four.',
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
        question: 'Why do I get an error when decoding?',
        answer:
          'Decoding usually fails when the input contains characters outside the Base64 alphabet, has incorrect "=" padding, or mixes the standard and URL-safe variants. Check that you copied the whole string without extra spaces.',
      },
      {
        question: 'Does my data get uploaded?',
        answer:
          'No. The converter is designed to run in your browser, so your input never leaves your device.',
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
