# Bench4Tools — Tool Page & SEO Content Specification

This document defines the reusable structure and content requirements for every
tool page, and the content outline for the three initial tools. It is the
specification that `src/data/tools.ts` implements: each tool is one typed entry
in that registry, and the shared `ToolPageLayout` + `Seo` components render it.
Adding a new tool means adding one registry entry (which TypeScript forces to be
complete) plus one route — the structure and SEO wiring come for free.

---

## 1. Reusable tool-page structure

Every tool page renders these sections, in this order
(`src/components/ToolPageLayout.tsx`):

| Order | Section | Source field(s) | Notes |
|------|---------|-----------------|-------|
| — | Breadcrumb | `name` | Home / Tool |
| A | Heading + intro + use cases | `heading`, `intro`, `useCases` | One `<h1>`; purpose understood immediately |
| B | Interactive tool area | `children` | Labeled `<section>`; accepts any tool UI (formatter, decoder, converter, generator, comparison) |
| C | Privacy & trust statement | `privacyNote`, `localProcessing`, `status` | Tense adapts to status; no unverified "runs locally" claim |
| D | Educational content | `about.heading`, `about.paragraphs` | What it is, why it's used, use cases, limitations |
| E | Usage instructions | `howToUse` | Ordered steps |
| F | Examples | `examples[]` | Input/output + optional `note`; responsive two-column |
| G | FAQ | `faqs[]` | Native `<details>`; mirrored in FAQPage JSON-LD |
| H | Related tools | `related[]` | Internal links to sibling tools |

The interactive tool area sits directly below the heading so it is never buried
beneath explanatory content. Everything from D onward is the SEO/educational body.

## 2. Reusable SEO checklist (per page)

Enforced by the `Tool` type and the `Seo` component:

- [x] Unique `<title>` identifying the tool and purpose — `seoTitle` (brand suffix auto-appended)
- [x] Unique meta description — `seoDescription`
- [x] Canonical URL — derived from `path`
- [x] Social metadata — Open Graph + Twitter card (`Seo`)
- [x] One clear `<h1>` — `heading`
- [x] Meaningful section headings — `<h2>` per section
- [x] Original educational content — `about`
- [x] Practical examples — `examples`
- [x] Relevant FAQs — `faqs`
- [x] Structured data — `FAQPage` + `BreadcrumbList` always; `SoftwareApplication` only once `status: 'available'`
- [x] Relevant internal links — `related`

**Rules.** Structured data must mirror visible content: FAQ JSON-LD is generated
from the same `faqs` shown on the page. No fictional ratings, reviews, or
features. Do not pad pages with generic repetitive copy. Keep each title and
description unique per tool.

## 3. Internal linking rules

Add a relationship only when it genuinely helps the user. Current graph:

- JSON Formatter ↔ Base64 Encoder / Decoder
- JSON Formatter ↔ JWT Decoder
- JWT Decoder ↔ Base64 Encoder / Decoder

The footer directory links to **all** published tools; each tool page links to
its relevant siblings via `related`. References are by `slug`, so links stay
valid and the graph extends naturally as tools are added.

---

## 4. Initial tool content outlines

### JSON Formatter / Validator / Viewer — `/json-formatter`

- **Search intent:** format / validate / view messy or minified JSON.
- **Primary topic:** JSON formatting. **Supporting:** validation & syntax errors, minification, tree/viewer navigation, readability.
- **Title:** JSON Formatter, Validator & Viewer
- **Meta description:** Format, validate, and view JSON online. Pretty-print messy JSON, catch syntax errors, minify, and explore nested data in a tree view — in your browser.
- **Educational sections:** what a JSON formatter is; format vs. minify; the role of a tree viewer; privacy of local processing.
- **Example scenarios:** pretty-print a minified object.
- **FAQ topics:** uploads/privacy; what "invalid JSON" means; format vs. minify; the tree view; large files.
- **Related:** JWT Decoder, Base64 Encoder / Decoder.

### JWT Decoder — `/jwt-decoder`

- **Search intent:** decode and inspect a JWT's contents.
- **Primary topic:** JWT decoding. **Supporting:** JWT structure (header/payload/signature), standard claims, expiration (`exp`), decode vs. verify.
- **Title:** JWT Decoder
- **Meta description:** Decode JSON Web Tokens (JWT) online. Inspect the header, payload, claims, and expiry of any token — decoded in your browser, never uploaded.
- **Educational sections:** what a JWT is; its three parts; standard claims & expiration; decoding ≠ verifying.
- **Example scenarios:** decode the header segment.
- **FAQ topics:** does it verify the signature; how to read expiration; is it safe to paste a real token; why the payload is readable without a secret.
- **Related:** Base64 Encoder / Decoder, JSON Formatter.

### Base64 Encoder / Decoder — `/base64-encode-decode`

- **Search intent:** encode or decode Base64 text/data.
- **Primary topic:** Base64 encoding/decoding. **Supporting:** text vs. file (data URIs) use cases, URL-safe variant, common errors (padding/alphabet), encoding vs. encryption.
- **Title:** Base64 Encoder & Decoder
- **Meta description:** Encode and decode Base64 online. Convert text and files to and from Base64, including URL-safe variants — all processed in your browser.
- **Educational sections:** what Base64 is; text vs. file encoding; URL-safe variant & errors; encoding is not encryption.
- **Example scenarios:** encode text to Base64 (with padding note).
- **FAQ topics:** is it encryption; what URL-safe Base64 is; why decoding fails; uploads/privacy.
- **Related:** JSON Formatter, JWT Decoder.

---

## 5. Status & honesty policy

While a tool's `status` is `in-development`:

- The page shows an "In development" badge and a clearly non-interactive
  placeholder in the tool area — nothing is presented as a working tool.
- Privacy copy is worded as **design intent** ("designed to run in your
  browser… once it ships"), never as a verified present-tense guarantee.
- `SoftwareApplication` structured data is **withheld** until the tool is live,
  so search engines are not told about functionality the page does not provide.

When a tool ships, flip `status` to `'available'`, replace the placeholder with
the real interface, and move the privacy copy to present tense.
