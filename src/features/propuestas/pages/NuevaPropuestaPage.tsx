import { Link, useLocation, useParams } from 'react-router-dom'
import { ROUTES } from '@/app/routes'
import { MENSAJES_ERROR_API } from '@/api/errores'
import { EstadoCarga } from '@/components/ui/EstadoCarga'
import { EstadoError } from '@/components/ui/EstadoError'
import { Icon } from '@/components/ui/Icon'
import { useOpcionesClientes } from '@/features/clientes/hooks/useOpcionesClientes'
import type { EstadoNuevaPropuesta } from '@/features/solicitudes/types/solicitudes.types'
import { FormularioPropuesta } from '../components/FormularioPropuesta'
import { nuevaPropuestaContent } from '../content/nueva-propuesta.content'
import { useDetallePropuesta } from '../hooks/usePropuestas'
import type { PropuestaFormValues } from '../schemas/propuesta.schema'
import type { PropuestaDetalle } from '../types/propuestas.types'

function esEstadoNuevaPropuesta(valor: unknown): valor is EstadoNuevaPropuesta {
  if (typeof valor !== 'object' || valor === null) return false
  const v = valor as Record<string, unknown>
  return typeof v.solicitudId === 'string' && typeof v.clienteId === 'string'
}

const VACIO: PropuestaFormValues = {
  clienteId: '', solicitudId: '', servicio: '', descripcion: '', alcance: '', honorarios: '',
  conceptos: [], condiciones: '', tiempoEstimado: '', fechaVigencia: '',
}

function desdeDetalle(p: PropuestaDetalle): PropuestaFormValues {
  return {
    clienteId: p.cliente.id,
    solicitudId: p.solicitud?.id ?? '',
    servicio: p.servicio,
    descripcion: p.descripcion,
    alcance: p.alcance,
    honorarios: String(p.importe),
    conceptos: p.conceptos.map((c) => ({ concepto: c.concepto, importe: String(c.importe) })),
    condiciones: p.condiciones,
    tiempoEstimado: p.tiempoEstimado,
    fechaVigencia: p.fechaVigencia,
  }
}

/**
 * D1: crear propuesta (desde C2 con cliente y solicitud precargados, o desde cero)
 * y editar borradores (`/propuestas/:id/editar`). Enviar → D2.
 */
export function NuevaPropuestaPage() {
  const { propuestaId = '' } = useParams()
  const { state } = useLocation()
  const contenido = nuevaPropuestaContent
  const clientes = useOpcionesClientes()
  const detalle = useDetallePropuesta(propuestaId)
  const editando = propuestaId !== ''

  const valoresIniciales: PropuestaFormValues | null = editando
    ? detalle.data
      ? desdeDetalle(detalle.data)
      : null
    : esEstadoNuevaPropuesta(state)
      ? { ...VACIO, clienteId: state.clienteId, solicitudId: state.solicitudId }
      : VACIO

  const error = clientes.error ?? detalle.error

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
        <h1 className="text-headline-lg text-on-surface tracking-tight">{editando ? contenido.editTitle : contenido.title}</h1>
        <p className="mt-1 text-body-md text-on-surface-variant">{contenido.subtitle}</p>
      </div>

      {(clientes.isPending || (editando && detalle.isPending)) && (
        <EstadoCarga texto={editando ? contenido.loadingProposal : contenido.loadingClients} />
      )}

      {error && <EstadoError mensaje={MENSAJES_ERROR_API[error.tipo]} />}

      {editando && detalle.data && detalle.data.estado !== 'borrador' ? (
        <EstadoError mensaje={contenido.notEditable} />
      ) : (
        clientes.data &&
        valoresIniciales && (
          <FormularioPropuesta
            key={propuestaId || 'nueva'}
            propuestaId={editando ? propuestaId : null}
            valoresIniciales={valoresIniciales}
            solicitudInicial={
              detalle.data?.solicitud
                ? { valor: detalle.data.solicitud.id, etiqueta: `${detalle.data.solicitud.folio} · ${detalle.data.solicitud.asunto}` }
                : null
            }
            clientes={clientes.data}
          />
        )
      )}
    </div>
  )
}
