import type { ReactNode } from 'react'

interface ContainerProps {
  children: ReactNode
  className?: string
}

/** Centered, max-width page gutter shared by every section. */
export function Container({ children, className = '' }: ContainerProps) {
  return (
    <div className={`mx-auto w-full max-w-6xl px-4 sm:px-6 lg:px-8 xl:max-w-7xl 2xl:max-w-screen-2xl 2xl:px-12 3xl:max-w-[2000px] 3xl:px-16 ${className}`}>
      {children}
    </div>
  )
}
