import { useTema } from '@/hooks/useTema'
import { Icon } from './Icon'

interface BotonTemaProps {
  className?: string
}

/** Botón luna / sol para alternar entre modo claro y nocturno. */
export function BotonTema({ className = '' }: BotonTemaProps) {
  const { esOscuro, alternarTema } = useTema()
  const etiqueta = esOscuro ? 'Activar modo claro' : 'Activar modo nocturno'

  return (
    <button
      type="button"
      onClick={alternarTema}
      aria-label={etiqueta}
      aria-pressed={esOscuro}
      title={etiqueta}
      className={`group relative flex h-10 w-10 shrink-0 items-center justify-center rounded-lg text-on-surface-variant transition-colors hover:bg-surface-container hover:text-on-surface focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary cursor-pointer ${className}`}
    >
      <Icon
        name={esOscuro ? 'light_mode' : 'dark_mode'}
        size={22}
        className={`transition-transform duration-300 motion-reduce:transition-none group-hover:rotate-12 ${
          esOscuro ? 'text-primary' : 'text-tertiary'
        }`}
      />
    </button>
  )
}
