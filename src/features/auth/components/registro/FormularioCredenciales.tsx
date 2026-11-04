import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useNavigate } from 'react-router-dom'
import { ROUTES } from '@/app/routes'
import { Icon } from '@/components/ui/Icon'
import { especialidades } from '../../content/catalogos.content'
import { credencialesContent } from '../../content/credenciales.content'
import { progresoRegistroContent } from '../../content/progreso-registro.content'
import { useGuardarCredenciales } from '../../hooks/useRegistroProfesional'
import { credencialesSchema, type CredencialesFormValues } from '../../schemas/credenciales.schema'
import type { CredencialesProfesionales } from '../../types/registro-profesional.types'
import { CampoTexto } from '../CampoTexto'
import { AlertaError } from '../compartidos/AlertaError'
import { CampoSelect } from '../compartidos/CampoSelect'
import { MensajeError } from '../compartidos/MensajeError'
import { AccionesRegistro } from './AccionesRegistro'

function aValoresFormulario(guardadas?: CredencialesProfesionales): CredencialesFormValues {
  return {
    numeroCedula: guardadas?.numeroCedula ?? '',
    universidad: guardadas?.universidad ?? '',
    especialidad: guardadas?.especialidad ?? '',
    aniosExperiencia: guardadas ? String(guardadas.aniosExperiencia) : '',
    colegio: guardadas?.colegio ?? '',
  }
}

function aCredenciales(valores: CredencialesFormValues): CredencialesProfesionales {
  return {
    numeroCedula: valores.numeroCedula,
    universidad: valores.universidad,
    especialidad: valores.especialidad,
    aniosExperiencia: Number(valores.aniosExperiencia),
    colegio: valores.colegio === '' ? null : valores.colegio,
  }
}

interface FormularioCredencialesProps {
  guardadas?: CredencialesProfesionales
}

/** A4: credenciales profesionales. Siguiente → PUT credenciales → A5. */
export function FormularioCredenciales({ guardadas }: FormularioCredencialesProps) {
  const navigate = useNavigate()
  const { form, verificationNote, actions, errors: mensajes } = credencialesContent
  const { mutate: guardar, isPending, error } = useGuardarCredenciales()

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CredencialesFormValues>({
    resolver: zodResolver(credencialesSchema),
    defaultValues: aValoresFormulario(guardadas),
  })

  const onSubmit = (valores: CredencialesFormValues) => {
    guardar(aCredenciales(valores), {
      onSuccess: () => navigate(ROUTES.registerProfile),
    })
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
        id="credenciales-universidad"
        label={form.universityLabel}
        icon="school"
        autoComplete="organization"
        placeholder={form.universityPlaceholder}
        error={errors.universidad?.message}
        {...register('universidad')}
      />

      <CampoSelect
        id="credenciales-especialidad"
        label={form.specialtyLabel}
        icon="gavel"
        opciones={especialidades}
        placeholder={form.specialtyPlaceholder}
        error={errors.especialidad?.message}
        {...register('especialidad')}
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
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
        <CampoTexto
          id="credenciales-colegio"
          label={form.collegeLabel}
          labelHint={form.optional}
          icon="account_balance"
          placeholder={form.collegePlaceholder}
          error={errors.colegio?.message}
          {...register('colegio')}
        />
      </div>

      <div className="p-3 rounded-lg bg-surface-container-low flex items-start gap-2.5">
        <Icon name="info" size={18} className="text-primary shrink-0 mt-0.5" />
        <p className="text-body-sm text-secondary leading-relaxed">{verificationNote}</p>
      </div>

      {error && (
        <AlertaError>
          <MensajeError
            tipo={error.tipo}
            mensajes={mensajes}
            enlaces={{ sesion_expirada: { to: ROUTES.login, label: progresoRegistroContent.loginLink } }}
          />
        </AlertaError>
      )}

      {/* PENDIENTE: definir con backend si los datos básicos son editables tras verificar el correo */}
      <AccionesRegistro
        anterior={{ to: ROUTES.register, label: actions.previous }}
        textoSiguiente={actions.next}
        textoCargando={actions.saving}
        cargando={isPending}
      />
    </form>
  )
}
