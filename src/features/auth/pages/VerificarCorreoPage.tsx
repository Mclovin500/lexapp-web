import { Link, Navigate, useLocation, useNavigate } from 'react-router-dom'
import { ROUTES } from '@/app/routes'
import { Icon } from '@/components/ui/Icon'
import { EtiquetaPaso } from '../components/compartidos/EtiquetaPaso'
import { FormularioCodigo } from '../components/compartidos/FormularioCodigo'
import { NotaVigencia } from '../components/compartidos/NotaVigencia'
import { MarcoAcceso } from '../components/MarcoAcceso'
import { TarjetaRegistro } from '../components/registro/TarjetaRegistro'
import { verificarCorreoContent } from '../content/verificar-correo.content'
import { useReenviarCodigoCorreo, useVerificarCorreo } from '../hooks/useVerificarCorreo'
import { esEstadoVerificacionCorreo } from '../lib/estado-navegacion'
import { mensajePorTipo } from '../lib/mapear-error'
import type { ErrorAutenticacion } from '../types/auth.types'
import type { EstadoVerificacionCorreo } from '../types/estado-navegacion.types'

/** A3A: verificación del correo del registro. Correcto → A4. Sin estado → A3. */
export function VerificarCorreoPage() {
  const { state } = useLocation()

  if (!esEstadoVerificacionCorreo(state)) {
    return <Navigate to={ROUTES.register} replace />
  }

  return <VerificarCorreo {...state} />
}

function VerificarCorreo({
  correoEnmascarado,
  reenviarEnSegundos,
  expiraEnSegundos,
}: EstadoVerificacionCorreo) {
  const navigate = useNavigate()
  const contenido = verificarCorreoContent
  const verificacion = useVerificarCorreo()
  const reenvio = useReenviarCodigoCorreo()

  const error: ErrorAutenticacion | null = reenvio.error ?? verificacion.error
  const vigencia = reenvio.data?.expiraEnSegundos ?? expiraEnSegundos

  const verificar = async (codigo: string) => {
    reenvio.reset()
    await verificacion.mutateAsync({ codigo })
    // `replace`: el código ya se usó; "Anterior" en A4 lleva a A3, no aquí.
    navigate(ROUTES.registerCredentials, { replace: true })
  }

  const reenviar = async () => {
    verificacion.reset()
    const respuesta = await reenvio.mutateAsync()
    return respuesta.reenviarEnSegundos
  }

  return (
    <MarcoAcceso>
      <TarjetaRegistro pasoActual={0} subtitle={contenido.subtitle}>
        <div className="flex flex-col items-center text-center mb-6">
          <EtiquetaPaso icon="verified" label={contenido.badge} />
          <h2 className="mt-4 text-headline-sm text-on-surface">{contenido.title}</h2>
          <p className="mt-1.5 text-body-md text-secondary max-w-md">{contenido.description}</p>
        </div>

        <div className="mb-6 flex flex-col gap-3">
          <div className="w-full bg-surface-container-low rounded-lg px-4 py-3 flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-3 min-w-0">
              <Icon name="alternate_email" size={20} className="text-secondary" />
              <div className="flex flex-col text-left min-w-0">
                <span className="text-label-sm text-secondary">{contenido.destinationLabel}</span>
                <span className="text-label-lg text-on-surface break-all">{correoEnmascarado}</span>
                <span className="text-[11px] text-outline">{contenido.pendingLabel}</span>
              </div>
            </div>
            {/* PENDIENTE backend: cómo se corrige el correo de un registro sin verificar */}
            <Link
              to={ROUTES.register}
              className="inline-flex items-center gap-1 text-label-sm text-primary font-semibold hover:underline rounded focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-primary"
            >
              <Icon name="edit" size={16} />
              {contenido.correctEmail}
            </Link>
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
          error={
            error &&
            (error.tipo === 'sesion_expirada' ? (
              <>
                {contenido.errors.sesion_expirada}{' '}
                <Link
                  to={ROUTES.register}
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
