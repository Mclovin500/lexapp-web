import { Icon } from '@/components/ui/Icon'
import { formatearTamano } from '@/lib/archivos'
import { formatearFechaHora } from '@/lib/fechas'
import { detalleSolicitudContent } from '../content/detalle-solicitud.content'
import type { DocumentoSolicitud } from '../types/solicitudes.types'

/** "Documentos disponibles, cuando corresponda". */
export function DocumentosSolicitud({ documentos }: { documentos: DocumentoSolicitud[] }) {
  const { documents } = detalleSolicitudContent

  return (
    <section aria-labelledby="solicitud-documentos" className="rounded-xl bg-surface-container-lowest shadow-sm p-6">
      <h2 id="solicitud-documentos" className="text-headline-sm text-on-surface mb-4">
        {documents.title}
        {documentos.length > 0 && <span className="ml-2 text-body-sm text-secondary">({documentos.length})</span>}
      </h2>
      {documentos.length === 0 ? (
        <p className="text-body-md text-secondary">{documents.empty}</p>
      ) : (
        <ul className="space-y-2">
          {documentos.map((documento) => (
            <li key={documento.id} className="flex items-center gap-3 p-3 rounded-lg bg-surface-container-low">
              <span className="w-10 h-10 rounded-lg bg-surface-container-lowest flex items-center justify-center text-primary shrink-0">
                <Icon name="description" size={20} />
              </span>
              <div className="flex-1 min-w-0">
                <p className="text-label-md text-on-surface font-semibold truncate">{documento.nombre}</p>
                <p className="text-body-sm text-secondary">
                  {documento.tipoArchivo} · {formatearTamano(documento.tamanoBytes)} · {formatearFechaHora(documento.fechaCarga)}
                </p>
              </div>
              {documento.url ? (
                <a
                  href={documento.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex h-9 px-3 items-center gap-1.5 rounded-lg bg-surface-container-lowest text-primary text-label-md font-semibold shadow-sm hover:bg-surface-container transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
                >
                  <Icon name="download" size={18} />
                  {documents.download}
                </a>
              ) : (
                <span className="text-body-sm text-outline" title={documents.unavailable}>
                  {documents.unavailable}
                </span>
              )}
            </li>
          ))}
        </ul>
      )}
    </section>
  )
}
