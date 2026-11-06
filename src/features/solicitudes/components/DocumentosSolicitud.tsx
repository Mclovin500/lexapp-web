import { useState } from 'react'
import { MENSAJES_ERROR_API } from '@/api/errores'
import { Dialogo } from '@/components/ui/Dialogo'
import { EstadoCarga } from '@/components/ui/EstadoCarga'
import { EstadoError } from '@/components/ui/EstadoError'
import { Icon } from '@/components/ui/Icon'
import { descargarUrl, formatearTamano } from '@/lib/archivos'
import { formatearFechaHora } from '@/lib/fechas'
import { detalleSolicitudContent } from '../content/detalle-solicitud.content'
import { useDescargarDocumentoSolicitud, useUrlDocumentoSolicitud } from '../hooks/useSolicitudes'
import type { DocumentoSolicitud } from '../types/solicitudes.types'

const IMAGENES = ['JPG', 'JPEG', 'PNG']

const boton =
  'inline-flex h-9 px-3 items-center gap-1.5 rounded-lg text-label-md font-semibold transition-colors cursor-pointer disabled:opacity-60 disabled:cursor-wait focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary'

interface DocumentosSolicitudProps {
  solicitudId: string
  documentos: DocumentoSolicitud[]
}

/** "Documentos disponibles, cuando corresponda": vista previa y descarga con URL temporal. */
export function DocumentosSolicitud({ solicitudId, documentos }: DocumentosSolicitudProps) {
  const { documents } = detalleSolicitudContent
  const descargar = useDescargarDocumentoSolicitud(solicitudId)
  const [vista, setVista] = useState<DocumentoSolicitud | null>(null)
  const descargandoId = descargar.isPending ? descargar.variables : null

  return (
    <section aria-labelledby="solicitud-documentos" className="rounded-xl bg-surface-container-lowest shadow-sm p-6">
      <h2 id="solicitud-documentos" className="text-headline-sm text-on-surface mb-4">
        {documents.title}
        {documentos.length > 0 && <span className="ml-2 text-body-sm text-secondary">({documentos.length})</span>}
      </h2>
      {documentos.length === 0 ? (
        <p className="text-body-md text-secondary">{documents.empty}</p>
      ) : (
        <>
          <ul className="space-y-2">
            {documentos.map((documento) => (
              <li key={documento.id} className="flex flex-col sm:flex-row sm:items-center gap-3 p-3 rounded-lg bg-surface-container-low">
                <div className="flex items-center gap-3 flex-1 min-w-0">
                  <span className="w-10 h-10 rounded-lg bg-surface-container-lowest flex items-center justify-center text-primary shrink-0">
                    <Icon name="description" size={20} />
                  </span>
                  <div className="min-w-0">
                    <p className="text-label-md text-on-surface font-semibold truncate">{documento.nombre}</p>
                    <p className="text-body-sm text-secondary">
                      {documento.tipoArchivo} · {formatearTamano(documento.tamanoBytes)} · {formatearFechaHora(documento.fechaCarga)}
                    </p>
                  </div>
                </div>
                <div className="flex gap-1 self-end sm:self-auto">
                  <button
                    type="button"
                    onClick={() => setVista(documento)}
                    aria-label={`${documents.preview}: ${documento.nombre}`}
                    className={`${boton} text-on-surface hover:bg-surface-container`}
                  >
                    <Icon name="visibility" size={18} />
                    <span className="hidden md:inline">{documents.preview}</span>
                  </button>
                  <button
                    type="button"
                    disabled={descargandoId === documento.id}
                    onClick={() => descargar.mutate(documento.id, { onSuccess: ({ url }) => descargarUrl(url, documento.nombre) })}
                    aria-label={`${documents.download}: ${documento.nombre}`}
                    className={`${boton} bg-surface-container-lowest text-primary shadow-sm hover:bg-surface-container`}
                  >
                    <Icon name={descargandoId === documento.id ? 'hourglass_top' : 'download'} size={18} />
                    {descargandoId === documento.id ? documents.downloading : documents.download}
                  </button>
                </div>
              </li>
            ))}
          </ul>
          {descargar.isError && (
            <div className="mt-3">
              <EstadoError mensaje={MENSAJES_ERROR_API[descargar.error.tipo]} />
            </div>
          )}
          <p className="mt-3 flex items-center gap-1.5 text-[11px] text-secondary">
            <Icon name="lock" size={14} />
            {documents.protectedNote}
          </p>
        </>
      )}

      <Dialogo abierto={vista !== null} onCerrar={() => setVista(null)} titulo={vista?.nombre ?? documents.preview} ancho="lg">
        {vista && <VistaPrevia solicitudId={solicitudId} documento={vista} />}
      </Dialogo>
    </section>
  )
}

function VistaPrevia({ solicitudId, documento }: { solicitudId: string; documento: DocumentoSolicitud }) {
  const { documents } = detalleSolicitudContent
  const url = useUrlDocumentoSolicitud(solicitudId, documento.id)
  const tipo = documento.tipoArchivo.toUpperCase()

  return (
    <div className="flex flex-col gap-4">
      <div className="h-[60vh] min-h-64 rounded-lg bg-surface-container-low overflow-hidden flex items-center justify-center">
        {url.isPending && <EstadoCarga texto={documents.previewLoading} />}
        {url.isError && <EstadoError mensaje={MENSAJES_ERROR_API[url.error.tipo]} onReintentar={() => void url.refetch()} />}
        {url.data &&
          (tipo === 'PDF' ? (
            <iframe src={url.data.url} title={`${documents.preview}: ${documento.nombre}`} className="w-full h-full bg-surface-container-lowest" />
          ) : IMAGENES.includes(tipo) ? (
            <img src={url.data.url} alt={documento.nombre} className="max-w-full max-h-full object-contain" />
          ) : (
            <p className="flex items-center gap-2 p-6 text-body-md text-secondary">
              <Icon name="visibility_off" size={20} />
              {documents.previewUnsupported}
            </p>
          ))}
      </div>
      <div className="flex justify-end">
        <button
          type="button"
          disabled={!url.data}
          onClick={() => url.data && descargarUrl(url.data.url, documento.nombre)}
          className="h-11 px-5 inline-flex items-center gap-2 rounded-lg bg-primary-container hover:bg-primary text-on-primary text-label-lg font-semibold disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
        >
          <Icon name="download" size={18} />
          {documents.download}
        </button>
      </div>
    </div>
  )
}
