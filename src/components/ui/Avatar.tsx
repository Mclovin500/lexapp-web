import { iniciales } from '@/lib/iniciales'

interface AvatarProps {
  nombre: string
  /** Si hay foto se muestra en lugar de las iniciales. */
  foto?: string | null
  size?: 'sm' | 'md' | 'lg'
  className?: string
}

const tamanos = {
  sm: 'w-8 h-8 text-label-sm',
  md: 'w-10 h-10 text-label-md',
  lg: 'w-14 h-14 text-headline-sm',
} as const

/** Avatar con las iniciales del nombre (sin fotografía). */
export function Avatar({ nombre, foto = null, size = 'md', className = '' }: AvatarProps) {
  if (foto) {
    return <img src={foto} alt="" aria-hidden="true" className={`shrink-0 rounded-full object-cover ${tamanos[size]} ${className}`} />
  }
  return (
    <span
      aria-hidden="true"
      className={`inline-flex shrink-0 items-center justify-center rounded-full bg-primary-container/15 text-primary font-bold ${tamanos[size]} ${className}`}
    >
      {iniciales(nombre)}
    </span>
  )
}
