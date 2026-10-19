declare global {
  interface Window {
    umami?: {
      track: (event: string, props?: Record<string, string | number | boolean>) => void
    }
  }
}

export function track(event: string, props?: Record<string, string | number | boolean>): void {
  try {
    window.umami?.track(event, props)
  } catch {
    // Never throw from analytics
  }
}
