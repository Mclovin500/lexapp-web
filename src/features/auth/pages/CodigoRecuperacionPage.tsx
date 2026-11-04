import { Link, Navigate, useLocation, useNavigate } from 'react-router-dom'
import { ROUTES } from '@/app/routes'
import { Icon } from '@/components/ui/Icon'
import { FormularioCodigo } from '../components/compartidos/FormularioCodigo'
import { EtiquetaPaso } from '../components/compartidos/EtiquetaPaso'
import { NotaVigencia } from '../components/compartidos/NotaVigencia'
import { TarjetaAcceso } from '../components/compartidos/TarjetaAcceso'
import { MarcoAcceso } from '../components/MarcoAcceso'
import { codigoRecuperacionContent } from '../content/codigo-recuperacion.content'
import { recuperacionContent } from '../content/recuperacion.content'
import {
  useReenviarCodigoRecuperacion,
  useVerificarCodigoRecuperacion,
} from '../hooks/useRecuperacion'
import { esEstadoCodigoRecuperacion } from '../lib/estado-navegacion'
import { mensajePorTipo } from '../lib/mapear-error'
import type { ErrorAutenticacion } from '../types/auth.types'
import type {
  EstadoCodigoRecuperacion,
  EstadoNuevaContrasena,
} from '../types/estado-navegacion.types'

/** A2C: valida el código de recuperación. Correcto → A2D con el token en memoria. */
export function CodigoRecuperacionPage() {
  const { state } = useLocation()

  if (!esEstadoCodigoRecuperacion(state)) {
    return <Navigate to={ROUTES.recoverPassword} replace />
  }

  return <CodigoRecuperacion {...state} />
}

function CodigoRecuperacion({
  correo,
  correoEnmascarado,
  reenviarEnSegundos,
  expiraEnSegundos,
}: EstadoCodigoRecuperacion) {
  const navigate = useNavigate()
  const contenido = codigoRecuperacionContent
  const verificacion = useVerificarCodigoRecuperacion()
  const reenvio = useReenviarCodigoRecuperacion()

  const error: ErrorAutenticacion | null = reenvio.error ?? verificacion.error
  const vigencia = reenvio.data?.expiraEnSegundos ?? expiraEnSegundos

  const verificar = async (codigo: string) => {
    reenvio.reset()
    const { tokenRestablecimiento } = await verificacion.mutateAsync({ correo, codigo })
    const estado: EstadoNuevaContrasena = { tokenRestablecimiento }
    // `replace`: el código es de un solo uso, no tiene sentido volver a esta pantalla.
    navigate(ROUTES.newPassword, { replace: true, state: estado })
  }

  const reenviar = async () => {
    verificacion.reset()
    const respuesta = await reenvio.mutateAsync({ correo })
    return respuesta.reenviarEnSegundos
  }

  return (
    <MarcoAcceso regreso={{ to: ROUTES.recoverPassword, label: contenido.back }}>
      <TarjetaAcceso
        icon="mark_email_read"
        title={contenido.title}
        description={<p>{contenido.description}</p>}
        ribbon={
          <div className="flex flex-wrap items-center justify-between gap-2">
            <EtiquetaPaso icon="verified_user" label={recuperacionContent.steps.code} />
            <span className="text-label-sm text-outline">{contenido.operationId}</span>
          </div>
        }
      >
        <div className="mb-8 flex flex-col items-center gap-4">
          <div className="w-full bg-surface-container-low rounded-lg px-4 py-3 flex items-center gap-3">
            <Icon name="alternate_email" size={20} className="text-secondary" />
            <div className="flex flex-col text-left min-w-0">
              <span className="text-label-sm text-secondary">{contenido.destinationLabel}</span>
              <span className="text-label-lg text-on-surface break-all">{correoEnmascarado}</span>
            </div>
          </div>
          <NotaVigencia expiraEnSegundos={vigencia} />
        </div>

        <FormularioCodigo
          etiqueta={contenido.codeLabel}
          textoBoton={contenido.submitButton}
          onVerificar={verificar}
          onReenviar={reenviar}
          segundosInicialesReenvio={reenviarEnSegundos}
          cargando={verificacion.isPending}
          reenviando={reenvio.isPending}
          permitirReenvioInmediato={error?.tipo === 'codigo_vencido'}
          error={error && mensajePorTipo(error.tipo, contenido.errors)}
        />

        <div className="mt-8 pt-5 flex flex-col sm:flex-row items-center justify-center gap-x-3 gap-y-2 text-label-sm text-secondary">
          <Link
            to={ROUTES.recoverPassword}
            className="hover:text-on-surface transition-colors rounded focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-primary"
          >
            {contenido.links.wrongEmail}
          </Link>
          <span className="hidden sm:inline text-outline-variant" aria-hidden="true">•</span>
          <Link
            to={ROUTES.login}
            className="hover:text-primary transition-colors rounded focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-primary"
          >
            {contenido.links.rememberedPassword}
          </Link>
        </div>
      </TarjetaAcceso>

      <div className="mt-6 w-full max-w-xl flex flex-col sm:flex-row items-center justify-between gap-2 text-label-sm text-secondary px-1">
        <span className="flex items-center gap-1.5">
          <Icon name="verified" size={16} className="text-primary" />
          {contenido.trustSeal}
        </span>
        <span className="text-outline">{contenido.trustReference}</span>
      </div>
    </MarcoAcceso>
  )
}
