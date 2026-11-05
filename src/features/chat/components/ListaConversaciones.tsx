import { Avatar } from '@/components/ui/Avatar'
import { BuscadorListado } from '@/components/ui/BuscadorListado'
import { EstadoCarga } from '@/components/ui/EstadoCarga'
import { EstadoError } from '@/components/ui/EstadoError'
import { FiltroPestanas } from '@/components/ui/FiltroPestanas'
import { Icon } from '@/components/ui/Icon'
import { MENSAJES_ERROR_API } from '@/api/errores'
import { formatearRelativa } from '@/lib/fechas'
import { chatContent } from '../content/chat.content'
import { useConversaciones } from '../hooks/useChat'
import type { FiltroConversaciones } from '../types/chat.types'

interface ListaConversacionesProps {
  filtro: FiltroConversaciones
  busqueda: string
  seleccionada: string
  onFiltrar: (cambios: { filtro?: FiltroConversaciones; busqueda?: string }) => void
  onSeleccionar: (id: string) => void
}

/** "Lista de conversaciones" de H1: cliente, expediente relacionado, último mensaje y no leídos. */
export function ListaConversaciones({ filtro, busqueda, seleccionada, onFiltrar, onSeleccionar }: ListaConversacionesProps) {
  const { list } = chatContent
  const conversaciones = useConversaciones(filtro, busqueda)
  const datos = conversaciones.data

  return (
    <section aria-label={list.ariaLabel} className="flex flex-col gap-3 min-h-0 h-full">
      <FiltroPestanas ariaLabel={list.filtersLabel} opciones={list.filters} valor={filtro} totales={datos?.totales} onCambiar={(valor) => onFiltrar({ filtro: valor })} />
      <BuscadorListado
        key={busqueda}
        id="chat-busqueda"
        label={list.searchLabel}
        placeholder={list.searchPlaceholder}
        valorInicial={busqueda}
        onBuscar={(valor) => onFiltrar({ busqueda: valor })}
      />
      {conversaciones.isPending && <EstadoCarga texto={list.loading} />}
      {conversaciones.isError && <EstadoError mensaje={MENSAJES_ERROR_API[conversaciones.error.tipo]} onReintentar={() => void conversaciones.refetch()} />}
      {datos &&
        (datos.conversaciones.length === 0 ? (
          <p className="p-4 text-body-md text-secondary">{list.empty}</p>
        ) : (
          <ul className="flex flex-col gap-1 overflow-y-auto min-h-0 -mx-1 px-1">
            {datos.conversaciones.map((c) => {
              const activa = c.id === seleccionada
              return (
                <li key={c.id}>
                  <button
                    type="button"
                    onClick={() => onSeleccionar(c.id)}
                    aria-current={activa ? 'true' : undefined}
                    className={`w-full text-left flex gap-3 p-3 rounded-lg transition-colors cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary ${
                      activa ? 'bg-primary-container/10 ring-1 ring-primary-container/40' : 'hover:bg-surface-container-low'
                    }`}
                  >
                    <Avatar nombre={c.cliente.nombre} />
                    <span className="flex-1 min-w-0">
                      <span className="flex items-baseline justify-between gap-2">
                        <span className={`truncate text-label-lg text-on-surface ${c.noLeidos > 0 ? 'font-bold' : 'font-semibold'}`}>{c.cliente.nombre}</span>
                        {c.ultimoMensaje && <span className="shrink-0 text-[11px] text-secondary">{formatearRelativa(c.ultimoMensaje.fecha)}</span>}
                      </span>
                      <span className="flex items-center gap-1 text-body-sm text-primary truncate">
                        <Icon name={c.expediente ? 'folder_managed' : 'forum'} size={14} />
                        <span className="truncate">{c.expediente?.folio ?? list.general}</span>
                      </span>
                      <span className="flex items-center justify-between gap-2">
                        <span className={`truncate text-body-sm ${c.noLeidos > 0 ? 'text-on-surface' : 'text-secondary'}`}>
                          {c.ultimoMensaje ? `${c.ultimoMensaje.autor === 'abogado' ? list.you : ''}${c.ultimoMensaje.texto}` : ''}
                        </span>
                        {c.noLeidos > 0 && (
                          <span className="shrink-0 min-w-5 h-5 px-1.5 rounded-full bg-primary-container text-on-primary text-[11px] font-bold flex items-center justify-center" aria-label={list.unread(c.noLeidos)}>
                            {c.noLeidos}
                          </span>
                        )}
                      </span>
                    </span>
                  </button>
                </li>
              )
            })}
          </ul>
        ))}
    </section>
  )
}
