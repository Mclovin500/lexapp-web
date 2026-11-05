import { useForm, useWatch } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { MENSAJES_ERROR_API } from '@/api/errores'
import { Dialogo } from '@/components/ui/Dialogo'
import { EstadoError } from '@/components/ui/EstadoError'
import { Icon } from '@/components/ui/Icon'
import { CampoAreaTexto } from '@/features/auth/components/compartidos/CampoAreaTexto'
import { MensajeCampo } from '@/features/auth/components/CampoTexto'
import { detalleExpedienteContent } from '../content/detalle-expediente.content'
import { estadosExpediente } from '../content/estados-expediente.content'
import { useCambiarEstadoExpediente } from '../hooks/useExpedientes'
import { cambioEstadoSchema, type CambioEstadoFormValues } from '../schemas/expediente.schema'
import type { EstadoExpediente } from '../types/expedientes.types'

interface DialogoCambioEstadoProps {
  expedienteId: string
  estadoActual: EstadoExpediente
  abierto: boolean
  onCerrar: () => void
  onGuardado: () => void
}

const ORDEN: EstadoExpediente[] = ['activo', 'en_espera', 'finalizado']

/** E2 → "Cambiar estado": activo, en espera, finalizado (o reabrir). Queda en el historial. */
export function DialogoCambioEstado({ expedienteId, estadoActual, abierto, onCerrar, onGuardado }: DialogoCambioEstadoProps) {
  const { statusDialog: textos } = detalleExpedienteContent
  return (
    <Dialogo abierto={abierto} onCerrar={onCerrar} titulo={textos.title} descripcion={textos.description} ancho="lg">
      <Formulario expedienteId={expedienteId} estadoActual={estadoActual} onCerrar={onCerrar} onGuardado={onGuardado} />
    </Dialogo>
  )
}

function Formulario({ expedienteId, estadoActual, onCerrar, onGuardado }: Omit<DialogoCambioEstadoProps, 'abierto'>) {
  const { statusDialog: textos, errors: mensajes } = detalleExpedienteContent
  const cambiar = useCambiarEstadoExpediente(expedienteId)
  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<CambioEstadoFormValues>({
    resolver: zodResolver(cambioEstadoSchema),
    defaultValues: { estado: ORDEN.find((e) => e !== estadoActual), nota: '' },
  })
  const [seleccionado, nota] = useWatch({ control, name: ['estado', 'nota'] })

  const guardar = handleSubmit((valores) => {
    cambiar.mutate({ estado: valores.estado, nota: valores.nota.trim() }, { onSuccess: onGuardado })
  })

  const error = cambiar.error
    ? cambiar.error.tipo === 'conflicto'
      ? mensajes.conflicto
      : MENSAJES_ERROR_API[cambiar.error.tipo]
    : null

  return (
    <form onSubmit={guardar} noValidate className="flex flex-col gap-4">
      <fieldset className="flex flex-col gap-2">
        <legend className="mb-2 text-label-md text-on-surface font-medium">{textos.legend}</legend>
        {ORDEN.map((estado) => {
          const estilo = estadosExpediente[estado]
          const actual = estado === estadoActual
          return (
            <label
              key={estado}
              className={`flex items-start gap-3 p-3 rounded-lg border transition-colors ${
                actual ? 'opacity-60 cursor-not-allowed border-transparent bg-surface-container-low' : 'cursor-pointer'
              } ${seleccionado === estado ? 'border-primary bg-primary-container/5' : 'border-transparent bg-surface-container-low'}`}
            >
              <input type="radio" value={estado} disabled={actual} className="mt-1 accent-primary" {...register('estado')} />
              <Icon name={estilo.icon} size={20} className="mt-0.5 text-primary" />
              <span>
                <span className="block text-label-lg text-on-surface font-semibold">
                  {estilo.label}
                  {actual && <span className="ml-2 text-label-sm text-secondary font-normal">({textos.current})</span>}
                </span>
                <span className="block text-body-sm text-secondary">{estilo.descripcion}</span>
              </span>
            </label>
          )
        })}
        {errors.estado?.message && <MensajeCampo id="cambio-estado-error" mensaje={errors.estado.message} />}
      </fieldset>
      <CampoAreaTexto
        id="cambio-estado-nota"
        label={textos.note}
        icon="edit_note"
        rows={3}
        maxLength={500}
        longitud={nota.length}
        placeholder={textos.notePlaceholder}
        error={errors.nota?.message}
        {...register('nota')}
      />
      {error && <EstadoError mensaje={error} />}
      <div className="flex flex-col-reverse sm:flex-row sm:justify-end gap-2">
        <button
          type="button"
          onClick={onCerrar}
          className="h-11 px-5 rounded-lg bg-surface-container text-on-surface text-label-lg font-semibold hover:bg-surface-container-high cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
        >
          {textos.cancel}
        </button>
        <button
          type="submit"
          disabled={cambiar.isPending}
          className="h-11 px-5 rounded-lg bg-primary-container hover:bg-primary text-on-primary text-label-lg font-semibold disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
        >
          {cambiar.isPending ? textos.saving : textos.submit}
        </button>
      </div>
    </form>
  )
}
