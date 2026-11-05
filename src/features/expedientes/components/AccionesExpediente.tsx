import { generatePath, Link } from 'react-router-dom'
import { ROUTES } from '@/app/routes'
import { Icon } from '@/components/ui/Icon'
import { detalleExpedienteContent } from '../content/detalle-expediente.content'
import type { ExpedienteDetalle } from '../types/expedientes.types'

interface AccionesExpedienteProps {
  expediente: ExpedienteDetalle
  onActualizar: () => void
  onCambiarEstado: () => void
}

const base =
  'w-full h-11 px-4 inline-flex items-center gap-3 rounded-lg text-label-md font-semibold transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary'
const secundario = `${base} bg-surface-container-low text-on-surface hover:bg-surface-container`
const deshabilitado = `${base} bg-surface-container-low text-outline cursor-not-allowed`

/**
 * "Acciones disponibles para el abogado" (E2). Navegación de la especificación:
 * Documentos → E3 · Chat → H1 · Reunión → G1 · Cobro adicional → D4.
 * Con el expediente finalizado solo se consulta o se cambia el estado (reabrir).
 */
export function AccionesExpediente({ expediente, onActualizar, onCambiarEstado }: AccionesExpedienteProps) {
  const { actions } = detalleExpedienteContent
  const finalizado = expediente.estado === 'finalizado'
  const estadoNavegacion = { clienteId: expediente.cliente.id, expedienteId: expediente.id }
  const rutaCobro = `${ROUTES.newCharge}?${new URLSearchParams({ cliente: expediente.cliente.id, expediente: expediente.id }).toString()}`

  return (
    <section aria-labelledby="expediente-acciones" className="p-6 rounded-xl bg-surface-container-lowest shadow-sm flex flex-col gap-3">
      <h2 id="expediente-acciones" className="text-headline-sm text-on-surface">
        {actions.title}
      </h2>
      <Link to={generatePath(ROUTES.caseDocuments, { expedienteId: expediente.id })} className={secundario}>
        <Icon name="folder_open" size={20} className="text-primary" />
        {actions.documents}
      </Link>
      <button type="button" onClick={onActualizar} disabled={finalizado} className={`${finalizado ? deshabilitado : `${secundario} cursor-pointer`}`}>
        <Icon name="edit_note" size={20} className={finalizado ? '' : 'text-primary'} />
        {actions.update}
      </button>
      {finalizado ? (
        <span className={deshabilitado} aria-disabled="true">
          <Icon name="request_quote" size={20} />
          {actions.charge}
        </span>
      ) : (
        <Link to={rutaCobro} className={secundario}>
          <Icon name="request_quote" size={20} className="text-primary" />
          {actions.charge}
        </Link>
      )}
      <Link to={ROUTES.chat} state={estadoNavegacion} className={secundario}>
        <Icon name="chat" size={20} className="text-primary" />
        {actions.chat}
      </Link>
      <Link to={ROUTES.agenda} state={estadoNavegacion} className={secundario}>
        <Icon name="event" size={20} className="text-primary" />
        {actions.meeting}
      </Link>
      <button type="button" onClick={onCambiarEstado} className={`${secundario} cursor-pointer`}>
        <Icon name="swap_horiz" size={20} className="text-primary" />
        {actions.status}
      </button>
    </section>
  )
}
