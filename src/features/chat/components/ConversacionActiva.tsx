import { useEffect, useRef } from 'react'
import { generatePath, Link, useNavigate } from 'react-router-dom'
import { ROUTES } from '@/app/routes'
import { MENSAJES_ERROR_API } from '@/api/errores'
import { Avatar } from '@/components/ui/Avatar'
import { EstadoCarga } from '@/components/ui/EstadoCarga'
import { EstadoError } from '@/components/ui/EstadoError'
import { Icon } from '@/components/ui/Icon'
import { useReunionInmediata } from '@/features/agenda/hooks/useAgenda'
import { descargarUrl } from '@/lib/archivos'
import { formatearFechaLarga } from '@/lib/fechas'
import { chatContent } from '../content/chat.content'
import { useDescargarAdjunto, useMarcarLeida, useMensajes } from '../hooks/useChat'
import type { Mensaje } from '../types/chat.types'
import { BurbujaMensaje } from './BurbujaMensaje'
import { CampoMensaje } from './CampoMensaje'

interface ConversacionActivaProps {
  conversacionId: string
  onVolver: () => void
}

const accion =
  'inline-flex h-10 px-3 items-center gap-1.5 rounded-lg text-label-md font-semibold transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary'

function agruparPorDia(mensajes: Mensaje[]): { dia: string; mensajes: Mensaje[] }[] {
  const grupos: { dia: string; mensajes: Mensaje[] }[] = []
  for (const mensaje of mensajes) {
    const dia = formatearFechaLarga(new Date(mensaje.fecha))
    const ultimo = grupos.at(-1)
    if (ultimo?.dia === dia) ultimo.mensajes.push(mensaje)
    else grupos.push({ dia, mensajes: [mensaje] })
  }
  return grupos
}

/** Historial de mensajes, cliente (→ F2), expediente (→ E2) y videollamada (→ G1A). */
export function ConversacionActiva({ conversacionId, onVolver }: ConversacionActivaProps) {
  const { thread, errors } = chatContent
  const navigate = useNavigate()
  const mensajes = useMensajes(conversacionId)
  const marcarLeida = useMarcarLeida()
  const descargar = useDescargarAdjunto(conversacionId)
  const videollamada = useReunionInmediata()
  const final = useRef<HTMLDivElement>(null)
  const datos = mensajes.data
  const totalMensajes = datos?.mensajes.length ?? 0
  const noLeidos = datos?.conversacion.noLeidos ?? 0
  const { mutate: marcar } = marcarLeida
  // Evita repetir la petición mientras llega la lista actualizada.
  const marcadoCon = useRef(-1)

  // Al abrir la conversación (o al llegar mensajes nuevos) se marcan como leídos.
  useEffect(() => {
    if (noLeidos > 0 && marcadoCon.current !== totalMensajes) {
      marcadoCon.current = totalMensajes
      marcar(conversacionId)
    }
  }, [noLeidos, totalMensajes, marcar, conversacionId])

  useEffect(() => {
    final.current?.scrollIntoView({ block: 'end' })
  }, [totalMensajes, conversacionId])

  if (mensajes.isPending) return <EstadoCarga texto={thread.loading} />
  if (mensajes.isError) {
    const tipo = mensajes.error.tipo
    return (
      <div className="p-6">
        <EstadoError mensaje={tipo === 'sin_permiso' || tipo === 'no_encontrado' ? errors[tipo] : MENSAJES_ERROR_API[tipo]} />
      </div>
    )
  }

  const { conversacion } = mensajes.data
  const iniciarVideollamada = () => {
    videollamada.mutate(
      { clienteId: conversacion.cliente.id, expedienteId: conversacion.expediente?.id ?? null },
      {
        onSuccess: ({ id }) =>
          navigate(`${generatePath(ROUTES.videoRoom, { reunionId: id })}?${new URLSearchParams({ origen: 'chat', conversacion: conversacionId }).toString()}`),
      },
    )
  }

  return (
    <div className="flex flex-col h-full min-h-0">
      <header className="flex flex-wrap items-center gap-3 p-4 border-b border-surface-container">
        <button
          type="button"
          onClick={onVolver}
          aria-label={thread.back}
          className="lg:hidden w-9 h-9 rounded-lg inline-flex items-center justify-center text-secondary hover:bg-surface-container cursor-pointer"
        >
          <Icon name="arrow_back" size={20} />
        </button>
        <Avatar nombre={conversacion.cliente.nombre} />
        <div className="flex-1 min-w-0">
          <p className="text-label-lg text-on-surface font-semibold truncate">{conversacion.cliente.nombre}</p>
          <p className="text-body-sm text-secondary truncate">
            {conversacion.expediente ? `${conversacion.expediente.folio} · ${conversacion.expediente.asunto}` : thread.general}
          </p>
        </div>
        <div className="flex flex-wrap gap-1">
          {conversacion.cliente.enDirectorio && (
            <Link to={generatePath(ROUTES.clientDetail, { clienteId: conversacion.cliente.id })} className={`${accion} text-on-surface hover:bg-surface-container`}>
              <Icon name="person" size={18} />
              <span className="hidden xl:inline">{thread.viewClient}</span>
            </Link>
          )}
          {conversacion.expediente && (
            <Link to={generatePath(ROUTES.caseDetail, { expedienteId: conversacion.expediente.id })} className={`${accion} text-on-surface hover:bg-surface-container`}>
              <Icon name="folder_managed" size={18} />
              <span className="hidden xl:inline">{thread.viewCase}</span>
            </Link>
          )}
          <button
            type="button"
            onClick={iniciarVideollamada}
            disabled={videollamada.isPending}
            className={`${accion} bg-primary-container/10 text-primary hover:bg-primary-container/20 disabled:opacity-60 cursor-pointer`}
          >
            <Icon name="videocam" size={18} />
            {videollamada.isPending ? thread.starting : thread.videoCall}
          </button>
        </div>
      </header>
      {videollamada.isError && (
        <div className="px-4 pt-3">
          <EstadoError mensaje={videollamada.error.tipo === 'conflicto' ? errors.conflicto : MENSAJES_ERROR_API[videollamada.error.tipo]} />
        </div>
      )}

      <div className="flex-1 min-h-0 overflow-y-auto p-4 bg-surface-container-low/50" aria-live="polite" aria-relevant="additions">
        {totalMensajes === 0 ? (
          <p className="py-10 text-center text-body-md text-secondary">{thread.empty}</p>
        ) : (
          agruparPorDia(mensajes.data.mensajes).map((grupo) => (
            <section key={grupo.dia} aria-label={grupo.dia} className="flex flex-col gap-3 mb-4">
              <p className="self-center px-3 py-1 rounded-full bg-surface-container text-[11px] text-secondary capitalize">{grupo.dia}</p>
              <ul className="flex flex-col gap-3">
                {grupo.mensajes.map((mensaje) => (
                  <BurbujaMensaje
                    key={mensaje.id}
                    mensaje={mensaje}
                    nombreCliente={conversacion.cliente.nombre}
                    descargando={descargar.isPending && descargar.variables === mensaje.adjunto?.id}
                    onDescargar={(adjuntoId, nombre) => descargar.mutate(adjuntoId, { onSuccess: ({ url }) => descargarUrl(url, nombre) })}
                  />
                ))}
              </ul>
            </section>
          ))
        )}
        <div ref={final} />
      </div>
      {descargar.isError && (
        <div className="px-4 pb-2">
          <EstadoError mensaje={MENSAJES_ERROR_API[descargar.error.tipo]} />
        </div>
      )}
      <p className="flex items-center gap-1.5 px-4 py-1.5 text-[11px] text-secondary bg-surface-container-lowest">
        <Icon name="lock" size={14} />
        {thread.protected}
      </p>
      <CampoMensaje key={conversacionId} conversacionId={conversacionId} />
    </div>
  )
}
