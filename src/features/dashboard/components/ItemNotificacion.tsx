import { Link } from 'react-router-dom'
import { Icon } from '@/components/ui/Icon'
import { formatearFechaHora, formatearRelativa } from '@/lib/fechas'
import { notificacionesContent, tiposNotificacion } from '../content/notificaciones.content'
import { rutaDeNotificacion } from '../lib/destino-notificacion'
import type { Notificacion } from '../types/notificaciones.types'

interface ItemNotificacionProps {
  notificacion: Notificacion
  onMarcarLeida: (id: string) => void
  marcando: boolean
}

/** Una notificación: tipo, referencia, fecha y hora, descripción, indicador de no leída y acciones. */
export function ItemNotificacion({ notificacion, onMarcarLeida, marcando }: ItemNotificacionProps) {
  const tipo = tiposNotificacion[notificacion.tipo]
  const noLeida = !notificacion.leida

  return (
    <li
      className={`relative flex flex-col sm:flex-row gap-4 p-4 sm:p-5 rounded-xl transition-colors ${
        noLeida ? 'bg-surface-container-lowest shadow-sm ring-1 ring-primary-container/30' : 'bg-surface-container-low/60'
      }`}
    >
      {noLeida && <span className="absolute left-0 top-4 bottom-4 w-1 rounded-r-full bg-primary-container" aria-hidden="true" />}

      <span
        className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 ${
          noLeida ? 'bg-primary-container/15 text-primary' : 'bg-surface-container text-secondary'
        }`}
      >
        <Icon name={tipo.icon} size={20} />
      </span>

      <div className="flex-1 min-w-0">
        <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
          <p className={`text-label-lg ${noLeida ? 'text-on-surface font-semibold' : 'text-on-surface-variant'}`}>
            {tipo.label}
          </p>
          {noLeida && (
            <span className="inline-flex items-center gap-1 text-[11px] font-bold uppercase tracking-wider text-primary">
              <span className="w-2 h-2 rounded-full bg-primary-container" aria-hidden="true" />
              {notificacionesContent.unread}
            </span>
          )}
          <time dateTime={notificacion.fecha} title={formatearFechaHora(notificacion.fecha)} className="text-body-sm text-secondary">
            {formatearRelativa(notificacion.fecha)} · {formatearFechaHora(notificacion.fecha)}
          </time>
        </div>
        <p className="mt-1 text-body-sm text-secondary font-medium">{notificacion.referencia}</p>
        <p className="mt-1 text-body-md text-on-surface-variant">{notificacion.descripcion}</p>
      </div>

      <div className="flex sm:flex-col items-stretch sm:items-end gap-2 shrink-0">
        <Link
          to={rutaDeNotificacion(notificacion)}
          onClick={() => {
            if (noLeida) onMarcarLeida(notificacion.id)
          }}
          className="inline-flex h-9 px-3 items-center justify-center gap-1.5 rounded-lg bg-primary-container hover:bg-primary text-on-primary text-label-md font-semibold transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
        >
          {tipo.accion}
          <Icon name="arrow_forward" size={16} />
        </Link>
        {noLeida && (
          <button
            type="button"
            onClick={() => onMarcarLeida(notificacion.id)}
            disabled={marcando}
            className="inline-flex h-9 px-3 items-center justify-center gap-1.5 rounded-lg text-label-md text-secondary hover:bg-surface-container hover:text-on-surface transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
          >
            <Icon name="done" size={16} />
            {notificacionesContent.markRead}
          </button>
        )}
      </div>
    </li>
  )
}
