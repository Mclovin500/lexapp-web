import { MENSAJES_ERROR_API } from '@/api/errores'
import { Dialogo } from '@/components/ui/Dialogo'
import { EstadoCarga } from '@/components/ui/EstadoCarga'
import { EstadoError } from '@/components/ui/EstadoError'
import { Icon } from '@/components/ui/Icon'
import { descargarUrl, formatearTamano } from '@/lib/archivos'
import { formatearFechaHora } from '@/lib/fechas'
import { categoriasDocumento, documentosContent } from '../content/documentos.content'
import { useUrlDocumento } from '../hooks/useDocumentos'
import type { DocumentoExpediente } from '../types/documentos.types'
import { EtiquetaEstadoDocumento } from './EtiquetaEstado'

interface DialogoVistaPreviaProps {
  expedienteId: string
  documento: DocumentoExpediente | null
  onCerrar: () => void
}

/** Vista previa (PDF e imágenes), datos e historial del documento. */
export function DialogoVistaPrevia({ expedienteId, documento, onCerrar }: DialogoVistaPreviaProps) {
  return (
    <Dialogo abierto={documento !== null} onCerrar={onCerrar} titulo={documento?.nombre ?? documentosContent.preview.title} ancho="lg">
      {documento && <Contenido expedienteId={expedienteId} documento={documento} />}
    </Dialogo>
  )
}

function Contenido({ expedienteId, documento }: { expedienteId: string; documento: DocumentoExpediente }) {
  const { preview, table } = documentosContent
  const url = useUrlDocumento(expedienteId, documento.id)
  const esPdf = documento.tipoArchivo === 'application/pdf'
  const esImagen = documento.tipoArchivo.startsWith('image/')

  return (
    <div className="flex flex-col gap-4">
      <div className="h-[50vh] min-h-64 rounded-lg bg-surface-container-low overflow-hidden flex items-center justify-center">
        {url.isPending && <EstadoCarga texto={preview.loading} />}
        {url.isError && <EstadoError mensaje={MENSAJES_ERROR_API[url.error.tipo]} onReintentar={() => void url.refetch()} />}
        {url.data &&
          (esPdf ? (
            <iframe src={url.data.url} title={`${preview.title}: ${documento.nombre}`} className="w-full h-full bg-surface-container-lowest" />
          ) : esImagen ? (
            <img src={url.data.url} alt={documento.nombre} className="max-w-full max-h-full object-contain" />
          ) : (
            <p className="flex items-center gap-2 p-6 text-body-md text-secondary">
              <Icon name="visibility_off" size={20} />
              {preview.unsupported}
            </p>
          ))}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <h3 className="text-label-lg text-on-surface font-semibold mb-2">{preview.details}</h3>
          <dl className="flex flex-col gap-1.5 text-body-sm">
            <div className="flex gap-2"><dt className="text-secondary">{table.category}:</dt><dd className="text-on-surface">{categoriasDocumento[documento.categoria]}</dd></div>
            <div className="flex gap-2"><dt className="text-secondary">{table.author}:</dt><dd className="text-on-surface">{documento.cargadoPor.nombre} ({table.roles[documento.cargadoPor.rol]})</dd></div>
            <div className="flex gap-2"><dt className="text-secondary">{table.date}:</dt><dd className="text-on-surface">{formatearFechaHora(documento.fechaCarga)}</dd></div>
            <div className="flex gap-2"><dt className="text-secondary">{table.size}:</dt><dd className="text-on-surface">{formatearTamano(documento.tamanoBytes)}</dd></div>
            <div className="flex gap-2 items-center"><dt className="text-secondary">{table.status}:</dt><dd><EtiquetaEstadoDocumento estado={documento.estado} /></dd></div>
          </dl>
        </div>
        <div>
          <h3 className="text-label-lg text-on-surface font-semibold mb-2">{preview.history}</h3>
          <ol className="flex flex-col gap-2">
            {[...documento.historial].reverse().map((evento) => (
              <li key={`${evento.accion}-${evento.fecha}`} className="text-body-sm">
                <p className="text-on-surface font-medium">
                  {preview.actions[evento.accion]} · <span className="text-secondary font-normal">{evento.autor}</span>
                </p>
                <p className="text-secondary">{formatearFechaHora(evento.fecha)}</p>
                {evento.nota && <p className="text-on-surface-variant">"{evento.nota}"</p>}
              </li>
            ))}
          </ol>
        </div>
      </div>

      <div className="flex justify-end">
        <button
          type="button"
          disabled={!url.data}
          onClick={() => url.data && descargarUrl(url.data.url, documento.nombre)}
          className="h-11 px-5 inline-flex items-center gap-2 rounded-lg bg-primary-container hover:bg-primary text-on-primary text-label-lg font-semibold disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
        >
          <Icon name="download" size={18} />
          {preview.download}
        </button>
      </div>
    </div>
  )
}
