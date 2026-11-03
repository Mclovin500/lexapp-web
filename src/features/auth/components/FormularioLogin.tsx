import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Link, useNavigate } from 'react-router-dom'
import { ROUTES } from '@/app/routes'
import { Icon } from '@/components/ui/Icon'
import { loginSchema, type LoginFormValues } from '../schemas/login.schema'
import { useIniciarSesion } from '../hooks/useIniciarSesion'
import { CampoContrasena } from './CampoContrasena'
import { loginContent } from '../content/login.content'

export function FormularioLogin() {
  const navigate = useNavigate()
  const { mutate: ejecutarLogin, isPending, error } = useIniciarSesion()

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      correo: '',
      contrasena: '',
      recordarEquipo: false,
    },
  })

  const onSubmit = (valores: LoginFormValues) => {
    ejecutarLogin(valores, {
      onSuccess: (respuesta) => {
        navigate(ROUTES.verifyCode, {
          state: { correoEnmascarado: respuesta.correoEnmascarado },
        })
      },
    })
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

        {/* Recordar este equipo */}
        <div className="flex items-center justify-between pt-1">
          <label className="flex items-center gap-2 cursor-pointer select-none">
            <input
              type="checkbox"
              className="w-4 h-4 rounded text-primary-container focus:ring-2 focus:ring-primary-container bg-surface-container accent-primary-container cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-primary"
              {...register('recordarEquipo')}
            />
            <span className="font-body-sm text-body-sm text-secondary">
              {loginContent.form.rememberDevice}
            </span>
          </label>
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
          className="w-full h-11 mt-2 rounded-lg bg-primary-container hover:bg-primary text-on-primary-container hover:text-on-primary font-label-lg text-label-lg font-bold transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary cursor-pointer"
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

