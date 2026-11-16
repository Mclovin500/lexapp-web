import { Link, useLocation } from 'react-router-dom'
import { ROUTES } from '@/app/routes'
import { MENSAJES_ERROR_API } from '@/api/errores'
import { EstadoCarga } from '@/components/ui/EstadoCarga'
import { EstadoError } from '@/components/ui/EstadoError'
import { EstadoVacio } from '@/components/ui/EstadoVacio'
import { Icon } from '@/components/ui/Icon'
import { useClientesConSolicitud } from '@/features/solicitudes/hooks/useSolicitudes'
import type { EstadoNuevaPropuesta } from '@/features/solicitudes/types/solicitudes.types'
import { FormularioPropuesta } from '../components/FormularioPropuesta'
import { nuevaPropuestaContent } from '../content/nueva-propuesta.content'
import type { PropuestaFormValues } from '../schemas/propuesta.schema'

function esEstadoNuevaPropuesta(valor: unknown): valor is EstadoNuevaPropuesta {
  if (typeof valor !== 'object' || valor === null) return false
  const v = valor as Record<string, unknown>
  return typeof v.solicitudId === 'string' && typeof v.clienteId === 'string'
}

const VACIO: PropuestaFormValues = {
  clienteId: '', solicitudId: '', servicio: '', descripcion: '', alcance: '', honorarios: '',
  conceptos: [], condiciones: '', tiempoEstimado: '', fechaVigencia: '',
}

/**
 * D1: crear y enviar una propuesta en respuesta a una solicitud pendiente
 * (desde C2 con cliente y solicitud precargados, o eligiéndolos aquí). Enviar → D2.
 */
export function NuevaPropuestaPage() {
  const { state } = useLocation()
  const contenido = nuevaPropuestaContent
  const clientes = useClientesConSolicitud()

  const valoresIniciales: PropuestaFormValues = esEstadoNuevaPropuesta(state)
    ? { ...VACIO, clienteId: state.clienteId, solicitudId: state.solicitudId }
    : VACIO

  return (
    <div className="flex flex-col gap-6">
      <Link
        to={ROUTES.proposals}
        className="inline-flex items-center gap-1.5 self-start text-label-md text-secondary hover:text-on-surface rounded focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
      >
        <Icon name="arrow_back" size={18} />
        {contenido.back}
      </Link>
      <div>
        <h1 className="text-headline-lg text-on-surface tracking-tight">{contenido.title}</h1>
        <p className="mt-1 text-body-md text-on-surface-variant">{contenido.subtitle}</p>
      </div>

      {clientes.isPending && <EstadoCarga texto={contenido.loadingClients} />}

      {clientes.isError && <EstadoError mensaje={MENSAJES_ERROR_API[clientes.error.tipo]} onReintentar={() => void clientes.refetch()} />}

      {clientes.data &&
        (clientes.data.length === 0 ? (
          <div className="rounded-xl bg-surface-container-lowest shadow-sm">
            <EstadoVacio icon="inbox" titulo={contenido.noClients} />
          </div>
        ) : (
          <FormularioPropuesta valoresIniciales={valoresIniciales} clientes={clientes.data} />
        ))}
    </div>
  )
}
