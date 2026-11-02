import type { HTMLAttributes } from 'react'

export interface IconProps extends HTMLAttributes<HTMLSpanElement> {
  name: string
  size?: number | string
  className?: string
  filled?: boolean
}

export function Icon({
  name,
  size = 24,
  className = '',
  filled = false,
  'aria-hidden': ariaHidden = true,
  ...props
}: IconProps) {
  const pixelSize = typeof size === 'number' ? `${size}px` : size

  return (
    <span
      className={`material-symbols-outlined select-none leading-none ${className}`}
      style={{
        fontSize: pixelSize,
        fontVariationSettings: filled ? "'FILL' 1" : "'FILL' 0",
      }}
      aria-hidden={ariaHidden}
      {...props}
    >
      {name}
    </span>
  )
}
