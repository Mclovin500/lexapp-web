import { generatePath, Link } from 'react-router-dom'
import { ROUTES } from '@/app/routes'
import { Icon } from '@/components/ui/Icon'
import { extensionArchivo } from '@/lib/archivos'
import { formatearRelativa } from '@/lib/fechas'
import { categoriasDocumento } from '../content/documentos.content'
import { detalleExpedienteContent } from '../content/detalle-expediente.content'
import type { ExpedienteDetalle } from '../types/expedientes.types'
import { EtiquetaEstadoDocumento } from './EtiquetaEstado'
import { SeccionExpediente } from './SeccionExpediente'

/** Documentos recientes de E2. "Ver todos" → E3. */
export function ResumenDocumentos({ expediente }: { expediente: ExpedienteDetalle }) {
  const { documents } = detalleExpedienteContent
  const { total, pendientesRevision, recientes } = expediente.documentos
  const rutaDocumentos = generatePath(ROUTES.caseDocuments, { expedienteId: expediente.id })

  return (
    <SeccionExpediente
      id="expediente-documentos"
      titulo={documents.title}
      subtitulo={total > 0 ? `${documents.total(total)}${pendientesRevision > 0 ? ` · ${documents.pending(pendientesRevision)}` : ''}` : undefined}
    >
      {recientes.length === 0 ? (
        <p className="text-body-md text-secondary">{documents.empty}</p>
      ) : (
        <ul className="flex flex-col gap-2">
          {recientes.map((d) => (
            <li key={d.id} className="flex items-center gap-3 p-3 rounded-lg bg-surface-container-low">
              <span className="w-10 h-10 shrink-0 rounded-lg bg-surface-container-lowest flex items-center justify-center text-[11px] font-bold uppercase text-primary">
                {extensionArchivo(d.nombre) || <Icon name="description" size={18} />}
              </span>
              <div className="flex-1 min-w-0">
                <p className="text-label-md text-on-surface font-semibold truncate">{d.nombre}</p>
                <p className="text-body-sm text-secondary truncate">
                  {categoriasDocumento[d.categoria]} · {formatearRelativa(d.fechaCarga)}
                </p>
              </div>
              <EtiquetaEstadoDocumento estado={d.estado} />
            </li>
          ))}
        </ul>
      )}
      <Link
        to={rutaDocumentos}
        className="inline-flex h-10 px-4 items-center justify-center gap-2 rounded-lg bg-surface-container text-on-surface text-label-md font-semibold hover:bg-surface-container-high transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
      >
        <Icon name="folder_open" size={18} />
        {documents.viewAll}
      </Link>
    </SeccionExpediente>
  )
}
