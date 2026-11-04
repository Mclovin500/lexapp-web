import { Icon } from '@/components/ui/Icon'
import { validacionProfesionalContent } from '../../content/validacion-profesional.content'
import type { EstadoValidacion } from '../../types/sesion.types'

interface TarjetaEstadoValidacionProps {
  estado: EstadoValidacion
  motivo?: string | null
}

const tonos: Record<EstadoValidacion, { caja: string; icono: string; insignia: string }> = {
  pendiente: {
    caja: 'bg-surface-container-low',
    icono: 'bg-secondary-container text-on-secondary-container',
    insignia: 'bg-secondary-container text-on-secondary-container',
  },
  validado: {
    caja: 'bg-primary-container/10',
    icono: 'bg-primary-container text-on-primary',
    insignia: 'bg-primary/10 text-primary',
  },
  requiere_correccion: {
    caja: 'bg-tertiary-fixed/30',
    icono: 'bg-tertiary-container text-on-tertiary-container',
    insignia: 'bg-tertiary/10 text-tertiary',
  },
  rechazado: {
    caja: 'bg-error-container/40',
    icono: 'bg-error-container text-on-error-container',
    insignia: 'bg-error/10 text-error',
  },
}

/** Estado real devuelto por el backend, con su mensaje y el motivo (las acciones viven en AccionesValidacion). */
export function TarjetaEstadoValidacion({ estado, motivo }: TarjetaEstadoValidacionProps) {
  const { states, reasonLabel } = validacionProfesionalContent
  const texto = states[estado]
  const tono = tonos[estado]

  return (
    <section aria-labelledby="estado-validacion-titulo" className={`rounded-xl p-6 ${tono.caja}`}>
      <div className="flex items-start gap-4">
        <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${tono.icono}`}>
          <Icon name={texto.icon} size={26} filled={estado === 'validado'} />
        </div>
        <div className="flex-1 min-w-0">
          <span
            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-label-sm uppercase tracking-wider font-semibold ${tono.insignia}`}
          >
            {texto.badge}
          </span>
          <h2 id="estado-validacion-titulo" className="mt-2 text-headline-md text-on-surface tracking-tight">
            {texto.title}
          </h2>
          <p className="mt-1.5 text-body-md text-on-surface-variant leading-relaxed">{texto.message}</p>
        </div>
      </div>

      {motivo && (estado === 'requiere_correccion' || estado === 'rechazado') && (
        <div className="mt-5 p-4 rounded-lg bg-surface-container-lowest">
          <p className="text-label-sm uppercase tracking-wider text-secondary font-semibold mb-1">{reasonLabel}</p>
          <p className="text-body-md text-on-surface">{motivo}</p>
        </div>
      )}

    </section>
  )
}
