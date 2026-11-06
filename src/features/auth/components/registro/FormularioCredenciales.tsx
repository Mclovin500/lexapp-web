import { useForm, useWatch } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useNavigate } from 'react-router-dom'
import { ROUTES } from '@/app/routes'
import { Icon } from '@/components/ui/Icon'
import { especialidades, gradosAcademicos } from '../../content/catalogos.content'
import { credencialesContent } from '../../content/credenciales.content'
import { progresoRegistroContent } from '../../content/progreso-registro.content'
import { useGuardarCredenciales, useSubirDocumentoRegistro } from '../../hooks/useRegistroProfesional'
import { credencialesSchema, type CredencialesFormValues } from '../../schemas/credenciales.schema'
import type { CredencialesProfesionales, DocumentoRegistro, TipoDocumentoRegistro } from '../../types/registro-profesional.types'
import { CampoTexto } from '../CampoTexto'
import { AlertaError } from '../compartidos/AlertaError'
import { CampoSelect } from '../compartidos/CampoSelect'
import { MensajeError } from '../compartidos/MensajeError'
import { AccionesRegistro } from './AccionesRegistro'
import { CampoArchivoRegistro } from './CampoArchivoRegistro'

const TIPOS_DOCUMENTO = ['application/pdf', 'image/jpeg', 'image/png']
const MAXIMO_DOCUMENTO = 5 * 1024 * 1024

function aValoresFormulario(guardadas?: CredencialesProfesionales): CredencialesFormValues {
  return {
    numeroCedula: guardadas?.numeroCedula ?? '',
    gradoAcademico: guardadas?.gradoAcademico ?? '',
    tituloObtenido: guardadas?.tituloObtenido ?? '',
    universidad: guardadas?.universidad ?? '',
    especialidad: guardadas?.especialidad ?? '',
    aniosExperiencia: guardadas ? String(guardadas.aniosExperiencia) : '',
    colegio: guardadas?.colegio ?? '',
    documentoCedula: guardadas?.documentos.find((d) => d.tipo === 'cedula') ?? null,
    documentoTitulo: guardadas?.documentos.find((d) => d.tipo === 'titulo') ?? null,
  }
}

function aCredenciales(valores: CredencialesFormValues): CredencialesProfesionales {
  return {
    numeroCedula: valores.numeroCedula,
    gradoAcademico: valores.gradoAcademico as CredencialesProfesionales['gradoAcademico'],
    tituloObtenido: valores.tituloObtenido.trim(),
    universidad: valores.universidad,
    especialidad: valores.especialidad,
    aniosExperiencia: Number(valores.aniosExperiencia),
    colegio: valores.colegio === '' ? null : valores.colegio,
    documentos: [valores.documentoCedula, valores.documentoTitulo].filter((d): d is DocumentoRegistro => d !== null),
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

  const subir = useSubirDocumentoRegistro()

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
    defaultValues: aValoresFormulario(guardadas),
  })
  const [documentoCedula, documentoTitulo] = useWatch({ control, name: ['documentoCedula', 'documentoTitulo'] })

  const campoDe = (tipo: TipoDocumentoRegistro) => (tipo === 'cedula' ? 'documentoCedula' : 'documentoTitulo')
  const elegirDocumento = (tipo: TipoDocumentoRegistro, archivo: File) => {
    const campo = campoDe(tipo)
    if (!TIPOS_DOCUMENTO.includes(archivo.type) || archivo.size === 0 || archivo.size > MAXIMO_DOCUMENTO) {
      setError(campo, { message: form.docInvalid })
      return
    }
    clearErrors(campo)
    subir.mutate(
      { tipo, archivo },
      {
        onSuccess: (documento) => setValue(campo, documento, { shouldValidate: true }),
        onError: () => setError(campo, { message: form.docInvalid }),
      },
    )
  }
  const subiendo = (tipo: TipoDocumentoRegistro) => subir.isPending && subir.variables?.tipo === tipo
  const textosArchivo = { choose: form.docChoose, change: form.docChange, remove: form.docRemove, uploading: form.docUploading }

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

      <fieldset className="space-y-3">
        <legend className="text-label-md text-on-surface font-semibold mb-1">{form.educationTitle}</legend>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
          <CampoSelect
            id="credenciales-grado"
            label={form.degreeLabel}
            icon="workspace_premium"
            opciones={gradosAcademicos}
            placeholder={form.degreePlaceholder}
            error={errors.gradoAcademico?.message}
            {...register('gradoAcademico')}
          />
          <CampoTexto
            id="credenciales-titulo"
            label={form.titleLabel}
            icon="history_edu"
            maxLength={150}
            placeholder={form.titlePlaceholder}
            error={errors.tituloObtenido?.message}
            {...register('tituloObtenido')}
          />
        </div>
      <CampoTexto
        id="credenciales-universidad"
        label={form.universityLabel}
        icon="school"
        autoComplete="organization"
        placeholder={form.universityPlaceholder}
        error={errors.universidad?.message}
        {...register('universidad')}
      />
      </fieldset>

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

      <fieldset className="space-y-3">
        <legend className="text-label-md text-on-surface font-semibold">{form.documentsTitle}</legend>
        <p className="text-body-sm text-secondary">{form.documentsDescription}</p>
        <CampoArchivoRegistro
          label={form.cedulaDocLabel}
          hint={form.docHint}
          accept=".pdf,.jpg,.jpeg,.png"
          actual={documentoCedula}
          cargando={subiendo('cedula')}
          error={errors.documentoCedula?.message}
          textos={textosArchivo}
          onElegir={(archivo) => elegirDocumento('cedula', archivo)}
          onQuitar={() => setValue('documentoCedula', null, { shouldValidate: true })}
        />
        <CampoArchivoRegistro
          label={form.titleDocLabel}
          opcional={form.optional}
          hint={form.docHint}
          accept=".pdf,.jpg,.jpeg,.png"
          actual={documentoTitulo}
          cargando={subiendo('titulo')}
          error={errors.documentoTitulo?.message}
          textos={textosArchivo}
          onElegir={(archivo) => elegirDocumento('titulo', archivo)}
          onQuitar={() => setValue('documentoTitulo', null)}
        />
      </fieldset>

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
        cargando={isPending || subir.isPending}
      />
    </form>
  )
}
