import { Controller, useForm, useWatch } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useNavigate } from 'react-router-dom'
import { ROUTES } from '@/app/routes'
import { Icon } from '@/components/ui/Icon'
import { credencialesContent } from '../../content/credenciales.content'
import { especialidadesRegistro } from '../../content/especialidades.content'
import { guardarPasoRegistro, leerBorradorRegistro } from '../../lib/borrador-registro'
import {
  credencialesSchema,
  esArchivoCedulaValido,
  MAX_ESPECIALIDADES,
  type CredencialesFormValues,
} from '../../schemas/credenciales.schema'
import { CampoTexto } from '../CampoTexto'
import { AccionesRegistro } from './AccionesRegistro'
import { CampoArchivoRegistro } from './CampoArchivoRegistro'
import { SelectorEtiquetas } from './SelectorEtiquetas'

const VALORES_INICIALES: CredencialesFormValues = {
  especialidades: [],
  numeroCedula: '',
  aniosExperiencia: '',
  archivoCedula: null,
}

/**
 * A4: credenciales profesionales. Se guardan en el borrador en memoria → A5.
 * La cédula se sube al backend junto con todo el registro al pulsar "Crear mi cuenta" (A5).
 */
export function FormularioCredenciales() {
  const navigate = useNavigate()
  const { form, verificationNote, actions } = credencialesContent

  const {
    register,
    handleSubmit,
    control,
    setValue,
    setError,
    clearErrors,
    formState: { errors },
  } = useForm<CredencialesFormValues>({
    resolver: zodResolver(credencialesSchema),
    defaultValues: leerBorradorRegistro().credenciales ?? VALORES_INICIALES,
  })
  const archivoCedula = useWatch({ control, name: 'archivoCedula' })

  const elegirArchivo = (archivo: File) => {
    if (!esArchivoCedulaValido(archivo)) {
      setError('archivoCedula', { message: form.docInvalid })
      return
    }
    clearErrors('archivoCedula')
    setValue('archivoCedula', archivo, { shouldValidate: true })
  }

  const onSubmit = (valores: CredencialesFormValues) => {
    guardarPasoRegistro('credenciales', valores)
    navigate(ROUTES.registerProfile)
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-4">
      <CampoTexto
        id="credenciales-cedula"
        label={form.cedulaLabel}
        labelHint={
          <span className="inline-flex items-center gap-1 text-label-sm text-secondary">
            <Icon name="info" size={14} />
            {form.cedulaHint}
          </span>
        }
        icon="badge"
        inputMode="numeric"
        autoComplete="off"
        maxLength={8}
        placeholder={form.cedulaPlaceholder}
        error={errors.numeroCedula?.message}
        {...register('numeroCedula')}
      />

      <CampoTexto
        id="credenciales-anios"
        label={form.experienceLabel}
        icon="hourglass_empty"
        type="number"
        inputMode="numeric"
        min={0}
        max={60}
        step={1}
        placeholder={form.experiencePlaceholder}
        error={errors.aniosExperiencia?.message}
        {...register('aniosExperiencia')}
      />

      <Controller
        control={control}
        name="especialidades"
        render={({ field, fieldState }) => (
          <SelectorEtiquetas
            label={form.specialtiesLabel}
            hint={form.specialtiesHint(MAX_ESPECIALIDADES)}
            opciones={especialidadesRegistro}
            value={field.value}
            onChange={field.onChange}
            maximo={MAX_ESPECIALIDADES}
            error={fieldState.error?.message}
          />
        )}
      />

      <fieldset className="space-y-3">
        <legend className="text-label-md text-on-surface font-semibold">{form.documentsTitle}</legend>
        <p className="text-body-sm text-secondary">{form.documentsDescription}</p>
        <CampoArchivoRegistro
          label={form.cedulaDocLabel}
          hint={form.docHint}
          accept=".pdf,.jpg,.jpeg,.png"
          actual={archivoCedula ? { nombre: archivoCedula.name, tamanoBytes: archivoCedula.size } : null}
          cargando={false}
          error={errors.archivoCedula?.message}
          textos={{ choose: form.docChoose, change: form.docChange, remove: form.docRemove, uploading: form.docChoose }}
          onElegir={elegirArchivo}
          onQuitar={() => setValue('archivoCedula', null, { shouldValidate: true })}
        />
      </fieldset>

      <div className="p-3 rounded-lg bg-surface-container-low flex items-start gap-2.5">
        <Icon name="info" size={18} className="text-primary shrink-0 mt-0.5" />
        <p className="text-body-sm text-secondary leading-relaxed">{verificationNote}</p>
      </div>

      <AccionesRegistro
        anterior={{ to: ROUTES.register, label: actions.previous }}
        textoSiguiente={actions.next}
        textoCargando={actions.next}
        cargando={false}
      />
    </form>
  )
}
