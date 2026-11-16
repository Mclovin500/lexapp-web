import { generatePath, Link } from 'react-router-dom'
import { ROUTES } from '@/app/routes'
import { Icon } from '@/components/ui/Icon'
import { propuestasContent } from '../content/propuestas.content'
import type { PropuestaResumen } from '../types/propuestas.types'

interface AccionesPropuestaProps {
  propuesta: PropuestaResumen
  onVer: () => void
}

const boton =
  'inline-flex h-8 px-2.5 items-center gap-1 rounded-lg text-label-sm font-semibold transition-colors cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary'

/**
 * Acciones de D2: ver siempre, conversación con el cliente y ver expediente cuando exista.
 * El backend crea el caso al aceptar el cliente y no permite editar ni cancelar propuestas.
 */
export function AccionesPropuesta({ propuesta, onVer }: AccionesPropuestaProps) {
  const { actions } = propuestasContent

  return (
    <div className="flex flex-wrap justify-end gap-1.5">
      {propuesta.expedienteId && (
        <Link
          to={generatePath(ROUTES.caseDetail, { expedienteId: propuesta.expedienteId })}
          className={`${boton} bg-primary-container text-on-primary-container hover:text-on-primary hover:bg-primary-hover`}
        >
          <Icon name="folder_special" size={16} />
          {actions.viewCase}
        </Link>
      )}
      <button type="button" onClick={onVer} className={`${boton} bg-surface-container text-on-surface hover:bg-surface-container-high`}>
        <Icon name="visibility" size={16} />
        {actions.view}
      </button>
      <Link
        to={ROUTES.chat}
        state={{ clienteId: propuesta.cliente.id }}
        aria-label={`${actions.conversation} con ${propuesta.cliente.nombre}`}
        className={`${boton} text-secondary hover:bg-surface-container`}
      >
        <Icon name="forum" size={16} />
        <span className="sr-only xl:not-sr-only">{actions.conversation}</span>
      </Link>
    </div>
  )
}
