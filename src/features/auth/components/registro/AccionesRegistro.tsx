import { Link } from 'react-router-dom'
import { Icon } from '@/components/ui/Icon'

interface AccionesRegistroProps {
  anterior: { to: string; label: string }
  textoSiguiente: string
  textoCargando: string
  iconoSiguiente?: string
  cargando: boolean
}

/** Botones "Anterior" y "Siguiente" del registro (A4 y A5). El siguiente es el submit del formulario. */
export function AccionesRegistro({
  anterior,
  textoSiguiente,
  textoCargando,
  iconoSiguiente = 'arrow_forward',
  cargando,
}: AccionesRegistroProps) {
  return (
    <div className="pt-3 grid grid-cols-1 sm:grid-cols-[auto_1fr] gap-3">
      <Link
        to={anterior.to}
        className="h-11 px-5 inline-flex items-center justify-center gap-2 rounded-lg bg-surface-container text-on-surface text-label-lg font-semibold hover:bg-surface-container-high transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
      >
        <Icon name="arrow_back" size={18} />
        {anterior.label}
      </Link>
      <button
        type="submit"
        disabled={cargando}
        className="h-11 bg-primary-container hover:bg-primary-hover text-on-primary-container hover:text-on-primary text-label-lg font-semibold rounded-lg shadow-md shadow-primary-container/20 flex items-center justify-center gap-2 transition-all active:scale-[0.99] cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
      >
        {cargando ? (
          <>
            <span className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
            <span>{textoCargando}</span>
          </>
        ) : (
          <>
            <span>{textoSiguiente}</span>
            <Icon name={iconoSiguiente} size={18} />
          </>
        )}
      </button>
    </div>
  )
}
