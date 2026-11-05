import { useState } from 'react'
import { generatePath, Link, useParams, useSearchParams } from 'react-router-dom'
import { ROUTES } from '@/app/routes'
import { MENSAJES_ERROR_API } from '@/api/errores'
import { BuscadorListado } from '@/components/ui/BuscadorListado'
import { EstadoCarga } from '@/components/ui/EstadoCarga'
import { EstadoError } from '@/components/ui/EstadoError'
import { EstadoVacio } from '@/components/ui/EstadoVacio'
import { FiltroPestanas } from '@/components/ui/FiltroPestanas'
import { Icon } from '@/components/ui/Icon'
import { descargarUrl } from '@/lib/archivos'
import { DialogoCargaDocumento } from '../components/DialogoCargaDocumento'
import { DialogoRevisionDocumento } from '../components/DialogoRevisionDocumento'
import { DialogoVistaPrevia } from '../components/DialogoVistaPrevia'
import { EtiquetaEstadoExpediente } from '../components/EtiquetaEstado'
import { TablaDocumentos } from '../components/TablaDocumentos'
import { categoriasDocumento, documentosContent } from '../content/documentos.content'
import { useDescargarDocumento, useDocumentosExpediente } from '../hooks/useDocumentos'
import { filtrosDocumentosAUrl, filtrosDocumentosDesdeUrl } from '../lib/filtros-documentos-url'
import { esCategoriaDocumento } from '../schemas/documento.schema'
import type { DocumentoExpediente, FiltrosDocumentos } from '../types/documentos.types'

/** E3: documentos del expediente (consultar, vista previa, descargar, cargar y revisar). */
export function DocumentosExpedientePage() {
  const { expedienteId = '' } = useParams()
  return <DocumentosExpediente key={expedienteId} expedienteId={expedienteId} />
}

function DocumentosExpediente({ expedienteId }: { expedienteId: string }) {
  const contenido = documentosContent
  const { filters } = contenido
  const [parametros, setParametros] = useSearchParams()
  const filtros = filtrosDocumentosDesdeUrl(parametros)
  const listado = useDocumentosExpediente(expedienteId, filtros)
  const descargar = useDescargarDocumento(expedienteId)
  const [vista, setVista] = useState<DocumentoExpediente | null>(null)
  const [revision, setRevision] = useState<DocumentoExpediente | null>(null)
  const [cargando, setCargando] = useState(false)
  const [aviso, setAviso] = useState<string | null>(null)
  const datos = listado.data
  const finalizado = datos?.expediente.estado === 'finalizado'
  const hayFiltros = filtros.estado !== 'todos' || filtros.categoria !== null || filtros.busqueda !== ''
  const rutaExpediente = generatePath(ROUTES.caseDetail, { expedienteId })

  const cambiar = (cambios: Partial<FiltrosDocumentos>) => setParametros(filtrosDocumentosAUrl({ ...filtros, ...cambios }))

  const alDescargar = (documento: DocumentoExpediente) => {
    descargar.mutate(documento.id, { onSuccess: ({ url }) => descargarUrl(url, documento.nombre) })
  }

  const errorListado = listado.error
    ? listado.error.tipo === 'no_encontrado' || listado.error.tipo === 'sin_permiso'
      ? contenido.errors[listado.error.tipo]
      : MENSAJES_ERROR_API[listado.error.tipo]
    : null
  const errorDefinitivo = listado.error?.tipo === 'no_encontrado' || listado.error?.tipo === 'sin_permiso'

  return (
    <div className="flex flex-col gap-6">
      <Link
        to={rutaExpediente}
        className="inline-flex items-center gap-1.5 self-start text-label-md text-secondary hover:text-on-surface rounded focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
      >
        <Icon name="arrow_back" size={18} />
        {contenido.back}
      </Link>

      {listado.isPending && <EstadoCarga texto={contenido.loading} />}
      {errorListado && <EstadoError mensaje={errorListado} onReintentar={errorDefinitivo ? undefined : () => void listado.refetch()} />}

      {datos && (
        <>
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-4">
            <div>
              <div className="flex flex-wrap items-center gap-3">
                <p className="text-label-lg text-secondary tabular-nums">{datos.expediente.folio}</p>
                <EtiquetaEstadoExpediente estado={datos.expediente.estado} />
              </div>
              <h1 className="mt-1 text-headline-lg text-on-surface tracking-tight">{contenido.title}</h1>
              <p className="mt-1 text-body-md text-on-surface-variant">
                {datos.expediente.asunto} ·{' '}
                <Link to={generatePath(ROUTES.clientDetail, { clienteId: datos.expediente.cliente.id })} className="text-primary hover:underline">
                  {datos.expediente.cliente.nombre}
                </Link>
              </p>
            </div>
            <button
              type="button"
              disabled={finalizado}
              onClick={() => {
                setAviso(null)
                setCargando(true)
              }}
              className="h-11 px-5 inline-flex items-center justify-center gap-2 rounded-lg bg-primary-container hover:bg-primary text-on-primary text-label-lg font-semibold shadow-sm disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
            >
              <Icon name="cloud_upload" size={20} />
              {contenido.upload}
            </button>
          </div>

          <p className="flex items-start gap-2 p-3 rounded-lg bg-surface-container-low text-body-sm text-secondary">
            <Icon name={finalizado ? 'info' : 'lock'} size={18} className="shrink-0 mt-0.5" />
            {finalizado ? contenido.closedNotice : contenido.subtitle}
          </p>

          {aviso && (
            <p role="status" className="flex items-start gap-2 p-4 rounded-lg bg-primary-container/10 text-body-md text-primary">
              <Icon name="check_circle" size={20} className="shrink-0" />
              {aviso}
            </p>
          )}
          {descargar.isError && <EstadoError mensaje={MENSAJES_ERROR_API[descargar.error.tipo]} />}

          <FiltroPestanas
            ariaLabel={filters.ariaLabel}
            opciones={filters.options}
            valor={filtros.estado}
            totales={datos.totalesPorEstado}
            onCambiar={(estado) => cambiar({ estado })}
          />
          <div className="flex flex-col md:flex-row gap-3">
            <BuscadorListado
              key={filtros.busqueda}
              id="documentos-busqueda"
              label={filters.searchLabel}
              placeholder={filters.searchPlaceholder}
              valorInicial={filtros.busqueda}
              onBuscar={(busqueda) => cambiar({ busqueda })}
            />
            <div className="relative md:w-72">
              <label htmlFor="documentos-categoria" className="sr-only">
                {filters.categoryLabel}
              </label>
              <select
                id="documentos-categoria"
                value={filtros.categoria ?? ''}
                onChange={(evento) => {
                  const valor = evento.target.value
                  cambiar({ categoria: esCategoriaDocumento(valor) ? valor : null })
                }}
                className="w-full h-11 pl-3 pr-10 appearance-none rounded-lg bg-surface-container-lowest shadow-sm text-body-md text-on-surface cursor-pointer focus:outline-none focus:ring-2 focus:ring-primary-container"
              >
                <option value="">{filters.categoryAll}</option>
                {Object.entries(categoriasDocumento).map(([valor, etiqueta]) => (
                  <option key={valor} value={valor}>
                    {etiqueta}
                  </option>
                ))}
              </select>
              <Icon name="expand_more" size={20} className="absolute right-3 top-1/2 -translate-y-1/2 text-secondary pointer-events-none" />
            </div>
            {hayFiltros && (
              <button
                type="button"
                onClick={() => setParametros({})}
                className="inline-flex h-11 px-4 items-center justify-center gap-1.5 rounded-lg text-label-md text-secondary hover:bg-surface-container hover:text-on-surface transition-colors cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
              >
                <Icon name="filter_alt_off" size={18} />
                {filters.clear}
              </button>
            )}
          </div>

          {datos.documentos.length === 0 ? (
            <div className="rounded-xl bg-surface-container-lowest shadow-sm">
              <EstadoVacio icon="folder_open" titulo={contenido.empty.title} descripcion={contenido.empty.description} />
            </div>
          ) : (
            <div className={`transition-opacity ${listado.isPlaceholderData ? 'opacity-60' : ''}`} aria-busy={listado.isFetching}>
              <TablaDocumentos
                documentos={datos.documentos}
                descargandoId={descargar.isPending ? (descargar.variables ?? null) : null}
                onVer={setVista}
                onDescargar={alDescargar}
                onRevisar={(documento) => {
                  setAviso(null)
                  setRevision(documento)
                }}
              />
            </div>
          )}
        </>
      )}

      <DialogoVistaPrevia expedienteId={expedienteId} documento={vista} onCerrar={() => setVista(null)} />
      <DialogoCargaDocumento
        expedienteId={expedienteId}
        abierto={cargando}
        onCerrar={() => setCargando(false)}
        onGuardado={() => {
          setCargando(false)
          setAviso(contenido.uploadDialog.done)
        }}
      />
      <DialogoRevisionDocumento
        expedienteId={expedienteId}
        documento={revision}
        onCerrar={() => setRevision(null)}
        onGuardado={() => {
          setRevision(null)
          setAviso(contenido.reviewDialog.done)
        }}
      />
    </div>
  )
}
