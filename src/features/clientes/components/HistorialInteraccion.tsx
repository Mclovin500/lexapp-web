import { generatePath, Link } from 'react-router-dom'
import { ROUTES } from '@/app/routes'
import { Icon } from '@/components/ui/Icon'
import { formatearFechaHora } from '@/lib/fechas'
import { detalleClienteContent } from '../content/detalle-cliente.content'
import type { InteraccionCliente } from '../types/clientes.types'

/** Destino de cada interacción: Solicitud → C2 · Propuesta → D2 · Expediente → E2 · Documento → E3 · Pago → D5. */
function rutaDe({ tipo, referenciaId }: InteraccionCliente): string | null {
  if (!referenciaId) return null
  switch (tipo) {
    case 'solicitud':
      return generatePath(ROUTES.requestDetail, { solicitudId: referenciaId })
    case 'propuesta':
      return ROUTES.proposals
    case 'expediente':
      return generatePath(ROUTES.caseDetail, { expedienteId: referenciaId })
    case 'documento':
      return generatePath(ROUTES.caseDocuments, { expedienteId: referenciaId })
    case 'pago':
      return generatePath(ROUTES.paymentDetail, { movimientoId: referenciaId })
  }
}

export function HistorialInteraccion({ interacciones }: { interacciones: InteraccionCliente[] }) {
  const { history } = detalleClienteContent
  if (interacciones.length === 0) return <p className="text-body-md text-secondary">{history.empty}</p>

  return (
    <ol className="flex flex-col">
      {interacciones.map((interaccion, indice) => {
        const ruta = rutaDe(interaccion)
        return (
          <li key={interaccion.id} className="relative flex gap-4 pb-5 last:pb-0">
            {indice < interacciones.length - 1 && <span className="absolute left-4 top-9 bottom-0 w-px bg-surface-container-high" aria-hidden="true" />}
            <span className="shrink-0 w-8 h-8 rounded-full bg-surface-container flex items-center justify-center text-primary" aria-hidden="true">
              <Icon name={history.icons[interaccion.tipo]} size={16} />
            </span>
            <div className="min-w-0 pt-1">
              {ruta ? (
                <Link to={ruta} className="text-body-md text-on-surface hover:text-primary hover:underline rounded focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary">
                  {interaccion.descripcion}
                </Link>
              ) : (
                <p className="text-body-md text-on-surface">{interaccion.descripcion}</p>
              )}
              <p className="text-body-sm text-secondary">
                <time dateTime={interaccion.fecha}>{formatearFechaHora(interaccion.fecha)}</time>
              </p>
            </div>
          </li>
        )
      })}
    </ol>
  )
}
