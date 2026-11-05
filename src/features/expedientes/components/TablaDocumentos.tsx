import { Icon } from '@/components/ui/Icon'
import { extensionArchivo, formatearTamano } from '@/lib/archivos'
import { formatearFechaHora } from '@/lib/fechas'
import { categoriasDocumento, documentosContent } from '../content/documentos.content'
import type { DocumentoExpediente } from '../types/documentos.types'
import { EtiquetaEstadoDocumento } from './EtiquetaEstado'

interface TablaDocumentosProps {
  documentos: DocumentoExpediente[]
  descargandoId: string | null
  onVer: (documento: DocumentoExpediente) => void
  onDescargar: (documento: DocumentoExpediente) => void
  onRevisar: (documento: DocumentoExpediente) => void
}

const boton =
  'inline-flex h-9 px-3 items-center gap-1.5 rounded-lg text-label-md font-semibold transition-colors cursor-pointer disabled:opacity-60 disabled:cursor-wait focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary'

/** E3: nombre, categoría, fecha, autor y estado, con vista previa, descarga y revisión. */
export function TablaDocumentos({ documentos, descargandoId, onVer, onDescargar, onRevisar }: TablaDocumentosProps) {
  const { table } = documentosContent

  return (
    <div className="overflow-x-auto rounded-xl bg-surface-container-lowest shadow-sm">
      <table className="w-full min-w-[1040px] text-left">
        <caption className="sr-only">{table.caption}</caption>
        <thead>
          <tr className="text-label-sm uppercase tracking-wider text-secondary bg-surface-container-low/60">
            <th scope="col" className="px-4 py-3 font-semibold">{table.name}</th>
            <th scope="col" className="px-4 py-3 font-semibold">{table.category}</th>
            <th scope="col" className="px-4 py-3 font-semibold">{table.date}</th>
            <th scope="col" className="px-4 py-3 font-semibold">{table.author}</th>
            <th scope="col" className="px-4 py-3 font-semibold">{table.status}</th>
            <th scope="col" className="px-4 py-3 font-semibold text-right">{table.actions}</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-surface-container">
          {documentos.map((d) => (
            <tr key={d.id} className="hover:bg-surface-container-low/50 transition-colors">
              <td className="px-4 py-4">
                <div className="flex items-center gap-3">
                  <span className="w-10 h-10 shrink-0 rounded-lg bg-surface-container-low flex items-center justify-center text-[11px] font-bold uppercase text-primary" aria-hidden="true">
                    {extensionArchivo(d.nombre) || 'DOC'}
                  </span>
                  <div className="min-w-0">
                    <p className="text-label-lg text-on-surface font-semibold break-all">{d.nombre}</p>
                    <p className="text-body-sm text-secondary">
                      {formatearTamano(d.tamanoBytes)}
                      {d.descripcion && ` · ${d.descripcion}`}
                    </p>
                  </div>
                </div>
              </td>
              <td className="px-4 py-4 text-body-sm text-on-surface-variant">{categoriasDocumento[d.categoria]}</td>
              <td className="px-4 py-4 text-body-sm text-secondary whitespace-nowrap">{formatearFechaHora(d.fechaCarga)}</td>
              <td className="px-4 py-4">
                <p className="text-body-md text-on-surface">{d.cargadoPor.nombre}</p>
                <p className="text-body-sm text-secondary">{table.roles[d.cargadoPor.rol]}</p>
              </td>
              <td className="px-4 py-4">
                <EtiquetaEstadoDocumento estado={d.estado} />
              </td>
              <td className="px-4 py-4">
                <div className="flex justify-end gap-1">
                  <button type="button" onClick={() => onVer(d)} aria-label={`${table.preview}: ${d.nombre}`} className={`${boton} text-on-surface hover:bg-surface-container`}>
                    <Icon name="visibility" size={18} />
                    <span className="hidden 2xl:inline">{table.preview}</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => onDescargar(d)}
                    disabled={descargandoId === d.id}
                    aria-label={`${table.download}: ${d.nombre}`}
                    className={`${boton} text-on-surface hover:bg-surface-container`}
                  >
                    <Icon name={descargandoId === d.id ? 'hourglass_top' : 'download'} size={18} />
                    <span className="hidden 2xl:inline">{descargandoId === d.id ? table.downloading : table.download}</span>
                  </button>
                  {d.estado === 'pendiente_revision' && (
                    <button
                      type="button"
                      onClick={() => onRevisar(d)}
                      aria-label={`${table.review}: ${d.nombre}`}
                      className={`${boton} bg-primary-container/10 text-primary hover:bg-primary-container/20`}
                    >
                      <Icon name="fact_check" size={18} />
                      {table.review}
                    </button>
                  )}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
