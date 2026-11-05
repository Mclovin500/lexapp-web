import { generatePath, Link } from 'react-router-dom'
import { ROUTES } from '@/app/routes'
import { Avatar } from '@/components/ui/Avatar'
import { Icon } from '@/components/ui/Icon'
import { tiposPersona } from '@/features/solicitudes/content/solicitudes.content'
import { detalleExpedienteContent } from '../content/detalle-expediente.content'
import type { ExpedienteDetalle } from '../types/expedientes.types'

const enlace =
  'inline-flex h-9 px-3 items-center justify-center gap-1.5 rounded-lg text-label-md font-semibold transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary'

/** Información del cliente en E2 (Cliente → F2, Chat → H1). */
export function TarjetaClienteExpediente({ expediente }: { expediente: ExpedienteDetalle }) {
  const { client } = detalleExpedienteContent
  const { cliente } = expediente

  return (
    <section aria-labelledby="expediente-cliente" className="p-6 rounded-xl bg-surface-container-lowest shadow-sm flex flex-col gap-4">
      <h2 id="expediente-cliente" className="text-headline-sm text-on-surface">
        {client.title}
      </h2>
      <div className="flex items-center gap-3">
        <Avatar nombre={cliente.nombre} />
        <div className="min-w-0">
          <p className="text-label-lg text-on-surface font-semibold">{cliente.nombre}</p>
          <p className="text-body-sm text-secondary">{cliente.organizacion ?? tiposPersona[cliente.tipoPersona]}</p>
        </div>
      </div>
      <dl className="flex flex-col gap-2 text-body-md">
        <div className="flex items-center gap-2 min-w-0">
          <dt className="sr-only">{client.email}</dt>
          <Icon name="mail" size={18} className="text-secondary shrink-0" />
          <dd className="min-w-0 truncate">
            <a href={`mailto:${cliente.correo}`} className="text-primary hover:underline">
              {cliente.correo}
            </a>
          </dd>
        </div>
        {cliente.telefono && (
          <div className="flex items-center gap-2">
            <dt className="sr-only">{client.phone}</dt>
            <Icon name="call" size={18} className="text-secondary shrink-0" />
            <dd>
              <a href={`tel:${cliente.telefono.replace(/\s/g, '')}`} className="text-on-surface hover:underline tabular-nums">
                {cliente.telefono}
              </a>
            </dd>
          </div>
        )}
      </dl>
      <div className="grid grid-cols-2 gap-2">
        <Link to={generatePath(ROUTES.clientDetail, { clienteId: cliente.id })} className={`${enlace} bg-surface-container text-on-surface hover:bg-surface-container-high`}>
          <Icon name="person" size={18} />
          {client.view}
        </Link>
        <Link
          to={ROUTES.chat}
          state={{ clienteId: cliente.id, expedienteId: expediente.id }}
          className={`${enlace} bg-primary-container/10 text-primary hover:bg-primary-container/20`}
        >
          <Icon name="chat" size={18} />
          {client.chat}
        </Link>
      </div>
    </section>
  )
}
