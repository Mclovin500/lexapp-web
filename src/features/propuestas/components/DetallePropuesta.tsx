import { generatePath, Link } from 'react-router-dom'
import { ROUTES } from '@/app/routes'
import { MENSAJES_ERROR_API } from '@/api/errores'
import { EstadoCarga } from '@/components/ui/EstadoCarga'
import { EstadoError } from '@/components/ui/EstadoError'
import { Icon } from '@/components/ui/Icon'
import { formatearFechaCorta, formatearFechaHora } from '@/lib/fechas'
import { formatearMonto } from '@/lib/moneda'
import { propuestasContent } from '../content/propuestas.content'
import { useDetallePropuesta } from '../hooks/usePropuestas'
import { EtiquetaEstadoPropuesta } from './EtiquetaEstadoPropuesta'

const enlace =
  'inline-flex h-9 px-3 items-center gap-1.5 rounded-lg bg-surface-container text-on-surface text-label-md font-semibold hover:bg-surface-container-high focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary'

/** "Ver propuesta" (D2): todos los datos y enlaces a solicitud, expediente y movimientos cuando existan. */
export function DetallePropuesta({ propuestaId }: { propuestaId: string }) {
  const { detail, actions } = propuestasContent
  const consulta = useDetallePropuesta(propuestaId)
  const p = consulta.data

  if (consulta.isPending) return <EstadoCarga texto={detail.loading} />
  if (consulta.isError) return <EstadoError mensaje={MENSAJES_ERROR_API[consulta.error.tipo]} onReintentar={() => void consulta.refetch()} />
  if (!p) return null

  const filas = [
    { etiqueta: detail.client, valor: p.cliente.organizacion ? `${p.cliente.nombre} · ${p.cliente.organizacion}` : p.cliente.nombre },
    { etiqueta: detail.request, valor: p.solicitud ? `${p.solicitud.folio} · ${p.solicitud.asunto}` : detail.noRequest },
    { etiqueta: detail.estimatedTime, valor: p.tiempoEstimado },
    { etiqueta: detail.validUntil, valor: formatearFechaCorta(p.fechaVigencia) },
    { etiqueta: detail.sentAt, valor: p.fechaEnvio ? formatearFechaHora(p.fechaEnvio) : detail.notSent },
  ]

  return (
    <div className="flex flex-col gap-5 max-h-[70vh] overflow-y-auto pr-1">
      <div className="flex flex-wrap items-center gap-3">
        <EtiquetaEstadoPropuesta estado={p.estado} />
        <p className="text-headline-sm text-on-surface">{p.servicio}</p>
      </div>

      {p.motivoRechazo && (
        <p className="p-3 rounded-lg bg-error-container/40 text-body-sm text-on-surface">
          <strong>{detail.rejectionReason}:</strong> {p.motivoRechazo}
        </p>
      )}

      <dl className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {filas.map((fila) => (
          <div key={fila.etiqueta} className="p-3 rounded-lg bg-surface-container-low">
            <dt className="text-[11px] uppercase tracking-wider text-secondary">{fila.etiqueta}</dt>
            <dd className="text-body-md text-on-surface">{fila.valor}</dd>
          </div>
        ))}
      </dl>

      <div className="p-4 rounded-lg bg-primary-container/10">
        <p className="text-label-sm uppercase tracking-wider text-primary">{detail.fees}</p>
        <p className="text-headline-md text-on-surface tabular-nums">{formatearMonto(p.importe)}</p>
        {p.conceptos.length > 0 && (
          <ul className="mt-2 space-y-1" aria-label={detail.concepts}>
            {p.conceptos.map((c, i) => (
              <li key={i} className="flex justify-between gap-3 text-body-sm text-on-surface-variant">
                <span>{c.concepto}</span>
                <span className="tabular-nums">{formatearMonto(c.importe)}</span>
              </li>
            ))}
          </ul>
        )}
      </div>

      {[
        { titulo: detail.description, texto: p.descripcion },
        { titulo: detail.scope, texto: p.alcance },
        { titulo: detail.conditions, texto: p.condiciones },
      ]
        .filter((bloque) => bloque.texto)
        .map((bloque) => (
          <div key={bloque.titulo}>
            <p className="text-label-md text-on-surface font-semibold">{bloque.titulo}</p>
            <p className="text-body-md text-on-surface-variant whitespace-pre-line">{bloque.texto}</p>
          </div>
        ))}

      <div className="flex flex-wrap gap-2 pt-1">
        {p.solicitud && (
          <Link to={generatePath(ROUTES.requestDetail, { solicitudId: p.solicitud.id })} className={enlace}>
            <Icon name="inbox" size={18} />
            {actions.viewRequest}
          </Link>
        )}
        {p.expedienteId && (
          <Link to={generatePath(ROUTES.caseDetail, { expedienteId: p.expedienteId })} className={enlace}>
            <Icon name="folder_open" size={18} />
            {actions.viewCase}
          </Link>
        )}
        {p.tieneMovimientos && (
          <Link to={`${ROUTES.fees}?propuesta=${encodeURIComponent(p.id)}`} className={enlace}>
            <Icon name="payments" size={18} />
            {actions.viewMovements}
          </Link>
        )}
      </div>
    </div>
  )
}
