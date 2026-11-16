import { Icon } from '@/components/ui/Icon'
import { formatearHora } from '@/lib/fechas'
import { asistenteContent } from '../content/asistente.content'
import type { MensajeAsistente } from '../types/asistente.types'

interface BurbujaAsistenteProps {
  mensaje: MensajeAsistente
  /** Muestra el nombre del emisor; solo se oculta en el primer mensaje seguido del mismo autor. */
  mostrarAutor?: boolean
}

/** Burbuja de una conversación con el asistente. */
export function BurbujaAsistente({ mensaje, mostrarAutor = true }: BurbujaAsistenteProps) {
  const esAsistente = mensaje.autor === 'asistente'

  return (
    <li
      className={`flex flex-col gap-1 max-w-[88%] ${esAsistente ? 'self-start items-start' : 'self-end items-end'}`}
    >
      {mostrarAutor && (
        <span className="flex items-center gap-1.5 text-[11px] text-secondary">
          {esAsistente && <Icon name="smart_toy" size={14} className="text-primary" />}
          {esAsistente ? asistenteContent.label : 'Tú'} ·{' '}
          <time dateTime={mensaje.fecha}>{formatearHora(mensaje.fecha)}</time>
        </span>
      )}
      <div
        className={`px-4 py-3 rounded-2xl flex flex-col gap-2 ${
          esAsistente
            ? 'bg-surface-container-lowest text-on-surface shadow-sm rounded-bl-md'
            : 'bg-primary-container text-on-primary-container rounded-br-md'
        }`}
      >
        <p className="text-body-md whitespace-pre-line break-words">{mensaje.texto}</p>
        {mensaje.accion && (
          <a
            href={mensaje.accion.ruta}
            className="inline-flex items-center gap-1.5 self-start px-3 py-1.5 rounded-lg bg-surface-container-low text-label-md font-semibold text-primary hover:bg-surface-container transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
          >
            <Icon name="arrow_forward" size={16} />
            {mensaje.accion.etiqueta}
          </a>
        )}
      </div>
    </li>
  )
}
