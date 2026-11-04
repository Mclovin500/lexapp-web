import { Controller, useForm, useWatch } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useNavigate } from 'react-router-dom'
import { ROUTES } from '@/app/routes'
import { Icon } from '@/components/ui/Icon'
import { areasPractica, disponibilidades, especializaciones } from '../../content/catalogos.content'
import { perfilProfesionalContent } from '../../content/perfil-profesional.content'
import { progresoRegistroContent } from '../../content/progreso-registro.content'
import { useFinalizarRegistro } from '../../hooks/useRegistroProfesional'
import {
  LIMITE_BIOGRAFIA,
  MAX_ESPECIALIZACIONES,
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

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<PerfilProfesionalFormValues>({
    resolver: zodResolver(perfilProfesionalSchema),
    defaultValues: aValoresFormulario(guardado),
  })

  const [biografia, disponibilidad] = useWatch({ control, name: ['biografia', 'disponibilidad'] })

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
        cargando={isPending}
      />
    </form>
  )
}
