import type { ReactNode } from 'react'
import { generatePath, Link, useLocation, useParams } from 'react-router-dom'
import { ROUTES } from '@/app/routes'
import { MENSAJES_ERROR_API } from '@/api/errores'
import { EstadoCarga } from '@/components/ui/EstadoCarga'
import { EstadoError } from '@/components/ui/EstadoError'
import { Icon } from '@/components/ui/Icon'
import { formatearFechaCorta, formatearFechaHora } from '@/lib/fechas'
import { formatearMonto } from '@/lib/moneda'
import { EtiquetaEstadoMovimiento } from '../components/EtiquetaEstadoMovimiento'
import { HistorialMovimiento } from '../components/HistorialMovimiento'
import { movimientoContent } from '../content/movimiento.content'
import { useMovimiento } from '../hooks/usePagos'
import type { EstadoCobroEnviado } from '../types/pagos.types'

function esCobroEnviado(valor: unknown): valor is EstadoCobroEnviado {
  return typeof valor === 'object' && valor !== null && (valor as Record<string, unknown>).cobroEnviado === true
}

const enlace =
  'inline-flex items-center gap-1 text-label-md text-primary font-semibold hover:underline rounded focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary'

function Dato({ etiqueta, children }: { etiqueta: string; children: ReactNode }) {
  return (
    <div className="flex flex-col gap-1 min-w-0">
      <dt className="text-label-sm uppercase tracking-wider text-secondary">{etiqueta}</dt>
      <dd className="text-body-md text-on-surface break-words">{children}</dd>
    </div>
  )
}

/** D5: detalle de solo lectura de un pago o cobro, con su historial de estados. */
export function DetalleMovimientoPage() {
  const { movimientoId = '' } = useParams()
  const { state } = useLocation()
  const contenido = movimientoContent
  const { info } = contenido
  const movimiento = useMovimiento(movimientoId)
  const m = movimiento.data

  return (
    <div className="flex flex-col gap-6">
      <Link
        to={ROUTES.fees}
        className="inline-flex items-center gap-1.5 self-start text-label-md text-secondary hover:text-on-surface rounded focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
      >
        <Icon name="arrow_back" size={18} />
        {contenido.back}
      </Link>

      {esCobroEnviado(state) && (
        <p role="status" className="flex items-start gap-2 p-4 rounded-lg bg-primary-container/10 text-body-md text-primary">
          <Icon name="check_circle" size={20} className="shrink-0" />
          {contenido.sent}
        </p>
      )}

      {movimiento.isPending && <EstadoCarga texto={contenido.loading} />}
      {movimiento.isError && (
        <EstadoError
          mensaje={movimiento.error.tipo === 'no_encontrado' ? contenido.errors.no_encontrado : MENSAJES_ERROR_API[movimiento.error.tipo]}
          onReintentar={movimiento.error.tipo === 'no_encontrado' ? undefined : () => void movimiento.refetch()}
        />
      )}

      {m && (
        <>
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <p className="text-label-md text-secondary tabular-nums">{m.folio}</p>
              <h1 className="text-headline-lg text-on-surface tracking-tight">{m.concepto}</h1>
              <div className="mt-2">
                <EtiquetaEstadoMovimiento estado={m.estado} largo />
              </div>
            </div>
            <div className="md:text-right">
              <p className="text-label-md text-secondary">{contenido.amount}</p>
              <p className="text-headline-lg text-primary tabular-nums">{formatearMonto(m.importe)}</p>
            </div>
          </div>

          <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 items-start">
            <section aria-labelledby="info-movimiento" className="xl:col-span-7 p-6 rounded-xl bg-surface-container-lowest shadow-sm flex flex-col gap-5">
              <h2 id="info-movimiento" className="text-headline-sm text-on-surface">{info.title}</h2>
              <dl className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <Dato etiqueta={info.id}><span className="tabular-nums">{m.folio}</span></Dato>
                <Dato etiqueta={info.origin}>{contenido.origins[m.origen]}</Dato>
                <Dato etiqueta={info.client}>
                  <span className="block">{m.cliente.nombre}</span>
                  <Link to={generatePath(ROUTES.clientDetail, { clienteId: m.cliente.id })} className={enlace}>
                    {info.viewClient}
                    <Icon name="chevron_right" size={16} />
                  </Link>
                </Dato>
                <Dato etiqueta={info.case}>
                  {m.expediente ? (
                    <>
                      <span className="block">{m.expediente.folio}</span>
                      <Link to={generatePath(ROUTES.caseDetail, { expedienteId: m.expediente.id })} className={enlace}>
                        {info.viewCase}
                        <Icon name="chevron_right" size={16} />
                      </Link>
                    </>
                  ) : (
                    info.noCase
                  )}
                </Dato>
                <Dato etiqueta={info.createdAt}>{formatearFechaHora(m.fecha)}</Dato>
                <Dato etiqueta={info.dueDate}>{m.fechaLimite ? formatearFechaCorta(m.fechaLimite) : info.notAvailable}</Dato>
                <Dato etiqueta={info.paidAt}>{m.fechaPago ? formatearFechaHora(m.fechaPago) : info.notAvailable}</Dato>
                <Dato etiqueta={info.method}>{m.metodoPago ?? info.notAvailable}</Dato>
                <Dato etiqueta={info.reference}><span className="tabular-nums">{m.referenciaTransaccion ?? info.notAvailable}</span></Dato>
              </dl>
              {m.descripcion && (
                <dl>
                  <Dato etiqueta={info.description}><span className="whitespace-pre-line">{m.descripcion}</span></Dato>
                </dl>
              )}
              <p className="flex items-start gap-2 pt-4 border-t border-surface-container text-body-sm text-secondary">
                <Icon name="lock" size={18} className="shrink-0 mt-0.5" />
                {contenido.readOnly}
              </p>
            </section>

            <section aria-labelledby="historial-movimiento" className="xl:col-span-5 p-6 rounded-xl bg-surface-container-lowest shadow-sm flex flex-col gap-5">
              <h2 id="historial-movimiento" className="text-headline-sm text-on-surface">{contenido.history.title}</h2>
              <HistorialMovimiento historial={m.historial} />
            </section>
          </div>
        </>
      )}
    </div>
  )
}
