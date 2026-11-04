import { useForm, useWatch } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Link, useNavigate } from 'react-router-dom'
import { ROUTES } from '@/app/routes'
import { Icon } from '@/components/ui/Icon'
import { registroContent } from '../content/registro.content'
import { useRegistrarAbogado } from '../hooks/useRegistrarAbogado'
import { registroSchema, type RegistroFormValues } from '../schemas/registro.schema'
import type { EstadoVerificacionCorreo } from '../types/estado-navegacion.types'
import type { DatosRegistro } from '../types/registro.types'
import { CampoContrasena } from './CampoContrasena'
import { CampoTexto, MensajeCampo } from './CampoTexto'
import { IndicadorContrasena } from './IndicadorContrasena'

/** Convierte los valores del formulario al cuerpo que espera el backend. */
function aDatosRegistro(valores: RegistroFormValues): DatosRegistro {
  return {
    nombre: valores.nombre,
    apellidos: valores.apellidos,
    correo: valores.correo.toLowerCase(),
    telefono: valores.telefono === '' ? null : valores.telefono,
    contrasena: valores.contrasena,
    aceptaTerminos: true,
  }
}

export function FormularioRegistro() {
  const navigate = useNavigate()
  const { form, terms, errors: mensajesError } = registroContent
  const { mutate: registrar, isPending, error } = useRegistrarAbogado()

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<RegistroFormValues>({
    resolver: zodResolver(registroSchema),
    defaultValues: {
      nombre: '',
      apellidos: '',
      correo: '',
      telefono: '',
      contrasena: '',
      confirmarContrasena: '',
      aceptaTerminos: false,
    },
  })

  const contrasena = useWatch({ control, name: 'contrasena' })

  const onSubmit = (valores: RegistroFormValues) => {
    registrar(aDatosRegistro(valores), {
      onSuccess: (respuesta) => {
        navigate(ROUTES.verifyEmail, {
          state: {
            correoEnmascarado: respuesta.correoEnmascarado,
            reenviarEnSegundos: respuesta.reenviarEnSegundos,
            expiraEnSegundos: respuesta.expiraEnSegundos,
          } satisfies EstadoVerificacionCorreo,
        })
      },
    })
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-4">
      {/* Nombre y apellidos */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
        <CampoTexto
          id="registro-nombre"
          label={form.firstNameLabel}
          icon="badge"
          autoComplete="given-name"
          placeholder={form.firstNamePlaceholder}
          error={errors.nombre?.message}
          {...register('nombre')}
        />
        <CampoTexto
          id="registro-apellidos"
          label={form.lastNameLabel}
          icon="badge"
          autoComplete="family-name"
          placeholder={form.lastNamePlaceholder}
          error={errors.apellidos?.message}
          {...register('apellidos')}
        />
      </div>

      <CampoTexto
        id="registro-correo"
        label={form.emailLabel}
        icon="mail"
        type="email"
        autoComplete="email"
        placeholder={form.emailPlaceholder}
        error={errors.correo?.message}
        {...register('correo')}
      />

      <CampoTexto
        id="registro-telefono"
        label={form.phoneLabel}
        labelHint={form.phoneOptional}
        icon="call"
        type="tel"
        autoComplete="tel"
        inputMode="tel"
        placeholder={form.phonePlaceholder}
        error={errors.telefono?.message}
        {...register('telefono')}
      />

      {/* Contraseñas */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 pt-0.5">
        <div className="space-y-1.5">
          <label htmlFor="registro-contrasena" className="block text-label-md text-on-surface font-medium">
            {form.passwordLabel}
          </label>
          <CampoContrasena
            id="registro-contrasena"
            variante="relleno"
            autoComplete="new-password"
            placeholder={form.passwordPlaceholder}
            error={errors.contrasena?.message}
            describedBy={
              errors.contrasena ? 'registro-contrasena-error registro-requisitos' : 'registro-requisitos'
            }
            {...register('contrasena')}
          />
          {errors.contrasena?.message && (
            <MensajeCampo id="registro-contrasena-error" mensaje={errors.contrasena.message} />
          )}
        </div>
        <div className="space-y-1.5">
          <label htmlFor="registro-confirmar" className="block text-label-md text-on-surface font-medium">
            {form.confirmPasswordLabel}
          </label>
          <CampoContrasena
            id="registro-confirmar"
            icon="lock_reset"
            variante="relleno"
            autoComplete="new-password"
            placeholder={form.passwordPlaceholder}
            error={errors.confirmarContrasena?.message}
            describedBy={errors.confirmarContrasena ? 'registro-confirmar-error' : undefined}
            {...register('confirmarContrasena')}
          />
          {errors.confirmarContrasena?.message && (
            <MensajeCampo id="registro-confirmar-error" mensaje={errors.confirmarContrasena.message} />
          )}
        </div>
      </div>

      <IndicadorContrasena id="registro-requisitos" contrasena={contrasena} />

      {/* Términos */}
      <div className="pt-2">
        <div className="flex items-start gap-3">
          <input
            id="registro-terminos"
            type="checkbox"
            aria-invalid={Boolean(errors.aceptaTerminos)}
            aria-describedby={errors.aceptaTerminos ? 'registro-terminos-error' : undefined}
            className="mt-1 w-4 h-4 rounded accent-primary-container cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-primary"
            {...register('aceptaTerminos')}
          />
          <label htmlFor="registro-terminos" className="text-body-sm text-secondary select-none cursor-pointer leading-relaxed">
            {terms.prefix}
            <strong className="text-primary font-semibold">{terms.serviceTerms}</strong>
            {terms.middle}
            <strong className="text-primary font-semibold">{terms.confidentiality}</strong>
            {terms.suffix}
          </label>
        </div>
        {errors.aceptaTerminos?.message && (
          <div className="mt-1.5">
            <MensajeCampo id="registro-terminos-error" mensaje={errors.aceptaTerminos.message} />
          </div>
        )}
      </div>

      {/* Error del servidor */}
      {error && (
        <div
          role="alert"
          className="p-3.5 rounded-lg bg-error-container text-on-error-container text-body-sm flex items-start gap-2.5 border border-error/20"
        >
          <Icon name="error" size={20} className="text-error shrink-0 mt-0.5" />
          <span className="leading-snug">
            {mensajesError[error.tipo] ?? mensajesError.desconocido}
            {error.tipo === 'correo_registrado' && (
              <>
                {' '}
                <Link
                  to={ROUTES.login}
                  className="font-semibold underline hover:opacity-80 focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-primary"
                >
                  {registroContent.links.loginLinkText}
                </Link>
              </>
            )}
          </span>
        </div>
      )}

      {/* Acción principal */}
      <div className="pt-3">
        <button
          type="submit"
          disabled={isPending}
          className="w-full h-11 bg-primary-container hover:bg-primary text-on-primary text-label-lg font-semibold rounded-lg shadow-md shadow-primary-container/20 flex items-center justify-center gap-2 transition-all active:scale-[0.99] cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
        >
          {isPending ? (
            <>
              <span className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
              <span>{form.submittingButton}</span>
            </>
          ) : (
            <>
              <span>{form.submitButton}</span>
              <Icon name="arrow_forward" size={18} />
            </>
          )}
        </button>
      </div>
    </form>
  )
}
