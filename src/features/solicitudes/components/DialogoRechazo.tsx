import { useEffect, useRef } from 'react'
import { useForm, useWatch } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { MENSAJES_ERROR_API } from '@/api/errores'
import { EstadoError } from '@/components/ui/EstadoError'
import { detalleSolicitudContent } from '../content/detalle-solicitud.content'
import { useRechazarSolicitud } from '../hooks/useSolicitudes'
import { LIMITE_MOTIVO_RECHAZO, rechazoSchema, type RechazoFormValues } from '../schemas/rechazo.schema'

interface DialogoRechazoProps {
  solicitudId: string
  abierto: boolean
  onCerrar: () => void
  onRechazada: () => void
}

/** Diálogo modal nativo (`<dialog>`): atrapa el foco y se cierra con Esc. */
export function DialogoRechazo({ solicitudId, abierto, onCerrar, onRechazada }: DialogoRechazoProps) {
  const { rejectDialog, errors: mensajes } = detalleSolicitudContent
  const dialogo = useRef<HTMLDialogElement>(null)
  const rechazar = useRechazarSolicitud(solicitudId)
  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm<RechazoFormValues>({ resolver: zodResolver(rechazoSchema), defaultValues: { motivo: '' } })
  const motivo = useWatch({ control, name: 'motivo' })

  useEffect(() => {
    const elemento = dialogo.current
    if (!elemento) return
    if (abierto && !elemento.open) elemento.showModal()
    if (!abierto && elemento.open) elemento.close()
  }, [abierto])

  const cerrar = () => {
    reset()
    rechazar.reset()
    onCerrar()
  }

  const onSubmit = (valores: RechazoFormValues) => {
    rechazar.mutate(valores, {
      onSuccess: () => {
        reset()
        onRechazada()
      },
    })
  }

  const mensajeError = rechazar.error
    ? rechazar.error.tipo === 'conflicto'
      ? mensajes.conflicto
      : MENSAJES_ERROR_API[rechazar.error.tipo]
    : null

  return (
    <dialog
      ref={dialogo}
      onClose={cerrar}
      aria-labelledby="rechazo-titulo"
      aria-describedby="rechazo-descripcion"
      className="m-auto w-[min(32rem,calc(100%-2rem))] rounded-xl bg-surface-container-lowest p-0 text-on-surface shadow-2xl backdrop:bg-on-surface/40"
    >
      <form onSubmit={handleSubmit(onSubmit)} noValidate className="p-6 flex flex-col gap-4">
        <div>
          <h2 id="rechazo-titulo" className="text-headline-sm">
            {rejectDialog.title}
          </h2>
          <p id="rechazo-descripcion" className="mt-1 text-body-sm text-secondary">
            {rejectDialog.description}
          </p>
        </div>

        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <label htmlFor="rechazo-motivo" className="text-label-md font-medium">
              {rejectDialog.reasonLabel}
            </label>
            <span className="text-label-sm text-secondary tabular-nums" aria-live="polite">
              {motivo.length} / {LIMITE_MOTIVO_RECHAZO}
            </span>
          </div>
          <textarea
            id="rechazo-motivo"
            rows={4}
            maxLength={LIMITE_MOTIVO_RECHAZO}
            autoFocus
            placeholder={rejectDialog.reasonPlaceholder}
            aria-invalid={Boolean(errors.motivo)}
            aria-describedby={errors.motivo ? 'rechazo-motivo-error' : undefined}
            className={`w-full p-3 rounded-lg bg-surface-container-low text-body-md placeholder:text-outline resize-y focus:outline-none focus:ring-2 focus:ring-primary-container ${
              errors.motivo ? 'ring-1 ring-error' : ''
            }`}
            {...register('motivo')}
          />
          {errors.motivo?.message && (
            <p id="rechazo-motivo-error" className="text-body-sm text-error">
              {errors.motivo.message}
            </p>
          )}
        </div>

        {mensajeError && <EstadoError mensaje={mensajeError} />}

        <div className="flex flex-col-reverse sm:flex-row justify-end gap-2">
          <button
            type="button"
            onClick={cerrar}
            className="h-10 px-4 rounded-lg bg-surface-container text-label-md font-semibold hover:bg-surface-container-high cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
          >
            {rejectDialog.cancel}
          </button>
          <button
            type="submit"
            disabled={rechazar.isPending}
            className="h-10 px-4 rounded-lg bg-error text-on-error text-label-md font-semibold hover:opacity-90 cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-error"
          >
            {rechazar.isPending ? rejectDialog.confirming : rejectDialog.confirm}
          </button>
        </div>
      </form>
    </dialog>
  )
}
