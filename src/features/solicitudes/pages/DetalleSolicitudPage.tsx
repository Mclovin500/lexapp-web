import { useRef, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { ROUTES } from '@/app/routes'
import { MENSAJES_ERROR_API } from '@/api/errores'
import { EstadoCarga } from '@/components/ui/EstadoCarga'
import { EstadoError } from '@/components/ui/EstadoError'
import { Icon } from '@/components/ui/Icon'
import { formatearFechaHora, formatearRelativa } from '@/lib/fechas'
import { AccionesSolicitud } from '../components/AccionesSolicitud'
import { DialogoRechazo } from '../components/DialogoRechazo'
import { DocumentosSolicitud } from '../components/DocumentosSolicitud'
import { EtiquetaEstadoSolicitud } from '../components/EtiquetaEstadoSolicitud'
import { EtiquetaPrioridad } from '../components/EtiquetaPrioridad'
import { TarjetaClienteSolicitud } from '../components/TarjetaClienteSolicitud'
import { detalleSolicitudContent } from '../content/detalle-solicitud.content'
import { useDetalleSolicitud } from '../hooks/useSolicitudes'

/** C2: análisis de una solicitud antes de presentar una propuesta (C2 → D1). */
export function DetalleSolicitudPage() {
  const { solicitudId = '' } = useParams()
  const contenido = detalleSolicitudContent
  const detalle = useDetalleSolicitud(solicitudId)
  const solicitud = detalle.data
  const [dialogoAbierto, setDialogoAbierto] = useState(false)
  const [aviso, setAviso] = useState<string | null>(null)
  const seccionInformacion = useRef<HTMLElement>(null)

  const irAInformacion = () => {
    seccionInformacion.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    seccionInformacion.current?.focus({ preventScroll: true })
  }

  return (
    <div className="flex flex-col gap-6">
      <Link
        to={ROUTES.requests}
        className="inline-flex items-center gap-1.5 self-start text-label-md text-secondary hover:text-on-surface rounded focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
      >
        <Icon name="arrow_back" size={18} />
        {contenido.back}
      </Link>

      {detalle.isPending && <EstadoCarga texto={contenido.loading} />}

      {detalle.isError && (
        <EstadoError
          mensaje={detalle.error.tipo === 'no_encontrado' ? contenido.errors.no_encontrado : MENSAJES_ERROR_API[detalle.error.tipo]}
          onReintentar={detalle.error.tipo === 'no_encontrado' ? undefined : () => void detalle.refetch()}
        />
      )}

      {solicitud && (
        <>
          <div className="flex flex-col gap-2">
            <div className="flex flex-wrap items-center gap-3">
              <h1 className="text-headline-lg text-on-surface tracking-tight">{contenido.title}</h1>
              <span className="text-label-md text-secondary tabular-nums">#{solicitud.folio}</span>
            </div>
            <div className="flex flex-wrap items-center gap-2 text-body-sm text-secondary">
              <EtiquetaEstadoSolicitud estado={solicitud.estado} />
              <EtiquetaPrioridad prioridad={solicitud.prioridad} />
              <span className="inline-flex items-center gap-1">
                <Icon name="schedule" size={16} />
                {contenido.receivedAt}: {formatearFechaHora(solicitud.fechaRecepcion)} ({formatearRelativa(solicitud.fechaRecepcion)})
              </span>
            </div>
          </div>

          {aviso && (
            <p role="status" className="p-3 rounded-lg bg-primary-container/10 text-primary text-body-sm flex items-center gap-2">
              <Icon name="check_circle" size={18} />
              {aviso}
            </p>
          )}

          <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 items-start">
            <div className="xl:col-span-8 flex flex-col gap-6">
              <TarjetaClienteSolicitud cliente={solicitud.cliente} />

              <section aria-labelledby="solicitud-necesidad" className="rounded-xl bg-surface-container-lowest shadow-sm p-6">
                <h2 id="solicitud-necesidad" className="text-headline-sm text-on-surface mb-1">
                  {contenido.need.title}
                </h2>
                <p className="text-body-sm text-secondary mb-4">
                  {contenido.need.area}: <strong className="text-on-surface">{solicitud.areaJuridica}</strong>
                </p>
                <p className="text-label-lg text-on-surface mb-2">{solicitud.asunto}</p>
                <blockquote className="p-4 rounded-lg bg-surface-container-low border-l-4 border-primary-container text-body-md text-on-surface-variant leading-relaxed">
                  {solicitud.descripcion}
                  <footer className="mt-2 text-[11px] uppercase tracking-wider text-outline">{contenido.need.quoteNote}</footer>
                </blockquote>
              </section>

              <section
                ref={seccionInformacion}
                tabIndex={-1}
                id="informacion-cliente"
                aria-labelledby="solicitud-informacion"
                className="rounded-xl bg-surface-container-lowest shadow-sm p-6 scroll-mt-24 focus:outline-2 focus:outline-primary"
              >
                <h2 id="solicitud-informacion" className="text-headline-sm text-on-surface mb-4">
                  {contenido.info.title}
                </h2>
                {solicitud.informacionAdicional.length === 0 ? (
                  <p className="text-body-md text-secondary">{contenido.info.empty}</p>
                ) : (
                  <dl className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {solicitud.informacionAdicional.map((dato) => (
                      <div key={dato.etiqueta} className="p-3 rounded-lg bg-surface-container-low">
                        <dt className="text-[11px] uppercase tracking-wider text-secondary">{dato.etiqueta}</dt>
                        <dd className="text-body-md text-on-surface">{dato.valor}</dd>
                      </div>
                    ))}
                  </dl>
                )}
              </section>

              <DocumentosSolicitud documentos={solicitud.documentos} />

              <p className="flex items-start gap-2 p-4 rounded-lg bg-surface-container-low text-body-sm text-secondary">
                <Icon name="info" size={18} className="shrink-0 mt-0.5" />
                {contenido.disclaimer}
              </p>
            </div>

            <div className="xl:col-span-4 flex flex-col gap-4 xl:sticky xl:top-24">
              {solicitud.estado === 'rechazada' && (
                <div className="rounded-xl bg-error-container/40 p-5">
                  <p className="text-label-lg text-on-error-container font-semibold">{contenido.rejected.title}</p>
                  {solicitud.motivoRechazo && (
                    <p className="mt-1 text-body-sm text-on-surface">
                      <span className="font-semibold">{contenido.rejected.reason}:</span> {solicitud.motivoRechazo}
                    </p>
                  )}
                </div>
              )}
              {solicitud.estado === 'atendida' && (
                <p className="rounded-xl bg-surface-container-low p-5 text-body-sm text-secondary">{contenido.attended}</p>
              )}
              <AccionesSolicitud
                solicitud={solicitud}
                onRechazar={() => setDialogoAbierto(true)}
                onIrAInformacion={() => {
                  irAInformacion()
                  if (solicitud.estado === 'nueva') setAviso(contenido.actions.reviewDone)
                }}
              />
            </div>
          </div>

          <DialogoRechazo
            solicitudId={solicitud.id}
            abierto={dialogoAbierto}
            onCerrar={() => setDialogoAbierto(false)}
            onRechazada={() => {
              setDialogoAbierto(false)
              setAviso(contenido.rejectDialog.done)
            }}
          />
        </>
      )}
    </div>
  )
}
