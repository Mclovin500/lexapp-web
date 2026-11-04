import { Link, Navigate, useLocation, useNavigate } from 'react-router-dom'
import { ROUTES } from '@/app/routes'
import { Icon } from '@/components/ui/Icon'
import { CorreoEnmascarado } from '../components/compartidos/CorreoEnmascarado'
import { FormularioCodigo } from '../components/compartidos/FormularioCodigo'
import { NotaVigencia } from '../components/compartidos/NotaVigencia'
import { TarjetaAcceso } from '../components/compartidos/TarjetaAcceso'
import { MarcoAcceso } from '../components/MarcoAcceso'
import { verificarCodigoContent } from '../content/verificar-codigo.content'
import { useReenviarCodigoLogin, useVerificarCodigoLogin } from '../hooks/useVerificarCodigoLogin'
import { destinoPorValidacion } from '../lib/destino-por-validacion'
import { esEstadoVerificacionLogin } from '../lib/estado-navegacion'
import { mensajePorTipo } from '../lib/mapear-error'
import type { ErrorAutenticacion } from '../types/auth.types'
import type { EstadoCarga } from '../types/estado-navegacion.types'

/** A2A: verificación del código enviado tras el login. Correcto → B1 (validado) o A5A. */
export function VerificarCodigoPage() {
  const { state } = useLocation()

  if (!esEstadoVerificacionLogin(state)) {
    return <Navigate to={ROUTES.login} replace />
  }

  return (
    <VerificarCodigo
      correoEnmascarado={state.correoEnmascarado}
      reenviarEnSegundos={state.reenviarEnSegundos}
      expiraEnSegundos={state.expiraEnSegundos}
    />
  )
}

interface VerificarCodigoProps {
  correoEnmascarado: string
  reenviarEnSegundos: number
  expiraEnSegundos: number
}

function VerificarCodigo({
  correoEnmascarado,
  reenviarEnSegundos,
  expiraEnSegundos,
}: VerificarCodigoProps) {
  const navigate = useNavigate()
  const contenido = verificarCodigoContent
  const verificacion = useVerificarCodigoLogin()
  const reenvio = useReenviarCodigoLogin()

  const error: ErrorAutenticacion | null = reenvio.error ?? verificacion.error
  const vigencia = reenvio.data?.expiraEnSegundos ?? expiraEnSegundos

  const verificar = async (codigo: string) => {
    reenvio.reset()
    const respuesta = await verificacion.mutateAsync({ codigo })
    // A1 muestra la carga y continúa a B1 (validado) o A5A.
    const estado: EstadoCarga = { destino: destinoPorValidacion(respuesta.estadoValidacion) }
    navigate(ROUTES.welcome, { replace: true, state: estado })
  }

  const reenviar = async () => {
    verificacion.reset()
    const respuesta = await reenvio.mutateAsync()
    return respuesta.reenviarEnSegundos
  }

  return (
    <MarcoAcceso regreso={{ to: ROUTES.login, label: contenido.back }}>
      <TarjetaAcceso
        icon="shield_lock"
        title={contenido.title}
        ribbon={
          <div className="flex flex-wrap items-center justify-between gap-2">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-primary-container/10 text-primary text-label-sm uppercase tracking-wider">
              <span className="w-1.5 h-1.5 rounded-full bg-primary-container animate-pulse" aria-hidden="true" />
              {contenido.ribbon.protocol}
            </span>
            <span className="flex items-center gap-1 text-secondary text-label-sm">
              <Icon name="verified_user" size={16} className="text-primary" />
              {contenido.ribbon.audited}
            </span>
          </div>
        }
        description={<p>{contenido.description}</p>}
      >
        <div className="flex flex-col items-center gap-4 mb-8">
          <CorreoEnmascarado correo={correoEnmascarado} />
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
          error={
            error &&
            (error.tipo === 'sesion_expirada' ? (
              <>
                {contenido.errors.sesion_expirada}{' '}
                <Link
                  to={ROUTES.login}
                  replace
                  className="font-semibold underline hover:opacity-80 focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-primary"
                >
                  {contenido.errors.sesionExpiradaLink}
                </Link>
              </>
            ) : (
              mensajePorTipo(error.tipo, contenido.errors)
            ))
          }
        />

        <div className="mt-8 w-full bg-surface-container-low rounded-lg p-3 flex items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <Icon name="enhanced_encryption" size={18} className="text-primary-container" />
            <span className="text-label-sm text-on-surface">{contenido.encryptionNote}</span>
          </div>
          <span className="text-label-sm text-secondary bg-surface-container-highest px-2 py-0.5 rounded shrink-0">
            {contenido.encryptionBadge}
          </span>
        </div>
      </TarjetaAcceso>
    </MarcoAcceso>
  )
}
