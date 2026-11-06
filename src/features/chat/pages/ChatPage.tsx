import { useEffect, useRef, useState } from 'react'
import { useLocation, useNavigate, useSearchParams } from 'react-router-dom'
import { MENSAJES_ERROR_API } from '@/api/errores'
import { EstadoCarga } from '@/components/ui/EstadoCarga'
import { EstadoError } from '@/components/ui/EstadoError'
import { Icon } from '@/components/ui/Icon'
import { ConversacionActiva } from '../components/ConversacionActiva'
import { DialogoNuevaConversacion } from '../components/DialogoNuevaConversacion'
import { ListaConversaciones } from '../components/ListaConversaciones'
import { chatContent } from '../content/chat.content'
import { useAbrirConversacion } from '../hooks/useChat'
import type { EstadoAbrirCliente, FiltroConversaciones } from '../types/chat.types'

const ID_VALIDO = /^[\w-]{1,40}$/

function esEstadoAbrirCliente(valor: unknown): valor is EstadoAbrirCliente {
  return typeof valor === 'object' && valor !== null && typeof (valor as Record<string, unknown>).clienteId === 'string'
}

/**
 * H1: conversaciones con clientes. `?conversacion=` selecciona una. Desde E2, F2, C2 o D2 llega con
 * `{ clienteId, expedienteId? }` en el estado de navegación y abre (o crea) la conversación.
 */
export function ChatPage() {
  const contenido = chatContent
  const navigate = useNavigate()
  const { state } = useLocation()
  const [parametros, setParametros] = useSearchParams()
  const conversacionParam = parametros.get('conversacion') ?? ''
  const seleccionada = ID_VALIDO.test(conversacionParam) ? conversacionParam : ''
  const filtro: FiltroConversaciones = parametros.get('filtro') === 'no_leidas' ? 'no_leidas' : 'todas'
  const busqueda = (parametros.get('q') ?? '').slice(0, 100)
  const abrir = useAbrirConversacion()
  const [nueva, setNueva] = useState(false)
  const solicitada = useRef(false)

  const actualizar = (cambios: { conversacion?: string; filtro?: FiltroConversaciones; busqueda?: string }, reemplazar = false) => {
    const siguiente: Record<string, string> = {}
    const conversacion = cambios.conversacion ?? seleccionada
    const f = cambios.filtro ?? filtro
    const q = cambios.busqueda ?? busqueda
    if (conversacion) siguiente.conversacion = conversacion
    if (f !== 'todas') siguiente.filtro = f
    if (q) siguiente.q = q
    setParametros(siguiente, { replace: reemplazar })
  }

  // Abrir la conversación pedida por otra pantalla (una sola vez) y limpiar el estado de navegación.
  const { mutate: abrirConversacion } = abrir
  useEffect(() => {
    if (!esEstadoAbrirCliente(state) || solicitada.current) return
    solicitada.current = true
    abrirConversacion(
      { clienteId: state.clienteId, ...(state.expedienteId !== undefined ? { expedienteId: state.expedienteId } : {}) },
      { onSuccess: ({ id }) => navigate(`?${new URLSearchParams({ conversacion: id }).toString()}`, { replace: true, state: null }) },
    )
  }, [state, abrirConversacion, navigate])

  return (
    <div className="flex flex-col gap-4 h-[calc(100dvh-8.5rem)] min-h-[34rem]">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3">
        <div>
          <h1 className="text-headline-lg text-on-surface tracking-tight">{contenido.title}</h1>
          <p className="mt-1 text-body-md text-on-surface-variant">{contenido.subtitle}</p>
        </div>
        <button
          type="button"
          onClick={() => setNueva(true)}
          className="inline-flex h-10 px-4 items-center gap-2 self-start sm:self-auto rounded-lg bg-primary-container hover:bg-primary-hover text-on-primary-container hover:text-on-primary text-label-md font-semibold shadow-sm cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
        >
          <Icon name="add_comment" size={18} />
          {contenido.newConversation}
        </button>
      </div>

      {abrir.isPending && <EstadoCarga texto={contenido.thread.loading} />}
      {abrir.isError && (
        <EstadoError mensaje={abrir.error.tipo === 'sin_permiso' ? contenido.errors.sin_permiso : MENSAJES_ERROR_API[abrir.error.tipo]} />
      )}

      <div className="flex-1 min-h-0 grid grid-cols-1 lg:grid-cols-12 gap-4">
        <div className={`lg:col-span-4 min-h-0 p-4 rounded-xl bg-surface-container-lowest shadow-sm ${seleccionada ? 'hidden lg:flex lg:flex-col' : 'flex flex-col'}`}>
          <ListaConversaciones
            filtro={filtro}
            busqueda={busqueda}
            seleccionada={seleccionada}
            onFiltrar={(cambios) => actualizar(cambios, true)}
            onSeleccionar={(id) => actualizar({ conversacion: id })}
          />
        </div>
        <div className={`lg:col-span-8 min-h-0 rounded-xl bg-surface-container-lowest shadow-sm overflow-hidden ${seleccionada ? 'flex flex-col' : 'hidden lg:flex lg:flex-col'}`}>
          {seleccionada ? (
            <ConversacionActiva
              key={seleccionada}
              conversacionId={seleccionada}
              onVolver={() => {
                const siguiente = new URLSearchParams(parametros)
                siguiente.delete('conversacion')
                setParametros(siguiente)
              }}
            />
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center gap-3 p-8 text-center text-secondary">
              <Icon name="forum" size={40} />
              <p className="text-body-md">{contenido.thread.select}</p>
            </div>
          )}
        </div>
      </div>

      <DialogoNuevaConversacion
        abierto={nueva}
        onCerrar={() => setNueva(false)}
        onAbierta={(id) => {
          setNueva(false)
          actualizar({ conversacion: id })
        }}
      />
    </div>
  )
}
