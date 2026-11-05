import { useForm, useWatch } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { MENSAJES_ERROR_API } from '@/api/errores'
import { Dialogo } from '@/components/ui/Dialogo'
import { EstadoError } from '@/components/ui/EstadoError'
import { CampoTexto } from '@/features/auth/components/CampoTexto'
import { CampoAreaTexto } from '@/features/auth/components/compartidos/CampoAreaTexto'
import { detalleExpedienteContent } from '../content/detalle-expediente.content'
import { useRegistrarActualizacion } from '../hooks/useExpedientes'
import { actualizacionSchema, type ActualizacionFormValues } from '../schemas/expediente.schema'

interface DialogoActualizacionProps {
  expedienteId: string
  abierto: boolean
  onCerrar: () => void
  onGuardado: () => void
}

/** E2 → "Registrar actualización" (seguimiento del caso). */
export function DialogoActualizacion({ expedienteId, abierto, onCerrar, onGuardado }: DialogoActualizacionProps) {
  const { updateDialog: textos, errors: mensajes } = detalleExpedienteContent

  return (
    <Dialogo abierto={abierto} onCerrar={onCerrar} titulo={textos.title} descripcion={textos.description} ancho="lg">
      <Formulario expedienteId={expedienteId} onCerrar={onCerrar} onGuardado={onGuardado} textos={textos} mensajes={mensajes} />
    </Dialogo>
  )
}

interface FormularioProps {
  expedienteId: string
  onCerrar: () => void
  onGuardado: () => void
  textos: typeof detalleExpedienteContent.updateDialog
  mensajes: typeof detalleExpedienteContent.errors
}

function Formulario({ expedienteId, onCerrar, onGuardado, textos, mensajes }: FormularioProps) {
  const registrar = useRegistrarActualizacion(expedienteId)
  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<ActualizacionFormValues>({
    resolver: zodResolver(actualizacionSchema),
    defaultValues: { titulo: '', descripcion: '', visibleCliente: true },
  })
  const descripcion = useWatch({ control, name: 'descripcion' })

  const guardar = handleSubmit((valores) => {
    registrar.mutate(
      { titulo: valores.titulo.trim(), descripcion: valores.descripcion.trim(), visibleCliente: valores.visibleCliente },
      { onSuccess: onGuardado },
    )
  })

  const error = registrar.error
    ? registrar.error.tipo === 'conflicto'
      ? mensajes.conflicto
      : MENSAJES_ERROR_API[registrar.error.tipo]
    : null

  return (
    <form onSubmit={guardar} noValidate className="flex flex-col gap-4">
      <CampoTexto
        id="actualizacion-titulo"
        label={textos.titleLabel}
        icon="title"
        maxLength={120}
        placeholder={textos.titlePlaceholder}
        error={errors.titulo?.message}
        {...register('titulo')}
      />
      <CampoAreaTexto
        id="actualizacion-descripcion"
        label={textos.body}
        icon="notes"
        rows={5}
        maxLength={1500}
        longitud={descripcion.length}
        placeholder={textos.bodyPlaceholder}
        error={errors.descripcion?.message}
        {...register('descripcion')}
      />
      <label className="flex items-start gap-3 p-3 rounded-lg bg-surface-container-low cursor-pointer">
        <input type="checkbox" className="mt-0.5 w-4 h-4 accent-primary cursor-pointer" {...register('visibleCliente')} />
        <span className="text-body-md text-on-surface">{textos.visible}</span>
      </label>
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
          disabled={registrar.isPending}
          className="h-11 px-5 rounded-lg bg-primary-container hover:bg-primary text-on-primary text-label-lg font-semibold disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
        >
          {registrar.isPending ? textos.saving : textos.submit}
        </button>
      </div>
    </form>
  )
}
