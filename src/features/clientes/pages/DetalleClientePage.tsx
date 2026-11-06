import type { ReactNode } from 'react'
import { generatePath, Link, useParams } from 'react-router-dom'
import { ROUTES } from '@/app/routes'
import { MENSAJES_ERROR_API } from '@/api/errores'
import { Avatar } from '@/components/ui/Avatar'
import { EstadoCarga } from '@/components/ui/EstadoCarga'
import { EstadoError } from '@/components/ui/EstadoError'
import { Icon } from '@/components/ui/Icon'
import { ListaCobros } from '@/features/dashboard/components/ListaCobros'
import { EtiquetaEstadoDocumento, EtiquetaEstadoExpediente } from '@/features/expedientes/components/EtiquetaEstado'
import { SeccionExpediente as Seccion } from '@/features/expedientes/components/SeccionExpediente'
import { categoriasDocumento } from '@/features/expedientes/content/documentos.content'
import { tiposPersona } from '@/features/solicitudes/content/solicitudes.content'
import { extensionArchivo } from '@/lib/archivos'
import { formatearFechaCorta, formatearRelativa } from '@/lib/fechas'
import { EtiquetaEstadoCliente } from '../components/EtiquetaEstadoCliente'
import { HistorialInteraccion } from '../components/HistorialInteraccion'
import { detalleClienteContent } from '../content/detalle-cliente.content'
import { useDetalleCliente } from '../hooks/useClientes'

const enlace =
  'text-label-md text-primary font-semibold hover:underline rounded focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary'

function Dato({ etiqueta, children }: { etiqueta: string; children: ReactNode }) {
  return (
    <div className="flex flex-col gap-0.5 min-w-0">
      <dt className="text-label-sm uppercase tracking-wider text-secondary">{etiqueta}</dt>
      <dd className="text-body-md text-on-surface break-words">{children}</dd>
    </div>
  )
}

/** F2: información autorizada del cliente. Expediente → E2 · Pago → D5 · Chat → H1. */
export function DetalleClientePage() {
  const { clienteId = '' } = useParams()
  const contenido = detalleClienteContent
  const detalle = useDetalleCliente(clienteId)
  const c = detalle.data

  return (
    <div className="flex flex-col gap-6">
      <Link
        to={ROUTES.clients}
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

      {c && (
        <>
          <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <Avatar nombre={c.nombre} size="lg" />
              <div>
                <h1 className="text-headline-lg text-on-surface tracking-tight">{c.nombre}</h1>
                <div className="mt-1 flex flex-wrap items-center gap-2 text-body-md text-on-surface-variant">
                  <EtiquetaEstadoCliente estado={c.estado} />
                  <span>
                    {contenido.since} {formatearFechaCorta(c.clienteDesde)}
                  </span>
                </div>
              </div>
            </div>
            <Link
              to={ROUTES.chat}
              state={{ clienteId: c.id }}
              className="h-11 px-5 inline-flex items-center justify-center gap-2 rounded-lg bg-primary-container hover:bg-primary-hover text-on-primary-container hover:text-on-primary text-label-lg font-semibold shadow-sm transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
            >
              <Icon name="chat" size={20} />
              {contenido.chat}
            </Link>
          </header>

          <p className="flex items-start gap-2 p-3 rounded-lg bg-surface-container-low text-body-sm text-secondary">
            <Icon name="shield" size={18} className="shrink-0 mt-0.5" />
            {contenido.privacy}
          </p>

          <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 items-start">
            <div className="xl:col-span-4 flex flex-col gap-6">
              <Seccion id="cliente-basica" titulo={contenido.basic.title}>
                <dl className="flex flex-col gap-4">
                  <Dato etiqueta={contenido.basic.name}>{c.nombre}</Dato>
                  <Dato etiqueta={contenido.basic.type}>{tiposPersona[c.tipoPersona]}</Dato>
                  {c.organizacion && <Dato etiqueta={contenido.basic.organization}>{c.organizacion}</Dato>}
                </dl>
              </Seccion>
              <Seccion id="cliente-contacto" titulo={contenido.contact.title}>
                <dl className="flex flex-col gap-4">
                  <Dato etiqueta={contenido.contact.email}>
                    <a href={`mailto:${c.correo}`} className="text-primary hover:underline break-all">
                      {c.correo}
                    </a>
                  </Dato>
                  <Dato etiqueta={contenido.contact.phone}>
                    {c.telefono ? (
                      <a href={`tel:${c.telefono.replace(/\s/g, '')}`} className="hover:underline tabular-nums">
                        {c.telefono}
                      </a>
                    ) : (
                      <span className="text-outline">{contenido.contact.noPhone}</span>
                    )}
                  </Dato>
                </dl>
              </Seccion>
              <Seccion
                id="cliente-pagos"
                titulo={contenido.payments.title}
                accion={
                  <Link to={ROUTES.fees} className={enlace}>
                    {contenido.payments.viewAll}
                  </Link>
                }
              >
                {c.pagos.length === 0 ? <p className="text-body-md text-secondary">{contenido.payments.empty}</p> : <ListaCobros cobros={c.pagos} />}
              </Seccion>
            </div>

            <div className="xl:col-span-8 flex flex-col gap-6">
              <Seccion id="cliente-expedientes" titulo={contenido.cases.title}>
                {c.expedientesRelacionados.length === 0 ? (
                  <p className="text-body-md text-secondary">{contenido.cases.empty}</p>
                ) : (
                  <ul className="flex flex-col gap-2">
                    {c.expedientesRelacionados.map((e) => (
                      <li key={e.id}>
                        <Link
                          to={generatePath(ROUTES.caseDetail, { expedienteId: e.id })}
                          aria-label={`${contenido.cases.view} ${e.folio}`}
                          className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 p-3 rounded-lg bg-surface-container-low hover:bg-surface-container transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
                        >
                          <span className="text-label-md text-on-surface font-semibold tabular-nums whitespace-nowrap">{e.folio}</span>
                          <span className="flex-1 min-w-0">
                            <span className="block text-body-md text-on-surface truncate">{e.asunto}</span>
                            <span className="block text-body-sm text-secondary">
                              {e.areaJuridica} · {formatearRelativa(e.ultimaActualizacion)}
                            </span>
                          </span>
                          <EtiquetaEstadoExpediente estado={e.estado} />
                          <Icon name="chevron_right" size={20} className="hidden sm:block text-secondary" />
                        </Link>
                      </li>
                    ))}
                  </ul>
                )}
              </Seccion>

              <Seccion id="cliente-documentos" titulo={contenido.documents.title}>
                {c.documentos.length === 0 ? (
                  <p className="text-body-md text-secondary">{contenido.documents.empty}</p>
                ) : (
                  <ul className="flex flex-col gap-2">
                    {c.documentos.map((d) => (
                      <li key={d.id} className="flex items-center gap-3 p-3 rounded-lg bg-surface-container-low">
                        <span className="w-10 h-10 shrink-0 rounded-lg bg-surface-container-lowest flex items-center justify-center text-[11px] font-bold uppercase text-primary" aria-hidden="true">
                          {extensionArchivo(d.nombre) || 'DOC'}
                        </span>
                        <div className="flex-1 min-w-0">
                          <p className="text-label-md text-on-surface font-semibold truncate">{d.nombre}</p>
                          <p className="text-body-sm text-secondary truncate">
                            {categoriasDocumento[d.categoria]} · {d.expediente.folio} · {formatearRelativa(d.fechaCarga)}
                          </p>
                        </div>
                        <EtiquetaEstadoDocumento estado={d.estado} />
                        <Link
                          to={generatePath(ROUTES.caseDocuments, { expedienteId: d.expediente.id })}
                          aria-label={`${contenido.documents.view} del ${d.expediente.folio}`}
                          className="inline-flex shrink-0 h-9 w-9 items-center justify-center rounded-lg text-secondary hover:bg-surface-container focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
                        >
                          <Icon name="chevron_right" size={20} />
                        </Link>
                      </li>
                    ))}
                  </ul>
                )}
              </Seccion>

              <Seccion id="cliente-historial" titulo={contenido.history.title} subtitulo={contenido.history.subtitle}>
                <HistorialInteraccion interacciones={c.interacciones} />
              </Seccion>
            </div>
          </div>
        </>
      )}
    </div>
  )
}
