import type { HTMLAttributes, ReactNode } from 'react'

export interface ContainerProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode
  className?: string
}

export function Container({ children, className = '', ...props }: ContainerProps) {
  return (
    <div className={`mx-auto max-w-7xl px-gutter-compact sm:px-gutter ${className}`} {...props}>
      {children}
    </div>
  )
}
