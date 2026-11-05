import { useFieldArray, useForm, useWatch } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { MENSAJES_ERROR_API } from '@/api/errores'
import { Dialogo } from '@/components/ui/Dialogo'
import { EstadoCarga } from '@/components/ui/EstadoCarga'
import { EstadoError } from '@/components/ui/EstadoError'
import { agendaContent, DIAS_SEMANA, DURACIONES_MINUTOS } from '../content/agenda.content'
import { useDisponibilidad, useGuardarDisponibilidad } from '../hooks/useAgenda'
import { disponibilidadSchema, type DisponibilidadFormValues } from '../schemas/agenda.schema'
import type { Disponibilidad } from '../types/agenda.types'

interface DialogoDisponibilidadProps {
  abierto: boolean
  onCerrar: () => void
  onGuardada: () => void
}

/** G1 "Crear disponibilidad": horarios en que los clientes pueden pedir reuniones virtuales. */
export function DialogoDisponibilidad({ abierto, onCerrar, onGuardada }: DialogoDisponibilidadProps) {
  const { availabilityDialog } = agendaContent
  return (
    <Dialogo abierto={abierto} onCerrar={onCerrar} titulo={availabilityDialog.title} descripcion={availabilityDialog.description} ancho="lg">
      <Cargador onCerrar={onCerrar} onGuardada={onGuardada} />
    </Dialogo>
  )
}

function Cargador({ onCerrar, onGuardada }: Omit<DialogoDisponibilidadProps, 'abierto'>) {
  const disponibilidad = useDisponibilidad(true)
  if (disponibilidad.isPending) return <EstadoCarga texto={agendaContent.availabilityDialog.loading} />
  if (disponibilidad.isError) {
    return <EstadoError mensaje={MENSAJES_ERROR_API[disponibilidad.error.tipo]} onReintentar={() => void disponibilidad.refetch()} />
  }
  return <Formulario inicial={disponibilidad.data} onCerrar={onCerrar} onGuardada={onGuardada} />
}

/** Lunes primero, como en el calendario. */
const ORDEN_DIAS = [1, 2, 3, 4, 5, 6, 0]

function Formulario({ inicial, onCerrar, onGuardada }: { inicial: Disponibilidad; onCerrar: () => void; onGuardada: () => void }) {
  const { availabilityDialog: textos } = agendaContent
  const guardar = useGuardarDisponibilidad()
  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<DisponibilidadFormValues>({
    resolver: zodResolver(disponibilidadSchema),
    defaultValues: {
      dias: ORDEN_DIAS.map((dia) => inicial.dias.find((d) => d.dia === dia) ?? { dia, activo: false, inicio: '09:00', fin: '18:00' }),
      duracionMinutos: String(inicial.duracionMinutos),
      margenMinutos: String(inicial.margenMinutos),
    },
  })
  const { fields } = useFieldArray({ control, name: 'dias' })
  const dias = useWatch({ control, name: 'dias' })

  const enviar = handleSubmit((valores) => {
    guardar.mutate(
      { dias: valores.dias, duracionMinutos: Number(valores.duracionMinutos), margenMinutos: Number(valores.margenMinutos) },
      { onSuccess: onGuardada },
    )
  })

  const campoHora =
    'h-10 px-2 rounded-lg bg-surface-container-low text-body-md text-on-surface tabular-nums disabled:opacity-50 focus:outline-none focus:ring-2 focus:ring-primary-container'
  const campoSelect =
    'w-full h-11 px-3 rounded-lg bg-surface-container-low text-body-md text-on-surface cursor-pointer focus:outline-none focus:ring-2 focus:ring-primary-container'

  return (
    <form onSubmit={enviar} noValidate className="flex flex-col gap-4">
      <ul className="flex flex-col gap-2">
        {fields.map((campo, indice) => {
          const activo = dias[indice]?.activo ?? false
          const nombre = DIAS_SEMANA[campo.dia]
          return (
            <li key={campo.id} className="flex flex-wrap items-center gap-3 p-3 rounded-lg bg-surface-container-low/60">
              <label className="flex items-center gap-2 w-32 cursor-pointer">
                <input type="checkbox" className="w-4 h-4 accent-primary cursor-pointer" {...register(`dias.${indice}.activo`)} />
                <span className="text-label-md text-on-surface font-semibold">{nombre}</span>
              </label>
              <label className="flex items-center gap-2 text-body-sm text-secondary">
                {textos.from}
                <input type="time" step={900} disabled={!activo} aria-label={`${nombre}: hora inicial`} className={campoHora} {...register(`dias.${indice}.inicio`)} />
              </label>
              <label className="flex items-center gap-2 text-body-sm text-secondary">
                {textos.to}
                <input type="time" step={900} disabled={!activo} aria-label={`${nombre}: hora final`} className={campoHora} {...register(`dias.${indice}.fin`)} />
              </label>
            </li>
          )
        })}
      </ul>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <label className="flex flex-col gap-1.5 text-label-md text-on-surface font-medium">
          {textos.duration}
          <select className={campoSelect} {...register('duracionMinutos')}>
            {DURACIONES_MINUTOS.map((d) => (
              <option key={d} value={d}>
                {agendaContent.scheduleDialog.minutes(d)}
              </option>
            ))}
          </select>
        </label>
        <label className="flex flex-col gap-1.5 text-label-md text-on-surface font-medium">
          {textos.margin}
          <select className={campoSelect} {...register('margenMinutos')}>
            {textos.marginOptions.map((m) => (
              <option key={m} value={m}>
                {textos.minutes(m)}
              </option>
            ))}
          </select>
        </label>
      </div>
      {(errors.dias || guardar.isError) && (
        <EstadoError
          mensaje={guardar.error && guardar.error.tipo !== 'datos_invalidos' ? MENSAJES_ERROR_API[guardar.error.tipo] : textos.invalid}
        />
      )}
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
          disabled={guardar.isPending}
          className="h-11 px-5 rounded-lg bg-primary-container hover:bg-primary text-on-primary text-label-lg font-semibold disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
        >
          {guardar.isPending ? textos.saving : textos.submit}
        </button>
      </div>
    </form>
  )
}
