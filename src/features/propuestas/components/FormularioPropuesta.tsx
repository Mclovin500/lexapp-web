import { useState } from 'react'
import { useForm, useWatch } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useNavigate } from 'react-router-dom'
import { ROUTES } from '@/app/routes'
import { MENSAJES_ERROR_API } from '@/api/errores'
import { EstadoError } from '@/components/ui/EstadoError'
import { Icon } from '@/components/ui/Icon'
import { hoyIso } from '@/lib/fechas'
import { CampoTexto } from '@/features/auth/components/CampoTexto'
import { CampoAreaTexto } from '@/features/auth/components/compartidos/CampoAreaTexto'
import { CampoSelect } from '@/features/auth/components/compartidos/CampoSelect'
import type { OpcionCliente } from '@/features/clientes/types/clientes.types'
import { useOpcionesSolicitudes } from '@/features/solicitudes/hooks/useSolicitudes'
import { nuevaPropuestaContent } from '../content/nueva-propuesta.content'
import { useGuardarPropuesta } from '../hooks/usePropuestas'
import { propuestaSchema, type PropuestaFormValues } from '../schemas/propuesta.schema'
import type {
  AccionGuardarPropuesta,
  EstadoPropuestaGuardada,
  PeticionPropuesta,
} from '../types/propuestas.types'
import { ConceptosCobro } from './ConceptosCobro'
import { SeccionFormulario } from './SeccionFormulario'
import { VistaPreviaPropuesta } from './VistaPreviaPropuesta'

function aPeticion(valores: PropuestaFormValues, accion: AccionGuardarPropuesta): PeticionPropuesta {
  return {
    clienteId: valores.clienteId,
    solicitudId: valores.solicitudId || null,
    servicio: valores.servicio,
    descripcion: valores.descripcion,
    alcance: valores.alcance,
    honorarios: Number(valores.honorarios),
    conceptos: valores.conceptos.map((c) => ({ concepto: c.concepto, importe: Number(c.importe) })),
    condiciones: valores.condiciones,
    tiempoEstimado: valores.tiempoEstimado,
    fechaVigencia: valores.fechaVigencia,
    accion,
  }
}

interface FormularioPropuestaProps {
  /** `null` = propuesta nueva; con id = edición de un borrador. */
  propuestaId: string | null
  valoresIniciales: PropuestaFormValues
  /** Solicitud ya ligada al borrador (puede no estar abierta). */
  solicitudInicial: { valor: string; etiqueta: string } | null
  clientes: OpcionCliente[]
}

/** D1: secciones del formulario + vista previa. Guardar borrador o Enviar → D2. */
export function FormularioPropuesta({ propuestaId, valoresIniciales, solicitudInicial, clientes }: FormularioPropuestaProps) {
  const navigate = useNavigate()
  const { sections, form, actions, errors: mensajes } = nuevaPropuestaContent
  const guardar = useGuardarPropuesta(propuestaId)
  const [accionEnCurso, setAccionEnCurso] = useState<AccionGuardarPropuesta | null>(null)

  const {
    register,
    handleSubmit,
    control,
    setValue,
    formState: { errors },
  } = useForm<PropuestaFormValues>({ resolver: zodResolver(propuestaSchema), defaultValues: valoresIniciales })

  const [clienteId, descripcion, alcance, condiciones] = useWatch({
    control,
    name: ['clienteId', 'descripcion', 'alcance', 'condiciones'],
  })
  const solicitudes = useOpcionesSolicitudes(clienteId)
  // Al editar, la solicitud ya ligada puede no estar abierta: se conserva como opción.
  const opcionesSolicitud = [
    ...(solicitudes.data ?? []).map((s) => ({ valor: s.id, etiqueta: `${s.folio} · ${s.asunto}` })),
  ]
  if (solicitudInicial && clienteId === valoresIniciales.clienteId && !opcionesSolicitud.some((o) => o.valor === solicitudInicial.valor)) {
    opcionesSolicitud.unshift(solicitudInicial)
  }

  const guardarCon = (accion: AccionGuardarPropuesta) =>
    handleSubmit((valores) => {
      setAccionEnCurso(accion)
      guardar.mutate(aPeticion(valores, accion), {
        onSuccess: (respuesta) => {
          const estado: EstadoPropuestaGuardada = {
            propuestaGuardada: respuesta.estado === 'borrador' ? 'borrador' : 'enviada',
          }
          navigate(ROUTES.proposals, { state: estado })
        },
        onSettled: () => setAccionEnCurso(null),
      })
    })

  const mensajeError = guardar.error
    ? guardar.error.tipo === 'datos_invalidos' || guardar.error.tipo === 'conflicto'
      ? mensajes[guardar.error.tipo]
      : MENSAJES_ERROR_API[guardar.error.tipo]
    : null

  return (
    <form onSubmit={guardarCon('enviar')} noValidate className="grid grid-cols-1 xl:grid-cols-12 gap-6 items-start">
      <div className="xl:col-span-8 flex flex-col gap-6">
        <SeccionFormulario numero={1} titulo={sections.client.title} descripcion={sections.client.description}>
          <CampoSelect
            id="propuesta-cliente"
            label={form.client}
            icon="person"
            opciones={clientes.map((c) => ({ valor: c.id, etiqueta: c.organizacion ? `${c.nombre} · ${c.organizacion}` : c.nombre }))}
            placeholder={form.clientPlaceholder}
            error={errors.clienteId?.message}
            {...register('clienteId', { onChange: () => setValue('solicitudId', '') })}
          />
          <div className="space-y-1">
            <CampoSelect
              id="propuesta-solicitud"
              label={form.request}
              labelHint={<span className="text-secondary font-normal">{form.optional}</span>}
              icon="inbox"
              opciones={opcionesSolicitud}
              placeholder={form.requestNone}
              placeholderSeleccionable
              disabled={!clienteId}
              {...register('solicitudId')}
            />
            <p className="text-body-sm text-secondary">{form.requestHint}</p>
          </div>
        </SeccionFormulario>

        <SeccionFormulario numero={2} titulo={sections.service.title} descripcion={sections.service.description}>
          <CampoTexto
            id="propuesta-servicio"
            label={form.service}
            icon="gavel"
            placeholder={form.servicePlaceholder}
            error={errors.servicio?.message}
            {...register('servicio')}
          />
          <CampoAreaTexto
            id="propuesta-descripcion"
            label={form.description}
            icon="description"
            rows={4}
            maxLength={2000}
            longitud={descripcion.length}
            placeholder={form.descriptionPlaceholder}
            error={errors.descripcion?.message}
            {...register('descripcion')}
          />
          <CampoAreaTexto
            id="propuesta-alcance"
            label={form.scope}
            labelHint={<span className="text-secondary font-normal">{form.optional}</span>}
            icon="checklist"
            rows={3}
            maxLength={2000}
            longitud={alcance.length}
            placeholder={form.scopePlaceholder}
            error={errors.alcance?.message}
            {...register('alcance')}
          />
        </SeccionFormulario>

        <SeccionFormulario numero={3} titulo={sections.fees.title} descripcion={sections.fees.description}>
          <div className="sm:max-w-xs">
            <CampoTexto
              id="propuesta-honorarios"
              label={form.fees}
              icon="payments"
              inputMode="decimal"
              placeholder={form.feesPlaceholder}
              className="text-headline-sm tabular-nums"
              error={errors.honorarios?.message}
              {...register('honorarios')}
            />
          </div>
          <ConceptosCobro control={control} register={register} errors={errors} />
        </SeccionFormulario>

        <SeccionFormulario numero={4} titulo={sections.conditions.title} descripcion={sections.conditions.description}>
          <CampoAreaTexto
            id="propuesta-condiciones"
            label={form.conditions}
            icon="contract"
            rows={4}
            maxLength={3000}
            longitud={condiciones.length}
            placeholder={form.conditionsPlaceholder}
            error={errors.condiciones?.message}
            {...register('condiciones')}
          />
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <CampoTexto
              id="propuesta-tiempo"
              label={form.estimatedTime}
              icon="schedule"
              placeholder={form.estimatedTimePlaceholder}
              error={errors.tiempoEstimado?.message}
              {...register('tiempoEstimado')}
            />
            <CampoTexto
              id="propuesta-vigencia"
              label={form.validUntil}
              icon="event"
              type="date"
              min={hoyIso()}
              error={errors.fechaVigencia?.message}
              {...register('fechaVigencia')}
            />
          </div>
        </SeccionFormulario>

        {mensajeError && <EstadoError mensaje={mensajeError} />}

        <div className="flex flex-col-reverse sm:flex-row justify-end gap-3">
          <button
            type="button"
            onClick={guardarCon('borrador')}
            disabled={guardar.isPending}
            className="inline-flex h-11 px-5 items-center justify-center gap-2 rounded-lg bg-surface-container text-on-surface text-label-lg font-semibold hover:bg-surface-container-high cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
          >
            <Icon name="bookmark" size={20} />
            {accionEnCurso === 'borrador' ? actions.saving : actions.saveDraft}
          </button>
          <button
            type="submit"
            disabled={guardar.isPending}
            className="inline-flex h-11 px-5 items-center justify-center gap-2 rounded-lg bg-primary-container hover:bg-primary text-on-primary text-label-lg font-semibold shadow-md cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
          >
            <Icon name="send" size={20} />
            {accionEnCurso === 'enviar' ? actions.sending : actions.send}
          </button>
        </div>
      </div>

      <div className="xl:col-span-4 xl:sticky xl:top-24">
        <VistaPreviaPropuesta control={control} clientes={clientes} />
      </div>
    </form>
  )
}
