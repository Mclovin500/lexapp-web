import { useForm, useWatch } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useNavigate } from 'react-router-dom'
import { ROUTES } from '@/app/routes'
import { Icon } from '@/components/ui/Icon'
import { registroContent } from '../content/registro.content'
import { guardarPasoRegistro, leerBorradorRegistro } from '../lib/borrador-registro'
import { registroSchema, type RegistroFormValues } from '../schemas/registro.schema'
import { CampoContrasena } from './CampoContrasena'
import { CampoTexto, MensajeCampo } from './CampoTexto'
import { IndicadorContrasena } from './IndicadorContrasena'

const VALORES_INICIALES: RegistroFormValues = {
  primerNombre: '',
  segundoNombre: '',
  apellidoPaterno: '',
  apellidoMaterno: '',
  correo: '',
  telefono: '',
  contrasena: '',
  confirmarContrasena: '',
  aceptaTerminos: false,
}

/**
 * A3: datos básicos. El backend crea la cuenta en una sola petición al final (A5),
 * así que aquí solo se validan y se guardan en el borrador en memoria → A4.
 */
export function FormularioRegistro() {
  const navigate = useNavigate()
  const { form, terms } = registroContent

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<RegistroFormValues>({
    resolver: zodResolver(registroSchema),
    defaultValues: leerBorradorRegistro().datosBasicos ?? VALORES_INICIALES,
  })

  const contrasena = useWatch({ control, name: 'contrasena' })

  const onSubmit = (valores: RegistroFormValues) => {
    guardarPasoRegistro('datosBasicos', { ...valores, correo: valores.correo.toLowerCase() })
    navigate(ROUTES.registerCredentials)
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-4">
      {/* Nombres y apellidos (como en la cédula profesional) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
        <CampoTexto
          id="registro-primer-nombre"
          label={form.firstNameLabel}
          icon="badge"
          autoComplete="given-name"
          maxLength={50}
          placeholder={form.firstNamePlaceholder}
          error={errors.primerNombre?.message}
          {...register('primerNombre')}
        />
        <CampoTexto
          id="registro-segundo-nombre"
          label={form.middleNameLabel}
          labelHint={form.middleNameOptional}
          icon="badge"
          autoComplete="additional-name"
          maxLength={50}
          placeholder={form.middleNamePlaceholder}
          error={errors.segundoNombre?.message}
          {...register('segundoNombre')}
        />
        <CampoTexto
          id="registro-apellido-paterno"
          label={form.paternalLastNameLabel}
          icon="badge"
          autoComplete="family-name"
          maxLength={50}
          placeholder={form.paternalLastNamePlaceholder}
          error={errors.apellidoPaterno?.message}
          {...register('apellidoPaterno')}
        />
        <CampoTexto
          id="registro-apellido-materno"
          label={form.maternalLastNameLabel}
          icon="badge"
          maxLength={50}
          placeholder={form.maternalLastNamePlaceholder}
          error={errors.apellidoMaterno?.message}
          {...register('apellidoMaterno')}
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

      {/* Acción principal */}
      <div className="pt-3">
        <button
          type="submit"
          className="w-full h-11 bg-primary-container hover:bg-primary-hover text-on-primary-container hover:text-on-primary text-label-lg font-semibold rounded-lg shadow-md shadow-primary-container/20 flex items-center justify-center gap-2 transition-all active:scale-[0.99] cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
        >
          <span>{form.submitButton}</span>
          <Icon name="arrow_forward" size={18} />
        </button>
      </div>
    </form>
  )
}
