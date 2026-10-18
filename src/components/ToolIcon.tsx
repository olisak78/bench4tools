import type { ToolIconId } from '../data/tools'

interface ToolIconProps {
  id: ToolIconId
  className?: string
}

/**
 * Hand-rolled line icons keyed by tool. Kept as inline SVG to avoid an icon
 * dependency; `currentColor` lets callers control color with text utilities.
 */
export function ToolIcon({ id, className = 'size-6' }: ToolIconProps) {
  const common = {
    className,
    viewBox: '0 0 24 24',
    fill: 'none',
    stroke: 'currentColor',
    strokeWidth: 1.75,
    strokeLinecap: 'round' as const,
    strokeLinejoin: 'round' as const,
    'aria-hidden': true,
  }

  switch (id) {
    case 'json':
      // Curly braces — the JSON structure.
      return (
        <svg {...common}>
          <path d="M8 4C6 4 6 6 6 8s0 3-2 4c2 1 2 2 2 4s0 4 2 4" />
          <path d="M16 4c2 0 2 2 2 4s0 3 2 4c-2 1-2 2-2 4s0 4-2 4" />
        </svg>
      )
    case 'jwt':
      // A key — tokens and authentication.
      return (
        <svg {...common}>
          <circle cx="8" cy="8" r="4" />
          <path d="M11 11l8 8" />
          <path d="M16 16l2-2" />
          <path d="M19 19l2-2" />
        </svg>
      )
    case 'base64':
      // Two-way arrows — encode / decode conversion.
      return (
        <svg {...common}>
          <path d="M3 8h13M13 5l3 3-3 3" />
          <path d="M21 16H8M11 13l-3 3 3 3" />
        </svg>
      )
  }
}
