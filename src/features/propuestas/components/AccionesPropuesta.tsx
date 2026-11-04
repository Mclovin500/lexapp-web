import { generatePath, Link, useNavigate } from 'react-router-dom'
import { ROUTES } from '@/app/routes'
import { Icon } from '@/components/ui/Icon'
import { propuestasContent } from '../content/propuestas.content'
import { useCrearExpedienteDePropuesta } from '../hooks/usePropuestas'
import type { PropuestaResumen } from '../types/propuestas.types'

interface AccionesPropuestaProps {
  propuesta: PropuestaResumen
  onVer: () => void
  onCancelar: () => void
}

const boton =
  'inline-flex h-8 px-2.5 items-center gap-1 rounded-lg text-label-sm font-semibold transition-colors cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary'

/**
 * Acciones según el estado (Stitch D2): ver siempre; editar en borrador; cancelar en borrador,
 * enviada o pendiente; conversación cuando el cliente ya la recibió; aceptada → crear o ver expediente.
 */
export function AccionesPropuesta({ propuesta, onVer, onCancelar }: AccionesPropuestaProps) {
  const navigate = useNavigate()
  const { actions } = propuestasContent
  const crearExpediente = useCrearExpedienteDePropuesta()
  const { estado } = propuesta
  const cancelable = estado === 'borrador' || estado === 'enviada' || estado === 'pendiente_respuesta'
  const conConversacion = estado !== 'borrador' && estado !== 'cancelada'

  const abrirExpediente = () => {
    if (propuesta.expedienteId) {
      navigate(generatePath(ROUTES.caseDetail, { expedienteId: propuesta.expedienteId }))
      return
    }
    crearExpediente.mutate(propuesta.id, {
      onSuccess: ({ expedienteId }) => navigate(generatePath(ROUTES.caseDetail, { expedienteId })),
    })
  }

  return (
    <div className="flex flex-wrap justify-end gap-1.5">
      {estado === 'aceptada' && (
        <button type="button" onClick={abrirExpediente} disabled={crearExpediente.isPending} className={`${boton} bg-primary-container text-on-primary hover:bg-primary`}>
          <Icon name="folder_special" size={16} />
          {propuesta.expedienteId ? actions.viewCase : crearExpediente.isPending ? actions.creatingCase : actions.createCase}
        </button>
      )}
      {estado === 'borrador' && (
        <Link to={generatePath(ROUTES.editProposal, { propuestaId: propuesta.id })} className={`${boton} bg-surface-container text-on-surface hover:bg-surface-container-high`}>
          <Icon name="edit" size={16} />
          {actions.edit}
        </Link>
      )}
      <button type="button" onClick={onVer} className={`${boton} bg-surface-container text-on-surface hover:bg-surface-container-high`}>
        <Icon name="visibility" size={16} />
        {actions.view}
      </button>
      {conConversacion && (
        <Link to={ROUTES.chat} state={{ clienteId: propuesta.cliente.id }} aria-label={`${actions.conversation} con ${propuesta.cliente.nombre}`} className={`${boton} text-secondary hover:bg-surface-container`}>
          <Icon name="forum" size={16} />
          <span className="sr-only xl:not-sr-only">{actions.conversation}</span>
        </Link>
      )}
      {cancelable && (
        <button type="button" onClick={onCancelar} className={`${boton} text-error hover:bg-error-container/50`}>
          <Icon name="block" size={16} />
          {actions.cancel}
        </button>
      )}
    </div>
  )
}
