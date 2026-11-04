import { Avatar } from '@/components/ui/Avatar'
import { Icon } from '@/components/ui/Icon'
import { detalleSolicitudContent } from '../content/detalle-solicitud.content'
import { tiposPersona } from '../content/solicitudes.content'
import type { SolicitudDetalle } from '../types/solicitudes.types'

export function TarjetaClienteSolicitud({ cliente }: { cliente: SolicitudDetalle['cliente'] }) {
  const { client } = detalleSolicitudContent
  const datos = [
    { icon: 'mail', label: client.email, valor: cliente.correo },
    { icon: 'call', label: client.phone, valor: cliente.telefono },
  ]

  return (
    <section aria-labelledby="solicitud-cliente" className="rounded-xl bg-surface-container-lowest shadow-sm p-6">
      <h2 id="solicitud-cliente" className="text-headline-sm text-on-surface mb-4">
        {client.title}
      </h2>
      <div className="flex items-start gap-4">
        <Avatar nombre={cliente.nombre} size="lg" />
        <div className="min-w-0">
          <p className="text-headline-sm text-on-surface">{cliente.nombre}</p>
          <p className="text-body-sm text-secondary">
            {tiposPersona[cliente.tipoPersona]}
            {cliente.organizacion && ` · ${cliente.organizacion}`}
          </p>
        </div>
      </div>
      <dl className="mt-5 grid grid-cols-1 sm:grid-cols-2 gap-3">
        {datos.map((dato) => (
          <div key={dato.label} className="flex items-center gap-3 p-3 rounded-lg bg-surface-container-low">
            <Icon name={dato.icon} size={18} className="text-secondary shrink-0" />
            <div className="min-w-0">
              <dt className="text-[11px] uppercase tracking-wider text-secondary">{dato.label}</dt>
              <dd className="text-body-md text-on-surface break-all">{dato.valor ?? client.notProvided}</dd>
            </div>
          </div>
        ))}
      </dl>
    </section>
  )
}
