import { Icon } from '@/components/ui/Icon'
import { formatearTamano } from '@/lib/archivos'
import { formatearHora } from '@/lib/fechas'
import { chatContent } from '../content/chat.content'
import type { Mensaje } from '../types/chat.types'

interface BurbujaMensajeProps {
  mensaje: Mensaje
  nombreCliente: string
  descargando: boolean
  onDescargar: (adjuntoId: string, nombre: string) => void
}

export function BurbujaMensaje({ mensaje, nombreCliente, descargando, onDescargar }: BurbujaMensajeProps) {
  const { thread } = chatContent
  const propio = mensaje.autor === 'abogado'

  return (
    <li className={`flex flex-col gap-1 max-w-[85%] sm:max-w-[70%] ${propio ? 'self-end items-end' : 'self-start items-start'}`}>
      <span className="text-[11px] text-secondary">
        {propio ? thread.you : nombreCliente} · <time dateTime={mensaje.fecha}>{formatearHora(mensaje.fecha)}</time>
      </span>
      <div
        className={`px-4 py-3 rounded-2xl flex flex-col gap-2 ${
          propio ? 'bg-primary-container text-on-primary-container rounded-br-md' : 'bg-surface-container-lowest text-on-surface shadow-sm rounded-bl-md'
        }`}
      >
        {mensaje.texto && <p className="text-body-md whitespace-pre-line break-words">{mensaje.texto}</p>}
        {mensaje.adjunto && (
          <div className={`flex items-center gap-3 p-2 rounded-lg ${propio ? 'bg-white/15' : 'bg-surface-container-low'}`}>
            <Icon name="description" size={22} />
            <span className="min-w-0">
              <span className="block text-label-md font-semibold truncate max-w-48 sm:max-w-64">{mensaje.adjunto.nombre}</span>
              <span className={`block text-[11px] ${propio ? 'text-on-primary-container/80' : 'text-secondary'}`}>{formatearTamano(mensaje.adjunto.tamanoBytes)}</span>
            </span>
            <button
              type="button"
              disabled={descargando}
              onClick={() => mensaje.adjunto && onDescargar(mensaje.adjunto.id, mensaje.adjunto.nombre)}
              aria-label={`${thread.download}: ${mensaje.adjunto.nombre}`}
              className={`shrink-0 w-9 h-9 rounded-lg inline-flex items-center justify-center cursor-pointer disabled:cursor-wait disabled:opacity-60 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary ${
                propio ? 'hover:bg-white/20' : 'hover:bg-surface-container'
              }`}
            >
              <Icon name={descargando ? 'hourglass_top' : 'download'} size={20} />
            </button>
          </div>
        )}
      </div>
      {propio && (
        <span className="inline-flex items-center gap-1 text-[11px] text-secondary">
          <Icon name={mensaje.leido ? 'done_all' : 'done'} size={14} className={mensaje.leido ? 'text-primary' : ''} />
          {mensaje.leido ? thread.read : thread.sent}
        </span>
      )}
    </li>
  )
}
