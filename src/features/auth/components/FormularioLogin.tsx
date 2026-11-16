import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Link, useNavigate } from 'react-router-dom'
import { ROUTES } from '@/app/routes'
import { Icon } from '@/components/ui/Icon'
import { loginSchema, type LoginFormValues } from '../schemas/login.schema'
import { useIniciarSesion } from '../hooks/useIniciarSesion'
import { useEnviarCodigoCorreo } from '../hooks/useVerificarCorreo'
import { recordarCredencialesPendientes } from '../lib/borrador-registro'
import { enmascararCorreo, TIEMPOS_CODIGO } from '../lib/codigo-correo'
import { destinoPorValidacion } from '../lib/destino-por-validacion'
import { CampoContrasena } from './CampoContrasena'
import { loginContent } from '../content/login.content'
import type { EstadoCarga, EstadoVerificacionCorreo } from '../types/estado-navegacion.types'

/** P02: POST /auth/login → A1 (carga) → B1 (validado) o A5A. Correo sin verificar → A3A. */
export function FormularioLogin() {
  const navigate = useNavigate()
  const { mutate: ejecutarLogin, isPending, error } = useIniciarSesion()
  const envioCodigo = useEnviarCodigoCorreo()

  const {
    register,
    handleSubmit,
    getValues,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      correo: '',
      contrasena: '',
    },
  })

  const onSubmit = (valores: LoginFormValues) => {
    envioCodigo.reset()
    ejecutarLogin(
      { correo: valores.correo.toLowerCase(), contrasena: valores.contrasena },
      {
        onSuccess: (respuesta) => {
          const estado: EstadoCarga = { destino: destinoPorValidacion(respuesta.estadoValidacion) }
          navigate(ROUTES.welcome, { replace: true, state: estado })
        },
      },
    )
  }

  /** El backend no deja iniciar sesión sin verificar el correo: se envía el código y se va a A3A. */
  const verificarCorreo = () => {
    const correo = getValues('correo').trim().toLowerCase()
    envioCodigo.mutate(
      { correo },
      {
        onSuccess: () => {
          recordarCredencialesPendientes(correo, getValues('contrasena'))
          const estado: EstadoVerificacionCorreo = {
            correo,
            correoEnmascarado: enmascararCorreo(correo),
            ...TIEMPOS_CODIGO,
          }
          navigate(ROUTES.verifyEmail, { state: estado })
        },
      },
    )
  }

  return (
    <div className="w-full">
      <form
        onSubmit={handleSubmit(onSubmit)}
        noValidate
        className="space-y-4"
      >
        {/* Campo Correo */}
        <div>
          <label
            htmlFor="correo-input"
            className="block font-label-md text-label-md text-on-surface font-semibold mb-1.5"
          >
            {loginContent.form.emailLabel}
          </label>
          <div className="relative flex items-center">
            <span
              className="pointer-events-none absolute left-3.5 text-secondary flex items-center justify-center"
              aria-hidden="true"
            >
              <Icon name="mail" size={20} />
            </span>
            <input
              {...register('correo')}
              id="correo-input"
              type="email"
              autoComplete="email"
              placeholder={loginContent.form.emailPlaceholder}
              aria-invalid={Boolean(errors.correo)}
              aria-describedby={errors.correo ? 'correo-error' : undefined}
              className={`w-full h-11 pl-11 pr-4 bg-surface-container-lowest text-on-surface font-body-md text-body-md rounded-lg shadow-sm placeholder:text-secondary/60 focus:outline-none focus:ring-2 focus:ring-primary-container transition-colors ${
                errors.correo
                  ? 'border border-error ring-1 ring-error'
                  : 'border border-outline-variant/30'
              }`}
            />
          </div>
          {errors.correo && (
            <p
              id="correo-error"
              className="mt-1.5 text-body-sm text-error flex items-center gap-1"
            >
              <Icon name="error" size={16} />
              <span>{errors.correo.message}</span>
            </p>
          )}
        </div>

        {/* Campo Contraseña */}
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label
              htmlFor="contrasena-input"
              className="block font-label-md text-label-md text-on-surface font-semibold"
            >
              {loginContent.form.passwordLabel}
            </label>
            <Link
              to={ROUTES.recoverPassword}
              className="font-label-sm text-label-sm font-semibold text-primary hover:underline focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-primary rounded"
            >
              {loginContent.form.forgotPassword}
            </Link>
          </div>
          <CampoContrasena
            id="contrasena-input"
            error={errors.contrasena?.message}
            describedBy={errors.contrasena ? 'contrasena-error' : undefined}
            {...register('contrasena')}
          />
          {errors.contrasena && (
            <p
              id="contrasena-error"
              className="mt-1.5 text-body-sm text-error flex items-center gap-1"
            >
              <Icon name="error" size={16} />
              <span>{errors.contrasena.message}</span>
            </p>
          )}
        </div>

        {/* Caja de Error del Servidor */}
        {error && (
          <div
            role="alert"
            className="p-3.5 rounded-lg bg-error-container text-on-error-container text-body-sm flex items-start gap-2.5 border border-error/20"
          >
            <Icon name="error" size={20} className="text-error shrink-0 mt-0.5" />
            <div className="leading-snug">
              {error.tipo === 'cuenta_no_abogado' ? (
                <span>
                  {loginContent.errors.cuentaNoAbogadoPrefix}
                  <Link
                    to={ROUTES.mobileApp}
                    className="font-semibold underline hover:opacity-80 focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-primary"
                  >
                    {loginContent.errors.cuentaNoAbogadoLinkText}
                  </Link>
                  {loginContent.errors.cuentaNoAbogadoSuffix}
                </span>
              ) : error.tipo === 'correo_no_verificado' ? (
                <span className="flex flex-col items-start gap-2">
                  <span>
                    {envioCodigo.error
                      ? envioCodigo.error.tipo === 'red'
                        ? loginContent.errors.red
                        : (envioCodigo.error.mensajeServidor ?? loginContent.errors.desconocido)
                      : loginContent.errors.correoNoVerificado}
                  </span>
                  <button
                    type="button"
                    onClick={verificarCorreo}
                    disabled={envioCodigo.isPending}
                    className="font-semibold underline hover:opacity-80 cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-primary"
                  >
                    {envioCodigo.isPending
                      ? loginContent.errors.correoNoVerificadoEnviando
                      : loginContent.errors.correoNoVerificadoBoton}
                  </button>
                </span>
              ) : error.tipo === 'cuenta_desactivada' ? (
                <span>{loginContent.errors.cuentaDesactivada}</span>
              ) : error.tipo === 'credenciales' ? (
                <span>{loginContent.errors.credenciales}</span>
              ) : error.tipo === 'demasiados_intentos' ? (
                <span>{loginContent.errors.demasiadosIntentos}</span>
              ) : error.tipo === 'red' ? (
                <span>{loginContent.errors.red}</span>
              ) : (
                <span>{loginContent.errors.desconocido}</span>
              )}
            </div>
          </div>
        )}

        {/* Botón de Envío */}
        <button
          type="submit"
          disabled={isPending}
          className="w-full h-11 mt-2 rounded-lg bg-primary-container hover:bg-primary-hover text-on-primary-container hover:text-on-primary font-label-lg text-label-lg font-bold transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary cursor-pointer"
        >
          {isPending ? (
            <>
              <span className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
              <span>{loginContent.form.submittingButton}</span>
            </>
          ) : (
            <>
              <span>{loginContent.form.submitButton}</span>
              <Icon name="login" size={18} />
            </>
          )}
        </button>
      </form>

      {/* Enlace de Registro */}
      <div className="mt-6 text-center">
        <p className="font-body-md text-body-md text-secondary">
          {loginContent.links.noAccountText}{' '}
          <Link
            to={ROUTES.profileSelection}
            className="font-bold text-primary hover:underline focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-primary rounded"
          >
            {loginContent.links.registerLinkText}
          </Link>
        </p>
      </div>

      {/* Enlace discreto para clientes */}
      <div className="mt-3 text-center">
        <p className="font-body-sm text-body-sm text-secondary">
          {loginContent.links.isClientText}{' '}
          <Link
            to={ROUTES.mobileApp}
            className="font-semibold text-secondary hover:text-on-surface underline transition-colors focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-primary rounded"
          >
            {loginContent.links.mobileAppLinkText}
          </Link>
        </p>
      </div>
    </div>
  )
}

