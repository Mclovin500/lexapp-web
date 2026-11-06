import { useState } from 'react'
import { Controller, useFieldArray, useForm, useWatch } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useNavigate } from 'react-router-dom'
import { ROUTES } from '@/app/routes'
import { Icon } from '@/components/ui/Icon'
import { areasPractica, disponibilidades, especializaciones } from '../../content/catalogos.content'
import { perfilProfesionalContent } from '../../content/perfil-profesional.content'
import { progresoRegistroContent } from '../../content/progreso-registro.content'
import { useFinalizarRegistro, useSubirFotoRegistro } from '../../hooks/useRegistroProfesional'
import {
  LIMITE_BIOGRAFIA,
  MAX_ESPECIALIZACIONES,
  MAX_SERVICIOS,
  perfilProfesionalSchema,
  type PerfilProfesionalFormValues,
} from '../../schemas/perfil-profesional.schema'
import type { PerfilProfesional } from '../../types/registro-profesional.types'
import { CampoTexto } from '../CampoTexto'
import { AlertaError } from '../compartidos/AlertaError'
import { CampoAreaTexto } from '../compartidos/CampoAreaTexto'
import { CampoSelect } from '../compartidos/CampoSelect'
import { MensajeError } from '../compartidos/MensajeError'
import { AccionesRegistro } from './AccionesRegistro'
import { CampoArchivoRegistro } from './CampoArchivoRegistro'
import { SelectorDisponibilidad } from './SelectorDisponibilidad'
import { SelectorEtiquetas } from './SelectorEtiquetas'

function aValoresFormulario(guardado?: PerfilProfesional): PerfilProfesionalFormValues {
  return {
    areaPractica: guardado?.areaPractica ?? '',
    especializaciones: guardado?.especializaciones ?? [],
    biografia: guardado?.biografia ?? '',
    idiomas: guardado?.informacionRelevante.idiomas ?? '',
    jurisdicciones: guardado?.informacionRelevante.jurisdicciones ?? '',
    disponibilidad: guardado?.disponibilidad ?? disponibilidades[0].valor,
    servicios: guardado?.servicios.map((s) => ({ ...s })) ?? [{ nombre: '', descripcion: '' }],
    consultaInicial: guardado ? String(guardado.honorarios.consultaInicial) : '',
    tarifaHora: guardado?.honorarios.tarifaHora != null ? String(guardado.honorarios.tarifaHora) : '',
    fotoUrl: guardado?.fotoUrl ?? null,
  }
}

function aPerfil(valores: PerfilProfesionalFormValues): PerfilProfesional {
  return {
    areaPractica: valores.areaPractica,
    especializaciones: valores.especializaciones,
    biografia: valores.biografia,
    informacionRelevante: {
      idiomas: valores.idiomas === '' ? null : valores.idiomas,
      jurisdicciones: valores.jurisdicciones === '' ? null : valores.jurisdicciones,
    },
    disponibilidad: valores.disponibilidad,
    servicios: valores.servicios.map((s) => ({ nombre: s.nombre.trim(), descripcion: s.descripcion.trim() })),
    honorarios: {
      consultaInicial: Number(valores.consultaInicial),
      tarifaHora: valores.tarifaHora === '' ? null : Number(valores.tarifaHora),
    },
    fotoUrl: valores.fotoUrl,
  }
}

interface FormularioPerfilProps {
  guardado?: PerfilProfesional
}

/** A5: área de práctica y perfil. "Crear mi cuenta" → PUT perfil + POST enviar → A5A. */
export function FormularioPerfil({ guardado }: FormularioPerfilProps) {
  const navigate = useNavigate()
  const { form, actions, errors: mensajes } = perfilProfesionalContent
  const { mutate: finalizar, isPending, error } = useFinalizarRegistro()

  const subirFoto = useSubirFotoRegistro()
  const [errorFoto, setErrorFoto] = useState<string | null>(null)
  const [nombreFoto, setNombreFoto] = useState<{ nombre: string; tamanoBytes: number } | null>(null)

  const {
    register,
    handleSubmit,
    control,
    setValue,
    formState: { errors },
  } = useForm<PerfilProfesionalFormValues>({
    resolver: zodResolver(perfilProfesionalSchema),
    defaultValues: aValoresFormulario(guardado),
  })
  const servicios = useFieldArray({ control, name: 'servicios' })

  const [biografia, disponibilidad, fotoUrl] = useWatch({ control, name: ['biografia', 'disponibilidad', 'fotoUrl'] })

  const elegirFoto = (archivo: File) => {
    if (!['image/jpeg', 'image/png'].includes(archivo.type) || archivo.size > 4 * 1024 * 1024) {
      setErrorFoto(form.photoInvalid)
      return
    }
    setErrorFoto(null)
    subirFoto.mutate(archivo, {
      onSuccess: ({ fotoUrl: url }) => {
        setValue('fotoUrl', url)
        setNombreFoto({ nombre: archivo.name, tamanoBytes: archivo.size })
      },
      onError: () => setErrorFoto(form.photoInvalid),
    })
  }

  const onSubmit = (valores: PerfilProfesionalFormValues) => {
    finalizar(aPerfil(valores), {
      // `replace`: el registro ya se envió; no tiene sentido volver al formulario.
      onSuccess: () => navigate(ROUTES.validationStatus, { replace: true }),
    })
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-5">
      <CampoSelect
        id="perfil-area"
        label={form.areaLabel}
        labelHint={
          <span className="text-[10px] uppercase tracking-wider font-bold text-primary bg-primary/10 px-1.5 py-0.5 rounded">
            {form.required}
          </span>
        }
        icon="balance"
        opciones={areasPractica}
        placeholder={form.areaPlaceholder}
        error={errors.areaPractica?.message}
        {...register('areaPractica')}
      />

      <Controller
        control={control}
        name="especializaciones"
        render={({ field, fieldState }) => (
          <SelectorEtiquetas
            label={form.tagsLabel}
            hint={form.tagsHint(MAX_ESPECIALIZACIONES)}
            opciones={especializaciones}
            value={field.value}
            onChange={field.onChange}
            maximo={MAX_ESPECIALIZACIONES}
            error={fieldState.error?.message}
          />
        )}
      />

      <CampoAreaTexto
        id="perfil-biografia"
        label={form.bioLabel}
        icon="badge"
        rows={4}
        maxLength={LIMITE_BIOGRAFIA}
        longitud={biografia.length}
        placeholder={form.bioPlaceholder}
        error={errors.biografia?.message}
        {...register('biografia')}
      />

      <fieldset className="space-y-3">
        <legend className="flex items-center gap-2 text-label-md text-on-surface font-medium mb-1">
          <Icon name="info" size={18} className="text-secondary" />
          {form.relevantInfo}
          <span className="text-secondary font-normal">{form.optional}</span>
        </legend>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
          <CampoTexto
            id="perfil-idiomas"
            label={form.languagesLabel}
            icon="translate"
            placeholder={form.languagesPlaceholder}
            error={errors.idiomas?.message}
            {...register('idiomas')}
          />
          <CampoTexto
            id="perfil-jurisdicciones"
            label={form.jurisdictionsLabel}
            icon="account_balance"
            placeholder={form.jurisdictionsPlaceholder}
            error={errors.jurisdicciones?.message}
            {...register('jurisdicciones')}
          />
        </div>
      </fieldset>

      <fieldset className="space-y-3">
        <legend className="flex items-center gap-2 text-label-md text-on-surface font-medium">
          <Icon name="gavel" size={18} className="text-secondary" />
          {form.servicesLabel}
        </legend>
        <p className="text-body-sm text-secondary">{form.servicesHint(MAX_SERVICIOS)}</p>
        {servicios.fields.map((campo, indice) => (
          <div key={campo.id} className="flex flex-col sm:flex-row gap-2 sm:items-start">
            <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-2">
              <CampoTexto
                id={`perfil-servicio-${indice}`}
                label={`${form.serviceName} ${indice + 1}`}
                icon="work"
                maxLength={100}
                placeholder={form.serviceNamePlaceholder}
                error={errors.servicios?.[indice]?.nombre?.message}
                {...register(`servicios.${indice}.nombre`)}
              />
              <CampoTexto
                id={`perfil-servicio-desc-${indice}`}
                label={form.serviceDescription}
                labelHint={form.optional}
                icon="notes"
                maxLength={200}
                placeholder={form.serviceDescriptionPlaceholder}
                error={errors.servicios?.[indice]?.descripcion?.message}
                {...register(`servicios.${indice}.descripcion`)}
              />
            </div>
            {servicios.fields.length > 1 && (
              <button
                type="button"
                onClick={() => servicios.remove(indice)}
                aria-label={`${form.removeService} ${indice + 1}`}
                className="sm:mt-7 self-end sm:self-auto h-10 w-10 inline-flex items-center justify-center rounded-lg text-error hover:bg-error/10 cursor-pointer"
              >
                <Icon name="delete" size={18} />
              </button>
            )}
          </div>
        ))}
        {errors.servicios?.root?.message && <p className="text-body-sm text-error">{errors.servicios.root.message}</p>}
        {errors.servicios?.message && <p className="text-body-sm text-error">{errors.servicios.message}</p>}
        <button
          type="button"
          disabled={servicios.fields.length >= MAX_SERVICIOS}
          onClick={() => servicios.append({ nombre: '', descripcion: '' })}
          className="h-9 px-3 inline-flex items-center gap-1.5 rounded-lg bg-primary/10 text-primary text-label-md font-semibold hover:bg-primary/15 disabled:opacity-50 cursor-pointer"
        >
          <Icon name="add" size={18} />
          {form.addService}
        </button>
      </fieldset>

      <fieldset className="space-y-3">
        <legend className="flex items-center gap-2 text-label-md text-on-surface font-medium">
          <Icon name="payments" size={18} className="text-secondary" />
          {form.feesLabel}
        </legend>
        <p className="text-body-sm text-secondary">{form.feesNote}</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
          <CampoTexto
            id="perfil-consulta"
            label={form.initialFeeLabel}
            labelHint={form.initialFeeHint}
            icon="payments"
            inputMode="decimal"
            error={errors.consultaInicial?.message}
            {...register('consultaInicial')}
          />
          <CampoTexto
            id="perfil-hora"
            label={form.hourlyFeeLabel}
            labelHint={form.optional}
            icon="schedule"
            inputMode="decimal"
            error={errors.tarifaHora?.message}
            {...register('tarifaHora')}
          />
        </div>
      </fieldset>

      <div className="flex flex-col sm:flex-row gap-4 sm:items-start">
        {fotoUrl && <img src={fotoUrl} alt="" aria-hidden="true" className="w-20 h-20 rounded-full object-cover shrink-0" />}
        <div className="flex-1">
          <CampoArchivoRegistro
            label={form.photoLabel}
            opcional={form.optional}
            hint={form.photoHint}
            accept="image/jpeg,image/png"
            actual={fotoUrl ? (nombreFoto ?? { nombre: form.photoLabel, tamanoBytes: 0 }) : null}
            cargando={subirFoto.isPending}
            error={errorFoto ?? undefined}
            textos={{ choose: form.photoChoose, change: form.photoChange, remove: form.photoRemove, uploading: form.photoUploading }}
            onElegir={elegirFoto}
            onQuitar={() => {
              setValue('fotoUrl', null)
              setNombreFoto(null)
            }}
          />
        </div>
      </div>

      <SelectorDisponibilidad
        legend={form.availabilityLabel}
        opciones={disponibilidades}
        value={disponibilidad}
        registro={register('disponibilidad')}
        error={errors.disponibilidad?.message}
      />

      {error && (
        <AlertaError>
          <MensajeError
            tipo={error.tipo}
            mensajes={mensajes}
            enlaces={{
              sesion_expirada: { to: ROUTES.login, label: progresoRegistroContent.loginLink },
              conflicto: { to: ROUTES.validationStatus, label: mensajes.conflictoLink },
            }}
          />
        </AlertaError>
      )}

      <AccionesRegistro
        anterior={{ to: ROUTES.registerCredentials, label: actions.previous }}
        textoSiguiente={actions.next}
        textoCargando={actions.saving}
        iconoSiguiente="check_circle"
        cargando={isPending || subirFoto.isPending}
      />
    </form>
  )
}
