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

/** A single named term and its explanation, used for reference-style sections
 *  such as the JWT claims glossary. */
export interface Definition {
  term: string
  description: string
}

/** An additional educational content block rendered below the "about" section.
 *  Supports prose paragraphs, an optional definition list, or both — so a page
 *  can carry deeper conceptual content (e.g. "Formatting versus validation",
 *  "Understanding common claims") without bespoke per-tool components. */
export interface ContentSection {
  /** <h2> heading for the section. */
  heading: string
  /** Prose paragraphs. */
  paragraphs?: string[]
  /** Optional term/description reference list. */
  definitions?: Definition[]
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
  /** Optional deeper educational sections rendered after "about". */
  sections?: ContentSection[]
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
    status: 'available',
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
      'Your JSON is processed entirely in your browser. The data you paste is never uploaded, transmitted, or stored anywhere.',
    about: {
      heading: 'What is JSON?',
      paragraphs: [
        'JSON (JavaScript Object Notation) is the most widely used format for exchanging structured data between web services, APIs, and configuration files. It is plain text, language-independent, and easy for both people and machines to read, which is why almost every modern API speaks it.',
        'A JSON document is built from a small set of value types. Objects are unordered collections of key/value pairs wrapped in curly braces ({ }), and arrays are ordered lists wrapped in square brackets ([ ]). Values can be strings in double quotes, numbers, the booleans true and false, or null. Objects and arrays nest inside one another to any depth, which is how JSON represents everything from a single record to a deeply structured API response.',
        'JSON has a strict syntax, and that strictness is the point. Keys must be wrapped in double quotes, strings cannot use single quotes, and trailing commas are not allowed. A single misplaced comma or unbalanced bracket makes the whole document invalid, so a parser rejects it outright rather than guessing your intent. A formatter that validates as it parses — and points to the exact line and column where parsing failed — turns that frustrating hunt into a quick fix.',
      ],
    },
    sections: [
      {
        heading: 'Formatting versus validation',
        paragraphs: [
          'Formatting and validation answer two different questions. Formatting is about readability: it rewrites the same data with consistent indentation and line breaks, or strips that whitespace back out when you minify, without ever changing the underlying values. Validation is about correctness: it checks whether the text is well-formed JSON in the first place.',
          'The two work together here. Before the tool can pretty-print or minify anything, it has to parse your input, and parsing only succeeds when the JSON is valid. If it is not, you get a precise error instead of formatted output, which means a successful format is itself confirmation that your JSON is syntactically correct. Note that validation checks structure, not meaning: it confirms the document is valid JSON, not that its field names or values are the ones your application expects.',
        ],
      },
    ],
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
        question: 'How do I format JSON online?',
        answer:
          'Paste your JSON into the input box and choose an indentation style — the tool pretty-prints it instantly and flags any syntax errors. Everything runs in your browser, so you can format JSON online without installing anything or sending your data to a server.',
      },
      {
        question: 'Is my JSON uploaded to a server?',
        answer:
          'No. The formatter runs entirely in your browser — your data stays on your device and is never transmitted anywhere.',
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
    status: 'available',
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
      'Tokens often grant access to real accounts. This decoder runs entirely in your browser — your token is never sent to or logged by any server.',
    about: {
      heading: 'What is a JWT?',
      paragraphs: [
        'A JSON Web Token (JWT) is a compact, URL-safe way to represent claims between two parties. It is widely used for authentication and authorization: after you log in, a server issues a token that your client sends with each subsequent request to prove who you are.',
        'A JWT has three Base64URL-encoded parts separated by dots: a header describing the signing algorithm and token type, a payload containing the claims, and a signature that lets the issuer detect whether the token has been altered. Only the signature depends on a secret or key — the header and payload are merely encoded, not encrypted.',
        'The payload is a JSON object whose properties are called claims. Some are "registered" claims defined by the JWT standard — short, predefined names such as iss, sub, and exp — while others are custom claims your application chooses to include, like a user role or display name. Because the payload is just encoded JSON, you can read every claim it carries without any secret.',
      ],
    },
    sections: [
      {
        heading: 'Understanding common claims',
        paragraphs: [
          'The payload usually contains a mix of standard registered claims and application-specific ones. These are the registered claims you will encounter most often:',
        ],
        definitions: [
          {
            term: 'iss',
            description:
              'Issuer — identifies who issued the token, typically your authorization server or application. Recipients use it to confirm the token came from a source they trust.',
          },
          {
            term: 'sub',
            description:
              'Subject — the principal the token is about, most often a user or service account ID. It is the "who" that the claims describe.',
          },
          {
            term: 'aud',
            description:
              'Audience — the recipient or recipients the token is intended for. An application is expected to reject a token whose audience does not include itself.',
          },
          {
            term: 'exp',
            description:
              'Expiration Time — a Unix timestamp (seconds since 1970) after which the token must no longer be accepted. This decoder shows the equivalent date and whether that time has already passed.',
          },
          {
            term: 'iat',
            description:
              'Issued At — a Unix timestamp recording when the token was created, useful for reasoning about a token’s age.',
          },
          {
            term: 'nbf',
            description:
              'Not Before — a Unix timestamp before which the token must not be accepted. A token with a future nbf only becomes valid once that time arrives.',
          },
        ],
      },
      {
        heading: 'Security and privacy',
        paragraphs: [
          'Decoding a JWT is not the same as verifying it. This tool Base64URL-decodes the header and payload so you can read their contents, but it does not check the signature — and an unverified token proves nothing. Anyone can craft a token with any claims they like, including a convincing-looking exp or sub, so a decoded payload should never be trusted on its own.',
          'Real verification means recomputing the signature with the issuer’s secret or public key, confirming it matches, and then checking claims such as exp, nbf, and aud. That has to happen on a server that holds the key, never in a public web page. Treat this decoder as a debugging aid, not a security check.',
          'Because tokens often grant access to live accounts, the decoder runs entirely in your browser. Your token is parsed locally with JavaScript and is never sent to, logged by, or stored on any server. Even so, any token you paste anywhere is a credential — prefer short-lived or test tokens, and revoke any production token you suspect has been exposed.',
        ],
      },
    ],
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
        note: 'The header is just Base64URL-encoded JSON describing how the token was signed. This value is illustrative, not a real credential.',
      },
      {
        label: 'Read the payload claims',
        input: 'eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkFkYSBMb3ZlbGFjZSIsImlhdCI6MTcwNDA2NzIwMH0',
        output: '{\n  "sub": "1234567890",\n  "name": "Ada Lovelace",\n  "iat": 1704067200\n}',
        note: 'The payload is Base64URL-encoded JSON. Here it carries a subject, a name, and an issued-at timestamp — all readable without any key, which is exactly why secrets must never be placed in a token. This is sample data for illustration only.',
      },
    ],
    faqs: [
      {
        question: 'What are the three parts of a JWT?',
        answer:
          'A JWT has three dot-separated parts: the header (the signing algorithm and token type), the payload (the claims), and the signature (which the issuer uses to detect tampering). The header and payload are Base64URL-encoded JSON that anyone can decode; only the signature depends on a secret.',
      },
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
          'The decoder runs entirely in your browser, so the token is not transmitted anywhere. Even so, treat production tokens with care and revoke any you expose.',
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
    status: 'available',
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
      'This converter runs entirely in your browser. Your input — which may include credentials or binary data — is never sent to a server.',
    about: {
      heading: 'What is Base64?',
      paragraphs: [
        'Base64 is an encoding scheme that represents binary data using a set of 64 printable ASCII characters. It is used wherever binary content needs to travel through systems that only reliably handle text — email attachments, data URIs, HTTP headers, and tokens.',
        'For text, encoding turns a string into a safe-to-transmit sequence of Base64 characters. For files, the same process lets you embed an image or small asset directly in HTML or CSS as a data URI, avoiding a separate network request. Encoding makes data roughly a third larger, and decoding reverses the process to recover the original bytes.',
        'A URL-safe variant replaces the "+" and "/" characters with "-" and "_" so the result can be used in URLs and filenames without further escaping, and usually drops the "=" padding. This decoder accepts both the standard and URL-safe alphabets automatically, and the encoder can produce either one.',
      ],
    },
    sections: [
      {
        heading: 'Limitations and safety',
        paragraphs: [
          'Base64 is encoding, not encryption. It uses no key and hides nothing — anyone can decode a Base64 string back to its original bytes in seconds. Encoding a password, token, or API key does not protect it; if you need confidentiality, use real encryption and reserve Base64 for safely transporting the already-protected data.',
          'Decoded Base64 is not always readable text. The original bytes might be an image, a PDF, or other binary data that only looks like noise when forced into a text box. When this tool detects that decoded bytes are not valid UTF-8 text, it offers them as a file download instead of printing garbled characters, so you always get the real data back intact.',
          'Everything runs in your browser, so the practical limit is your device’s memory rather than a server quota. To keep the interface responsive, file encoding is capped at 5 MB and larger files are rejected with a clear message rather than freezing the page. Text input has no fixed limit, though very large pastes naturally use more memory.',
        ],
      },
    ],
    howToUse: [
      'Choose Encode or Decode, and whether your input is text or a file.',
      'Paste or type text, or select a file (up to 5 MB) to encode.',
      'For text, switch on the URL-safe variant when the result needs to go in a URL or filename.',
      'Copy the output, or download the result when it is a file or binary data.',
    ],
    examples: [
      {
        label: 'Encode text to Base64',
        input: 'Bench4Tools',
        output: 'QmVuY2g0VG9vbHM=',
        note: 'The trailing "=" is padding that makes the output length a multiple of four.',
      },
      {
        label: 'Decode Base64 back to text',
        input: 'QmVuY2g0VG9vbHM=',
        output: 'Bench4Tools',
        note: 'Decoding reverses the encoding exactly, recovering the original text.',
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
          'A variant that swaps the "+" and "/" characters for "-" and "_" (and usually drops "=" padding) so the encoded string can be placed in URLs and filenames without escaping. Enable the URL-safe option when encoding; decoding accepts both variants automatically.',
      },
      {
        question: 'Does it handle Unicode and emoji?',
        answer:
          'Yes. Text is encoded as UTF-8 before conversion, so accented characters, non-Latin scripts, and emoji all round-trip correctly. Decoding returns the original text; if the bytes are not valid UTF-8, the tool treats them as binary and offers a download.',
      },
      {
        question: 'Can I encode or decode a file?',
        answer:
          'Yes. Switch the input to "File" to encode a file up to 5 MB into Base64, or paste a Base64 string and download the decoded result as a file. File processing happens entirely in your browser.',
      },
      {
        question: 'Why do I get an error when decoding?',
        answer:
          'Decoding fails when the input contains characters that are not valid Base64 or when the string is incomplete or corrupted. The decoder accepts both standard and URL-safe Base64 and ignores surrounding whitespace, so copy the whole string and remove anything that is not part of it.',
      },
      {
        question: 'Does my data get uploaded?',
        answer:
          'No. The converter runs in your browser — your input never leaves your device.',
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
