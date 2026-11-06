import { useForm, useWatch } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { generatePath, Link, useNavigate } from 'react-router-dom'
import { ROUTES } from '@/app/routes'
import { MENSAJES_ERROR_API } from '@/api/errores'
import { EstadoError } from '@/components/ui/EstadoError'
import { Icon } from '@/components/ui/Icon'
import { formatearFechaCorta } from '@/lib/fechas'
import { esImporteValido } from '@/lib/importes'
import { formatearMonto } from '@/lib/moneda'
import { CampoTexto } from '@/features/auth/components/CampoTexto'
import { CampoAreaTexto } from '@/features/auth/components/compartidos/CampoAreaTexto'
import { CampoSelect } from '@/features/auth/components/compartidos/CampoSelect'
import type { OpcionCliente } from '@/features/clientes/types/clientes.types'
import { useOpcionesExpedientes } from '@/features/expedientes/hooks/useOpcionesExpedientes'
import { cobroContent } from '../content/cobro.content'
import { useCrearCobroAdicional } from '../hooks/usePagos'
import { cobroSchema, type CobroFormValues } from '../schemas/cobro.schema'
import type { EstadoCobroEnviado } from '../types/pagos.types'

interface FormularioCobroProps {
  clientes: OpcionCliente[]
  valoresIniciales: CobroFormValues
  /** Destino de "Cancelar": D3 o el expediente de origen (E2). */
  rutaCancelar: string
}

/** D4: datos del cobro + resumen en vivo. Enviar → D5 del movimiento creado. */
export function FormularioCobro({ clientes, valoresIniciales, rutaCancelar }: FormularioCobroProps) {
  const navigate = useNavigate()
  const { form, summary, actions, errors: mensajes } = cobroContent
  const crear = useCrearCobroAdicional()

  const {
    register,
    handleSubmit,
    control,
    setValue,
    formState: { errors },
  } = useForm<CobroFormValues>({ resolver: zodResolver(cobroSchema), defaultValues: valoresIniciales })

  const [clienteId, expedienteId, concepto, descripcion, importe, fechaEmision, fechaLimite] = useWatch({
    control,
    name: ['clienteId', 'expedienteId', 'concepto', 'descripcion', 'importe', 'fechaEmision', 'fechaLimite'],
  })
  const expedientes = useOpcionesExpedientes(clienteId)
  const opcionesExpediente = (expedientes.data ?? []).map((e) => ({ valor: e.id, etiqueta: `${e.folio} · ${e.asunto}` }))
  const cliente = clientes.find((c) => c.id === clienteId)
  const expediente = expedientes.data?.find((e) => e.id === expedienteId)

  const enviar = handleSubmit((valores) => {
    crear.mutate(
      {
        clienteId: valores.clienteId,
        expedienteId: valores.expedienteId,
        concepto: valores.concepto.trim(),
        descripcion: valores.descripcion.trim(),
        importe: Number(valores.importe),
        fechaEmision: valores.fechaEmision,
        fechaLimite: valores.fechaLimite || null,
      },
      {
        onSuccess: ({ id }) => {
          const estado: EstadoCobroEnviado = { cobroEnviado: true }
          navigate(generatePath(ROUTES.paymentDetail, { movimientoId: id }), { replace: true, state: estado })
        },
      },
    )
  })

  const mensajeError = crear.error
    ? crear.error.tipo === 'datos_invalidos'
      ? mensajes.datos_invalidos
      : MENSAJES_ERROR_API[crear.error.tipo]
    : null

  const placeholderExpediente = !clienteId
    ? form.caseNoClient
    : expedientes.data && expedientes.data.length === 0
      ? form.caseEmpty
      : form.casePlaceholder

  const filas: { etiqueta: string; valor: string }[] = [
    { etiqueta: summary.client, valor: cliente?.nombre ?? summary.pending },
    { etiqueta: summary.case, valor: expediente?.folio ?? summary.pending },
    { etiqueta: summary.concept, valor: concepto.trim() || summary.pending },
    { etiqueta: summary.date, valor: fechaEmision ? formatearFechaCorta(fechaEmision) : summary.pending },
    { etiqueta: summary.dueDate, valor: fechaLimite ? formatearFechaCorta(fechaLimite) : summary.none },
  ]

  return (
    <form onSubmit={enviar} noValidate className="grid grid-cols-1 xl:grid-cols-12 gap-6 items-start">
      <div className="xl:col-span-8 flex flex-col gap-5 p-6 rounded-xl bg-surface-container-lowest shadow-sm">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <CampoSelect
            id="cobro-cliente"
            label={form.client}
            icon="person"
            opciones={clientes.map((c) => ({ valor: c.id, etiqueta: c.organizacion ? `${c.nombre} · ${c.organizacion}` : c.nombre }))}
            placeholder={form.clientPlaceholder}
            error={errors.clienteId?.message}
            {...register('clienteId', { onChange: () => setValue('expedienteId', '') })}
          />
          <CampoSelect
            id="cobro-expediente"
            label={form.case}
            icon="folder_managed"
            opciones={opcionesExpediente}
            placeholder={placeholderExpediente}
            disabled={!clienteId || expedientes.isPending}
            error={errors.expedienteId?.message}
            {...register('expedienteId')}
          />
        </div>
        {expedientes.isError && (
          <EstadoError mensaje={MENSAJES_ERROR_API[expedientes.error.tipo]} onReintentar={() => void expedientes.refetch()} />
        )}
        <CampoTexto
          id="cobro-concepto"
          label={form.concept}
          icon="label"
          maxLength={120}
          placeholder={form.conceptPlaceholder}
          error={errors.concepto?.message}
          {...register('concepto')}
        />
        <CampoAreaTexto
          id="cobro-descripcion"
          label={form.description}
          icon="description"
          rows={4}
          maxLength={1000}
          longitud={descripcion.length}
          placeholder={form.descriptionPlaceholder}
          error={errors.descripcion?.message}
          {...register('descripcion')}
        />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <CampoTexto
            id="cobro-importe"
            label={form.amount}
            icon="payments"
            inputMode="decimal"
            placeholder={form.amountPlaceholder}
            className="tabular-nums"
            error={errors.importe?.message}
            {...register('importe')}
          />
          <CampoTexto id="cobro-fecha" type="date" label={form.date} icon="event" error={errors.fechaEmision?.message} {...register('fechaEmision')} />
          <CampoTexto
            id="cobro-fecha-limite"
            type="date"
            label={form.dueDate}
            labelHint={form.optional}
            icon="event_busy"
            min={fechaEmision || undefined}
            error={errors.fechaLimite?.message}
            {...register('fechaLimite')}
          />
        </div>
      </div>

      <aside className="xl:col-span-4 xl:sticky xl:top-24 flex flex-col gap-4" aria-labelledby="resumen-cobro">
        <div className="p-6 rounded-xl bg-surface-container-lowest shadow-sm flex flex-col gap-4">
          <h2 id="resumen-cobro" className="text-headline-sm text-on-surface">{summary.title}</h2>
          <dl className="flex flex-col gap-3">
            {filas.map((fila) => (
              <div key={fila.etiqueta} className="flex justify-between gap-4 text-body-md">
                <dt className="text-secondary">{fila.etiqueta}</dt>
                <dd className="text-on-surface text-right font-medium break-words min-w-0">{fila.valor}</dd>
              </div>
            ))}
          </dl>
          <div className="pt-4 border-t border-surface-container flex justify-between items-baseline gap-4">
            <span className="text-label-lg text-on-surface">{summary.amount}</span>
            <span className="text-headline-md text-primary tabular-nums" aria-live="polite">
              {esImporteValido(importe) ? formatearMonto(Number(importe)) : '—'}
            </span>
          </div>
          <p className="flex items-start gap-2 text-body-sm text-secondary">
            <Icon name="info" size={18} className="shrink-0 mt-0.5" />
            {summary.afterSend}
          </p>
        </div>

        {mensajeError && <EstadoError mensaje={mensajeError} />}

        <div className="flex flex-col gap-2">
          <button
            type="submit"
            disabled={crear.isPending}
            className="h-11 px-5 inline-flex items-center justify-center gap-2 rounded-lg bg-primary-container hover:bg-primary-hover text-on-primary-container hover:text-on-primary text-label-lg font-semibold shadow-sm transition-colors disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
          >
            <Icon name="send" size={18} />
            {crear.isPending ? actions.sending : actions.send}
          </button>
          <Link
            to={rutaCancelar}
            className="h-11 px-5 inline-flex items-center justify-center rounded-lg bg-surface-container text-on-surface text-label-lg font-semibold hover:bg-surface-container-high transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
          >
            {actions.cancel}
          </Link>
        </div>
      </aside>
    </form>
  )
}
