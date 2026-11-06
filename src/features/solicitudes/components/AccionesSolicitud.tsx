import { Link, useNavigate } from 'react-router-dom'
import { ROUTES } from '@/app/routes'
import { MENSAJES_ERROR_API } from '@/api/errores'
import { EstadoError } from '@/components/ui/EstadoError'
import { Icon } from '@/components/ui/Icon'
import { detalleSolicitudContent } from '../content/detalle-solicitud.content'
import { useRevisarSolicitud } from '../hooks/useSolicitudes'
import type { EstadoNuevaPropuesta, SolicitudDetalle } from '../types/solicitudes.types'

interface AccionesSolicitudProps {
  solicitud: SolicitudDetalle
  onRechazar: () => void
  /** Lleva el foco a la sección de información proporcionada por el cliente. */
  onIrAInformacion: () => void
}

const base =
  'w-full inline-flex h-11 px-4 items-center justify-center gap-2 rounded-lg text-label-lg font-semibold transition-colors cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary'

/**
 * Acciones de C2 (especificación): Crear propuesta (→ D1), Revisar información y
 * Rechazar solicitud "cuando corresponda". "Abrir conversación" (→ H1) viene del prompt de Stitch.
 */
export function AccionesSolicitud({ solicitud, onRechazar, onIrAInformacion }: AccionesSolicitudProps) {
  const navigate = useNavigate()
  const { actions } = detalleSolicitudContent
  const revisar = useRevisarSolicitud(solicitud.id)
  const abierta = solicitud.estado === 'nueva' || solicitud.estado === 'en_revision'

  const crearPropuesta = () => {
    const estado: EstadoNuevaPropuesta = { solicitudId: solicitud.id, clienteId: solicitud.cliente.id }
    navigate(ROUTES.newProposal, { state: estado })
  }

  const revisarInformacion = () => {
    if (solicitud.estado !== 'nueva') {
      onIrAInformacion()
      return
    }
    revisar.mutate(undefined, { onSuccess: onIrAInformacion })
  }

  return (
    <section aria-labelledby="solicitud-acciones" className="rounded-xl bg-surface-container-lowest shadow-sm p-6 flex flex-col gap-3">
      <h2 id="solicitud-acciones" className="text-headline-sm text-on-surface">
        {actions.title}
      </h2>

      {abierta && (
        <button type="button" onClick={crearPropuesta} className={`${base} bg-primary-container hover:bg-primary-hover text-on-primary-container hover:text-on-primary shadow-md`}>
          <Icon name="post_add" size={20} />
          {actions.createProposal}
        </button>
      )}

      <button
        type="button"
        onClick={revisarInformacion}
        disabled={revisar.isPending}
        className={`${base} bg-surface-container text-on-surface hover:bg-surface-container-high`}
      >
        <Icon name="fact_check" size={20} />
        {revisar.isPending ? actions.reviewing : actions.review}
      </button>

      <Link to={ROUTES.chat} state={{ clienteId: solicitud.cliente.id }} className={`${base} bg-surface-container text-on-surface hover:bg-surface-container-high`}>
        <Icon name="forum" size={20} />
        {actions.conversation}
      </Link>

      {abierta && (
        <button
          type="button"
          onClick={onRechazar}
          className={`${base} text-error hover:bg-error-container/50 focus-visible:outline-error`}
        >
          <Icon name="block" size={20} />
          {actions.reject}
        </button>
      )}

      {revisar.isError && <EstadoError mensaje={MENSAJES_ERROR_API[revisar.error.tipo]} />}
    </section>
  )
}
