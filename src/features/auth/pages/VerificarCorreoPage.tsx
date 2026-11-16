import { Navigate, useLocation, useNavigate } from 'react-router-dom'
import { ROUTES } from '@/app/routes'
import { Icon } from '@/components/ui/Icon'
import { EtiquetaPaso } from '../components/compartidos/EtiquetaPaso'
import { FormularioCodigo } from '../components/compartidos/FormularioCodigo'
import { NotaVigencia } from '../components/compartidos/NotaVigencia'
import { MarcoAcceso } from '../components/MarcoAcceso'
import { TarjetaRegistro } from '../components/registro/TarjetaRegistro'
import { verificarCorreoContent } from '../content/verificar-correo.content'
import { useIniciarSesion } from '../hooks/useIniciarSesion'
import { useEnviarCodigoCorreo, useVerificarCorreo } from '../hooks/useVerificarCorreo'
import { tomarCredencialesPendientes } from '../lib/borrador-registro'
import { TIEMPOS_CODIGO } from '../lib/codigo-correo'
import { destinoPorValidacion } from '../lib/destino-por-validacion'
import { esEstadoVerificacionCorreo } from '../lib/estado-navegacion'
import { mensajePorTipo } from '../lib/mapear-error'
import type { ErrorAutenticacion } from '../types/auth.types'
import type { EstadoCarga, EstadoVerificacionCorreo } from '../types/estado-navegacion.types'

/**
 * A3A: verificación del correo (POST /Verificacion/verificar).
 * Llega desde A5 (cuenta recién creada) o desde P02 (correo sin verificar).
 * Correcto → inicia sesión con las credenciales en memoria → A1 → A5A/B1; si no las hay → P02.
 * Sin estado → P02.
 */
export function VerificarCorreoPage() {
  const { state } = useLocation()

  if (!esEstadoVerificacionCorreo(state)) {
    return <Navigate to={ROUTES.login} replace />
  }

  return <VerificarCorreo {...state} />
}

function VerificarCorreo({ correo, correoEnmascarado, reenviarEnSegundos, expiraEnSegundos }: EstadoVerificacionCorreo) {
  const navigate = useNavigate()
  const contenido = verificarCorreoContent
  const verificacion = useVerificarCorreo()
  const reenvio = useEnviarCodigoCorreo()
  const login = useIniciarSesion()

  const error: ErrorAutenticacion | null = reenvio.error ?? verificacion.error
  const vigencia = reenvio.isSuccess ? TIEMPOS_CODIGO.expiraEnSegundos : expiraEnSegundos

  const verificar = async (codigo: string) => {
    reenvio.reset()
    await verificacion.mutateAsync({ correo, codigo })

    // El correo ya quedó verificado: cualquier fallo de aquí en adelante solo lleva a P02.
    const credenciales = tomarCredencialesPendientes(correo)
    if (!credenciales) {
      navigate(ROUTES.login, { replace: true })
      return
    }
    try {
      const { estadoValidacion } = await login.mutateAsync(credenciales)
      const estado: EstadoCarga = { destino: destinoPorValidacion(estadoValidacion) }
      navigate(ROUTES.welcome, { replace: true, state: estado })
    } catch {
      navigate(ROUTES.login, { replace: true })
    }
  }

  const reenviar = async () => {
    verificacion.reset()
    await reenvio.mutateAsync({ correo })
    return TIEMPOS_CODIGO.reenviarEnSegundos
  }

  return (
    <MarcoAcceso>
      <TarjetaRegistro pasoActual={3} subtitle={contenido.subtitle}>
        <div className="flex flex-col items-center text-center mb-6">
          <EtiquetaPaso icon="verified" label={contenido.badge} />
          <h2 className="mt-4 text-headline-sm text-on-surface">{contenido.title}</h2>
          <p className="mt-1.5 text-body-md text-secondary max-w-md">{contenido.description}</p>
        </div>

        <div className="mb-6 flex flex-col gap-3">
          <div className="w-full bg-surface-container-low rounded-lg px-4 py-3 flex items-center gap-3 min-w-0">
            <Icon name="alternate_email" size={20} className="text-secondary" />
            <div className="flex flex-col text-left min-w-0">
              <span className="text-label-sm text-secondary">{contenido.destinationLabel}</span>
              <span className="text-label-lg text-on-surface break-all">{correoEnmascarado}</span>
              <span className="text-[11px] text-outline">{contenido.pendingLabel}</span>
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
          cargando={verificacion.isPending || login.isPending}
          reenviando={reenvio.isPending}
          permitirReenvioInmediato={error?.tipo === 'codigo_vencido' || error?.tipo === 'demasiados_intentos'}
          error={error && (error.tipo === 'datos_invalidos' && error.mensajeServidor ? error.mensajeServidor : mensajePorTipo(error.tipo, contenido.errors))}
        />

        <div className="mt-6 p-3 rounded-lg bg-surface-container-low flex items-start gap-3">
          <Icon name="mark_email_unread" size={20} className="text-primary shrink-0" />
          <div>
            <p className="text-label-md text-on-surface font-semibold">{contenido.help.title}</p>
            <p className="text-body-sm text-secondary">{contenido.help.text}</p>
          </div>
        </div>
      </TarjetaRegistro>
    </MarcoAcceso>
  )
}
