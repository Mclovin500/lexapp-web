import { useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { ROUTES } from '@/app/routes'
import { MENSAJES_ERROR_API } from '@/api/errores'
import { EstadoCarga } from '@/components/ui/EstadoCarga'
import { EstadoError } from '@/components/ui/EstadoError'
import { Icon } from '@/components/ui/Icon'
import { ListaCobros } from '@/features/dashboard/components/ListaCobros'
import { ListaReuniones } from '@/features/dashboard/components/ListaReuniones'
import { formatearFechaCorta, formatearRelativa } from '@/lib/fechas'
import { AccionesExpediente } from '../components/AccionesExpediente'
import { DialogoActualizacion } from '../components/DialogoActualizacion'
import { DialogoCambioEstado } from '../components/DialogoCambioEstado'
import { EtiquetaEstadoExpediente } from '../components/EtiquetaEstado'
import { HistorialExpediente } from '../components/HistorialExpediente'
import { ListaActualizaciones } from '../components/ListaActualizaciones'
import { ResumenDocumentos } from '../components/ResumenDocumentos'
import { SeccionExpediente } from '../components/SeccionExpediente'
import { TarjetaClienteExpediente } from '../components/TarjetaClienteExpediente'
import { detalleExpedienteContent } from '../content/detalle-expediente.content'
import { useDetalleExpediente } from '../hooks/useExpedientes'

type Dialogo = 'actualizacion' | 'estado' | null

const enlaceSecundario = 'text-label-md text-primary font-semibold hover:underline rounded focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary'

/** E2: centro de información y seguimiento del caso. */
export function DetalleExpedientePage() {
  const { expedienteId = '' } = useParams()
  // `key`: al pasar a otro expediente se reinician avisos y diálogos.
  return <DetalleExpediente key={expedienteId} expedienteId={expedienteId} />
}

function DetalleExpediente({ expedienteId }: { expedienteId: string }) {
  const contenido = detalleExpedienteContent
  const detalle = useDetalleExpediente(expedienteId)
  const [dialogo, setDialogo] = useState<Dialogo>(null)
  const [aviso, setAviso] = useState<string | null>(null)
  const e = detalle.data

  const mensajeError = detalle.error
    ? detalle.error.tipo === 'no_encontrado' || detalle.error.tipo === 'sin_permiso'
      ? contenido.errors[detalle.error.tipo]
      : MENSAJES_ERROR_API[detalle.error.tipo]
    : null
  const errorDefinitivo = detalle.error?.tipo === 'no_encontrado' || detalle.error?.tipo === 'sin_permiso'

  const alGuardar = (mensaje: string) => {
    setDialogo(null)
    setAviso(mensaje)
  }

  return (
    <div className="flex flex-col gap-6">
      <Link
        to={ROUTES.cases}
        className="inline-flex items-center gap-1.5 self-start text-label-md text-secondary hover:text-on-surface rounded focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
      >
        <Icon name="arrow_back" size={18} />
        {contenido.back}
      </Link>

      {detalle.isPending && <EstadoCarga texto={contenido.loading} />}
      {mensajeError && <EstadoError mensaje={mensajeError} onReintentar={errorDefinitivo ? undefined : () => void detalle.refetch()} />}

      {e && (
        <>
          <header className="flex flex-col gap-2">
            <div className="flex flex-wrap items-center gap-3">
              <p className="text-label-lg text-secondary tabular-nums">{e.folio}</p>
              <EtiquetaEstadoExpediente estado={e.estado} />
            </div>
            <h1 className="text-headline-lg text-on-surface tracking-tight">{e.asunto}</h1>
            <p className="flex flex-wrap gap-x-4 gap-y-1 text-body-md text-on-surface-variant">
              <span className="inline-flex items-center gap-1.5">
                <Icon name="balance" size={18} className="text-secondary" />
                {e.areaJuridica}
              </span>
              <span>
                {contenido.opened} {formatearFechaCorta(e.fechaApertura)}
              </span>
              <span>
                {contenido.updated}: <time dateTime={e.ultimaActualizacion}>{formatearRelativa(e.ultimaActualizacion)}</time>
              </span>
              {e.propuesta && (
                <Link to={ROUTES.proposals} className={enlaceSecundario}>
                  {contenido.fromProposal}: {e.propuesta.folio}
                </Link>
              )}
            </p>
          </header>

          {aviso && (
            <p role="status" className="flex items-start gap-2 p-4 rounded-lg bg-primary-container/10 text-body-md text-primary">
              <Icon name="check_circle" size={20} className="shrink-0" />
              {aviso}
            </p>
          )}
          {e.estado === 'finalizado' && (
            <p className="flex items-start gap-2 p-4 rounded-lg bg-surface-container-low text-body-md text-on-surface-variant">
              <Icon name="info" size={20} className="shrink-0 text-secondary" />
              {contenido.closedNotice}
            </p>
          )}

          <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 items-start">
            <div className="xl:col-span-8 flex flex-col gap-6">
              <SeccionExpediente id="expediente-descripcion" titulo={contenido.description}>
                <p className="text-body-md text-on-surface-variant whitespace-pre-line">{e.descripcion}</p>
              </SeccionExpediente>
              <SeccionExpediente id="expediente-actualizaciones" titulo={contenido.updates.title} subtitulo={contenido.updates.subtitle}>
                <ListaActualizaciones actualizaciones={e.actualizaciones} />
              </SeccionExpediente>
              <ResumenDocumentos expediente={e} />
              <SeccionExpediente id="expediente-pagos" titulo={contenido.payments.title}>
                {e.pagos.length === 0 ? (
                  <p className="text-body-md text-secondary">{contenido.payments.empty}</p>
                ) : (
                  <ListaCobros cobros={e.pagos} />
                )}
              </SeccionExpediente>
              <SeccionExpediente id="expediente-historial" titulo={contenido.history.title} subtitulo={contenido.history.subtitle}>
                <HistorialExpediente eventos={e.historial} />
              </SeccionExpediente>
            </div>

            <div className="xl:col-span-4 flex flex-col gap-6">
              <AccionesExpediente
                expediente={e}
                onActualizar={() => setDialogo('actualizacion')}
                onCambiarEstado={() => setDialogo('estado')}
              />
              <TarjetaClienteExpediente expediente={e} />
              <SeccionExpediente
                id="expediente-reuniones"
                titulo={contenido.meetings.title}
                subtitulo={contenido.meetings.subtitle}
                accion={
                  <Link to={ROUTES.agenda} className={enlaceSecundario}>
                    {contenido.meetings.agenda}
                  </Link>
                }
              >
                <ListaReuniones reuniones={e.proximasReuniones} />
              </SeccionExpediente>
            </div>
          </div>

          <DialogoActualizacion
            expedienteId={e.id}
            abierto={dialogo === 'actualizacion'}
            onCerrar={() => setDialogo(null)}
            onGuardado={() => alGuardar(contenido.updateDialog.done)}
          />
          <DialogoCambioEstado
            expedienteId={e.id}
            estadoActual={e.estado}
            abierto={dialogo === 'estado'}
            onCerrar={() => setDialogo(null)}
            onGuardado={() => alGuardar(contenido.statusDialog.done)}
          />
        </>
      )}
    </div>
  )
}
