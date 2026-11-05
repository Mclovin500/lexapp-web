import { useState, type ReactNode } from 'react'
import { generatePath, Link } from 'react-router-dom'
import { ROUTES } from '@/app/routes'
import { MENSAJES_ERROR_API } from '@/api/errores'
import { Dialogo } from '@/components/ui/Dialogo'
import { EstadoCarga } from '@/components/ui/EstadoCarga'
import { EstadoError } from '@/components/ui/EstadoError'
import { Icon } from '@/components/ui/Icon'
import { CampoAreaTexto } from '@/features/auth/components/compartidos/CampoAreaTexto'
import { MensajeCampo } from '@/features/auth/components/CampoTexto'
import { useAhora } from '@/hooks/useAhora'
import { formatearFechaHora, formatearFechaLarga, formatearHora } from '@/lib/fechas'
import { agendaContent, estadosReunion } from '../content/agenda.content'
import { useCancelarReunion, useDetalleReunion } from '../hooks/useAgenda'
import { formatearDuracion } from '../lib/calendario'
import { EtiquetaEstadoReunion } from './EtiquetaEstadoReunion'

interface DialogoDetalleReunionProps {
  reunionId: string | null
  onCerrar: () => void
  onCancelada: () => void
}

const enlace = 'inline-flex items-center gap-1 text-label-md text-primary font-semibold hover:underline'

/** "Consultar reunión" (G1): día, hora, cliente, expediente, estado; unirse (G1A) o cancelar. */
export function DialogoDetalleReunion({ reunionId, onCerrar, onCancelada }: DialogoDetalleReunionProps) {
  return (
    <Dialogo abierto={reunionId !== null} onCerrar={onCerrar} titulo={agendaContent.detail.title} ancho="lg">
      {reunionId && <Contenido reunionId={reunionId} onCancelada={onCancelada} />}
    </Dialogo>
  )
}

function Fila({ etiqueta, children }: { etiqueta: string; children: ReactNode }) {
  return (
    <div className="flex flex-col gap-0.5 min-w-0">
      <dt className="text-label-sm uppercase tracking-wider text-secondary">{etiqueta}</dt>
      <dd className="text-body-md text-on-surface break-words">{children}</dd>
    </div>
  )
}

function Contenido({ reunionId, onCancelada }: { reunionId: string; onCancelada: () => void }) {
  const { detail, virtualNote, errors } = agendaContent
  const detalle = useDetalleReunion(reunionId)
  const cancelar = useCancelarReunion()
  const [cancelando, setCancelando] = useState(false)
  const [motivo, setMotivo] = useState('')
  const [errorMotivo, setErrorMotivo] = useState<string | null>(null)
  const ahora = useAhora()
  const r = detalle.data

  if (detalle.isPending) return <EstadoCarga texto={detail.loading} />
  if (detalle.isError) {
    const tipo = detalle.error.tipo
    return <EstadoError mensaje={tipo === 'sin_permiso' || tipo === 'no_encontrado' ? errors[tipo] : MENSAJES_ERROR_API[tipo]} />
  }
  if (!r) return null

  const abierta = r.estado === 'programada' || r.estado === 'en_curso'
  const salaAbierta = abierta && ahora >= Date.parse(r.sala.abreEn) && ahora <= Date.parse(r.sala.cierraEn)

  const confirmarCancelacion = () => {
    if (motivo.trim().length < 10) {
      setErrorMotivo(detail.cancelRequired)
      return
    }
    cancelar.mutate({ id: r.id, motivo: motivo.trim() }, { onSuccess: onCancelada })
  }

  return (
    <div className="flex flex-col gap-5">
      <div className="flex flex-wrap items-center gap-3">
        <p className="text-headline-sm text-on-surface">{r.titulo}</p>
        <EtiquetaEstadoReunion estado={r.estado} />
      </div>
      <dl className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Fila etiqueta={detail.day}>
          <span className="capitalize">{formatearFechaLarga(new Date(r.inicio))}</span>
        </Fila>
        <Fila etiqueta={detail.time}>
          {formatearHora(r.inicio)} – {formatearHora(r.fin)}
        </Fila>
        <Fila etiqueta={detail.client}>
          <span className="block">{r.cliente.nombre}</span>
          {r.cliente.enDirectorio && (
            <Link to={generatePath(ROUTES.clientDetail, { clienteId: r.cliente.id })} className={enlace}>
              {detail.viewClient}
              <Icon name="chevron_right" size={16} />
            </Link>
          )}
        </Fila>
        <Fila etiqueta={detail.case}>
          {r.expediente ? (
            <>
              <span className="block">{r.expediente.folio}</span>
              <Link to={generatePath(ROUTES.caseDetail, { expedienteId: r.expediente.id })} className={enlace}>
                {detail.viewCase}
                <Icon name="chevron_right" size={16} />
              </Link>
            </>
          ) : (
            detail.noCase
          )}
        </Fila>
        <Fila etiqueta={detail.mode}>
          <span className="inline-flex items-center gap-1.5">
            <Icon name="videocam" size={18} className="text-primary" />
            {virtualNote}
          </span>
        </Fila>
        {r.duracionRealSegundos !== null && <Fila etiqueta={detail.duration}>{formatearDuracion(r.duracionRealSegundos)}</Fila>}
      </dl>
      {r.notas && (
        <dl>
          <Fila etiqueta={detail.notes}>{r.notas}</Fila>
        </dl>
      )}
      {r.resumen && (
        <dl>
          <Fila etiqueta={detail.summary}>{r.resumen}</Fila>
        </dl>
      )}
      {r.motivoCancelacion && (
        <dl>
          <Fila etiqueta={detail.cancelReason}>{r.motivoCancelacion}</Fila>
        </dl>
      )}

      <div>
        <h3 className="text-label-lg text-on-surface font-semibold mb-2">{detail.history}</h3>
        <ol className="flex flex-col gap-1.5">
          {r.historial.map((h) => (
            <li key={`${h.estado}-${h.fecha}`} className="text-body-sm text-secondary">
              <span className="text-on-surface font-medium">{estadosReunion[h.estado].label}</span> · {formatearFechaHora(h.fecha)}
              {h.nota && <span> · {h.nota}</span>}
            </li>
          ))}
        </ol>
      </div>

      {cancelando ? (
        <div className="flex flex-col gap-3 p-4 rounded-lg bg-surface-container-low">
          <CampoAreaTexto
            id="cancelar-reunion-motivo"
            label={detail.cancelReasonLabel}
            icon="event_busy"
            rows={2}
            maxLength={300}
            longitud={motivo.length}
            placeholder={detail.cancelPlaceholder}
            value={motivo}
            onChange={(evento) => {
              setMotivo(evento.target.value)
              setErrorMotivo(null)
            }}
          />
          {errorMotivo && <MensajeCampo id="cancelar-reunion-error" mensaje={errorMotivo} />}
          {cancelar.isError && (
            <EstadoError mensaje={cancelar.error.tipo === 'conflicto' ? errors.conflicto : MENSAJES_ERROR_API[cancelar.error.tipo]} />
          )}
          <div className="flex flex-col-reverse sm:flex-row sm:justify-end gap-2">
            <button
              type="button"
              onClick={() => setCancelando(false)}
              className="h-10 px-4 rounded-lg bg-surface-container text-on-surface text-label-md font-semibold hover:bg-surface-container-high cursor-pointer"
            >
              {detail.cancelBack}
            </button>
            <button
              type="button"
              disabled={cancelar.isPending}
              onClick={confirmarCancelacion}
              className="h-10 px-4 rounded-lg bg-error text-on-error text-label-md font-semibold hover:opacity-90 disabled:opacity-60 cursor-pointer"
            >
              {cancelar.isPending ? detail.canceling : detail.cancelConfirm}
            </button>
          </div>
        </div>
      ) : (
        abierta && (
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-end gap-2">
            {!salaAbierta && <p className="text-body-sm text-secondary sm:mr-auto">{detail.roomOpens(formatearHora(r.sala.abreEn))}</p>}
            {r.estado === 'programada' && (
              <button
                type="button"
                onClick={() => setCancelando(true)}
                className="h-11 px-4 rounded-lg text-error text-label-lg font-semibold hover:bg-error/10 cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
              >
                {detail.cancel}
              </button>
            )}
            {salaAbierta && (
              <Link
                to={generatePath(ROUTES.videoRoom, { reunionId: r.id })}
                className="h-11 px-5 inline-flex items-center justify-center gap-2 rounded-lg bg-primary-container hover:bg-primary text-on-primary text-label-lg font-semibold focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
              >
                <Icon name="videocam" size={20} />
                {detail.join}
              </Link>
            )}
          </div>
        )
      )}
    </div>
  )
}
