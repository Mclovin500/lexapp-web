import { useForm, useWatch } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { MENSAJES_ERROR_API } from '@/api/errores'
import { Dialogo } from '@/components/ui/Dialogo'
import { EstadoCarga } from '@/components/ui/EstadoCarga'
import { EstadoError } from '@/components/ui/EstadoError'
import { CampoTexto } from '@/features/auth/components/CampoTexto'
import { CampoAreaTexto } from '@/features/auth/components/compartidos/CampoAreaTexto'
import { CampoSelect } from '@/features/auth/components/compartidos/CampoSelect'
import { useOpcionesClientes } from '@/features/clientes/hooks/useOpcionesClientes'
import type { OpcionCliente } from '@/features/clientes/types/clientes.types'
import { useOpcionesExpedientes } from '@/features/expedientes/hooks/useOpcionesExpedientes'
import { hoyIso } from '@/lib/fechas'
import { agendaContent, DURACIONES_MINUTOS } from '../content/agenda.content'
import { useProgramarReunion } from '../hooks/useAgenda'
import { reunionSchema, type ReunionFormValues } from '../schemas/agenda.schema'

export interface PrecargaReunion {
  fecha: string
  clienteId?: string
  expedienteId?: string | null
}

interface DialogoProgramarReunionProps {
  precarga: PrecargaReunion | null
  onCerrar: () => void
  onProgramada: (fecha: string) => void
}

/** G1 "Programar reunión": siempre virtual (regla 9.2), sin dirección ni sede. */
export function DialogoProgramarReunion({ precarga, onCerrar, onProgramada }: DialogoProgramarReunionProps) {
  const { scheduleDialog } = agendaContent
  return (
    <Dialogo abierto={precarga !== null} onCerrar={onCerrar} titulo={scheduleDialog.title} descripcion={scheduleDialog.description} ancho="lg">
      {precarga && <Cargador precarga={precarga} onCerrar={onCerrar} onProgramada={onProgramada} />}
    </Dialogo>
  )
}

function Cargador({ precarga, onCerrar, onProgramada }: { precarga: PrecargaReunion; onCerrar: () => void; onProgramada: (fecha: string) => void }) {
  const clientes = useOpcionesClientes()
  if (clientes.isPending) return <EstadoCarga texto={agendaContent.scheduleDialog.loadingClients} />
  if (clientes.isError) return <EstadoError mensaje={MENSAJES_ERROR_API[clientes.error.tipo]} onReintentar={() => void clientes.refetch()} />
  return <Formulario clientes={clientes.data} precarga={precarga} onCerrar={onCerrar} onProgramada={onProgramada} />
}

interface FormularioProps {
  clientes: OpcionCliente[]
  precarga: PrecargaReunion
  onCerrar: () => void
  onProgramada: (fecha: string) => void
}

function Formulario({ clientes, precarga, onCerrar, onProgramada }: FormularioProps) {
  const { scheduleDialog: textos, errors: mensajes } = agendaContent
  const programar = useProgramarReunion()
  const clienteInicial = clientes.some((c) => c.id === precarga.clienteId) ? (precarga.clienteId ?? '') : ''
  const {
    register,
    handleSubmit,
    control,
    setValue,
    formState: { errors },
  } = useForm<ReunionFormValues>({
    resolver: zodResolver(reunionSchema),
    defaultValues: {
      clienteId: clienteInicial,
      expedienteId: clienteInicial ? (precarga.expedienteId ?? '') : '',
      titulo: '',
      fecha: precarga.fecha < hoyIso() ? hoyIso() : precarga.fecha,
      hora: '10:00',
      duracion: '45',
      notas: '',
    },
  })
  const [clienteId, notas] = useWatch({ control, name: ['clienteId', 'notas'] })
  const expedientes = useOpcionesExpedientes(clienteId)

  const guardar = handleSubmit((valores) => {
    programar.mutate(
      {
        clienteId: valores.clienteId,
        expedienteId: valores.expedienteId || null,
        titulo: valores.titulo.trim(),
        inicio: new Date(`${valores.fecha}T${valores.hora}`).toISOString(),
        duracionMinutos: Number(valores.duracion),
        notas: valores.notas.trim(),
      },
      { onSuccess: () => onProgramada(valores.fecha) },
    )
  })

  const error = programar.error
    ? programar.error.tipo === 'conflicto' || programar.error.tipo === 'datos_invalidos'
      ? mensajes[programar.error.tipo]
      : MENSAJES_ERROR_API[programar.error.tipo]
    : null

  return (
    <form onSubmit={guardar} noValidate className="flex flex-col gap-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <CampoSelect
          id="reunion-cliente"
          label={textos.client}
          icon="person"
          opciones={clientes.map((c) => ({ valor: c.id, etiqueta: c.organizacion ? `${c.nombre} · ${c.organizacion}` : c.nombre }))}
          placeholder={textos.clientPlaceholder}
          error={errors.clienteId?.message}
          {...register('clienteId', { onChange: () => setValue('expedienteId', '') })}
        />
        <CampoSelect
          id="reunion-expediente"
          label={textos.case}
          labelHint={<span className="text-secondary font-normal">{textos.optional}</span>}
          icon="folder_managed"
          opciones={(expedientes.data ?? []).map((e) => ({ valor: e.id, etiqueta: `${e.folio} · ${e.asunto}` }))}
          placeholder={textos.caseNone}
          placeholderSeleccionable
          disabled={!clienteId || expedientes.isPending}
          {...register('expedienteId')}
        />
      </div>
      <CampoTexto
        id="reunion-titulo"
        label={textos.subject}
        icon="title"
        maxLength={120}
        placeholder={textos.subjectPlaceholder}
        error={errors.titulo?.message}
        {...register('titulo')}
      />
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <CampoTexto id="reunion-fecha" type="date" min={hoyIso()} label={textos.date} icon="event" error={errors.fecha?.message} {...register('fecha')} />
        <CampoTexto id="reunion-hora" type="time" step={300} label={textos.time} icon="schedule" error={errors.hora?.message} {...register('hora')} />
        <CampoSelect
          id="reunion-duracion"
          label={textos.duration}
          icon="timer"
          opciones={DURACIONES_MINUTOS.map((d) => ({ valor: String(d), etiqueta: textos.minutes(d) }))}
          placeholder={textos.duration}
          error={errors.duracion?.message}
          {...register('duracion')}
        />
      </div>
      <CampoAreaTexto
        id="reunion-notas"
        label={textos.notes}
        labelHint={<span className="text-secondary font-normal">{textos.optional}</span>}
        icon="notes"
        rows={3}
        maxLength={500}
        longitud={notas.length}
        placeholder={textos.notesPlaceholder}
        error={errors.notas?.message}
        {...register('notas')}
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
          disabled={programar.isPending}
          className="h-11 px-5 rounded-lg bg-primary-container hover:bg-primary text-on-primary text-label-lg font-semibold disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
        >
          {programar.isPending ? textos.saving : textos.submit}
        </button>
      </div>
    </form>
  )
}
