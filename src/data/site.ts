/**
 * Global site configuration. Kept in one place so brand copy, URLs, and
 * metadata defaults stay consistent across the header, footer, and SEO tags.
 */
export const site = {
  name: 'Bench4Tools',
  tagline: 'Fast, private developer utilities',
  description:
    'Free, fast, privacy-focused online developer tools. Format JSON, decode JWTs, and encode Base64 — all processed locally in your browser.',
  // Production origin — used to build absolute canonical URLs and structured data.
  // Update this when the final domain is registered.
  url: 'https://bench4tools.com',
  author: 'Blue Acara Project',
  // Short list of the product principles, surfaced on the landing page.
  principles: [
    {
      title: 'Private by design',
      body: 'Tools process your data locally in the browser whenever possible. Nothing is uploaded to a server.',
    },
    {
      title: 'Fast and lightweight',
      body: 'No sign-up, no clutter, no waiting. Open a tool and get your result instantly.',
    },
    {
      title: 'Simple and focused',
      body: 'Each tool does one job well, with a clean interface and clear instructions.',
    },
    {
      title: 'Accessible everywhere',
      body: 'Keyboard-friendly, responsive layouts that work on desktop, tablet, and mobile.',
    },
  ],
} as const
